# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)

> **当前版本**: v2.0.2 | **最低 HA 版本**: 2024.1.0 | **Current version**: v2.0.2 | **Minimum HA**: 2024.1.0

> **⚠️ 前置条件**: 必须先安装并配置好 [HACS](https://hacs.xyz)
> **⚠️ Prerequisite**: [HACS](https://hacs.xyz) must be already installed and configured.

---

**HACS Vision — HACS 的现代化可视化面板，内置商店界面，让你更直观地浏览、管理和配置 Home Assistant 集成、插件和主题。**

**A modern visual panel for HACS — browse, manage, and configure Home Assistant integrations, plugins, and themes in a built-in storefront interface.**

---

## 功能特性 / Features

- **🛒 商店浏览** — 搜索、分类筛选、收藏 HACS 仓库
- **🔄 更新管理** — 一览所有待更新仓库，支持单个或批量更新
- **📦 仓库管理** — 管理已下载的仓库、版本历史、重新安装
- **⚙️ 设置面板** — 配置刷新间隔、默认视图、通知开关
- **🔌 集成配置** — 直接在面板中配置 HA 内置集成（900+ 集成）
- **🔔 更新通知** — 有新更新时自动通知
- **📱 响应式设计** — 桌面端和移动端均优化

---

## 截图 / Screenshots

| Overview | Store | Management |
|:--------:|:-----:|:----------:|
| ![hero](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/hero.png) | ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_2_store_list.png) | ![manage](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_4_manage.png) |
| **Updates** | **Detail** | **Card View** |
| ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_3_updates.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_5_detail.png) | ![card](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_1_store_card.png) |

---

## 安装方法 / Installation

### 通过 HACS 安装（推荐）

1. 确保已安装 [HACS](https://hacs.xyz)
2. 进入 **HACS → 集成 → 右上角菜单 → 自定义仓库**
3. 添加仓库 URL：`https://github.com/C3H3-AI/hacs-vision`
4. 类别：**集成**
5. 点击 **安装**
6. **重启 Home Assistant**

### 手动安装

1. 下载最新 [Release](https://github.com/C3H3-AI/hacs-vision/releases)
2. 将 `custom_components/hacs_vision` 目录复制到 HA 的 `custom_components/` 目录
3. 重启 Home Assistant

---

## 配置说明 / Configuration

1. 进入 **设置 → 设备与服务 → 添加集成**
2. 搜索 **HACS Vision**
3. 点击 **提交**（无需额外配置）
4. 面板将出现在侧边栏

### 选项设置

安装后可在 **设置 → 设备与服务 → HACS Vision → 配置** 中调整：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| 刷新间隔 | 3600 秒 | 检查更新的频率 |
| 默认视图 | 商店 | 打开面板时默认显示的标签页 |
| 更新通知 | 开启 | 有可用更新时显示通知 |
| 重启通知 | 开启 | 更新后需要重启时显示通知 |

---

## 使用指南 / Usage

### 🛒 商店 / Store
浏览所有可用的 HACS 仓库。使用搜索栏筛选，或点击分类标签缩小范围。点击爱心图标收藏仓库。

*Browse all available HACS repositories. Use the search bar to filter, or click category chips to narrow down. Click the heart icon to add favorites.*

### 🔄 更新 / Updates
查看所有可更新的仓库。使用**全部更新**按钮一键更新，或逐个更新。

*View all repositories with available updates. Use **Update All** button to apply all updates at once.*

### 📦 仓库管理 / Management
管理已安装的仓库。查看版本历史、重新安装或移除。

*Manage your installed repositories. View version history, reinstall, or remove repositories.*

### ⚙️ 设置 / Settings
配置面板行为、检查更新、重启 HA，或从面板直接添加新的 HA 集成。

*Configure panel behavior, check for updates, restart HA, or add new HA integrations directly.*

---

## 更新日志 / Changelog

### v2.0.2 (2026-06-09)
- Fix: HACS Vision自身更新检测——点击刷新时从GitHub获取最新版本，无需通过HACS面板
- Fix: `refresh_repositories()` 现在在HACS内存中注册hacs-vision自身，重启后也能自动注册
- Improvement: 更新页面点击刷新先调用后端刷新接口，再拉取最新数据

### v2.0.1 (2026-06-09)
- Fix: config flow dialog 的 `.hass` 属性未传递导致 `Cannot read properties of undefined (reading 'callApi')`
- Fix: HA 2026.6.0 升级后 `.pyc` 缓存导致 API 404
- UI: 抬头图标改为 SVG 眼睛图标

### v2.0.0 (2026-06-09)
- 完整 UI 重设计，现代化卡片布局 / Complete UI redesign
- 内置配置流对话框 / Built-in config flow dialog
- 设置页"添加 HA 集成"入口 + 集成搜索选择器
- 语言自动跟随 HA 系统设置 / Language auto-detection
- 新增品牌图标 / Brand icon
- Bug 修复：favorites.json 报错、RepositoryReleases 迭代错误、设置页空白、弹窗定位问题

### v1.1.2 (2026-06-07)
- HTTP 代理模式配置流 / HTTP proxy mode for config flow API
- 修复 config entry_id 合并问题 / Fixed entry_id merge

### v1.1.1
- 收藏系统 / Favorites system
- 安装追踪 / Install tracking
- 性能优化 / Performance improvements

### v1.1.0
- 初始公开版本 / Initial public release

---

## 常见问题 / FAQ

**问：HACS 和 HACS Vision 有什么区别？**
答：HACS Vision 是 HACS 的可视化前端面板，不替代 HACS。它提供更现代化的浏览和管理体验，底层使用 HACS 作为后端。

**Q: What's the difference between HACS and HACS Vision?**
A: HACS Vision is a visual frontend panel for HACS. It doesn't replace HACS.

---

**问：可以从 HACS Vision 安装仓库吗？**
答：可以。在商店中浏览，点击安装即可。

**Q: Can I install repositories from HACS Vision?**
A: Yes, browse the store, click install.

---

**问：面板显示"HACS not available"？**
答：确保 HACS 已正确安装和配置。

**Q: The panel shows "HACS not available"?**
A: Make sure HACS is properly installed and configured.

---

**问：如何更新 HACS Vision？**
答：通过 HACS 安装的会在 HACS 面板中显示更新。手动安装的请下载最新 Release 替换文件。

**Q: How do I update HACS Vision?**
A: Updates appear in HACS dashboard. For manual install, replace files from the latest release.

---

**问：可以从面板配置 HA 集成吗？**
答：可以！进入设置 → 添加 HA 集成，搜索并配置任意 HA 内置集成。

**Q: Can I configure HA integrations from the panel?**
A: Yes! Go to Settings → Add HA Integration to configure any built-in integration.

---

## 支持 / Support

- [提交 Issue](https://github.com/C3H3-AI/hacs-vision/issues)
- [讨论区 / Discussions](https://github.com/C3H3-AI/hacs-vision/discussions)

## 许可证 / License

MIT License — 详见 [LICENSE](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>