"""REST API endpoints + static file serving for HACS Vision."""
from __future__ import annotations
import json
import logging
import os

from aiohttp import web
from homeassistant.components.http import HomeAssistantView

from .const import API_BASE, VERSION
from .hacs_data import HACSData
from .hacs_operator import HACSOperator
from .backup import BackupManager
from .dependency_checker import DependencyChecker
from .response import _error, _ok, _not_found, _bad_request
from .api_mixins.github_auth import GitHubAuthMixin
from .api_mixins.github_actions import GitHubActionsMixin
from .api_mixins.hacs_ops import HACSOpsMixin
from .api_mixins.gitee import GiteeMixin
from .hacs_history import HACSHubHistory

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
            return _bad_request("invalid_path")
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
            return _error("file_not_found", 404)

    def _read_file(self, path: str) -> str:
        """Synchronous file read."""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()


class HACSEnhancedAPI(GitHubAuthMixin, GitHubActionsMixin, HACSOpsMixin, GiteeMixin, HomeAssistantView):
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

    # ── GET ──────────────────────────────────────────────

    async def get(self, request, path: str = "") -> web.Response:
        """Handle GET requests."""
        if path.startswith("static/"):
            return _error("use_static_view", 404)

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
        if path in ("history", "history/"):
            return await self._get_history()
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

        # ── Gitee ──
        if path in ("gitee/user", "gitee/user/"):
            return await self._gitee_user()
        if path in ("gitee/search", "gitee/search/"):
            return await self._gitee_search(query)
        if path.startswith("gitee/repos"):
            return await self._gitee_list_repos(query)
        if path.startswith("gitee/repo"):
            return await self._gitee_repo(query)
        if path.startswith("gitee/releases"):
            return await self._gitee_releases(query)

        return _not_found()

    async def _get_history(self) -> web.Response:
        history = HACSHubHistory(self.hass)
        records = await history.get_history()
        return web.json_response({"history": records})

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

        # ── Gitee ──
        if path in ("gitee/verify_token", "gitee/verify_token/"):
            return await self._gitee_verify_token(body)
        if path in ("gitee/add_repo", "gitee/add_repo/"):
            return await self._gitee_add_repo(body)

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

        return _not_found()

    # ── Config Flow proxy methods are inherited from HACSOpsMixin ──

    # ── DELETE ───────────────────────────────────────────

    async def delete(self, request, path: str = "") -> web.Response:
        """Handle DELETE requests."""
        if path == "config/custom":
            try:
                body = await request.json()
            except (json.JSONDecodeError, ValueError):
                return _bad_request("invalid_json")
            return await self._remove_custom_repo(body)
        # Config flow cancellation
        if path.startswith("config_flow/flow/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_cancel(request, flow_id)
        # Subentry flow cancellation
        if path.startswith("config_flow/subentry/flow/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_subentry_cancel(request, flow_id)
        return _not_found()


def _read_file_binary(path: str) -> bytes:
    """Blocking binary file read — must run via executor."""
    with open(path, "rb") as f:
        return f.read()


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
