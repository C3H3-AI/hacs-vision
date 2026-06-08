"""REST API endpoints + static file serving for HACS Vision."""
from __future__ import annotations
import json
import logging
import os
import time
import aiohttp
from aiohttp import web
from homeassistant.components.http import HomeAssistantView

from .const import API_BASE
from .hacs_data import HACSData
from .hacs_operator import HACSOperator
from .backup import BackupManager
from .dependency_checker import DependencyChecker

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

# Server-side README cache: {full_name: {html, timestamp}}
_README_CACHE: dict[str, dict] = {}
_README_CACHE_TTL = 3600  # 1 hour


class HACSEnhancedStaticView(HomeAssistantView):
    """Serve frontend static files — no auth required for JS/CSS assets.

    HA's panel loader uses native ``import()`` which cannot send Authorization
    headers, so the static view must allow unauthenticated access.  All data
    API endpoints remain auth-protected.
    """

    url = f"{API_BASE}/static/{{filename:.*}}"
    name = "api:hacs_vision_static"
    requires_auth = False

    def __init__(self, hass) -> None:
        self.hass = hass

    async def get(self, request, filename: str = "panel.js") -> web.Response:
        """Serve a static file."""
        filepath = os.path.join(FRONTEND_DIR, filename)
        # Prevent path traversal
        if ".." in filepath or not os.path.realpath(filepath).startswith(os.path.realpath(FRONTEND_DIR)):
            return web.json_response({"error": "invalid_path"}, status=400)
        try:
            content = await self.hass.async_add_executor_job(self._read_file, filepath)
            ctype = "application/javascript" if filename.endswith(".js") else "text/html" if filename.endswith(".html") else "text/plain"
            resp = web.Response(text=content, content_type=ctype)
            resp.headers["Cache-Control"] = "public, max-age=3600"
            return resp
        except FileNotFoundError:
            return web.json_response({"error": "file_not_found"}, status=404)

    def _read_file(self, path: str) -> str:
        """Synchronous file read."""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()


