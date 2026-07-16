/**
 * i18n module for HACS Vision
 * Extensible multi-language support with HA auto-detection + user override.
 *
 * Architecture:
 *   LANG_MAP  — maps HA / navigator language codes to our short codes
 *   LANGUAGES — available languages shown in settings UI
 *   _HA_LANG  — language auto-detected from HA (always tracked)
 *   _USER_LANG — user's manual override (null = auto-detect)
 *   _LANG     — effective language used for t() lookups
 *
 * Priority: _USER_LANG > _HA_LANG > 'en' (fallback)
 */

/* ── Language Mapping ──────────────────────────────────── */

const LANG_MAP = {
  zh: 'zh', 'zh-cn': 'zh', 'zh-hans': 'zh', 'zh-hant': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh',
  de: 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  en: 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en', 'en-ca': 'en',
};

let _HA_LANG = 'en';
let _LANG = 'en';
let _USER_LANG = null; // null = follow HA auto-detect

/**
 * Map a raw HA / navigator language code to our supported short code.
 * Falls back to 'en' if no mapping exists.
 */
function detectLang(raw) {
  if (!raw) return 'en';
  const key = raw.trim().toLowerCase();
  return LANG_MAP[key] || LANG_MAP[key.split('-')[0]] || 'en';
}

/* ── Initialisation ────────────────────────────────────── */

// Auto-detect on module load (browser / panel entry)
(function init() {
  try {
    const top = window.top || window.parent;
    const haEl = top?.document?.querySelector('home-assistant');
    if (haEl?.hass?.language) {
      _HA_LANG = detectLang(haEl.hass.language);
      _LANG = _HA_LANG;
      return;
    }
    const dl = top?.document?.documentElement?.lang || '';
    if (dl) {
      _HA_LANG = detectLang(dl);
      _LANG = _HA_LANG;
      return;
    }
  } catch (e) { /* cross-origin */ }
  try {
    _HA_LANG = detectLang(navigator.language);
    _LANG = _HA_LANG;
  } catch (e) { /* ignore */ }
})();

/* ── Available Languages (for settings UI) ─────────────── */

export function getAvailableLanguages() {
  return Object.keys(LANGUAGES).map(code => ({
    code,
    label: LANGUAGES[code].label,
    nativeLabel: LANGUAGES[code].nativeLabel,
  }));
}

export const LANGUAGES = {
  en: { label: 'English', nativeLabel: 'English' },
  zh: { label: 'Chinese', nativeLabel: '中文' },
  de: { label: 'German', nativeLabel: 'Deutsch' },
};

// Languages offered for README translation. `code` is sent to the backend;
// `key` is the i18n key for its display label. Keep in sync with
// SUPPORTED_TRANSLATION_LANGS in api_mixins/readme_translate.py.
export const TRANSLATION_LANGUAGES = [
  { code: 'zh', key: 'readmeLangZh' },
  { code: 'en', key: 'readmeLangEn' },
  { code: 'de', key: 'readmeLangDe' },
  { code: 'ja', key: 'readmeLangJa' },
  { code: 'ko', key: 'readmeLangKo' },
];

// Default set shown in the popup bar when the user hasn't configured any.
export const DEFAULT_TRANSLATION_LANGS = ['zh', 'en', 'de'];

/* ── Translation Data ──────────────────────────────────── */

