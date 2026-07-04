"""Auto-update manager for HACS Vision — periodic scheduling engine.

Design:
  - Uses async_track_time_interval for reliable periodic scheduling
  - Non-overlapping runs: skips if previous cycle still in progress
  - Whitelist-based: only auto-updates repos the user has explicitly opted in
  - Sends HA persistent notifications for results
  - Respects GitHub API rate limits via existing HACSOperator mechanisms
"""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import (
    DOMAIN,
    CONF_AUTO_UPDATE_ENABLED,
    CONF_AUTO_UPDATE_REPOS,
    CONF_AUTO_UPDATE_INTERVAL,
    CONF_AUTO_UPDATE_NOTIFY,
    DEFAULT_AUTO_UPDATE_ENABLED,
    DEFAULT_AUTO_UPDATE_REPOS,
    DEFAULT_AUTO_UPDATE_INTERVAL,
    DEFAULT_AUTO_UPDATE_NOTIFY,
)

_LOGGER = logging.getLogger(__name__)

SIGNAL_AUTO_UPDATE_STATE = f"{DOMAIN}_auto_update_state"

# Fixed notification ID so new notifications replace old ones
NOTIFICATION_ID = "hacs_vision_auto_update"


class AutoUpdateManager:
    """Manages periodic auto-update of HACS repositories.

    Lifecycle:
      1. Created during async_setup_entry
      2. start() begins periodic scheduling
      3. stop() cancels the interval
      4. trigger() performs a one-shot update cycle
    """

    def __init__(self, hass: HomeAssistant, operator, data) -> None:
        self.hass = hass
        self.operator = operator
        self.data = data
        self._unsub_interval: callable | None = None
        self._running: bool = False  # True when a cycle is in progress
        self._pending_trigger: bool = False  # coalesce trigger() during a run
        self._coalescing: bool = False  # coalesced task scheduled but not yet started

    # ── Public API ───────────────────────────────────────

    @property
    def is_running(self) -> bool:
        """Whether an update cycle is currently in progress."""
        return self._running

    @property
    def is_scheduled(self) -> bool:
        """Whether periodic scheduling is active."""
        return self._unsub_interval is not None

    async def start(self) -> None:
        """Start periodic auto-update scheduling from current settings.

        Uses a short initial delay before the first cycle so HA can
        fully boot before making API calls.
        """
        await self._apply_settings(reschedule=True)
        _LOGGER.info("AutoUpdateManager started")

    def stop(self) -> None:
        """Stop periodic scheduling. Safe to call multiple times."""
        self._cancel_interval()
        _LOGGER.info("AutoUpdateManager stopped")

    async def trigger(self) -> dict:
        """Trigger a one-shot update cycle immediately.

        Returns the result dict from the cycle (or an error dict if skipped).
        """
        if self._running or self._coalescing:
            _LOGGER.warning("Auto-update trigger: cycle already in progress, coalescing")
            self._pending_trigger = True
            return {"success": True, "queued": True, "message": "更新已排队，将在当前周期完成后执行"}

        error = await self._ensure_operator_ready()
        if error:
            return error

        return await self._run_update_cycle(source="manual")

    async def reload_settings(self) -> None:
        """Reload settings and reschedule. Called when user updates config."""
        await self._apply_settings(reschedule=True)

    # ── Internal ─────────────────────────────────────────

    async def _apply_settings(self, reschedule: bool = False) -> None:
        """Read settings and apply config. Optionally reschedule interval."""
        settings = await self.data.get_settings()
        enabled = settings.get(CONF_AUTO_UPDATE_ENABLED, DEFAULT_AUTO_UPDATE_ENABLED)

        if not enabled:
            self._cancel_interval()
            _LOGGER.info("Auto-update is disabled in settings")
            return

        if reschedule:
            interval = settings.get(CONF_AUTO_UPDATE_INTERVAL, DEFAULT_AUTO_UPDATE_INTERVAL)
            self._schedule_interval(interval)

    def _schedule_interval(self, interval_seconds: int) -> None:
        """Set up periodic scheduling with the given interval.

        Uses async_call_later for the initial fire to prevent HA startup
        burst, then async_track_time_interval for subsequent cycles.
        """
        self._cancel_interval()
        interval = timedelta(seconds=max(interval_seconds, 600))  # minimum 10 min

        # First cycle: fire after a 60s delay to let HA fully boot
        # Then switch to the regular interval
        async def _first_then_interval(_now=None):
            self._unsub_interval = async_track_time_interval(
                self.hass, self._on_interval, interval
            )
            await self._on_interval(_now)

        self._unsub_interval = self.hass.loop.call_later(
            60, lambda: self.hass.async_create_task(_first_then_interval())
        )
        _LOGGER.info("Auto-update scheduled every %d seconds (first cycle in 60s)", interval_seconds)

    def _cancel_interval(self) -> None:
        """Remove the current interval callback if any.

        Handles both async_track_time_interval callables and
        call_later TimerHandle objects.
        """
        if self._unsub_interval is not None:
            if hasattr(self._unsub_interval, 'cancel'):
                self._unsub_interval.cancel()
            else:
                try:
                    self._unsub_interval()
                except Exception:
                    pass
            self._unsub_interval = None

    async def _on_interval(self, _now) -> None:
        """Interval callback — start a non-overlapping update cycle."""
        if self._running:
            _LOGGER.debug("Auto-update interval: previous cycle still running, skipping")
            return

        error = await self._ensure_operator_ready()
        if error:
            return

        await self._run_update_cycle(source="scheduled")

    async def _ensure_operator_ready(self) -> dict | None:
        """Check HACS availability. Returns error dict or None."""
        if not self.operator.available:
            _LOGGER.warning("Auto-update skipped: HACS not available")
            return {"success": False, "error": "HACS not available"}
        return None

    async def _run_update_cycle(self, source: str = "scheduled") -> dict:
        """Execute one full update cycle.

        Steps:
          1. Read settings for whitelist and notification preferences
          2. Fetch available updates from HACS
          3. Filter to whitelisted repos only
          4. Install each in sequence (respecting per-repo locks in operator)
          5. Send notification with results
        """
        self._coalescing = False
        self._running = True
        self._dispatch_state()

        try:
            settings = await self.data.get_settings()
            notify = settings.get(CONF_AUTO_UPDATE_NOTIFY, DEFAULT_AUTO_UPDATE_NOTIFY)
            # 1. Fetch available updates
            _LOGGER.debug("Auto-update cycle starting (source=%s)", source)
            updates = await self.operator.get_available_updates()
            if not updates:
                _LOGGER.info("Auto-update: no updates available")
                if notify:
                    await self.data.send_persistent_notification(
                        "HACS Vision - 自动更新",
                        "🔄 自动更新检查完成，没有可用更新",
                        notification_id=NOTIFICATION_ID,
                    )
                return {"success": True, "updated": [], "errors": [], "source": source}

            # 2. Filter to whitelisted repos
            whitelist_raw = settings.get(CONF_AUTO_UPDATE_REPOS, DEFAULT_AUTO_UPDATE_REPOS)
            whitelist = {r.lower() for r in whitelist_raw if isinstance(r, str)} if isinstance(whitelist_raw, list) else set()
            if not whitelist:
                _LOGGER.info("Auto-update: %d updates available, but no whitelist configured", len(updates))
                return {"success": True, "updated": [], "errors": [], "source": source}

            target_updates = [u for u in updates if (u.get("full_name") or "").lower() in whitelist]
            if not target_updates:
                _LOGGER.info("Auto-update: %d updates available, none in whitelist", len(updates))
                return {"success": True, "updated": [], "errors": [], "source": source}

            _LOGGER.info("Auto-update: %d repos to update (of %d available, whitelist=%d)",
                         len(target_updates), len(updates), len(whitelist))

            # 3. Install each in sequence
            updated = []
            errors = []
            for repo in target_updates:
                full_name = repo.get("full_name", "")
                version = repo.get("latest_version", "")
                try:
                    result = await self.operator.install_repository_version(full_name)
                    if result.get("success"):
                        updated.append({"full_name": full_name, "version": version})
                        _LOGGER.info("Auto-updated: %s → %s", full_name, version)
                    else:
                        errors.append({"full_name": full_name, "error": result.get("error", "unknown")})
                        _LOGGER.warning("Auto-update failed for %s: %s", full_name, result.get("error"))
                except Exception as e:
                    errors.append({"full_name": full_name, "error": str(e)})
                    _LOGGER.error("Auto-update error for %s: %s", full_name, e, exc_info=True)

            # 4. Send notification
            if notify:
                msg_lines = [f"🔄 HACS Vision 自动更新 ({source})"]
                if updated:
                    msg_lines.append(f"\n✅ 已更新 {len(updated)} 个仓库：")
                    for r in updated:
                        msg_lines.append(f"  • {r['full_name']} → {r['version']}")
                if errors:
                    msg_lines.append(f"\n❌ 失败 {len(errors)} 个：")
                    for r in errors:
                        msg_lines.append(f"  • {r['full_name']}: {r['error']}")
                if not updated and not errors:
                    msg_lines.append("\n没有需要更新的仓库")
                await self.data.send_persistent_notification(
                    "HACS Vision - 自动更新",
                    "\n".join(msg_lines),
                    notification_id=NOTIFICATION_ID,
                )

            result = {"success": True, "updated": updated, "errors": errors, "source": source}
            _LOGGER.info("Auto-update cycle complete: %d updated, %d errors", len(updated), len(errors))
            return result

        except Exception as e:
            _LOGGER.error("Auto-update cycle error: %s", e, exc_info=True)
            if notify:
                await self.data.send_persistent_notification(
                    "HACS Vision - 自动更新",
                    f"❌ 自动更新出错：{e}",
                    notification_id=NOTIFICATION_ID,
                )
            return {"success": False, "error": str(e), "source": source}

        finally:
            self._running = False
            self._dispatch_state()
            # Handle coalesced trigger
            if self._pending_trigger:
                self._pending_trigger = False
                if not self._running:
                    self._coalescing = True
                    self.hass.async_create_task(self._run_update_cycle(source="manual"))

    def _dispatch_state(self) -> None:
        """Dispatch state signal so frontend can react."""
        payload = {
            "running": self._running,
            "scheduled": self._unsub_interval is not None,
            "pending": self._pending_trigger,
            "coalescing": self._coalescing,
        }
        # Internal signal for other HA components
        async_dispatcher_send(self.hass, SIGNAL_AUTO_UPDATE_STATE, payload)
        # HA event bus for frontend subscription
        self.hass.bus.async_fire(SIGNAL_AUTO_UPDATE_STATE, payload)