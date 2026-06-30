"""Constants for HACS Vision."""
from homeassistant.const import Platform

DOMAIN = "hacs_vision"
DOMAIN_HACS = "hacs"
VERSION = "6.0.0b0"

PANEL_TITLE = "HACS Vision"
PANEL_ICON = "hacs:hacs"

STORAGE_PATHS = {
    "repositories": ".storage/hacs.repositories",
    "data": ".storage/hacs.data",
    "config": ".storage/hacs.hacs",
    "install_times": ".storage/hacs_vision_install_times.json",
    "favorites": ".storage/hacs_vision_favorites.json",
    "custom_repos": ".storage/hacs_vision_custom_repos.json",
    "settings": ".storage/hacs_vision_settings.json",
    "github_token": ".storage/hacs_vision_github_token.json",
    "ignored_versions": ".storage/hacs_vision_ignored_versions.json",
}

API_BASE = "/api/hacs_vision"

CONF_UPDATE_INTERVAL = "update_interval"
DEFAULT_UPDATE_INTERVAL = 3600

PLATFORMS: list[Platform] = []

# ── GitHub API base URLs ──
GITHUB_API_BASE = "https://api.github.com"
GITHUB_COM_BASE = "https://github.com"
GITHUB_LOGIN_BASE = "https://github.com/login"
HA_LOCALHOST_FALLBACK = "http://localhost:8123"

# ── Valid HACS categories for repo operations ──
VALID_HACS_CATEGORIES = {"integration", "plugin", "python_script", "theme", "appdaemon", "netdaemon", "template"}

# ── Default repos ──
AUTO_STAR_REPO = "C3H3-AI/hacs-vision"