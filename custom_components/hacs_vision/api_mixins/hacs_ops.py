"""Mixin: all HACS data/operation/system endpoints except GitHub-specific ones."""
from __future__ import annotations

import asyncio
import json
import logging
import time

import aiohttp
from aiohttp import web

from ..const import VERSION
from ..entity_ref_finder import EntityRefFinder
from ..response import _error, _ok, _not_found, _bad_request, _unauthorized, _rate_limited, _server_error, _upstream_error


def _int_param(val, default: int, lo: int | None = None, hi: int | None = None) -> int:
    """Safely convert a query parameter to int with bounds."""
    try:
        v = int(val)
    except (TypeError, ValueError):
        return default
    if lo is not None and v < lo:
        return lo
    if hi is not None and v > hi:
        return hi
    return v

_LOGGER = logging.getLogger(__name__)

# Server-side caches (shared state for README, download counts, star counts)
_README_CACHE: dict[str, dict] = {}
_README_CACHE_TTL = 3600
_README_CACHE_MAX = 200
_DOWNLOAD_CACHE: dict[str, dict] = {}
_DOWNLOAD_CACHE_TTL = 7200
_DOWNLOAD_CACHE_MAX = 500
_STAR_CACHE: dict[str, dict] = {}
_STAR_CACHE_TTL = 21600
_STAR_CACHE_MAX = 500


def _cache_put(cache: dict, key: str, value: dict, max_size: int) -> None:
    """Put into cache with size limit — evict oldest entry if full."""
    if len(cache) >= max_size:
        try:
            oldest = min(cache, key=lambda k: cache[k].get("timestamp", 0))
            del cache[oldest]
        except (ValueError, KeyError):
            cache.clear()
    cache[key] = value


