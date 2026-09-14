"""HACS Vision 实体引用查找平台。"""
from __future__ import annotations

import logging
import re
from typing import Any

from homeassistant.components.automation.helpers import (
    async_get_blueprints as async_get_automation_blueprints,
)
from homeassistant.components.blueprint.models import Blueprint, DomainBlueprints
from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.components.script.helpers import (
    async_get_blueprints as async_get_script_blueprints,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.util.yaml import load_yaml

_LOGGER = logging.getLogger(__name__)

# 参见: https://www.home-assistant.io/integrations/#entity
_ENTITY_ID_RE = re.compile(
    r"\b(?:"
    r"air_quality|alarm_control_panel|angle|animation|application|area|"
    r"assist_satellite|automation|battery|bed|bed_activity|binary_sensor|"
    r"birthday|button|calendar|camera|carbon_dioxide|carbon_monoxide|"
    r"climate|cold|conversation|counter|cover|curtain|date|datetime|"
    r"device_tracker|dishwasher|door|dryer|duration|event|exhaust_fan|fan|"
    r"favorite|fence|fingerprint|fireplace|flower|food|freezer|fridge|"
    r"front_door|garage|garage_door|gas|gate|generator|geo_location|gps|"
    r"group|hass|health|heater|home|humidifier|humidity|illuminance|image|"
    r"image_processing|input_boolean|input_button|input_datetime|input_number|"
    r"input_select|input_text|irrigation|keyboard|kitchen|knob|label|lake|"
    r"landscape|laundry|lawn|lawn_mower|leak|light|lighting|lightness|"
    r"livestock|living_room|load|load_center|load_shed|lock|locker|locket|"
    r"mail|mailbox|mattress|media_player|medicine|moisture|motion|mower|"
    r"mqtt|music|neighbors|noise|notifications|notify|number|occupancy|"
    r"outlet|oven|pantry|parking|particle|person|pet|phone|plant|plug|"
    r"pollen|pool|power|power_outage|presence|pressure|printer|proximity|"
    r"pump|purifier|radon|rain|range|rate|reading|receiver|refrigerator|"
    r"region|remote|robot|roof|room|routine|scene|schedule|screen|script|"
    r"select|sensor|shelter|shower|shutter|signal|siren|snow|soil|solar|"
    r"solar_radiation|sound|speaker|sprinkler|stair|states|step|stove|"
    r"stt|subwoofer|sun|switch|tank|task|temperature|text|thermostat|time|"
    r"timer|todo|toggle|touch|towel|tracker|traffic|train|trash|tree|trend|"
    r"tts|tv|u_v|update|vacuum|valve|vent|ventilation|vibration|"
    r"video_doorbell|view|visitor|voice|voltage|volume|wake_word|walk|wall|"
    r"warm|washing_machine|watch|water|water_heater|water_pump|weather|"
    r"weight|welcome|wheel|wind|window|wine|work|zone|"
    r"[a-z][a-z0-9_]{1,63}"
    r")\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*\b",
)

# 匹配 Jinja2 模板中的 states() / is_state() / state_attr() 调用
_JINJA_STATES_RE = re.compile(
    r"(?:states|is_state|state_attr|is_state_attr|expand|closest|"
    r"device_entities|area_entities|area_id|label_id)\s*\(\s*"
    r"['\"]([^'\"]+)['\"]"
)

# 匹配 hass.states["xxx"] / hass.states['xxx']
_HASS_STATES_RE = re.compile(r"hass\.states\s*\[\s*['\"]([^'\"]+)['\"]\s*\]")

# 匹配服务调用中的 service 字段 (domain.action)
_SERVICE_CALL_RE = re.compile(
    r"(?:service|service_data)\s*[:=]\s*['\"]([a-z_]+\.[a-z_]+)['\"]"
)

# 已知的 entity_id 会出现的 JSON key 路径
_ENTITY_KEYS = {
    "entity_id",
    "entity",
    "target",
    "source",
    "to",
    "from",
}

# 已知的嵌套搜索 key 路径
_DEEP_KEYS = {
    "trigger",
    "condition",
    "action",
    "sequence",
    "then",
    "else",
    "default",
    "repeat",
    "choose",
    "data",
    "data_template",
    "service_data",
    "target",
    "variables",
    "metadata",
}

class EntityRefResult:
    """单条引用结果."""

    def __init__(
        self,
        location: str,
        source_type: str,
        source_id: str,
        field_path: str,
        context: str,
        line: int = 0,
    ):
        self.location = location  # 可读位置描述
        self.source_type = source_type  # automation / script / scene / dashboard / template
        self.source_id = source_id  # 实体 ID 或 URL
        self.field_path = field_path  # JSON 路径
        self.context = context  # 上下文片段
        self.line = line

    def to_dict(self) -> dict[str, Any]:
        return {
            "location": self.location,
            "source_type": self.source_type,
            "source_id": self.source_id,
            "field_path": self.field_path,
            "context": self.context,
            "line": self.line,
        }

    def __repr__(self) -> str:
        return f"[{self.source_type}] {self.source_id} → {self.field_path}"

class EntityRefFinder:
    """查找 HA 中所有对指定 entity_id 的引用."""

    def __init__(self, hass: HomeAssistant, hass_token: str | None = None):
        self.hass = hass
        self._hass_token = hass_token
        self._target: str = ""
        self._results: list[EntityRefResult] = []

    async def find(self, entity_id: str) -> list[dict[str, Any]]:
        """查找 entity_id 的所有引用位置."""
        self._target = entity_id
        self._results = []

        await self._scan_automations()
        await self._scan_scripts()
        await self._scan_scenes()
        await self._scan_dashboards()
        await self._scan_blueprints()

        return [r.to_dict() for r in self._results]

    async def replace(
        self, old_id: str, new_id: str, preview: bool = True
    ) -> dict[str, Any]:
        """替换 entity_id，支持 preview 模式."""
        refs = await self.find(old_id)

        if preview:
            return {
                "preview": True,
                "old_id": old_id,
                "new_id": new_id,
                "references": refs,
                "affected_count": len(
                    {(r["source_type"], r["source_id"]) for r in refs}
                ),
                "total_refs": len(refs),
            }

        # 执行模式
        updated = {"automations": [], "scripts": [], "scenes": [], "dashboards": []}

        # 按来源分组引用
        auto_refs = [r for r in self._results if r.source_type == "automation"]
        script_refs = [r for r in self._results if r.source_type == "script"]
        scene_refs = [r for r in self._results if r.source_type == "scene"]
        dash_refs = [r for r in self._results if r.source_type == "dashboard"]

        # 更新自动化
        for r in auto_refs:
            try:
                config = await self._get_auto_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    if await self._save_auto_config(r.source_id, config):
                        updated["automations"].append(r.source_id)
                    else:
                        _LOGGER.error("Saving automation %s failed after entity replacement", r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update automation %s: %s", r.source_id, e, exc_info=True)

        # 更新脚本
        for r in script_refs:
            try:
                config = await self._get_script_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    await self._save_script_config(r.source_id, config)
                    updated["scripts"].append(r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update script %s: %s", r.source_id, e, exc_info=True)

        # 更新场景
        for r in scene_refs:
            try:
                config = await self._get_scene_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    await self._save_scene_config(r.source_id, config)
                    updated["scenes"].append(r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update scene %s: %s", r.source_id, e, exc_info=True)

        # 更新仪表盘
        updated_dashboards = await self._update_dashboards(dash_refs, old_id, new_id)
        updated["dashboards"] = updated_dashboards

        return {
            "preview": False,
            "old_id": old_id,
            "new_id": new_id,
            "updated": updated,
            "total_updated": sum(len(v) for v in updated.values()),
        }

    async def reload_affected(self) -> dict[str, Any]:
        """替换后重新加载自动化、脚本、场景。"""
        result = {"automations": False, "scripts": False, "scenes": False}
        try:
            await self.hass.services.async_call("automation", "reload", blocking=True)
            result["automations"] = True
        except Exception as e:
            _LOGGER.error("Failed to reload automations: %s", e, exc_info=True)
        try:
            await self.hass.services.async_call("script", "reload", blocking=True)
            result["scripts"] = True
        except Exception as e:
            _LOGGER.error("Failed to reload scripts: %s", e, exc_info=True)
        try:
            await self.hass.services.async_call("scene", "reload", blocking=True)
            result["scenes"] = True
        except Exception as e:
            _LOGGER.error("Failed to reload scenes: %s", e, exc_info=True)
        return result

    # ── 扫描实现 ─────────────────────────────

    async def _scan_automations(self) -> None:
        """扫描所有自动化以查找 entity_id 引用。"""
        entity_ids = self.hass.states.async_entity_ids("automation")
        for eid in entity_ids:
            try:
                config = await self._get_auto_config(eid)
                if config:
                    self._scan_value(
                        config,
                        source_type="automation",
                        source_id=eid,
                        path="$",
                    )
            except Exception as exc:
                _LOGGER.debug("Skip automation %s: %s", eid, exc)

    async def _scan_scripts(self) -> None:
        """扫描所有脚本以查找 entity_id 引用。"""
        entity_ids = self.hass.states.async_entity_ids("script")
        for eid in entity_ids:
            try:
                config = await self._get_script_config(eid)
                if config:
                    self._scan_value(
                        config,
                        source_type="script",
                        source_id=eid,
                        path="$",
                    )
            except Exception as exc:
                _LOGGER.debug("Skip script %s: %s", eid, exc)

    async def _scan_scenes(self) -> None:
        """扫描所有场景以查找 entity_id 引用。"""
        entity_ids = self.hass.states.async_entity_ids("scene")
        for eid in entity_ids:
            try:
                config = await self._get_scene_config(eid)
                if config:
                    self._scan_value(
                        config,
                        source_type="scene",
                        source_id=eid,
                        path="$",
                    )
            except Exception as exc:
                _LOGGER.debug("Skip scene %s: %s", eid, exc)

    async def _scan_dashboards(self) -> None:
        """扫描所有 Lovelace 仪表盘以查找 entity_id 引用。"""
        lovelace_data = self.hass.data.get(LOVELACE_DATA)
        if not lovelace_data:
            return

        dashboards = lovelace_data.dashboards
        # 扫描默认仪表盘
        try:
            config = await self._get_dash_config(None)
            if config:
                self._scan_value(
                    config,
                    source_type="dashboard",
                    source_id="lovelace_default",
                    path="$",
                )
        except Exception as exc:
            _LOGGER.debug("Skip default dashboard: %s", exc)

        # 扫描自定义仪表盘
        for url_path in dashboards:
            try:
                config = await self._get_dash_config(url_path)
                if config:
                    self._scan_value(
                        config,
                        source_type="dashboard",
                        source_id=url_path,
                        path="$",
                    )
            except Exception as exc:
                _LOGGER.debug("Skip dashboard %s: %s", url_path, exc)

    async def _scan_blueprints(self) -> None:
        """扫描自动化 / 脚本蓝图以查找 entity_id 引用。"""
        getters = {
            "automation": async_get_automation_blueprints,
            "script": async_get_script_blueprints,
        }
        for domain, get_blueprints in getters.items():
            try:
                blueprints: DomainBlueprints = get_blueprints(self.hass)
                for bp_path, bp in (await blueprints.async_get_blueprints()).items():
                    if not isinstance(bp, Blueprint):
                        continue
                    self._scan_value(
                        bp.data,
                        source_type="blueprint",
                        source_id=bp_path,
                        path="$",
                    )
            except Exception as exc:
                _LOGGER.debug("Skip %s blueprint scan: %s", domain, exc)

    def _scan_value(self, value: Any, *, source_type: str, source_id: str, path: str) -> None:
        """递归扫描值以查找 entity_id 引用。"""
        if value is None:
            return

        if isinstance(value, str):
            self._scan_string(value, source_type, source_id, path)
            return

        if isinstance(value, dict):
            for key, val in value.items():
                child_path = f"{path}.{key}"
                if key in _ENTITY_KEYS and isinstance(val, str):
                    self._check_entity_match(val, source_type, source_id, child_path)
                # 同时扫描键（模板字符串）与值
                if isinstance(key, str):
                    self._scan_string(key, source_type, source_id, child_path)
                self._scan_value(val, source_type=source_type, source_id=source_id, path=child_path)
            return

        if isinstance(value, list):
            for i, item in enumerate(value):
                child_path = f"{path}[{i}]"
                self._scan_value(item, source_type=source_type, source_id=source_id, path=child_path)
            return

        # 其他类型（数字、布尔）——跳过
        return

    def _scan_string(self, text: str, source_type: str, source_id: str, path: str) -> None:
        """扫描字符串以查找直接 entity_id 或模板引用。"""
        # 直接 entity_id 匹配
        for match in _ENTITY_ID_RE.finditer(text):
            if match.group(0) == self._target:
                ctx = self._get_context(text, match.start(), match.end())
                self._results.append(
                    EntityRefResult(
                        location=f"{source_type}/{source_id} at {path}",
                        source_type=source_type,
                        source_id=source_id,
                        field_path=path,
                        context=ctx,
                    )
                )

        # Jinja2 模板匹配
        for match in _JINJA_STATES_RE.finditer(text):
            captured = match.group(1)
            if captured == self._target:
                ctx = self._get_context(text, match.start(), match.end())
                self._results.append(
                    EntityRefResult(
                        location=f"{source_type}/{source_id} at {path} (template)",
                        source_type=source_type,
                        source_id=source_id,
                        field_path=path,
                        context=ctx,
                    )
                )

        # hass.states["xxx"] 匹配
        for match in _HASS_STATES_RE.finditer(text):
            captured = match.group(1)
            if captured == self._target:
                ctx = self._get_context(text, match.start(), match.end())
                self._results.append(
                    EntityRefResult(
                        location=f"{source_type}/{source_id} at {path} (hass.states)",
                        source_type=source_type,
                        source_id=source_id,
                        field_path=path,
                        context=ctx,
                    )
                )

    def _check_entity_match(self, text: str, source_type: str, source_id: str, path: str) -> None:
        """检查文本是否精确匹配目标 entity_id。"""
        if text == self._target:
            self._results.append(
                EntityRefResult(
                    location=f"{source_type}/{source_id} at {path}",
                    source_type=source_type,
                    source_id=source_id,
                    field_path=path,
                    context=text,
                )
            )

    @staticmethod
    def _get_context(text: str, start: int, end: int, width: int = 60) -> str:
        """提取匹配项的上下文。"""
        ctx_start = max(0, start - width)
        ctx_end = min(len(text), end + width)
        prefix = "…" if ctx_start > 0 else ""
        suffix = "…" if ctx_end < len(text) else ""
        return f"{prefix}{text[ctx_start:ctx_end]}{suffix}"

    def _replace_in_value(self, value: Any, old_id: str, new_id: str) -> bool:
        """在配置结构中递归替换 entity_id 引用。"""
        changed = False
        # 按整词匹配：实体 ID 由 [a-z0-9_] 组成，. 非单词字符，故 \b 边界
        # 不会跨过 _ 等单词字符，从而区分 light.kitchen 与 light.kitchen_table。
        pattern = re.compile(r"\b" + re.escape(old_id) + r"\b")
        if isinstance(value, dict):
            for key, val in list(value.items()):
                if isinstance(val, str):
                    if val == old_id:
                        value[key] = new_id
                        changed = True
                    elif pattern.search(val):
                        new_val = pattern.sub(new_id, val)
                        if new_val != val:
                            value[key] = new_val
                            changed = True
                elif isinstance(val, (dict, list)):
                    if self._replace_in_value(val, old_id, new_id):
                        changed = True
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, str):
                    if item == old_id:
                        value[i] = new_id
                        changed = True
                    elif pattern.search(item):
                        new_item = pattern.sub(new_id, item)
                        if new_item != item:
                            value[i] = new_item
                            changed = True
                elif isinstance(item, (dict, list)):
                    if self._replace_in_value(item, old_id, new_id):
                        changed = True
        return changed

    async def _read_config_file(self, filename: str):
        """读取 HA 配置目录下的 YAML 配置——解析交给 executor，避免阻塞事件循环。"""
        try:
            return await self.hass.async_add_executor_job(
                load_yaml, self.hass.config.path(filename)
            )
        except (OSError, HomeAssistantError):
            return None

    def _config_key(self, entity_id: str) -> str:
        """取配置键。"""
        entry = er.async_get(self.hass).async_get(entity_id)
        if entry is not None and entry.unique_id:
            return entry.unique_id
        return entity_id.split(".", 1)[1] if "." in entity_id else entity_id

    def _get_entity_raw_config(self, entity_id: str) -> dict | None:
        """读取实体状态属性 config——automation / script 实体均暴露其 raw_config。"""
        state = self.hass.states.get(entity_id)
        config = state.attributes.get("config") if state is not None else None
        return dict(config) if isinstance(config, dict) else None

    async def _get_auto_config(self, entity_id: str) -> dict | None:
        """读取自动化原始配置。"""
        return self._get_entity_raw_config(entity_id)

    async def _save_auto_config(self, entity_id: str, config: dict) -> bool:
        """保存自动化配置，并恢复其原有开关状态。"""
        was_on = self.hass.states.is_state(entity_id, "on")
        # 保存会触发自动化重载——先临时关闭，避免编辑期间被触发
        try:
            await self.hass.services.async_call(
                "automation", "turn_off", {"entity_id": entity_id}, blocking=False
            )
        except Exception:
            pass

        saved = await self._async_post_config(
            "automation", self._config_key(entity_id), config
        )

        # 无论保存成功与否都恢复先前的开关状态
        if was_on:
            try:
                await self.hass.services.async_call(
                    "automation", "turn_on", {"entity_id": entity_id}, blocking=False
                )
            except Exception:
                pass
        return saved

    async def _get_script_config(self, entity_id: str) -> dict | None:
        """读取脚本原始配置。"""
        return self._get_entity_raw_config(entity_id)

    async def _save_script_config(self, entity_id: str, config: dict) -> bool:
        """保存脚本配置。"""
        return await self._async_post_config(
            "script", self._config_key(entity_id), config
        )

    async def _get_scene_config(self, entity_id: str) -> dict | None:
        """读取场景配置——场景实体不暴露 config 属性，须回查 scenes.yaml。"""
        scene_id = self._config_key(entity_id)
        entries = await self._read_config_file("scenes.yaml")
        if not isinstance(entries, list):
            return None
        for entry in entries:
            if isinstance(entry, dict) and entry.get("id") == scene_id:
                return dict(entry)
        return None

    async def _save_scene_config(self, entity_id: str, config: dict) -> bool:
        """保存场景配置。"""
        return await self._async_post_config(
            "scene", self._config_key(entity_id), config
        )

    async def _async_post_config(self, domain: str, config_key: str, config: dict) -> bool:
        """经 HA 配置接口写回 automation / script / scene 配置。"""
        if not self._hass_token:
            _LOGGER.error("Cannot save %s config: no HA access token", domain)
            return False
        try:
            base_url = get_url(self.hass)
        except NoURLAvailableError:
            _LOGGER.error("Cannot save %s config: no HA URL available", domain)
            return False

        try:
            session = async_get_clientsession(self.hass)
            async with session.post(
                f"{base_url}/api/config/{domain}/config/{config_key}",
                json=config,
                headers={
                    "Authorization": f"Bearer {self._hass_token}",
                    "Content-Type": "application/json",
                },
            ) as resp:
                if resp.status != 200:
                    _LOGGER.error(
                        "Saving %s config %s failed: HTTP %s",
                        domain,
                        config_key,
                        resp.status,
                    )
                    return False
                return True
        except Exception as err:
            _LOGGER.error(
                "Saving %s config %s failed: %s",
                domain,
                config_key,
                err,
                exc_info=True,
            )
            return False

    async def _get_dash_config(self, url_path: str | None) -> dict | None:
        """通过内部 API 获取 Lovelace 仪表盘配置。"""
        try:

            lovelace_data = self.hass.data.get(LOVELACE_DATA)
            if not lovelace_data:
                return None
            dashboards = lovelace_data.dashboards
            config_obj = dashboards.get(url_path)
            if config_obj:
                return await config_obj.async_load(False)
        except Exception:
            pass
        return None

    async def _update_dashboards(
        self, refs: list[EntityRefResult], old_id: str, new_id: str
    ) -> list[str]:
        """更新仪表盘中的 entity_id 引用。"""
        lovelace_data = self.hass.data.get(LOVELACE_DATA)
        if not lovelace_data:
            return []

        updated = []
        dashboards = lovelace_data.dashboards

        dash_urls = set(r.source_id for r in refs)

        for url_path in dash_urls:
            try:
                dash_url = None if url_path == "lovelace_default" else url_path
                config_obj = dashboards.get(dash_url)
                if not config_obj:
                    continue
                config = await config_obj.async_load(False)
                if config and isinstance(config, dict):
                    if self._replace_in_value(config, old_id, new_id):
                        await config_obj.async_save(config)
                        updated.append(url_path)
            except Exception as e:
                _LOGGER.error("Update dashboard %s failed: %s", url_path, e, exc_info=True)

        return updated