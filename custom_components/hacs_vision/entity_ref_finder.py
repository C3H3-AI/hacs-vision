"""Entity Reference Finder - 查找和替换 HA 中所有对 entity_id 的引用."""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# 匹配标准 entity_id 格式：domain.object_id
# 包含 HA 官方所有标准 entity domain，按字母序排列便于维护
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

        # Execute mode
        updated = {"automations": [], "scripts": [], "scenes": [], "dashboards": []}

        # Group refs by source
        auto_refs = [r for r in self._results if r.source_type == "automation"]
        script_refs = [r for r in self._results if r.source_type == "script"]
        scene_refs = [r for r in self._results if r.source_type == "scene"]
        dash_refs = [r for r in self._results if r.source_type == "dashboard"]

        # Update automations
        for r in auto_refs:
            try:
                config = await self._get_auto_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    await self._save_auto_config(r.source_id, config)
                    updated["automations"].append(r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update automation %s: %s", r.source_id, e, exc_info=True)

        # Update scripts
        for r in script_refs:
            try:
                config = await self._get_script_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    await self._save_script_config(r.source_id, config)
                    updated["scripts"].append(r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update script %s: %s", r.source_id, e, exc_info=True)

        # Update scenes
        for r in scene_refs:
            try:
                config = await self._get_scene_config(r.source_id)
                if self._replace_in_value(config, old_id, new_id):
                    await self._save_scene_config(r.source_id, config)
                    updated["scenes"].append(r.source_id)
            except Exception as e:
                _LOGGER.error("Failed to update scene %s: %s", r.source_id, e, exc_info=True)

        # Update dashboards
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
        """Reload automations, scripts, scenes after replacement."""
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

    # ── Scan implementations ─────────────────────────────

    async def _scan_automations(self) -> None:
        """Scan all automations for entity_id references."""
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
        """Scan all scripts for entity_id references."""
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
        """Scan all scenes for entity_id references."""
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
        """Scan all Lovelace dashboards for entity_id references."""
        from homeassistant.components.lovelace.const import LOVELACE_DATA

        lovelace_data = self.hass.data.get(LOVELACE_DATA)
        if not lovelace_data:
            return

        dashboards = getattr(lovelace_data, "dashboards", {})
        # Scan default dashboard
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

        # Scan custom dashboards
        for url_path, dash in dashboards.items():
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
        """Scan blueprints for entity_id references (via REST API / SSH)."""
        try:
            from homeassistant.components.blueprint.models import DomainBlueprints
            for domain in ("automation", "script"):
                blueprints: DomainBlueprints | None = self.hass.data.get(
                    f"blueprint.{domain}"
                )
                if not blueprints:
                    continue
                for bp_path, bp in blueprints.blueprints.items():
                    if bp is None:
                        continue
                    self._scan_value(
                        bp.metadata,
                        source_type="blueprint",
                        source_id=bp_path,
                        path="$",
                    )
                    if bp.blueprint:
                        self._scan_value(
                            bp.blueprint,
                            source_type="blueprint",
                            source_id=bp_path,
                            path="$.blueprint",
                        )
        except Exception as exc:
            _LOGGER.debug("Skip blueprint scan: %s", exc)

    # ── Core scanning logic ──────────────────────────────

    def _scan_value(self, value: Any, *, source_type: str, source_id: str, path: str) -> None:
        """Recursively scan a value for entity_id references."""
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
                # Scan both key (for template strings) and value
                if isinstance(key, str):
                    self._scan_string(key, source_type, source_id, child_path)
                self._scan_value(val, source_type=source_type, source_id=source_id, path=child_path)
            return

        if isinstance(value, list):
            for i, item in enumerate(value):
                child_path = f"{path}[{i}]"
                self._scan_value(item, source_type=source_type, source_id=source_id, path=child_path)
            return

        # Other types (numbers, bools) - skip
        return

    def _scan_string(self, text: str, source_type: str, source_id: str, path: str) -> None:
        """Scan a string for direct entity_id or template references."""
        # Direct entity_id match
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

        # Jinja2 template match
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

        # hass.states["xxx"] match
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
        """Check if text exactly matches the target entity_id."""
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
        """Extract surrounding context for a match."""
        ctx_start = max(0, start - width)
        ctx_end = min(len(text), end + width)
        prefix = "…" if ctx_start > 0 else ""
        suffix = "…" if ctx_end < len(text) else ""
        return f"{prefix}{text[ctx_start:ctx_end]}{suffix}"

    # ── Replace helper ───────────────────────────────────

    def _replace_in_value(self, value: Any, old_id: str, new_id: str) -> bool:
        """Recursively replace entity_id references in a config structure."""
        changed = False
        if isinstance(value, dict):
            for key, val in list(value.items()):
                if isinstance(val, str):
                    if val == old_id:
                        value[key] = new_id
                        changed = True
                    elif old_id in val:
                        # Also handle embedded occurrences (templates, etc.)
                        new_val = val.replace(old_id, new_id)
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
                    elif old_id in item:
                        new_item = item.replace(old_id, new_id)
                        if new_item != item:
                            value[i] = new_item
                            changed = True
                elif isinstance(item, (dict, list)):
                    if self._replace_in_value(item, old_id, new_id):
                        changed = True
        return changed

    # ── HA Config API helpers ────────────────────────────

    async def _read_storage_file(self, filename: str) -> dict | None:
        """Read a .storage JSON file directly (async — no blocking call)."""
        try:
            path = self.hass.config.path(".storage", filename)
            return await self.hass.async_add_executor_job(self._read_json_file, path)
        except Exception:
            return None

    def _read_json_file(self, path: str) -> dict | None:
        """Synchronous JSON file read — runs in executor."""
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None

    async def _get_auto_config(self, entity_id: str) -> dict | None:
        """Get automation config via HA API."""
        # Method 1: state.attributes["config"] (HA <2025.7)
        try:
            state = self.hass.states.get(entity_id)
            if state and "config" in state.attributes:
                return dict(state.attributes["config"])
        except Exception:
            pass
        # Method 2: hass.data automation_config (HA internal)
        try:
            config = self.hass.data.get("automation_config", {})
            if entity_id in config:
                return dict(config[entity_id])
        except Exception:
            pass
        # Method 3: read .storage file directly (HA 2025.7+)
        try:
            auto_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
            storage_data = await self._read_storage_file(f"automation.{auto_id}")
            if storage_data and "config" in storage_data:
                return dict(storage_data["config"])
        except Exception:
            pass
        return None

    async def _save_auto_config(self, entity_id: str, config: dict) -> bool:
        """Save automation config via HA API."""
        auto_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
        try:
            await self.hass.services.async_call(
                "automation", "turn_off", {"entity_id": entity_id}, blocking=False
            )
        except Exception:
            pass
        # Method 1: internal API (HA <2025.9)
        try:
            from homeassistant.components.automation.config import (
                async_set_automation_config,
            )
            await async_set_automation_config(
                self.hass, auto_id, config, source="storage"
            )
            return True
        except Exception:
            pass
        # Method 2: REST API fallback (HA 2025.9+) — use the token passed from API handler
        if self._hass_token:
            try:
                from homeassistant.helpers.aiohttp_client import async_get_clientsession
                base_url = self.hass.http.get_url()
                headers = {"Authorization": f"Bearer {self._hass_token}", "Content-Type": "application/json"}
                session = async_get_clientsession(self.hass)
                async with session.post(
                    f"{base_url}/api/config/automation/config/{auto_id}",
                    json=config, headers=headers
                ) as resp:
                    return resp.status == 200
            except Exception as e:
                _LOGGER.error("Save auto config failed: %s", e, exc_info=True)
                return False

    async def _get_script_config(self, entity_id: str) -> dict | None:
        """Get script config via HA API."""
        try:
            state = self.hass.states.get(entity_id)
            if state and "config" in state.attributes:
                return dict(state.attributes["config"])
        except Exception:
            pass
        try:
            script_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
            storage_data = await self._read_storage_file(f"script.{script_id}")
            if storage_data and "config" in storage_data:
                return dict(storage_data["config"])
        except Exception:
            pass
        return None

    async def _save_script_config(self, entity_id: str, config: dict) -> bool:
        """Save script config via HA API."""
        script_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
        try:
            from homeassistant.components.script.config import (
                async_set_script_config,
            )
            await async_set_script_config(
                self.hass, script_id, config, source="storage"
            )
            return True
        except Exception as e:
            _LOGGER.error("Save script config failed: %s", e, exc_info=True)
            return False

    async def _get_scene_config(self, entity_id: str) -> dict | None:
        """Get scene config via HA API."""
        try:
            state = self.hass.states.get(entity_id)
            if state and "config" in state.attributes:
                return dict(state.attributes["config"])
        except Exception:
            pass
        try:
            scene_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
            storage_data = await self._read_storage_file(f"scene.{scene_id}")
            if storage_data and "config" in storage_data:
                return dict(storage_data["config"])
        except Exception:
            pass
        return None

    async def _save_scene_config(self, entity_id: str, config: dict) -> bool:
        """Save scene config via HA API."""
        scene_id = entity_id.split(".", 1)[1] if "." in entity_id else entity_id
        try:
            from homeassistant.components.scene.config import (
                async_set_scene_config,
            )
            await async_set_scene_config(
                self.hass, scene_id, config, source="storage"
            )
            return True
        except Exception as e:
            _LOGGER.error("Save scene config failed: %s", e, exc_info=True)
            return False

    async def _get_dash_config(self, url_path: str | None) -> dict | None:
        """Get Lovelace dashboard config via internal API."""
        try:
            from homeassistant.components.lovelace.const import LOVELACE_DATA

            lovelace_data = self.hass.data.get(LOVELACE_DATA)
            if not lovelace_data:
                return None
            dashboards = getattr(lovelace_data, "dashboards", {})
            config_obj = dashboards.get(url_path)
            if config_obj:
                return await config_obj.async_load(False)
        except Exception:
            pass
        return None

    async def _update_dashboards(
        self, refs: list[EntityRefResult], old_id: str, new_id: str
    ) -> list[str]:
        """Update entity_id references in dashboards."""
        from homeassistant.components.lovelace.const import LOVELACE_DATA

        lovelace_data = self.hass.data.get(LOVELACE_DATA)
        if not lovelace_data:
            return []

        updated = []
        dashboards = getattr(lovelace_data, "dashboards", {})

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