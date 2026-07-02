"""HACS Vision - HACS 增强面板."""
from __future__ import annotations
import logging
import os
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import DOMAIN, PANEL_TITLE, PANEL_ICON, VERSION

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)

URL_PATH = "hacs-vision"
STORE_KEY = "hacs_vision"

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigType) -> bool:
    """Set up HACS Vision from a config entry."""
    from .api import HACSEnhancedAPI, HACSEnhancedStaticView, HACSBrandIconView
    from .hacs_data import HACSData
    from .hacs_operator import HACSOperator
    from .backup import BackupManager
    from .dependency_checker import DependencyChecker

    # N3: Share a single HACSData instance across all components
    shared_data = HACSData(hass)
    operator = HACSOperator(hass, shared_data=shared_data)
    backup = BackupManager(hass, shared_data=shared_data, operator=operator)
    checker = DependencyChecker(hass, shared_data=shared_data)

    hass.http.register_view(HACSEnhancedStaticView(hass))
    api_view = HACSEnhancedAPI(hass, data=shared_data, operator=operator, backup=backup, checker=checker)
    hass.http.register_view(api_view)
    hass.http.register_view(HACSBrandIconView(hass))
    await _register_panel(hass)

    # Auto-hide original HACS sidebar if setting is enabled
    try:
        hacs_settings = await shared_data.get_settings()
        if hacs_settings.get("hide_hacs_panel"):
            from homeassistant.components.frontend import async_remove_panel
            async_remove_panel(hass, "hacs")
            _LOGGER.info("Auto-hid HACS sidebar from settings")
    except Exception as exc:
        _LOGGER.debug("HACS panel auto-hide skipped: %s", exc)

    # Register sidebar badge JS as global Lovelace resource
    try:
        _register_sidebar_badge(hass)
    except Exception as exc:
        _LOGGER.warning("Sidebar badge registration failed: %s", exc)

    # Register WebSocket handler for sidebar badge
    await _register_ws_handler(hass)

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["entry"] = entry
    hass.data[DOMAIN]["api"] = api_view
    hass.data[DOMAIN]["listeners"] = []

    # Register services
    _register_services(hass, operator)

    # Pre-warm config entries cache + live rebuild on changes
    try:
        await shared_data.get_config_entries_map()

        async def _rebuild_cache(event):
            """Rebuild config entries cache immediately on any change."""
            try:
                await shared_data.get_config_entries_map(force_refresh=True)
            except Exception as exc:
                _LOGGER.warning("Config cache rebuild error: %s", exc)

        unsub1 = hass.bus.async_listen("config_entry_updated", _rebuild_cache)
        unsub2 = hass.bus.async_listen("config_entry_removed", _rebuild_cache)
        hass.data[DOMAIN]["listeners"] = [unsub1, unsub2]
    except Exception as exc:
        _LOGGER.warning("Config entries cache init error: %s", exc)

    # Auto-import token from HACS on first run
    hass.async_create_task(_auto_import_token(hass, shared_data))

    return True


async def _auto_import_token(hass: HomeAssistant, shared_data) -> None:
    """On first startup, if Vision has no token, try to import from HACS."""
    try:
        current = await shared_data.read_storage("github_token")
        if current and isinstance(current, dict) and current.get("token"):
            return  # Already have a token, skip
        # Try to get HACS token
        for entry in hass.config_entries.async_entries("hacs"):
            token = entry.data.get("token")
            if token:
                # Verify and save
                import aiohttp
                from homeassistant.helpers import aiohttp_client
                session = aiohttp_client.async_get_clientsession(hass)
                headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
                async with session.get("https://api.github.com/user", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    if resp.status == 200:
                        user = await resp.json()
                        login = user.get("login", "?")
                        await shared_data.write_storage("github_token", {"token": token, "user": login})
                        _LOGGER.info("Auto-imported GitHub token from HACS (user: %s)", login)
                break
    except Exception as e:
        _LOGGER.debug("Auto-import token skipped: %s", e)

async def _register_panel(hass: HomeAssistant) -> None:
    """Register HACS Vision as a frontend panel.

    Uses panel_custom embed_iframe=False for native frontend rendering.
    Sidebar toggling uses hass-toggle-menu event dispatched from
    the component's shadow DOM (bubbles + composed).
    """
    from homeassistant.components.frontend import async_remove_panel

    # 1. Remove any old registration
    for path in (URL_PATH,):
        try:
            async_remove_panel(hass, path)
        except Exception:
            pass

    # 2. Register via panel_custom (same as hassbox store etc.)
    from homeassistant.components import panel_custom
    
    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=URL_PATH,
        webcomponent_name="hacs-vision-panel",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"/api/hacs_vision/static/panel.js",
        embed_iframe=False,
        require_admin=True,
        config={},
    )
    _LOGGER.debug("Registered panel: %s (panel_custom embed_iframe=False)", URL_PATH)


