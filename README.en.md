# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Downloads](https://img.shields.io/github/downloads/C3H3-AI/hacs-vision/total)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Stars](https://img.shields.io/github/stars/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/stargazers)
[![License](https://img.shields.io/github/license/C3H3-AI/hacs-vision)](LICENSE)

[![English](https://img.shields.io/badge/lang-en-red.svg)](#)
[![中文](https://img.shields.io/badge/lang-zh--CN-blue.svg)](README.md)
[![Deutsch](https://img.shields.io/badge/lang-de-green.svg)](README.de.md)

> **Current version**: v6.5.1 | **Minimum HA**: 2024.1.0

> **⚠️ Prerequisite**: [HACS](https://hacs.xyz) must be installed and configured.

---

## Introduction

**HACS Vision** is a modern visual panel for HACS with a built-in storefront. Browse, install, update, and manage Home Assistant integrations, plugins, and themes like an app store. Configure any HA integration (config flow / options flow) directly in-panel, with automatic Chinese localization support.

---

## Features

- **🛒 Store Browsing** — Search, category filter, multi-dimensional sorting, favorites. Card/list dual views, **merged filter+sort row** for better space utilization. Filter by **favorites**
- **⭐ Repository Star** — Local favorites and GitHub Stars managed independently. One-click Star/Unstar
- **🔑 GitHub Login** — Input Token in settings, standalone storage, auto-login recovery
- **📦 Batch Add Repos** — Input GitHub org/user URL to list all repos for batch multi-select add
- **🔄 Update Management** — View all pending updates with progress tracking, batch or single update. **Ignore** repos you don't want to see
- **📦 Repo Management** — Manage installed repos, version history, **redownload** (fix broken installs), or remove. **Status/type/repo** triple filter + sort
- **⚙️ Integration Config** — Configure any installed HA integration's Options Flow directly in-panel (e.g. xiaomi_home, xiaomi_miot, haier, etc.), with automatic Chinese localization
- **🔌 Add Integration** — Start HA integration Config Flow directly from the panel
- **📊 Stats** — Real-time installed/updateable/favorite counts
- **🔔 Notifications** — Auto-notify on available updates with optimized caching
- **📱 Responsive** — Desktop and mobile optimized, 44px touch targets
- **🧩 Integration Management View** — Card grid of all installed integrations with Chinese search, status filter, category grouping
- **🔍 Device & Entity Drill-down** — Click integration card → device list grouped by area → entity real-time state & attributes
- **🎮 One-Click Entity Control** — Toggle switches, lights, locks, covers, fans directly from panel
- **🏷️ Chinese Name Translation** — Auto-display Chinese names for official & custom integrations (from brands or manifest)
- **🎨 Brand Icons** — CDN → local custom icon → first-letter fallback, three-level loading
- **🔗 EntityRefFinder** — Find all references to an entity_id across HA (automations, scripts, scenes, dashboards), with one-click replace
- **🔄 Redownload** — One-click redownload for installed repos (uninstall + reinstall), useful for fixing broken installations
- **⛔ Ignore Repo** — Add repos to ignore list, hide from search results and update notifications
- **🖼️ Config Page Embed** — Click integration card to open HA native config page in iframe modal, double-click to fullscreen, close to return
- **🧩 Config Flow Form** — Dropdown select rendered as radio buttons with next-step button, more intuitive configuration
- **🤖 Auto Update** — Scheduled background updates with whitelist management, configurable intervals (1h/3h/6h/12h/24h), update notifications, per-repo toggle

---

## Screenshots

| Store | Detail | Config Flow |
|:-----:|:------:|:-----------:|
| ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/store.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/detail.png) | ![config-flow](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/config-flow.png) |
| **Management** | **Updates** | **Settings** |
| ![management](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/management.png) | ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/updates.png) | ![settings](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/settings.png) |
| **Integrations** | **Integration Config** | |
| ![integrations](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integrations.png) | ![integration-config](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integration-config.png) | |

---

## Installation

### Via HACS Custom Repository (Recommended)

> ⚠️ **HACS Vision is NOT in the default HACS store** and cannot be installed by searching the store. Add this repo via "Custom repositories" using the URL below.

1. Ensure [HACS](https://hacs.xyz) is installed
2. Go to **HACS → Integrations → Custom repositories** (top-right menu)
3. Add repository URL: `https://github.com/C3H3-AI/hacs-vision`
4. Category: **Integration**
5. Click **Install**
6. **Restart Home Assistant**

### Manual Installation

1. Download the latest [Release](https://github.com/C3H3-AI/hacs-vision/releases)
2. Copy `custom_components/hacs_vision` to HA's `custom_components/` directory
3. Restart Home Assistant

---

## Configuration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **HACS Vision**
3. Click **Submit** (no extra config needed)
4. The panel will appear in the sidebar

---

## Usage

### 🛒 Store

Browse all available HACS repositories. Filter with search bar and merged filter chips (status/tags/type/sort in one row). Click heart to favorite. Redownload and ignore operations available. Toggle between card and list views.

### 🔄 Updates

View all repositories with pending updates. Use **Update All** to upgrade everything, or **Update Selected** for specific repos. Batch removal supported.

### 📦 Management

Manage installed repos with **status** (installed/up/updatable/not installed), **type** (integration/plugin/theme), and **repo** (all/archived/renamed/ignored) triple filters + sort. Batch operations supported. Archived and renamed repos shown as cards with action buttons at bottom.

### 🧩 Integration Management

Browse all installed HA integrations in a card grid, with Chinese name search, status filter, and batch operations. **Click a card** to open the HA native config page (iframe-embedded, sidebar cropped via CSS), double-click for fullscreen. The **⚙ Configure** button opens the Options Flow dialog with auto-loaded Chinese translations.

---

## Changelog

### v6.5.1 (2026-07-16) — Local persistence of translation results
- **Optimized**: **Translation results cached locally** — Translated README is stored in the browser `localStorage` (kept 7 days by default, 1 MB per entry, 50-entry LRU eviction). After closing the window, refreshing, or restarting HA, a cached translation shows **instantly without calling the LLM** — zero latency, zero token cost.
- **Bonus**: Repositories translated before can still be viewed even without a translation AI configured in settings (cache hit needs no backend request, also sidestepping the third-party repo GitHub Token 404 issue).

### v6.5 (2026-07-16) — README AI Translation (Stable) & UX Optimization
- **New**: **README AI Translation** — Language switcher (Original / Chinese / English / German, optional Japanese / Korean) in the repo dialog; uses your HA ("Settings → Voice Assistants") configured conversation assistant (e.g. MiMo / GPT / Ollama), no extra API key needed
- **New**: **Configurable Translation Engine** — New "README Translation AI" dropdown in Basic Settings, auto-lists all `conversation.*` entities
- **New**: **Translation Cache** — Results cached server-side for 6 hours
- **Optimization**: **Hide Translation Buttons When No AI Configured** — If no translation AI is set, the language bar is replaced with a hint
- **Stability**: **Based on Stable 6.4.4 Core** — Removed the broken timeout parameter, returning to a stable translation path

### v6.4.3 (2026-07-16) — Service Completion & Portability

- **Improvement**: **auto_update Service Definitions Completed** — Added `auto_update_start` / `auto_update_stop` / `auto_update_trigger` / `auto_update_reload_settings` service definitions; names and descriptions now appear in Developer Tools
- **Improvement**: **Screenshot URL Generation Optimized** — The screenshot URL fallback now derives its base address dynamically from HA's external/internal URL configuration, improving cross-environment portability
- **Improvement**: **Reduced HACS Internal Coupling** — Some internal calls changed from `self._hacs.hass` to `self.hass`, reducing reliance on private APIs
- **Cleanup**: **Removed Unused Gitee Module** — Deleted the never-referenced `api_mixins/gitee.py` to slim down the codebase
- **Cleanup**: **Removed Redundant Translation** — Removed the `options` section from `zh-Hans.json` that had no corresponding OptionsFlow

### v6.4.2 (2026-07-10) — Brand Icon Update

- **UI**: **Brand Icon Updated** — Adopted the official HACS store icon (awning + storefront + door + HACS wordmark), with a small "VISION" label added at the bottom to distinguish the project
- **Chore**: Synced `manifest.json` / `const.py` / trilingual README version numbers to 6.4.2

### v6.4.1 (2026-07-06) — Compatibility Fixes & Security Hardening

- **Fix**: **Custom Repository Detection Fixed** — Switched to `is_default()` to detect custom repositories, compatible with HACS 2.0 removing the `custom_repositories` field
- **Fix**: **Integration Management View Not Showing** — Force-refresh the config entry cache (`force_refresh=True`) so newly added integrations appear immediately
- **Fix**: **Syncing Selected Repos Returned 500** — Now compatible with both string and object data formats, unified handling on frontend and backend
- **Fix**: **Repos Not Found After Sync** — Simplified `_ensure_custom_repos_registered`, relying on HACS's own registration mechanism
- **Chore**: **API Security Hardening** — Whitelist filtering for config and settings, parameter validation, language parameter path-traversal protection
- **Chore**: **OAuth No Longer Returns Token** — Eliminated token leakage risk

### v6.4.0 (2026-07-06) — Unified Search & Add

- **New**: **Unified Search & Add** — The search box in the store and repository management views now supports adding repositories directly: enter `owner/repo` or a GitHub URL to show an inline add bar; enter an org name to auto-load its repos for batch selection. Removed the standalone "+ Add Repo" button and form
- **New**: **Enhanced Search** — All views now uniformly support GitHub URL parsing, author search, and org name search
- **New**: **Clickable Repo Name in Detail Dialog** — The repo name in the detail dialog is now a clickable link that jumps to the GitHub repo page
- **Fix**: **Custom Repo Registration Failed** — `add_custom_repository` now uses `check=False` to avoid registration failures caused by GitHub API rate limits

### v6.3.0 (2026-07-05) — Three-Section Updates Panel

- **New**: **Three-Section Collapsible Updates Page** — Updatable (expanded by default), Updated (collapsed, 30-day history), Skipped (collapsed), clearly categorized
- **New**: **Update History Tracking** — Each update is auto-recorded (repo name, version change, time), auto-cleaned after 30 days, queryable via API
- **New**: **Real-Time Update Progress** — Update cards show a progress bar + percentage (5%→75%→100%), refreshed via polling
- **Chore**: Version bump to v6.3.0

### v6.2.1 (2026-07-aucoma) — Optimization & Fixes

- **New**: **Scheduled Restart** — A time picker in the settings panel restarts HA at a specified time after auto-update installation completes; empty = no restart
- **New**: **Whitelist Dialog Pagination** — Whitelist in settings changed to button + modal dialog with paginated search, chips, select/deselect all, save/cancel
- **New**: **HACS Data Refresh** — Refreshes HACS repository data before auto-update to ensure latest versions, no more missed updates
- **Fix**: **Merged Settings Save** — Backend `_update_settings` changed to `{**existing, **body}` merge, avoiding partial updates overwriting other settings
- **Fix**: **Frontend Loading Guard** — Added `_installedLoaded` flag to prevent infinite loading state

### v6.2.0 (2026-07-04) — Auto Update

- **New**: **Auto Update Engine** — Background scheduled detection and automatic installation of whitelisted repo updates. Non-overlapping runs, coalescing to prevent races. First run 60s after settings load, then periodic by configured interval. Dual-channel event dispatch (`async_dispatcher_send` + `async_fire`) for real-time status in settings
- **New**: **Whitelist Management** — Modal dialog with pagination (15/page), search, chip display, select/deselect all, save/cancel
- **New**: **Per-Repo Auto Update Toggle** — Slider toggle on each repo card in browse and updates pages, optimistic update + API-failure rollback
- **New**: **Configurable Check Frequency** — 1h / 3h / 6h / 12h / 24h intervals
- **New**: **Update Notifications** — HA persistent notification on completed auto-update (toggleable), fixed notification ID to prevent stacking
- **New**: **4 Backend Services** — `trigger_auto_update` (manual), `reload_auto_update_settings` (reload), `start_auto_update`/`stop_auto_update` (start/stop scheduler)
- **Chore**: Version bump to v6.2.0

### v6.0.0b1 (2026-07-01) — Architecture Split Beta

- **New**: **api.py Split** — The 3,717-line api.py split into `api.py` + `api_config_flow.py` + `api_repos.py` via mixin composition
- **Fix**: **Language Switch Applies Everywhere** — Fixed filter chips/column headers not refreshing after language switch; option arrays now rebuilt on language change
- **Fix**: **3 Translation Keys Added + 1 Typo Fixed** — `loadingUpdates`/`processing`/`inputRepoPlaceholder` added, `verifing`→`verifying`
- **Fix**: **6 Hardcoded Chinese Replaced** — Hardcoded Chinese in repo-card/browse/management/integrations-list changed to `t()` calls
- **Fix**: **Instant Refresh on Language Switch During Navigation** — Child views listen to `hacs-lang-changed` event, ensuring text stays in selected language after tab switch
- **Docs**: **Trilingual README** — German version added to all sections
- **Chore**: Version bump to v6.0.0b1

### v6.0.0b0 (2026-06-30) — Multilingual Beta

- **New**: **Multilingual Engine** — i18n engine refactored; language detection upgraded from hardcoded binary to extensible `LANG_MAP`
- **New**: **German Translation** — Community-contributed, 200+ frontend keys fully translated + backend `de.json`
- **New**: **Settings Language Selector** — Manually select language in settings, overriding HA system language detection
- **New**: **Third-Party Language Extension** — New language in 2 steps: add `LANG_MAP` entry + translation keys. No detection logic changes
- **Chore**: Version bump to v6.0.0b0

### v5.2.0 (2026-06-30) — Skip Version + Full Optimization

- **New**: **One-Click GitHub Issue** — Submit issues from cards and detail modals, auto-collecting logs, system info, screenshots; GitHub screenshot paste supported
- **New**: **Version-Level Skip** — Skip specific versions; next new version re-notifies. Synced with native HA `update.skip`/`update.clear_skipped`, Vision panel + HA Settings → Updates fully consistent
- **New**: **Skipped Updates Panel** — Updates filter bar shows `🔇 Show/Hide Skipped Updates (N)`, expand/collapse skipped version cards, supports "unskip"
- **New**: **Updates Data Source Switched to HA Entities** — Reads `update.*` entities directly from HA state machine instead of HACS internal API. Faster, more accurate; HACS as fallback
- **New**: **Batch Skip** — "Batch Skip" button added to action bar after selecting multiple repos
- **Optimize**: **Store/Repo Management Sync Skip** — All list endpoints cross-check HA entity skip state; skipped repos no longer show update button
- **Optimize**: **HA Restart Reliability** — Fixed Supervisor job hang causing restart failure; uses `docker restart homeassistant` to bypass stuck jobs
- **Optimize**: **Issue Dialog Cleanup** — Removed dead `_showIssueDialog` Lit template code, unified to `_handleIssueReport`, editable log preview
- **Fix**: **Skip Version 500 Error** — `release_url` could be `None` causing `None.startswith()` exception
- **Fix**: **Update Count Unchanged After Skip** — Excludes `pending_restart` repos
- **Fix**: **Skipped Card Render Crash** — `<img>` + `@error` broke Lit rendering; changed to plain-text initial avatar
- **Chore**: Version bump to v5.2.0

### v5.1.0 (2026-06-21) — Optimization

- **New**: **Integration Cards Show Device/Entity Counts** — Each integration card and list row shows device and entity counts
- **New**: **GitHub Login Auto-Star** — Auto-stars this repo after Token/OAuth/HACS import
- **New**: **Sidebar + Title Icon Unified** — All use `hacs:hacs` icon, removed blue background
- **Fix**: **Removed 130+ Redundant Fallbacks** — Removed all `|| '中文'` invalid fallbacks, trusting i18n layer
- **Fix**: **Added 5 Missing i18n Keys** — githubTokenRequired, pendingRestart, selectAction, zoom, restarting
- **Fix**: **Emoji Unified to SVG Icons** — GitHub/OAuth area emoji replaced in settings
- **Fix**: **Hardcoded Colors Changed to CSS Variables** — `#f44336` → `var(--error-color)` etc.
- **Fix**: **Default View Change Hint** — Toast prompt on success after selection
- **Fix**: **Integration Icon Avatar Refactored** — Lifecycle + RAF + complete fallback, unified icons for dialog and cards
- **Fix**: **28 Inline Styles → CSS Utility Classes** — config-view GitHub area
- **Chore**: Version bump to v5.1.0

### v5.0.1 (2026-06-21) — Patch

- **New**: **OAuth Incognito Login** — Authorize directly via GitHub OAuth device flow, no manual token entry
- **New**: **OAuth Bypasses SSRF** — Uses independent aiohttp session, not intercepted by HA SSRF middleware
- **New**: **Org/User Repos Open Access** — Enter org name to list repos without login, direct GitHub public API access
- **New**: **Instant Settings Save** — Auto-save and prompt after changing refresh interval / default view, removed save button
- **New**: **Pending Restart Card Quick Button** — Restart button directly below repo cards in `pending_restart` state in management view
- **Fix**: **Cleaned up dead `save-bar` CSS**
- **Chore**: Version bump to v5.0.1

### v5.0.0 (2026-06-20) — Official Release

- **Arch**: Architecture refactored — migrated from Lovelace iframe to panel_custom embed_iframe=False
- **New**: Config system refactored (M1-M6) — store button smart logic, integration management dialog, backend dynamic field refresh
- **New**: Mobile full-interface adaptation — four views unified mobile layout, operation buttons in collapsible areas
- **New**: Sidebar button hugs left — 48px standard touch target on mobile, flush with screen edge
- **New**: Card/list single-button toggle — two buttons merged, click to toggle to save space
- **New**: Smart search box — default icon, expands to full row on focus
- **Fix**: Favorite count sync — header number updates immediately after favoriting
- **Fix**: Version channel isolation — pre-release and stable independent update channels
- **Fix**: Unified icon button style — 36x36px unified border radius
- **Fix**: Pagination Bug — GitHub org repos infinite pagination fixed
- **Fix**: Key competition — e.preventDefault timing fixed
- **Fix**: scoped CE registry compatibility — HA 2025.7+ adaptation
- **Fix**: Changelog display — changelog API tag parameter fixed
- **Fix**: Preview version downgrade protection
- **Fix**: Dialog system refactored — supports maximize/double-click fullscreen/URL click
-other: Dialog system refactored — supports maximize/double-click fullscreen/URL click
- **Perf**: HA API session reuse, N+1 query fixed, backend cache cap
- **Chore**: Version bump to v5.0.0

### v4.1.0 (2026-06-17) — Official Release

- **New**: **Integration Config Page Embedded** — Click integration card in management view, iframe loads HA native config page in dialog, CSS crops sidebar
- **New**: **Double-Click Fullscreen** — Double-click inside iframe dialog → fullscreen config content within frame, double-click again to restore
- **New**: **Chinese Title** — Dialog title uses translated Chinese integration name
- **New**: **Version Selector Shows Update Content** — Click a version in the version list, the update content area below loads that version's release notes
- **Fix**: **Version Selector Only Showed Latest** — Now any version clickable to load corresponding update content
- **Fix**: **HA Theme Sync** — Light DOM test fallback, CSS variable scheme continues
- **Chore**: Version bump to v4.1.0
- **Refactor**: Removed test buttons and WS config flow form prototype code
- **Perf**: Original detail tree view conditional rendering, zero performance overhead

### v4.0.2 (2026-06-17) — Patch

- **Refactor**: **Star Sync Moved from Frontend to Backend** — Added `/github/sync-favorites` API, one-stop Token validation + GitHub Star fetch + favorite comparison + missing append, only syncs HACS-known repos, ensuring favorite count and filter consistency
- **Fix**: **Favorite Star Status Type Mismatch** — String vs Number caused all star icons grey
- **Fix**: **Star Status Dirty Cache** — `_starredMap` old value not refreshed
- **Fix**: **Render Exception Black Screen** — Error boundary fallback
- **Fix**: **"Restarting" Banner Not Disappearing After HA Restart** — Reset on `_loadStats` success + 5s poll retry
- **Fix**: **GitHub Star Sync Never Worked** — `hasGitHubToken()` didn't exist, silently swallowed

### v4.0.1 (2026-06-17) — Patch

- **Fix**: Favorite filter client-side pagination caused incomplete display (showed 26, filter only 4)
- **Chore**: Version bump to v4.0.1

### v4.0.0 (2026-06-17) — Official Release

- **New**: **Org/User Repo Batch Add** — Enter GitHub org or user URL, list repos for batch multi-select add
- **New**: **GitHub HACS Token Import** — Settings supports importing existing HACS Token, auto login recovery
- **New**: **GitHub Avatar Display** — Logged-in user shows avatar
- **New**: **Repo Star System** — Local favorites and GitHub Stars managed independently
- **New**: **Updates Page Instant Open** — Cache acceleration + manual refresh + per-card delayed loading
- **New**: **Batch Star Loading** — Parallel requests, fewer API calls
- **New**: **Three-Column Grid Layout** — Makes full use of widescreen space
- **New**: **i18n Full Coverage** — 30+ internationalization text keys
- **New**: **Responsive Adaptation** — Mobile/tablet/desktop adaptive
- **UI**: **Color System Optimized** — Dark mode compatible, filter tag UI unified
- **UI**: **CSS Mask Token Input** — Replaces type=password, safer and prettier
- **Chore**: Version bump to v4.0.0
- **Fix**: Favorite filter client-side pagination caused incomplete display (showed 26, filter only 4)

### v3.0.0 (2026-06-13) — Official Release

- **New**: **Integration Entity/Device Overview** — Integration detail dialog top shows "N devices · M entities" summary
- **New**: **Repo Dependency Check** — Repository management view adds "Check Dependencies" button, visually shows missing dependency packages
- **New**: **Search History** — Store search box auto-records last 10 searches, supports click-to-fill and per-item delete
- **New**: **Remember Last Tab** — Page refresh auto-restores last opened Tab (Store/Integration Mgmt/Updates/Repo Mgmt/Settings)
- **New**: **Repo Management Filter Persistence** — Filter/sort state preserved after refresh
- **New**: **Dialog Fully Upgraded** — All dialogs support drag-move, Escape close, slideUp animation, unified close button
- **New**: **Plugin/Theme Silent Reload** — Auto-reload config after install, no confirm dialog
- **New**: **Integration Install Smart Prompt** — After install, dialog prompts [Restart] [Later], must restart to configure
- **UI**: **Four-View Layout Fully Unified**
- **UI**: **Config Page Three-Column Layout** — PC: settings/maintenance/data management three columns; mobile single column
- **UI**: **Brand Icon Three-Level Loading** — CDN → GitHub raw (brand dir) → local → org avatar → initial
- **UI**: **Filter Tag Blue Highlight** — Filter area tags use primary-color, increased separator spacing
- **UI**: **Card/List View** — Integration management adds card/list toggle, list mode shows domain field
- **UI**: **Device View Device Collapse** — Each device header collapsible/expandable entity list
- **UI**: **Font Size Overall Upgrade** — Removed all 8-9px fonts, minimum unified to 10px
- **UI**: **Chinese/English Translation Fully Completed** — Added 25+ translation keys, fixed all missing translations
- **Fix**: Constructor `this._loadSearchHistory()` undefined caused empty store
- **Fix**: `makeDraggable` tree-shaken by Rollup caused dialog drag failure
- **Fix**: Child dialog CSS selector wrong caused mobile layout error
- **Fix**: Integration management host padding caused inconsistent label-to-search spacing
- **Chore**: Version bump to v3.0.0

### v2.3.3 (2026-06-13)

- **New**: **Redownload** — One-click redownload for installed repos (uninstall + reinstall), fixes broken installs. Supports `POST` API
- **New**: **Ignore Repo** — Add repos to ignore list, no longer appear in search results and update reminders. Supports `POST` API
- **New**: **Prompt Info** → **Prompt Info Fully Optimized** — All confirm dialogs add operation consequence descriptions (uninstall, delete, remove, ignore, etc.), letting users clearly know each operation's impact
- **New**: **UI Fully Refactored** — Store/Repo Mgmt/Integration Mgmt/Updates four-view layout unified
- **New**: **Filter+Sort Merged** — All views' filter and sort merged into one row, removed redundant label text
- **New**: **Filter Annotation** — Blue highlight label before each filter chip group (status/tag/type/sort/repo)
- **New**: **Repo Mgmt Status+Type Filter** — Added filter by install status and category
- **New**: **Repo Mgmt Batch Operations** — Select-all checkbox + batch remove, consistent with store
- **New**: **Statistics** — Repo management shows "N repos total"
- **New**: **Refresh Button** — Repo management adds refresh button
- **New**: ▲/▼ **Sort Direction Indicator** — All sort chips add direction arrows
- **New**: **Empty State Icons** — All four repo management empty states get SVG icons
- **New**: **Reload** — Config page adds reload button (calls `homeassistant.reload_core_config`), plugins/themes don't need restart after install
- **New**: **Backup/Restore** — Config page adds export/import HACS config backup
- **New**: 🟠 **Pending Load Marker** — After installing plugin/theme choose "Later" → card shows 🟠 pending-load tag, auto-cleared after reload
- **New**: **Install/Update Smart Prompt** — Integration→suggest restart, plugin/theme→suggest reload, popup after 1.5s
- **New**: **Brand Icon Three-Level Loading** — CDN → GitHub raw (brand dir) → local → org avatar → initial
- **New**: **Integration Mgmt List View** — Added card/list toggle, list mode shows domain field
- **New**: **Chinese/English Translation Fully Completed** — Added 20+ translation keys, fixed missing translations like `catPython`/`flowStartFailed`/`statusDisabled`/`delete`
- **UI**: **All Button Height Unified to 36px**
- **UI**: **Search Box Unified** — Store/Mgmt/Updates/Integration Mgmt search boxes all use shared style (40px height, flex auto-width)
- **UI**: **Spacing Unified** — Fixed integration mgmt `:host padding` causing inconsistent label-to-search spacing
- **UI**: **Background Unified** — Store content area wrapped in card-background-color, eliminating "fault line" feel
- **UI**: **Avatar Background Removed** — Icons no longer covered by category color background, only initials show background
- **UI**: **Config Page Three-Column Layout** — PC three columns, mobile single column
- **Fix**: **README and Ignore button removed from store cards**, only shown in repo management
- **Fix**: **Removed batch select from updates page* (no practical meaning)
- **Fix**: **Removed duplicate "Custom" badge** in management mode (all are custom)
- **Fix**: `_handleIgnore` misused "confirm uninstall" as ignore confirmation text → changed to correct `confirmIgnore` translation
- **Fix**: **Update confirmation text chaos** — All-update and update-selected use different confirmation templates
- **Fix**: **Integration delete confirmation missing integration name** → added `{domain}` template param
- **Fix**: `multi_select` field rendered as checkbox not multi-select dropdown (e.g. xiaomi_home config)
- **Fix**: `is_custom` field frontend/backend inconsistency caused custom repo filter unavailable
- **Fix**: Tag filter moved to backend API, pagination normal
- **Fix**: `entity_ref_finder` three-level fallback: `state.attributes` → `hass.data` → `.storage` file, compatible with HA 2025.7+
- **Fix**: Renamed label overlap with right-side tags (merged into `right-tags` container)
- **Fix**: Repo card remove button moved from top-right to bottom action bar
- **Fix**: Hidden duplicate "Integration Management" page title in management mode
- **Fix**: Skeleton screen unified to 6 cards
- **Fix**: number field `valueMin/valueMax` fallback support
- **Fix**: boolean compatible with `true`/`1`/`"1"`
- **Fix**: All `_LOGGER.error` added `exc_info=True`
- **Chore**: Terminology aligned with HACS official translation, `remove` changed from "uninstall" to "remove"
- **Chore**: Added `delete` series keys, integration management operations use "delete"
- **Chore**: Integration management removed duplicate "Integration Management" page title
- **Chore**: Synced version number v2.3.3

### v2.3.2 (2026-06-12)

- **Fix**: Custom repo filter invalid — backend returned field `"custom"` inconsistent with frontend reading `is_custom`, now aligned (dual-field compatible)
- **Chore**: Synced version number v2.3.2

### v2.3.1 (2026-06-12)

- **Fix**: Restored missing `entity_ref_finder.py` from v2.3.0 release, fixed integration load `ModuleNotFoundError`
- **Chore**: Synced version number v2.3.1, updated README

### v2.3.0 (2026-06-12)

- **New**: **Integration Management View** — Card grid showing all installed integrations, Chinese search, status filter, integration type grouping
- **New**: **Device & Entity Drill-down** — Click integration card → device list grouped by area → entity real-time status
- **New**: **One-Click Entity Control** — Switches, lights, locks, covers, fans and other common domains controlled directly in panel
- **New**: **Chinese Name Translation** — Official & custom integrations auto-display Chinese names (from brands or manifest)
- **New**: **Brand Icons** — Three-level loading: CDN → local custom icon (`custom_components/{domain}/brand/`) → initial fallback
- **New**: **EntityRefFinder** — `EntityRefFinder` class scans all references to a specified entity_id in HA (automations/scripts/scenes/panels), supports preview replace mode and one-click replace
- **Enhance**: HACSBrandIconView supports `/icon`, `/logo` subpath parsing, fixed path extraction when domain has `_`
- **Enhance**: `get_all_repos_from_hacs()` return field adds `default_branch`
- **Fix**: `api.py` brand icon static resource path optimized, uses `actual_domain` instead of raw `safe_domain`
- **Chore**: Updated `const.py` version → 2.3.0, synced `manifest.json`

### v2.1.2 (2026-06-11)

- **New**: Integration config dialog auto-loads Chinese localization — reads `custom_components/{domain}/translations/zh-Hans.json` via backend API, supports all translation points in config flow and options flow (field labels, descriptions, placeholders, menu options, step titles)
- **Fix**: `_handleDetail` infinite recursion caused `Maximum call stack size exceeded` crash
- **Fix**: Browse view event forwarding optimized, eliminated redundant event listeners
- **Chore**: Cleaned up frontend debug logs

### v2.1.1 (2026-06-10)

- **Fix**: Config Flow dialog Chinese localization channel fixed — backend `get_config_entries_map()` returned array not object
- **Fix**: `_loadConfigEntries()` correctly unpacks `resp.entries`
- **Fix**: `updated()` lifecycle `this.domain` incorrectly cleared

### v2.1.0 (2026-06-10)

- **New**: Settings page dynamically shows version number (from API)
- **New**: Config Flow form enhanced — supports password mask, multiline text box, field description text
- **New**: Browser cache auto-clear mechanism
- **UI**: Update details support expand/collapse changelog preview, mobile touch optimization

### v2.0.2 (2026-06-09)

- Fix: Self-update detection and HACS in-memory registration

### v2.0.1 (2026-06-09)

- Fix: config flow dialog `.hass` property passing
- Fix: HA 2026.6.0 upgrade caused `.pyc` cache leading to API 404

### v2.0.0 (2026-06-09)

- Complete UI redesign, modern card layout
- Built-in config flow dialog
- Language auto-follows HA system settings

### v1.1.2 (2026-06-07)

- HTTP proxy mode config flow

### v1.1.1

- Favorites system
- Install tracking

### v1.1.0

- Initial public release

---

## Project Structure

```
hacs-vision/
├── custom_components/hacs_vision/    # HA 集成（生产代码）
│   ├── __init__.py                    # 入口 — 注册面板、API 路由
│   ├── api.py                         # REST API — 商店、安装、配置流、翻译
│   ├── hacs_operator.py               # HACS 操作层 — 安装/更新/移除
│   ├── hacs_data.py                   # 数据层 — 仓库索引、收藏、设置
│   ├── config_flow.py                 # HA 配置流
│   ├── backup.py                      # 备份/恢复
│   ├── dependency_checker.py          # 依赖检查
│   ├── entity_ref_finder.py           # Entity ID 引用查找替换
│   ├── const.py                       # 常量（VERSION、存储路径等）
│   ├── frontend/                      # 前端构建产物
│   │   ├── panel.js                   # IIFE 打包的单文件
│   │   └── index.html                 # iframe 入口
│   ├── translations/                  # 本集成自身的中文翻译
│   │   ├── zh-Hans.json
│   │   └── en.json
│   └── brand/                         # 品牌资源
├── frontend_src/                      # 前端源码（Lit Element）
│   ├── src/                           # 组件源码
│   │   ├── hacs-vision-panel.js       # 主面板
│   │   ├── api.js                     # 前端 API 客户端
│   │   ├── i18n.js                    # 前端国际化
│   │   ├── components/                # 子组件
│   │   │   ├── config-flow-dialog.js  # 配置流弹窗（含翻译引擎）
│   │   │   └── repo-card.js           # 仓库卡片
│   │   ├── views/                     # 各页面视图
│   │   │   ├── browse.js
│   │   │   ├── updates.js
│   │   │   ├── management.js
│   │   │   ├── integrations-list.js   # 集成管理视图（v2.3.0）
│   │   │   └── config-view.js
│   │   └── shared/                    # 共享工具
│   ├── package.json
│   └── rollup.config.js
├── assets/                            # 截图等资源
├── hacs.json                          # HACS 元信息
└── README.md
```

---

## Development

### Frontend Build

```bash
cd frontend_src
npm install
npm run build
```

Build output goes to `custom_components/hacs_vision/frontend/`.

### Translation Mechanism

Translation in config dialog is powered by the backend API `/api/hacs_vision/translations/{domain}?lang=zh-Hans`, reading translation files from each integration's `custom_components/{domain}/translations/` directory. The frontend `_t()` method auto-adapts to HA's dual config/options key structure.

---

## FAQ

**Q: What's the difference between HACS and HACS Vision?**
A: HACS Vision is a visual frontend panel for HACS, powered by HACS as backend.

**Q: Can I install repositories from HACS Vision?**
A: Yes, browse the store and click install.

**Q: Why are config dialog fields still in English?**
A: Translation depends on whether the integration author provided `zh-Hans.json`. Some authors write English in their translation files (e.g. "Client Id") — this is expected behavior.

**Q: The panel shows "HACS not available"?**
A: Make sure HACS is properly installed and configured.

**Q: How to update HACS Vision?**
A: Updates appear in the updates page if installed via HACS. For manual install, replace files from latest release.

---

## Support

- [File an Issue](https://github.com/C3H3-AI/hacs-vision/issues)
- [Discussions](https://github.com/C3H3-AI/hacs-vision/discussions)

## License

MIT License — see [LICENSE](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>
