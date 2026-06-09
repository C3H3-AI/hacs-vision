# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)

**A modern visual panel for HACS — browse, manage, and configure Home Assistant integrations, plugins, and themes in a built-in storefront interface.**

> **Current version**: v2.0.1 | **Minimum HA**: 2024.1.0

> **⚠️ Prerequisite**: [HACS](https://hacs.xyz) must be already installed and configured.

---

## Features

- **Store Browser** — Browse all HACS repositories with search, category filters, and favorites
- **Updates View** — See all pending updates at a glance, update individual repos or batch update
- **Management View** — Manage downloaded repositories, version history, reinstall
- **Settings** — Configure panel behavior, refresh interval, default view, notifications
- **Config Flow Integration** — Configure HA built-in integrations directly from the panel (via Devices & Services)
- **Notifications** — Get notified when updates are available
- **Responsive Design** — Optimized for both desktop and mobile

---

## Screenshots

| Overview | Store | Management |
|:--------:|:-----:|:----------:|
| ![hero](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/hero.png) | ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_2_store_list.png) | ![manage](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_4_manage.png) |
| **Updates** | **Detail** | **Card View** |
| ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_3_updates.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_5_detail.png) | ![card](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_1_store_card.png) |

---

## Installation

### Via HACS (Recommended)

1. Ensure [HACS](https://hacs.xyz) is installed
2. Go to **HACS → Integrations → Three-dot menu → Custom repositories**
3. Add this repo URL: `https://github.com/C3H3-AI/hacs-vision`
4. Category: **Integration**
5. Click **Install**
6. **Restart Home Assistant**

### Manual Installation

1. Download the latest [release](https://github.com/C3H3-AI/hacs-vision/releases)
2. Copy the `custom_components/hacs_vision` directory to your Home Assistant `custom_components/` directory
3. Restart Home Assistant

---

## Configuration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **HACS Vision**
3. Click **Submit** (no configuration required)
4. The panel will appear in your sidebar

### Options

Once installed, you can configure via **Settings → Devices & Services → HACS Vision → Configure**:

| Setting | Default | Description |
|---------|---------|-------------|
| Refresh Interval | 3600s | How often to check for updates |
| Default View | Browse | The default tab when opening the panel |
| Notify Updates | Enabled | Show notification when updates are available |
| Notify Restart | Enabled | Show notification when restart is needed after update |

---

## Usage

### Store
Browse all available HACS repositories. Use the search bar to filter, or click category chips to narrow down. Click the heart icon to add repositories to your favorites.

### Updates
View all repositories with available updates. Use the **Update All** button to apply all updates at once, or update individually.

### Management
Manage your installed repositories. View version history, reinstall, or remove repositories.

### Settings
Configure panel behavior, check for updates, restart Home Assistant, or add new HA integrations directly from the panel.

---

## Changelog

### v2.0.0 (2026-06-09)
- Complete UI redesign with modern card layout
- Built-in config flow dialog — configure HA integrations directly from panel
- Add HA Integration entry in Settings page
- Integration search & picker (900+ built-in integrations)
- Language auto-detection following HA system language
- Brand icon for integration listing
- Bug fixes:
  - Fixed FileNotFoundError when favorites file doesn't exist
  - Fixed RepositoryReleases iteration error
  - Fixed settings page showing blank on first load
  - Fixed dialog positioning and theme consistency

### v1.1.2 (2026-06-07)
- HTTP proxy mode for config flow API
- Fixed config entry_id merge in installed list
- Fixed settings button logic for integrations

### v1.1.1
- Added favorites system
- Added install tracking
- Performance improvements

### v1.1.0
- Initial public release
- Store browsing
- Updates management
- HACS integration

---

## FAQ

**Q: What's the difference between HACS and HACS Vision?**
A: HACS Vision is a visual frontend panel for HACS. It doesn't replace HACS — it provides a more modern, integrated browsing and management experience while using HACS as the backend.

**Q: Can I install repositories from HACS Vision?**
A: Yes, browse the store, click install, and HACS Vision will handle the installation through HACS.

**Q: The panel shows "HACS not available"?**
A: Make sure HACS is properly installed and configured. HACS Vision requires HACS to function.

**Q: How do I update HACS Vision?**
A: If installed via HACS, updates will appear in the HACS dashboard. If installed manually, download the latest release and replace the files.

**Q: Can I configure non-HACS integrations from the panel?**
A: Yes! The panel includes a built-in config flow dialog. Go to Settings → Add HA Integration to search and configure any of the 900+ built-in Home Assistant integrations.

---

## Support

- [Open an issue](https://github.com/C3H3-AI/hacs-vision/issues)
- [Discussion](https://github.com/C3H3-AI/hacs-vision/discussions)

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>