"""Config flow for HACS Vision."""
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN, PANEL_TITLE, VERSION


class HACSEnhancedConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for HACS Vision."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step — zero-config, create entry immediately."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title=PANEL_TITLE, data={})

    async_step_import = async_step_user

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return HACSEnhancedOptionsFlow(config_entry)


class HACSEnhancedOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for HACS Vision — display status info."""

    def __init__(self, config_entry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options — show current status, no configurable fields."""
        if user_input is not None:
            return self.async_create_entry(title="", data={})
        return self.async_show_form(
            step_id="init",
            description_placeholders={
                "version": VERSION,
            },
        )
