"""HACS Vision 运行时平台。"""
from __future__ import annotations

from homeassistant.components import frontend
from homeassistant.config_entries import ConfigEntry

from .const import DOMAIN, URL_PATH

# 本集成注册的服务名——集中在此，以便卸载时完整清理。
_SERVICES = (
    "refresh",
    "install_repository",
    "find_entity_refs",
    "replace_entity_refs",
    "auto_update_start",
    "auto_update_stop",
    "auto_update_trigger",
    "auto_update_reload_settings",
)

class VisionRuntime:
    """集中持有集成运行期全部状态与子模块实例。"""

    def __init__(
        self,
        hass,
        *,
        shared_data,
        operator,
        backup,
        checker,
        api_view,
        auto_update=None,
    ) -> None:
        self.hass = hass
        self.shared_data = shared_data
        self.operator = operator
        self.backup = backup
        self.checker = checker
        self.api = api_view
        self.auto_update = auto_update
        self.listeners: list = []
        self.bg_tasks: set = set()

    async def shutdown(self) -> None:
        """集中清理所有注册资源。"""
        # 1. 移除侧边栏面板
        try:
            frontend.async_remove_panel(self.hass, URL_PATH)
        except Exception:
            pass

        # 2. 停止 AutoUpdateManager
        if self.auto_update:
            self.auto_update.stop()

        # 3. 移除全部 service
        for svc in _SERVICES:
            try:
                self.hass.services.async_remove(DOMAIN, svc)
            except Exception:
                pass

        # 4. 移除事件监听
        for unsub in self.listeners:
            try:
                unsub()
            except Exception:
                pass
        self.listeners.clear()

        # 5. 关闭共享 aiohttp 会话（如视图提供）
        if self.api and hasattr(self.api, "async_close"):
            try:
                await self.api.async_close()
            except Exception:
                pass

        # 6. 取消后台任务
        for task in list(self.bg_tasks):
            task.cancel()
        self.bg_tasks.clear()

type VisionConfigEntry = ConfigEntry[VisionRuntime]