"""HACS Vision - HACS 增强面板."""
from __future__ import annotations
import json
import logging
import os
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store
import voluptuous as vol

from .const import DOMAIN, PANEL_TITLE, PANEL_ICON, VERSION

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")
BUILD_JSON_PATH = os.path.join(FRONTEND_DIR, "build.json")

async def _read_build_hash(hass: HomeAssistant) -> str:
    """Read build hash from build.json via executor, fall back to VERSION."""
    try:
        content = await hass.async_add_executor_job(_read_file, BUILD_JSON_PATH)
        return json.loads(content).get("hash", VERSION)
    except Exception:
        return VERSION

def _read_file(path: str) -> str:
    """Synchronous file read for executor."""
    with open(path) as f:
        return f.read()

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)

URL_PATH = "hacs-vision"
STORE_KEY = "hacs_vision"

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    hass.data.setdefault(DOMAIN, {})
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
    hass.http.register_view(HACSEnhancedAPI(hass, data=shared_data, operator=operator, backup=backup, checker=checker))
    hass.http.register_view(HACSBrandIconView(hass))
    await _register_panel(hass)
    hass.data.setdefault(DOMAIN, {})["entry"] = entry

    # Register services
    _register_services(hass, operator)

    return True

async def _register_panel(hass: HomeAssistant) -> None:
    """Register HACS Vision as a Lovelace dashboard + iframe card.

    Uses a Lovelace storage dashboard with an iframe card pointing to our
    static HTML page.  This avoids the phone sidebar-toggle issue of
    ``panel_custom`` + ``embed_iframe``, because HA's native Lovelace
    panel always preserves the mobile header and sidebar hamburger button.
    """
    from homeassistant.components.frontend import async_register_built_in_panel, async_remove_panel

    # 1. Remove any old panel_custom registration
    for path in (URL_PATH,):
        try:
            async_remove_panel(hass, path)
        except Exception:
            pass

    # 2. Deduplicate & upsert the Lovelace dashboard entry in .storage/lovelace_dashboards
    dash_store = Store(hass, 1, "lovelace_dashboards")
    raw = await dash_store.async_load()
    dashboards: dict = raw if raw else {"items": []}

    # Remove ANY existing entry that conflicts by url_path or store_key
    # (handles upgrades from v2.1.x where a different id/url_path may exist)
    items: list = dashboards.setdefault("items", [])
    stale = [d for d in items if d.get("url_path") == URL_PATH or d.get("id") == STORE_KEY]
    items[:] = [d for d in items if d not in stale]
    for d in stale:
        _LOGGER.debug("Removed stale dashboard: id=%s url_path=%s", d.get("id"), d.get("url_path"))
        try:
            stale_store = Store(hass, 1, f"lovelace.{d.get('id')}")
            await stale_store.async_remove()
        except Exception:
            pass

    # Insert canonical entry
    items.append({
        "id": STORE_KEY,
        "title": PANEL_TITLE,
        "url_path": URL_PATH,
        "icon": PANEL_ICON,
        "show_in_sidebar": True,
        "require_admin": True,
        "mode": "storage",
    })
    await dash_store.async_save(dashboards)
    _LOGGER.debug("Upserted lovelace dashboard entry: %s", STORE_KEY)

    # 3. Create/update the dashboard config with an iframe card
    config_store = Store(hass, 1, f"lovelace.{STORE_KEY}")
    iframe_url = f"/api/hacs_vision/static/index.html?v={await _read_build_hash(hass)}"
    config_body = {
        "views": [{
            "title": PANEL_TITLE,
            "path": "main",
            "type": "panel",
            "cards": [{
                "type": "iframe",
                "url": iframe_url,
                "aspect_ratio": "100%",
            }],
        }]
    }
    await config_store.async_save({"config": config_body})
    _LOGGER.debug("Created lovelace dashboard config with iframe -> %s", iframe_url)

    # 4. Register sidebar panel
    async_register_built_in_panel(
        hass,
        component_name="lovelace",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        config={"mode": "storage"},
        frontend_url_path=URL_PATH,
        require_admin=True,
        show_in_sidebar=True,
        update=True,
    )
    _LOGGER.debug("Registered sidebar panel: %s", URL_PATH)

    # 5. Register/update LOVELACE_DATA runtime registry
    try:
        from homeassistant.components.lovelace import LOVELACE_DATA
        from homeassistant.components.lovelace.dashboard import LovelaceStorage
        if LOVELACE_DATA in hass.data:
            lovelace_data = hass.data[LOVELACE_DATA]
            # Always replace — handles version upgrades
            lovelace_data.dashboards[URL_PATH] = LovelaceStorage(hass, {
                "id": STORE_KEY,
                "url_path": URL_PATH,
                "title": PANEL_TITLE,
                "icon": PANEL_ICON,
                "show_in_sidebar": True,
                "require_admin": True,
            })
            _LOGGER.debug("Updated LovelaceStorage runtime for: %s", URL_PATH)
    except Exception:
        pass


def _register_services(hass: HomeAssistant, operator) -> None:
    """Register HA services for HACS Vision."""
    from .entity_ref_finder import EntityRefFinder

    async def handle_refresh(call: ServiceCall) -> None:
        """Handle refresh service call."""
        if operator.available:
            try:
                await operator.refresh_repositories()
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

    # 2. Remove Lovelace dashboard config
    try:
        config_store = Store(hass, 1, f"lovelace.{STORE_KEY}")
        await config_store.async_remove()
        _LOGGER.debug("Removed lovelace dashboard config: %s", STORE_KEY)
    except Exception:
        pass

    # 3. Remove dashboard entry from .storage/lovelace_dashboards
    try:
        dash_store = Store(hass, 1, "lovelace_dashboards")
        raw = await dash_store.async_load()
        if raw and "items" in raw:
            raw["items"] = [
                d for d in raw["items"]
                if d.get("id") not in (STORE_KEY, URL_PATH)
                and d.get("url_path") not in (URL_PATH,)
            ]
            await dash_store.async_save(raw)
            _LOGGER.debug("Removed dashboard entry from lovelace_dashboards")
    except Exception:
        pass

    # 4. Remove all services
    hass.services.async_remove(DOMAIN, "refresh")
    hass.services.async_remove(DOMAIN, "install_repository")
    hass.services.async_remove(DOMAIN, "find_entity_refs")
    hass.services.async_remove(DOMAIN, "replace_entity_refs")

    # 5. Clean up data
    try:
        for key in (f"lovelace.{STORE_KEY}", f"lovelace.{URL_PATH}"):
            store = Store(hass, 1, key)
            await store.async_remove()
    except Exception:
        pass
    hass.data.pop(DOMAIN, None)
    return True