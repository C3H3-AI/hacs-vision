# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)

> **当前版本**: v2.1.2 | **最低 HA 版本**: 2024.1.0
> **Current version**: v2.1.2 | **Minimum HA**: 2024.1.0

> **⚠️ 前置条件 / Prerequisite**: 必须先安装并配置好 [HACS](https://hacs.xyz) / [HACS](https://hacs.xyz) must be installed and configured.

---

## 简介 / Introduction

<!-- zh-CN -->
**HACS Vision** 是 HACS 的现代化可视化面板，内置商店界面。让你像逛应用商店一样直观地浏览、安装、更新和管理 Home Assistant 集成、插件和主题。支持直接在面板中配置任意 HA 集成（config flow / options flow），并自动显示中文本地化翻译。

<!-- en -->
**HACS Vision** is a modern visual panel for HACS with a built-in storefront. Browse, install, update, and manage Home Assistant integrations, plugins, and themes like an app store. Configure any HA integration (config flow / options flow) directly in-panel, with automatic Chinese localization support.

---

## 功能特性 / Features

<!-- zh-CN -->
- **🛒 商店浏览** — 搜索、分类筛选、多维度排序、收藏仓库。支持卡片/列表双视图
- **🔄 更新管理** — 一览所有待更新仓库，支持单个或批量更新，带进度追踪
- **📦 仓库管理** — 管理已安装仓库、查看版本历史、重新安装或移除
- **⚙️ 集成配置** — 直接在面板中配置任意 HA 已安装集成的 Options Flow（如 xiaomi_home、xiaomi_miot、haier 等），自动加载中文本地化翻译
- **🔌 添加集成** — 从面板直接发起 HA 集成的新建 Config Flow
- **📊 状态统计** — 实时展示已安装/可更新/收藏数量
- **🔔 通知系统** — 有新更新时自动通知，缓存策略优化
- **📱 响应式设计** — 桌面端和移动端均优化，触控目标 44px 规范

<!-- en -->
- **🛒 Store Browsing** — Search, category filter, multi-dimensional sorting, favorites. Card/list dual views
- **🔄 Update Management** — View all pending updates with progress tracking, batch or single update
- **📦 Repo Management** — Manage installed repos, version history, reinstall, remove
- **⚙️ Integration Config** — Configure any installed HA integration's Options Flow directly in-panel (e.g. xiaomi_home, xiaomi_miot, haier, etc.), with automatic Chinese localization
- **🔌 Add Integration** — Start HA integration Config Flow directly from the panel
- **📊 Stats** — Real-time installed/updateable/favorite counts
- **🔔 Notifications** — Auto-notify on available updates with optimized caching
- **📱 Responsive** — Desktop and mobile optimized, 44px touch targets

---

## 截图 / Screenshots

| Overview | Store | Management |
|:--------:|:-----:|:----------:|
| ![hero](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/hero.png) | ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_2_store_list.png) | ![manage](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_4_manage.png) |
| **Updates** | **Detail** | **Card View** |
| ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_3_updates.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_5_detail.png) | ![card](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/screenshot_1_store_card.png) |

---

## 安装方法 / Installation

### 通过 HACS 安装（推荐） / Via HACS (Recommended)