class HACSEnhancedAPI(HomeAssistantView):
    """HACS Vision REST API — data endpoints (requires auth)."""

    url = f"{API_BASE}/{{path:.*}}"
    name = "api:hacs_vision"
    requires_auth = True

    def __init__(self, hass, data: HACSData | None = None, operator: HACSOperator | None = None,
                 backup: BackupManager | None = None, checker: DependencyChecker | None = None) -> None:
        self.hass = hass
        # N3: Accept shared instances from __init__.py
        self.data = data or HACSData(hass)
        self.operator = operator or HACSOperator(hass, shared_data=self.data)
        self.backup = backup or BackupManager(hass, shared_data=self.data)
        self.checker = checker or DependencyChecker(hass, shared_data=self.data)
        # Shared aiohttp session for GitHub API calls (reuse TCP connections)
        self._session: aiohttp.ClientSession | None = None
        self._github_token: str | None = None

    def _get_github_token(self) -> str | None:
        """Get GitHub token from HACS config entry for authenticated API calls (5000/hr vs 60/hr)."""
        if self._github_token is not None:
            return self._github_token or None
        try:
            for entry in self.hass.config_entries.async_entries("hacs"):
                token = entry.data.get("token")
                if token:
                    self._github_token = token
                    return token
        except Exception:
            pass
        self._github_token = ""  # Cache negative result
        return None

    # ── GET ──────────────────────────────────────────────

    async def get(self, request, path: str = "") -> web.Response:
        """Handle GET requests."""
        if path.startswith("static/"):
            return web.json_response({"error": "use_static_view"}, status=404)

        query = request.query

        if path in ("repositories", "repositories/"):
            return await self._list_repositories(query)
        if path.startswith("repositories/"):
            return await self._get_repository(path.split("/", 1)[1])
        if path in ("installed", "installed/"):
            return await self._list_installed()
        if path == "installed/stats":
            return await self._get_stats()
        if path in ("updates", "updates/"):
            return await self._get_updates()
        if path in ("config", "config/"):
            return await self._get_config()
        if path == "config/custom":
            return await self._get_custom_repos()
        if path == "backup/export":
            return await self._export_backup()
        if path in ("dependencies", "dependencies/"):
            return await self._check_dependencies()
        if path in ("refresh", "refresh/"):
            return await self._refresh()
        if path.startswith("readme/"):
            return await self._get_readme(path[7:])
        if path.startswith("changelog/"):
            return await self._get_changelog(path[10:])
        if path == "repos/releases":
            return await self._get_repo_releases(query)
        if path.startswith("repos/status/"):
            return await self._get_repo_rt_status(path[12:])
        if path in ("favorites", "favorites/"):
            return await self._get_favorites()

        return web.json_response({"error": "not_found"}, status=404)

    # ── POST ─────────────────────────────────────────────

    async def post(self, request, path: str = "") -> web.Response:
        """Handle POST requests."""
        try:
            body = await request.json()
        except (json.JSONDecodeError, ValueError):
            body = {}

        if path in ("install", "install/"):
            return await self._install(body)
        if path in ("update", "update/"):
            return await self._update(body)
        if path in ("remove", "remove/"):
            return await self._remove(body)
        if path in ("config", "config/"):
            return await self._update_config(body)
        if path == "config/custom":
            return await self._add_custom_repo(body)
        if path in ("backup/import", "backup/import/"):
            return await self._import_backup(body)
        if path in ("refresh", "refresh/"):
            return await self._refresh()
        if path == "repos/install_version":
            return await self._install_repo_version(body)
        if path in ("favorites", "favorites/"):
            return await self._set_favorites(body)
        if path == "management/remove_archived":
            return await self._remove_archived(body)
        if path == "management/replace_renamed":
            return await self._replace_renamed(body)
        if path == "management/remove_renamed":
            return await self._remove_renamed_entry(body)

        return web.json_response({"error": "not_found"}, status=404)

    # ── DELETE ───────────────────────────────────────────

    async def delete(self, request, path: str = "") -> web.Response:
        """Handle DELETE requests."""
        if path == "config/custom":
            try:
                body = await request.json()
            except (json.JSONDecodeError, ValueError):
                return web.json_response({"error": "invalid_json"}, status=400)
            return await self._remove_custom_repo(body)
        return web.json_response({"error": "not_found"}, status=404)

    # ── Repositories ─────────────────────────────────────

    async def _list_repositories(self, query) -> web.Response:
        # Primary data source: HACS in-memory (same as HACS UI)
        repos = await self.operator.get_all_repos_from_hacs()

        # Fallback to storage file if HACS not available
        if not repos:
            repos = await self.data.get_all_repositories()

        # Merge install times
        install_times = await self.data.get_install_times()
        for r in repos:
            fn = r.get("full_name", "")
            if fn and fn in install_times:
                r["installed_at"] = install_times[fn]

        search = query.get("search", "").lower()
        category = query.get("category", "")
        status = query.get("status", "")
        sort = query.get("sort", "stars")
        sort_dir = query.get("sortDir", "desc")
        page = int(query.get("page", 1))
        limit = min(int(query.get("limit", 50)), 200)

        if search:
            repos = [
                r for r in repos
                if search in (r.get("full_name") or "").lower()
                or search in (r.get("description") or "").lower()
                or search in (r.get("name") or "").lower()
                or search in " ".join(r.get("authors") or []).lower()
                or search in (r.get("category") or "").lower()
            ]

        # Category counts before filtering
        category_counts = {}
        for r in repos:
            cat = r.get("category", "unknown")
            category_counts[cat] = category_counts.get(cat, 0) + 1

        # Status counts — use frontend-friendly keys (computed on full set before status filter)
        status_counts = {
            "installed": 0,
            "not_installed": 0,
            "update_available": 0,
            "new": 0,
            "custom": 0,
            "pending_restart": 0,
            "favorites": 0,
        }
        for r in repos:
            if r.get("pending_restart"):
                status_counts["pending_restart"] += 1
            elif r.get("has_update"):
                status_counts["update_available"] += 1
            elif r.get("installed"):
                status_counts["installed"] += 1
            elif r.get("new") or r.get("status") == "new":
                status_counts["new"] += 1
            else:
                status_counts["not_installed"] += 1
            if r.get("custom"):
                status_counts["custom"] += 1

        # Apply category filter
        if category:
            repos = [r for r in repos if r.get("category") == category]

        # Apply status filter
        if status:
            if status == "installed":
                repos = [r for r in repos if r.get("installed")]
            elif status == "not_installed":
                repos = [r for r in repos if not r.get("installed")]
            elif status == "update_available":
                repos = [r for r in repos if r.get("has_update")]
            elif status == "new":
                repos = [r for r in repos if r.get("new") or r.get("status") == "new"]
            elif status == "custom":
                repos = [r for r in repos if r.get("custom")]
            elif status == "pending_restart":
                repos = [r for r in repos if r.get("pending_restart")]
            # favorites is client-side only, skip server filter

        reverse = sort_dir == "desc"
        if sort == "stars" or sort == "stargazers_count":
            repos.sort(key=lambda r: r.get("stargazers_count", 0) or 0, reverse=reverse)
        elif sort == "updated" or sort == "last_updated":
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

        # Always put hacs-vision repo first
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
            "repositories": repos,
            "total": total,
            "page": page,
            "limit": limit,
            "category_counts": category_counts,
            "status_counts": status_counts,
        })

    async def _get_repository(self, repo_id: str) -> web.Response:
        repo = await self.data.get_repository(repo_id)
        if not repo:
            return web.json_response({"error": "not_found"}, status=404)
        return web.json_response(repo)

    async def _list_installed(self) -> web.Response:
        installed = self.operator.get_installed_list()
        return web.json_response({"installed": installed})

    async def _get_stats(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        if not repos:
            repos = await self.data.get_all_repositories()
        installed_count = sum(1 for r in repos if r.get("installed"))
        updates_count = sum(1 for r in repos if r.get("has_update"))
        new_count = sum(1 for r in repos if r.get("new") or r.get("status") == "new")
        pending_restart_count = sum(1 for r in repos if r.get("pending_restart"))
        custom_count = sum(1 for r in repos if r.get("custom"))
        return web.json_response({
            "total_repos": len(repos),
            "total_installed": installed_count,
            "available_updates": updates_count,
            "new_repos": new_count,
            "pending_restart": pending_restart_count,
            "custom_count": custom_count,
        })

    async def _get_updates(self) -> web.Response:
        updates = self.operator.get_available_updates()
        return web.json_response({"updates": updates})

    async def _get_config(self) -> web.Response:
        config = await self.data.get_config()
        return web.json_response(config)

    async def _get_custom_repos(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        custom = [r for r in repos if r.get("custom")]
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

    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create shared aiohttp session."""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session

    async def _get_readme(self, full_name: str) -> web.Response:
        """Proxy GitHub README request with rate limit awareness and server-side cache."""
        # Check server-side cache first
        cached = _README_CACHE.get(full_name)
        if cached and (time.time() - cached["timestamp"] < _README_CACHE_TTL):
            return web.Response(text=cached["html"], content_type="text/html")

        session = await self._get_session()
        url = f"https://api.github.com/repos/{full_name}/readme"
        headers = {"Accept": "application/vnd.github.v3.html"}
        token = self._get_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            async with session.get(url, headers=headers) as resp:
                # Check GitHub API rate limit
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining is not None and int(remaining) <= 0:
                    reset_time = resp.headers.get("X-RateLimit-Reset", "0")
                    _LOGGER.warning("GitHub API rate limit exceeded, resets at %s", reset_time)
                    return web.json_response(
                        {"error": "rate_limited", "reset_at": reset_time},
                        status=429,
                    )

                if resp.status == 200:
                    content = await resp.text()
                    # Cache on server side
                    _README_CACHE[full_name] = {"html": content, "timestamp": time.time()}
                    return web.Response(text=content, content_type="text/html")
                elif resp.status == 404:
                    return web.json_response({"error": "not_found"}, status=404)
                elif resp.status == 403:
                    _LOGGER.warning("GitHub API 403 Forbidden — possible secondary rate limit")
                    return web.json_response({"error": "rate_limited"}, status=429)
                else:
                    return web.json_response({"error": f"github_api_{resp.status}"}, status=502)
        except (aiohttp.ClientError, TimeoutError, OSError) as e:
            _LOGGER.error("README proxy network error: %s", e)
            return web.json_response({"error": "network_error"}, status=502)
        except Exception as e:
            _LOGGER.error("README proxy unexpected error: %s", e, exc_info=True)
            return web.json_response({"error": str(e)}, status=502)

    async def _get_changelog(self, full_name: str) -> web.Response:
        """Proxy GitHub Releases API for changelog preview."""
        session = await self._get_session()
        url = f"https://api.github.com/repos/{full_name}/releases?per_page=1"
        headers = {"Accept": "application/vnd.github.v3+json"}
        token = self._get_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            async with session.get(url, headers=headers) as resp:
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining is not None and int(remaining) <= 0:
                    return web.json_response({"error": "rate_limited"}, status=429)

                if resp.status == 200:
                    data = await resp.json()
                    if data and len(data) > 0:
                        release = data[0]
                        body = release.get("body", "")
                        return web.json_response({
                            "tag": release.get("tag_name", ""),
                            "name": release.get("name", ""),
                            "body": body[:10000] if body else "",
                            "url": release.get("html_url", f"https://github.com/{full_name}/releases"),
                        })
                    return web.json_response({"tag": "", "body": ""})
                elif resp.status == 404:
                    return web.json_response({"tag": "", "body": ""})
                else:
                    return web.json_response({"error": f"github_api_{resp.status}"}, status=502)
        except (aiohttp.ClientError, TimeoutError, OSError) as e:
            _LOGGER.error("Changelog proxy network error: %s", e)
            return web.json_response({"error": "network_error"}, status=502)

    # ── Write operations ─────────────────────────────────

    async def _install(self, body: dict) -> web.Response:
        repo = body.get("repository", "")
        category = body.get("category", "integration")
        result = await self.operator.install_repository(repo, category)
        if result.get("success"):
            # Record install time
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
            # Remove install time
            full_name = result.get("repository") or repo
            await self.data.remove_install_time(full_name)
        return web.json_response(result)

    async def _update_config(self, body: dict) -> web.Response:
        result = await self.data.update_config(body)
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

    async def _get_repo_releases(self, query) -> web.Response:
        repo_id = query.get("id", "")
        if not repo_id:
            return web.json_response({"error": "id required"}, status=400)
        releases = await self.operator.get_repo_releases(repo_id)
        # If HACS internal has no releases, try GitHub API
        if not releases:
            repo = self.operator._find_repo(repo_id)
            if repo and repo.data.full_name:
                try:
                    session = await self._get_session()
                    url = f"https://api.github.com/repos/{repo.data.full_name}/releases?per_page=10"
                    gh_headers = {"Accept": "application/vnd.github.v3+json"}
                    token = self._get_github_token()
                    if token:
                        gh_headers["Authorization"] = f"token {token}"
                    async with session.get(url, headers=gh_headers) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            for release in data:
                                releases.append({
                                    "tag_name": release.get("tag_name", ""),
                                    "name": release.get("name", ""),
                                    "prerelease": release.get("prerelease", False),
                                    "published_at": release.get("published_at", ""),
                                })
                except Exception as e:
                    _LOGGER.warning("GitHub releases fetch failed for %s: %s", repo.data.full_name, e)
        return web.json_response({"releases": releases})

    async def _get_repo_rt_status(self, repo_id: str) -> web.Response:
        """Get real-time status from HACS in-memory data."""
        status = self.operator.get_repo_rt_status(repo_id)
        if not status:
            return web.json_response({"error": "not_found"}, status=404)
        return web.json_response(status)

    async def _install_repo_version(self, body: dict) -> web.Response:
        repo_id = body.get("id", "")
        version = body.get("version")
        if not repo_id:
            return web.json_response({"error": "id required"}, status=400)
        result = await self.operator.install_repository_version(repo_id, version)
        if result.get("success"):
            self.operator.invalidate_index()
            # Record install time
            from datetime import datetime, timezone
            full_name = result.get("repository") or repo_id
            await self.data.set_install_time(full_name, datetime.now(timezone.utc).isoformat())
        return web.json_response(result)

    async def _import_backup(self, body: dict) -> web.Response:
        result = await self.backup.import_data(body)
        return web.json_response(result)

    # ── Favorites (server-side storage) ─────────────────

    async def _get_favorites(self) -> web.Response:
        """Get favorite repository IDs."""
        favorites = await self.data.get_favorites()
        return web.json_response({"favorites": favorites})

    async def _set_favorites(self, body: dict) -> web.Response:
        """Set the full favorites list (POST)."""
        favorites = body.get("favorites", [])
        ok = await self.data.set_favorites(favorites)
        return web.json_response({"success": ok, "favorites": favorites})

    # ── Management: destructive repo operations ─────────

    async def _remove_archived(self, body: dict) -> web.Response:
        """Completely purge an archived repository from HACS storage."""
        repo_name = body.get("repository", "")
        if not repo_name:
            return web.json_response({"error": "repository required"}, status=400)

        # 1. Remove from archived_repositories in HACS config
        config = await self.data.get_config()
        archived = config.get("archived_repositories", [])
        if repo_name in archived:
            archived.remove(repo_name)
            config["archived_repositories"] = archived
            await self.data.update_config(config)

        # 2. Purge from hacs.repositories (the master repo data dict)
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

        # 3. Purge from hacs.data installed-repo lists
        hacs_data = await self.data.read_storage("data")
        if hacs_data and "data" in hacs_data:
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

        # 4. Try HACS in-memory uninstall if still tracked
        await self.operator.remove_repository(repo_name)

        # 5. Invalidate operator index so it re-reads from storage
        self.operator.invalidate_index()

        return web.json_response({
            "success": True,
            "repository": repo_name,
            "purged_ids": purged_ids,
        })

    async def _replace_renamed(self, body: dict) -> web.Response:
        """Replace a renamed repo: uninstall old, install new, update config.

        Reads the category from the old repo's data before purging it.
        """
        old_name = body.get("old_name", "")
        new_name = body.get("new_name", "")
        if not old_name or not new_name:
            return web.json_response(
                {"error": "old_name and new_name required"}, status=400
            )

        # Determine category from old repo data before purging
        category = "integration"
        repos_data = await self.data.read_storage("repositories")
        if repos_data and "data" in repos_data:
            for info in repos_data["data"].values():
                if info.get("full_name") == old_name:
                    category = info.get("category", "integration")
                    break

        # 1. Remove old renamed entry from config
        config = await self.data.get_config()
        renamed = config.get("renamed_repositories", {})
        if old_name in renamed:
            del renamed[old_name]
            config["renamed_repositories"] = renamed
            await self.data.update_config(config)

        # 2. Uninstall old repo via HACS API
        await self.operator.remove_repository(old_name)

        # 3. Purge old repo from hacs.repositories
        if repos_data and "data" in repos_data:
            to_delete = [
                rid for rid, info in repos_data["data"].items()
                if info.get("full_name") == old_name
            ]
            for rid in to_delete:
                del repos_data["data"][rid]
            if to_delete:
                await self.data.write_storage("repositories", repos_data)

        # 4. Purge old repo from hacs.data installed lists
        hacs_data = await self.data.read_storage("data")
        if hacs_data and "data" in hacs_data:
            cat_dict = hacs_data["data"].get("repositories", {})
            changed = False
            for cat, repos_list in cat_dict.items():
                if isinstance(repos_list, list):
                    filtered = [r for r in repos_list if r != old_name]
                    if len(filtered) != len(repos_list):
                        cat_dict[cat] = filtered
                        changed = True
            if changed:
                await self.data.write_storage("data", hacs_data)

        # 5. Install new repo
        install_result = await self.operator.install_repository(new_name, category)
        if install_result.get("success"):
            from datetime import datetime, timezone
            await self.data.set_install_time(
                new_name, datetime.now(timezone.utc).isoformat()
            )

        # 6. Invalidate index
        self.operator.invalidate_index()

        return web.json_response({
            "success": install_result.get("success", False),
            "repository": new_name,
            "install_result": install_result,
            "category": category,
        })

    async def _remove_renamed_entry(self, body: dict) -> web.Response:
        """Remove a renamed mapping and purge the old repo entirely."""
        old_name = body.get("old_name", "")
        if not old_name:
            return web.json_response({"error": "old_name required"}, status=400)

        # 1. Remove from renamed_repositories in config
        config = await self.data.get_config()
        renamed = config.get("renamed_repositories", {})
        if old_name in renamed:
            del renamed[old_name]
            config["renamed_repositories"] = renamed
            await self.data.update_config(config)

        # 2. Purge from hacs.repositories
        repos_data = await self.data.read_storage("repositories")
        purged_ids = []
        if repos_data and "data" in repos_data:
            to_delete = [
                rid for rid, info in repos_data["data"].items()
                if info.get("full_name") == old_name
            ]
            for rid in to_delete:
                del repos_data["data"][rid]
                purged_ids.append(rid)
            if to_delete:
                await self.data.write_storage("repositories", repos_data)

        # 3. Purge from hacs.data installed lists
        hacs_data = await self.data.read_storage("data")
        if hacs_data and "data" in hacs_data:
            cat_dict = hacs_data["data"].get("repositories", {})
            changed = False
            for cat, repos_list in cat_dict.items():
                if isinstance(repos_list, list):
                    filtered = [r for r in repos_list if r != old_name]
                    if len(filtered) != len(repos_list):
                        cat_dict[cat] = filtered
                        changed = True
            if changed:
                await self.data.write_storage("data", hacs_data)

        # 4. HACS in-memory uninstall
        await self.operator.remove_repository(old_name)

        # 5. Invalidate index
        self.operator.invalidate_index()

        return web.json_response({
            "success": True,
            "repository": old_name,
            "purged_ids": purged_ids,
        })
