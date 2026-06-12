"""Constants for HACS Vision."""
from homeassistant.const import Platform

DOMAIN = "hacs_vision"
DOMAIN_HACS = "hacs"
VERSION = "2.3.0"

PANEL_TITLE = "HACS Vision"
PANEL_ICON = "mdi:store"

STORAGE_PATHS = {
    "repositories": ".storage/hacs.repositories",
    "data": ".storage/hacs.data",
    "config": ".storage/hacs.hacs",
    "install_times": ".storage/hacs_vision_install_times.json",
    "favorites": ".storage/hacs_vision_favorites.json",
    "custom_repos": ".storage/hacs_vision_custom_repos.json",
    "settings": ".storage/hacs_vision_settings.json",
}

API_BASE = "/api/hacs_vision"

CONF_UPDATE_INTERVAL = "update_interval"
DEFAULT_UPDATE_INTERVAL = 3600

PLATFORMS: list[Platform] = []