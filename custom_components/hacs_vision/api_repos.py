"""Repository listing + CRUD handlers for HACS Enhanced API."""
from __future__ import annotations

import json
import logging

from aiohttp import web

_LOGGER = logging.getLogger(__name__)


class RepoMixin:
    """Repository listing and CRUD handlers.

    Extracted from HACSEnhancedAPI. Uses self.data, self.operator,
    self.hass, self.gh, self._ha_base_url from parent.
    """

    async def _list_repositories(self, query) -> web.Response:

        # Primary data source: HACS in-memory (same as HACS UI)

        repos = await self.operator.get_all_repos_from_hacs()



        # Fallback to storage file if HACS not available

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



        # Merge install times

        install_times = await self.data.get_install_times()

        for r in repos:

            fn = r.get("full_name", "")

            if fn and fn in install_times:

                r["installed_at"] = install_times[fn]



        # Enrich download counts from GitHub releases — limit initial scan to installed repos only

        try:

            installed = [r for r in repos if r.get("installed")]

            if installed:

                await self.gh.enrich_download_counts(installed)

        except Exception:

            pass



        # Enrich stargazers_count from GitHub API — installed repos only, 6h cache

        try:

            installed = [r for r in repos if r.get("installed")]

            if installed:

                await self.gh.enrich_star_counts(installed)

        except Exception:

            pass



        # Cross-reference config entries to add config_entry_id / load_failed to repos

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

                # Mark load_failed if config entry state is failed_setup

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

        page = int(query.get("page", 1))

        limit = min(int(query.get("limit", 50)), 200)



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



        # Category counts before filtering

        category_counts = {}

        for r in repos:

            cat = r.get("category", "unknown")

            category_counts[cat] = category_counts.get(cat, 0) + 1



        # Status counts — pure repo run-state (no favorites/new/custom)

        status_counts = {

            "installed": 0,

            "not_installed": 0,

            "update_available": 0,

            "pending_restart": 0,

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



        # Tag counts — orthogonal markers (new / custom / favorites)

        tag_counts = {

            "new": sum(1 for r in repos if r.get("new") or r.get("status") == "new"),

            "custom": sum(1 for r in repos if r.get("custom") or r.get("is_custom")),

        }

        # favorites is client-side, tag_counts.favorites is set on frontend



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

            elif status == "pending_restart":

                repos = [r for r in repos if r.get("pending_restart")]



        # Apply tag filter (custom / new / favorites) — moved from client-side to server-side

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

            "tag_counts": tag_counts,

        })




    async def _get_repository(self, repo_id: str) -> web.Response:

        repo = await self.data.get_repository(repo_id)

        if not repo:

            return web.json_response({"error": "not_found"}, status=404)

        return web.json_response(repo)




    async def _list_installed(self) -> web.Response:

        installed = self.operator.get_installed_list()

        # Merge config_entry_id from HA config entries

        entry_map = {}

        for entry in self.hass.config_entries.async_entries():

            if entry.domain:

                entry_map.setdefault(entry.domain, []).append(entry.entry_id)

        for item in installed:

            domain = item.get("domain")

            if domain and domain in entry_map:

                item["config_entry_id"] = entry_map[domain][0]

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

        # Get HACS ignored repos + pending_restart

        config = await self.data.get_config()

        ignored_set = set(config.get("ignored_repositories", []))

        pending_restart_set = set()

        for r in repos:

            if r.get("pending_restart"):

                fn = r.get("full_name") or str(r.get("id", ""))

                pending_restart_set.add(fn)

        installed_count = sum(1 for r in repos if r.get("installed"))

        # Count updates from HA update entities (excludes skipped natively + pending_restart)

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

                # Parse full_name to cross-check

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

        # Cross-reference config entries for load_failed count

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

        """Get available updates — HACS data filtered by HA entity states (skip/pending_restart)."""

        updates = await self.operator.get_updates_from_ha_entities()

        if not updates:

            # Fallback: HACS API, then filter skipped/pending via HA entities

            hacs_updates = await self.operator.get_available_updates()

            if hacs_updates:

                # Build set of skip-eligible repos from HA entities

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

                        # Skip if: state=off (skipped/up-to-date) OR pending_restart

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

        # Cross-reference HA entities: clear has_update for skipped versions

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

        # Also refresh star counts for custom repos (they're installed ones)

        try:

            if custom:

                await self.gh.enrich_star_counts(custom)

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




    async def _install(self, body: dict) -> web.Response:

        repo = body.get("repository", "")

        category = body.get("category", "integration")

        VALID_CATEGORIES = VALID_HACS_CATEGORIES

        if category not in VALID_CATEGORIES:

            return web.json_response({"error": f"invalid_category: {category}"}, status=400)

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




    async def _redownload(self, body: dict) -> web.Response:

        """Reinstall a repository: uninstall then install."""

        repo = body.get("repository", "")

        category = body.get("category", "integration")

        # Step 1: Remove

        remove_result = await self.operator.remove_repository(repo)

        if not remove_result.get("success"):

            return web.json_response(remove_result)

        full_name = remove_result.get("repository") or repo

        await self.data.remove_install_time(full_name)

        # Step 2: Install

        install_result = await self.operator.install_repository(full_name, category)

        if install_result.get("success"):

            from datetime import datetime, timezone

            await self.data.set_install_time(full_name, datetime.now(timezone.utc).isoformat())

        return web.json_response(install_result)




    async def _ignore_repo(self, body: dict) -> web.Response:

        """Add a repository to the ignored list."""

        repo = body.get("repository", "")

        if not repo:

            return web.json_response({"error": "repository required"}, status=400)

        config = await self.data.get_config()

        ignored = config.get("ignored_repositories", [])

        if repo not in ignored:

            ignored.append(repo)

            config["ignored_repositories"] = ignored

            await self.data.update_config(config)

        return web.json_response({"success": True, "repository": repo})




    async def _unignore_repo(self, body: dict) -> web.Response:

        """Remove a repository from HACS's ignored list."""

        repo = body.get("repository", "")

        if not repo:

            return web.json_response({"error": "repository required"}, status=400)

        config = await self.data.get_config()

        ignored = config.get("ignored_repositories", [])

        if repo in ignored:

            ignored.remove(repo)

            config["ignored_repositories"] = ignored

            await self.data.update_config(config)

        return web.json_response({"success": True, "repository": repo})




    async def _ignore_version(self, body: dict) -> web.Response:

        """Ignore a specific version update for a repository."""

        repo = body.get("repository", "")

        version = body.get("version", "")

        if not repo or not version:

            return web.json_response({"error": "repository and version required"}, status=400)

        data = await self.data.read_storage("ignored_versions")

        if not data:

            data = {"data": {}}

        ignored = data.get("data", {})

        ignored[repo] = version

        data["data"] = ignored

        await self.data.write_storage("ignored_versions", data)

        # Also call HA native update.skip to sync with Settings → Updates

        await self._call_update_service("skip", repo)

        return web.json_response({"success": True, "repository": repo, "version": version})




    async def _unignore_version(self, body: dict) -> web.Response:

        """Remove version ignore for a repository."""

        repo = body.get("repository", "")

        if not repo:

            return web.json_response({"error": "repository required"}, status=400)

        data = await self.data.read_storage("ignored_versions")

        if data and repo in data.get("data", {}):

            del data["data"][repo]

            await self.data.write_storage("ignored_versions", data)

        # Also call HA native update.clear_skipped to sync with Settings → Updates

        await self._call_update_service("clear_skipped", repo)

        return web.json_response({"success": True, "repository": repo})




    async def _call_update_service(self, action: str, repo_full_name: str):

        """Call HA update.skip or update.clear_skipped for the matching update entity.



        Matches the entity by checking release_url against the repo's GitHub URL.

        Silently skips if no matching entity is found (e.g. entity not yet created).

        """

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

            pass  # best-effort, Vision's own storage still works




    async def _get_ignored_versions(self) -> web.Response:

        """Get all ignored versions."""

        data = await self.data.read_storage("ignored_versions")

        return web.json_response(data.get("data", {}) if data else {})




    async def _get_skipped_versions(self) -> web.Response:

        """Get all skipped versions from HA update entities (native skip)."""

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

                # Parse full_name from release_url

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

        """Get releases for a repository with 3-layer fallback:

        1. HACS internal cache (repo.releases)
        2. GitHub API via self.gh (if thin cache)
        3. Last resort: repo.data.last_version
        """

        repo_id = query.get("id", "").strip()
        if not repo_id:
            repo_id = query.get("repository", "").strip()

        if not repo_id:
            return web.json_response({"error": "id or repository required"}, status=400)

        # Delegate to operator which has the full 3-layer fallback
        if hasattr(self, "operator") and self.operator:
            releases = await self.operator.get_repo_releases(repo_id)
        else:
            releases = []
            # Fallback: try GitHubClient directly if we have full_name
            if "/" in repo_id:
                try:
                    releases = await self.gh.get_releases(repo_id)
                except Exception:
                    pass

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




    async def _batch_install(self, body: dict) -> web.Response:

        """Batch install repositories."""

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

                results.append({"repository": repo_name, "result": {"success": False, "error": str(e)}})

        return web.json_response({"success": True, "results": results})




    async def _batch_remove(self, body: dict) -> web.Response:

        """Batch remove repositories."""

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

                results.append({"repository": repo_name, "result": {"success": False, "error": str(e)}})

        self.operator.invalidate_index()

        return web.json_response({"success": True, "results": results})




    async def _check_updates_with_notification(self) -> web.Response:

        """Check for updates and send a persistent notification."""

        try:

            # Step 1: Force HACS to refresh ALL installed repos from GitHub

            # Without this, HACS's display_available_version is stale (last sync)

            refresh_result = await self.operator.refresh_repositories()

            if not refresh_result.get("success"):

                _LOGGER.warning("GitHub refresh rate-limited during check, falling back to cached data: %s",

                                refresh_result.get("error", "unknown"))



            # Step 2: Now rebuild index and check with fresh data

            self.operator.invalidate_index()

            repos = await self.operator.get_all_repos_from_hacs()

            updatable = [r for r in repos if r.get("has_update")]

            pending_restart = [r for r in repos if r.get("pending_restart")]



            if updatable:

                names = "\n".join(f"- **{r.get('manifest_name') or r.get('name', r.get('full_name', '?'))}**: {r.get('installed_version', '?')} → {r.get('latest_version', '?')}" for r in updatable[:10])

                title = f"HACS Vision: {len(updatable)} repos can be updated"

                message = f"**{len(updatable)}** repos can be updated:\n{names}"

                if len(updatable) > 10:

                    message += f"\n…and {len(updatable) - 10} more"

                await self.data.send_persistent_notification(title, message)



            if pending_restart:

                names = ", ".join(r.get('manifest_name') or r.get('full_name', '?') for r in pending_restart)

                await self.data.send_persistent_notification(

                    f"HACS Vision: {len(pending_restart)} repos pending restart",

                    f"The following repos need a HA restart:\n{names}"

                )



            return web.json_response({

                "success": True,

                "updates_found": len(updatable),

                "pending_restart": len(pending_restart),

                "notified": True,

            })

        except Exception as e:

            _LOGGER.error("Check updates+notify failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)