const T = {
  // Header
  storeTitle: { zh: 'HACS Vision', en: 'HACS Vision', de: 'HACS Vision' },
  storeSubtitle: { zh: '浏览、管理和更新 HACS 仓库', en: 'Browse, manage and update HACS repositories', de: 'HACS-Repositorys durchsuchen, verwalten und aktualisieren' },
  statInstalled: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  statUpdates: { zh: '可更新', en: 'Updates', de: 'Updates' },
  statFavorites: { zh: '收藏', en: 'Favorites', de: 'Favoriten' },
  statCustom: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },
  statRepos: { zh: '仓库数', en: 'Repos', de: 'Repositorys' },

  // Tabs
  tabBrowse: { zh: '商店', en: 'Store', de: 'Shop' },
  tabFavorites: { zh: '收藏', en: 'Favorites', de: 'Favoriten' },
  tabCustom: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },
  tabInstalled: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  tabUpdates: { zh: '更新', en: 'Updates', de: 'Updates' },
  tabConfig: { zh: '配置', en: 'Config', de: 'Einstellungen' },
  tabBackup: { zh: '备份', en: 'Backup', de: 'Backup' },
  tabManagement: { zh: '仓库管理', en: 'Repository', de: 'Verwaltung' },
  tabIntegrations: { zh: '集成管理', en: 'Integrations', de: 'Integrationen' },

  // Browse
  searchPlaceholder: { zh: '搜索或添加仓库...', en: 'Search or add repositories...', de: 'Repositorys suchen oder hinzufügen...' },
  searchInstalled: { zh: '搜索已安装...', en: 'Search installed...', de: 'Installierte durchsuchen...' },
  searchUpdates: { zh: '搜索可更新的仓库...', en: 'Search for updates...', de: 'Nach Updates suchen...' },
  filterStatus: { zh: '状态', en: 'Status', de: 'Status' },
  filterType: { zh: '类型', en: 'Type', de: 'Typ' },
  filterTags: { zh: '标记', en: 'Tags', de: 'Tags' },
  repoStatus: { zh: '仓库状态', en: 'Repo Status', de: 'Repo-Status' },
  statusAll: { zh: '全部', en: 'All', de: 'Alle' },
  statusInstalled: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  statusNotInstalled: { zh: '未安装', en: 'Not Installed', de: 'Nicht installiert' },
  statusNotLoaded: { zh: '未加载', en: 'Not Loaded', de: 'Nicht geladen' },
  statusUpdateAvailable: { zh: '可更新', en: 'Update Available', de: 'Update verfügbar' },
  statusPendingRestart: { zh: '待重启', en: 'Pending Restart', de: 'Neustart ausstehend' },
  statusPendingReload: { zh: '待加载', en: 'Pending Reload', de: 'Neuladen ausstehend' },
  statusPendingUpgrade: { zh: '可更新', en: 'Update Available', de: 'Update verfügbar' },
  statusDefault: { zh: '未安装', en: 'Available', de: 'Verfügbar' },
  statusDisabled: { zh: '已禁用', en: 'Disabled', de: 'Deaktiviert' },
  typeAll: { zh: '全部', en: 'All', de: 'Alle' },
  typeIntegration: { zh: '集成', en: 'Integration', de: 'Integration' },
  typePlugin: { zh: '插件', en: 'Plugin', de: 'Plugin' },
  typeTheme: { zh: '主题', en: 'Theme', de: 'Theme' },
  typeTemplate: { zh: '模板', en: 'Template', de: 'Vorlage' },

  sortByStars: { zh: '按星数', en: 'By Stars', de: 'Nach Sternen' },
  sortByUpdated: { zh: '最近更新', en: 'Recently Updated', de: 'Kürzlich aktualisiert' },
  sortByName: { zh: '按名称', en: 'By Name', de: 'Nach Name' },
  sortByEntries: { zh: '按条目', en: 'By Entries', de: 'Nach Einträgen' },
  catAll: { zh: '全部', en: 'All', de: 'Alle' },
  catIntegration: { zh: '集成', en: 'Integration', de: 'Integration' },
  catPlugin: { zh: '插件', en: 'Plugin', de: 'Plugin' },
  catTheme: { zh: '主题', en: 'Theme', de: 'Theme' },
  catTemplate: { zh: '模板', en: 'Template', de: 'Vorlage' },
  catDashboard: { zh: '卡片', en: 'Cards', de: 'Karten' },
  catAppDaemon: { zh: 'AppDaemon', en: 'AppDaemon', de: 'AppDaemon' },
  catNetDaemon: { zh: 'NetDaemon', en: 'NetDaemon', de: 'NetDaemon' },
  catPythonScript: { zh: 'Python 脚本', en: 'Python Script', de: 'Python-Skript' },
  catCustom: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },
  totalRepos: { zh: '个仓库', en: 'repositories', de: 'Repositorys' },
  noMatch: { zh: '没有匹配的仓库', en: 'No matching repositories', de: 'Keine passenden Repositorys' },
  noMatchAdd: { zh: '未在 HACS 中找到此仓库，点击下方直接添加为自定义仓库', en: 'Not found in HACS, click below to add as custom repository', de: 'Nicht in HACS gefunden, klicken Sie unten, um als benutzerdefiniertes Repository hinzuzufügen' },
  addFromSearch: { zh: '添加为自定义仓库', en: 'Add as custom repository', de: 'Als benutzerdefiniertes Repository hinzufügen' },
  noData: { zh: '暂无仓库数据', en: 'No repository data', de: 'Keine Repository-Daten' },
  noDevicesOrEntities: { zh: '暂无设备或实体', en: 'No devices or entities', de: 'Keine Geräte oder Entitäten' },
  entityCount: { zh: '个实体', en: ' entities', de: ' Entitäten' },
  searching: { zh: '查找中...', en: 'Searching...', de: 'Suche...' },
  loading: { zh: '加载中...', en: 'Loading...', de: 'Lade...' },
  sort: { zh: '排序', en: 'Sort', de: 'Sortieren' },
  filterMore: { zh: '筛选与排序', en: 'Filter & Sort', de: 'Filter & Sortieren' },
  prevPage: { zh: '← 上一页', en: '← Previous', de: '← Zurück' },
  nextPage: { zh: '下一页 →', en: 'Next →', de: 'Weiter →' },
  page: { zh: '第', en: 'Page', de: 'Seite' },
  of: { zh: '/ ', en: ' / ', de: ' / ' },

  // Repo Card
  installed: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  install: { zh: '安装', en: 'Install', de: 'Installieren' },
  update: { zh: '更新', en: 'Update', de: 'Aktualisieren' },
  redownload: { zh: '重新下载', en: 'Redownload', de: 'Erneut herunterladen' },
  ignore: { zh: '忽略', en: 'Ignore', de: 'Ignorieren' },
  confirmIgnore: { zh: '确定要忽略 {repo} 吗？将不再出现在搜索结果和更新提醒中。', en: 'Ignore {repo}? It will no longer appear in search results or update notifications.', de: '{repo} ignorieren? Es wird nicht mehr in Suchergebnissen oder Update-Benachrichtigungen angezeigt.' },
  ignoreVersion: { zh: '跳过此版本', en: 'Skip this version', de: 'Diese Version überspringen' },
  unignoreVersion: { zh: '取消跳过此版本', en: 'Unskip this version', de: 'Überspringen rückgängig' },
  confirmIgnoreVersion: { zh: '确定跳过 {repo} 的 {version} 更新？下次新版本会正常提醒。', en: 'Skip {version} for {repo}? Next version will still notify.', de: '{version} für {repo} überspringen? Die nächste Version wird wieder benachrichtigt.' },
  remove: { zh: '卸载', en: 'Uninstall', de: 'Deinstallieren' },
  detail: { zh: '详情', en: 'Detail', de: 'Details' },
  noDesc: { zh: '暂无描述', en: 'No description', de: 'Keine Beschreibung' },
  favOn: { zh: '已收藏', en: 'Favorited', de: 'Favorisiert' },
  favOff: { zh: '收藏', en: 'Favorite', de: 'Favorisieren' },

  // Tag chips
  tagFavorites: { zh: '收藏', en: 'Favorites', de: 'Favoriten' },
  tagNew: { zh: '新发现', en: 'New', de: 'Neu' },
  tagCustom: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },

  // Card badges
  badgeConfigured: { zh: '已配置', en: 'Configured', de: 'Konfiguriert' },
  badgeLoadFailed: { zh: '加载失败', en: 'Load Failed', de: 'Laden fehlgeschlagen' },
  loadFailedSimple: { zh: '加载失败', en: 'Failed to load', de: 'Laden fehlgeschlagen' },
  loadingText: { zh: '加载中...', en: 'Loading...', de: 'Lade...' },
  adding: { zh: '添加中...', en: 'Adding...', de: 'Füge hinzu...' },
  addSelected: { zh: '添加选中', en: 'Add Selected', de: 'Auswahl hinzufügen' },
  addedToCustomList: { zh: '已添加到自定义列表', en: 'Added to custom list', de: 'Zur benutzerdefinierten Liste hinzugefügt' },

  // Installed
  canUpdate: { zh: '可更新', en: 'Updatable', de: 'Aktualisierbar' },
  allTypes: { zh: '全部类型', en: 'All Types', de: 'Alle Typen' },
  refresh: { zh: '刷新', en: 'Refresh', de: 'Aktualisieren' },
  noInstalled: { zh: '暂无已安装仓库', en: 'No installed repositories', de: 'Keine installierten Repositorys' },
  noMatchInstalled: { zh: '没有匹配的已安装仓库', en: 'No matching installed repos', de: 'Keine passenden installierten Repositorys' },
  totalInstalled: { zh: '个已安装仓库', en: 'installed repositories', de: 'installierte Repositorys' },
  confirmRemove: { zh: '确定要卸载 {repo} 吗？将删除仓库下载文件，已添加的集成配置不会被删除。', en: 'Uninstall {repo}? Repository files will be deleted. Existing integration config entries will NOT be deleted.', de: '{repo} deinstallieren? Repository-Dateien werden gelöscht. Bestehende Integrationskonfigurationen bleiben erhalten.' },
  removed: { zh: '已卸载', en: 'Uninstalled', de: 'Deinstalliert' },
  removeFailed: { zh: '卸载失败', en: 'Uninstall failed', de: 'Deinstallation fehlgeschlagen' },
  removing: { zh: '卸载中…', en: 'Uninstalling…', de: 'Deinstalliere…' },
  updating: { zh: '更新中...', en: 'Updating...', de: 'Aktualisiere...' },

  // Updates
  checkingUpdates: { zh: '检查更新...', en: 'Checking updates...', de: 'Prüfe Updates...' },
  allUpToDate: { zh: '所有仓库已是最新版本', en: 'All repositories are up to date', de: 'Alle Repositorys sind auf dem neuesten Stand' },
  totalUpdates: { zh: '个可更新仓库', en: 'repositories can be updated', de: 'Repositorys können aktualisiert werden' },
  updateAll: { zh: '全部更新', en: 'Update All', de: 'Alle aktualisieren' },
  updateSelected: { zh: '更新已选', en: 'Update Selected', de: 'Auswahl aktualisieren' },
  updateAllNow: { zh: '全部更新', en: 'Update All', de: 'Alle aktualisieren' },
  currentVersion: { zh: '当前版本', en: 'Current', de: 'Aktuell' },
  latestVersion: { zh: '最新版本', en: 'Latest', de: 'Neueste' },
  updateNow: { zh: '立即更新', en: 'Update Now', de: 'Jetzt aktualisieren' },
  confirmUpdateAll: { zh: '确定要更新全部 {n} 个仓库吗？', en: 'Update all {n} repositories?', de: 'Alle {n} Repositorys aktualisieren?' },
  confirmUpdateSelected: { zh: '确定要更新已选的 {n} 个仓库吗？', en: 'Update {n} selected repositories?', de: '{n} ausgewählte Repositorys aktualisieren?' },
  allUpdatesStarted: { zh: '全部更新已开始', en: 'All updates started', de: 'Alle Updates gestartet' },
  updateStarted: { zh: '已开始更新', en: 'Update started', de: 'Update gestartet' },
  updateFailed: { zh: '更新失败', en: 'Update failed', de: 'Update fehlgeschlagen' },
  selectAll: { zh: '全选', en: 'Select All', de: 'Alle auswählen' },
  deselectAll: { zh: '取消全选', en: 'Deselect All', de: 'Alle abwählen' },

  // Config
  customRepos: { zh: '自定义仓库', en: 'Custom Repositories', de: 'Benutzerdefinierte Repositorys' },
  noCustomRepos: { zh: '暂无自定义仓库', en: 'No custom repositories', de: 'Keine benutzerdefinierten Repositorys' },
  noCustomReposHint: { zh: '点击下方按钮添加自定义仓库，或从浏览页安装', en: 'Click below to add a custom repo, or install from Browse', de: 'Klicken Sie unten, um ein Repository hinzuzufügen, oder installieren Sie es aus dem Shop' },
  customReposDesc: { zh: '管理 HACS 自定义仓库列表。添加后可在商店中搜索到。', en: 'Manage custom repository list. Once added, they become searchable in Store.', de: 'Verwalten Sie benutzerdefinierte Repositorys. Nach dem Hinzufügen sind sie im Shop durchsuchbar.' },
  addRepo: { zh: '添加仓库', en: 'Add Repository', de: 'Repository hinzufügen' },
  addSuccess: { zh: '添加成功', en: 'Added successfully', de: 'Erfolgreich hinzugefügt' },
  invalidRepoUrl: { zh: '无效的仓库地址，请输入 owner/repo 格式或 GitHub URL', en: 'Invalid repository URL, use owner/repo format or GitHub URL', de: 'Ungültige Repository-URL, verwenden Sie owner/repo oder GitHub-URL' },
  addCustomRepo: { zh: '添加自定义仓库', en: 'Add Custom Repository', de: 'Benutzerdefiniertes Repository hinzufügen' },
  repoUrl: { zh: '仓库 URL (如: https://github.com/user/repo)', en: 'Repository URL (e.g. https://github.com/user/repo)', de: 'Repository-URL (z.B. https://github.com/user/repo)' },
  add: { zh: '添加', en: 'Add', de: 'Hinzufügen' },
  cancel: { zh: '取消', en: 'Cancel', de: 'Abbrechen' },
  addFailed: { zh: '添加失败', en: 'Add failed', de: 'Hinzufügen fehlgeschlagen' },
  removeRepo: { zh: '移除', en: 'Remove', de: 'Entfernen' },
  confirmRemoveRepo: { zh: '确定要移除 {repo} 吗？只删除 HACS 跟踪记录，仓库文件和集成配置不受影响。', en: 'Remove {repo}? Only the HACS tracking record will be deleted. Repository files and integration config are NOT affected.', de: '{repo} entfernen? Nur der HACS-Tracking-Eintrag wird gelöscht. Repository-Dateien und Integrationskonfiguration bleiben erhalten.' },
  removeRepoFailed: { zh: '移除失败', en: 'Remove failed', de: 'Entfernen fehlgeschlagen' },
  notInstalled: { zh: '未安装', en: 'Not installed', de: 'Nicht installiert' },
  alreadyExists: { zh: '已在列表中', en: 'already exists', de: 'existiert bereits' },
  customBadge: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },
  archivedRepos: { zh: '已归档仓库', en: 'Archived Repositories', de: 'Archivierte Repositorys' },
  noArchived: { zh: '暂无归档仓库', en: 'No archived repositories', de: 'Keine archivierten Repositorys' },
  renamedRepos: { zh: '已重命名仓库', en: 'Renamed Repositories', de: 'Umbenannte Repositorys' },
  noRenamed: { zh: '暂无重命名仓库', en: 'No renamed repositories', de: 'Keine umbenannten Repositorys' },
  ignoredRepos: { zh: '已忽略仓库', en: 'Ignored Repositories', de: 'Ignorierte Repositorys' },
  noIgnored: { zh: '暂无忽略仓库', en: 'No ignored repositories', de: 'Keine ignorierten Repositorys' },
  unignore: { zh: '取消忽略', en: 'Unignore', de: 'Ignorieren aufheben' },
  confirmUnignore: { zh: '确定取消忽略 {repo}？', en: 'Unignore {repo}?', de: 'Ignorieren von {repo} aufheben?' },
  ignoredBadge: { zh: '已忽略', en: 'Ignored', de: 'Ignoriert' },
  removeArchived: { zh: '移除归档', en: 'Remove Archived', de: 'Archivierung entfernen' },
  removeRenamed: { zh: '移除重命名', en: 'Remove Renamed', de: 'Umbenennung entfernen' },
  replace: { zh: '替换', en: 'Replace', de: 'Ersetzen' },
  confirmRemoveArchived: { zh: '确定要移除 {repo} 的归档状态吗？将重新出现在搜索结果中。', en: 'Unarchive {repo}? It will reappear in search results.', de: 'Archivierung von {repo} aufheben? Es erscheint wieder in den Suchergebnissen.' },
  confirmRemoveRenamed: { zh: '确定要删除仓库 {old} 的重命名映射记录吗？仓库将使用旧名，若旧名无效则更新可能失败。', en: 'Delete rename mapping for {old}? The repository will use the old name. If the old name is invalid, updates may fail.', de: 'Umbenennungszuordnung für {old} löschen? Das Repository verwendet den alten Namen. Bei ungültigem Namen können Updates fehlschlagen.' },
  confirmReplaceRenamed: { zh: '将替换仓库 {old} → {new}？将卸载旧仓库并安装新仓库。', en: 'Replace {old} → {new}? Old repo will be uninstalled, new one will be installed.', de: '{old} → {new} ersetzen? Das alte Repository wird deinstalliert, das neue installiert.' },
  viewOnGithub: { zh: '在 GitHub 中查看', en: 'View on GitHub', de: 'Auf GitHub ansehen' },

  // Backup
  exportBackup: { zh: '导出备份', en: 'Export Backup', de: 'Backup exportieren' },
  exportDesc: { zh: '将 HACS 配置、已安装仓库列表和自定义仓库设置导出为 JSON 文件。导出后可在新环境中导入恢复。', en: 'Export HACS config, installed repositories and custom repo settings as JSON. Can be imported in new environments.', de: 'Exportiert HACS-Konfiguration, installierte Repositorys und benutzerdefinierte Einstellungen als JSON. Kann in neuen Umgebungen importiert werden.' },
  exportBtn: { zh: '导出备份', en: 'Export Backup', de: 'Backup exportieren' },
  exporting: { zh: '导出中...', en: 'Exporting...', de: 'Exportiere...' },
  exportSuccess: { zh: '备份导出成功', en: 'Backup exported successfully', de: 'Backup erfolgreich exportiert' },
  exportFailed: { zh: '导出失败', en: 'Export failed', de: 'Export fehlgeschlagen' },
  importBackup: { zh: '导入备份', en: 'Import Backup', de: 'Backup importieren' },
  importDesc: { zh: '从之前导出的 JSON 备份文件恢复 HACS 配置。注意：导入会覆盖当前配置。', en: 'Restore HACS config from a previously exported JSON backup. Note: Import will overwrite current config.', de: 'HACS-Konfiguration aus einem JSON-Backup wiederherstellen. Hinweis: Der Import überschreibt die aktuelle Konfiguration.' },
  importBtn: { zh: '导入备份', en: 'Import Backup', de: 'Backup importieren' },
  importing: { zh: '导入中...', en: 'Importing...', de: 'Importiere...' },
  importSuccess: { zh: '备份导入成功', en: 'Backup imported successfully', de: 'Backup erfolgreich importiert' },
  importFailed: { zh: '导入失败', en: 'Import failed', de: 'Import fehlgeschlagen' },
  depCheck: { zh: '依赖检查', en: 'Dependency Check', de: 'Abhängigkeitsprüfung' },
  depDesc: { zh: '检查 HACS Vision 的系统依赖是否完整安装。', en: 'Check if HACS Vision system dependencies are fully installed.', de: 'Prüft, ob alle HACS Vision-Abhängigkeiten installiert sind.' },
  checkDep: { zh: '检查依赖', en: 'Check Dependencies', de: 'Abhängigkeiten prüfen' },
  depOk: { zh: '所有依赖正常', en: 'All dependencies OK', de: 'Alle Abhängigkeiten in Ordnung' },
  depMissing: { zh: '部分依赖缺失', en: 'Some dependencies missing', de: 'Einige Abhängigkeiten fehlen' },
  checkFailed: { zh: '检查失败', en: 'Check failed', de: 'Prüfung fehlgeschlagen' },

  // Favorites
  noFavorites: { zh: '暂无收藏', en: 'No favorites yet', de: 'Noch keine Favoriten' },
  noFavoritesHint: { zh: '在浏览页点击卡片右上角的 ☆ 收藏仓库', en: 'Click ☆ on the top-right of cards to favorite repositories', de: 'Klicken Sie ☆ oben rechts auf Karten, um Repositorys zu favorisieren' },
  clearAll: { zh: '清空收藏', en: 'Clear All', de: 'Alle löschen' },
  confirmClear: { zh: '确定要清空所有收藏吗？', en: 'Clear all favorites?', de: 'Alle Favoriten löschen?' },
  favoritesCleared: { zh: '已清空收藏', en: 'Favorites cleared', de: 'Favoriten gelöscht' },

  // Detail Modal
  openGithub: { zh: '在 GitHub 中打开', en: 'Open in GitHub', de: 'Auf GitHub öffnen' },
  description: { zh: '描述', en: 'Description', de: 'Beschreibung' },
  version: { zh: '版本', en: 'Version', de: 'Version' },
  downloads: { zh: '下载量', en: 'Downloads', de: 'Downloads' },
  stars: { zh: '星数', en: 'Stars', de: 'Sterne' },
  category: { zh: '分类', en: 'Category', de: 'Kategorie' },
  close: { zh: '关闭', en: 'Close', de: 'Schließen' },
  unknown: { zh: '未知', en: 'unknown', de: 'unbekannt' },
  unavailable: { zh: '不可用', en: 'Unavailable', de: 'Nicht verfügbar' },
  stateOn: { zh: '开', en: 'On', de: 'An' },
  stateOff: { zh: '关', en: 'Off', de: 'Aus' },
  stateOpen: { zh: '已打开', en: 'Open', de: 'Offen' },
  stateClosed: { zh: '已关闭', en: 'Closed', de: 'Geschlossen' },
  stateHome: { zh: '在家', en: 'Home', de: 'Zuhause' },
  stateNotHome: { zh: '离家', en: 'Away', de: 'Abwesend' },
  search: { zh: '搜索', en: 'Search', de: 'Suchen' },
  refreshTitle: { zh: '刷新', en: 'Refresh', de: 'Aktualisieren' },
  totalPrefix: { zh: '共', en: 'Total', de: 'Gesamt' },
  selected: { zh: '已选', en: 'Selected', de: 'Ausgewählt' },
  totalCount: { zh: '共', en: 'Total', de: 'Gesamt' },
  all: { zh: '全部', en: 'All', de: 'Alle' },
  repositories: { zh: '仓库', en: 'Repositories', de: 'Repositorys' },
  syncing: { zh: '同步中...', en: 'Syncing...', de: 'Synchronisiere...' },
  syncSelected: { zh: '同步选中', en: 'Sync Selected', de: 'Auswahl synchronisieren' },
  orgRepos: { zh: '组织/用户仓库', en: 'Org/User Repos', de: 'Organisations-/Benutzer-Repositorys' },
  orgReposDesc: { zh: '输入 GitHub 组织或用户名，列出仓库后勾选添加到自定义列表', en: 'Enter GitHub org or username to list repos, then select to add to custom list', de: 'GitHub-Organisation oder -Benutzernamen eingeben, Repositorys auflisten und zur benutzerdefinierten Liste hinzufügen' },
  successSuffix: { zh: '成功', en: ' succeeded', de: ' erfolgreich' },
  failedSuffix: { zh: '失败', en: ' failed', de: ' fehlgeschlagen' },
  deviceAndService: { zh: '设备与服务', en: 'Devices & Services', de: 'Geräte & Dienste' },
  noDevices: { zh: '暂无设备', en: 'No devices', de: 'Keine Geräte' },
  deviceCount: { zh: '个设备', en: ' devices', de: ' Geräte' },
  areaCount: { zh: '个区域', en: ' areas', de: ' Bereiche' },
  viewDevices: { zh: '查看设备', en: 'View Devices', de: 'Geräte anzeigen' },
  delete: { zh: '删除', en: 'Delete', de: 'Löschen' },
  expandAll: { zh: '展开全部', en: 'Expand All', de: 'Alle ausklappen' },
  collapseAll: { zh: '全部折叠', en: 'Collapse All', de: 'Alle einklappen' },

  // Connection
  connectFailed: { zh: '连接 HACS 失败', en: 'Failed to connect to HACS', de: 'Verbindung zu HACS fehlgeschlagen' },
  waitingHA: { zh: '等待 HA 连接...', en: 'Waiting for HA connection...', de: 'Warte auf HA-Verbindung...' },

  // Confirm Dialog
  confirm: { zh: '确认', en: 'Confirm', de: 'Bestätigen' },
  confirmDelete: { zh: '确定要删除 {domain} 的配置条目吗？该集成将立即停止运行，仓库下载文件不会被删除。', en: 'Delete {domain} config entry? The integration will stop immediately. Repository files will NOT be deleted.', de: '{domain}-Konfigurationseintrag löschen? Die Integration wird sofort gestoppt. Repository-Dateien bleiben erhalten.' },
  deleted: { zh: '已删除', en: 'Deleted', de: 'Gelöscht' },
  deleteFailed: { zh: '删除失败', en: 'Delete failed', de: 'Löschen fehlgeschlagen' },
  confirmUpdate: { zh: '确认更新', en: 'Confirm Update', de: 'Update bestätigen' },
  disabled: { zh: '禁用', en: 'Disabled', de: 'Deaktiviert' },
  configure: { zh: '配置', en: 'Configure', de: 'Konfigurieren' },
  enableEntry: { zh: '启用', en: 'Enable', de: 'Aktivieren' },
  disableEntry: { zh: '禁用', en: 'Disable', de: 'Deaktivieren' },
  subentryConfig: { zh: '子项配置', en: 'Sub-entry Config', de: 'Sub-Entry-Konfiguration' },
  addSubentryHint: { zh: '点击添加新的子项配置', en: 'Click to add a new sub-entry', de: 'Klicken Sie, um einen neuen Sub-Entry hinzuzufügen' },
  save: { zh: '保存', en: 'Save', de: 'Speichern' },

  // README
  loadingReadme: { zh: '加载 README...', en: 'Loading README...', de: 'Lade README...' },
  readmeLoadFailed: { zh: 'README 加载失败', en: 'README load failed', de: 'README-Laden fehlgeschlagen' },
  readmeTitle: { zh: '说明文档', en: 'README', de: 'README' },

  // README translation
  readmeTranslateAi: { zh: 'README 翻译 AI', en: 'README Translation AI', de: 'README-Übersetzung (KI)' },
  readmeTranslateAiDesc: { zh: '选择用于翻译仓库说明文档的对话助手（在「设置 → 语音助手」中配置）', en: 'Choose the conversation agent used to translate repository READMEs (configured in Settings → Voice Assistants)', de: 'Wähle den Konversations-Agenten zur Übersetzung von READMEs (in Einstellungen → Sprachassistenten)' },
  readmeTranslateAiNone: { zh: '不翻译（显示原文）', en: 'No translation (show original)', de: 'Keine Übersetzung (Original)' },
  readmeLangOriginal: { zh: '原文', en: 'Original', de: 'Original' },
  readmeLangZh: { zh: '中文', en: 'Chinese', de: 'Chinesisch' },
  readmeLangEn: { zh: '英文', en: 'English', de: 'Englisch' },
  readmeLangDe: { zh: '德文', en: 'German', de: 'Deutsch' },
  readmeTranslateNoAgent: { zh: '请先在设置中选择「README 翻译 AI」', en: 'Select a "README Translation AI" in settings first', de: 'Wähle zuerst eine "README-Übersetzung (KI)" in den Einstellungen' },
  readmeTranslateUnsupported: { zh: '不支持的目标语言', en: 'Unsupported target language', de: 'Nicht unterstützte Zielsprache' },
  readmeTranslateRateLimited: { zh: '翻译请求过于频繁，请稍后再试', en: 'Too many translation requests — try again later', de: 'Zu viele Übersetzungsanfragen — später erneut' },
  readmeTranslateFailed: { zh: '翻译失败，请确认所选 AI 可用', en: 'Translation failed — verify the selected AI is available', de: 'Übersetzung fehlgeschlagen — Agent verfügbar?' },
  readmeTranslateTimeout: { zh: '翻译超时（大模型处理较慢），可换更快的模型或稍后重试', en: 'Translation timed out (model too slow) — try a faster model or later', de: 'Zeitüberschreitung (Modell zu langsam) — schnelleres Modell wählen' },
  readmeTranslating: { zh: '翻译中…大模型处理长文档可能需要 10–60 秒', en: 'Translating… long docs may take 10–60s', de: 'Übersetze… lange Dokumente brauchen 10–60s' },

  // README translation language picker (settings)
  readmeTranslateLangs: { zh: 'README 翻译语言', en: 'README Translation Languages', de: 'README-Übersetzungssprachen' },
  readmeTranslateLangsDesc: { zh: '勾选后在仓库详情弹窗的「说明文档」语言条中显示对应按钮（原文始终显示）', en: 'Checked languages appear as buttons in the README language bar of the repo popup (Original is always shown)', de: 'Aktivierte Sprachen erscheinen als Buttons in der README-Sprachleiste (Original immer sichtbar)' },
  readmeLangJa: { zh: '日文', en: 'Japanese', de: 'Japanisch' },
  readmeLangKo: { zh: '韩文', en: 'Korean', de: 'Koreanisch' },

  // Detail Modal
  dblZoomHint: { zh: '双击放大', en: 'Double-click to expand', de: 'Doppelklicken zum Vergrößern' },

  // Network Status
  networkOffline: { zh: '网络连接已断开，请检查网络', en: 'Network disconnected — check your connection', de: 'Netzwerk getrennt — Verbindung prüfen' },
  networkRestored: { zh: '网络已恢复', en: 'Network restored', de: 'Netzwerk wiederhergestellt' },
  haRestarting: { zh: 'Home Assistant 正在重启，请稍候...', en: 'Home Assistant is restarting, please wait...', de: 'Home Assistant wird neu gestartet, bitte warten...' },
  cacheMismatch: { zh: '版本已更新，请刷新页面', en: 'New version available, please refresh', de: 'Neue Version verfügbar, bitte aktualisieren' },
  rateLimited: { zh: 'GitHub API 限流，请稍后重试', en: 'GitHub API rate limited — try again later', de: 'GitHub-API-Ratenlimit erreicht — bitte später erneut versuchen' },
  serverError: { zh: '后端服务异常，请检查 Vision 后端状态', en: 'Backend service error — check Vision backend status', de: 'Backend-Fehler — Vision-Backend-Status prüfen' },

  // Restart HA
  restartHA: { zh: '重启', en: 'Restart', de: 'Neustart' },
  restartHATitle: { zh: '重启 Home Assistant', en: 'Restart Home Assistant', de: 'Home Assistant neu starten' },
  restartConfirm: { zh: '确定要重启 Home Assistant 吗？面板将暂时不可用。', en: 'Restart Home Assistant? The panel will be temporarily unavailable.', de: 'Home Assistant neu starten? Das Panel ist vorübergehend nicht verfügbar.' },
  restartFailed: { zh: '重启失败', en: 'Restart failed', de: 'Neustart fehlgeschlagen' },
  reloadHA: { zh: '重新加载', en: 'Reload', de: 'Neu laden' },
  reloadHATitle: { zh: '重新加载核心配置', en: 'Reload Core Config', de: 'Kernkonfiguration neu laden' },
  reloadingHA: { zh: '正在重新加载配置...', en: 'Reloading config...', de: 'Lade Konfiguration neu...' },
  reloadSuccess: { zh: '配置已重新加载', en: 'Config reloaded', de: 'Konfiguration neu geladen' },
  coreReloadFailed: { zh: '重新加载失败', en: 'Reload failed', de: 'Neuladen fehlgeschlagen' },
  postInstallRestartMsg: { zh: '已安装/更新完成。需要重启 Home Assistant 才能生效，是否立即重启？', en: 'Install/Update complete. Home Assistant needs a restart to apply changes. Restart now?', de: 'Installation/Update abgeschlossen. Home Assistant muss neu gestartet werden. Jetzt neu starten?' },
  later: { zh: '稍后', en: 'Later', de: 'Später' },

  // Progress Indicators
  installing: { zh: '安装中…', en: 'Installing…', de: 'Installiere…' },
  installComplete: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  installFailed: { zh: '安装失败', en: 'Install failed', de: 'Installation fehlgeschlagen' },
  updatingProgress: { zh: '更新中…', en: 'Updating…', de: 'Aktualisiere…' },
  updateComplete: { zh: '已更新', en: 'Updated', de: 'Aktualisiert' },

  // Quick Install
  quickInstall: { zh: '快捷安装', en: 'Quick Install', de: 'Schnellinstallation' },
  quickInstallPlaceholder: { zh: '粘贴 GitHub URL 或 owner/repo', en: 'Paste GitHub URL or owner/repo', de: 'GitHub-URL oder owner/repo einfügen' },
  quickInstallCategory: { zh: '分类', en: 'Category', de: 'Kategorie' },
  quickInstallUrl: { zh: '仓库 URL', en: 'Repository URL', de: 'Repository-URL' },
  installRepo: { zh: '安装仓库', en: 'Install Repository', de: 'Repository installieren' },

  // Changelog
  changelogTitle: { zh: '更新内容', en: "What's New", de: 'Neuigkeiten' },
  changelogTitleVersion: { zh: '{tag} 更新内容', en: "{tag} What's New", de: '{tag} – Neuigkeiten' },
  viewFullChangelog: { zh: '查看完整更新日志', en: 'View full changelog', de: 'Vollständiges Änderungsprotokoll anzeigen' },
  noChangelog: { zh: '暂无更新日志', en: 'No changelog available', de: 'Kein Änderungsprotokoll verfügbar' },
  changelogShowMore: { zh: '展开', en: 'Show more', de: 'Mehr anzeigen' },
  changelogShowLess: { zh: '收起', en: 'Show less', de: 'Weniger anzeigen' },

  // View Mode & Grouping
  viewCard: { zh: '卡片', en: 'Cards', de: 'Karten' },
  viewList: { zh: '列表', en: 'List', de: 'Liste' },
  list: { zh: '列表', en: 'List', de: 'Liste' },
  groupBy: { zh: '分组', en: 'Group By', de: 'Gruppieren nach' },
  groupNone: { zh: '不分组', en: 'No Grouping', de: 'Keine Gruppierung' },
  groupStatus: { zh: '按状态', en: 'By Status', de: 'Nach Status' },
  groupType: { zh: '按类型', en: 'By Type', de: 'Nach Typ' },

  // Version Selector
  selectVersion: { zh: '选择版本', en: 'Select Version', de: 'Version auswählen' },
  availableVersion: { zh: '可用版本', en: 'Available Version', de: 'Verfügbare Version' },
  installVersion: { zh: '安装此版本', en: 'Install This Version', de: 'Diese Version installieren' },
  prerelease: { zh: '预发布', en: 'Pre-release', de: 'Vorabversion' },
  prereleaseTab: { zh: '预发布版', en: 'Pre-releases', de: 'Vorabversionen' },
  stableReleases: { zh: '正式版', en: 'Stable', de: 'Stabil' },
  releaseStable: { zh: '正式版', en: 'Release', de: 'Veröffentlichung' },
  releasePrerelease: { zh: '预发布版', en: 'Pre-release', de: 'Vorabversion' },
  noReleases: { zh: '暂无发布版本', en: 'No releases available', de: 'Keine Veröffentlichungen verfügbar' },
  publishedAt: { zh: '发布于', en: 'Published', de: 'Veröffentlicht am' },

  noConfigRequired: { zh: '此集成无需配置', en: 'This integration requires no configuration', de: 'Diese Integration benötigt keine Konfiguration' },

  // Tools
  tools: { zh: '工具', en: 'Tools', de: 'Werkzeuge' },
  toolsDesc: { zh: '导出、导入和依赖检查', en: 'Export, import and dependency check', de: 'Export, Import und Abhängigkeitsprüfung' },

  // Table columns
  colName: { zh: '名称', en: 'Name', de: 'Name' },
  colDownloads: { zh: '下载', en: 'Downloads', de: 'Downloads' },
  colStars: { zh: '星数', en: 'Stars', de: 'Sterne' },
  colLastUpdated: { zh: '更新', en: 'Updated', de: 'Aktualisiert' },
  colInstalledVer: { zh: '已安装', en: 'Installed', de: 'Installiert' },
  colAvailableVer: { zh: '可用', en: 'Available', de: 'Verfügbar' },
  colStatus: { zh: '状态', en: 'Status', de: 'Status' },
  colInstalledAt: { zh: '安装时间', en: 'Installed At', de: 'Installiert am' },
  installedAt: { zh: '安装时间', en: 'Installed At', de: 'Installiert am' },
  today: { zh: '今天', en: 'Today', de: 'Heute' },
  yesterday: { zh: '昨天', en: 'Yesterday', de: 'Gestern' },

  // Maintenance
  clearCache: { zh: '清除缓存', en: 'Clear cache', de: 'Cache leeren' },
  clearCacheConfirm: { zh: '清除面板缓存后，页面将重新加载以获取最新版本。确定继续？', en: 'Clear the panel cache? The page will reload to get the latest version.', de: 'Panel-Cache leeren? Die Seite wird neu geladen, um die neueste Version zu erhalten.' },
  clearCacheDone: { zh: '缓存已清除，正在重新加载...', en: 'Cache cleared, reloading...', de: 'Cache geleert, lade neu...' },

  // Config tab
  tabSettings: { zh: '设置', en: 'Settings', de: 'Einstellungen' },
  settingsTitle: { zh: '设置', en: 'Settings', de: 'Einstellungen' },
  settingsDesc: { zh: '自定义 HACS Vision 的显示和行为', en: 'Customize HACS Vision look and behavior', de: 'Passen Sie Darstellung und Verhalten von HACS Vision an' },
  settingsRefreshInterval: { zh: '刷新间隔（秒）', en: 'Refresh interval (s)', de: 'Aktualisierungsintervall (s)' },
  settingsDefaultView: { zh: '默认视图', en: 'Default view', de: 'Standardansicht' },
  settingsNotifyUpdates: { zh: '推送更新通知', en: 'Push update notifications', de: 'Update-Benachrichtigungen' },
  settingsNotifyRestart: { zh: '推送重启提醒', en: 'Push restart reminders', de: 'Neustart-Erinnerungen' },
  settingsLanguage: { zh: '语言', en: 'Language', de: 'Sprache' },
  settingsSaved: { zh: '设置已保存', en: 'Settings saved', de: 'Einstellungen gespeichert' },
  settingsSaveFailed: { zh: '设置保存失败', en: 'Settings save failed', de: 'Speichern der Einstellungen fehlgeschlagen' },
  settingsMaintenance: { zh: '维护', en: 'Maintenance', de: 'Wartung' },

  // Batch operations
  batchSelect: { zh: '批量选择', en: 'Batch select', de: 'Mehrfachauswahl' },
  batchInstall: { zh: '批量安装', en: 'Batch install', de: 'Mehrfachinstallation' },
  batchRemove: { zh: '批量卸载', en: 'Batch uninstall', de: 'Mehrfachdeinstallation' },
  batchUpdate: { zh: '批量更新', en: 'Batch update', de: 'Mehrfachupdate' },
  batchSelected: { zh: '已选 {n} 个', en: '{n} selected', de: '{n} ausgewählt' },
  batchInProgress: { zh: '批量操作进行中…', en: 'Batch operation in progress…', de: 'Stapelverarbeitung läuft…' },
  batchComplete: { zh: '批量操作完成', en: 'Batch complete', de: 'Stapelverarbeitung abgeschlossen' },
  batchRemoveConfirm: { zh: '确定要批量卸载 {n} 个仓库吗？', en: 'Uninstall {n} repositories?', de: '{n} Repositorys deinstallieren?' },
  batchRemoveRepoConfirm: { zh: '确定要批量移除 {n} 个自定义仓库吗？', en: 'Remove {n} custom repositories?', de: '{n} benutzerdefinierte Repositorys entfernen?' },

  // Quick Install
  quickInstallTitle: { zh: '快捷安装', en: 'Quick Install', de: 'Schnellinstallation' },
  quickInstallDetected: { zh: '检测到 GitHub URL', en: 'Detected GitHub URL', de: 'GitHub-URL erkannt' },
  quickInstallDetectedDesc: { zh: '是否要安装此仓库？', en: 'Install this repository?', de: 'Dieses Repository installieren?' },
  quickInstallAuto: { zh: '自动识别', en: 'Auto detect', de: 'Automatisch erkennen' },
  invalidOrgInput: { zh: '无效的仓库地址或组织名，请输入 owner/repo 或 GitHub 组织名', en: 'Invalid URL or org name, enter owner/repo or GitHub org name', de: 'Ungültige URL oder Organisationsname, geben Sie owner/repo oder GitHub-Organisationsnamen ein' },

  // Add Integration Entry
  addIntegrationHint: { zh: '配置此 HA 集成', en: 'Configure this HA integration', de: 'Diese HA-Integration konfigurieren' },
  addHAIntegration: { zh: '添加 HA 集成', en: 'Add HA Integration', de: 'HA-Integration hinzufügen' },
  addHAIntegrationDesc: { zh: '搜索并添加 Home Assistant 内置或自定义集成', en: 'Search and add Home Assistant built-in or custom integrations', de: 'Suchen und Hinzufügen von Home Assistant-Integrationen' },
  searchIntegration: { zh: '搜索集成...', en: 'Search integration...', de: 'Integration suchen...' },
  noIntegrationMatch: { zh: '没有匹配的集成', en: 'No matching integration', de: 'Keine passende Integration' },
  integrationCount: { zh: '个可用集成', en: 'available integrations', de: 'verfügbare Integrationen' },
  filterAll: { zh: '全部', en: 'All', de: 'Alle' },
  filterLoaded: { zh: '已加载', en: 'Loaded', de: 'Geladen' },
  filterFailed: { zh: '加载失败', en: 'Failed', de: 'Fehlgeschlagen' },
  filterDisabled: { zh: '已禁用', en: 'Disabled', de: 'Deaktiviert' },
  filterNotLoaded: { zh: '未加载', en: 'Not Loaded', de: 'Nicht geladen' },
  entryCount: { zh: '个条目', en: ' entries', de: ' Einträge' },
  entryTitle: { zh: 'ID: {id}', en: 'ID: {id}', de: 'ID: {id}' },
  detailEntries: { zh: '{count} 个条目 · 点击 ⚙ 配置', en: '{count} entries · Click ⚙ to configure', de: '{count} Einträge · Klicken Sie ⚙ zum Konfigurieren' },
  reloadDomain: { zh: '重载此集成全部条目', en: 'Reload all entries', de: 'Alle Einträge neu laden' },
  configureEntry: { zh: '配置此条目', en: 'Configure this entry', de: 'Diesen Eintrag konfigurieren' },
  reloadEntry: { zh: '重载此条目', en: 'Reload this entry', de: 'Diesen Eintrag neu laden' },
  removeEntry: { zh: '删除此条目', en: 'Remove this entry', de: 'Diesen Eintrag löschen' },
  entryDisabled: { zh: '已禁用', en: 'Disabled', de: 'Deaktiviert' },
  viewDetail: { zh: '查看详情', en: 'View details', de: 'Details anzeigen' },
  loadFailed: { zh: '加载集成列表失败', en: 'Failed to load integrations', de: 'Laden der Integrationen fehlgeschlagen' },
  reloaded: { zh: '已重载', en: 'Reloaded', de: 'Neu geladen' },
  reloadFailed: { zh: '重载失败', en: 'Reload failed', de: 'Neuladen fehlgeschlagen' },

  // Check Updates + Notification
  checkUpdates: { zh: '检查更新', en: 'Check Updates', de: 'Updates prüfen' },
  checkUpdatesNotify: { zh: '检查并通知', en: 'Check & Notify', de: 'Prüfen & Benachrichtigen' },
  updatesChecked: { zh: '检查完成，{n} 个可更新', en: 'Check done, {n} updates', de: 'Prüfung abgeschlossen, {n} Updates' },
  noUpdatesFound: { zh: '所有仓库已是最新', en: 'All repositories up to date', de: 'Alle Repositorys aktuell' },
  notifySent: { zh: '通知已发送', en: 'Notification sent', de: 'Benachrichtigung gesendet' },

  // Config flow
  flowTitle: { zh: '配置 HA 集成', en: 'Configure HA Integration', de: 'HA-Integration konfigurieren' },
  flowTitleOptions: { zh: '选项配置', en: 'Options Configuration', de: 'Optionen konfigurieren' },
  subentryTitle: { zh: '子项配置', en: 'Subentry Configuration', de: 'Sub-Entry-Konfiguration' },
  subentrySelectDesc: { zh: '请选择要配置的子项类型：', en: 'Select a subentry type to configure:', de: 'Wählen Sie einen Sub-Entry-Typ:' },
  subentryExisting: { zh: '已有子项', en: 'Existing Subentries', de: 'Vorhandene Sub-Entries' },
  subentryAddNew: { zh: '添加新子项', en: 'Add New Subentry', de: 'Neuen Sub-Entry hinzufügen' },
  subentryAddPrefix: { zh: '添加', en: 'Add', de: 'Hinzufügen' },
  subentryReconfigure: { zh: '配置', en: 'Configure', de: 'Konfigurieren' },
  subentryConversation: { zh: '对话', en: 'Conversation', de: 'Konversation' },
  subentryTts: { zh: '语音合成', en: 'Text-to-Speech', de: 'Text-zu-Sprache' },
  subentryStt: { zh: '语音识别', en: 'Speech-to-Text', de: 'Spracherkennung' },
  subentryTranslation: { zh: '翻译', en: 'Translation', de: 'Übersetzung' },
  subentryAiTaskData: { zh: 'AI 任务数据', en: 'AI Task Data', de: 'KI-Aufgabendaten' },
  subentryDevice: { zh: 'MQTT 设备', en: 'MQTT Device', de: 'MQTT-Gerät' },
  subentryWecom: { zh: '企业微信', en: 'WeCom', de: 'WeCom' },
  subentryWechat: { zh: '微信', en: 'WeChat', de: 'WeChat' },
  subentryQq: { zh: 'QQ', en: 'QQ', de: 'QQ' },
  subentryFeishu: { zh: '飞书', en: 'Feishu', de: 'Feishu' },
  subentryDingtalk: { zh: '钉钉', en: 'DingTalk', de: 'DingTalk' },
  subentryXiaoyi: { zh: '小懿', en: 'XiaoYi', de: 'XiaoYi' },
  subentryCustom: { zh: '自定义', en: 'Custom', de: 'Benutzerdefiniert' },
  flowProcessing: { zh: '处理中...', en: 'Processing...', de: 'Verarbeite...' },
  flowStarting: { zh: '启动配置流程...', en: 'Starting configuration...', de: 'Starte Konfiguration...' },
  flowSubmit: { zh: '提交', en: 'Submit', de: 'Absenden' },
  flowSelectOption: { zh: '--- 请选择 ---', en: '--- Select ---', de: '--- Auswählen ---' },
  flowOptionsNotSupported: { zh: '此集成无需配置', en: 'This integration does not require configuration', de: 'Diese Integration benötigt keine Konfiguration' },
  flowHandlerNotFound: { zh: '未找到此集成的配置流程', en: 'Configuration handler not found', de: 'Kein Konfigurationshandler gefunden' },
  flowAuthError: { zh: '认证失败，请刷新页面后重试', en: 'Authentication failed. Please refresh and try again', de: 'Authentifizierung fehlgeschlagen. Bitte aktualisieren und erneut versuchen' },
  flowTimeout: { zh: '配置超时，请重试', en: 'Configuration timed out, please try again', de: 'Konfiguration abgelaufen, bitte erneut versuchen' },
  selectEntryTitle: { zh: '选择集成实例', en: 'Select Entry', de: 'Eintrag auswählen' },
  selectEntrySubtitle: { zh: '此集成有多个实例，请选择要配置的实例', en: 'Multiple instances found, please select one to configure', de: 'Mehrere Instanzen gefunden, bitte eine auswählen' },
  currentEntry: { zh: '当前', en: 'Current', de: 'Aktuell' },
  flowSubmitFailed: { zh: '提交失败', en: 'Submit failed', de: 'Absenden fehlgeschlagen' },
  flowUnknownType: { zh: '集成返回了未知流程类型（{type}），请前往设备与服务完成配置。', en: 'Unknown flow type ({type}). Please configure in Devices & Services.', de: 'Unbekannter Flow-Typ ({type}). Bitte in Geräte & Dienste konfigurieren.' },
  flowExternalAuth: { zh: '此集成需要外部认证，请在打开的页面中完成授权。', en: 'This integration requires external authentication. Please complete authorization in the opened page.', de: 'Diese Integration erfordert externe Authentifizierung. Bitte schließen Sie die Autorisierung auf der geöffneten Seite ab.' },
  flowStepNext: { zh: '下一步', en: 'Next', de: 'Weiter' },
  flowStepFinish: { zh: '完成', en: 'Finish', de: 'Fertigstellen' },
  flowCancel: { zh: '取消', en: 'Cancel', de: 'Abbrechen' },
  flowBack: { zh: '← 返回', en: '← Back', de: '← Zurück' },
  flowClose: { zh: '关闭', en: 'Close', de: 'Schließen' },
  flowDone: { zh: '完成', en: 'Done', de: 'Fertig' },
  flowGotIt: { zh: '知道了', en: 'Got it', de: 'Verstanden' },
  flowResultCreated: { zh: '配置完成', en: 'Setup Complete', de: 'Einrichtung abgeschlossen' },
  flowResultCreatedDesc: { zh: '集成已成功添加到设备与服务', en: 'Integration has been added to Devices & Services', de: 'Integration wurde zu Geräte & Dienste hinzugefügt' },
  flowResultAborted: { zh: '无需配置', en: 'Skipped', de: 'Übersprungen' },
  flowResultAbortedDesc: { zh: '该集成已被跳过', en: 'Integration was skipped', de: 'Integration wurde übersprungen' },
  flowResultExternal: { zh: '外部认证', en: 'External Authentication', de: 'Externe Authentifizierung' },
  flowResultExternalDesc: { zh: '请在外部页面完成授权。', en: 'Please authorize in the external page.', de: 'Bitte auf der externen Seite autorisieren.' },
  flowResultFailed: { zh: '配置失败', en: 'Setup Failed', de: 'Einrichtung fehlgeschlagen' },
  flowResultFailedDesc: { zh: '请稍后在设备与服务中重试', en: 'Please retry in Devices & Services', de: 'Bitte später in Geräte & Dienste erneut versuchen' },
  flowAbortAlreadyConfigured: { zh: '该集成已在设备与服务中配置', en: 'Already configured in Devices & Services', de: 'Bereits in Geräte & Dienste konfiguriert' },
  flowAbortSingleInstance: { zh: '此集成只允许配置一次', en: 'Only one instance allowed', de: 'Nur eine Instanz erlaubt' },
  flowAbortNoDevices: { zh: '未找到可配置的设备', en: 'No devices found', de: 'Keine Geräte gefunden' },
  flowAbortInProgress: { zh: '已有进行中的流程', en: 'Flow already in progress', de: 'Flow bereits in Bearbeitung' },
  flowOpenAuthPage: { zh: '打开认证页面 ↗', en: 'Open auth page ↗', de: 'Auth-Seite öffnen ↗' },
  flowStartFailed: { zh: '配置流程启动失败', en: 'Failed to start config flow', de: 'Konfigurations-Flow konnte nicht gestartet werden' },
  flowStartFailedOptions: { zh: '选项配置流程启动失败', en: 'Failed to start options flow', de: 'Options-Flow konnte nicht gestartet werden' },
  flowStep: { zh: '步骤', en: 'Step', de: 'Schritt' },

  // GitHub Integration
  logout: { zh: '登出', en: 'Logout', de: 'Abmelden' },
  githubTokenDesc: { zh: '在 GitHub Settings → Developer settings → Personal access tokens 生成', en: 'Generate in GitHub Settings → Developer settings → Personal access tokens', de: 'Erstellen Sie in GitHub Settings → Developer settings → Personal access tokens' },
  syncStarred: { zh: '星标仓库同步', en: 'Starred Repos Sync', de: 'Stern-Repo-Synchronisation' },
  syncStarredDesc: { zh: '从 GitHub 拉取你点赞过的仓库，勾选后添加到自定义仓库列表', en: 'Fetch your starred repos from GitHub, select and add to custom list', de: 'Holen Sie Ihre Stern-Repositorys von GitHub und fügen Sie sie zur benutzerdefinierten Liste hinzu' },
  loadStarred: { zh: '加载星标仓库', en: 'Load Starred Repos', de: 'Stern-Repositorys laden' },
  load: { zh: '加载', en: 'Load', de: 'Laden' },
  star: { zh: '星标', en: 'Star', de: 'Stern' },
  unstar: { zh: '取消星标', en: 'Unstar', de: 'Stern entfernen' },
  starred: { zh: '已星标', en: 'Starred', de: 'Mit Stern' },
  starBtn: { zh: '星标', en: 'Star', de: 'Stern' },
  cloud: { zh: '需要互联网', en: 'Requires Internet', de: 'Erfordert Internet' },
  importFromHacs: { zh: '从 HACS 导入', en: 'Import from HACS', de: 'Von HACS importieren' },
  tokenImported: { zh: '已从 HACS 导入 Token', en: 'Token imported from HACS', de: 'Token von HACS importiert' },
  tokenImportFailed: { zh: 'HACS 中未找到 Token', en: 'No token found in HACS', de: 'Kein Token in HACS gefunden' },
  verifyAndSave: { zh: '验证并保存', en: 'Verify & Save', de: 'Verifizieren & Speichern' },
  verifying: { zh: '验证中...', en: 'Verifying...', de: 'Verifiziere...' },
  syncFavToStar: { zh: '收藏同步点赞', en: 'Favorites → Stars', de: 'Favoriten → Sterne' },
  syncStarToFav: { zh: '点赞同步收藏', en: 'Stars → Favorites', de: 'Sterne → Favoriten' },
  addIntegration: { zh: '添加集成', en: 'Add Integration', de: 'Integration hinzufügen' },
  orgInputRequired: { zh: '请输入 GitHub 组织名或 URL', en: 'Please enter a GitHub org name or URL', de: 'Bitte geben Sie einen GitHub-Organisationsnamen oder eine URL ein' },
  addStarredToCustomList: { zh: '已添加 {n} 个星标仓库到自定义列表', en: 'Added {n} starred repos to custom list', de: '{n} Stern-Repositorys zur benutzerdefinierten Liste hinzugefügt' },
  addReposToCustomList: { zh: '已添加 {n} 个仓库到自定义列表', en: 'Added {n} repos to custom list', de: '{n} Repositorys zur benutzerdefinierten Liste hinzugefügt' },
  syncDoneResult: { zh: '同步完成: {ok} 个成功{failPart}', en: 'Sync done: {ok} succeeded{failPart}', de: 'Synchronisation abgeschlossen: {ok} erfolgreich{failPart}' },
  failPartSuffix: { zh: ', {fail} 个失败', en: ', {fail} failed', de: ', {fail} fehlgeschlagen' },
  noPermissionMsg: { zh: '{n} 个仓库无权限点赞', en: '{n} repos without star permission', de: '{n} Repositorys ohne Stern-Berechtigung' },
  logoutGithub: { zh: '已登出 GitHub', en: 'Logged out of GitHub', de: 'Von GitHub abgemeldet' },
  githubVerifyResult: { zh: '已验证 ✅ 用户: {user} (剩余 {remaining}/5000 次/小时)', en: 'Verified ✅ User: {user} ({remaining}/5000 remaining)', de: 'Verifiziert ✅ Benutzer: {user} ({remaining}/5000 verbleibend)' },
  errorPrefix: { zh: '{action}失败: {err}', en: '{action} failed: {err}', de: '{action} fehlgeschlagen: {err}' },
  tokenSource: { zh: 'Token 来源', en: 'Token Source', de: 'Token-Quelle' },
  tokenSourceDesc: { zh: '选择使用哪个 GitHub Token 进行 API 调用', en: 'Choose which GitHub Token to use for API calls', de: 'Wählen Sie, welcher GitHub-Token für API-Aufrufe verwendet werden soll' },
  useHacsToken: { zh: '优先使用 HACS 的 Token', en: 'Prefer HACS Token', de: 'HACS-Token bevorzugen' },
  tokenFromHacs: { zh: '来源：HACS', en: 'Source: HACS', de: 'Quelle: HACS' },
  tokenFromVision: { zh: '来源：HACS Vision', en: 'Source: HACS Vision', de: 'Quelle: HACS Vision' },
  syncToHacs: { zh: '同时也更新 HACS 的 Token', en: 'Also update HACS Token', de: 'Auch HACS-Token aktualisieren' },
  oauthLogin: { zh: 'OAuth 授权登录', en: 'OAuth Login', de: 'OAuth-Anmeldung' },
  oauthDesc: { zh: '通过 GitHub OAuth 设备流授权，无需手动输入 Token', en: 'Authorize via GitHub OAuth device flow, no token needed', de: 'Autorisierung per GitHub-OAuth-Gerätefluss, kein Token erforderlich' },
  oauthStart: { zh: '开始 OAuth 授权', en: 'Start OAuth', de: 'OAuth starten' },
  oauthWaiting: { zh: '等待授权...', en: 'Waiting for authorization...', de: 'Warte auf Autorisierung...' },
  oauthStep1: { zh: '步骤1: 访问 GitHub', en: 'Step 1: Visit GitHub', de: 'Schritt 1: GitHub besuchen' },
  oauthStep2: { zh: '步骤2: 输入验证码', en: 'Step 2: Enter the code', de: 'Schritt 2: Code eingeben' },
  oauthVisit: { zh: '访问', en: 'Visit', de: 'Besuchen' },
  oauthEnterCode: { zh: '输入验证码：', en: 'Enter code:', de: 'Code eingeben:' },
  oauthWaitingDesc: { zh: '等待授权完成后自动保存...', en: 'Waiting for authorization... saving automatically...', de: 'Warte auf Autorisierung... speichert automatisch...' },
  oauthStarting: { zh: '启动中...', en: 'Starting...', de: 'Starte...' },

  // Missing keys
  githubToken: { zh: 'GitHub Token', en: 'GitHub Token', de: 'GitHub-Token' },
  githubSection: { zh: 'GitHub', en: 'GitHub', de: 'GitHub' },
  hacsUser: { zh: 'HACS 用户: {user}', en: 'HACS User: {user}', de: 'HACS-Benutzer: {user}' },
  loadingStarred: { zh: '正在从 GitHub 加载星标仓库...', en: 'Loading starred repos from GitHub...', de: 'Lade Stern-Repositorys von GitHub...' },
  alreadyStarred: { zh: '已星标过本仓库', en: 'Already starred this repo', de: 'Dieses Repository bereits mit Stern markiert' },
  starSuccess: { zh: '已星标 {repo}', en: 'Starred {repo}', de: '{repo} mit Stern markiert' },
  loadingOrgRepos: { zh: '正在加载仓库列表...', en: 'Loading repository list...', de: 'Lade Repository-Liste...' },
  filterPlaceholder: { zh: '筛选...', en: 'Filter...', de: 'Filter...' },
  syncSelectedCount: { zh: '同步选中 ({n})', en: 'Sync Selected ({n})', de: 'Auswahl synchronisieren ({n})' },
  starredCount: { zh: '{n} 个星标仓库', en: '{n} starred repos', de: '{n} Stern-Repositorys' },
  gitHubOrgInput: { zh: 'GitHub 组织名或 URL（如 C3H3-AI 或 https://github.com/C3H3-AI）', en: 'GitHub org name or URL (e.g. C3H3-AI or https://github.com/C3H3-AI)', de: 'GitHub-Organisation oder URL (z.B. C3H3-AI oder https://github.com/C3H3-AI)' },
  noSelectedRepos: { zh: '没有选中的仓库', en: 'No repos selected', de: 'Keine Repositorys ausgewählt' },
  syncResultSuccess: { zh: '✓ {n} 个同步成功', en: '✓ {n} synced', de: '✓ {n} synchronisiert' },
  syncResultPartial: { zh: '已完成: {ok} 成功, {fail} 失败', en: 'Done: {ok} succeeded, {fail} failed', de: 'Abgeschlossen: {ok} erfolgreich, {fail} fehlgeschlagen' },
  syncFavToStarAdded: { zh: '✓ 新增 {n} 个收藏', en: '✓ {n} favorites added', de: '✓ {n} Favoriten hinzugefügt' },
  syncFavToStarNone: { zh: '无新增', en: 'Nothing new', de: 'Nichts Neues' },
  syncingShort: { zh: '同步中...', en: 'Syncing...', de: 'Synchronisiere...' },
  refreshPage: { zh: '请刷新页面重试', en: 'Please refresh and try again', de: 'Bitte aktualisieren und erneut versuchen' },
  tokenPlaceholder: { zh: 'ghp_xxxxxxxxxxxx', en: 'ghp_xxxxxxxxxxxx', de: 'ghp_xxxxxxxxxxxx' },
  noStarredRepos: { zh: '没有找到星标仓库', en: 'No starred repos found', de: 'Keine Stern-Repositorys gefunden' },
  noOrgRepos: { zh: '没有找到仓库', en: 'No repos found', de: 'Keine Repositorys gefunden' },
  loggedOut: { zh: '已登出', en: 'Logged out', de: 'Abgemeldet' },
  githubLoginSuccess: { zh: 'GitHub 登录成功: {user}', en: 'GitHub login: {user}', de: 'GitHub-Anmeldung: {user}' },
  checkUpdateFailed: { zh: '检查更新失败: {err}', en: 'Update check failed: {err}', de: 'Update-Prüfung fehlgeschlagen: {err}' },

  // Config system redesign
  reconfigure: { zh: '重配置', en: 'Reconfigure', de: 'Neu konfigurieren' },
  addSubentry: { zh: '添加服务', en: 'Add service', de: 'Dienst hinzufügen' },
  enable: { zh: '启用', en: 'Enable', de: 'Aktivieren' },
  viewLogs: { zh: '查看日志', en: 'View logs', de: 'Logs anzeigen' },
  confirmEnable: { zh: '确认启用此集成?', en: 'Enable this integration?', de: 'Diese Integration aktivieren?' },
  enabled: { zh: '已启用', en: 'Enabled', de: 'Aktiviert' },
  enableFailed: { zh: '启用失败', en: 'Enable failed', de: 'Aktivierung fehlgeschlagen' },
  restartRequired: { zh: '需要重启才能生效', en: 'Restart required to apply', de: 'Neustart erforderlich, um zu übernehmen' },
  hideHacsPanel: { zh: '隐藏 HACS 侧边栏', en: 'Hide HACS sidebar', de: 'HACS-Seitenleiste ausblenden' },
  hideHacsPanelDesc: { zh: '隐藏/恢复原版 HACS 侧边栏图标，即时生效无需重启', en: 'Show/hide original HACS sidebar icon, applies immediately', de: 'Originales HACS-Seitenleistensymbol ein-/ausblenden, wirkt sofort' },
  githubTokenRequired: { zh: '请输入 Token', en: 'Token is required', de: 'Token erforderlich' },
  pendingRestart: { zh: '待重启', en: 'Pending Restart', de: 'Neustart ausstehend' },
  selectAction: { zh: '选择一个操作', en: 'Select an action', de: 'Aktion auswählen' },
  zoom: { zh: '放大', en: 'Zoom', de: 'Vergrößern' },
  restarting: { zh: '正在重启 HA…', en: 'Restarting HA…', de: 'HA wird neu gestartet…' },
  renderCrash: { zh: '渲染崩溃', en: 'Render error', de: 'Renderfehler' },
  fieldError: { zh: '字段渲染错误', en: 'Field render error', de: 'Feld-Renderfehler' },

  // HVAC modes
  hvacCool: { zh: '❄️ 制冷', en: '❄️ Cool', de: '❄️ Kühlen' },
  hvacHeat: { zh: '🔥 制热', en: '🔥 Heat', de: '🔥 Heizen' },
  hvacFanOnly: { zh: '🌀 送风', en: '🌀 Fan Only', de: '🌀 Nur Lüfter' },
  hvacDry: { zh: '💧 除湿', en: '💧 Dry', de: '💧 Trocknen' },
  hvacAuto: { zh: '🤖 自动', en: '🤖 Auto', de: '🤖 Auto' },
  hvacOff: { zh: '关', en: 'Off', de: 'Aus' },

  // Sidebar Toggle
  toggleSidebar: { zh: '切换侧边栏', en: 'Toggle sidebar', de: 'Seitenleiste umschalten' },

  // Issue Report
  reportIssue: { zh: '提交 Issue', en: 'Report Issue', de: 'Problem melden' },
  reportIssueDesc: { zh: '提交 GitHub Issue（自动附错误日志）', en: 'Submit GitHub issue (auto-attach error logs)', de: 'GitHub-Issue einreichen (Fehlerprotokolle automatisch anhängen)' },
  issueTitle: { zh: 'Issue 标题', en: 'Issue Title', de: 'Issue-Titel' },
  issueTitlePlaceholder: { zh: '简要描述问题...', en: 'Briefly describe the issue...', de: 'Problem kurz beschreiben...' },
  issueBody: { zh: '补充说明（可选）', en: 'Additional details (optional)', de: 'Weitere Details (optional)' },
  issueConfirm: { zh: '确认提交', en: 'Submit Issue', de: 'Issue einreichen' },
  issueCancel: { zh: '取消', en: 'Cancel', de: 'Abbrechen' },
  issueSubmitting: { zh: '正在提交 Issue...', en: 'Submitting issue...', de: 'Reiche Issue ein...' },
  issueSuccess: { zh: 'Issue #{n} 已创建', en: 'Issue #{n} created', de: 'Issue #{n} erstellt' },
  issueFailed: { zh: 'Issue 提交失败', en: 'Failed to create issue', de: 'Issue-Erstellung fehlgeschlagen' },
  issueNotLoggedIn: { zh: '请先登录 GitHub（设置 → GitHub Token）', en: 'Please login to GitHub first (Settings → GitHub Token)', de: 'Bitte zuerst bei GitHub anmelden (Einstellungen → GitHub-Token)' },

  // Missing keys audit fix
  loadingUpdates: { zh: '正在加载更新...', en: 'Loading updates...', de: 'Lade Aktualisierungen...' },
  processing: { zh: '处理中...', en: 'Processing...', de: 'Verarbeite...' },

  // updates.js — skipped versions
  confirmSkipVersion: { zh: '确定要跳过 {n} 个仓库的当前版本？下个新版本会正常提醒。', en: 'Skip current version for {n} repos? Next new version will notify normally.', de: 'Aktuelle Version für {n} Repositorys überspringen? Nächste neue Version benachrichtigt normal.' },
  skipVersionDone: { zh: '已跳过 {ok}/{total} 个版本', en: 'Skipped {ok}/{total} versions', de: '{ok}/{total} Versionen übersprungen' },
  confirmUnskipVersion: { zh: '确定取消跳过 {name} 的版本 {ver}？', en: 'Unskip version {ver} of {name}?', de: 'Überspringen von Version {ver} von {name} rückgängig?' },
  unskipVersionFailed: { zh: '取消跳过失败', en: 'Unskip failed', de: 'Rückgängig fehlgeschlagen' },
  showSkipped: { zh: '显示已跳过更新', en: 'Show skipped updates', de: 'Übersprungene anzeigen' },
  hideSkipped: { zh: '隐藏已跳过更新', en: 'Hide skipped updates', de: 'Übersprungene ausblenden' },
  skippedVersionLabel: { zh: '已跳过版本', en: 'Skipped Versions', de: 'Übersprungene Versionen' },
  skippedVersionCount: { zh: '{n} 个 · 点击按钮可隐藏', en: '{n} items · Click button to hide', de: '{n} Einträge · Klicken zum Ausblenden' },
  skippedBadge: { zh: '🔇 已跳过', en: '🔇 Skipped', de: '🔇 Übersprungen' },
  skippedVersionTitle: { zh: '跳过的版本', en: 'Skipped version', de: 'Übersprungene Version' },
  unskipBtn: { zh: '取消跳过', en: 'Unskip', de: 'Rückgängig' },

  // hacs-vision-panel.js — Issue submission
  issueRestore: { zh: '还原', en: 'Restore', de: 'Wiederherstellen' },
  issueExpand: { zh: '放大', en: 'Expand', de: 'Vergrößern' },
  haVersion: { zh: 'HA 版本', en: 'HA Version', de: 'HA-Version' },
  repoVersion: { zh: '集成版本', en: 'Integration Version', de: 'Integrationsversion' },
  repoDomain: { zh: '领域', en: 'Domain', de: 'Bereich' },
  relatedLogs: { zh: '相关日志', en: 'Related logs', de: 'Verwandte Logs' },
  noRelatedLogs: { zh: '(无相关错误日志)', en: '(No related error logs)', de: '(Keine verwandten Fehler-Logs)' },
  cantGetPreview: { zh: '(无法获取预览信息)', en: '(Cannot get preview info)', de: '(Keine Vorschauinfo verfügbar)' },
  previewLoadFailed: { zh: '(预览加载失败)', en: '(Preview load failed)', de: '(Vorschauladen fehlgeschlagen)' },
  fileTooLarge: { zh: '{name} 过大（>5MB），已跳过', en: '{name} too large (>5MB), skipped', de: '{name} zu groß (>5MB), übersprungen' },
  screenshotsSelected: { zh: '✓ 已选 {n} 张截图', en: '✓ {n} screenshot(s) selected', de: '✓ {n} Screenshot(s) ausgewählt' },
  enterIssueTitle: { zh: '请输入 Issue 标题', en: 'Please enter an issue title', de: 'Bitte geben Sie einen Issue-Titel ein' },
  submitting: { zh: '提交中…', en: 'Submitting…', de: 'Sende…' },
  submittingIssue: { zh: '正在提交 Issue...', en: 'Submitting issue...', de: 'Sende Issue...' },
  retry: { zh: '重试', en: 'Retry', de: 'Wiederholen' },
  addScreenshots: { zh: '添加上传截图（可选，可多选）', en: 'Add screenshots (optional, multiple)', de: 'Screenshots hinzufügen (optional, mehrere)' },
  previewContent: { zh: '📋 预览提交内容（含自动收集的日志）', en: '📋 Preview content (with auto-collected logs)', de: '📋 Vorschau (mit automatisch gesammelten Logs)' },

  // config-flow-dialog.js — password toggle
  togglePasswordShow: { zh: '显示', en: 'Show', de: 'Anzeigen' },
  togglePasswordHide: { zh: '隐藏', en: 'Hide', de: 'Ausblenden' },

  // Batch operations
  batchSkip: { zh: '批量跳过', en: 'Skip Selected', de: 'Ausgewählte überspringen' },

  // OAuth
  oauthError: { zh: 'OAuth 错误', en: 'OAuth Error', de: 'OAuth-Fehler' },

  // Input placeholders
  inputRepoPlaceholder: { zh: 'owner/repo、GitHub URL 或组织名', en: 'owner/repo, GitHub URL or org name', de: 'owner/repo, GitHub-URL oder Organisationsname' },

  // Auto-update settings (config-view.js)
  autoUpdateSection: { zh: '自动更新', en: 'Auto Update', de: 'Automatisches Update' },
  autoUpdateEnabled: { zh: '启用自动更新', en: 'Enable Auto Update', de: 'Automatisches Update aktivieren' },
  autoUpdateEnabledDesc: { zh: '按设定间隔自动检查并更新已安装的仓库', en: 'Automatically check and update installed repos at set intervals', de: 'Automatisch nach Updates suchen und installieren' },
  autoUpdateInterval: { zh: '检查间隔', en: 'Check Interval', de: 'Prüfintervall' },
  autoUpdateIntervalDesc: { zh: '两次自动更新之间的最小间隔时间', en: 'Minimum time between auto-update cycles', de: 'Mindestabstand zwischen Update-Zyklen' },
  autoUpdateInterval1h: { zh: '1 小时', en: '1 hour', de: '1 Stunde' },
  autoUpdateInterval3h: { zh: '3 小时', en: '3 hours', de: '3 Stunden' },
  autoUpdateInterval6h: { zh: '6 小时', en: '6 hours', de: '6 Stunden' },
  autoUpdateInterval12h: { zh: '12 小时', en: '12 hours', de: '12 Stunden' },
  autoUpdateInterval24h: { zh: '24 小时', en: '24 hours', de: '24 Stunden' },
  autoUpdateNotify: { zh: '更新通知', en: 'Update Notifications', de: 'Update-Benachrichtigungen' },
  autoUpdateNotifyDesc: { zh: '每次自动更新完成后发送 HA 通知', en: 'Send a HA notification after each auto-update cycle', de: 'Benachrichtigung nach jedem Update-Zyklus senden' },
  autoUpdateRestartTime: { zh: '预约重启', en: 'Scheduled Restart', de: 'Geplanter Neustart' },
  autoUpdateRestartTimeDesc: { zh: '设置自动重启时间（HH:MM），更新完成后将在指定时间重启 HA。留空不自动重启', en: 'Set restart time (HH:MM). HA will restart at this time after updates are installed. Leave empty to disable', de: 'Neustart-Zeit (HH:MM). HA wird nach Updates um diese Zeit neu gestartet. Leer lassen zum Deaktivieren' },
  autoUpdateRepos: { zh: '白名单仓库', en: 'Whitelisted Repos', de: 'Weiße Liste' },
  autoUpdateReposDesc: { zh: '每行一个 owner/repo，仅白名单中的仓库会被自动更新', en: 'One owner/repo per line. Only whitelisted repos will be auto-updated', de: 'Ein owner/repo pro Zeile. Nur gelistete Repositorys werden aktualisiert' },
  autoUpdateReposPlaceholder: { zh: 'owner/repo1\nowner/repo2', en: 'owner/repo1\nowner/repo2', de: 'owner/repo1\nowner/repo2' },
  autoUpdateTrigger: { zh: '立即检查更新', en: 'Check Now', de: 'Jetzt prüfen' },
  autoUpdateTriggerDesc: { zh: '立即执行一次自动更新检查', en: 'Trigger an auto-update cycle immediately', de: 'Sofort einen Update-Zyklus ausführen' },
  autoUpdateReload: { zh: '重载设置', en: 'Reload Settings', de: 'Einstellungen neu laden' },
  autoUpdateReloadDesc: { zh: '重新读取设置并调整定时调度', en: 'Reload settings and reschedule', de: 'Einstellungen neu laden und Zeitplan anpassen' },
  autoUpdateRunning: { zh: '运行中...', en: 'Running...', de: 'Läuft...' },
  autoUpdateScheduled: { zh: '已调度', en: 'Scheduled', de: 'Geplant' },
  autoUpdateStopped: { zh: '未运行', en: 'Not Running', de: 'Nicht aktiv' },
  autoUpdateDone: { zh: '自动更新完成', en: 'Auto-update complete', de: 'Automatisches Update abgeschlossen' },
  autoUpdateTriggered: { zh: '已触发自动更新', en: 'Auto-update triggered', de: 'Update ausgelöst' },
  autoUpdateReloaded: { zh: '设置已重载', en: 'Settings reloaded', de: 'Einstellungen neu geladen' },
  autoUpdateTriggerFailed: { zh: '触发自动更新失败', en: 'Failed to trigger auto-update', de: 'Update auslösen fehlgeschlagen' },
  autoUpdateReloadFailed: { zh: '重载设置失败', en: 'Failed to reload settings', de: 'Einstellungen neu laden fehlgeschlagen' },
  autoUpdateEnabledText: { zh: '自动更新已开启', en: 'Auto-update ON', de: 'Auto-Update EIN' },
  autoUpdateDisabledText: { zh: '点击开启自动更新', en: 'Enable auto-update', de: 'Auto-Update aktivieren' },
  autoUpdateToggledOn: { zh: ' 自动更新已开启', en: ' auto-update enabled', de: ' Auto-Update aktiviert' },
  autoUpdateToggledOff: { zh: ' 自动更新已关闭', en: ' auto-update disabled', de: ' Auto-Update deaktiviert' },
  autoUpdateToggleFailed: { zh: '自动更新设置失败', en: 'Auto-update setting failed', de: 'Auto-Update-Einstellung fehlgeschlagen' },
  whitelistSaved: { zh: '白名单已保存', en: 'Whitelist saved', de: 'Whitelist gespeichert' },
  whitelistSaveFailed: { zh: '保存失败', en: 'Save failed', de: 'Speichern fehlgeschlagen' },
  updateQueued: { zh: '更新已排队，将在当前周期完成后执行', en: 'Update queued, will run after current cycle completes', de: 'Update in Warteschlange, läuft nach aktuellem Zyklus' },
  noReposAdded: { zh: '暂未添加仓库', en: 'No repos added yet', de: 'Noch keine Repositorys hinzugefügt' },
  noReposSelected: { zh: '暂未选择仓库', en: 'No repos selected', de: 'Keine Repositorys ausgewählt' },
  selectedCount: { zh: '{n} / {total} 已选', en: '{n} / {total} selected', de: '{n} / {total} ausgewählt' },
  searchToAdd: { zh: '输入仓库名搜索添加...', en: 'Search repos to add...', de: 'Repositorys zum Hinzufügen suchen...' },
  loadingRepos: { zh: '正在加载已安装仓库...', en: 'Loading installed repos...', de: 'Installierte Repositorys laden...' },
  noInstalledRepos: { zh: '尚未安装任何仓库', en: 'No repos installed', de: 'Keine Repositorys installiert' },
  allInWhitelist: { zh: '没有可添加的仓库（所有已安装仓库已在白名单中）', en: 'No repos to add (all installed repos are already in whitelist)', de: 'Keine Repositorys zum Hinzufügen (alle installierten sind bereits in der Whitelist)' },
  prevPage: { zh: '‹ 上一页', en: '‹ Prev', de: '‹ Zurück' },
  nextPage: { zh: '下一页 ›', en: 'Next ›', de: 'Weiter ›' },

  // Update history
  sectionUpdatable: { zh: '可更新', en: 'Updatable', de: 'Aktualisierbar' },
  sectionUpdated: { zh: '已更新', en: 'Updated', de: 'Aktualisiert' },
  sectionSkipped: { zh: '已略过', en: 'Skipped', de: 'Übersprungen' },
  updatedLabel: { zh: '已更新', en: 'Updated', de: 'Aktualisiert' },
  updatedFromTo: { zh: '{from} → {to}', en: '{from} → {to}', de: '{from} → {to}' },
  updatedAt: { zh: '更新于', en: 'Updated at', de: 'Aktualisiert am' },
  updatedTimeAgo: { zh: '{ago}前', en: '{ago} ago', de: 'vor {ago}' },
  justNow: { zh: '刚刚', en: 'just now', de: 'gerade eben' },
  minAgo: { zh: '{n}分钟', en: '{n}m', de: '{n} Min.' },
  hourAgo: { zh: '{n}小时', en: '{n}h', de: '{n} Std.' },
  dayAgo: { zh: '{n}天', en: '{n}d', de: '{n} T.' },
  noUpdateHistory: { zh: '暂无更新记录', en: 'No update history', de: 'Keine Update-Verlauf' },

  // Card preview
  previewTitle: { zh: '预览', en: 'Preview', de: 'Vorschau' },
  preview: { zh: '预览', en: 'Preview', de: 'Vorschau' },
  previewLoading: { zh: '正在加载插件...', en: 'Loading plugin...', de: 'Plugin wird geladen...' },
  previewNoRepo: { zh: '未指定仓库', en: 'No repository specified', de: 'Kein Repository angegeben' },
  previewNoJs: { zh: '未找到插件 JS 文件', en: 'Plugin JS file not found', de: 'Plugin-JS-Datei nicht gefunden' },
};

