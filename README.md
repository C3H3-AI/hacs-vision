# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)

> **当前版本**: v4.0.2 | **最低 HA 版本**: 2024.1.0
> **Current version**: v4.0.2 | **Minimum HA**: 2024.1.0

[![Downloads](https://img.shields.io/github/downloads/C3H3-AI/hacs-vision/total)](https://github.com/C3H3-AI/hacs-vision/releases)

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
- **🛒 商店浏览** — 搜索、分类筛选、多维度排序、收藏仓库。支持卡片/列表双视图，**筛选+排序合并为一行**，提升空间利用率。支持按**收藏**过滤
- **⭐ 仓库点赞（Star）** — 本地收藏与 GitHub Star 独立管理，互不干扰。支持一键 Star/Unstar
- **🔑 GitHub 登录认证** — 设置页自主输入 Token，独立存储，自动登录恢复
- **📦 仓库批量添加** — 支持输入 GitHub 组织/用户 URL，列出所有仓库供勾选批量添加
- **🔄 更新管理** — 一览所有待更新仓库，支持单个或批量更新，带进度追踪。支持**忽略**不需要更新的仓库
- **📦 仓库管理** — 管理已安装仓库、查看版本历史、重新下载（修复安装）或移除（删除下载文件，**不影响**已添加的 HA 配置条目）。支持**状态/类型/仓库**三维筛选+排序
- **⚙️ 集成配置** — 直接在面板中配置任意 HA 已安装集成的 Options Flow（如 xiaomi_home、xiaomi_miot、haier 等），自动加载中文本地化翻译
- **🔌 添加集成** — 从面板直接发起 HA 集成的新建 Config Flow
- **📊 状态统计** — 实时展示已安装/可更新/收藏数量
- **🔔 通知系统** — 有新更新时自动通知，缓存策略优化
- **📱 响应式设计** — 桌面端和移动端均优化，触控目标 44px 规范
- **🧩 集成管理视图** — 卡片网格展示所有已安装集成（含 HACS 安装的仓库），中文搜索、状态筛选、集成类型分组
- **🔍 设备与实体下钻** — 集成卡片点击展开 → 按区域分组的设备列表 → 实体实时状态与属性
- **🎮 实体一键控制** — 开关、灯、锁、窗帘、风扇等常见域直接在面板中控制
- **🏷️ 中文名翻译** — HA 官方 + 自定义集成自动显示中文名称（从 brands 或 manifest 读取）
- **🎨 品牌图标** — CDN → 本地自定义图标 → 首字母 fallback 三级加载
- **🔗 EntityRefFinder** — 查找 HA 中所有对指定 entity_id 的引用（自动化、脚本、场景、面板），支持一键替换
- **🔄 重新下载** — 已安装仓库支持一键重新下载（先卸载再重装），用于修复损坏的安装
- **⛔ 忽略仓库** — 将仓库加入忽略列表，不再出现在搜索结果和更新提醒中

<!-- en -->
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
浏览所有可用的 HACS 仓库。使用搜索栏和筛选标签（状态/标签/类型/排序合并为一行）快速定位。点击爱心图标收藏。支持重新下载和忽略操作，卡片视图和列表视图可切换。

<!-- en -->
Browse all available HACS repositories. Filter with search bar and merged filter chips (status/tags/type/sort in one row). Click heart to favorite. Redownload and ignore operations available. Toggle between card and list views.

### 🔄 更新 / Updates

<!-- zh-CN -->
查看所有可更新的仓库。使用**全部更新**一键升级，或勾选特定仓库后**更新已选**。支持批量移除操作。

<!-- en -->
View all repositories with pending updates. Use **Update All** to upgrade everything, or **Update Selected** for specific repos. Batch removal supported.

### 📦 仓库管理 / Management

<!-- zh-CN -->
管理已安装的仓库。支持**状态**（已安装/可更新/未安装）、**类型**（集成/插件/主题）、**仓库**（全部/已归档/重命名/已忽略）三维筛选+排序。支持批量操作（批量移除）。已归档和重命名仓库使用卡片展示，操作按钮在卡片底部。

<!-- en -->
Manage installed repos with **status** (installed/updatable/not installed), **type** (integration/plugin/theme), and **repo** (all/archived/renamed/ignored) triple filters + sort. Batch operations supported. Archived and renamed repos shown as cards with action buttons at bottom.

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

### v4.0.2 (2026-06-17) — 补丁版
- **Refactor**: 🔄 **Star 同步从前端移到后端** — 新增 `/github/sync-favorites` API，一站式完成 Token 验证 + 拉取 GitHub Star + 对比收藏 + 追加缺失，仅同步 HACS 已知仓库，确保收藏计数与筛选一致
- **Fix**: 🐛 **收藏星标状态类型不匹配** — String vs Number 导致五角星图标全灰
- **Fix**: 🐛 **星星状态脏缓存** — `_starredMap` 旧值不刷新
- **Fix**: 🐛 **render 异常黑屏** — 错误边界兜底
- **Fix**: 🐛 **HA 重启后 "正在重启" 横幅不消失** — `_loadStats` 成功时重置 + 5s 轮询重试
- **Fix**: 🔒 **GitHub Star 同步从未生效** — `hasGitHubToken()` 不存在被静默吞掉

### v4.0.1 (2026-06-17) — 补丁版
- **Fix**: 收藏筛选客户端分页导致显示不全（显示 26 个，筛选只有 4 个）
- **Chore**: 版本号升级至 v4.0.1

### v4.0.0 (2026-06-17) — 正式版
- **New**: 📦 **组织/用户仓库批量添加** — 输入 GitHub 组织或用户 URL，列出仓库供勾选批量添加
- **New**: 🔑 **GitHub HACS Token 导入** — 设置页支持导入已有 HACS Token，自动登录恢复
- **New**: 👤 **GitHub 头像显示** — 已登录用户显示头像
- **New**: ⭐ **仓库点赞（Star）系统** — 本地收藏与 GitHub Star 独立管理，互不干扰
- **New**: 🚀 **更新页秒开** — 缓存加速 + 手动刷新 + 分卡片延迟加载
- **New**: ⚡ **批量 Star 加载** — 并行请求，减少 API 调用
- **New**: 🖼️ **三列网格布局** — 充分利用宽屏空间
- **New**: 🌐 **i18n 全覆盖** — 30+ 国际化文案键值
- **New**: 📱 **响应式适配** — 手机/平板/桌面自适应
- **UI**: 🎨 **颜色系统优化** — 暗色模式兼容、过滤标签 UI 统一
- **UI**: 🖼️ **CSS 遮罩 Token 输入框** — 替代 type=password，更安全美观
- **Chore**: 版本号升级至 v4.0.0
- **Fix**: 🐛 收藏筛选客户端分页导致显示不全（显示 26 个，筛选只有 4 个）

### v3.0.0 (2026-06-13) — 正式版
- **New**: 🖼️ **集成实体/设备概览** — 集成详情弹窗顶部显示「N 个设备 · M 个实体」汇总统计
- **New**: 🔗 **仓库依赖检查** — 仓库管理视图新增「检查依赖」按钮，可视化显示缺失的依赖包
- **New**: 🔍 **搜索历史记录** — 商店搜索框自动记录最近 10 条搜索记录，支持点击回填和逐条删除
- **New**: 🏷️ **记住上次 Tab** — 刷新页面自动恢复上次打开的 Tab（商店/集成管理/更新/仓库管理/设置）
- **New**: 📦 **仓库管理筛选持久化** — 筛选/排序状态刷新后保留
- **New**: 🎨 **弹窗全面升级** — 所有弹窗支持拖拽移动、Escape 关闭、slideUp 动画、统一关闭按钮
- **New**: 🚀 **插件/主题静默重载** — 安装后自动重新加载配置，无需弹窗确认
- **New**: 💬 **集成安装智能提示** — 安装完成后弹窗提示 [重启] [稍后]，重启后才能配置
- **UI**: 🎯 **四视图布局完全统一** — 商店/仓库管理/更新/集成管理的搜索框、按钮、间距、字号全部对齐
- **UI**: 🪟 **配置页三列布局** — 电脑端设置/维护/数据管理三列，手机单列
- **UI**: 🔘 **品牌图标三级加载** — CDN → GitHub raw(brand目录) → 本地 → 组织头像 → 首字母
- **UI**: 🏷️ **筛选标签蓝色高亮** — 筛选区标签使用 primary-color，分隔线间距加大
- **UI**: 🖼️ **卡片列表视图** — 集成管理新增卡片/列表切换模式
- **UI**: 🖼️ **设备视图设备折叠** — 每个设备头部可折叠/展开下方实体列表
- **UI**: 🔢 **字号全面提升** — 去掉所有 8-9px 字号，最小统一为 10px
- **UI**: 🌐 **中英文翻译全面补全** — 新增 25+ 翻译键，修复所有缺失翻译
- **Fix**: 🐛 构造函数 `this._loadSearchHistory()` 未定义导致商店空白
- **Fix**: 🐛 `makeDraggable` 被 Rollup tree-shake 导致弹窗拖拽失效
- **Fix**: 🐛 子项弹窗 CSS 选择器写错导致手机端布局错误
- **Fix**: 🐛 集成管理 host padding 导致标签栏到搜索框间距不一致
- **Chore**: 版本号升级至 v3.0.0

### v2.3.3 (2026-06-13)
- **New**: 🔄 **重新下载** — 已安装仓库一键重新下载（卸载+重装），修复损坏安装。支持 `POST /redownload` API
- **New**: ⛔ **忽略仓库** — 将仓库加入忽略列表，不再出现在搜索结果和更新提醒。支持 `POST /ignore` API
- **New**: 🗣️ **提示信息全面优化** — 所有确认对话框增加操作后果描述（卸载、删除、移除、忽略等），让用户清楚知道每个操作的影响范围
- **New**: 🎨 **UI 全面重构** — 商店/仓库管理/集成管理/更新四视图布局统一
- **New**: 🔗 **筛选+排序合并** — 所有视图的筛选和排序合并为一行，去掉冗余标签文字
- **New**: 🏷️ **筛选标注** — 每组筛选 chips 前加蓝色高亮标签（状态/标签/类型/排序/仓库）
- **New**: 📦 **仓库管理状态+类型筛选** — 新增按安装状态和分类筛选仓库
- **New**: 🗑️ **仓库管理批量操作** — 全选 checkbox + 批量移除，与商店一致
- **New**: 🔢 **统计信息** — 仓库管理显示"共 N 个仓库"
- **New**: 🔄 **刷新按钮** — 仓库管理新增刷新按钮
- **New**: ▲/▼ **排序方向指示** — 所有排序芯片添加方向箭头
- **New**: 🖼️ **空状态图标** — 仓库管理四个空状态全部加 SVG 图标
- **New**: 🔁 **重新加载** — 配置页新增重新加载按钮（调用 `homeassistant.reload_core_config`），插件/主题装完无需重启
- **New**: 💾 **备份/恢复** — 配置页新增导出/导入 HACS 配置备份
- **New**: 🟠 **待加载标记** — 安装插件/主题后选"稍后" → 卡片显示🟠待加载标签，调用重新加载后自动清除
- **New**: 💬 **安装/更新后智能提示** — 集成→建议重启，插件/主题→建议重新加载，1.5 秒后弹窗
- **New**: 🎨 **品牌图标三级加载** — CDN → GitHub raw(brand目录) → 本地 → 组织头像 → 首字母
- **New**: 🃏 **集成管理列表视图** — 新增卡片/列表切换，列表模式显示域名字段
- **New**: 🏷️ **中英文翻译全面补全** — 新增 20+ 翻译键，修复 `catPython`/`flowStartFailed`/`statusDisabled`/`delete` 等缺失翻译
- **UI**: 🎯 **全部按钮高度统一为 36px** — 刷新/切换/添加仓库/添加集成按钮高度完全一致
- **UI**: 🔍 **搜索框统一** — 商店/管理/更新/集成管理搜索框全部使用共享样式（40px 高度，flex 自适应宽度）
- **UI**: 📐 **间距统一** — 修复集成管理 `:host padding` 导致的标签栏到搜索框间距不一致
- **UI**: 🖼️ **背景统一** — 商店内容区使用 card-background-color 包裹，消除"断层"感
- **UI**: 🎨 **avatar 背景色去除** — 图标不再被分类色背景覆盖，仅 initials 显示背景色
- **UI**: 🔲 **配置页三列布局** — 电脑端设置/维护/数据管理三列，手机单列
- **Fix**: 📖 README 和⛔忽略按钮从商店卡片移除，仅在仓库管理显示
- **Fix**: 🗑️ 更新页面去掉批量选择（无实际意义）
- **Fix**: 🧩 集成管理搜索框前的蓝色数字 badge 已移除
- **Fix**: 🐛 `_handleIgnore` 误用"确定要卸载"作为忽略确认文字 → 改为正确的 `confirmIgnore` 翻译
- **Fix**: 🐛 更新确认文案混乱 — 全部更新和更新已选使用不同的确认文案模板
- **Fix**: 🐛 集成删除确认缺少集成名称 → 新增 `{domain}` 模板参数
- **Fix**: `multi_select` 字段渲染为勾选框而非多选下拉框（如 xiaomi_home 配置）
- **Fix**: `is_custom` 字段前后端不一致导致自定义仓库筛选不可用
- **Fix**: tag 筛选移至后端 API，分页正常
- **Fix**: `entity_ref_finder` 三层兜底：`state.attributes` → `hass.data` → `.storage` 文件，兼容 HA 2025.7+
- **Fix**: 重命名标签与右侧标签重叠（融入 `right-tags` 容器）
- **Fix**: 仓库卡片移除按钮从右上角移至底部操作栏
- **Fix**: 管理模式下隐藏重复的"自定义"标签（全是自定义）
- **Fix**: 骨架屏统一为 6 个卡片
- **Fix**: number 字段 `valueMin/valueMax` 兜底支持
- **Fix**: boolean 兼容 `true`/`1`/`"1"`
- **Fix**: 所有 `_LOGGER.error` 补全 `exc_info=True`
- **Chore**: 术语对齐 HACS 官方翻译，`remove` 从"卸载"改为"移除"
- **Chore**: 新增 `delete` 系列 key，集成管理操作用"删除"
- **Chore**: 集成管理去掉重复的"集成管理"页面标题
- **Chore**: 同步版本号 v2.3.3

### v2.3.2 (2026-06-12)
- **Fix**: 自定义仓库筛选无效 — 后端返回字段 `"custom"` 与前端读取 `is_custom` 不一致，现已对齐（双字段兼容）
- **Chore**: 同步版本号 v2.3.2

### v2.3.1 (2026-06-12)
- **Fix**: 补回 v2.3.0 release 缺失的 `entity_ref_finder.py`，修复集成加载 `ModuleNotFoundError`
- **Chore**: 同步版本号 v2.3.1，更新 README

### v2.3.0 (2026-06-12)
- **New**: 🧩 集成管理视图 — 卡片网格展示所有已安装集成，中文搜索、状态筛选、集成类型分组
- **New**: 🔍 设备与实体下钻 — 集成卡片点击展开 → 按区域分组的设备列表 → 实体实时状态
- **New**: 🎮 实体一键控制 — 开关、灯、锁、窗帘、风扇等常见域直接在面板中控制
- **New**: 🏷️ 中文名翻译 — HA 官方 + 自定义集成自动显示中文名称（从 brands / manifest 读取）
- **New**: 🎨 品牌图标 — 三级加载：CDN → 本地自定义图标（`custom_components/{domain}/brand/`） → 首字母 fallback
- **New**: 🔗 EntityRefFinder — `EntityRefFinder` 类，扫描 HA 中所有对指定 entity_id 的引用（自动化/脚本/场景/面板），支持 preview 替换模式和一键替换
- **Enhance**: HACSBrandIconView 支持 `/icon`、`/logo` 子路径解析，修复域名带 `_` 时的路径提取
- **Enhance**: `get_all_repos_from_hacs()` 返回字段增加 `default_branch`
- **Fix**: `api.py` 品牌图标静态资源路径优化，使用 `actual_domain` 而非原始 `safe_domain`
- **Chore**: 更新 `const.py` version → 2.3.0，同步 `manifest.json`

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
