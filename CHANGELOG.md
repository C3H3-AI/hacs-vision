# Changelog

## v6.7.0-beta3 (2026-09-10) — 版本标注与分组 / Version Badges & Grouping

> ⚠️ **预发布版本（Beta）** — 基于 v6.7.0-beta2，改进「Commit / 分支」页签的体验。请通过 HACS 的「显示 Beta 版本」或 GitHub Releases 安装测试。
> **Pre-release (Beta)** — Built on v6.7.0-beta2, improves the "Commit / Branch" tab experience. Install via HACS "Show beta versions" or GitHub Releases for testing.

### ✨ 改进 / Improved

- **分支/commit 列表按类型分组** — 先展示分支区（大写标题），再展示提交区，不再混排
- **版本号自动关联** — 后端调用 `/releases` API，通过 `target_commitish` 交叉匹配分支/commit 对应的发布版本号；匹配到的项显示蓝色版本徽章（如 `v2.0.0`），无版本号的不标
- **默认分支标记** — 默认分支（`main` / `master`）右侧显示绿色"默认"徽章
- **自动聚焦输入框** — 切到「Commit / 分支」页签后，输入框自动获得焦点，可直接开始输入
- **安装后刷新** — 安装任意 ref 后自动重新加载列表，更新版本标记
- **统一安装锁** — `_installing` 共享锁，安装中所有安装按钮（稳定版/预发布版/ref）同时禁用，避免并发
- **列表高度** — 从 220px 提高到 280px，可展示更多项
- **俄语本地化** — 补全 `refTab`、`refBranch`、`refCommit` 等 8 条 ru 翻译
- **Branch/Commit list grouped** — branches and commits displayed in separate sections with headers
- **Version auto-association** — backend fetches `/releases` and cross-references `target_commitish` to attach version badges; items with matching versions get a blue badge, others are unlabeled
- **Default branch marker** — the default branch shows a green "Default" badge
- **Auto-focus input** — the ref input field auto-focuses when switching to the "Commit / Branch" tab
- **Post-install refresh** — ref list auto-refreshes after install to update version markers
- **Unified install lock** — shared `_installing` lock disables all install buttons during any installation
- **Increased list height** — 220px → 280px for more visible items
- **Russian i18n** — added 8 translation keys for the ref tab

## v6.7.0-beta2 (2026-09-09) — 任意 commit / 分支安装 / Arbitrary Commit & Branch Install

> ⚠️ **预发布版本（Beta）** — 基于 v6.7.0-beta1，新增「任意 commit / 分支安装」功能。请通过 HACS 的「显示 Beta 版本」或 GitHub Releases 安装测试。
> **Pre-release (Beta)** — Built on v6.7.0-beta1, adds arbitrary commit/branch install. Install via HACS "Show beta versions" or GitHub Releases for testing.

### ✨ 新功能 / Added

- **版本选择器新增「Commit / 分支」页签** — 在原有的「正式版」「预发布版」之后增加第三个页签，支持安装任意 git ref
  - 自动列出仓库分支（GitHub `/branches`）与最近 15 条提交（`/commits`），每条带「分支 / 提交」徽章，点击即装
  - 支持手动输入分支名或 commit SHA 安装（如 `dev`、`a1b2c3d`），回车或点「安装」
  - 面板内橙色提示：任意 ref 安装属于开发用途，可能不稳定且不会收到更新提醒
- **Version selector gains a "Commit / Branch" tab** — a third tab after Stable / Pre-releases for installing any git ref
  - Lists repository branches (GitHub `/branches`) and the 15 most recent commits (`/commits`), each installable with one click
  - Manual entry of a branch name or commit SHA (e.g. `dev`, `a1b2c3d`)
  - In-panel warning that arbitrary-ref installs are for development, may be unstable, and receive no update notifications

### 🔧 后端 / Backend

- **支持任意 ref 安装** — `install_repository_version()` 自动判定目标是已知 release tag 还是任意 ref；非 release 时临时固定 `repo.ref` 让 HACS 下载该分支/commit，并在 `finally` 中**必定还原**，避免污染后续安装
- **Arbitrary ref support** — `install_repository_version()` detects whether the target is a known release tag; for non-release refs it temporarily pins `repo.ref` so HACS downloads that branch/commit, and always restores it in a `finally` block
- 新增 `_is_release_version()` 判定（兼容 v 前缀、对象式 releases）与 `get_repo_refs()` 分支/提交拉取
- 新增 API：`GET repos/refs`（列出分支与提交）、`POST repos/install_ref`（安装指定 ref）
- New API endpoints: `GET repos/refs`, `POST repos/install_ref`