class HACSOpsMixin:
    """HACS operations, data queries, config flow proxy, and system endpoints."""

    # ── Session ─────────────────────────────────────────

    async def _get_session(self) -> aiohttp.ClientSession:
        """Get HA's shared aiohttp session (reuses connection pool)."""
        from homeassistant.helpers.aiohttp_client import async_get_clientsession
        return async_get_clientsession(self.hass)

    async def async_close(self) -> None:
        """No-op: shared session is managed by HA."""

    # ── Repositories (list, get, installed, stats) ───────

    async def _enrich_star_counts(self, repos: list[dict]) -> None:
        """Batch refresh stargazers_count from GitHub API for installed repos."""
        token = await self._get_active_github_token()
        if not token:
            return
        session = await self._get_session()
        now = time.monotonic()

        need_fetch = []
        for r in repos:
            fn = r.get("full_name", "")
            if not fn or "/" not in fn:
                continue
            cached = _STAR_CACHE.get(fn)
            if cached and (now - cached["timestamp"]) < _STAR_CACHE_TTL:
                r["stargazers_count"] = cached["stars"]
                continue
            need_fetch.append(fn)

        if not need_fetch:
            return

        sem = asyncio.Semaphore(3)

        async def _fetch_one(full_name: str) -> tuple[str, int]:
            url = f"https://api.github.com/repos/{full_name}"
            async with sem:
                try:
                    async with session.get(
                        url,
                        headers={"Authorization": f"token {token}",
                                 "Accept": "application/vnd.github.v3+json"},
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            stars = data.get("stargazers_count", 0)
                            _cache_put(_STAR_CACHE, full_name,
                                       {"stars": stars, "timestamp": now}, _STAR_CACHE_MAX)
                            return full_name, stars
                except Exception:
                    pass
                _cache_put(_STAR_CACHE, full_name,
                           {"stars": 0, "timestamp": now}, _STAR_CACHE_MAX)
                return full_name, 0

        tasks = [_fetch_one(fn) for fn in need_fetch]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        result_map = {}
        for res in results:
            if isinstance(res, tuple):
                result_map[res[0]] = res[1]

        applied = 0
        for r in repos:
            fn = r.get("full_name", "")
            if fn in result_map and result_map[fn]:
                r["stargazers_count"] = result_map[fn]
                applied += 1

        if applied:
            _LOGGER.debug("Enriched star counts for %d repos", applied)

    async def _enrich_download_counts(self, repos: list[dict]) -> None:
        """Enrich repos with GitHub release download counts where HACS data is 0."""
        now = time.monotonic()
        need_fetch = []
        for r in repos:
            if r.get("downloads", 0) > 0:
                continue
            fn = r.get("full_name", "")
            if not fn or "/" not in fn:
                continue
            cached = _DOWNLOAD_CACHE.get(fn)
            if cached and (now - cached["timestamp"]) < _DOWNLOAD_CACHE_TTL:
                if cached["count"]:
                    r["downloads"] = cached["count"]
                continue
            need_fetch.append(fn)

        if not need_fetch:
            return

        session = await self._get_session()
        sem = asyncio.Semaphore(5)

        async def _fetch_one(full_name: str) -> tuple[str, int]:
            url = f"https://api.github.com/repos/{full_name}/releases/latest"
            async with sem:
                try:
                    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            total = sum(
                                asset.get("download_count", 0)
                                for asset in data.get("assets", [])
                            )
                            _cache_put(_DOWNLOAD_CACHE, full_name,
                                       {"count": total, "timestamp": now}, _DOWNLOAD_CACHE_MAX)
                            return full_name, total
                except Exception:
                    pass
                _cache_put(_DOWNLOAD_CACHE, full_name,
                           {"count": 0, "timestamp": now}, _DOWNLOAD_CACHE_MAX)
                return full_name, 0

        tasks = [_fetch_one(fn) for fn in need_fetch]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        result_map = {}
        for res in results:
            if isinstance(res, tuple):
                result_map[res[0]] = res[1]

        for r in repos:
            fn = r.get("full_name", "")
            if fn in result_map and result_map[fn]:
                r["downloads"] = result_map[fn]

    async def _list_repositories(self, query) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        if not repos:
            repos = await self.data.get_all_repositories()

        # Cross-reference HA entities: clear has_update for skipped versions
        try:
            skipped_map = {}
            for state in self.hass.states.async_all():
                if not state.entity_id.startswith("update."):
                    continue
                skipped = state.attributes.get("skipped_version")
                if not skipped:
                    continue
                ru = (state.attributes.get("release_url", "") or "")
                if "github.com" not in ru.lower():
                    continue
                path = ru.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) >= 2:
                    skipped_map[f"{parts[0]}/{parts[1]}"] = skipped
            if skipped_map:
                for r in repos:
                    fn = r.get("full_name", "")
                    if fn in skipped_map:
                        r["has_update"] = False
        except Exception:
            pass

        install_times = await self.data.get_install_times()
        for r in repos:
            fn = r.get("full_name", "")
            if fn and fn in install_times:
                r["installed_at"] = install_times[fn]

        try:
            installed = [r for r in repos if r.get("installed")]
            if installed:
                await self._enrich_download_counts(installed)
        except Exception:
            pass

        try:
            installed = [r for r in repos if r.get("installed")]
            if installed:
                await self._enrich_star_counts(installed)
        except Exception:
            pass

        entry_map = {}
        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                entry_state = None
                try:
                    entry_state = str(entry.state) if hasattr(entry, 'state') else None
                except Exception:
                    pass
                if entry.domain not in entry_map:
                    entry_map[entry.domain] = []
                entry_map[entry.domain].append({
                    "entry_id": entry.entry_id,
                    "state": entry_state or "loaded",
                    "disabled_by": entry.disabled_by,
                })
        for r in repos:
            domain = r.get("domain", "")
            if domain and domain in entry_map:
                r["config_entry_id"] = entry_map[domain][0]["entry_id"]
                if entry_map[domain][0].get("state", "").lower() == "failed_setup":
                    r["load_failed"] = True
                if entry_map[domain][0].get("disabled_by"):
                    r["disabled_by"] = entry_map[domain][0]["disabled_by"]

        search = query.get("search", "").lower()
        category = query.get("category", "")
        status = query.get("status", "")
        tag = query.get("tag", "")
        sort = query.get("sort", "stars")
        sort_dir = query.get("sortDir", "desc")
        page = _int_param(query.get("page", 1), 1, lo=1)
        limit = _int_param(query.get("limit", 50), 50, lo=1, hi=200)

        if search:
            repos = [
                r for r in repos
                if search in (r.get("full_name") or "").lower()
                or search in (r.get("manifest_name") or "").lower()
                or search in (r.get("description") or "").lower()
                or search in (r.get("name") or "").lower()
                or search in " ".join(r.get("authors") or []).lower()
                or search in (r.get("category") or "").lower()
                or search in (r.get("domain") or "").lower()
            ]

        category_counts = {}
        for r in repos:
            cat = r.get("category", "unknown")
            category_counts[cat] = category_counts.get(cat, 0) + 1

        status_counts = {
            "installed": 0, "not_installed": 0,
            "update_available": 0, "pending_restart": 0,
        }
        for r in repos:
            if r.get("pending_restart"):
                status_counts["pending_restart"] += 1
            elif r.get("has_update"):
                status_counts["update_available"] += 1
            elif r.get("installed"):
                status_counts["installed"] += 1
            else:
                status_counts["not_installed"] += 1

        tag_counts = {
            "new": sum(1 for r in repos if r.get("new") or r.get("status") == "new"),
            "custom": sum(1 for r in repos if r.get("custom") or r.get("is_custom")),
        }

        if category:
            repos = [r for r in repos if r.get("category") == category]
        if status:
            if status == "installed":
                repos = [r for r in repos if r.get("installed")]
            elif status == "not_installed":
                repos = [r for r in repos if not r.get("installed")]
            elif status == "update_available":
                repos = [r for r in repos if r.get("has_update")]
            elif status == "pending_restart":
                repos = [r for r in repos if r.get("pending_restart")]

        if tag == "custom":
            repos = [r for r in repos if r.get("custom") or r.get("is_custom")]
        elif tag == "new":
            repos = [r for r in repos if r.get("new") or r.get("status") == "new"]
        elif tag == "favorites":
            favs = await self.data.get_favorites()
            fav_set = {str(f) for f in favs}
            repos = [r for r in repos if str(r.get("full_name", "")) in fav_set]
            tag_counts["favorites"] = len(fav_set)

        reverse = sort_dir == "desc"
        if sort in ("stars", "stargazers_count"):
            repos.sort(key=lambda r: r.get("stargazers_count", 0) or 0, reverse=reverse)
        elif sort in ("updated", "last_updated"):
            repos.sort(key=lambda r: r.get("last_updated", ""), reverse=reverse)
        elif sort == "name":
            repos.sort(key=lambda r: (r.get("manifest_name") or r.get("full_name") or "").lower(), reverse=not reverse)
        elif sort == "downloads":
            repos.sort(key=lambda r: r.get("downloads", 0) or 0, reverse=reverse)
        elif sort == "installed_version":
            repos.sort(key=lambda r: r.get("installed_version") or "", reverse=reverse)
        elif sort == "latest_version":
            repos.sort(key=lambda r: r.get("latest_version") or "", reverse=reverse)
        elif sort == "installed_at":
            repos.sort(key=lambda r: r.get("installed_at") or "", reverse=reverse)
        elif sort == "status":
            status_order = {"pending-restart": 0, "pending-upgrade": 1, "installed": 2, "new": 3, "default": 4}
            repos.sort(key=lambda r: status_order.get(r.get("status", "default"), 5), reverse=not reverse)
        else:
            repos.sort(key=lambda r: r.get("stargazers_count", 0) or 0, reverse=True)

        HACS_VISION_REPO = "C3H3-AI/hacs-vision"
        for i, r in enumerate(repos):
            if r.get("full_name", "").lower() == HACS_VISION_REPO.lower():
                repo = repos.pop(i)
                repos.insert(0, repo)
                break

        total = len(repos)
        start = (page - 1) * limit
        repos = repos[start : start + limit]

        return web.json_response({
            "repositories": repos, "total": total, "page": page, "limit": limit,
            "category_counts": category_counts,
            "status_counts": status_counts,
            "tag_counts": tag_counts,
        })

    async def _get_repository(self, repo_id: str) -> web.Response:
        repo = await self.data.get_repository(repo_id)
        if not repo:
            return _not_found()
        return web.json_response(repo)

    async def _list_installed(self) -> web.Response:
        installed = self.operator.get_installed_list()
        entry_map = {}
        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                entry_map.setdefault(entry.domain, []).append(entry.entry_id)
        for item in installed:
            domain = item.get("domain")
            if domain and domain in entry_map:
                item["config_entry_id"] = entry_map[domain][0]
        try:
            skipped_map = {}
            for state in self.hass.states.async_all():
                if not state.entity_id.startswith("update."):
                    continue
                skipped = state.attributes.get("skipped_version")
                if not skipped:
                    continue
                ru = (state.attributes.get("release_url", "") or "")
                if "github.com" not in ru.lower():
                    continue
                path = ru.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) >= 2:
                    skipped_map[f"{parts[0]}/{parts[1]}"] = skipped
            if skipped_map:
                for item in installed:
                    fn = item.get("full_name", "")
                    if fn in skipped_map:
                        item["has_update"] = False
        except Exception:
            pass
        return web.json_response({"installed": installed})

    async def _get_stats(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        if not repos:
            repos = await self.data.get_all_repositories()
        config = await self.data.get_config()
        ignored_set = set(config.get("ignored_repositories", []))
        pending_restart_set = set()
        for r in repos:
            if r.get("pending_restart"):
                fn = r.get("full_name") or str(r.get("id", ""))
                pending_restart_set.add(fn)
        installed_count = sum(1 for r in repos if r.get("installed"))
        updates_count = 0
        try:
            for state in self.hass.states.async_all():
                eid = state.entity_id
                if not eid.startswith("update."):
                    continue
                if state.state != "on":
                    continue
                release_url = (state.attributes.get("release_url", "") or "")
                if "github.com" not in release_url.lower():
                    continue
                path = release_url.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) >= 2:
                    full_name = f"{parts[0]}/{parts[1]}"
                    if full_name not in ignored_set and full_name not in pending_restart_set:
                        updates_count += 1
        except Exception:
            pass
        new_count = sum(1 for r in repos if r.get("new") or r.get("status") == "new")
        pending_restart_count = sum(1 for r in repos if r.get("pending_restart"))
        custom_count = sum(1 for r in repos if r.get("custom") or r.get("is_custom"))
        entry_domains = {}
        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                try:
                    entry_state = str(entry.state) if hasattr(entry, 'state') else "loaded"
                except Exception:
                    entry_state = "loaded"
                entry_domains[entry.domain] = entry_state
        load_failed_count = 0
        for r in repos:
            domain = r.get("domain", "")
            if domain and domain in entry_domains and entry_domains[domain].lower() == "failed_setup":
                load_failed_count += 1
        return web.json_response({
            "total_repos": len(repos),
            "total_installed": installed_count,
            "available_updates": updates_count,
            "new_repos": new_count,
            "pending_restart": pending_restart_count,
            "custom_count": custom_count,
            "load_failed": load_failed_count,
        })

    async def _get_updates(self) -> web.Response:
        updates = await self.operator.get_updates_from_ha_entities()
        if not updates:
            hacs_updates = await self.operator.get_available_updates()
            if hacs_updates:
                skipped_or_pending = set()
                try:
                    for state in self.hass.states.async_all():
                        if not state.entity_id.startswith("update."):
                            continue
                        ru = (state.attributes.get("release_url", "") or "")
                        if "github.com" not in ru.lower():
                            continue
                        path = ru.replace("https://github.com/", "").replace("http://github.com/", "")
                        parts = path.split("/")
                        if len(parts) < 2:
                            continue
                        fn = f"{parts[0]}/{parts[1]}"
                        if state.state != "on":
                            skipped_or_pending.add(fn)
                except Exception:
                    pass
                updates = [u for u in hacs_updates if (u.get("full_name") or "") not in skipped_or_pending]
        return web.json_response({"updates": updates})

    async def _get_config(self) -> web.Response:
        config = await self.data.get_config()
        return web.json_response(config)

    async def _get_custom_repos(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        custom = [r for r in repos if r.get("custom") or r.get("is_custom")]
        try:
            skipped_set = set()
            for state in self.hass.states.async_all():
                if not state.entity_id.startswith("update."):
                    continue
                skipped = state.attributes.get("skipped_version")
                if not skipped:
                    continue
                ru = (state.attributes.get("release_url", "") or "")
                if "github.com" not in ru.lower():
                    continue
                path = ru.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) >= 2:
                    skipped_set.add(f"{parts[0]}/{parts[1]}")
            if skipped_set:
                for r in custom:
                    if r.get("full_name", "") in skipped_set:
                        r["has_update"] = False
        except Exception:
            pass
        try:
            if custom:
                await self._enrich_star_counts(custom)
        except Exception:
            pass
        return web.json_response({"custom_repositories": custom})

    async def _export_backup(self) -> web.Response:
        data = await self.backup.export()
        return web.json_response(data)

    async def _check_dependencies(self) -> web.Response:
        results = await self.checker.check_all()
        return web.json_response(results)

    async def _refresh(self) -> web.Response:
        result = await self.operator.refresh_repositories()
        if not result.get("success"):
            return web.json_response(result, status=500)
        return web.json_response(result)

    # ── README / Changelog / Releases ───────────────────

    async def _get_readme(self, full_name: str) -> web.Response:
        cached = _README_CACHE.get(full_name)
        if cached and (time.monotonic() - cached["timestamp"] < _README_CACHE_TTL):
            return web.Response(text=cached["html"], content_type="text/html")

        session = await self._get_session()
        url = f"https://api.github.com/repos/{full_name}/readme"
        headers = {"Accept": "application/vnd.github.v3.html"}
        token = await self._get_vision_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            async with session.get(url, headers=headers) as resp:
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining is not None and int(remaining) <= 0:
                    reset_time = resp.headers.get("X-RateLimit-Reset", "0")
                    _LOGGER.warning("GitHub API rate limit exceeded, resets at %s", reset_time)
                    return _rate_limited(reset_at=reset_time)
                if resp.status == 200:
                    content = await resp.text()
                    _cache_put(_README_CACHE, full_name,
                               {"html": content, "timestamp": time.monotonic()}, _README_CACHE_MAX)
                    return web.Response(text=content, content_type="text/html")
                elif resp.status == 404:
                    return _not_found()
                elif resp.status == 403:
                    return _rate_limited()
                else:
                    return _upstream_error(f"github_api_{resp.status}")
        except (aiohttp.ClientError, TimeoutError, OSError) as e:
            _LOGGER.error("README proxy network error: %s", e)
            return _upstream_error("network_error")
        except Exception as e:
            _LOGGER.error("README proxy unexpected error: %s", e, exc_info=True)
            return _upstream_error("operation_failed")

    async def _get_changelog(self, full_name: str, query) -> web.Response:
        session = await self._get_session()
        tag = query.get("tag", "")
        if tag:
            url = f"https://api.github.com/repos/{full_name}/releases/tags/{tag}"
        else:
            url = f"https://api.github.com/repos/{full_name}/releases/latest"
        headers = {"Accept": "application/vnd.github.v3+json"}
        token = await self._get_vision_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            async with session.get(url, headers=headers) as resp:
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining is not None and int(remaining) <= 0:
                    return _rate_limited()
                if resp.status == 200:
                    data = await resp.json()
                    body = data.get("body", "")
                    return web.json_response({
                        "tag": data.get("tag_name", ""),
                        "name": data.get("name", ""),
                        "body": body[:10000] if body else "",
                        "url": data.get("html_url", f"https://github.com/{full_name}/releases"),
                    })
                elif resp.status == 404:
                    return web.json_response({"tag": tag or "", "body": "", "not_found": True})
                else:
                    return _upstream_error(f"github_api_{resp.status}")
        except (aiohttp.ClientError, TimeoutError, OSError) as e:
            _LOGGER.error("Changelog proxy network error: %s", e)
            return _upstream_error("network_error")

    async def _get_repo_releases(self, query) -> web.Response:
        repo_id = query.get("id", "")
        if not repo_id:
            return _bad_request("id required")
        releases = await self.operator.get_repo_releases(repo_id)
        if len(releases) < 3:
            repo = self.operator._find_repo(repo_id)
            if repo and repo.data.full_name:
                try:
                    session = await self._get_session()
                    url = f"https://api.github.com/repos/{repo.data.full_name}/releases?per_page=20"
                    gh_headers = {"Accept": "application/vnd.github.v3+json"}
                    token = await self._get_vision_github_token()
                    if token:
                        gh_headers["Authorization"] = f"token {token}"
                    async with session.get(url, headers=gh_headers) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            seen_tags = {r["tag_name"] for r in releases}
                            for release in data:
                                tag = release.get("tag_name", "")
                                if tag not in seen_tags:
                                    releases.append({
                                        "tag_name": tag,
                                        "name": release.get("name", ""),
                                        "prerelease": release.get("prerelease", False),
                                        "published_at": release.get("published_at", ""),
                                    })
                                    seen_tags.add(tag)
                            releases.sort(key=lambda r: r.get("published_at", ""), reverse=True)
                except Exception as e:
                    _LOGGER.warning("GitHub releases fetch failed for %s: %s", repo.data.full_name, e)
        return web.json_response({"releases": releases})

    async def _get_repo_rt_status(self, repo_id: str) -> web.Response:
        status = self.operator.get_repo_rt_status(repo_id)
        if not status:
            return _not_found()
        return web.json_response(status)

    # ── Write operations ─────────────────────────────────

    async def _install(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        category = body.get("category", "integration")
        VALID_CATEGORIES = {"integration", "plugin", "python_script", "theme", "appdaemon", "netdaemon", "template"}
        if category not in VALID_CATEGORIES:
            return _bad_request(f"invalid_category: {category}")
        result = await self.operator.install_repository(repo, category)
        if result.get("success"):
            from datetime import datetime, timezone
            full_name = result.get("repository") or repo
            await self.data.set_install_time(full_name, datetime.now(timezone.utc).isoformat())
        return web.json_response(result)

    async def _update(self, body: dict) -> web.Response:
        repo_ids = body.get("repository_ids", [])
        result = await self.operator.update_repositories(repo_ids)
        return web.json_response(result)

    async def _remove(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        result = await self.operator.remove_repository(repo)
        if result.get("success"):
            full_name = result.get("repository") or repo
            await self.data.remove_install_time(full_name)
        return web.json_response(result)

    async def _redownload(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        category = body.get("category", "integration")
        remove_result = await self.operator.remove_repository(repo)
        if not remove_result.get("success"):
            return web.json_response(remove_result)
        full_name = remove_result.get("repository") or repo
        await self.data.remove_install_time(full_name)
        install_result = await self.operator.install_repository(full_name, category)
        if install_result.get("success"):
            from datetime import datetime, timezone
            await self.data.set_install_time(full_name, datetime.now(timezone.utc).isoformat())
        return web.json_response(install_result)

    async def _ignore_repo(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        if not repo:
            return _bad_request("repository required")
        config = await self.data.get_config()
        ignored = config.get("ignored_repositories", [])
        if repo not in ignored:
            ignored.append(repo)
            config["ignored_repositories"] = ignored
            await self.data.update_config(config)
        return web.json_response({"success": True, "repository": repo})

    async def _unignore_repo(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        if not repo:
            return _bad_request("repository required")
        config = await self.data.get_config()
        ignored = config.get("ignored_repositories", [])
        if repo in ignored:
            ignored.remove(repo)
            config["ignored_repositories"] = ignored
            await self.data.update_config(config)
        return web.json_response({"success": True, "repository": repo})

    async def _ignore_version(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        version = body.get("version", "")
        if not repo or not version:
            return _bad_request("repository and version required")
        data = await self.data.read_storage("ignored_versions")
        if not data:
            data = {"data": {}}
        ignored = data.get("data", {})
        ignored[repo] = version
        data["data"] = ignored
        await self.data.write_storage("ignored_versions", data)
        await self._call_update_service("skip", repo)
        return web.json_response({"success": True, "repository": repo, "version": version})

    async def _unignore_version(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        if not repo:
            return _bad_request("repository required")
        data = await self.data.read_storage("ignored_versions")
        if data and repo in data.get("data", {}):
            del data["data"][repo]
            await self.data.write_storage("ignored_versions", data)
        await self._call_update_service("clear_skipped", repo)
        return web.json_response({"success": True, "repository": repo})

    async def _call_update_service(self, action: str, repo_full_name: str):
        repo_url_prefix = f"https://github.com/{repo_full_name}"
        target_entity = None
        for state in self.hass.states.async_all():
            if not state.entity_id.startswith("update."):
                continue
            release_url = (state.attributes.get("release_url", "") or "")
            if release_url.startswith(repo_url_prefix):
                target_entity = state.entity_id
                break
        if not target_entity:
            return
        try:
            await self.hass.services.async_call(
                "update", action,
                {"entity_id": target_entity},
                blocking=True
            )
        except Exception:
            pass

    async def _get_ignored_versions(self) -> web.Response:
        data = await self.data.read_storage("ignored_versions")
        return web.json_response(data.get("data", {}) if data else {})

    async def _get_skipped_versions(self) -> web.Response:
        skipped = []
        try:
            for state in self.hass.states.async_all():
                if not state.entity_id.startswith("update."):
                    continue
                skipped_version = state.attributes.get("skipped_version")
                if not skipped_version:
                    continue
                release_url = (state.attributes.get("release_url", "") or "")
                if "github.com" not in release_url.lower():
                    continue
                path = release_url.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) < 2:
                    continue
                full_name = f"{parts[0]}/{parts[1]}"
                skipped.append({
                    "full_name": full_name,
                    "skipped_version": skipped_version,
                    "latest_version": state.attributes.get("latest_version"),
                    "installed_version": state.attributes.get("installed_version"),
                })
        except (AttributeError, TypeError) as e:
            _LOGGER.error("_get_skipped_versions error: %s", e, exc_info=True)
        return web.json_response({"skipped": skipped})

    # Allowed config keys to prevent arbitrary overwrite
    _ALLOWED_CONFIG_KEYS = {
        "custom_repositories", "ignored_repositories", "archived_repositories",
        "renamed_repositories",
    }

    async def _update_config(self, body: dict) -> web.Response:
        # Only allow whitelisted keys to prevent config injection
        filtered = {k: v for k, v in body.items() if k in self._ALLOWED_CONFIG_KEYS}
        if not filtered:
            return _bad_request("no allowed keys in body")
        result = await self.data.update_config(filtered)
        return web.json_response({"success": result})

    async def _add_custom_repo(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        category = body.get("category", "integration")
        result = await self.operator.add_custom_repository(repo, category)
        return web.json_response(result)

    async def _remove_custom_repo(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        result = await self.operator.remove_custom_repository(repo)
        return web.json_response(result)

    async def _install_repo_version(self, body: dict) -> web.Response:
        repo_id = body.get("id", "")
        version = body.get("version")
        if not repo_id:
            return _bad_request("id required")
        result = await self.operator.install_repository_version(repo_id, version)
        if result.get("success"):
            self.operator.invalidate_index()
            from datetime import datetime, timezone
            full_name = result.get("repository") or repo_id
            await self.data.set_install_time(full_name, datetime.now(timezone.utc).isoformat())
        return web.json_response(result)

    async def _import_backup(self, body: dict) -> web.Response:
        result = await self.backup.import_data(body)
        return web.json_response(result)

    # ── Favorites ────────────────────────────────────────

    async def _get_favorites(self) -> web.Response:
        favorites = await self.data.get_favorites()
        return web.json_response({"favorites": favorites})

    async def _set_favorites(self, body: dict) -> web.Response:
        favorites = body.get("favorites", [])
        ok = await self.data.set_favorites(favorites)
        return web.json_response({"success": ok, "favorites": favorites})

    # ── Management ───────────────────────────────────────

    async def _purge_from_repos_storage(self, repo_name: str) -> list[str]:
        repos_data = await self.data.read_storage("repositories")
        purged_ids = []
        if repos_data and "data" in repos_data:
            to_delete = [
                rid for rid, info in repos_data["data"].items()
                if info.get("full_name") == repo_name
            ]
            for rid in to_delete:
                del repos_data["data"][rid]
                purged_ids.append(rid)
            if to_delete:
                await self.data.write_storage("repositories", repos_data)
        return purged_ids

    async def _purge_from_data_storage(self, repo_name: str) -> bool:
        hacs_data = await self.data.read_storage("data")
        if not hacs_data or "data" not in hacs_data:
            return False
        cat_dict = hacs_data["data"].get("repositories", {})
        changed = False
        for cat, repos_list in cat_dict.items():
            if isinstance(repos_list, list):
                filtered = [r for r in repos_list if r != repo_name]
                if len(filtered) != len(repos_list):
                    cat_dict[cat] = filtered
                    changed = True
        if changed:
            await self.data.write_storage("data", hacs_data)
        return changed

    async def _remove_archived(self, body: dict) -> web.Response:
        repo_name = body.get("repository", "")
        if not repo_name:
            return _bad_request("repository required")
        config = await self.data.get_config()
        archived = config.get("archived_repositories", [])
        if repo_name in archived:
            archived.remove(repo_name)
            config["archived_repositories"] = archived
            await self.data.update_config(config)
        if self.operator and self.operator.available:
            try:
                hacs_config = self.operator._hacs.configuration
                if hasattr(hacs_config, 'archived_repositories'):
                    hacs_archived = list(hacs_config.archived_repositories or [])
                    if repo_name in hacs_archived:
                        hacs_archived.remove(repo_name)
                        hacs_config.archived_repositories = hacs_archived
                await self.operator._hacs.data.async_write()
            except Exception as e:
                _LOGGER.warning("Failed to update HACS memory state: %s", e, exc_info=True)
        purged_ids = await self._purge_from_repos_storage(repo_name)
        await self._purge_from_data_storage(repo_name)
        await self.operator.remove_repository(repo_name)
        self.operator.invalidate_index()
        return web.json_response({
            "success": True, "repository": repo_name, "purged_ids": purged_ids,
        })

    async def _replace_renamed(self, body: dict) -> web.Response:
        old_name = body.get("old_name", "")
        new_name = body.get("new_name", "")
        if not old_name or not new_name:
            return _bad_request("old_name and new_name required")
        category = "integration"
        repos_data = await self.data.read_storage("repositories")
        if repos_data and "data" in repos_data:
            for info in repos_data["data"].values():
                if info.get("full_name") == old_name:
                    category = info.get("category", "integration")
                    break
        config = await self.data.get_config()
        renamed = config.get("renamed_repositories", {})
        if old_name in renamed:
            del renamed[old_name]
            config["renamed_repositories"] = renamed
            await self.data.update_config(config)
        await self.operator.remove_repository(old_name)
        await self._purge_from_repos_storage(old_name)
        await self._purge_from_data_storage(old_name)
        install_result = await self.operator.install_repository(new_name, category)
        if install_result.get("success"):
            from datetime import datetime, timezone
            await self.data.set_install_time(new_name, datetime.now(timezone.utc).isoformat())
        self.operator.invalidate_index()
        return web.json_response({
            "success": install_result.get("success", False),
            "repository": new_name,
            "install_result": install_result,
            "category": category,
        })

    async def _remove_renamed_entry(self, body: dict) -> web.Response:
        old_name = body.get("old_name", "")
        if not old_name:
            return _bad_request("old_name required")
        config = await self.data.get_config()
        renamed = config.get("renamed_repositories", {})
        if old_name in renamed:
            del renamed[old_name]
            config["renamed_repositories"] = renamed
            await self.data.update_config(config)
        purged_ids = await self._purge_from_repos_storage(old_name)
        await self._purge_from_data_storage(old_name)
        await self.operator.remove_repository(old_name)
        self.operator.invalidate_index()
        return web.json_response({
            "success": True, "repository": old_name, "purged_ids": purged_ids,
        })

    # ── Settings + Devices + Translations ───────────────

    async def _get_settings(self) -> web.Response:
        settings = await self.data.get_settings()
        return web.json_response(settings)

    # Allowed settings keys to prevent injection
    _ALLOWED_SETTINGS_KEYS = {
        "hide_hacs_panel", "default_view", "refresh_interval",
        "auto_update_enabled", "auto_update_repos", "auto_update_interval",
        "auto_update_notify", "auto_update_restart_time", "language",
        "translation_agent", "translation_langs",
    }

    async def _update_settings(self, body: dict) -> web.Response:
        # Only allow whitelisted keys
        filtered = {k: v for k, v in body.items() if k in self._ALLOWED_SETTINGS_KEYS}
        if "hide_hacs_panel" in body:
            hide = body["hide_hacs_panel"]
            try:
                from homeassistant.components.frontend import (
                    async_remove_panel,
                    async_register_built_in_panel,
                )
                if hide:
                    async_remove_panel(self.hass, "hacs")
                else:
                    async_register_built_in_panel(
                        self.hass,
                        component_name="custom",
                        sidebar_title="HACS",
                        sidebar_icon="hacs:hacs",
                        frontend_url_path="hacs",
                        config={
                            "_panel_custom": {
                                "name": "hacs-frontend",
                                "embed_iframe": True,
                                "trust_external": False,
                                "js_url": "/hacsfiles/frontend/entrypoint.js",
                            }
                        },
                        require_admin=True,
                    )
            except Exception as exc:
                _LOGGER.warning("Failed to toggle HACS panel: %s", exc)
        # Merge with existing settings instead of replacing — partial updates
        # from browse.js/updates.js (e.g. {auto_update_repos: [...]}) must not
        # discard unrelated settings like hide_hacs_panel
        existing = await self.data.get_settings()
        merged = {**existing, **filtered}
        ok = await self.data.set_settings(merged)
        return web.json_response({"success": ok})

    async def _get_devices(self, entry_id: str) -> web.Response:
        try:
            from homeassistant.helpers import device_registry as dr, entity_registry as er
            import json
            device_reg = dr.async_get(self.hass)
            entity_reg = er.async_get(self.hass)
            devices = []
            orphan_entities = []
            seen_entity_ids = set()

            def _entity_to_dict(entity_entry):
                state = self.hass.states.get(entity_entry.entity_id)
                seen_entity_ids.add(entity_entry.entity_id)
                return {
                    "entity_id": entity_entry.entity_id,
                    "name": entity_entry.name or entity_entry.original_name,
                    "state": state.state if state else None,
                    "icon": entity_entry.icon or entity_entry.original_icon,
                    "unit": entity_entry.unit_of_measurement,
                    "domain": entity_entry.domain,
                    "disabled": entity_entry.disabled_by is not None,
                }

            device_entities: dict[str, list] = {}
            for entity_entry in entity_reg.entities.values():
                did = entity_entry.device_id
                if did:
                    device_entities.setdefault(did, []).append(entity_entry)
                if entity_entry.config_entry_id == entry_id:
                    seen_entity_ids.add(entity_entry.entity_id)

            for device in device_reg.devices.values():
                if entry_id not in device.config_entries:
                    continue
                entities = [_entity_to_dict(e) for e in device_entities.get(device.id, [])]
                entities.sort(key=lambda e: (e["disabled"], e["entity_id"]))

                area_name = None
                if device.area_id:
                    try:
                        from homeassistant.helpers import area_registry as ar
                        area_reg = ar.async_get(self.hass)
                        area = area_reg.async_get_area(device.area_id)
                        if area:
                            area_name = area.name
                    except Exception:
                        pass

                devices.append({
                    "id": device.id,
                    "name": device.name_by_user or device.name,
                    "model": device.model,
                    "manufacturer": device.manufacturer,
                    "sw_version": device.sw_version,
                    "hw_version": device.hw_version,
                    "area": area_name,
                    "entities": entities,
                })

            for entity_entry in entity_reg.entities.values():
                if entity_entry.entity_id in seen_entity_ids:
                    continue
                if entity_entry.config_entry_id != entry_id:
                    continue
                orphan_entities.append(_entity_to_dict(entity_entry))
            orphan_entities.sort(key=lambda e: (e["disabled"], e["entity_id"]))

            groups = {}
            for dev in devices:
                area = dev.pop("area") or "Other"
                groups.setdefault(area, []).append(dev)

            sorted_groups = sorted(groups.items(), key=lambda x: (x[0] == "Other", x[0] or ""))
            result_groups = [{"area": area, "devices": devs} for area, devs in sorted_groups]
            if orphan_entities:
                result_groups.append({"area": "Unassigned", "devices": [{
                    "id": "_orphan", "name": "Entities without device",
                    "model": None, "manufacturer": None,
                    "sw_version": None, "hw_version": None,
                    "entities": orphan_entities,
                }]})

            return web.json_response({"groups": result_groups})
        except Exception as e:
            _LOGGER.error("Failed to get devices: %s", e, exc_info=True)
            return _server_error()

    async def _get_config_entries(self) -> web.Response:
        mapping = await self.data.get_config_entries_map(force_refresh=True)
        return web.json_response({"entries": mapping})

    async def _get_device_counts(self, domain: str | None = None) -> web.Response:
        from homeassistant.helpers import device_registry as dr, entity_registry as er
        import re
        if domain is not None:
            if not re.match(r'^[a-zA-Z0-9_-]+$', domain):
                return _bad_request("invalid_domain")
        try:
            dev_reg = dr.async_get(self.hass)
            ent_reg = er.async_get(self.hass)
            if domain:
                safe = domain
                device_ids = set()
                entity_count = 0
                for entry in self.hass.config_entries.async_entries():
                    if entry.domain != safe:
                        continue
                    for device in dev_reg.devices.values():
                        if entry.entry_id in device.config_entries:
                            device_ids.add(device.id)
                            entity_count += len([
                                e for e in ent_reg.entities.values()
                                if e.device_id == device.id and not e.disabled_by
                            ])
                return web.json_response({
                    "domain": safe, "devices": len(device_ids), "entities": entity_count,
                })
            else:
                domain_counts = {}
                for entry in self.hass.config_entries.async_entries():
                    d = entry.domain
                    if d not in domain_counts:
                        domain_counts[d] = {"devices": set(), "entities": 0}
                for device in dev_reg.devices.values():
                    for eid in device.config_entries:
                        for entry in self.hass.config_entries.async_entries():
                            if entry.entry_id == eid and entry.domain in domain_counts:
                                domain_counts[entry.domain]["devices"].add(device.id)
                                domain_counts[entry.domain]["entities"] += len([
                                    e for e in ent_reg.entities.values()
                                    if e.device_id == device.id and not e.disabled_by
                                ])
                result = {
                    d: {"devices": len(c["devices"]), "entities": c["entities"]}
                    for d, c in domain_counts.items()
                }
                return web.json_response(result)
        except Exception as e:
            _LOGGER.error("Failed to get device counts for %s: %s", domain or "all", e, exc_info=True)
            return _server_error()

    async def _get_translations(self, domain: str, lang: str) -> web.Response:
        import os
        import re
        if not re.match(r'^[a-zA-Z0-9_-]+$', domain):
            return _bad_request("invalid_domain")
        # Sanitize lang to prevent path traversal
        if lang and not re.match(r'^[a-z]{2}(-[a-zA-Z]{2,10})?$', lang):
            lang = "en"
        safe_domain = domain
        lang_files = []
        if lang and lang != "en":
            lang_files.append(f"{lang}.json")
        lang_files.append("en.json")
        for lang_file in lang_files:
            trans_path = self.hass.config.path(
                "custom_components", safe_domain, "translations", lang_file
            )
            if await self.hass.async_add_executor_job(os.path.isfile, trans_path):
                try:
                    data = await self.hass.async_add_executor_job(
                        _read_json_text, trans_path
                    )
                    if data is not None:
                        return web.json_response({
                            "data": data, "domain": safe_domain,
                            "lang": lang_file.replace(".json", ""),
                        })
                except (json.JSONDecodeError, OSError) as e:
                    _LOGGER.warning("Failed to read translations for %s: %s", safe_domain, e)
                    continue
        return web.json_response({"data": {}, "domain": safe_domain, "lang": lang, "error": "not_found"}, status=404)

    # ── Batch operations ─────────────────────────────────

    async def _batch_install(self, body: dict) -> web.Response:
        repos = body.get("repositories", [])
        results = []
        for item in repos:
            repo_name = item.get("repository", "")
            category = item.get("category", "integration")
            if not repo_name:
                continue
            try:
                result = await self.operator.install_repository(repo_name, category)
                if result.get("success"):
                    from datetime import datetime, timezone
                    await self.data.set_install_time(repo_name, datetime.now(timezone.utc).isoformat())
                results.append({"repository": repo_name, "result": result})
            except Exception as e:
                results.append({"repository": repo_name, "result": {"success": False, "error": "operation_failed"}})
        return web.json_response({"success": True, "results": results})

    async def _batch_remove(self, body: dict) -> web.Response:
        repos = body.get("repositories", [])
        results = []
        for repo_name in repos:
            if not repo_name:
                continue
            try:
                result = await self.operator.remove_repository(repo_name)
                if result.get("success"):
                    await self.data.remove_install_time(repo_name)
                results.append({"repository": repo_name, "result": result})
            except Exception as e:
                results.append({"repository": repo_name, "result": {"success": False, "error": "operation_failed"}})
        self.operator.invalidate_index()
        return web.json_response({"success": True, "results": results})

    async def _check_updates_with_notification(self) -> web.Response:
        try:
            refresh_result = await self.operator.refresh_repositories()
            if not refresh_result.get("success"):
                _LOGGER.warning("GitHub refresh rate-limited during check, falling back to cached data: %s",
                                refresh_result.get("error", "unknown"))
            self.operator.invalidate_index()
            repos = await self.operator.get_all_repos_from_hacs()
            updatable = [r for r in repos if r.get("has_update")]
            pending_restart = [r for r in repos if r.get("pending_restart")]
            if updatable:
                names = "\n".join(f"- **{r.get('manifest_name') or r.get('name', r.get('full_name', '?'))}**: {r.get('installed_version', '?')} → {r.get('latest_version', '?')}" for r in updatable[:10])
                title = f"HACS Vision: {len(updatable)} repos updatable"
                message = f"Found **{len(updatable)}** repos with updates available:\n{names}"
                if len(updatable) > 10:
                    message += f"\n...and {len(updatable) - 10} more"
                await self.data.send_persistent_notification(title, message)
            if pending_restart:
                names = ", ".join(r.get('manifest_name') or r.get('full_name', '?') for r in pending_restart)
                await self.data.send_persistent_notification(
                    f"HACS Vision: {len(pending_restart)} repos need restart",
                    f"The following repos require HA restart after update: {names}"
                )
            return web.json_response({
                "success": True, "updates_found": len(updatable),
                "pending_restart": len(pending_restart), "notified": True,
            })
        except Exception as e:
            _LOGGER.error("Check updates+notify failed: %s", e, exc_info=True)
            return _server_error()

    # ── Entity Reference Finder ─────────────────────────

    async def _entity_refs_find(self, query) -> web.Response:
        entity_id = query.get("q", "")
        if not entity_id:
            return _bad_request("q (entity_id) required")
        try:
            finder = EntityRefFinder(self.hass)
            refs = await finder.find(entity_id)
            by_type: dict[str, list] = {}
            for r in refs:
                by_type.setdefault(r["source_type"], []).append(r)
            return web.json_response({
                "entity_id": entity_id, "total": len(refs),
                "affected_sources": len({(r["source_type"], r["source_id"]) for r in refs}),
                "by_type": by_type, "references": refs,
            })
        except Exception as e:
            _LOGGER.error("Entity refs find failed: %s", e, exc_info=True)
            return _server_error()

    async def _entity_refs_replace(self, body: dict, request: web.Request | None = None) -> web.Response:
        old_id = body.get("old_id", "")
        new_id = body.get("new_id", "")
        preview = body.get("preview", True)
        if not old_id or not new_id:
            return _bad_request("old_id and new_id required")
        try:
            token = self._extract_token(request) if request else self._current_token
            finder = EntityRefFinder(self.hass, hass_token=token)
            result = await finder.replace(old_id, new_id, preview=preview)
            if not preview and result.get("total_updated", 0) > 0:
                reload_result = await finder.reload_affected()
                result["reload"] = reload_result
            return web.json_response(result)
        except Exception as e:
            _LOGGER.error("Entity refs replace failed: %s", e, exc_info=True)
            return _server_error()

    async def _entity_refs_reload(self) -> web.Response:
        try:
            finder = EntityRefFinder(self.hass)
            result = await finder.reload_affected()
            return web.json_response(result)
        except Exception as e:
            _LOGGER.error("Entity refs reload failed: %s", e, exc_info=True)
            return _server_error()

    # ── Restart / Reload ─────────────────────────────────

    async def _restart(self) -> web.Response:
        try:
            await self.hass.services.async_call("homeassistant", "restart", blocking=False)
            return web.json_response({"success": True})
        except Exception as e:
            _LOGGER.error("Restart failed: %s", e, exc_info=True)
            return _server_error()

    async def _reload_core(self) -> web.Response:
        try:
            await self.hass.services.async_call("homeassistant", "reload_core_config", blocking=True)
            return web.json_response({"success": True})
        except Exception as e:
            _LOGGER.error("Core reload failed: %s", e, exc_info=True)
            return _server_error()

    # ── Config Flow proxy ────────────────────────────────

    def _extract_token(self, request: web.Request) -> str:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            return auth[7:]
        return ""

    async def _config_flow_handlers(self, request: web.Request) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow_handlers"
            headers = {"Authorization": f"Bearer {token}"}
            async with session.get(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow handlers error: %s", e, exc_info=True)
            return _server_error()

    async def _config_flow_start(self, request: web.Request, body: dict) -> web.Response:
        handler = body.get("handler")
        if not handler:
            return _bad_request("handler required")
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            for key in ("source", "entry_id", "show_advanced_options"):
                if key in body:
                    payload[key] = body[key]
            if "show_advanced_options" not in payload:
                payload["show_advanced_options"] = False
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow start error for %s: %s", handler, e, exc_info=True)
            return _error(f"flow_start_error: {e}", 500)

    async def _config_flow_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow step error %s: %s", flow_id, e, exc_info=True)
            return _error(f"flow_step_error: {e}", 500)

    async def _config_flow_cancel(self, request: web.Request, flow_id: str) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.delete(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow cancel error %s: %s", flow_id, e, exc_info=True)
            return _error(f"flow_cancel_error: {e}", 500)

    async def _config_flow_subentry_cancel(self, request: web.Request, flow_id: str) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.delete(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow cancel error %s: %s", flow_id, e, exc_info=True)
            return _error(f"subentry_cancel_error: {e}", 500)

    async def _config_flow_options_start(self, request: web.Request, body: dict) -> web.Response:
        handler = body.get("handler")
        if not handler:
            return _bad_request("handler (entry_id) required")
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/options/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Options flow start error %s: %s", handler, e, exc_info=True)
            return _error(f"options_start_error: {e}", 500)

    async def _config_flow_options_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/options/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Options flow step error %s: %s", flow_id, e, exc_info=True)
            return _error(f"options_step_error: {e}", 500)

    async def _config_flow_subentry_start(self, request: web.Request, body: dict) -> web.Response:
        handler = body.get("handler")
        if not handler or not isinstance(handler, list) or len(handler) != 2:
            return _bad_request("handler must be [entry_id, subentry_type]")
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            if "source" in body:
                payload["source"] = body["source"]
            if "subentry_id" in body:
                payload["subentry_id"] = body["subentry_id"]
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow start error %s: %s", handler, e, exc_info=True)
            return _error(f"subentry_start_error: {e}", 500)

    async def _get_subentries(self, request: web.Request, entry_id: str) -> web.Response:
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return _not_found("entry_not_found")
        result = [
            {
                "subentry_id": se.subentry_id,
                "subentry_type": se.subentry_type,
                "title": se.title,
                "unique_id": se.unique_id,
            }
            for se in entry.subentries.values()
        ]
        return web.json_response({"subentries": result})

    async def _config_flow_subentry_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        token = self._extract_token(request)
        if not token:
            return _unauthorized()
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow step error %s: %s", flow_id, e, exc_info=True)
            return _error(f"subentry_step_error: {e}", 500)


def _read_json_text(path: str) -> dict | None:
    """Blocking JSON text file read — must run via executor."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None