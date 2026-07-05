"""Update history data manager for HACS Vision."""
from __future__ import annotations
import json
import logging
from datetime import datetime, timedelta, timezone

from .const import STORAGE_PATHS

_LOGGER = logging.getLogger(__name__)

HISTORY_RETENTION_DAYS = 30


class HACSHubHistory:
    """Manages update history records."""

    def __init__(self, hass) -> None:
        self.hass = hass

    def _get_path(self) -> str:
        return self.hass.config.path(STORAGE_PATHS["history"])

    async def get_history(self) -> list[dict]:
        path = self._get_path()
        try:
            data = await self.hass.async_add_executor_job(self._read_json, path)
            if not data or "history" not in data:
                return []
            return data["history"]
        except Exception:
            return []

    async def add_record(self, full_name: str, from_version: str, to_version: str) -> None:
        path = self._get_path()
        now = datetime.now(timezone.utc).isoformat()
        entry = {
            "full_name": full_name,
            "from_version": from_version,
            "to_version": to_version,
            "updated_at": now,
        }
        await self.hass.async_add_executor_job(self._append_and_cleanup, path, entry)

    def _read_json(self, path: str) -> dict | None:
        try:
            with open(path) as f:
                return json.load(f)
        except Exception:
            return None

    def _append_and_cleanup(self, path: str, entry: dict) -> None:
        existing = self._read_json(path) or {}
        history = existing.get("history", [])
        history.append(entry)
        cutoff = datetime.now(timezone.utc) - timedelta(days=HISTORY_RETENTION_DAYS)
        cutoff_ts = cutoff.isoformat()
        history = [h for h in history if h.get("updated_at", "") >= cutoff_ts]
        self._write_json(path, {"history": history})

    def _write_json(self, path: str, data: dict) -> None:
        try:
            with open(path, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            _LOGGER.error("Failed to write history file: %s", e)