### 🧪 测试 / Tests

- 新增 9 条单测覆盖 release tag 判定与 ref 安装的固定/还原行为
- 9 new unit tests covering release-tag detection and ref pinning/restoration

## v6.7.0-beta1 (2026-09-09) — 侧边栏逃逸通道修复（Beta）/ Sidebar Escape Hatch (Beta) (#29)

> ⚠️ **预发布版本（Beta）** — 请通过 HACS 的「显示 Beta 版本」或 GitHub Releases 安装测试。功能与 v6.6.2 相同，仅版本命名不同。
> **Pre-release (Beta)** — Install via HACS "Show beta versions" or GitHub Releases for testing. Same content as v6.6.2, different version naming only.

### 🔧 修复 / Fixed

- **侧边栏隐藏后无法离开面板 ([#29](https://github.com/C3H3-AI/hacs-vision/issues/29))** — 面板头部菜单按钮（汉堡）的显示条件与原生 HA 面板对齐：窄屏（HA 阈值 870px）或侧边栏被设为「始终隐藏」（`dockedSidebar: always_hidden`）时显示，点击派发 `hass-toggle-menu` 唤出侧边栏；侧边栏正常停靠的桌面端不显示（不回退 v5.0「移除冗余 ≡ 按钮」的决定），kiosk-mode 保持隐藏（与原生行为一致）
- **修复了 768–870px 窗口宽度的盲区** — 此区间 HA 已把侧边栏变为抽屉，但面板此前不显示菜单按钮（面板旧阈值 768px 与 HA 的 870px 不一致）
- **No escape from panel when sidebar hidden ([#29](https://github.com/C3H3-AI/hacs-vision/issues/29))** — The panel header menu button now shows under the same conditions as native HA panels: narrow viewport (HA threshold 870px) or when the sidebar dock mode is `always_hidden`; clicking dispatches `hass-toggle-menu` to reopen the sidebar. Stays hidden on desktop with a docked sidebar (respecting v5.0's removal of the redundant ≡ button), and stays hidden in kiosk-mode (native behavior)
- **Fixed the 768–870px blind spot** — HA already turns the sidebar into a drawer in this range, but the panel's menu button did not show (old panel threshold 768px vs HA's 870px)

### ⌨️ 改进 / Improved

- **Escape 统一逃逸链** — Escape 现在能可靠关闭所有弹窗（Issue 提交 → 确认框 → 配置流 → 卡片预览 → 条目选择 → 仓库详情，按层级每次关一层）；集成管理视图的三个弹窗新增 window 级 Escape 监听，焦点不在弹窗内也能关闭
- **Unified Escape chain** — Escape now reliably closes every modal (issue dialog → confirm → config flow → card preview → entry selector → repo detail, top-most first); the integrations view dialogs gained window-level Escape handling that works even when focus is outside the overlay

### 🧹 清理 / Cleanup

- **移除 v5.0 废弃的 iframe 测试弹窗死代码**（`_renderTestIframe`，自 v5.0 起无任何调用点）
- **Removed dead iframe test dialog code** (`_renderTestIframe`, unreferenced since v5.0)

## v6.6.2 (2026-09-09) — 侧边栏逃逸通道修复 / Sidebar Escape Hatch (#29)

### 🔧 修复 / Fixed

- **侧边栏隐藏后无法离开面板 ([#29](https://github.com/C3H3-AI/hacs-vision/issues/29))** — 面板头部菜单按钮（汉堡）的显示条件与原生 HA 面板对齐：窄屏（HA 阈值 870px）或侧边栏被设为「始终隐藏」（`dockedSidebar: always_hidden`）时显示，点击派发 `hass-toggle-menu` 唤出侧边栏；侧边栏正常停靠的桌面端不显示（不回退 v5.0「移除冗余 ≡ 按钮」的决定），kiosk-mode 保持隐藏（与原生行为一致）
- **修复了 768–870px 窗口宽度的盲区** — 此区间 HA 已把侧边栏变为抽屉，但面板此前不显示菜单按钮（面板旧阈值 768px 与 HA 的 870px 不一致）
- **No escape from panel when sidebar hidden ([#29](https://github.com/C3H3-AI/hacs-vision/issues/29))** — The panel header menu button now shows under the same conditions as native HA panels: narrow viewport (HA threshold 870px) or when the sidebar dock mode is `always_hidden`; clicking dispatches `hass-toggle-menu` to reopen the sidebar. Stays hidden on desktop with a docked sidebar (respecting v5.0's removal of the redundant ≡ button), and stays hidden in kiosk-mode (native behavior)
- **Fixed the 768–870px blind spot** — HA already turns the sidebar into a drawer in this range, but the panel's menu button did not show (old panel threshold 768px vs HA's 870px)

### ⌨️ 改进 / Improved

- **Escape 统一逃逸链** — Escape 现在能可靠关闭所有弹窗（Issue 提交 → 确认框 → 配置流 → 卡片预览 → 条目选择 → 仓库详情，按层级每次关一层）；集成管理视图的三个弹窗新增 window 级 Escape 监听，焦点不在弹窗内也能关闭
- **Unified Escape chain** — Escape now reliably closes every modal (issue dialog → confirm → config flow → card preview → entry selector → repo detail, top-most first); the integrations view dialogs gained window-level Escape handling that works even when focus is outside the overlay

### 🧹 清理 / Cleanup

- **移除 v5.0 废弃的 iframe 测试弹窗死代码**（`_renderTestIframe`，自 v5.0 起无任何调用点）
- **Removed dead iframe test dialog code** (`_renderTestIframe`, unreferenced since v5.0)

## v6.6.1 (2026-09-02) — 俄语翻译修复 / Russian Changelog Translations

- 修复俄语更新日志缺失的翻译条目（仅文档，manifest 版本号未随之更新，于 v6.6.2 补齐）
- Fixed missing Russian changelog translations (docs-only; manifest version was left at 6.6.0 and corrected in v6.6.2)

## v6.6.0 (2026-08-20) — 俄语本地化 / Russian Localization

### 🌐 国际化 / Internationalization

- **新增俄语完整本地化支持** — 添加 `ru` 语言到语言选择器，自动检测 `ru`, `ru-RU`, `ru-BY`, `ru-KZ`, `ru-KG` 区域设置
- **俄语翻译全覆盖** — 625/625 前端 i18n 翻译键 + 26/26 HA 配置流翻译键，感谢 @BrainDeLook 的贡献
- **新增俄语 README** — 完整的俄语文档，包含安装、配置、使用说明和更新日志
- **响应式布局修复** — 语言选择和设置区域改用响应式网格布局，解决长翻译标签溢出问题
- **语言选择器修复** — 修复页面重载后语言选择器显示错误的问题，动态语言选项现在会正确选择有效语言

### PR [#27](https://github.com/C3H3-AI/hacs-vision/pull/27)

## v6.5.5 (2026-08-02) — XSS 安全修复 / XSS Security Fix

### 🛡️ 安全 (Security)

- **修复 README XSS 漏洞 (V-003, HIGH)** — 后端获取 GitHub 渲染的 README HTML 后经过 DOMPurify 消毒再返回前端，防止恶意仓库作者注入脚本。感谢 @anupamme 的贡献
- **Fixed README XSS vulnerability (V-003, HIGH)** — Backend now sanitizes GitHub's rendered README HTML via DOMPurify before returning to the frontend, preventing malicious repository authors from injecting scripts. Thanks to @anupamme for the contribution

## v6.4.3 (2026-07-16) — 服务补全 & 可移植性优化

### ✨ 改进

- **auto_update 服务定义补全** — 补全 `auto_update_start` / `auto_update_stop` / `auto_update_trigger` / `auto_update_reload_settings` 四个服务，开发者工具中现可看到名称与描述
- **截图地址生成优化** — 截图 URL 兜底逻辑改为按 HA 配置的 external/internal URL 动态派生基地址，提升跨环境可移植性
- **降低 HACS 内部耦合** — 部分内部调用由 `self._hacs.hass` 改为 `self.hass`，减少私有 API 依赖

### 🧹 清理

- **移除未使用的 Gitee 模块** — 删除从未被引用的 `api_mixins/gitee.py`，精简代码体积
- **清理冗余翻译** — 移除 `zh-Hans.json` 中无对应 OptionsFlow 的 `options` 段

## v6.4.1 (2026-07-06) — 兼容修复 & 安全增强

### 🔧 修复

- **自定义仓库识别修复** — 改用 `is_default()` 判断自定义仓库，兼容 HACS 2.0 移除 `custom_repositories` 字段
- **集成管理视图不显示** — 配置条目缓存强制刷新（`force_refresh=True`），新添加的集成立即可见
- **同步选中仓库报 500** — 兼容字符串和对象两种数据格式，前后端统一处理
- **仓库同步后找不到** — 简化 `_ensure_custom_repos_registered`，依赖 HACS 自身注册机制

### 🛡️ 安全

- **API 安全增强** — 配置和设置白名单过滤、参数校验、语言参数防路径遍历
- **OAuth 不再返回 token** — 消除 token 泄露风险

## v6.4.0 (2026-07-06)

### ✨ 新功能

- **搜索+添加仓库合一** — 商店和仓库管理视图的搜索框直接支持添加仓库：输入 `owner/repo` 或 GitHub URL 自动显示内联添加栏，输入组织名自动加载仓库列表供批量勾选添加。移除独立的「+ 添加仓库」按钮和表单
- **搜索能力增强** — 所有视图搜索统一支持 GitHub URL 解析、作者名搜索、组织名搜索
- **详情弹窗仓库名可点击** — 详情弹窗中的仓库名（如 `C3H3-AI/hacs-vision`）变为可点击链接，直接跳转到 GitHub 仓库页面
- **提示词更新** — 搜索框占位提示改为「搜索或添加仓库...」，一目了然

### 🔧 修复

- **自定义仓库注册失败** — `add_custom_repository` 使用 `check=False` 避免 GitHub API 限流/网络波动导致仓库注册失败（[hacs_operator.py#L829](https://github.com/C3H3-AI/hacs-vision/blob/main/custom_components/hacs_vision/hacs_operator.py#L829)）

## v6.3.0 (2026-07-05)

### ✨ 新功能

- **更新历史记录系统 (HACSHubHistory)** — 新增后端历史记录管理器，自动记录每次仓库更新的版本变更（from→to），保留30天自动清理，通过 `GET /api/hacs_vision/history` 查询
- **安装进度条** — 后端新增安装进度追踪机制，更新时前端卡片展示实时百分比进度条，覆盖单仓库更新和全部更新场景
- **更新页面区段重构** — 页面拆分为「可更新」「已更新」「已略过」三个可折叠区段，默认展开可更新区段，结构更清晰
- **批量操作栏** — 更新页面新增底部批操作栏，支持批量更新和批量移除，一键操作多个仓库
- **更新历史卡片** — 已更新区段以卡片列表展示，包含仓库头像、名称、版本变化、相对时间（刚刚/n分钟前/n小时前/n天前）

### 🔧 修复

- **更新进度状态丢失** — `install_version` 和 `async_install` 后正确设置完成状态并清理临时进度记录

### 📦 配置

- 新增 storage 路径：`.storage/hacs_vision_update_history.json`

### 🌐 翻译

- 新增 13 个翻译 key（zh/en/de），覆盖区段标题、历史记录和时间显示

## v6.2.1 (2026-07-04)

### ✨ 新功能

- **预约重启** — 设置面板新增时间选择器，自动更新安装完成后在指定时间（如凌晨 3 点）重启 HA 使更新生效，不留空则不重启
- **白名单弹窗分页** — 设置面板白名单改为按钮 + 模态弹窗方式，弹窗内分页展示候选仓库（15条/页），搜索、chips、全选/取消全选、保存/取消
- **HACS 数据刷新** — 自动更新周期开始前先刷新 HACS 仓库数据，确保获取最新版本信息，不再漏更新

### 🔧 修复

- **设置被覆盖** — `_update_settings` 改为合并保存 `{**existing, **body}`，避免 browse/updates 页面只传 `auto_update_repos` 时丢弃 `hide_hacs_panel` 等其他设置
- **前端缓存加载保护** — 设置页面加载时添加 `_installedLoaded` 标志，防止无限加载

## v6.2.0 (2026-07-04)

### ✨ 新功能

- **自动更新调度引擎 (AutoUpdateManager)** — 新增后端自动更新模块，支持定时检查并自动更新 HACS 仓库
  - 白名单机制：仅更新用户明确选中的仓库
  - 非重叠运行：前后周期自动跳过，避免冲突
  - 持久通知：每次更新结果通过 HA 通知送达，固定 ID 防止堆积
  - 最小间隔保护：限制最短 10 分钟，防止 API 滥用
  - 4 个 HA 服务：`auto_update_start` / `auto_update_stop` / `auto_update_trigger` / `auto_update_reload_settings`
  - 启动初始延迟 60s，避免 HA 启动时爆发请求
  - 新增 `_coalescing` 标志，消除 trigger() 与 coalesced task 的竞态条件
- **前端设置面板** — 设置页面新增「自动更新」配置区域
  - 开关：启用/禁用自动更新
  - 间隔选择：1h / 3h / 6h / 12h / 24h
  - 通知开关：控制是否发送 HA 通知
  - 白名单管理：搜索过滤 + 复选框勾选已安装仓库（支持全选/取消全选）
  - 操作按钮：立即检查和重载设置
  - 状态指示：实时显示调度状态（运行中/已调度/未运行），通过 HA event bus 与后端同步
- **商店仓库卡片** — 浏览商店时，已安装仓库的底部操作栏新增自动更新开关按钮
  - 乐观更新：点击即切换，API 失败自动回滚
  - 绿色高亮表示已开启，灰色表示关闭
- **更新页面** — 更新页面仓库卡片和列表视图均新增自动更新开关按钮，覆盖正常状态和待重启状态
- **HA event bus 状态同步** — 后端 `_dispatch_state()` 同时触发 `async_dispatcher_send` 和 `hass.bus.async_fire`，前端 config-view 通过 `subscribeEvents` 实时监听调度状态

### 🔧 修复

- **`_running` 永不重置** — `get_settings()` 移入 `try` 块，确保任何异常都能正确重置 `_running = False`
- **通知堆积** — 固定 `notification_id = "hacs_vision_auto_update"`，新通知自动覆盖旧通知，不会重复创建
- **`_cancel_interval` 兼容性** — 增加 `hasattr(x, 'cancel')` 检查，同时支持 `TimerHandle` 和 callable 两种类型
- **`trigger()` 排队反馈** — 返回 `{"queued": true}` 标志，前端显示排队提示而非错误
- **`_onAutoUpdateRepos` 死代码清理** — 删除 config-view 中废弃的 textarea 白名单编辑方法

### 📦 配置

- 新增 settings 字段：`auto_update_enabled`（默认关闭）、`auto_update_repos`（白名单列表）、`auto_update_interval`（默认 6 小时）、`auto_update_notify`（默认开启）

### 🌐 翻译

- 新增 29 个翻译 key（zh/en/de），覆盖自动更新 UI 全字段

## v6.1.0 (2026-07-02)

### 🔧 修复

- **register_static_path 兼容性** — 完全移除了该冗余调用，sidebar-badge.js 通过已有的 HACSEnhancedStaticView 提供服务，兼容无 register_static_path 方法的旧版 HA
- **pending_restart 兼容性** — 某些 HACS 版本的 RepositoryData 没有 pending_restart 属性，改用 getattr() 安全取值

### ♻️ 重构

- **Phase 3：api.py 架构拆分** — 2001 → 349 行，按职责拆分为 3 个 Mixin（GitHubAuthMixin、GitHubActionsMixin、HACSOpsMixin）

## v6.0.1 (2026-07-02)

### 🔧 修复

- **Sidebar badge 认证问题** — 从 HTTP fetch 迁移到 HA WebSocket 获取更新数，彻底消除无认证请求导致的 Login attempt 警告日志
- **XSS 安全漏洞** — 对用户输入内容进行 DOMPurify 消毒，防止跨站脚本攻击
- **错误信息消毒** — 错误消息中的用户敏感信息（token、路径等）做脱敏处理

### ♻️ 重构

- 提取共享 CSS 样式，减少代码重复
- 优化 Config Flow 对话框逻辑

### 📦 其他

- 添加 WebSocket handler `hacs_vision/updates`（后端注册，前端 sidebar-badge 和 panel 共享）
- 更新 README 和 hacs.json 配置

## v6.0.0 (2026-06-23)

- 初始发布
- HACS 增强管理面板
- GitHub OAuth 认证
- 批量更新/安装/移除
- 配置流集成支持
- 实体引用查找和替换