/* ── Translation Lookup ─────────────────────────────────── */

/**
 * Get translated text by key.
 * @param {string} key - Translation key
 * @param {object} [params] - Optional interpolation params, e.g. { n: 3 } replaces {n}
 * @returns {string} Translated text
 */
export function t(key, params) {
  const entry = T[key];
  if (!entry) return key;
  const lang = _USER_LANG || _LANG || 'en';
  let text = entry[lang] || entry.en || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.split(`{${k}}`).join(v);
    }
  }
  return text;
}

/* ── Language Setter API ────────────────────────────────── */

/**
 * Set language from HA hass object (called when panel receives hass).
 * Only updates the HA auto-detected language. User override takes priority.
 * @param {object} hass - HA hass object
 */
export function setLangFromHass(hass) {
  if (hass?.language) {
    _HA_LANG = detectLang(hass.language);
    if (!_USER_LANG) {
      _LANG = _HA_LANG;
    }
  }
}

/**
 * Set language by user choice (from settings UI).
 * Pass null/empty to clear override and fall back to HA auto-detect.
 * @param {string|null} lang - Language code ('en', 'zh', 'de', or null/'' for auto)
 */
export function setLang(lang) {
  if (lang && LANGUAGES[lang]) {
    _USER_LANG = lang;
    _LANG = lang;
  } else {
    _USER_LANG = null;
    _LANG = _HA_LANG || 'en';
  }
  // Notify all components to re-render with new language
  window.dispatchEvent(new CustomEvent('hacs-lang-changed', { detail: { lang: getLang() } }));
  _refreshAllComponents();
}

/**
 * Get current effective language code.
 * @returns {string} 'en', 'zh', 'de', etc.
 */
export function getLang() {
  return _USER_LANG || _LANG || 'en';
}

/**
 * Force-render all HACS Vision components in the DOM after language change.
 * Called by setLang() to ensure every view re-renders with the new language.
 */
function _refreshAllComponents() {
  const tags = ['browse-view', 'updates-view', 'management-view',
    'config-view', 'integrations-list', 'config-flow-dialog', 'repo-card'];
  for (const tag of tags) {
    try {
      for (const el of document.querySelectorAll(tag)) {
        if (typeof el.requestUpdate === 'function') el.requestUpdate();
      }
    } catch (e) { /* ignore cross-root or detached elements */ }
  }
  // Also refresh the main panel
  try {
    const panel = document.querySelector('hacs-vision-panel');
    if (panel && typeof panel.requestUpdate === 'function') panel.requestUpdate();
  } catch (e) { /* ignore */ }
}

/**
 * Check if user has set a manual language override.
 * @returns {boolean}
 */
export function hasUserLang() {
  return _USER_LANG !== null && _USER_LANG !== undefined;
}

export default { t, getLang, setLangFromHass, setLang, getAvailableLanguages, hasUserLang };
