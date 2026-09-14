"""HACS Vision 服务模块。"""
from __future__ import annotations

import logging
from datetime import timedelta

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN
from .entity_ref_finder import EntityRefFinder
from .runtime import VisionRuntime

_LOGGER = logging.getLogger(__name__)

def _get_runtime(hass: HomeAssistant) -> VisionRuntime | None:
    """按配置项取运行时容器（本集成单实例，取首个已加载项）。"""
    for entry in hass.config_entries.async_entries(DOMAIN):
        rt = entry.runtime_data
        if rt is not None:
            return rt
    return None

async def _create_service_token(hass: HomeAssistant) -> str | None:
    """为 replace_entity_refs 服务生成一个短期 HA 访问令牌。"""
    try:
        owner = await hass.auth.async_get_owner()
        if owner is None:
            _LOGGER.warning("replace_entity_refs: 无 owner 用户，无法签发访问令牌")
            return None
        return await hass.auth.async_create_access_token(
            owner, client_name="hacs_vision", expires=timedelta(minutes=2)
        )
    except Exception as err:
        _LOGGER.warning("replace_entity_refs: 签发访问令牌失败: %s", err)
        return None

def register_services(hass: HomeAssistant) -> None:
    """为 HACS Vision 注册全部 HA 服务。"""

    async def handle_refresh(call: ServiceCall) -> None:
        """处理刷新服务调用。"""
        runtime = _get_runtime(hass)
        if runtime is None or not runtime.operator.available:
            _LOGGER.warning("Refresh service called but HACS is not available")
            return
        try:
            result = await runtime.operator.refresh_repositories()
            updated = result.get("updated", 0)
            errors = result.get("errors", [])
            rate_limited = result.get("rate_limited", False)
            if errors:
                _LOGGER.warning(
                    "Refresh service: updated %d repos, %d errors, rate_limited=%s",
                    updated,
                    len(errors),
                    rate_limited,
                )
            else:
                _LOGGER.info("Refresh service: updated %d repos successfully", updated)
        except Exception as e:
            _LOGGER.error("Refresh service failed: %s", e, exc_info=True)

    async def handle_install_repository(call: ServiceCall) -> None:
        """处理安装仓库服务调用。"""
        repo = call.data.get("repository", "")
        category = call.data.get("category", "integration")
        if not repo:
            _LOGGER.error("install_repository: 'repository' is required")
            return
        runtime = _get_runtime(hass)
        if runtime is not None and runtime.operator.available:
            try:
                result = await runtime.operator.install_repository(repo, category)
                if not result.get("success"):
                    _LOGGER.error("Install service failed: %s", result.get("error", "unknown"))
            except Exception as e:
                _LOGGER.error("Install service error: %s", e, exc_info=True)

    async def handle_find_entity_refs(call: ServiceCall) -> None:
        """处理查找实体引用服务调用。"""
        entity_id = call.data.get("entity_id", "")
        if not entity_id:
            _LOGGER.error("find_entity_refs: 'entity_id' is required")
            return
        try:
            finder = EntityRefFinder(hass)
            refs = await finder.find(entity_id)
            by_type: dict = {}
            for r in refs:
                by_type.setdefault(r["source_type"], []).append(r["source_id"])
            lines = [
                f"Entity reference results for {entity_id}:",
                f"Found {len(refs)} references across "
                f"{len({(r['source_type'], r['source_id']) for r in refs})} sources\n",
            ]
            for stype, sids in by_type.items():
                unique_ids = list(set(sids))
                lines.append(f"  **{stype}** ({len(unique_ids)}): {', '.join(unique_ids[:5])}")
                if len(unique_ids) > 5:
                    lines[-1] += f" ...and {len(unique_ids) - 5} more"
            await hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": f"HACS Vision - Entity Reference Finder",
                    "message": "\n".join(lines),
                },
                blocking=False,
            )
        except Exception as e:
            _LOGGER.error("find_entity_refs error: %s", e, exc_info=True)

    async def handle_replace_entity_refs(call: ServiceCall) -> None:
        """处理替换实体引用服务调用。"""
        old_id = call.data.get("old_id", "")
        new_id = call.data.get("new_id", "")
        preview = call.data.get("preview", True)
        if not old_id or not new_id:
            _LOGGER.error("replace_entity_refs: 'old_id' and 'new_id' are required")
            return
        try:
            token = await _create_service_token(hass)
            if not token:
                _LOGGER.warning(
                    "replace_entity_refs: 未能获取访问令牌，配置写回将失败（仅预览可用）"
                )
            finder = EntityRefFinder(hass, hass_token=token)
            result = await finder.replace(old_id, new_id, preview=preview)
            if not preview and result.get("total_updated", 0) > 0:
                reload_result = await finder.reload_affected()
                result["reload"] = reload_result
            if preview:
                msg = (
                    f"**Preview**: Replace {old_id} → {new_id}\n"
                    f"Found {result['total_refs']} references, "
                    f"{result['affected_count']} sources affected\n\n"
                    f"Send `preview: false` to execute replacement"
                )
            else:
                updated = result.get("updated", {})
                total = result.get("total_updated", 0)
                reload = result.get("reload", {})
                msg = (
                    f"**Replacement executed**: {old_id} → {new_id}\n"
                    f"Updated {total} references\n"
                    f"Automations: {len(updated.get('automations', []))}\n"
                    f"Scripts: {len(updated.get('scripts', []))}\n"
                    f"Scenes: {len(updated.get('scenes', []))}\n"
                    f"Dashboards: {len(updated.get('dashboards', []))}\n"
                    f"Reload: automations{' OK' if reload.get('automations') else ' FAIL'} "
                    f"scripts{' OK' if reload.get('scripts') else ' FAIL'} "
                    f"scenes{' OK' if reload.get('scenes') else ' FAIL'}"
                )
            await hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": f"HACS Vision - Entity Reference Replace",
                    "message": msg,
                },
                blocking=False,
            )
        except Exception as e:
            _LOGGER.error("replace_entity_refs error: %s", e, exc_info=True)

    # ── 自动更新服务 ──
    async def handle_auto_update_start(call: ServiceCall) -> None:
        """启动周期性自动更新调度。"""
        runtime = _get_runtime(hass)
        if runtime is not None and runtime.auto_update:
            await runtime.auto_update.start()

    async def handle_auto_update_stop(call: ServiceCall) -> None:
        """停止周期性自动更新调度。"""
        runtime = _get_runtime(hass)
        if runtime is not None and runtime.auto_update:
            runtime.auto_update.stop()

    async def handle_auto_update_trigger(call: ServiceCall) -> None:
        """触发一次性自动更新周期。"""
        runtime = _get_runtime(hass)
        if runtime is not None and runtime.auto_update:
            await runtime.auto_update.trigger()

    async def handle_auto_update_reload_settings(call: ServiceCall) -> None:
        """重新加载自动更新设置并重新调度。"""
        runtime = _get_runtime(hass)
        if runtime is not None and runtime.auto_update:
            await runtime.auto_update.reload_settings()

    hass.services.async_register(DOMAIN, "refresh", handle_refresh)
    hass.services.async_register(
        DOMAIN,
        "install_repository",
        handle_install_repository,
        schema=vol.Schema(
            {
                vol.Required("repository"): cv.string,
                vol.Optional("category", default="integration"): cv.string,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "find_entity_refs",
        handle_find_entity_refs,
        schema=vol.Schema(
            {
                vol.Required("entity_id"): cv.string,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "replace_entity_refs",
        handle_replace_entity_refs,
        schema=vol.Schema(
            {
                vol.Required("old_id"): cv.string,
                vol.Required("new_id"): cv.string,
                vol.Optional("preview", default=True): cv.boolean,
            }
        ),
    )
    hass.services.async_register(DOMAIN, "auto_update_start", handle_auto_update_start)
    hass.services.async_register(DOMAIN, "auto_update_stop", handle_auto_update_stop)
    hass.services.async_register(DOMAIN, "auto_update_trigger", handle_auto_update_trigger)
    hass.services.async_register(
        DOMAIN, "auto_update_reload_settings", handle_auto_update_reload_settings
    )