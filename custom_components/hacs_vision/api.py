"""HACS Vision API 平台。"""
from __future__ import annotations
import asyncio
import json
import logging
import os
import re

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers.network import NoURLAvailableError, get_url

from .const import API_BASE, VERSION
from .hacs_data import HACSData
from .hacs_operator import HACSOperator
from .backup import BackupManager
from .dependency_checker import DependencyChecker
from .response import _error, _not_found, _bad_request
from .api_mixins.github_auth import GitHubAuthMixin
from .api_mixins.github_actions import GitHubActionsMixin
from .api_mixins.hacs_ops import HACSOpsMixin
from .api_mixins.readme_translate import ReadmeTranslateMixin
from .hacs_history import HACSHubHistory

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

class HACSEnhancedStaticView(HomeAssistantView):
    """提供前端静态文件——JS/CSS 资源无需鉴权。"""

    url = f"{API_BASE}/static/{{filename:.*}}"
    name = "api:hacs_vision_static"
    requires_auth = False

    def __init__(self, hass) -> None:
        self.hass = hass

    async def get(self, request, filename: str = "panel.js") -> web.Response:
        """提供静态文件。"""
        filepath = os.path.join(FRONTEND_DIR, filename)

        if os.path.commonpath([os.path.realpath(filepath), os.path.realpath(FRONTEND_DIR)]) != os.path.realpath(FRONTEND_DIR):
            return _bad_request("invalid_path")
        try:
            content = await self.hass.async_add_executor_job(self._read_file, filepath)
            ctype = "application/javascript" if filename.endswith(".js") else "text/html" if filename.endswith(".html") else "text/plain"

            if filename.endswith(".html"):
                content = content.replace("__VERSION__", VERSION)
            resp = web.Response(text=content, content_type=ctype)

            if filename.endswith(".html") or filename.endswith(".js") or filename == "build.json":
                resp.headers["Cache-Control"] = "no-cache, must-revalidate"
            else:
                resp.headers["Cache-Control"] = "public, max-age=3600"
            return resp
        except FileNotFoundError:
            return _error("file_not_found", 404)

    def _read_file(self, path: str) -> str:
        """同步读取文件。"""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

class HACSEnhancedAPI(GitHubAuthMixin, GitHubActionsMixin, HACSOpsMixin, ReadmeTranslateMixin, HomeAssistantView):
    """HACS Vision REST API——数据端点（需鉴权）。"""

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
        # 安装完成后安排首次从 HACS 自动导入
        self._auto_import_done = False
        self._oauth_device = None
        self._oauth_device_code = None
        self._pending_cleanups: set[asyncio.Task] = set()

    @property
    def _ha_base_url(self) -> str:
        """动态获取 HA 基础地址（优先内网，回退外网）。"""
        try:
            return get_url(self.hass)
        except NoURLAvailableError:
            return self.hass.config.external_url or "http://localhost:8123"

    def _forbid_non_admin(self, request) -> web.Response | None:
        """要求管理员用户——面板注册仅管理员可用，但任何已鉴权的非管理员都能直接调用安装/移除/重启等端点。"""

        user = request.get("hass_user")
        if user is None or not user.is_admin:
            return _error("admin_required", 403)
        return None

    async def get(self, request, path: str = "") -> web.Response:
        """处理 GET 请求。"""
        if (resp := self._forbid_non_admin(request)) is not None:
            return resp
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
        if path == "repos/refs":
            return await self._get_repo_refs(query)
        if path.startswith("repos/status/"):
            return await self._get_repo_rt_status(path[len("repos/status/"):])
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

        return _not_found()

    async def _get_history(self) -> web.Response:
        history = HACSHubHistory(self.hass)
        records = await history.get_history()
        return web.json_response({"history": records})

    async def post(self, request, path: str = "") -> web.Response:
        """处理 POST 请求。"""
        if (resp := self._forbid_non_admin(request)) is not None:
            return resp
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
        if path == "repos/install_ref":
            return await self._install_repo_ref(body)
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
        if path in ("readme/translate", "readme/translate/"):
            return await self._translate_readme_endpoint(body)
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
        # ── GitHub 鉴权 ──
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
        # ── OAuth 设备流 ──
        if path in ("github/oauth/start", "github/oauth/start/"):
            return await self._github_oauth_start(body)
        if path in ("github/oauth/poll", "github/oauth/poll/"):
            return await self._github_oauth_poll(body)

        # ── 配置流代理 ──
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
        # ── 子配置项流代理 ──
        if path == "config_flow/subentry/start":
            return await self._config_flow_subentry_start(request, body)
        if path.startswith("config_flow/subentry/step/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_subentry_step(request, flow_id, body)

        return _not_found()

    async def delete(self, request, path: str = "") -> web.Response:
        """处理 DELETE 请求。"""
        if (resp := self._forbid_non_admin(request)) is not None:
            return resp
        if path == "config/custom":
            try:
                body = await request.json()
            except (json.JSONDecodeError, ValueError):
                return _bad_request("invalid_json")
            return await self._remove_custom_repo(body)
        # 配置流取消
        if path.startswith("config_flow/flow/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_cancel(request, flow_id)
        # 子配置项流取消
        if path.startswith("config_flow/subentry/flow/"):
            flow_id = path.split("/")[-1]
            return await self._config_flow_subentry_cancel(request, flow_id)
        return _not_found()

def _read_file_binary(path: str) -> bytes:
    """阻塞式二进制文件读取——须通过 executor 执行。"""
    with open(path, "rb") as f:
        return f.read()

class HACSBrandIconView(HomeAssistantView):
    """提供自定义集成品牌图标（公开静态资源，供前端 <img> 引用，无需鉴权）。"""

    url = "/api/hacs_vision_brand/{domain:.*}"
    name = "api:hacs_vision_brand"
    requires_auth = False

    def __init__(self, hass):
        self.hass = hass

    async def get(self, request, domain):
        # 先解析路径：可能是 "cn_im_hub"、"cn_im_hub/icon" 或 "cn_im_hub/logo"
        parts = domain.split("/")
        actual_domain = parts[0]
        asset_type = parts[1] if len(parts) > 1 else "icon"
        # 分段单独校验：把整个路径当一个令牌校验会拒绝文档规定的 /icon 与 /logo 子路径。
        if not re.match(r'^[a-zA-Z0-9_-]+$', actual_domain) \
                or not re.match(r'^(icon|logo)$', asset_type):
            return web.Response(status=404)

        base = self.hass.config.path("custom_components", actual_domain, "brand")
        for ext in ("png", "svg"):
            path = os.path.join(base, f"{asset_type}.{ext}")
            if await self.hass.async_add_executor_job(os.path.isfile, path):
                content_type = "image/svg+xml" if ext == "svg" else "image/png"
                body = await self.hass.async_add_executor_job(
                    _read_file_binary, path
                )
                return web.Response(body=body, content_type=content_type)
        return web.Response(status=204)