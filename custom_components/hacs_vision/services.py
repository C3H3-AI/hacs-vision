"""HACS Vision 服务模块。"""
from __future__ import annotations

import logging
from datetime import timedelta

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import translation

from .const import DOMAIN, VALID_HACS_CATEGORIES
from .entity_ref_finder import EntityRefFinder
from .runtime import VisionRuntime

_LOGGER = logging.getLogger(__name__)

def _get_runtime(hass: HomeAssistant) -> VisionRuntime | None:
    """按配置项取运行时容器（本集成单实例，取首个已加载项）。"""
    for entry in hass.config_entries.async_entries(DOMAIN):
        # runtime_data 不是 ConfigEntry 的固有属性：条目处于 SETUP_RETRY/
        rt = getattr(entry, "runtime_data", None)
        if rt is not None:
            return rt
    return None

async def _create_service_token(hass: HomeAssistant) -> str | None:
    """为 replace_entity_refs 服务签发一个短期 HA 访问令牌。"""
    try:
        owner = await hass.auth.async_get_owner()
        if owner is None:
            _LOGGER.warning("replace_entity_refs: 无 owner 用户，无法签发访问令牌")
            return None
        refresh_token = await hass.auth.async_create_refresh_token(
            owner,
            client_id=DOMAIN,
            client_name="hacs_vision",
            access_token_expiration=timedelta(minutes=5),
        )
        return hass.auth.async_create_access_token(refresh_token)
    except Exception as err:
        _LOGGER.warning("replace_entity_refs: 签发访问令牌失败: %s", err)
        return None

_TRANSLATION_PREFIX = f"component.{DOMAIN}.common."


async def _async_notification_strings(hass: HomeAssistant) -> dict[str, str]:
    """取通知文案：自定义集成没有 notification 段，文案放在 translations 的 common 段。"""
    return await translation.async_get_translations(
        hass, hass.config.language, "common", {DOMAIN}
    )


def _localized(strings: dict[str, str], key: str, **placeholders: object) -> str:
    """渲染一条通知文案的占位符。"""
    text = strings[f"{_TRANSLATION_PREFIX}{key}"]
    for name, value in placeholders.items():
        text = text.replace("{" + name + "}", str(value))
    return text


