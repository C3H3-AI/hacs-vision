"""HACS Vision 集成主模块。"""
from __future__ import annotations

import json
import logging
import os

import voluptuous as vol
from aiohttp import ClientTimeout

from homeassistant.components import panel_custom
from homeassistant.components.frontend import add_extra_js_url, async_remove_panel
from homeassistant.components.websocket_api import (
    ActiveConnection,
    async_register_command,
    async_response,
    websocket_command,
)
from homeassistant.config_entries import (
    SIGNAL_CONFIG_ENTRY_CHANGED,
    ConfigEntry,
    ConfigEntryChange,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.typing import ConfigType

from .api import HACSEnhancedAPI, HACSEnhancedStaticView, HACSBrandIconView
from .auto_update import AutoUpdateManager
from .backup import BackupManager
from .const import DOMAIN, PANEL_TITLE, PANEL_ICON, URL_PATH, VERSION
from .dependency_checker import DependencyChecker
from .hacs_data import HACSData
from .hacs_operator import HACSOperator
from .runtime import VisionConfigEntry, VisionRuntime
from .services import register_services

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")
BUILD_JSON_PATH = os.path.join(FRONTEND_DIR, "build.json")

_LOGGER = logging.getLogger(__name__)

def _read_file(path: str) -> str:
    """同步读取文件——须经 executor 调用。"""
    with open(path, encoding="utf-8") as fh:
        return fh.read()

async def _read_build_hash(hass: HomeAssistant) -> str:
    """读取前端构建哈希（frontend/build.json），用于面板 URL 的缓存破坏。"""
    try:
        content = await hass.async_add_executor_job(_read_file, BUILD_JSON_PATH)
        return json.loads(content).get("hash") or VERSION
    except (OSError, ValueError):
        return VERSION

CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True

async def async_setup_entry(hass: HomeAssistant, entry: VisionConfigEntry) -> bool:
    """从配置项安装 HACS Vision。"""
    # N3：跨所有组件共享单个 HACSData 实例
    shared_data = HACSData(hass)
    operator = HACSOperator(hass, shared_data=shared_data)
    backup = BackupManager(hass, shared_data=shared_data, operator=operator)
    checker = DependencyChecker(hass, shared_data=shared_data)

    hass.http.register_view(HACSEnhancedStaticView(hass))
    api_view = HACSEnhancedAPI(hass, data=shared_data, operator=operator, backup=backup, checker=checker)
    hass.http.register_view(api_view)
    hass.http.register_view(HACSBrandIconView(hass))
    cache_key = await _read_build_hash(hass)
    await _register_panel(hass, cache_key)

    # 若设置开启则自动隐藏原 HACS 侧边栏
    try:
        hacs_settings = await shared_data.get_settings()
        if hacs_settings.get("hide_hacs_panel"):
            async_remove_panel(hass, "hacs", warn_if_unknown=False)
            _LOGGER.info("Auto-hid HACS sidebar from settings")
    except Exception as exc:
        _LOGGER.debug("HACS panel auto-hide skipped: %s", exc)

    # 将侧边栏角标 JS 注册为全局 Lovelace 资源
    try:
        _register_sidebar_badge(hass, cache_key)
    except Exception as exc:
        _LOGGER.warning("Sidebar badge registration failed: %s", exc)

    # 构建运行时容器并注册 WebSocket 处理器
    runtime = VisionRuntime(
        hass,
        shared_data=shared_data,
        operator=operator,
        backup=backup,
        checker=checker,
        api_view=api_view,
    )
    await _register_ws_handler(hass, runtime)

    # 创建并启动 AutoUpdateManager
    auto_update = AutoUpdateManager(hass, operator=operator, data=shared_data)
    runtime.auto_update = auto_update
    await auto_update.start()

    # 注册服务
    register_services(hass, runtime)

    # 预热配置项缓存，变更时实时重建
    try:
        await shared_data.get_config_entries_map()

        async def _rebuild_cache(
            change: ConfigEntryChange, entry: ConfigEntry
        ) -> None:
            """任何配置项变更时立即重建缓存。"""
            try:
                await shared_data.get_config_entries_map(force_refresh=True)
            except Exception as exc:
                _LOGGER.warning("Config cache rebuild error: %s", exc)

        unsub = async_dispatcher_connect(
            hass, SIGNAL_CONFIG_ENTRY_CHANGED, _rebuild_cache
        )
        runtime.listeners = [unsub]
    except Exception as exc:
        _LOGGER.warning("Config entries cache init error: %s", exc)

    # 首次运行从 HACS 自动导入令牌
    _bg_task = hass.async_create_task(_auto_import_token(hass, shared_data))
    runtime.bg_tasks.add(_bg_task)
    _bg_task.add_done_callback(runtime.bg_tasks.discard)

    entry.runtime_data = runtime
    return True

async def _auto_import_token(hass: HomeAssistant, shared_data) -> None:
    """首次启动时，若 Vision 无令牌则尝试从 HACS 导入。"""
    try:
        current = await shared_data.read_storage("github_token")
        if current and isinstance(current, dict) and current.get("token"):
            return  # 已有令牌，跳过
        # 尝试获取 HACS 令牌
        for entry in hass.config_entries.async_entries("hacs"):
            token = entry.data.get("token")
            if token:
                # 校验并保存
                session = aiohttp_client.async_get_clientsession(hass)
                headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
                async with session.get(
                    "https://api.github.com/user",
                    headers=headers,
                    timeout=ClientTimeout(total=10),
                ) as resp:
                    if resp.status == 200:
                        user = await resp.json()
                        login = user.get("login", "?")
                        await shared_data.write_storage("github_token", {"token": token, "user": login})
                        _LOGGER.info("Auto-imported GitHub token from HACS (user: %s)", login)
                break
    except Exception as e:
        _LOGGER.debug("Auto-import token skipped: %s", e)

async def _register_panel(hass: HomeAssistant, cache_key: str) -> None:
    """将 HACS Vision 注册为前端面板。"""

    for path in (URL_PATH,):
        try:
            async_remove_panel(hass, path, warn_if_unknown=False)
        except Exception:
            pass

    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=URL_PATH,
        webcomponent_name="hacs-vision-panel",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"/api/hacs_vision/static/panel.js?v={cache_key}",
        embed_iframe=False,
        require_admin=True,
        config={},
    )
    _LOGGER.debug("Registered panel: %s (panel_custom embed_iframe=False)", URL_PATH)