def _register_sidebar_badge(hass: HomeAssistant) -> None:
    """Register sidebar-badge.js — injects into every HA page.

    Uses frontend.add_extra_js_url() to add the badge script to
    every HA frontend page, including panels and settings.
    """
    badge_js_path = os.path.join(FRONTEND_DIR, "sidebar-badge.js")
    static_url = f"/api/hacs_vision/static/sidebar-badge.js?v={VERSION}"

    # 1. Register static path so the JS file is served
    try:
        from homeassistant.components.http import StaticPathConfig
        hass.http.register_static_path(static_url, badge_js_path, cache_headers=False)
    except TypeError:
        hass.http.register_static_path(static_url, badge_js_path)
    _LOGGER.debug("Registered static path: %s", static_url)

    # 2. Inject into every HA page via frontend.add_extra_js_url
    try:
        from homeassistant.components.frontend import add_extra_js_url
        add_extra_js_url(hass, static_url)
        _LOGGER.info("✅ Sidebar badge registered via frontend.add_extra_js_url")
    except Exception as exc:
        _LOGGER.warning("Sidebar badge failed: %s", exc)


async def _register_ws_handler(hass: HomeAssistant) -> None:
    """Register WebSocket command for sidebar badge to get update count."""
    from homeassistant.components.websocket_api import (
        async_register_command,
        websocket_command,
        async_response,
        ActiveConnection,
    )

    @websocket_command({"type": "hacs_vision/updates"})
    @async_response
    async def ws_get_updates(
        hass: HomeAssistant, connection: ActiveConnection, msg: dict
    ) -> None:
        """Return updates list via WebSocket (already authenticated)."""
        api = hass.data.get(DOMAIN, {}).get("api")
        if not api:
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


async def _async_register_lovelace_resource(hass: HomeAssistant, url: str) -> None:
    """Add sidebar-badge.js as a Lovelace module resource."""
    try:
        # Method 1: Use lovelace service to set resource
        await hass.services.async_call(
            "lovelace", "set_resource",
            {"res_type": "module", "url": url, "create": True},
            blocking=True,
        )
        _LOGGER.info("Registered sidebar badge via lovelace service")
        return
    except Exception:
        pass

    try:
        # Method 2: Direct storage write
        from homeassistant.helpers.storage import Store
        import uuid

        store = Store(hass, "lovelace_resources")
        data = await store.async_load() or {}
        items = data.setdefault("data", {}).setdefault("items", [])

        for item in items:
            if item.get("url") == url:
                _LOGGER.debug("Sidebar badge already registered")
                return

        items.append({
            "id": uuid.uuid4().hex[:16],
            "url": url,
            "type": "module",
        })
        await store.async_save(data)
        _LOGGER.info("Registered sidebar badge resource via storage")
    except Exception as exc:
        _LOGGER.debug("Lovelace resource registration failed (non-critical): %s", exc)


