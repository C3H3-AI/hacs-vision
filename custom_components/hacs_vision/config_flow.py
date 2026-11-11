"""HACS Vision 配置流平台。"""
from homeassistant import config_entries
from .const import DOMAIN, PANEL_TITLE

class HACSEnhancedConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """处理 HACS Vision 的配置流。"""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """初始步骤：零配置，立即创建集成实体。"""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        # HA 2026.11 起内置 marketplace 接管并移除了 HACS，两者任一存在即可。
        components = self.hass.config.components
        if "hacs" not in components and "marketplace" not in components:
            return self.async_abort(reason="hacs_not_found")
        return self.async_create_entry(title=PANEL_TITLE, data={})

    async_step_import = async_step_user