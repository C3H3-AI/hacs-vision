# HACS Vision

[![HACS Validation](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml/badge.svg)](https://github.com/C3H3-AI/hacs-vision/actions/workflows/validate.yml)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Downloads](https://img.shields.io/github/downloads/C3H3-AI/hacs-vision/total)](https://github.com/C3H3-AI/hacs-vision/releases)
[![Stars](https://img.shields.io/github/stars/C3H3-AI/hacs-vision)](https://github.com/C3H3-AI/hacs-vision/stargazers)
[![License](https://img.shields.io/github/license/C3H3-AI/hacs-vision)](LICENSE)

[![中文](https://img.shields.io/badge/lang-zh--CN-blue.svg)](README.md)
[![English](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)
[![Deutsch](https://img.shields.io/badge/lang-de-green.svg)](#)

> **Aktuelle Version**: v6.4.1 | **Minimale HA-Version**: 2024.1.0

> **⚠️ Voraussetzung**: [HACS](https://hacs.xyz) muss installiert und konfiguriert sein.

---

## Einführung

**HACS Vision** ist ein modernes visuelles Panel für HACS mit integrierter Shop-Oberfläche. Durchsuchen, installieren, aktualisieren und verwalten Sie Home-Assistant-Integrationen, Plugins und Themes wie in einem App Store. Konfigurieren Sie jede HA-Integration (Config Flow / Options Flow) direkt im Panel – mit automatischer deutscher Lokalisierung.

---

## Funktionen

- **🛒 Shop-Durchsuchen** — Suche, Kategorie-Filter, mehrdimensionale Sortierung, Favoriten. Karten-/Listenansicht, **Filter+Sortierung in einer Zeile**. Filterung nach **Favoriten**. Versionsauswahl mit Changelog-Vorschau
- **⭐ Repository-Star** — Lokale Favoriten und GitHub-Stars unabhängig voneinander. Ein-Klick Star/Unstar
- **🔑 GitHub-Anmeldung** — Eigenständige Token-Eingabe in den Einstellungen, getrennter Speicher, automatische Login-Wiederherstellung
- **📦 Batch-Repo-Hinzufügen** — GitHub-Organisations-/Benutzer-URL eingeben, alle Repositorys auflisten und per Auswahlbox hinzufügen
- **🔄 Update-Verwaltung** — Alle ausstehenden Updates mit Fortschrittsverfolgung, einzeln oder stapelweise. **Ignorieren** unerwünschter Repositorys
- **📦 Repo-Verwaltung** — Verwaltung installierter Repos, Versionshistorie, **erneuter Download** (fehlerhafte Installationen reparieren) oder entfernen. **Status/Typ/Repo**-Dreifachfilter + Sortierung
- **⚙️ Integrationskonfiguration** — Options Flow jeder installierten HA-Integration direkt im Panel konfigurieren (z. B. xiaomi_home, xiaomi_miot, haier), mit automatischer deutscher Lokalisierung
- **🔌 Integration hinzufügen** — HA-Config-Flow direkt aus dem Panel starten
- **📊 Statistiken** — Echtzeit-Anzeige von installierten/aktualisierbaren/Favoriten-Zahlen
- **🔔 Benachrichtigungen** — Automatische Benachrichtigung bei verfügbaren Updates, optimiertes Caching
- **📱 Responsives Design** — Für Desktop und Mobil optimiert, 44px Touch-Ziele
- **🧩 Integrationsverwaltung** — Kartenraster aller installierten Integrationen mit deutscher Suche, Statusfilter, Kategoriegruppierung
- **🔍 Geräte- & Entität-Drilldown** — Integrationskarte klicken → nach Bereich gruppierte Geräteliste → Echtzeit-Entitätsstatus & -Attribute
- **🎮 Ein-Klick-Entitätssteuerung** — Schalter, Lampen, Schlösser, Jalousien, Lüfter direkt im Panel steuern
- **🏷️ Deutsche Namensübersetzung** — Automatische Anzeige deutscher Namen für offizielle & benutzerdefinierte Integrationen
- **🎨 Symbole** — CDN → lokales Symbol → Erstbuchstabe-Fallback, dreistufiges Laden
- **🔗 EntityRefFinder** — Alle Verweise auf eine Entity-ID in HA finden (Automationen, Skripte, Szenen, Dashboards), mit Ein-Klick-Ersetzung
- **🔄 Erneuter Download** — Ein-Klick-Neuinstallation für installierte Repos (Deinstallation + Neuinstallation) zur Reparatur defekter Installationen
- **⛔ Repo ignorieren** — Repositorys zur Ignorierliste hinzufügen, aus Suchergebnissen und Update-Benachrichtigungen ausblenden
- **🖼️ Konfigurationsseite einbetten** — Integrationskarte klicken, um native HA-Konfigurationsseite im Iframe-Modal zu öffnen, Doppelklick für Vollbild
- **🧩 Config-Flow-Formular** — Dropdown-Menü als Radio-Buttons mit Weiter-Button dargestellt, intuitivere Konfiguration
- **🤖 Automatische Updates** — Geplante Hintergrundupdates mit Whitelist, konfigurierbare Intervalle (1h/3h/6h/12h/24h), Update-Benachrichtigungen, Pro-Repo-Schalter

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

### Über HACS-Benutzerrepository installieren (Empfohlen)

> ⚠️ **HACS Vision ist NICHT im standardmäßigen HACS-Store enthalten** und kann nicht über die Storesuche installiert werden. Fügen Sie dieses Repository über „Benutzerdefinierte Repositorys“ mit der unten stehenden URL hinzu.

1. Stellen Sie sicher, dass [HACS](https://hacs.xyz) installiert ist
2. Gehen Sie zu **HACS → Integrationen → Benutzerdefinierte Repositorys** (Menü oben rechts)
3. Fügen Sie die Repository-URL hinzu: `https://github.com/C3H3-AI/hacs-vision`
4. Kategorie: **Integration**
5. Klicken Sie auf **Installieren**
6. **Home Assistant neu starten**

### Manuelle Installation

1. Laden Sie die neueste [Version](https://github.com/C3H3-AI/hacs-vision/releases) herunter
2. Kopieren Sie das Verzeichnis `custom_components/hacs_vision` in das `custom_components/`-Verzeichnis von HA
3. Starten Sie Home Assistant neu

---

## Konfiguration

1. Gehen Sie zu **Einstellungen → Geräte & Dienste → Integration hinzufügen**
2. Suchen Sie nach **HACS Vision**
3. Klicken Sie auf **Absenden** (keine zusätzliche Konfiguration erforderlich)
4. Das Panel erscheint in der Seitenleiste

---

## Verwendung

### 🛒 Shop

Durchsuchen Sie alle verfügbaren HACS-Repositorys. Filtern Sie mit der Suchleiste und den kombinierten Filter-Chips (Status/Tags/Typ/Sortierung in einer Zeile). Klicken Sie auf das Herz-Symbol, um Favoriten zu setzen. Erneuter Download und Ignorieren möglich. Zwischen Karten- und Listenansicht umschaltbar.

### 🔄 Aktualisierungen

Zeigt alle Repositorys mit ausstehenden Updates an. Verwenden Sie **Alle aktualisieren** für ein Upgrade aller Repositorys oder **Auswahl aktualisieren** für bestimmte. Stapelverarbeitung unterstützt.

### 📦 Verwaltung

Verwalten Sie installierte Repositorys mit **Status** (installiert/aktualisierbar/nicht installiert), **Typ** (Integration/Plugin/Theme) und **Repo** (alle/archiviert/unbenannt/ignoriert) Dreifachfilter + Sortierung. Stapelverarbeitung unterstützt. Archivierte und umbenannte Repositorys werden als Karten mit Aktionsschaltflächen unten angezeigt.

### 🧩 Integrationsverwaltung

Durchsuchen Sie alle installierten HA-Integrationen in einem Kartenraster mit deutscher Namenssuche, Statusfilter und Stapeloperationen. **Karte klicken**, um die native HA-Konfigurationsseite zu öffnen (Iframe-eingebettet, Seitenleiste per CSS beschnitten), Doppelklick für Vollbild. Die Schaltfläche **⚙ Konfigurieren** öffnet den Options-Flow-Dialog mit automatischer deutscher Übersetzung.

### ⚙️ Einstellungen

Konfigurieren Sie das Panel-Verhalten, prüfen Sie Versionsinformationen, starten Sie HA neu oder fügen Sie neue HA-Integrationen hinzu.

---

## Änderungsprotokoll

### v6.4.0 (2026-07-06) — 搜索+添加仓库合一 / Search & Add Merged / Suche & Hinzufügen vereint
- **New**: 🔍 **搜索+添加仓库合一** — 商店和仓库管理视图的搜索框直接支持添加仓库：输入 owner/repo 或 GitHub URL 显示内联添加栏，输入组织名自动加载仓库列表供批量勾选。移除独立的「+ 添加仓库」按钮和表单
  — *Search & add merged: input owner/repo or GitHub URL → inline add bar; input org name → auto-load org repos for batch select. Removed standalone "+ Add Repo" button*
- **New**: 🎯 **搜索能力增强** — 所有视图搜索统一支持 GitHub URL 解析、作者名搜索、组织名搜索
  — *All views now support GitHub URL parsing, author search, and org name search*
- **New**: 🔗 **详情弹窗仓库名可点击** — 详情弹窗中的仓库名变为可点击链接，直接跳转 GitHub 仓库页
  — *Repo full_name in detail dialog is now a clickable link to GitHub*
- **Fix**: ✅ **自定义仓库注册失败** — `add_custom_repository` 使用 `check=False` 避免 GitHub API 限流导致仓库注册失败
  — *Fix custom repo registration: use check=False to bypass GitHub API rate limits*

### v6.3.0 (2026-07-05) — Three-Section Updates UI
- **New**: 🗂️ **三段式折叠更新页** — 可更新（默认展开）、已更新（默认折叠，近 30 天记录）、已略过（默认折叠），分类清晰
  — *Three collapsible sections: Updatable (expanded), Updated (collapsed, 30-day history), Skipped (collapsed)*
- **New**: 📜 **更新历史追踪** — 每次更新自动记录（仓库名、版本变更、时间），30 天自动清理，支持 API 查询
  — *Auto-record update history with repo name, version changes, and timestamp; 30-day auto-cleanup*
- **New**: ⏳ **实时更新进度** — 更新卡片显示进度条 + 百分比（5%→75%→100%），轮询实时刷新
  — *Real-time update progress bar with percentage, poll-based refresh*
- **Chore**: 版本号升级至 v6.3.0 / Version bump to v6.3.0

### v6.2.1 (2026-07-04) — 优化修复 / Optimization & Fixes
- **New**: 🕐 **预约重启** — 设置面板时间选择器，自动更新安装完成后在指定时间重启 HA，不留空不重启
  — *Scheduled restart: set a time (HH:MM) for HA to restart after updates are installed*
- **New**: 💬 **白名单弹窗分页** — 设置面板白名单改为按钮 + 模态弹窗，分页搜索、chips、全选/取消、保存/取消
  — *Whitelist in modal dialog with pagination, search, chips, select/deselect all, save/cancel*
- **New**: 🔄 **HACS 数据刷新** — 自动更新前先刷新 HACS 仓库数据，确保获取最新版本，不再漏更新
  — *Refresh HACS repository data before auto-update check to ensure latest versions*
- **Fix**: 🛡️ **设置合并保存** — 后端 `_update_settings` 改为 `{**existing, **body}` 合并，避免部分更新覆盖其他设置
  — *Merge settings instead of replace to prevent partial updates from discarding other settings*
- **Fix**: ⏳ **前端加载保护** — 添加 `_installedLoaded` 标志，防止无限加载状态
  — *Add loading guard flag to prevent infinite loading state*

### v6.2.0 (2026-07-04) — 自动更新 / Auto Update
- **New**: 🤖 **自动更新引擎** — 后台定时检测并自动安装白名单中的仓库更新。非重叠运行，Coalescing 防竞争。加载设置后 60 秒首次执行，随后按配置间隔周期性运行。双通道事件通知（`async_dispatcher_send` + `hass.bus.async_fire`），设置页面实时显示运行/已调度/已停止状态
  — *Background scheduler with non-overlapping execution, coalescing, 60s initial delay, configurable interval. Dual-channel event dispatch for real-time status display*
- **New**: 📋 **白名单管理** — 设置面板弹窗分页设置自动更新白名单，支持搜索、分页（15条/页）、chips 已选展示、全选/取消全选、保存/取消
  — *Whitelist in a modal dialog with pagination (15/page), search, chip display, select/deselect all, save/cancel*
- **New**: 🔘 **仓库级自动更新开关** — 商店浏览页面和更新页面每个仓库卡片上添加滑块开关，乐观更新 + API 失败自动回滚
  — *Per-repo auto-update toggle on browse and updates pages, with optimistic UI update and rollback on failure*
- **New**: ⏰ **可调检测频率** — 支持 1h / 3h / 6h / 12h / 24h 五种间隔
  — *Configurable check intervals: 1h/3h/6h/12h/24h*
- **New**: 🔔 **更新通知** — 自动更新完成后发送 HA 持久通知（可开关），固定通知 ID 防堆积
  — *HA persistent notification on completed auto-update, fixed notification ID to prevent stacking*
- **New**: 🛠️ **4 个后端服务** — `trigger_auto_update`（手动触发）、`reload_auto_update_settings`（重载设置）、`start_auto_update`/`stop_auto_update`（启停调度）
  — *4 backend services for manual trigger, reload, start/stop*
- **Chore**: 版本号升级至 v6.2.0 / Version bump to v6.2.0

### v6.0.0b1 (2026-07-01) — 架构拆分 Beta / Architecture Split Beta
- **New**: 🏗️ **api.py 拆分** — 3,717 行 api.py 拆分为 `api.py` + `api_config_flow.py` + `api_repos.py`，通过 Mixin 组合继承
  — *api.py split into 3 files via Python mixin inheritance — 3,717→1,978 lines*
- **Fix**: 🌐 **语言切换全界面生效** — 解决切换语言后筛选栏/列头不刷新的问题，选项数组改为语言变化时重建
  — *Language switch now applies to ALL UI elements — filter chips, column headers, and sort labels*
- **Fix**: 🐛 **3 个翻译键补全 + 1 个拼写修正** — `loadingUpdates`/`processing`/`inputRepoPlaceholder` 新增，`verifing`→`verifying`
  — *Fixed 3 missing translation keys + 1 typo*
- **Fix**: 🐛 **6 处硬编码中文替换** — repo-card/browse/management/integrations-list 中硬编码中文改为 `t()` 调用
  — *Replaced 6 hardcoded Chinese strings with t() calls*
- **Fix**: 🔄 **导航时语言切换即时刷新** — 子视图监听 `hacs-lang-changed` 事件，确保切换 Tab 后文字仍为所选语言
  — *Child views re-render immediately on language change, even across tab switches*
- **Docs**: 📖 **README 三语化** — 全部章节新增德语版本
  — *README now trilingual (zh/en/de)*
- **Chore**: 版本号升级至 v6.0.0b1 / Version bump to v6.0.0b1

### v6.0.0b0 (2026-06-30) — 多语言 Beta / Multilingual Beta
- **New**: 🌍 **多语言支持架构** — 重构 i18n 引擎，语言检测从二元硬编码升级为可扩展映射表 (`LANG_MAP`)
  — *Multi-language engine — language detection upgraded from hardcoded binary to extensible LANG_MAP*
- **New**: 🇩🇪 **德语翻译** — 由社区贡献者支持，200+ 前端键完整翻译 + 后端 `de.json`
  — *German (de) translations — 200+ frontend keys + backend de.json*
- **New**: 🔠 **设置页语言选择器** — 可在设置页手动选择语言，覆盖 HA 系统语言检测
  — *Language selector in settings — manual override for HA system language*
- **New**: 🧩 **第三方语言扩展** — 新语言只需 2 步：加 `LANG_MAP` 映射 + 写翻译键。零代码改检测逻辑
  — *Third-party language extension — 2 steps: LANG_MAP entry + translation keys. No detection logic changes*
- **Chore**: 版本号升级至 v6.0.0b0 / Version bump to v6.0.0b0

### v5.2.0 (2026-06-30) — 跳过版本 + 全面优化 / Skip Version + Full Optimization
- **New**: 🐛 **直接提交 GitHub Issue** — 在卡片和详情弹窗中一键提交 Issue，自动收集日志、系统信息、上传截图，支持 GitHub 截图粘贴
  — *One-click GitHub Issue submission from cards and detail modals, auto-collects logs, system info, screenshots*
- **New**: 🔕 **版本级跳过更新** — 支持跳过指定版本，下个新版本正常提醒。与 HA 原生 `update.skip`/`update.clear_skipped` 同步，Vision 面板 + HA 设置 → Updates 完全一致
  — *Skip specific versions, next version will re-notify. Synced with native HA `update.skip`/`update.clear_skipped`*
- **New**: 👁️ **已跳过更新面板** — 更新页筛选栏显示 `🔇 显示/隐藏已跳过更新 (N)`，点击展开/收起已跳过的版本卡片，支持"取消跳过"
  — *Skipped versions panel in Updates view with show/hide toggle, unskip support*
- **New**: ⚡ **Updates 数据源切到 HA 实体** — 从 HA 状态机直接读取 `update.*` 实体，替代 HACS 内部 API。更实时、更准确。HACS 降级备用
  — *Reads update data directly from HA state machine (`update.*` entities) instead of HACS internal API. Faster, more accurate*
- **New**: 🏷️ **批量跳过** — 勾选多个仓库后，操作栏增加"批量跳过"按钮
  — *Batch skip button for selected repositories*
- **Optimize**: 📦 **商店/仓库管理同步跳过** — 所有列表接口交叉检查 HA 实体跳过状态，已跳过的仓库不再显示更新按钮
  — *All list endpoints cross-check HA entity skip state; skipped repos no longer show update button*
- **Optimize**: 🔄 **HA 重启可靠性** — 修复 Supervisor 作业卡死导致重启失败的问题。改用 `docker restart homeassistant` 绕开卡住的 Supervisor 作业
  — *Fixed HA restart reliability — uses `docker restart homeassistant` to bypass stuck Supervisor jobs*
- **Optimize**: 📋 **Issue 弹窗清理** — 删除废弃的 `_showIssueDialog` Lit 模板代码，统一使用 `_handleIssueReport`。日志预览改为可编辑 `textarea`
  — *Cleaned up dead issue dialog code, unified to `_handleIssueReport`, editable log preview*
- **Fix**: 🐛 **跳过版本 500 错误** — `release_url` 可能为 `None` 导致 `None.startswith()` 异常
  — *Fixed 500 error when `release_url` is `None` causing `None.startswith()` crash*
- **Fix**: 🐛 **跳过版本后更新数不变** — 排除 `pending_restart` 仓库
  — *Fixed update count not updating — excludes `pending_restart` repos*
- **Fix**: 🐛 **跳过卡片渲染中断** — `<img>` + `@error` 破坏 Lit 渲染管道，改用纯文字首字母头像
  — *Fixed skipped card render crash — removed `<img>` + `@error` that broke Lit rendering*
- **Chore**: 版本号升级至 v5.2.0 / Version bump to v5.2.0

### v5.1.0 (2026-06-21) — 优化版
- **New**: 📊 **集成卡片显示设备/实体数** — 每个集成卡片、列表行展示设备和实体数量
- **New**: ⭐ **GitHub 登录自动星标** — Token/OAuth/HACS 导入后自动星标本仓库
- **New**: 🏷️ **侧边栏+标题图标统一** — 全部使用 `hacs:hacs` 图标，去掉蓝底背景
- **Fix**: 🧹 **清理 130+ 冗余 fallback** — 移除所有 `|| '中文'` 无效回退，信任 i18n 层
- **Fix**: 🌐 **补充 5 个缺失 i18n 键** — githubTokenRequired, pendingRestart, selectAction, zoom, restarting
- **Fix**: 🎨 **emoji 统一为 SVG 图标** — 设置页 GitHub/OAuth 区域 emoji 替换
- **Fix**: 🎨 **硬编码颜色改为 CSS 变量** — `#f44336` → `var(--error-color)` 等
- **Fix**: 🔔 **默认视图变更提示** — 选择后弹出 Toast 提示保存成功
- **Fix**: 🖼️ **集成图标 avatar 重构** — 使用生命周期 + RAF + complete 兜底，弹窗与卡片图标统一
- **Fix**: 🎨 **28 处 inline style → CSS 工具类** — config-view GitHub 区域
- **Chore**: 版本号升级至 v5.1.0

### v5.0.1 (2026-06-21) — 补丁版
- **New**: 🔑 **OAuth 无痕登录** — 通过 GitHub OAuth 设备流直接授权，无需手动输入 Token，与 HACS 共用 Client ID
- **New**: 🚀 **OAuth 绕过 SSRF** — 使用独立 aiohttp session，不被 HA SSRF 中间件拦截，不再断连
- **New**: 👥 **组织/用户仓库开放使用** — 无需登录即可输入组织名列出仓库，GitHub 公开 API 直接访问
- **New**: ⚡ **设置即时保存** — 修改刷新间隔、默认视图后自动保存并提示，去掉保存按钮
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
- **Fix**: 🔒 **HA 主题同步** — Light DOM 测试后回退，CSS 变量方案继续使用
- **Chore**: 版本号升级至 v4.1.0
- **Refactor**: 🧹 移除测试按钮和 WS 配置流表单原型代码
- **Perf**: 📦 原详情树视图条件渲染，零性能开销

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

## Projektstruktur

```
hacs-vision/
├── custom_components/hacs_vision/    # HA-Integration (Produktionscode)
│   ├── __init__.py                    # Einstiegspunkt — Panel-Registrierung, API-Routen
│   ├── api.py                         # REST-API — Store, Installation, Config Flow, Übersetzungen
│   ├── hacs_operator.py               # HACS-Operationsebene — Installieren/Aktualisieren/Entfernen
│   ├── hacs_data.py                   # Datenebene — Repo-Index, Favoriten, Einstellungen
│   ├── config_flow.py                 # HA-Config-Flow
│   ├── backup.py                      # Backup/Wiederherstellung
│   ├── dependency_checker.py          # Abhängigkeitsprüfung
│   ├── entity_ref_finder.py           # Entity-ID-Referenzsuche und -Ersetzung
│   ├── const.py                       # Konstanten (VERSION, Speicherpfade usw.)
│   ├── frontend/                      # Frontend-Build-Artefakte
│   │   ├── panel.js                   # IIFE-Einzeldatei
│   │   └── index.html                 # iframe-Einstieg
│   ├── translations/                  # Übersetzungen dieser Integration selbst
│   │   ├── zh-Hans.json
│   │   └── en.json
│   └── brand/                         # Markenressourcen
├── frontend_src/                      # Frontend-Quellcode (Lit Element)
│   ├── src/                           # Komponentenquellcode
│   │   ├── hacs-vision-panel.js       # Hauptpanel
│   │   ├── api.js                     # Frontend-API-Client
│   │   ├── i18n.js                    # Frontend-Internationalisierung
│   │   ├── components/                # Unterkomponenten
│   │   │   ├── config-flow-dialog.js  # Config-Flow-Dialog (mit Übersetzungs-Engine)
│   │   │   └── repo-card.js           # Repo-Karte
│   │   ├── views/                     # Einzelansichten
│   │   │   ├── browse.js
│   │   │   ├── updates.js
│   │   │   ├── management.js
│   │   │   ├── integrations-list.js   # Integrationsverwaltungsansicht (v2.3.0)
│   │   │   └── config-view.js
│   │   └── shared/                    # Gemeinsame Werkzeuge
│   ├── package.json
│   └── rollup.config.js
├── assets/                            # Screenshots usw.
├── hacs.json                          # HACS-Metainformationen
└── README.md
```

---

## Entwicklung

### Frontend-Build

```bash
cd frontend_src
npm install
npm run build
```

Die Build-Artefakte werden in `custom_components/hacs_vision/frontend/` ausgegeben.

### Übersetzungsmechanismus

Die Übersetzung im Konfigurationsdialog erfolgt über die Backend-API `/api/hacs_vision/translations/{domain}?lang=de`, die die Übersetzungsdateien aus dem Verzeichnis `custom_components/{domain}/translations/` jeder Integration liest. Die Frontend-Methode `_t()` passt sich automatisch an die duale Config/Options-Schlüsselstruktur von HA an.

---

## FAQ

**F: Was ist der Unterschied zwischen HACS und HACS Vision?**
A: HACS Vision ist ein modernes visuelles Frontend-Panel für HACS. Es ersetzt HACS nicht, sondern nutzt HACS als Backend.

**F: Kann ich Repositorys aus HACS Vision installieren?**
A: Ja. Durchsuchen Sie den Shop und klicken Sie auf Installieren.

**F: Warum werden Felder im Konfigurationsdialog auf Englisch angezeigt?**
A: Die Übersetzung hängt davon ab, ob der Integrationsautor eine `de.json`-Datei bereitgestellt hat. Manche Autoren schreiben weiterhin Englisch in ihren Übersetzungsdateien – das ist normales Verhalten.

**F: Das Panel zeigt "HACS not available" an?**
A: Stellen Sie sicher, dass HACS korrekt installiert und konfiguriert ist.

**F: Wie aktualisiere ich HACS Vision?**
A: Bei Installation über HACS erscheinen Updates auf der Update-Seite. Bei manueller Installation ersetzen Sie die Dateien durch die neueste Version.

---

## Support

- [Issue melden](https://github.com/C3H3-AI/hacs-vision/issues)
- [Diskussionen](https://github.com/C3H3-AI/hacs-vision/discussions)

## Lizenz

MIT License — siehe [LICENSE](LICENSE)

---

<p align="center">
  Mit ❤️ gemacht von <a href="https://github.com/C3H3-AI">C3H3-AI</a>
</p>
