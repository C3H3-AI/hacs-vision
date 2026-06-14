"""Config flow for HACS Vision — panel integration, no options flow."""
from homeassistant import config_entries
from .const import DOMAIN, PANEL_TITLE


class HACSEnhancedConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for HACS Vision."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step — zero-config, create entry immediately."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title=PANEL_TITLE, data={})

    async_step_import = async_step_user