def _register_services(hass: HomeAssistant, operator) -> None:
    """Register HA services for HACS Vision."""
    from .entity_ref_finder import EntityRefFinder

    async def handle_refresh(call: ServiceCall) -> None:
        """Handle refresh service call."""
        if not operator.available:
            _LOGGER.warning("Refresh service called but HACS is not available")
            return
        try:
            result = await operator.refresh_repositories()
            updated = result.get("updated", 0)
            errors = result.get("errors", [])
            rate_limited = result.get("rate_limited", False)
            if errors:
                _LOGGER.warning("Refresh service: updated %d repos, %d errors, rate_limited=%s",
                                updated, len(errors), rate_limited)
            else:
                _LOGGER.info("Refresh service: updated %d repos successfully", updated)
        except Exception as e:
            _LOGGER.error("Refresh service failed: %s", e, exc_info=True)

    async def handle_install_repository(call: ServiceCall) -> None:
        """Handle install_repository service call."""
        repo = call.data.get("repository", "")
        category = call.data.get("category", "integration")
        if not repo:
            _LOGGER.error("install_repository: 'repository' is required")
            return
        if operator.available:
            try:
                result = await operator.install_repository(repo, category)
                if not result.get("success"):
                    _LOGGER.error("Install service failed: %s", result.get("error", "unknown"))
            except Exception as e:
                _LOGGER.error("Install service error: %s", e, exc_info=True)

    async def handle_find_entity_refs(call: ServiceCall) -> None:
        """Handle find_entity_refs service call."""
        entity_id = call.data.get("entity_id", "")
        if not entity_id:
            _LOGGER.error("find_entity_refs: 'entity_id' is required")
            return
        try:
            finder = EntityRefFinder(hass)
            refs = await finder.find(entity_id)
            # Send result as persistent notification
            by_type = {}
            for r in refs:
                by_type.setdefault(r["source_type"], []).append(r["source_id"])
            lines = [f"🔍 {entity_id} 的引用结果：", f"共 {len(refs)} 处引用，涉及 {len({(r['source_type'], r['source_id']) for r in refs})} 个来源\n"]
            for stype, sids in by_type.items():
                unique_ids = list(set(sids))
                lines.append(f"  **{stype}** ({len(unique_ids)} 个)：{', '.join(unique_ids[:5])}")
                if len(unique_ids) > 5:
                    lines[-1] += f" …及 {len(unique_ids) - 5} 个其他"
            await hass.services.async_call(
                "persistent_notification", "create",
                {"title": f"HACS Vision - 实体引用查找", "message": "\n".join(lines)},
                blocking=False,
            )
        except Exception as e:
            _LOGGER.error("find_entity_refs error: %s", e, exc_info=True)

    async def handle_replace_entity_refs(call: ServiceCall) -> None:
        """Handle replace_entity_refs service call."""
        old_id = call.data.get("old_id", "")
        new_id = call.data.get("new_id", "")
        preview = call.data.get("preview", True)
        if not old_id or not new_id:
            _LOGGER.error("replace_entity_refs: 'old_id' and 'new_id' are required")
            return
        try:
            finder = EntityRefFinder(hass)
            result = await finder.replace(old_id, new_id, preview=preview)
            if not preview and result.get("total_updated", 0) > 0:
                reload_result = await finder.reload_affected()
                result["reload"] = reload_result
            # Send result as persistent notification
            if preview:
                msg = (
                    f"📋 **预览**：替换 {old_id} → {new_id}\n"
                    f"共 {result['total_refs']} 处引用，{result['affected_count']} 个来源受影响\n\n"
                    f"发送 `preview: false` 以执行替换"
                )
            else:
                updated = result.get("updated", {})
                total = result.get("total_updated", 0)
                reload = result.get("reload", {})
                msg = (
                    f"✅ **已执行替换** {old_id} → {new_id}\n"
                    f"共更新 {total} 处\n"
                    f"自动化: {len(updated.get('automations', []))} 个\n"
                    f"脚本: {len(updated.get('scripts', []))} 个\n"
                    f"场景: {len(updated.get('scenes', []))} 个\n"
                    f"仪表盘: {len(updated.get('dashboards', []))} 个\n"
                    f"重载状态: 自动化{'✅' if reload.get('automations') else '❌'} "
                    f"脚本{'✅' if reload.get('scripts') else '❌'} "
                    f"场景{'✅' if reload.get('scenes') else '❌'}"
                )
            await hass.services.async_call(
                "persistent_notification", "create",
                {"title": f"HACS Vision - 实体引用替换", "message": msg},
                blocking=False,
            )
        except Exception as e:
            _LOGGER.error("replace_entity_refs error: %s", e, exc_info=True)

    hass.services.async_register(DOMAIN, "refresh", handle_refresh)
    hass.services.async_register(
        DOMAIN, "install_repository", handle_install_repository,
        schema=vol.Schema({
            vol.Required("repository"): cv.string,
            vol.Optional("category", default="integration"): cv.string,
        }),
    )
    hass.services.async_register(
        DOMAIN, "find_entity_refs", handle_find_entity_refs,
        schema=vol.Schema({
            vol.Required("entity_id"): cv.string,
        }),
    )
    hass.services.async_register(
        DOMAIN, "replace_entity_refs", handle_replace_entity_refs,
        schema=vol.Schema({
            vol.Required("old_id"): cv.string,
            vol.Required("new_id"): cv.string,
            vol.Optional("preview", default=True): cv.boolean,
        }),
    )


async def async_unload_entry(hass: HomeAssistant, entry: ConfigType) -> bool:
    """Unload HACS Vision."""
    from homeassistant.components import frontend

    # 1. Remove sidebar panel
    try:
        frontend.async_remove_panel(hass, URL_PATH)
    except Exception:
        pass

    # 2. Remove all services
    hass.services.async_remove(DOMAIN, "refresh")
    hass.services.async_remove(DOMAIN, "install_repository")
    hass.services.async_remove(DOMAIN, "find_entity_refs")
    hass.services.async_remove(DOMAIN, "replace_entity_refs")

    # 3. Remove event listeners
    for listener in hass.data.get(DOMAIN, {}).get("listeners", []):
        try:
            listener()
        except Exception:
            pass

    # 4. Close shared aiohttp session
    api = hass.data.get(DOMAIN, {}).get("api")
    if api and hasattr(api, 'async_close'):
        try:
            await api.async_close()
        except Exception:
            pass

    # 5. Clean up data
    hass.data.pop(DOMAIN, None)
    return True