def _register_sidebar_badge(hass: HomeAssistant, cache_key: str) -> None:
    """注册 sidebar-badge.js——注入到每个 HA 页面。 """

    static_url = f"/api/hacs_vision/static/sidebar-badge.js?v={cache_key}"

    try:
        add_extra_js_url(hass, static_url)
        _LOGGER.info("Sidebar badge registered via frontend.add_extra_js_url")
    except Exception as exc:
        _LOGGER.debug("Sidebar badge skipped (non-critical): %s", exc)

async def _register_ws_handler(hass: HomeAssistant, runtime: VisionRuntime) -> None:
    """注册侧边栏角标获取更新数的 WebSocket 命令。"""

    @websocket_command({"type": "hacs_vision/updates"})
    @async_response
    async def ws_get_updates(
        hass: HomeAssistant, connection: ActiveConnection, msg: dict
    ) -> None:
        """通过 WebSocket 返回更新列表（已鉴权）。"""
        api = runtime.api
        if not api:
            connection.send_result(msg["id"], {"updates": []})
            return
        if not api.operator.available:
            connection.send_result(msg["id"], {"updates": []})
            return
        try:
            updates = await api.operator.get_updates_from_ha_entities()
            if not updates:
                hacs_updates = await api.operator.get_available_updates()
                if hacs_updates:
                    skipped_or_pending = set()
                    for state in hass.states.async_all():
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
                    updates = [u for u in hacs_updates if (u.get("full_name") or "") not in skipped_or_pending]
            connection.send_result(msg["id"], {"updates": updates})
        except Exception as exc:
            _LOGGER.warning("WS updates error: %s", exc)
            connection.send_result(msg["id"], {"updates": []})

    async_register_command(hass, ws_get_updates)
    _LOGGER.debug("Registered WS handler: hacs_vision/updates")

async def async_unload_entry(hass: HomeAssistant, entry: VisionConfigEntry) -> bool:
    """卸载 HACS Vision——通过运行时容器集中清理。"""
    await entry.runtime_data.shutdown()
    return True