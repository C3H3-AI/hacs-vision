# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Downloads](https://img.shields.io/github/downloads/C3H3-AI/hacs-vision/total)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Stars](https://img.shields.io/github/stars/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/stargazers)
[![License](https://img.shields.io/github/license/C3H3-AI/hacs-vision)](LICENSE)

[![中文](https://img.shields.io/badge/lang-zh--CN-blue.svg)](#)
[![English](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)
[![Deutsch](https://img.shields.io/badge/lang-de-green.svg)](README.de.md)

> **当前版本**: v6.4.0 | **最低 HA 版本**: 2024.1.0

> **⚠️ 前置条件**: 必须先安装并配置好 [HACS](https://hacs.xyz)

---

## 简介

**HACS Vision** 是 HACS 的现代化可视化面板，内置商店界面。让你像逛应用商店一样直观地浏览、安装、更新和管理 Home Assistant 集成、插件和主题。支持直接在面板中配置任意 HA 集成（config flow / options flow），并自动显示中文本地化翻译。

---

## 功能特性

- **🛒 商店浏览** — 搜索、分类筛选、多维度排序、收藏仓库。支持卡片/列表双视图，**筛选+排序合并为一行**，提升空间利用率。支持按**收藏**过滤。版本选择器点击可见各版本更新内容
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
- **🖼️ 集成配置页内嵌** — 集成管理视图点击卡片，弹窗内 iframe 加载 HA 原生配置页，双击全屏，关闭即回
- **🧩 配置流表单渲染** — 下拉选择改为单选按钮 + 下一步按钮，配置操作更直观
- **🤖 自动更新** — 后台定时检测并自动安装仓库更新，支持白名单管理、可调检测频率（1h/3h/6h/12h/24h）、更新通知、仓库级开关
- **🔍 搜索+添加仓库合一** — 搜索框直接支持添加仓库：输入 `owner/repo` 或 GitHub URL 显示内联添加栏，输入组织名自动加载仓库列表供批量添加
- **🔗 详情弹窗仓库名可点击** — 详情弹窗中的仓库名直接跳转到 GitHub 仓库页面

---

## 截图

| 商店 | 详情 | 配置流 |
|:----:|:----:|:------:|
| ![store](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/store.png) | ![detail](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/detail.png) | ![config-flow](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/config-flow.png) |
| **仓库管理** | **更新** | **设置** |
| ![management](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/management.png) | ![updates](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/updates.png) | ![settings](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/settings.png) |
| **集成管理** | **集成配置** | |
| ![integrations](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integrations.png) | ![integration-config](https://raw.githubusercontent.com/C3H3-AI/hacs-vision/main/assets/integration-config.png) | |

---

## 安装方法

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

## 配置说明

1. 进入 **设置 → 设备与服务 → 添加集成**
2. 搜索 **HACS Vision**
3. 点击 **提交**（无需额外配置）
4. 面板将出现在侧边栏

---

## 使用指南

### 🛒 商店

浏览所有可用的 HACS 仓库。使用搜索栏和筛选标签（状态/标签/类型/排序合并为一行）快速定位。点击爱心图标收藏。支持重新下载和忽略操作，卡片视图和列表视图可切换。

### 🔄 更新

查看所有可更新的仓库。使用**全部更新**一键升级，或勾选特定仓库后**更新已选**。支持批量移除操作。

### 📦 仓库管理

管理已安装的仓库。支持**状态**（已安装/可更新/未安装）、**类型**（集成/插件/主题）、**仓库**（全部/已归档/重命名/已忽略）三维筛选+排序。支持批量操作（批量移除）。已归档和重命名仓库使用卡片展示，操作按钮在卡片底部。

### 🧩 集成管理

通过卡片网格浏览所有已安装的 HA 集成，支持中文名称搜索、状态筛选和批量操作。**点击卡片**直接弹出 HA 原生配置页（iframe 内嵌，CSS 裁剪侧边栏），可双击全屏查看。**⚙ 配置按钮**打开 Options Flow 配置弹窗，自动加载中文翻译。

### ⚙️ 设置

配置面板行为、查看版本信息、重启 HA，或从面板添加新的 HA 集成。

---

## 更新日志

### v6.4.1 (2026-07-06) — 兼容修复 & 安全增强
- **Fix**: 🗂️ **自定义仓库识别修复** — 改用 `is_default()` 判断自定义仓库，兼容 HACS 2.0 移除 `custom_repositories` 字段
- **Fix**: 🔍 **集成管理视图不显示** — 配置条目缓存强制刷新（`force_refresh=True`），新添加的集成立即可见
- **Fix**: 🔄 **同步选中仓库报 500** — 兼容字符串和对象两种数据格式，前后端统一处理
- **Fix**: ⚡ **仓库同步后找不到** — 简化 `_ensure_custom_repos_registered`，依赖 HACS 自身注册机制
- **Chore**: 🛡️ **API 安全增强** — 配置和设置白名单过滤、参数校验、语言参数防路径遍历
- **Chore**: 🔑 **OAuth 不再返回 token** — 消除 token 泄露风险

### v6.4.0 (2026-07-06) — 搜索+添加仓库合一
- **New**: 🔍 **搜索+添加仓库合一** — 商店和仓库管理视图的搜索框直接支持添加仓库：输入 owner/repo 或 GitHub URL 显示内联添加栏，输入组织名自动加载仓库列表供批量勾选。移除独立的「+ 添加仓库」按钮和表单
- **New**: 🎯 **搜索能力增强** — 所有视图搜索统一支持 GitHub URL 解析、作者名搜索、组织名搜索
- **New**: 🔗 **详情弹窗仓库名可点击** — 详情弹窗中的仓库名变为可点击链接，直接跳转到 GitHub 仓库页面
- **Fix**: ✅ **自定义仓库注册失败** — `add_custom_repository` 使用 `check=False` 避免 GitHub API 限流导致仓库注册失败

### v6.3.0 (2026-07-05) — 三段式更新面板
- **New**: 🗂️ **三段式折叠更新页** — 可更新（默认展开）、已更新（默认折叠，近 30 天记录）、已略过（默认折叠），分类清晰
- **New**: 📜 **更新历史追踪** — 每次更新自动记录（仓库名、版本变更、时间），30 天自动清理，支持 API 查询
- **New**: ⏳ **实时更新进度** — 更新卡片显示进度条 + 百分比（5%→75%→100%），轮询实时刷新
- **Chore**: 版本号升级至 v6.3.0

### v6.2.1 (2026-07-04) — 优化修复
- **New**: 🕐 **预约重启** — 设置面板时间选择器，自动更新安装完成后在指定时间重启 HA，不留空不重启
- **New**: 💬 **白名单弹窗分页** — 设置面板白名单改为按钮 + 模态弹窗，分页搜索、chips、全选/取消、保存/取消
- **New**: 🔄 **HACS 数据刷新** — 自动更新前先刷新 HACS 仓库数据，确保获取最新版本，不再漏更新
- **Fix**: 🛡️ **设置合并保存** — 后端 `_update_settings` 改为 `{**existing, **body}` 合并，避免部分更新覆盖其他设置
- **Fix**: ⏳ **前端加载保护** — 添加 `_installedLoaded` 标志，防止无限加载状态

### v6.2.0 (2026-07-04) — 自动更新
- **New**: 🤖 **自动更新引擎** — 后台定时检测并自动安装白名单中的仓库更新。非重叠运行，Coalescing 防竞争。加载设置后 60 秒首次执行，随后按配置间隔周期性运行
- **New**: 📋 **白名单管理** — 设置面板弹窗分页设置自动更新白名单，支持搜索、分页（15条/页）、chips 已选展示、全选/取消全选、保存/取消
- **New**: 🔘 **仓库级自动更新开关** — 商店浏览页面和更新页面每个仓库卡片上添加滑块开关，乐观更新 + API 失败自动回滚
- **New**: ⏰ **可调检测频率** — 支持 1h / 3h / 6h / 12h / 24h 五种间隔
- **New**: 🔔 **更新通知** — 自动更新完成后发送 HA 持久通知（可开关），固定通知 ID 防堆积
- **New**: 🛠️ **4 个后端服务** — `trigger_auto_update`（手动触发）、`reload_auto_update_settings`（重载设置）、`start_auto_update`/`stop_auto_update`（启停调度）
- **Chore**: 版本号升级至 v6.2.0

### v6.0.0b1 (2026-07-01) — 架构拆分 Beta
- **New**: 🏗️ **api.py 拆分** — 3,717 行 api.py 拆分为 `api.py` + `api_config_flow.py` + `api_repos.py`，通过 Mixin 组合继承
- **Fix**: 🌐 **语言切换全界面生效** — 解决切换语言后筛选栏/列头不刷新的问题，选项数组改为语言变化时重建
- **Fix**: 🐛 **3 个翻译键补全 + 1 个拼写修正** — `loadingUpdates`/`processing`/`inputRepoPlaceholder` 新增，`verifing`→`verifying`
- **Fix**: 🐛 **6 处硬编码中文替换** — repo-card/browse/management/integrations-list 中硬编码中文改为 `t()` 调用
- **Fix**: 🔄 **导航时语言切换即时刷新** — 子视图监听 `hacs-lang-changed` 事件，确保切换 Tab 后文字仍为所选语言
- **Chore**: 版本号升级至 v6.0.0b1

### v6.0.0b0 (2026-06-30) — 多语言 Beta
- **New**: 🌍 **多语言支持架构** — 重构 i18n 引擎，语言检测从二元硬编码升级为可扩展映射表 (`LANG_MAP`)
- **New**: 🇩🇪 **德语翻译** — 由社区贡献者支持，200+ 前端键完整翻译 + 后端 `de.json`
- **New**: 🔠 **设置页语言选择器** — 可在设置页手动选择语言，覆盖 HA 系统语言检测
- **New**: 🧩 **第三方语言扩展** — 新语言只需 2 步：加 `LANG_MAP` 映射 + 写翻译键。零代码改检测逻辑
- **Chore**: 版本号升级至 v6.0.0b0

### v5.2.0 (2026-06-30) — 跳过版本 + 全面优化
- **New**: 🐛 **直接提交 GitHub Issue** — 在卡片和详情弹窗中一键提交 Issue，自动收集日志、系统信息、上传截图，支持 GitHub 截图粘贴
- **New**: 🔕 **版本级跳过更新** — 支持跳过指定版本，下个新版本正常提醒。与 HA 原生 `update.skip`/`update.clear_skipped` 同步
- **New**: 👁️ **已跳过更新面板** — 更新页筛选栏显示 `🔇 显示/隐藏已跳过更新 (N)`，点击展开/收起已跳过的版本卡片，支持"取消跳过"
- **New**: ⚡ **Updates 数据源切到 HA 实体** — 从 HA 状态机直接读取 `update.*` 实体，替代 HACS 内部 API。更实时、更准确
- **New**: 🏷️ **批量跳过** — 勾选多个仓库后，操作栏增加"批量跳过"按钮
- **Optimize**: 📦 **商店/仓库管理同步跳过** — 所有列表接口交叉检查 HA 实体跳过状态
- **Optimize**: 🔄 **HA 重启可靠性** — 修复 Supervisor 作业卡死导致重启失败的问题
- **Optimize**: 📋 **Issue 弹窗清理** — 删除废弃的 `_showIssueDialog` Lit 模板代码
- **Fix**: 🐛 **跳过版本 500 错误** — `release_url` 可能为 `None` 导致异常
- **Fix**: 🐛 **跳过版本后更新数不变** — 排除 `pending_restart` 仓库
- **Fix**: 🐛 **跳过卡片渲染中断** — `<img>` + `@error` 破坏 Lit 渲染管道
- **Chore**: 版本号升级至 v5.2.0

### v5.1.0 (2026-06-21) — 优化版
- **New**: 📊 **集成卡片显示设备/实体数** — 每个集成卡片、列表行展示设备和实体数量
- **New**: ⭐ **GitHub 登录自动星标** — Token/OAuth/HACS 导入后自动星标本仓库
- **New**: 🏷️ **侧边栏+标题图标统一** — 全部使用 `hacs:hacs` 图标，去掉蓝底背景
- **Fix**: 🧹 **清理 130+ 冗余 fallback** — 移除所有 `|| '中文'` 无效回退，信任 i18n 层
- **Fix**: 🌐 **补充 5 个缺失 i18n 键** — githubTokenRequired, pendingRestart, selectAction, zoom, restarting
- **Fix**: 🎨 **emoji 统一为 SVG 图标** — 设置页 GitHub/OAuth 区域 emoji 替换
- **Fix**: 🎨 **硬编码颜色改为 CSS 变量** — `#f44336` → `var(--error-color)` 等
- **Fix**: 🔔 **默认视图变更提示** — 选择后弹出 Toast 提示保存成功
- **Fix**: 🖼️ **集成图标 avatar 重构** — 使用生命周期 + RAF + complete 兜底
- **Fix**: 🎨 **28 处 inline style → CSS 工具类** — config-view GitHub 区域
- **Chore**: 版本号升级至 v5.1.0

### v5.0.1 (2026-06-21) — 补丁版
- **New**: 🔑 **OAuth 无痕登录** — 通过 GitHub OAuth 设备流直接授权，无需手动输入 Token
- **New**: 🚀 **OAuth 绕过 SSRF** — 使用独立 aiohttp session，不被 HA SSRF 中间件拦截
- **New**: 👥 **组织/用户仓库开放使用** — 无需登录即可输入组织名列出仓库
- **New**: ⚡ **设置即时保存** — 修改刷新间隔、默认视图后自动保存并提示
- **New**: 🛑 **待重启卡片快捷按钮** — 管理视图中 `pending_restart` 状态的仓库卡片下方直接显示重启按钮
- **Fix**: 🗑️ 清理废弃的 `save-bar` CSS 样式
- **Chore**: 版本号升级至 v5.0.1

### v5.0.0 (2026-06-20) — 正式版
- **Arch**: 架构重构 — 从 Lovelace iframe 迁移至 panel_custom embed_iframe=False
- **New**: 配置体系重构（M1-M6）— 商店按钮智能逻辑、集成管理弹窗、后端动态字段刷新
- **New**: 手机端全界面适配 — 四个视图统一手机端布局，折叠区收纳操作按钮
- **New**: 侧边栏按钮贴左 — 手机端 48px 标准触摸目标，贴合屏幕边缘
- **New**: 卡片/列表单按钮切换 — 两个按钮合并，点击切换节省空间
- **New**: 智能搜索框 — 默认图标，聚焦撑满全行
- **Fix**: 收藏计数同步 — 卡片收藏后抬头数字立即更新
- **Fix**: 版本通道隔离 — 预发布版与正式版独立更新通道
- **Fix**: 统一图标按钮样式 — 36x36px 统一边框圆角
- **Fix**: 分页 Bug — GitHub org repos 无限翻页修复
- **Fix**: 按键竞争 — e.preventDefault 时序修复
- **Fix**: scoped CE registry 兼容 — HA 2025.7+ 适配
- **Fix**: 更新日志显示 — changelog API tag 参数修复
- **Fix**: 预览版降级保护
- **Fix**: 弹窗系统重构 — 支持最大化/双击全屏/URL点击
- **Fix**: 重复折叠键 — 移除多余 ≡ 按钮
- **Perf**: HA API 会话复用、N+1 查询修复、后端缓存上限
- **Chore**: 版本号升级至 v5.0.0

### v4.1.0 (2026-06-17) — 正式版
- **New**: 🖼️ **集成配置页内嵌** — 集成管理视图点击卡片，弹窗内 iframe 加载 HA 原生配置页，CSS 裁剪侧边栏
- **New**: 🖱️ **双击全屏** — iframe 弹窗内双击 → 框架内全屏显示配置内容，再双击还原
- **New**: 🏷️ **中文标题** — 弹窗标题使用翻译后的中文集成名
- **New**: 📋 **版本选择器显示更新内容** — 点击版本列表中的版本号，下方更新内容区加载该版本的 release notes
- **Fix**: 🐛 **版本选择器只显示最新版本** — 现在点击任意版本可加载对应更新内容
- **Chore**: 版本号升级至 v4.1.0

### v4.0.2 (2026-06-17) — 补丁版
- **Refactor**: 🔄 **Star 同步从前端移到后端** — 新增 `/github/sync-favorites` API
- **Fix**: 🐛 **收藏星标状态类型不匹配** — String vs Number 导致五角星图标全灰
- **Fix**: 🐛 **星星状态脏缓存** — `_starredMap` 旧值不刷新
- **Fix**: 🐛 **render 异常黑屏** — 错误边界兜底
- **Fix**: 🐛 **HA 重启后横幅不消失** — `_loadStats` 成功时重置 + 5s 轮询重试
- **Fix**: 🔒 **GitHub Star 同步从未生效** — `hasGitHubToken()` 不存在被静默吞掉

### v4.0.1 (2026-06-17) — 补丁版
- **Fix**: 收藏筛选客户端分页导致显示不全
- **Chore**: 版本号升级至 v4.0.1

### v4.0.0 (2026-06-17) — 正式版
- **New**: 📦 **组织/用户仓库批量添加** — 输入 GitHub 组织或用户 URL，列出仓库供勾选批量添加
- **New**: 🔑 **GitHub HACS Token 导入** — 设置页支持导入已有 HACS Token
- **New**: 👤 **GitHub 头像显示** — 已登录用户显示头像
- **New**: ⭐ **仓库点赞（Star）系统** — 本地收藏与 GitHub Star 独立管理
- **New**: 🚀 **更新页秒开** — 缓存加速 + 手动刷新 + 分卡片延迟加载
- **New**: ⚡ **批量 Star 加载** — 并行请求，减少 API 调用
- **New**: 🖼️ **三列网格布局** — 充分利用宽屏空间
- **New**: 🌐 **i18n 全覆盖** — 30+ 国际化文案键值
- **New**: 📱 **响应式适配** — 手机/平板/桌面自适应
- **Chore**: 版本号升级至 v4.0.0

### v3.0.0 (2026-06-13) — 正式版
- **New**: 🖼️ **集成实体/设备概览** — 集成详情弹窗顶部显示设备/实体汇总统计
- **New**: 🔗 **仓库依赖检查** — 仓库管理视图新增「检查依赖」按钮
- **New**: 🔍 **搜索历史记录** — 商店搜索框自动记录最近 10 条搜索记录
- **New**: 🏷️ **记住上次 Tab** — 刷新页面自动恢复上次打开的 Tab
- **New**: 📦 **仓库管理筛选持久化** — 筛选/排序状态刷新后保留
- **New**: 🎨 **弹窗全面升级** — 所有弹窗支持拖拽移动、Escape 关闭、slideUp 动画
- **New**: 🚀 **插件/主题静默重载** — 安装后自动重新加载配置
- **New**: 💬 **集成安装智能提示** — 安装完成后弹窗提示 [重启] [稍后]
- **UI**: 🎯 **四视图布局完全统一**
- **Chore**: 版本号升级至 v3.0.0

### v2.3.3 (2026-06-13)
- **New**: 🔄 **重新下载** — 已安装仓库一键重新下载（卸载+重装），修复损坏安装
- **New**: ⛔ **忽略仓库** — 将仓库加入忽略列表
- **New**: 🗣️ **提示信息全面优化** — 所有确认对话框增加操作后果描述
- **New**: 🎨 **UI 全面重构** — 四视图布局统一
- **New**: 🔗 **筛选+排序合并** — 所有视图的筛选和排序合并为一行
- **New**: 📦 **仓库管理状态+类型筛选** — 新增按安装状态和分类筛选仓库
- **New**: 🗑️ **仓库管理批量操作** — 全选 checkbox + 批量移除
- **New**: 💾 **备份/恢复** — 配置页新增导出/导入 HACS 配置备份
- **New**: 💬 **安装/更新后智能提示** — 集成→建议重启，插件/主题→建议重新加载
- **Chore**: 同步版本号 v2.3.3

### v2.3.2 (2026-06-12)
- **Fix**: 自定义仓库筛选无效 — 后端 `"custom"` 与前端 `is_custom` 不一致，双字段兼容
- **Chore**: 同步版本号 v2.3.2

### v2.3.1 (2026-06-12)
- **Fix**: 补回 v2.3.0 release 缺失的 `entity_ref_finder.py`
- **Chore**: 同步版本号 v2.3.1

### v2.3.0 (2026-06-12)
- **New**: 🧩 集成管理视图 — 卡片网格展示所有已安装集成
- **New**: 🔍 设备与实体下钻 — 集成卡片点击展开 → 按区域分组的设备列表
- **New**: 🎮 实体一键控制 — 开关、灯、锁、窗帘、风扇等
- **New**: 🏷️ 中文名翻译 — HA 官方 + 自定义集成自动显示中文名称
- **New**: 🎨 品牌图标 — CDN → 本地 → 首字母，三级加载
- **New**: 🔗 EntityRefFinder — 查找替换所有 entity_id 引用
- **Chore**: 版本号升级至 v2.3.0

### v2.1.2 (2026-06-11)
- **New**: 集成配置弹窗自动加载中文本地化翻译
- **Fix**: `_handleDetail` 无限递归导致栈溢出崩溃

### v2.1.1 (2026-06-10)
- **Fix**: Config Flow 弹窗中文本地化通道修复

### v2.1.0 (2026-06-10)
- **New**: 设置页动态显示版本号
- **New**: Config Flow 表单增强

### v2.0.2 (2026-06-09)
- Fix: 自身更新检测与 HACS 内存注册

### v2.0.1 (2026-06-09)
- Fix: config flow dialog `.hass` 属性传递
- Fix: HA 2026.6.0 升级后 `.pyc` 缓存导致 API 404

### v2.0.0 (2026-06-09)
- 完整 UI 重设计，现代化卡片布局
- 内置配置流对话框
- 语言自动跟随 HA 系统设置

### v1.1.2 (2026-06-07)
- HTTP 代理模式配置流

### v1.1.1
- 收藏系统
- 安装追踪

### v1.1.0
- 初始公开版本

---

## 项目结构

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

## 开发指南

### 前端构建

```bash
cd frontend_src
npm install
npm run build
```

构建产物输出到 `custom_components/hacs_vision/frontend/`。

### 翻译机制

配置弹窗的翻译通过后端 API `/api/hacs_vision/translations/{domain}?lang=zh-Hans` 实现，直接读取各集成 `custom_components/{domain}/translations/` 下的翻译文件。前端 `_t()` 方法自动适配 HA 的 config/options 双键结构。

---

## 常见问题

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

---

## 支持

- [提交 Issue](https://github.com/C3H3-AI/hacs-vision/issues)
- [讨论区](https://github.com/C3H3-AI/hacs-vision/discussions)

## 许可证

MIT License — 详见 [LICENSE](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>
