"""REST API endpoints + static file serving for HACS Vision."""
from __future__ import annotations
import json
import logging
import os
import time
import aiohttp
from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.util import dt as dt_util

from .const import API_BASE, VERSION
from .hacs_data import HACSData
from .hacs_operator import HACSOperator
from .backup import BackupManager
from .dependency_checker import DependencyChecker
from .entity_ref_finder import EntityRefFinder

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

# Server-side README cache: {full_name: {html, timestamp}}
_README_CACHE: dict[str, dict] = {}
_README_CACHE_TTL = 3600  # 1 hour

# GitHub release download count cache: {full_name: {count, timestamp}}
_DOWNLOAD_CACHE: dict[str, dict] = {}
_DOWNLOAD_CACHE_TTL = 7200  # 2 hours


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
        self._session: aiohttp.ClientSession | None = None
        self._github_token: str | None = None

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

    async def _get_vision_github_token(self) -> str | None:
        """Get GitHub token from hacs-vision own storage."""
        try:
            data = await self.data.async_load("github_token")
            if data and isinstance(data, dict) and data.get("token"):
                return data["token"]
        except Exception:
            pass
        return None

    async def _get_active_github_token(self) -> str | None:
        """Try hacs-vision token first, then HACS token."""
        token = await self._get_vision_github_token()
        if token:
            return token
        return self._get_github_token()

    async def _github_api(self, method: str, path: str, body: dict | None = None) -> dict:
        """Call GitHub API with the active token."""
        token = await self._get_active_github_token()
        headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        url = f"https://api.github.com{path}"
        try:
            async with aiohttp.ClientSession() as session:
                kwargs = {"headers": headers, "timeout": aiohttp.ClientTimeout(total=15)}
                if body is not None and method in ("POST", "PATCH", "PUT"):
                    kwargs["json"] = body
                async with session.request(method, url, **kwargs) as resp:
                    if resp.status in (204, 304):
                        return {"status": resp.status}
                    if resp.status == 404:
                        return {"error": "not_found", "status": 404}
                    text = await resp.text()
                    try:
                        return {"status": resp.status, **json.loads(text)}
                    except json.JSONDecodeError:
                        return {"status": resp.status, "text": text}
        except Exception as e:
            return {"error": str(e), "status": 0}

    async def _github_verify_token(self, body: dict) -> web.Response:
        """Verify and store a GitHub personal access token."""
        token = body.get("token", "").strip()
        if not token:
            return web.json_response({"error": "token_required"}, status=400)
        # Verify by calling GitHub user API
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get("https://api.github.com/user", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    if resp.status != 200:
                        return web.json_response({"error": "invalid_token", "status": resp.status}, status=400)
                    user = await resp.json()
                    login = user.get("login", "?")
                    # Check rate limit
                    async with session.get("https://api.github.com/rate_limit", headers=headers,
                                           timeout=aiohttp.ClientTimeout(total=10)) as rl_resp:
                        rl = await rl_resp.json()
                        remaining = rl.get("rate", {}).get("remaining", 0)
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)
        # Store token
        await self.data.async_save("github_token", {"token": token, "user": login})
        self._github_token = token
        return web.json_response({"ok": True, "user": login, "rate_limit_remaining": remaining})

    async def _github_user(self) -> web.Response:
        """Get current GitHub user info."""
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"error": "not_authenticated"}, status=401)
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get("https://api.github.com/user", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    if resp.status != 200:
                        return web.json_response({"error": "token_invalid"}, status=401)
                    user = await resp.json()
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)
        return web.json_response({"login": user.get("login"), "avatar_url": user.get("avatar_url")})

    async def _github_star(self, body: dict) -> web.Response:
        """Star a repository."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"error": "not_authenticated"}, status=401)
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json",
                   "Content-Length": "0"}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.put(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    if resp.status == 204:
                        return web.json_response({"ok": True})
                    return web.json_response({"error": f"star_failed_{resp.status}"}, status=resp.status)
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

    async def _github_unstar(self, body: dict) -> web.Response:
        """Unstar a repository."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"error": "not_authenticated"}, status=401)
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.delete(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                          timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    if resp.status == 204:
                        return web.json_response({"ok": True})
                    return web.json_response({"error": f"unstar_failed_{resp.status}"}, status=resp.status)
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

    async def _github_check_starred(self, repo: str) -> web.Response:
        """Check if the authenticated user has starred a repo."""
        if not repo or "/" not in repo:
            return web.json_response({"error": "invalid_repo"}, status=400)
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"starred": False})
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    return web.json_response({"starred": resp.status == 204})
        except Exception as e:
            return web.json_response({"starred": False, "error": str(e)})

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
            return await self._get_changelog(path[10:], query)
        if path == "repos/releases":
            return await self._get_repo_releases(query)
        if path.startswith("repos/status/"):
            return await self._get_repo_rt_status(path[12:])
        if path in ("favorites", "favorites/"):
            return await self._get_favorites()
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
        if path.startswith("device_counts/"):
            domain = path.split("/", 1)[1]
            return await self._get_device_counts(domain)
        if path in ("github/user", "github/user/"):
            return await self._github_user()
        if path.startswith("github/starred/"):
            repo = path.split("/", 2)[2] if "/" in path else ""
            return await self._github_check_starred(repo)

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
        if path in ("redownload", "redownload/"):
            return await self._redownload(body)
        if path in ("ignore", "ignore/"):
            return await self._ignore_repo(body)
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
            return await self._entity_refs_replace(body)
        if path in ("entity_refs/reload", "entity_refs/reload/"):
            return await self._entity_refs_reload()
        # ── GitHub Auth ──
        if path in ("github/verify_token", "github/verify_token/"):
            return await self._github_verify_token(body)
        if path in ("github/star", "github/star/"):
            return await self._github_star(body)
        if path in ("github/unstar", "github/unstar/"):
            return await self._github_unstar(body)

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

    # ── Config Flow proxy (HTTP passthrough to HA native API) ──

    def _extract_token(self, request: web.Request) -> str:
        """Extract the bearer token from the incoming request's Authorization header."""
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            return auth[7:]
        return ""

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
        """Start a new config flow — proxy to HA native REST API."""
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
            payload = {"handler": handler, "show_advanced_options": body.get("show_advanced_options", False)}
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

    async def _enrich_download_counts(self, repos: list[dict]) -> None:
        """Enrich repos with GitHub release download counts where HACS data is 0."""
        import aiohttp
        now = time.time()
        need_fetch = []
        for r in repos:
            if r.get("downloads", 0) > 0:
                continue  # already has HACS download data
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

        import asyncio

        # Use a shared session for efficiency
        async def _fetch_all():
            async with aiohttp.ClientSession() as session:
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
                                    _DOWNLOAD_CACHE[full_name] = {"count": total, "timestamp": now}
                                    return full_name, total
                        except Exception:
                            pass
                        _DOWNLOAD_CACHE[full_name] = {"count": 0, "timestamp": now}
                        return full_name, 0

                tasks = [_fetch_one(fn) for fn in need_fetch]
                return await asyncio.gather(*tasks, return_exceptions=True)

        results = await _fetch_all()
        result_map = {}
        for res in results:
            if isinstance(res, tuple):
                result_map[res[0]] = res[1]

        # Apply fetched counts
        for r in repos:
            fn = r.get("full_name", "")
            if fn in result_map and result_map[fn]:
                r["downloads"] = result_map[fn]

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

        # Enrich download counts from GitHub releases — limit initial scan to installed repos only
        try:
            installed = [r for r in repos if r.get("installed")]
            if installed:
                await self._enrich_download_counts(installed)
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

        # Apply tag filter (custom / new) — moved from client-side to server-side
        if tag == "custom":
            repos = [r for r in repos if r.get("custom") or r.get("is_custom")]
        elif tag == "new":
            repos = [r for r in repos if r.get("new") or r.get("status") == "new"]

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
        return web.json_response({"installed": installed})

    async def _get_stats(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        if not repos:
            repos = await self.data.get_all_repositories()
        installed_count = sum(1 for r in repos if r.get("installed"))
        updates_count = sum(1 for r in repos if r.get("has_update"))
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
        updates = self.operator.get_available_updates()
        return web.json_response({"updates": updates})

    async def _get_config(self) -> web.Response:
        config = await self.data.get_config()
        return web.json_response(config)

    async def _get_custom_repos(self) -> web.Response:
        repos = await self.operator.get_all_repos_from_hacs()
        custom = [r for r in repos if r.get("custom") or r.get("is_custom")]
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

    async def _get_changelog(self, full_name: str, query) -> web.Response:
        """Proxy GitHub Releases API for changelog preview.

        Query params:
          - tag (optional): specific tag to fetch changelog for.
            If omitted, fetches the latest stable (non-prerelease) release.
        """
        session = await self._get_session()
        tag = query.get("tag", "")
        if tag:
            url = f"https://api.github.com/repos/{full_name}/releases/tags/{tag}"
        else:
            url = f"https://api.github.com/repos/{full_name}/releases/latest"
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
                    # If tag endpoint, data is a single release object;
                    # if latest endpoint, data is also a single release object.
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
        # Supplement from GitHub API if operator returned too few
        if len(releases) < 3:
            repo = self.operator._find_repo(repo_id)
            if repo and repo.data.full_name:
                try:
                    session = await self._get_session()
                    url = f"https://api.github.com/repos/{repo.data.full_name}/releases?per_page=20"
                    gh_headers = {"Accept": "application/vnd.github.v3+json"}
                    token = self._get_github_token()
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

        # 3. Purge from hacs.repositories (the master repo data dict)
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

        # 4. Purge from hacs.data installed-repo lists
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

    # ── Restart Home Assistant ────────────────────────────

    async def _get_settings(self) -> web.Response:
        """Get user settings (refresh interval, default view, etc)."""
        settings = await self.data.get_settings()
        return web.json_response(settings)

    async def _update_settings(self, body: dict) -> web.Response:
        """Save user settings."""
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

            for device in device_reg.devices.values():
                if entry_id not in device.config_entries:
                    continue
                entities = []
                for entity_entry in entity_reg.entities.values():
                    if entity_entry.device_id != device.id:
                        continue
                    entities.append(_entity_to_dict(entity_entry))
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
                area = dev.pop("area") or "其他"
                groups.setdefault(area, []).append(dev)

            # Sort: named areas first, "其他" last
            sorted_groups = sorted(groups.items(), key=lambda x: (x[0] == "其他", x[0] or ""))

            result_groups = [{"area": area, "devices": devs} for area, devs in sorted_groups]
            if orphan_entities:
                result_groups.append({"area": "无关联设备", "devices": [{
                    "id": "_orphan",
                    "name": "未关联设备的实体",
                    "model": None,
                    "manufacturer": None,
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

    async def _get_device_counts(self, domain: str) -> web.Response:
        """Get device and entity counts for a given domain."""
        from homeassistant.helpers import device_registry as dr, entity_registry as er
        import re
        # Sanitize domain to prevent path traversal
        if not re.match(r'^[a-zA-Z0-9_-]+$', domain):
            return web.json_response({"error": "invalid_domain"}, status=400)
        safe = domain
        try:
            dev_reg = dr.async_get(self.hass)
            ent_reg = er.async_get(self.hass)
            # Count devices and entities linked to config entries of this domain
            device_ids = set()
            entity_count = 0
            for entry in self.hass.config_entries.async_entries():
                if entry.domain != safe:
                    continue
                # Devices linked to this config entry
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
        except Exception as e:
            _LOGGER.error("Failed to get device counts for %s: %s", safe, e, exc_info=True)
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
            if os.path.isfile(trans_path):
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
            self.operator.invalidate_index()
            repos = await self.operator.get_all_repos_from_hacs()
            updatable = [r for r in repos if r.get("has_update")]
            pending_restart = [r for r in repos if r.get("pending_restart")]

            if updatable:
                names = "\n".join(f"- **{r.get('manifest_name') or r.get('name', r.get('full_name', '?'))}**: {r.get('installed_version', '?')} → {r.get('latest_version', '?')}" for r in updatable[:10])
                title = f"HACS Vision: {len(updatable)} 个仓库可更新"
                message = f"发现 **{len(updatable)}** 个仓库可以更新：\n{names}"
                if len(updatable) > 10:
                    message += f"\n…以及 {len(updatable) - 10} 个其他仓库"
                await self.data.send_persistent_notification(title, message)

            if pending_restart:
                names = ", ".join(r.get('manifest_name') or r.get('full_name', '?') for r in pending_restart)
                await self.data.send_persistent_notification(
                    f"HACS Vision: {len(pending_restart)} 个仓库待重启",
                    f"以下仓库更新后需要重启 HA：{names}"
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

    async def _entity_refs_replace(self, body: dict) -> web.Response:
        """Replace entity_id references (preview or execute)."""
        old_id = body.get("old_id", "")
        new_id = body.get("new_id", "")
        preview = body.get("preview", True)
        if not old_id or not new_id:
            return web.json_response({"error": "old_id and new_id required"}, status=400)
        try:
            finder = EntityRefFinder(self.hass)
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
            if os.path.isfile(path):
                content_type = "image/svg+xml" if ext == "svg" else "image/png"
                body = await self.hass.async_add_executor_job(
                    _read_file_binary, path
                )
                return web.Response(body=body, content_type=content_type)
        return web.Response(status=404)