<!-- zh-CN -->
1. 确保已安装 [HACS](https://hacs.xyz)
2. 进入 **HACS → 集成 → 右上角菜单 → 自定义仓库**
3. 添加仓库 URL：`https://github.com/C3H3-AI/hacs-vision`
4. 类别：**集成**
5. 点击 **安装**
6. **重启 Home Assistant**

<!-- en -->
1. Ensure [HACS](https://hacs.xyz) is installed
2. Go to **HACS → Integrations → Custom repositories** (top-right menu)
3. Add repository URL: `https://github.com/C3H3-AI/hacs-vision`
4. Category: **Integration**
5. Click **Install**
6. **Restart Home Assistant**

### 手动安装 / Manual Installation

<!-- zh-CN -->
1. 下载最新 [Release](https://github.com/C3H3-AI/hacs-vision/releases)
2. 将 `custom_components/hacs_vision` 目录复制到 HA 的 `custom_components/` 目录
3. 重启 Home Assistant

<!-- en -->
1. Download the latest [Release](https://github.com/C3H3-AI/hacs-vision/releases)
2. Copy `custom_components/hacs_vision` to HA's `custom_components/` directory
3. Restart Home Assistant

---

## 配置说明 / Configuration

<!-- zh-CN -->
1. 进入 **设置 → 设备与服务 → 添加集成**
2. 搜索 **HACS Vision**
3. 点击 **提交**（无需额外配置）
4. 面板将出现在侧边栏

<!-- en -->
1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **HACS Vision**
3. Click **Submit** (no extra config needed)
4. The panel will appear in the sidebar

---

## 使用指南 / Usage

### 🛒 商店 / Store

<!-- zh-CN -->
浏览所有可用的 HACS 仓库。使用搜索栏和分类标签筛选，支持按星数、下载量、更新时间排序。点击爱心图标收藏。卡片视图和列表视图可切换。

<!-- en -->
Browse all available HACS repositories. Filter with search bar and category chips. Sort by stars, downloads, or update time. Click heart to favorite. Toggle between card and list views.

### 🔄 更新 / Updates

<!-- zh-CN -->
查看所有可更新的仓库。使用**批量操作栏**全部更新，或逐个更新。

<!-- en -->
View all repositories with pending updates. Use **batch bar** to update all, or update individually.

### 📦 仓库管理 / Management

<!-- zh-CN -->
管理已安装的仓库。查看版本历史、重新安装或移除。

<!-- en -->
Manage installed repos. View version history, reinstall, or remove.

### ⚙️ 集成配置 / Integration Config

<!-- zh-CN -->
点击已安装集成的**配置**按钮，直接在面板中打开 Options Flow 配置弹窗。自动加载集成的中文翻译（如 xiaomi_home、haier、spook 等），字段标签、描述、菜单选项均显示中文。

<!-- en -->
Click the **Configure** button on installed integrations to open the Options Flow dialog directly in-panel. Chinese translations are auto-loaded (e.g. xiaomi_home, haier, spook), with field labels, descriptions, and menu options all localized.

### ⚙️ 设置 / Settings

<!-- zh-CN -->
配置面板行为、查看版本信息、重启 HA，或从面板添加新的 HA 集成。

<!-- en -->
Configure panel behavior, check version info, restart HA, or add new HA integrations.

---

## 更新日志 / Changelog

### v2.1.2 (2026-06-11)
- **New**: 集成配置弹窗自动加载中文本地化翻译 — 通过后端 API 读取 `custom_components/{domain}/translations/zh-Hans.json`，支持 config flow 和 options flow 的所有翻译点（字段标签、描述、占位符、菜单选项、步骤标题）
- **Fix**: `_handleDetail` 无限递归导致 `Maximum call stack size exceeded` 崩溃
- **Fix**: Browse 视图事件转发优化，消除冗余事件监听
- **Chore**: 清理前端调试日志

### v2.1.1 (2026-06-10)
- **Fix**: Config Flow 弹窗中文本地化通道修复 — 后端 `get_config_entries_map()` 返回数组而非对象
- **Fix**: `_loadConfigEntries()` 正确解包 `resp.entries`
- **Fix**: `updated()` 生命周期中 `this.domain` 被错误清空

### v2.1.0 (2026-06-10)
- **New**: 设置页动态显示版本号（从 API 获取）
- **New**: Config Flow 表单增强 — 支持密码掩码、多行文本框、字段说明文字
- **New**: 浏览器缓存自动清除机制
- **UI**: 更新详情支持展开/收起 changelog 预览、移动端触控优化

### v2.0.2 (2026-06-09)
- Fix: 自身更新检测与 HACS 内存注册

### v2.0.1 (2026-06-09)
- Fix: config flow dialog 的 `.hass` 属性传递
- Fix: HA 2026.6.0 升级后 `.pyc` 缓存导致 API 404

### v2.0.0 (2026-06-09)
- 完整 UI 重设计，现代化卡片布局 / Complete UI redesign
- 内置配置流对话框 / Built-in config flow dialog
- 语言自动跟随 HA 系统设置 / Language auto-detection

### v1.1.2 (2026-06-07)
- HTTP 代理模式配置流 / HTTP proxy mode for config flow API

### v1.1.1
- 收藏系统 / Favorites system
- 安装追踪 / Install tracking

### v1.1.0
- 初始公开版本 / Initial public release

---

## 项目结构 / Project Structure

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
│   │   │   └── config-view.js
│   │   └── shared/                    # 共享工具
│   ├── package.json
│   └── rollup.config.js
├── assets/                            # 截图等资源
├── hacs.json                          # HACS 元信息
└── README.md
```

---

## 开发指南 / Development

### 前端构建 / Frontend Build

```bash
cd frontend_src
npm install
npm run build
```

构建产物输出到 `custom_components/hacs_vision/frontend/`。

### 翻译机制 / Translation Mechanism

<!-- zh-CN -->
配置弹窗的翻译通过后端 API `/api/hacs_vision/translations/{domain}?lang=zh-Hans` 实现，直接读取各集成 `custom_components/{domain}/translations/` 下的翻译文件。前端 `_t()` 方法自动适配 HA 的 config/options 双键结构。

<!-- en -->
Translation in config dialog is powered by the backend API `/api/hacs_vision/translations/{domain}?lang=zh-Hans`, reading translation files from each integration's `custom_components/{domain}/translations/` directory. The frontend `_t()` method auto-adapts to HA's dual config/options key structure.

---

## 常见问题 / FAQ

<!-- zh-CN -->
**Q: HACS 和 HACS Vision 有什么区别？**
A: HACS Vision 是 HACS 的可视化前端面板，不替代 HACS。底层使用 HACS 作为后端。

**Q: 可以从 HACS Vision 安装仓库吗？**
A: 可以。在商店中浏览，点击安装即可。

**Q: 配置弹窗字段显示英文怎么办？**
A: 翻译取决于集成作者是否提供了 `zh-Hans.json`。部分集成作者在翻译文件中仍写英文原文（如 "Client Id"），这是正常的。

**Q: 面板显示"HACS not available"？**
A: 确保 HACS 已正确安装和配置。

**Q: 如何更新 HACS Vision？**
A: 通过 HACS 安装的会在更新页显示。手动安装的请下载最新 Release 替换文件。

<!-- en -->
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

## 支持 / Support

- [提交 Issue / File an Issue](https://github.com/C3H3-AI/hacs-vision/issues)
- [讨论区 / Discussions](https://github.com/C3H3-AI/hacs-vision/discussions)

## 许可证 / License

MIT License — 详见 [LICENSE](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>
