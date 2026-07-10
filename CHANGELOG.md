# Changelog

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