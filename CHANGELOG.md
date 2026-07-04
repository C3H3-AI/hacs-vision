# Changelog

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