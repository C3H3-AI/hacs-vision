"""REST API endpoints + static file serving for HACS Vision."""

from __future__ import annotations

import asyncio

import json

import logging

import os

import time

import aiohttp

from aiohttp import web

from homeassistant.components.http import HomeAssistantView

from homeassistant.helpers import aiohttp_client

from homeassistant.util import dt as dt_util



from .const import API_BASE, GITHUB_COM_BASE, HA_LOCALHOST_FALLBACK, VERSION

from .hacs_data import HACSData

from .hacs_operator import HACSOperator



from .dependency_checker import DependencyChecker

from .entity_ref_finder import EntityRefFinder

from .github_client import GitHubClient



_LOGGER = logging.getLogger(__name__)



FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")



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

            # Inject version into HTML for JS cache-busting

            if filename.endswith(".html"):

                content = content.replace("__VERSION__", VERSION)

            resp = web.Response(text=content, content_type=ctype)

            # HTML: always revalidate so the app pulls the latest ?v=VERSION panel.js

            # JS:  always revalidate too (dev-active project; cache causes stale UX)

            if filename.endswith(".html") or filename.endswith(".js") or filename == "build.json":

                resp.headers["Cache-Control"] = "no-cache, must-revalidate"

            else:

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

        self.data = data or HACSData(hass)

        self.operator = operator or HACSOperator(hass, shared_data=self.data)

        self.backup = backup or BackupManager(hass, shared_data=self.data, operator=self.operator)

        self.checker = checker or DependencyChecker(hass, shared_data=self.data)

        # GitHubClient (shared aiohttp session managed by GitHubClient)

        self.gh = GitHubClient(hass, data=self.data)

        # Schedule first-run auto-import from HACS after setup completes

        self._auto_import_done = False

        self._oauth_device = None

        self._oauth_device_code = None



    @property

    def _ha_base_url(self) -> str:

        """Get HA base URL dynamically (prefer internal, fallback to external)."""

        try:

            return self.hass.http.get_url()

        except Exception:

            try:

                return self.hass.config.external_url or "http://localhost:8123"

            except Exception:

                return "http://localhost:8123"



    def _get_hacs_token(self) -> str | None:

        """Get GitHub token from HACS config entry — used only for explicit HACS import."""

        try:

            for entry in self.hass.config_entries.async_entries("hacs"):

                token = entry.data.get("token")

                if token:

                    return token

        except Exception:

            pass

        return None



    async def _get_vision_github_token(self) -> str | None:

        """Get GitHub token from hacs-vision own storage."""

        try:

            data = await self.data.read_storage("github_token")

            if data and isinstance(data, dict) and data.get("token"):

                return data["token"]

        except Exception:

            pass

        return None



    async def _get_active_github_token(self) -> str | None:

        """Get GitHub token from Vision's own storage only."""

        return await self.gh.get_token()



    

    async def _save_screenshot(self, base64_data: str, filename: str) -> str | None:

        """Save a base64 screenshot to HA's www dir and return accessible URL.

        File is deleted after issue creation (cleanup happens in caller).

        """

        try:

            import os as _os

            www_dir = self.hass.config.path("www", "hacs_vision_screenshots")

            _os.makedirs(www_dir, exist_ok=True)

            raw = base64_data

            if "," in raw:

                raw = raw.split(",", 1)[1]

            decoded = __import__("base64").b64decode(raw)

            filepath = _os.path.join(www_dir, filename)

            with open(filepath, "wb") as f:

                f.write(decoded)

            ha_url = None

            try:

                if hasattr(self.hass.config, "external_url") and self.hass.config.external_url:

                    ha_url = self.hass.config.external_url

                elif hasattr(self.hass.config, "internal_url") and self.hass.config.internal_url:

                    ha_url = self.hass.config.internal_url

                else:

                    ha_url = self.hass.http.get_url(prefer_external=True)

            except Exception:

                try:

                    ha_url = self.hass.http.get_url()

                except Exception:

                    pass

            if not ha_url:

                ha_url = "https://api.homediy.top:8443"

            _LOGGER.info("Screenshot URL base: %s", ha_url)

            return f"{ha_url.rstrip('/')}/local/hacs_vision_screenshots/{filename}"

        except Exception as e:

            _LOGGER.warning("Save screenshot error: %s", e)

        return None



    def _cleanup_screenshots(self, filenames: list[str]) -> None:

        """Remove temporary screenshot files."""

        import os as _os

        if not filenames:

            return

        www_dir = self.hass.config.path("www", "hacs_vision_screenshots")

        for fname in filenames:

            try:

                fp = _os.path.join(www_dir, fname)

                if _os.path.exists(fp):

                    _os.remove(fp)

            except Exception as e:

                _LOGGER.warning("Cleanup screenshot %s error: %s", fname, e)



    async def _delayed_cleanup(self, filenames: list[str], delay: int = 300) -> None:

        """Clean up screenshots after a delay to let GitHub cache them."""

        import asyncio as _asyncio

        await _asyncio.sleep(delay)

        self._cleanup_screenshots(filenames)



    

    

    async def _github_sync_favorites(self) -> web.Response:

        """Sync starred repos as favorites via GitHubClient."""

        starred = await self.gh.list_starred()

        favorites = [

            {"full_name": r["full_name"], "category": r.get("category", "integration")}

            for r in starred

        ]

        await self.data.set_favorites(favorites)

        return web.json_response({"ok": True, "count": len(favorites)})



    async def _config_flow_handlers(self, request: web.Request) -> web.Response:

        """Get available config flow handlers — proxy to HA native REST API."""

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/flow_handlers"

            headers = {"Authorization": f"Bearer {token}"}

            async with session.get(url, headers=headers) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Config flow handlers error: %s", e, exc_info=True)

            return web.json_response({"error": str(e)}, status=500)



    async def _config_flow_start(self, request: web.Request, body: dict) -> web.Response:

        """Start a config flow (initial or reconfigure) — proxy to HA native REST API."""

        handler = body.get("handler")

        if not handler:

            return web.json_response({"error": "handler required"}, status=400)

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/flow"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            payload = {"handler": handler}

            # Pass through optional fields (source, entry_id, show_advanced_options)

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

            return web.json_response({"error": f"flow_start_error: {e}"}, status=500)



    async def _config_flow_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:

        """Submit a config flow step — proxy to HA native REST API."""

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            async with session.post(url, headers=headers, json=body) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Config flow step error %s: %s", flow_id, e, exc_info=True)

            return web.json_response({"error": f"flow_step_error: {e}"}, status=500)



    async def _config_flow_cancel(self, request: web.Request, flow_id: str) -> web.Response:

        """Cancel a config flow — proxy to HA native REST API."""

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            async with session.delete(url, headers=headers) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Config flow cancel error %s: %s", flow_id, e, exc_info=True)

            return web.json_response({"error": f"flow_cancel_error: {e}"}, status=500)



    async def _config_flow_subentry_cancel(self, request: web.Request, flow_id: str) -> web.Response:

        """Cancel a subentry flow — proxy to HA native REST API."""

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            async with session.delete(url, headers=headers) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Subentry flow cancel error %s: %s", flow_id, e, exc_info=True)

            return web.json_response({"error": f"subentry_cancel_error: {e}"}, status=500)



    async def _config_flow_options_start(self, request: web.Request, body: dict) -> web.Response:

        """Start an options flow — proxy to HA native REST API."""

        handler = body.get("handler")

        if not handler:

            return web.json_response({"error": "handler (entry_id) required"}, status=400)

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

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

            return web.json_response({"error": f"options_start_error: {e}"}, status=500)



    async def _config_flow_options_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:

        """Submit an options flow step — proxy to HA native REST API."""

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/options/flow/{flow_id}"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            async with session.post(url, headers=headers, json=body) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Options flow step error %s: %s", flow_id, e, exc_info=True)

            return web.json_response({"error": f"options_step_error: {e}"}, status=500)



    async def _config_flow_subentry_start(self, request: web.Request, body: dict) -> web.Response:

        """Start a subentry flow — proxy to HA native REST API.



        HA endpoint: POST /api/config/config_entries/subentries/flow

        Body: {"handler": ["entry_id", "subentry_type"]}

        For reconfigure: add "source": "reconfigure", "subentry_id": "xxx"

        """

        handler = body.get("handler")

        if not handler or not isinstance(handler, list) or len(handler) != 2:

            return web.json_response({"error": "handler must be [entry_id, subentry_type]"}, status=400)

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            # Pass through any extra fields (source, subentry_id) for reconfigure support

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

            return web.json_response({"error": f"subentry_start_error: {e}"}, status=500)



    async def _get_subentries(self, request: web.Request, entry_id: str) -> web.Response:

        """List subentries of a config entry."""

        entry = self.hass.config_entries.async_get_entry(entry_id)

        if not entry:

            return web.json_response({"error": "entry_not_found"}, status=404)

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

        """Submit a subentry flow step — proxy to HA native REST API.



        HA endpoint: POST /api/config/config_entries/subentries/flow/{flow_id}

        """

        token = self._extract_token(request)

        if not token:

            return web.json_response({"error": "unauthorized"}, status=401)

        try:

            session = await self._get_session()

            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

            async with session.post(url, headers=headers, json=body) as resp:

                data = await resp.json()

                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)

        except Exception as e:

            _LOGGER.error("Subentry flow step error %s: %s", flow_id, e, exc_info=True)

            return web.json_response({"error": f"subentry_step_error: {e}"}, status=500)



    async def get(self, request, path: str = "") -> web.Response:
        """Handle GET requests — route to internal handlers."""
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
            return await self._get_changelog(path[10:], query)
        if path == "repos/releases":
            return await self._get_repo_releases(query)
        if path.startswith("repos/status/"):
            return await self._get_repo_rt_status(path[12:])
        if path in ("favorites", "favorites/"):
            return await self._get_favorites()
        if path in ("ignored-versions", "ignored-versions/"):
            return await self._get_ignored_versions()
        if path in ("skipped-versions", "skipped-versions/"):
            return await self._get_skipped_versions()
        if path in ("settings", "settings/"):
            return await self._get_settings()
        if path.startswith("devices/"):
            entry_id = path.split("/", 1)[1]
            return await self._get_devices(entry_id)
        if path in ("config_entries", "config_entries/"):
            return await self._get_config_entries()
        if path == "config_flow/handlers":
            return await self._config_flow_handlers(request)
        if path == "version":
            return web.json_response({"version": VERSION})
        if path.startswith("translations/"):
            domain = path.split("/", 1)[1]
            lang = request.query.get("lang", "en")
            return await self._get_translations(domain, lang)
        if path.startswith("config_entries/subentries/"):
            entry_id = path.split("/")[-1]
            return await self._get_subentries(request, entry_id)
        if path == "entity_refs/find":
            return await self._entity_refs_find(query)
        if path == "device_counts":
            return await self._get_device_counts(None)
        if path.startswith("device_counts/"):
            domain = path.split("/", 1)[1]
            return await self._get_device_counts(domain)
        if path in ("github/user", "github/user/", "github/oauth/user", "github/oauth/user/"):
            return await self._github_user()
        if path.startswith("github/starred/"):
            repo = path.split("/", 2)[2] if "/" in path else ""
            return await self._github_check_starred(repo)
        if path in ("github/starred", "github/starred/"):
            return await self._github_list_starred()
        if path in ("github/repos", "github/repos/"):
            return await self._github_list_org_repos(query)
        if path in ("github/import_token", "github/import_token/"):
            return await self._github_import_token()
        if path in ("github/issue-logs", "github/issue-logs/"):
            return await self._github_issue_preview(query)

        return web.json_response({"error": "not_found"}, status=404)


    async def post(self, request, path: str = "") -> web.Response:
        """Handle POST requests — route to internal handlers."""
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
        if path in ("redownload", "redownload/"):
            return await self._redownload(body)
        if path in ("ignore", "ignore/"):
            return await self._ignore_repo(body)
        if path in ("unignore", "unignore/"):
            return await self._unignore_repo(body)
        if path in ("ignore-version", "ignore-version/"):
            return await self._ignore_version(body)
        if path in ("unignore-version", "unignore-version/"):
            return await self._unignore_version(body)
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
        if path in ("restart", "restart/"):
            return await self._restart()
        if path in ("reload", "reload/"):
            return await self._reload_core()
        if path in ("settings", "settings/"):
            return await self._update_settings(body)
        if path in ("batch/install", "batch/install/"):
            return await self._batch_install(body)
        if path in ("batch/remove", "batch/remove/"):
            return await self._batch_remove(body)
        if path in ("check_updates", "check_updates/"):
            return await self._check_updates_with_notification()
        if path in ("entity_refs/replace", "entity_refs/replace/"):
            return await self._entity_refs_replace(body, request)
        if path in ("entity_refs/reload", "entity_refs/reload/"):
            return await self._entity_refs_reload()
        # ── GitHub Auth ──
        if path in ("github/verify_token", "github/verify_token/"):
            return await self._github_verify_token(body)
        if path in ("github/star", "github/star/"):
            return await self._github_star(body)
        if path in ("github/unstar", "github/unstar/"):
            return await self._github_unstar(body)
        if path in ("github/sync-starred", "github/sync-starred/"):
            return await self._github_sync_starred(body)
        if path in ("github/sync-favorites", "github/sync-favorites/"):
            return await self._github_sync_favorites()
        if path in ("github/auto-star", "github/auto-star/"):
            return await self._github_auto_star()
        if path in ("github/create-issue", "github/create-issue/"):
            return await self._github_create_issue(body)
        # ── OAuth device flow ──
        if path in ("github/oauth/start", "github/oauth/start/"):
            return await self._github_oauth_start(body)
        if path in ("github/oauth/poll", "github/oauth/poll/"):
            return await self._github_oauth_poll(body)

        # ── Config Flow proxy ──
        if path == "config_flow/start":
            return await self._config_flow_start(request, body)
        if path == "config_flow/options/start":
            return await self._config_flow_options_start(request, body)
        if path.startswith("config_flow/options/step/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_options_step(request, flow_id, body)
        if path.startswith("config_flow/step/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_step(request, flow_id, body)
        # ── Subentry Flow proxy ──
        if path == "config_flow/subentry/start":
            return await self._config_flow_subentry_start(request, body)
        if path.startswith("config_flow/subentry/step/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_subentry_step(request, flow_id, body)

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

        # Config flow cancellation

        if path.startswith("config_flow/flow/"):

            flow_id = path.split("/")[-1]

            return await self._config_flow_cancel(request, flow_id)

        # Subentry flow cancellation

        if path.startswith("config_flow/subentry/flow/"):

            flow_id = path.split("/")[-1]

            return await self._config_flow_subentry_cancel(request, flow_id)

        return web.json_response({"error": "not_found"}, status=404)



    # ── Repositories ─────────────────────────────────────



    

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



    async def _get_session(self) -> aiohttp.ClientSession:

        """Get HA's shared aiohttp session (reuses connection pool)."""

        from homeassistant.helpers.aiohttp_client import async_get_clientsession

        return async_get_clientsession(self.hass)



    async def async_close(self) -> None:

        """No-op: shared session is managed by HA."""

        pass


    # ── GitHub helpers (GET) ──

    async def _github_user(self) -> web.Response:
        """Get current GitHub user info via GitHubClient."""
        user = await self.gh.get_user()
        if "error" in user:
            return web.json_response({"error": user["error"]}, status=401)
        return web.json_response({
            "login": user.get("login"),
            "avatar_url": user.get("avatar_url"),
        })

    async def _github_check_starred(self, repo: str) -> web.Response:
        """Check if the authenticated user has starred a repo."""
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        starred = await self.gh.check_starred(repo)
        return web.json_response({"starred": starred})

    async def _github_list_starred(self) -> web.Response:
        """Fetch starred repos via GitHubClient."""
        repos = await self.gh.list_starred()
        return web.json_response({"repos": repos, "total": len(repos)})

    async def _github_list_org_repos(self, query) -> web.Response:
        """List repos for a user/org via GitHubClient."""
        org = query.get("org", "").strip()
        if not org:
            return web.json_response({"error": "org_required", "repos": []}, status=400)
        # Normalize input
        org = org.rstrip("/")
        for prefix in ["https://github.com/", "http://github.com/", "github.com/"]:
            if org.startswith(prefix):
                org = org[len(prefix):]
        org = org.replace(".git", "").rstrip("/")
        if not org or "/" in org:
            return web.json_response({"error": "invalid_org", "repos": []}, status=400)

        repos = await self.gh.list_org_repos(org)
        if isinstance(repos, dict) and "error" in repos:
            return web.json_response(repos, status=repos.get("status", 500))
        return web.json_response({"repos": repos, "total": len(repos)})

    async def _github_import_token(self) -> web.Response:
        """Import GitHub token from HACS via GitHubClient."""
        result = await self.gh.import_from_hacs()
        if "error" in result:
            return web.json_response(result, status=result.get("status", 500))
        return web.json_response(result)

    async def _github_issue_preview(self, query) -> web.Response:
        """Preview logs and system info before creating an issue."""
        repo = (query.get("repo") if hasattr(query, "get") else query or "").strip()
        repo_info = None
        repo_domain = None
        try:
            repo_info = await self.data.get_repository(repo) if repo else None
            if repo_info:
                repo_domain = repo_info.get("domain")
        except Exception:
            pass

        logs = await self.gh.fetch_logs(repo_domain, max_lines=60)
        try:
            from homeassistant.const import __version__ as ha_version
        except ImportError:
            ha_version = getattr(self.hass, "version", "unknown") or "unknown"

        return web.json_response({
            "ha_version": ha_version,
            "vision_version": VERSION,
            "repo": repo,
            "repo_domain": repo_domain,
            "repo_version": repo_info.get("installed_version", repo_info.get("version")) if repo_info else None,
            "logs": logs[-2000:] if logs else "",
        })

    # ── GitHub helpers (POST) ──

    async def _github_verify_token(self, body: dict) -> web.Response:
        """Verify and store a GitHub token via GitHubClient."""
        token = body.get("token", "").strip()
        if not token:
            await self.data.write_storage("github_token", {})
            return web.json_response({"ok": True, "logout": True})
        result = await self.gh.verify_token(token)
        if "error" in result:
            return web.json_response(result, status=result.get("status", 400))
        return web.json_response(result)

    async def _github_star(self, body: dict) -> web.Response:
        """Star a repository via GitHubClient."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        ok = await self.gh.star_repo(repo)
        if ok:
            return web.json_response({"ok": True})
        return web.json_response({"error": "star_failed"}, status=500)

    async def _github_unstar(self, body: dict) -> web.Response:
        """Unstar a repository via GitHubClient."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        ok = await self.gh.unstar_repo(repo)
        if ok:
            return web.json_response({"ok": True})
        return web.json_response({"error": "unstar_failed"}, status=500)

    async def _github_sync_starred(self, body: dict) -> web.Response:
        """Add selected starred repos as custom repositories."""
        selected = body.get("repos", [])
        if not selected:
            return web.json_response({"error": "no_repos"}, status=400)
        results = []
        for item in selected:
            full_name = item.get("full_name", "")
            category = item.get("category", "integration")
            if not full_name or "/" not in full_name:
                results.append({"full_name": full_name, "success": False, "error": "invalid_name"})
                continue
            try:
                result = await self.operator.add_custom_repository(full_name, category)
                results.append({"full_name": full_name, "success": result.get("success", False),
                                "error": result.get("error", "")})
            except Exception as e:
                results.append({"full_name": full_name, "success": False, "error": str(e)})
        return web.json_response({"results": results})

    async def _github_auto_star(self) -> web.Response:
        """Auto-star hacs-vision repo via GitHubClient."""
        ok = await self.gh.auto_star("C3H3-AI/hacs-vision")
        return web.json_response({"ok": True, "already_starred": not ok} if ok else {"ok": True})

    async def _github_create_issue(self, body: dict) -> web.Response:
        """Create a GitHub issue with auto-collected logs via GitHubClient."""
        repo = body.get("repo", "").strip()
        title = body.get("title", "").strip()
        user_body = body.get("body", "").strip()
        repo_domain = body.get("domain")

        if not repo or "/" not in repo:
            return web.json_response({"error": "repo required (format: owner/repo)"}, status=400)
        if not title:
            return web.json_response({"error": "title required"}, status=400)

        repo_info = None
        if not repo_domain:
            try:
                repo_info = await self.data.get_repository(repo)
                if repo_info:
                    repo_domain = repo_info.get("domain")
            except Exception:
                pass

        issue_body = await self.gh.build_issue_body(repo_info, title, user_body, repo_domain)

        # Handle screenshots
        screenshot_files = []
        screenshots = body.get("screenshots", [])
        if screenshots and isinstance(screenshots, list):
            import uuid as _uuid
            _LOGGER.info("Saving %d screenshots to HA www...", len(screenshots))
            for i, ss_b64 in enumerate(screenshots):
                if not ss_b64 or not isinstance(ss_b64, str) or len(ss_b64) < 100:
                    continue
                if len(ss_b64) > 3 * 1024 * 1024:
                    _LOGGER.warning("Screenshot %d too large, skipped", i)
                    continue
                fname = f"issue_{_uuid.uuid4().hex[:12]}_{i+1}.png"
                url = await self._save_screenshot(ss_b64, fname)
                if url:
                    issue_body += f"\n\n![screenshot.png{i+1}]({url})"
                    screenshot_files.append(fname)

        result = await self.gh.create_issue(repo, title, issue_body, body.get("labels", ["bug"]))

        if result.get("ok"):
            if screenshot_files:
                _LOGGER.info("Screenshots will be cleaned up in 5 minutes")
                asyncio.ensure_future(self._delayed_cleanup(screenshot_files, 300))
            return web.json_response({
                "ok": True,
                "issue_url": result.get("issue_url", ""),
                "issue_number": result.get("issue_number", ""),
            })
        else:
            if screenshot_files:
                self._cleanup_screenshots(screenshot_files)
            return web.json_response({"error": result.get("error", "issue_creation_failed")},
                                     status=result.get("status", 500))

    async def _github_oauth_start(self, body: dict) -> web.Response:
        """Start GitHub OAuth device flow via GitHubClient."""
        result = await self.gh.oauth_start()
        if "error" in result:
            return web.json_response(result, status=result.get("status", 400))
        return web.json_response(result)

    async def _github_oauth_poll(self, body: dict) -> web.Response:
        """Poll OAuth device flow via GitHubClient."""
        device_code = body.get("device_code", "")
        if not device_code:
            return web.json_response({"error": "device_code_required"}, status=400)
        result = await self.gh.oauth_poll(device_code)
        if "error" in result:
            return web.json_response(result, status=result.get("status", 400))
        return web.json_response(result)


    async def _get_readme(self, full_name: str) -> web.Response:

        """Proxy GitHub README request with server-side cache (via GitHubClient)."""

        html = await self.gh.get_readme_html(full_name)

        if html is not None:

            return web.Response(text=html, content_type="text/html")

        return web.json_response({"error": "not_found"}, status=404)



    async def _get_changelog(self, full_name: str, query) -> web.Response:

        """Proxy GitHub Releases API for changelog preview, via GitHubClient."""

        tag = query.get("tag", "")

        result = await self.gh.get_changelog(full_name, tag)

        if "error" in result:

            if result.get("error") == "rate_limited":

                return web.json_response({"error": "rate_limited"}, status=429)

            return web.json_response({"error": result["error"]}, status=502)

        return web.json_response(result)



    # ── Write operations ─────────────────────────────────



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



    async def _purge_from_repos_storage(self, repo_name: str) -> list[str]:

        """Purge a repo entry from .storage/hacs.repositories by full_name."""

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

        """Remove repo from .storage/hacs.data installed lists by name."""

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

        """Completely purge an archived repository from HACS storage."""

        repo_name = body.get("repository", "")

        if not repo_name:

            return web.json_response({"error": "repository required"}, status=400)



        # 1. Remove from archived_repositories in HACS config (.storage/hacs.hacs)

        config = await self.data.get_config()

        archived = config.get("archived_repositories", [])

        if repo_name in archived:

            archived.remove(repo_name)

            config["archived_repositories"] = archived

            await self.data.update_config(config)



        # 2. Also update HACS in-memory state to prevent it from reverting our change

        if self.operator and self.operator.available:

            try:

                hacs_config = self.operator._hacs.configuration

                if hasattr(hacs_config, 'archived_repositories'):

                    hacs_archived = list(hacs_config.archived_repositories or [])

                    if repo_name in hacs_archived:

                        hacs_archived.remove(repo_name)

                        hacs_config.archived_repositories = hacs_archived

                # Trigger HACS to persist its in-memory state to disk

                await self.operator._hacs.data.async_write()

            except Exception as e:

                _LOGGER.warning("Failed to update HACS memory state: %s", e, exc_info=True)



        # 3-4. Purge from hacs.repositories + hacs.data

        purged_ids = await self._purge_from_repos_storage(repo_name)

        await self._purge_from_data_storage(repo_name)



        # 5. Try HACS in-memory uninstall if still tracked

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



        # 3-4. Purge old repo from storage

        await self._purge_from_repos_storage(old_name)

        await self._purge_from_data_storage(old_name)



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



        # 2-3. Purge old repo from storage

        purged_ids = await self._purge_from_repos_storage(old_name)

        await self._purge_from_data_storage(old_name)



        # 4. HACS in-memory uninstall

        await self.operator.remove_repository(old_name)



        # 5. Invalidate index

        self.operator.invalidate_index()



        return web.json_response({

            "success": True,

            "repository": old_name,

            "purged_ids": purged_ids,

        })



    # ── Restart Home Assistant ────────────────────────────



    async def _get_settings(self) -> web.Response:

        """Get user settings (refresh interval, default view, etc)."""

        settings = await self.data.get_settings()

        return web.json_response(settings)



    async def _update_settings(self, body: dict) -> web.Response:

        """Save user settings."""

        # Handle hide_hacs_panel toggle

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

                    # Re-register exactly as HACS does in frontend.py

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

        ok = await self.data.set_settings(body)

        return web.json_response({"success": ok})



    async def _get_devices(self, entry_id: str) -> web.Response:

        """Get devices & entities for a config entry, grouped by area."""

        try:

            from homeassistant.helpers import device_registry as dr, entity_registry as er

            import json



            device_reg = dr.async_get(self.hass)

            entity_reg = er.async_get(self.hass)



            # Get all devices for this config entry

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



            # Build device_id → entities index (one pass, O(n))

            device_entities: dict[str, list] = {}

            for entity_entry in entity_reg.entities.values():

                did = entity_entry.device_id

                if did:

                    device_entities.setdefault(did, []).append(entity_entry)

                if entity_entry.config_entry_id == entry_id:

                    seen_entity_ids.add(entity_entry.entity_id)



            # Iterate devices matching this config entry (O(m) with O(1) entity lookup)

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



            # Collect orphan entities (belong to this config entry but no device)

            for entity_entry in entity_reg.entities.values():

                if entity_entry.entity_id in seen_entity_ids:

                    continue

                if entity_entry.config_entry_id != entry_id:

                    continue

                orphan_entities.append(_entity_to_dict(entity_entry))

            orphan_entities.sort(key=lambda e: (e["disabled"], e["entity_id"]))



            # Group by area

            groups = {}

            for dev in devices:

                area = dev.pop("area") or "Other"

                groups.setdefault(area, []).append(dev)



            # Sort: named areas first, "Other" last

            sorted_groups = sorted(groups.items(), key=lambda x: (x[0] == "Other", x[0] or ""))



            result_groups = [{"area": area, "devices": devs} for area, devs in sorted_groups]

            if orphan_entities:

                result_groups.append({"area": "No area assigned", "devices": [{

                    "id": "_orphan",

                    "name": "Entities without area",

                    "model": None,

                    "manufacturer": None,

                    "sw_version": None,

                    "hw_version": None,

                    "entities": orphan_entities,

                }]})



            return web.json_response({"groups": result_groups})

        except Exception as e:

            _LOGGER.error("Failed to get devices: %s", e, exc_info=True)

            return web.json_response({"error": str(e)}, status=500)



    async def _get_config_entries(self) -> web.Response:

        """Get HA config entries map for installed integrations."""

        mapping = await self.data.get_config_entries_map()

        return web.json_response({"entries": mapping})



    async def _get_device_counts(self, domain: str | None = None) -> web.Response:

        """Get device and entity counts for a given domain (or all domains if domain is None)."""

        from homeassistant.helpers import device_registry as dr, entity_registry as er

        import re

        if domain is not None:

            if not re.match(r'^[a-zA-Z0-9_-]+$', domain):

                return web.json_response({"error": "invalid_domain"}, status=400)

        try:

            dev_reg = dr.async_get(self.hass)

            ent_reg = er.async_get(self.hass)

            if domain:

                # Single domain

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

                    "domain": safe,

                    "devices": len(device_ids),

                    "entities": entity_count,

                })

            else:

                # All domains — aggregate by domain

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

            return web.json_response({"error": str(e)}, status=500)



    async def _get_translations(self, domain: str, lang: str) -> web.Response:

        """Read translations from a custom component's translations directory.



        Returns translations for the specified domain and language.

        The translations are returned as-is (nested JSON matching HA's format)

        under a ``data`` key that the frontend can traverse.

        """

        import os

        import re

        # Sanitize domain to prevent path traversal — only allow safe chars

        if not re.match(r'^[a-zA-Z0-9_-]+$', domain):

            return web.json_response({"error": "invalid_domain"}, status=400)

        safe_domain = domain



        # Try multiple possible translation file locations

        # HA 2026.x stores custom component translations in:

        #   /config/custom_components/{domain}/translations/{lang}.json

        # Older versions might use different naming

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

                        return web.json_response({"data": data, "domain": safe_domain, "lang": lang_file.replace(".json", "")})

                except (json.JSONDecodeError, OSError) as e:

                    _LOGGER.warning("Failed to read translations for %s: %s", safe_domain, e)

                    continue



        return web.json_response({"data": {}, "domain": safe_domain, "lang": lang, "error": "not_found"}, status=404)



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



    # ── Entity Reference Finder ─────────────────────────



    async def _entity_refs_find(self, query) -> web.Response:

        """Find all references to an entity_id."""

        entity_id = query.get("q", "")

        if not entity_id:

            return web.json_response({"error": "q (entity_id) required"}, status=400)

        try:

            finder = EntityRefFinder(self.hass)

            refs = await finder.find(entity_id)

            # Group by source_type

            by_type: dict[str, list] = {}

            for r in refs:

                by_type.setdefault(r["source_type"], []).append(r)

            return web.json_response({

                "entity_id": entity_id,

                "total": len(refs),

                "affected_sources": len({(r["source_type"], r["source_id"]) for r in refs}),

                "by_type": by_type,

                "references": refs,

            })

        except Exception as e:

            _LOGGER.error("Entity refs find failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)



    async def _entity_refs_replace(self, body: dict, request: web.Request | None = None) -> web.Response:

        """Replace entity_id references (preview or execute)."""

        old_id = body.get("old_id", "")

        new_id = body.get("new_id", "")

        preview = body.get("preview", True)

        if not old_id or not new_id:

            return web.json_response({"error": "old_id and new_id required"}, status=400)

        try:

            token = self._extract_token(request) if request else self._current_token

            finder = EntityRefFinder(self.hass, hass_token=token)

            result = await finder.replace(old_id, new_id, preview=preview)

            if not preview and result.get("total_updated", 0) > 0:

                # Auto-reload affected components

                reload_result = await finder.reload_affected()

                result["reload"] = reload_result

            return web.json_response(result)

        except Exception as e:

            _LOGGER.error("Entity refs replace failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)



    async def _entity_refs_reload(self) -> web.Response:

        """Reload automations/scripts/scenes after manual changes."""

        try:

            finder = EntityRefFinder(self.hass)

            result = await finder.reload_affected()

            return web.json_response(result)

        except Exception as e:

            _LOGGER.error("Entity refs reload failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)



    async def _restart(self) -> web.Response:

        """Restart Home Assistant via homeassistant.restart service."""

        try:

            await self.hass.services.async_call("homeassistant", "restart", blocking=False)

            return web.json_response({"success": True})

        except Exception as e:

            _LOGGER.error("Restart failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)



    async def _reload_core(self) -> web.Response:

        """Reload core config without full restart (faster for plugins/themes)."""

        try:

            await self.hass.services.async_call("homeassistant", "reload_core_config", blocking=True)

            return web.json_response({"success": True})

        except Exception as e:

            _LOGGER.error("Core reload failed: %s", e, exc_info=True)

            return web.json_response({"success": False, "error": str(e)}, status=500)





def _read_file_binary(path: str) -> bytes:

    """Blocking binary file read — must run via executor."""

    with open(path, "rb") as f:

        return f.read()





def _read_json_text(path: str) -> dict | None:

    """Blocking JSON text file read — must run via executor."""

    try:

        with open(path, "r", encoding="utf-8") as f:

            return json.load(f)

    except Exception:

        return None





class HACSBrandIconView(HomeAssistantView):

    """Serve custom component brand icons (no auth - for <img> tags).



    Supports:

      /api/hacs_vision_brand/{domain}        -> icon.png / icon.svg

      /api/hacs_vision_brand/{domain}/icon   -> icon.png / icon.svg

      /api/hacs_vision_brand/{domain}/logo   -> logo.png / logo.svg

    """



    url = "/api/hacs_vision_brand/{domain:.*}"

    name = "api:hacs_vision_brand"

    requires_auth = False



    def __init__(self, hass):

        self.hass = hass



    async def get(self, request, domain):

        import os

        import re

        # Sanitize domain to prevent path traversal

        if not re.match(r'^[a-zA-Z0-9_-]+$', domain):

            return web.Response(status=404)

        safe_domain = domain



        # Parse path: could be "cn_im_hub" or "cn_im_hub/icon" or "cn_im_hub/logo"

        parts = safe_domain.split("/")

        actual_domain = parts[0]

        asset_type = parts[1] if len(parts) > 1 else "icon"



        base = self.hass.config.path("custom_components", actual_domain, "brand")

        for ext in ("png", "svg"):

            path = os.path.join(base, f"{asset_type}.{ext}")

            if await self.hass.async_add_executor_job(os.path.isfile, path):

                content_type = "image/svg+xml" if ext == "svg" else "image/png"

                body = await self.hass.async_add_executor_job(

                    _read_file_binary, path

                )

                return web.Response(body=body, content_type=content_type)

        return web.Response(status=404)

