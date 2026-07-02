# Changelog

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