def register_services(hass: HomeAssistant) -> None:
    """为 HACS Vision 注册全部 HA 服务。"""

    async def handle_refresh(call: ServiceCall) -> None:
        """处理刷新服务调用。"""
        runtime = _get_runtime(hass)
        if runtime is None or not runtime.operator.available:
            _LOGGER.warning(
                "Refresh service called but neither HACS nor the built-in "
                "Marketplace backend is available"
            )
            return
        # 真实失败直接抛出（不再吞掉）：自动化里刷新失败必须可见
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

    async def handle_install_repository(call: ServiceCall) -> None:
        """处理安装仓库服务调用。"""
        repo = call.data.get("repository", "").strip()
        category = call.data.get("category", "integration")
        if not repo:
            raise ServiceValidationError("install_repository: 'repository' 不能为空")
        runtime = _get_runtime(hass)
        if runtime is None:
            raise ServiceValidationError("install_repository: HACS Vision 尚未加载完成")
        if not runtime.operator.available:
            raise ServiceValidationError("install_repository: HACS / Marketplace 后端不可用")
        try:
            result = await runtime.operator.install_repository(repo, category)
        except Exception as err:
            raise HomeAssistantError(f"install_repository 调用失败: {err}") from err
        if not result.get("success"):
            raise ServiceValidationError(
                f"install_repository 失败: {result.get('error', 'unknown')}"
            )
        _LOGGER.info(
            "install_repository: %s %s",
            result.get("repository", repo),
            "already installed"
            if result.get("note") == "already_installed"
            else f"installed {result.get('version', '?')}",
        )

    async def handle_find_entity_refs(call: ServiceCall) -> None:
        """处理查找实体引用服务调用。"""
        entity_id = call.data.get("entity_id", "").strip()
        if not entity_id:
            raise ServiceValidationError("find_entity_refs: 'entity_id' 不能为空")
        finder = EntityRefFinder(hass)
        refs = await finder.find(entity_id)
        if not call.return_response:
            strings = await _async_notification_strings(hass)
            by_type: dict[str, list[str]] = {}
            for r in refs:
                by_type.setdefault(r["source_type"], []).append(r["source_id"])
            sources = len({(r["source_type"], r["source_id"]) for r in refs})
            lines = [
                _localized(
                    strings,
                    "entity_refs_header",
                    entity_id=entity_id,
                    total=len(refs),
                    sources=sources,
                ),
                "",
            ]
            for stype, sids in by_type.items():
                unique_ids = list(set(sids))
                line = "  " + _localized(
                    strings,
                    "entity_refs_source",
                    source_type=stype,
                    count=len(unique_ids),
                    ids=", ".join(unique_ids[:5]),
                )
                if len(unique_ids) > 5:
                    line += " " + _localized(
                        strings, "entity_refs_more", count=len(unique_ids) - 5
                    )
                lines.append(line)
            await hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": strings[f"{_TRANSLATION_PREFIX}entity_refs_title"],
                    "message": "\n".join(lines),
                },
                blocking=False,
            )
        return {"entity_id": entity_id, "total": len(refs), "refs": refs}

    async def handle_replace_entity_refs(call: ServiceCall) -> None:
        """处理替换实体引用服务调用。"""
        old_id = call.data.get("old_id", "").strip()
        new_id = call.data.get("new_id", "").strip()
        preview = call.data.get("preview", True)
        if not old_id or not new_id:
            raise ServiceValidationError("replace_entity_refs: 'old_id' 与 'new_id' 不能为空")
        token = await _create_service_token(hass)
        if not token and not preview:
            # 无令牌必然写回失败，继续执行只会返回误导性的 "Updated 0"
            raise ServiceValidationError(
                "replace_entity_refs: 无法签发访问令牌，已中止写回"
                "（可先以 preview: true 查看影响面）"
            )
        if not token:
            _LOGGER.warning(
                "replace_entity_refs: 未能获取访问令牌，仅预览可用"
            )
        finder = EntityRefFinder(hass, hass_token=token)
        result = await finder.replace(old_id, new_id, preview=preview)
        if not preview and result.get("total_updated", 0) > 0:
            reload_result = await finder.reload_affected()
            result["reload"] = reload_result
        if not call.return_response:
            strings = await _async_notification_strings(hass)
            if preview:
                msg = _localized(
                    strings,
                    "entity_refs_preview",
                    old_id=old_id,
                    new_id=new_id,
                    total_refs=result["total_refs"],
                    affected_count=result["affected_count"],
                )
            else:
                updated = result.get("updated", {})
                reload = result.get("reload", {})
                ok = strings[f"{_TRANSLATION_PREFIX}reload_ok"]
                fail = strings[f"{_TRANSLATION_PREFIX}reload_fail"]
                msg = _localized(
                    strings,
                    "entity_refs_done",
                    old_id=old_id,
                    new_id=new_id,
                    total_updated=result.get("total_updated", 0),
                    automations=len(updated.get("automations", [])),
                    scripts=len(updated.get("scripts", [])),
                    scenes=len(updated.get("scenes", [])),
                    dashboards=len(updated.get("dashboards", [])),
                    reload_automations=ok if reload.get("automations") else fail,
                    reload_scripts=ok if reload.get("scripts") else fail,
                    reload_scenes=ok if reload.get("scenes") else fail,
                )
            await hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": strings[
                        f"{_TRANSLATION_PREFIX}entity_refs_replace_title"
                    ],
                    "message": msg,
                },
                blocking=False,
            )
        return result

    # ── 自动更新服务 ──
    def _auto_update_manager(service: str):
        """取自动更新管理器；不可用时记录一次告警并返回 None。"""
        runtime = _get_runtime(hass)
        manager = runtime.auto_update if runtime is not None else None
        if manager is None:
            _LOGGER.warning(
                "%s: 自动更新管理器不可用（集成未加载或尚未初始化）", service
            )
        return manager

    async def handle_auto_update_start(call: ServiceCall) -> None:
        """启动周期性自动更新调度。"""
        manager = _auto_update_manager("auto_update_start")
        if manager is not None:
            await manager.start()

    async def handle_auto_update_stop(call: ServiceCall) -> None:
        """停止周期性自动更新调度。"""
        manager = _auto_update_manager("auto_update_stop")
        if manager is not None:
            manager.stop()

    async def handle_auto_update_trigger(call: ServiceCall) -> None:
        """触发一次性自动更新周期。"""
        manager = _auto_update_manager("auto_update_trigger")
        if manager is not None:
            await manager.trigger()

    async def handle_auto_update_reload_settings(call: ServiceCall) -> None:
        """重新加载自动更新设置并重新调度。"""
        manager = _auto_update_manager("auto_update_reload_settings")
        if manager is not None:
            await manager.reload_settings()

    hass.services.async_register(DOMAIN, "refresh", handle_refresh)
    hass.services.async_register(
        DOMAIN,
        "install_repository",
        handle_install_repository,
        schema=vol.Schema(
            {
                vol.Required("repository"): cv.string,
                vol.Optional("category", default="integration"): vol.In(
                    sorted(VALID_HACS_CATEGORIES)
                ),
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "find_entity_refs",
        handle_find_entity_refs,
        supports_response=SupportsResponse.OPTIONAL,
        schema=vol.Schema(
            {
                vol.Required("entity_id"): cv.entity_id,
            }
        ),
    )
    hass.services.async_register(
        DOMAIN,
        "replace_entity_refs",
        handle_replace_entity_refs,
        supports_response=SupportsResponse.OPTIONAL,
        schema=vol.Schema(
            {
                vol.Required("old_id"): cv.entity_id,
                vol.Required("new_id"): cv.entity_id,
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