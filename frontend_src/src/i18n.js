/**
 * i18n module for HACS Vision
 * Detects HA language and provides translations
 */

let _LANG = (() => {
  try {
    const top = window.top || window.parent;
    const haEl = top?.document?.querySelector('home-assistant');
    if (haEl?.hass?.language) {
      return haEl.hass.language.indexOf('zh') === 0 ? 'zh' : 'en';
    }
    const dl = top?.document?.documentElement?.lang || '';
    return dl.indexOf('zh') === 0 ? 'zh' : 'en';
  } catch (e) { /* cross-origin */ }
  try {
    return navigator.language?.indexOf('zh') === 0 ? 'zh' : 'en';
  } catch (e) { return 'en'; }
})();

const T = {
  // Header
  storeTitle: { zh: 'HACS Vision', en: 'HACS Vision' },
  storeSubtitle: { zh: '浏览、管理和更新 HACS 仓库', en: 'Browse, manage and update HACS repositories' },
  statInstalled: { zh: '已安装', en: 'Installed' },
  statUpdates: { zh: '可更新', en: 'Updates' },
  statFavorites: { zh: '收藏', en: 'Favorites' },
  statCustom: { zh: '自定义', en: 'Custom' },
  statRepos: { zh: '仓库数', en: 'Repos' },

  // Tabs
  tabBrowse: { zh: '商店', en: 'Store' },
  tabFavorites: { zh: '收藏', en: 'Favorites' },
  tabCustom: { zh: '自定义', en: 'Custom' },
  tabInstalled: { zh: '已安装', en: 'Installed' },
  tabUpdates: { zh: '更新', en: 'Updates' },
  tabConfig: { zh: '配置', en: 'Config' },
  tabBackup: { zh: '备份', en: 'Backup' },
  tabManagement: { zh: '仓库管理', en: 'Repository' },

  // Browse
  searchPlaceholder: { zh: '搜索仓库...', en: 'Search repositories...' },
  searchInstalled: { zh: '搜索已安装...', en: 'Search installed...' },
  searchUpdates: { zh: '搜索可更新的仓库...', en: 'Search for updates...' },
  // Filter groups (HACS-style: Status + Type + our extras)
  filterStatus: { zh: '状态', en: 'Status' },
  filterType: { zh: '类型', en: 'Type' },
  statusAll: { zh: '全部', en: 'All' },
  statusInstalled: { zh: '已安装', en: 'Installed' },
  statusNotInstalled: { zh: '未安装', en: 'Not Installed' },
  statusUpdateAvailable: { zh: '可更新', en: 'Update Available' },
  statusFavorites: { zh: '已收藏', en: 'Favorited' },
  statusNew: { zh: '新发现', en: 'New' },
  statusCustom: { zh: '自定义', en: 'Custom' },
  statusPendingRestart: { zh: '待重启', en: 'Pending Restart' },
  statusPendingUpgrade: { zh: '可更新', en: 'Update Available' },
  statusDefault: { zh: '未安装', en: 'Available' },
  typeAll: { zh: '全部', en: 'All' },
  typeIntegration: { zh: '集成', en: 'Integration' },
  typePlugin: { zh: '插件', en: 'Plugin' },
  typeTheme: { zh: '主题', en: 'Theme' },
  typeAppDaemon: { zh: 'AppDaemon', en: 'AppDaemon' },
  typeNetDaemon: { zh: 'NetDaemon', en: 'NetDaemon' },
  typePython: { zh: 'Python', en: 'Python' },
  typeTemplate: { zh: '模板', en: 'Template' },

  sortByStars: { zh: '按星数', en: 'By Stars' },
  sortByUpdated: { zh: '最近更新', en: 'Recently Updated' },
  sortByName: { zh: '按名称', en: 'By Name' },
  catAll: { zh: '全部', en: 'All' },
  catIntegration: { zh: '集成', en: 'Integration' },
  catPlugin: { zh: '插件', en: 'Plugin' },
  catTheme: { zh: '主题', en: 'Theme' },
  catAppDaemon: { zh: 'AppDaemon', en: 'AppDaemon' },
  catNetDaemon: { zh: 'NetDaemon', en: 'NetDaemon' },
  catPython: { zh: 'Python', en: 'Python' },
  catTemplate: { zh: '模板', en: 'Template' },
  catDashboard: { zh: '卡片', en: 'Cards' },
  totalRepos: { zh: '个仓库', en: 'repositories' },
  noMatch: { zh: '没有匹配的仓库', en: 'No matching repositories' },
  noData: { zh: '暂无仓库数据', en: 'No repository data' },
  loading: { zh: '加载中...', en: 'Loading...' },
  prevPage: { zh: '← 上一页', en: '← Previous' },
  nextPage: { zh: '下一页 →', en: 'Next →' },
  page: { zh: '第', en: 'Page' },
  of: { zh: '/ ', en: ' / ' },

  // Repo Card
  installed: { zh: '已安装', en: 'Installed' },
  install: { zh: '安装', en: 'Install' },
  update: { zh: '更新', en: 'Update' },
  remove: { zh: '卸载', en: 'Uninstall' },
  detail: { zh: '详情', en: 'Detail' },
  noDesc: { zh: '暂无描述', en: 'No description' },
  favOn: { zh: '已收藏', en: 'Favorited' },
  favOff: { zh: '收藏', en: 'Favorite' },

  // Installed
  canUpdate: { zh: '可更新', en: 'Updatable' },
  allTypes: { zh: '全部类型', en: 'All Types' },
  refresh: { zh: '刷新', en: 'Refresh' },
  noInstalled: { zh: '暂无已安装仓库', en: 'No installed repositories' },
  noMatchInstalled: { zh: '没有匹配的已安装仓库', en: 'No matching installed repos' },
  totalInstalled: { zh: '个已安装仓库', en: 'installed repositories' },
  confirmRemove: { zh: '确定要卸载', en: 'Are you sure to uninstall' },
  removed: { zh: '已卸载', en: 'Uninstalled' },
  removeFailed: { zh: '卸载失败', en: 'Uninstall failed' },
  updating: { zh: '更新中...', en: 'Updating...' },

  // Updates
  checkingUpdates: { zh: '检查更新...', en: 'Checking updates...' },
  allUpToDate: { zh: '所有仓库已是最新版本', en: 'All repositories are up to date' },
  totalUpdates: { zh: '个可更新仓库', en: 'repositories can be updated' },
  updateAll: { zh: '全部更新', en: 'Update All' },
  updateSelected: { zh: '更新已选', en: 'Update Selected' },
  updateAllNow: { zh: '全部更新', en: 'Update All' },
  currentVersion: { zh: '当前版本', en: 'Current' },
  latestVersion: { zh: '最新版本', en: 'Latest' },
  updateNow: { zh: '立即更新', en: 'Update Now' },
  confirmUpdateAll: { zh: '确定要更新全部', en: 'Update all' },
  allUpdatesStarted: { zh: '全部更新已开始', en: 'All updates started' },
  updateStarted: { zh: '已开始更新', en: 'Update started' },
  updateFailed: { zh: '更新失败', en: 'Update failed' },
  selectAll: { zh: '全选', en: 'Select All' },

  // Config
  customRepos: { zh: '自定义仓库', en: 'Custom Repositories' },
  noCustomRepos: { zh: '暂无自定义仓库', en: 'No custom repositories' },
  noCustomReposHint: { zh: '点击下方按钮添加自定义仓库，或从浏览页安装', en: 'Click below to add a custom repo, or install from Browse' },
  customReposDesc: { zh: '管理 HACS 自定义仓库列表。添加后可在商店中搜索到。', en: 'Manage custom repository list. Once added, they become searchable in Store.' },
  addRepo: { zh: '添加仓库', en: 'Add Repository' },
  addSuccess: { zh: '添加成功', en: 'Added successfully' },
  invalidRepoUrl: { zh: '无效的仓库地址，请输入 owner/repo 格式或 GitHub URL', en: 'Invalid repository URL, use owner/repo format or GitHub URL' },
  addCustomRepo: { zh: '添加自定义仓库', en: 'Add Custom Repository' },
  repoUrl: { zh: '仓库 URL (如: https://github.com/user/repo)', en: 'Repository URL (e.g. https://github.com/user/repo)' },
  add: { zh: '添加', en: 'Add' },
  cancel: { zh: '取消', en: 'Cancel' },
  addFailed: { zh: '添加失败', en: 'Add failed' },
  removeRepo: { zh: '移除', en: 'Remove' },
  confirmRemoveRepo: { zh: '确定要移除自定义仓库', en: 'Remove custom repository' },
  removeRepoFailed: { zh: '移除失败', en: 'Remove failed' },
  notInstalled: { zh: '未安装', en: 'Not installed' },
  alreadyExists: { zh: '已在列表中', en: 'already exists' },
  customBadge: { zh: '自定义', en: 'Custom' },
  archivedRepos: { zh: '已归档仓库', en: 'Archived Repositories' },
  noArchived: { zh: '暂无归档仓库', en: 'No archived repositories' },
  renamedRepos: { zh: '已重命名仓库', en: 'Renamed Repositories' },
  noRenamed: { zh: '暂无重命名仓库', en: 'No renamed repositories' },
  ignoredRepos: { zh: '已忽略仓库', en: 'Ignored Repositories' },
  noIgnored: { zh: '暂无忽略仓库', en: 'No ignored repositories' },
  removeArchived: { zh: '移除归档', en: 'Remove Archived' },
  removeRenamed: { zh: '移除重命名', en: 'Remove Renamed' },
  replace: { zh: '替换', en: 'Replace' },
  viewDetail: { zh: '查看详情', en: 'View Detail' },
  confirmRemoveArchived: { zh: '将永久清除归档仓库的全部数据记录', en: 'Permanently clear all data records for this archived repo' },
  confirmRemoveRenamed: { zh: '将永久清除重命名记录的全部数据记录', en: 'Permanently clear all data records for this renamed repo' },
  confirmReplaceRenamed: { zh: '将替换仓库', en: 'Replace repository' },
  replaceRenamedWarning: { zh: '（将卸载旧仓库并安装新仓库）', en: ' (will uninstall old, install new)' },
  viewOnGithub: { zh: '在 GitHub 中查看', en: 'View on GitHub' },

  // Backup
  exportBackup: { zh: '导出备份', en: 'Export Backup' },
  exportDesc: { zh: '将 HACS 配置、已安装仓库列表和自定义仓库设置导出为 JSON 文件。导出后可在新环境中导入恢复。', en: 'Export HACS config, installed repositories and custom repo settings as JSON. Can be imported in new environments.' },
  exportBtn: { zh: '导出备份', en: 'Export Backup' },
  exporting: { zh: '导出中...', en: 'Exporting...' },
  exportSuccess: { zh: '备份导出成功', en: 'Backup exported successfully' },
  exportFailed: { zh: '导出失败', en: 'Export failed' },
  importBackup: { zh: '导入备份', en: 'Import Backup' },
  importDesc: { zh: '从之前导出的 JSON 备份文件恢复 HACS 配置。注意：导入会覆盖当前配置。', en: 'Restore HACS config from a previously exported JSON backup. Note: Import will overwrite current config.' },
  importBtn: { zh: '导入备份', en: 'Import Backup' },
  importing: { zh: '导入中...', en: 'Importing...' },
  importSuccess: { zh: '备份导入成功', en: 'Backup imported successfully' },
  importFailed: { zh: '导入失败', en: 'Import failed' },
  depCheck: { zh: '依赖检查', en: 'Dependency Check' },
  depDesc: { zh: '检查 HACS Vision 的系统依赖是否完整安装。', en: 'Check if HACS Vision system dependencies are fully installed.' },
  checkDep: { zh: '检查依赖', en: 'Check Dependencies' },
  depOk: { zh: '所有依赖正常', en: 'All dependencies OK' },
  depMissing: { zh: '部分依赖缺失', en: 'Some dependencies missing' },
  checkFailed: { zh: '检查失败', en: 'Check failed' },

  // Favorites
  noFavorites: { zh: '暂无收藏', en: 'No favorites yet' },
  noFavoritesHint: { zh: '在浏览页点击卡片右上角的 ☆ 收藏仓库', en: 'Click ☆ on the top-right of cards to favorite repositories' },
  clearAll: { zh: '清空收藏', en: 'Clear All' },
  confirmClear: { zh: '确定要清空所有收藏吗？', en: 'Clear all favorites?' },
  favoritesCleared: { zh: '已清空收藏', en: 'Favorites cleared' },

  // Detail Modal
  openGithub: { zh: '在 GitHub 中打开', en: 'Open in GitHub' },
  description: { zh: '描述', en: 'Description' },
  version: { zh: '版本', en: 'Version' },
  downloads: { zh: '下载量', en: 'Downloads' },
  stars: { zh: '星数', en: 'Stars' },
  category: { zh: '分类', en: 'Category' },
  close: { zh: '关闭', en: 'Close' },
  unknown: { zh: '未知', en: 'unknown' },
  search: { zh: '搜索', en: 'Search' },
  refreshTitle: { zh: '刷新', en: 'Refresh' },
  totalPrefix: { zh: '共', en: 'Total' },

  // Connection
  connectFailed: { zh: '连接 HACS 失败', en: 'Failed to connect to HACS' },
  waitingHA: { zh: '等待 HA 连接...', en: 'Waiting for HA connection...' },

  // Confirm Dialog
  confirm: { zh: '确认', en: 'Confirm' },
  confirmDelete: { zh: '确认删除', en: 'Confirm Delete' },
  confirmUpdate: { zh: '确认更新', en: 'Confirm Update' },

  // README
  loadingReadme: { zh: '加载 README...', en: 'Loading README...' },
  readmeLoadFailed: { zh: 'README 加载失败', en: 'README load failed' },
  readmeTitle: { zh: '说明文档', en: 'README' },

  // Detail Modal
  dblZoomHint: { zh: '双击放大', en: 'Double-click to expand' },

  // F2: Network Status
  networkOffline: { zh: '网络连接已断开，请检查网络', en: 'Network disconnected — check your connection' },
  networkRestored: { zh: '网络已恢复', en: 'Network restored' },
  haRestarting: { zh: 'Home Assistant 正在重启，请稍候...', en: 'Home Assistant is restarting, please wait...' },
  rateLimited: { zh: 'GitHub API 限流，请稍后重试', en: 'GitHub API rate limited — try again later' },

  // Restart HA button
  restartHA: { zh: '重启', en: 'Restart' },
  restartHATitle: { zh: '重启 Home Assistant', en: 'Restart Home Assistant' },
  restartConfirm: { zh: '确定要重启 Home Assistant 吗？面板将暂时不可用。', en: 'Restart Home Assistant? The panel will be temporarily unavailable.' },
  restartFailed: { zh: '重启失败', en: 'Restart failed' },

  // F3: Progress Indicators
  installing: { zh: '安装中…', en: 'Installing…' },
  installComplete: { zh: '已安装', en: 'Installed' },
  installFailed: { zh: '安装失败', en: 'Install failed' },
  updatingProgress: { zh: '更新中…', en: 'Updating…' },
  updateComplete: { zh: '已更新', en: 'Updated' },

  // F4: Quick Install
  quickInstall: { zh: '快捷安装', en: 'Quick Install' },
  quickInstallPlaceholder: { zh: '粘贴 GitHub URL 或 owner/repo', en: 'Paste GitHub URL or owner/repo' },
  quickInstallCategory: { zh: '分类', en: 'Category' },
  quickInstallUrl: { zh: '仓库 URL', en: 'Repository URL' },
  installRepo: { zh: '安装仓库', en: 'Install Repository' },

  // F6: Changelog
  changelogTitle: { zh: '更新内容', en: "What's New" },
  viewFullChangelog: { zh: '查看完整更新日志', en: 'View full changelog' },
  noChangelog: { zh: '暂无更新日志', en: 'No changelog available' },
  changelogShowMore: { zh: '展开', en: 'Show more' },
  changelogShowLess: { zh: '收起', en: 'Show less' },

  // View Mode & Grouping
  viewCard: { zh: '卡片', en: 'Cards' },
  viewList: { zh: '列表', en: 'List' },
  list: { zh: '列表', en: 'List' },
  groupBy: { zh: '分组', en: 'Group By' },
  groupNone: { zh: '不分组', en: 'No Grouping' },
  groupStatus: { zh: '按状态', en: 'By Status' },
  groupType: { zh: '按类型', en: 'By Type' },

  // Version Selector
  selectVersion: { zh: '选择版本', en: 'Select Version' },
  availableVersion: { zh: '可用版本', en: 'Available Version' },
  installVersion: { zh: '安装此版本', en: 'Install This Version' },
  prerelease: { zh: '预发布', en: 'Pre-release' },
  noReleases: { zh: '暂无发布版本', en: 'No releases available' },
  publishedAt: { zh: '发布于', en: 'Published' },

  // Tools
  tools: { zh: '工具', en: 'Tools' },
  toolsDesc: { zh: '导出、导入和依赖检查', en: 'Export, import and dependency check' },

  // Table columns (HACS-style)
  colName: { zh: '名称', en: 'Name' },
  colDownloads: { zh: '下载', en: 'Downloads' },
  colStars: { zh: '星数', en: 'Stars' },
  colLastUpdated: { zh: '更新', en: 'Updated' },
  colInstalledVer: { zh: '已安装', en: 'Installed' },
  colAvailableVer: { zh: '可用', en: 'Available' },
  colStatus: { zh: '状态', en: 'Status' },
  colInstalledAt: { zh: '安装时间', en: 'Installed At' },
  installedAt: { zh: '安装时间', en: 'Installed At' },
  today: { zh: '今天', en: 'Today' },
  yesterday: { zh: '昨天', en: 'Yesterday' },

  // Config tab
  tabSettings: { zh: '设置', en: 'Settings' },
  settingsTitle: { zh: '设置', en: 'Settings' },
  settingsDesc: { zh: '自定义 HACS Vision 的显示和行为', en: 'Customize HACS Vision look and behavior' },
  settingsRefreshInterval: { zh: '刷新间隔（秒）', en: 'Refresh interval (s)' },
  settingsDefaultView: { zh: '默认视图', en: 'Default view' },
  settingsNotifyUpdates: { zh: '推送更新通知', en: 'Push update notifications' },
  settingsNotifyRestart: { zh: '推送重启提醒', en: 'Push restart reminders' },
  settingsLanguage: { zh: '语言', en: 'Language' },
  settingsSaved: { zh: '设置已保存', en: 'Settings saved' },
  settingsSaveFailed: { zh: '设置保存失败', en: 'Settings save failed' },

  // Batch operations
  batchSelect: { zh: '批量选择', en: 'Batch select' },
  batchInstall: { zh: '批量安装', en: 'Batch install' },
  batchRemove: { zh: '批量卸载', en: 'Batch uninstall' },
  batchUpdate: { zh: '批量更新', en: 'Batch update' },
  batchSelected: { zh: '已选 {n} 个', en: '{n} selected' },
  batchInstallConfirm: { zh: '确定要批量安装 {n} 个仓库吗？', en: 'Install {n} repositories?' },
  batchRemoveConfirm: { zh: '确定要批量卸载 {n} 个仓库吗？', en: 'Uninstall {n} repositories?' },
  batchInProgress: { zh: '批量操作进行中…', en: 'Batch operation in progress…' },
  batchComplete: { zh: '批量操作完成', en: 'Batch complete' },

  // Quick Install
  quickInstallTitle: { zh: '快捷安装', en: 'Quick Install' },
  quickInstallDetected: { zh: '检测到 GitHub URL', en: 'Detected GitHub URL' },
  quickInstallDetectedDesc: { zh: '是否要安装此仓库？', en: 'Install this repository?' },
  quickInstallAuto: { zh: '自动识别', en: 'Auto detect' },

  // Add Integration Entry
  addIntegration: { zh: '配置', en: 'Configure' },
  addIntegrationHint: { zh: '配置此 HA 集成', en: 'Configure this HA integration' },
  addHAIntegration: { zh: '添加 HA 集成', en: 'Add HA Integration' },
  addHAIntegrationDesc: { zh: '搜索并添加 Home Assistant 内置或自定义集成', en: 'Search and add Home Assistant built-in or custom integrations' },
  searchIntegration: { zh: '搜索集成...', en: 'Search integration...' },
  noIntegrationMatch: { zh: '没有匹配的集成', en: 'No matching integration' },
  integrationCount: { zh: '个可用集成', en: 'available integrations' },

  // Check Updates + Notification
  checkUpdates: { zh: '检查更新', en: 'Check Updates' },
  checkUpdatesNotify: { zh: '检查并通知', en: 'Check & Notify' },
  updatesChecked: { zh: '检查完成，{n} 个可更新', en: 'Check done, {n} updates' },
  noUpdatesFound: { zh: '所有仓库已是最新', en: 'All repositories up to date' },
  notifySent: { zh: '通知已发送', en: 'Notification sent' },

  // Config flow
  flowTitle: { zh: '配置 HA 集成', en: 'Configure HA Integration' },
  flowTitleOptions: { zh: '选项配置', en: 'Options Configuration' },
  flowProcessing: { zh: '处理中...', en: 'Processing...' },
  flowStarting: { zh: '启动配置流程...', en: 'Starting configuration...' },
  flowSubmit: { zh: '提交', en: 'Submit' },

  flowSelectOption: { zh: '--- 请选择 ---', en: '--- Select ---' },
  flowOptionsNotSupported: { zh: '此集成无需配置', en: 'This integration does not require configuration' },
  flowHandlerNotFound: { zh: '未找到此集成的配置流程', en: 'Configuration handler not found' },
  flowAuthError: { zh: '认证失败，请刷新页面后重试', en: 'Authentication failed. Please refresh and try again' },
  flowTimeout: { zh: '配置超时，请重试', en: 'Configuration timed out, please try again' },
  // Entry selector (multiple entries)
  selectEntryTitle: { zh: '选择集成实例', en: 'Select Entry' },
  selectEntrySubtitle: { zh: '此集成有多个实例，请选择要配置的实例', en: 'Multiple instances found, please select one to configure' },
  currentEntry: { zh: '当前', en: 'Current' },
  flowSubmitFailed: { zh: '提交失败', en: 'Submit failed' },
  flowUnknownType: { zh: '集成返回了未知流程类型（{type}），请前往设备与服务完成配置。', en: 'Unknown flow type ({type}). Please configure in Devices & Services.' },
  flowExternalAuth: { zh: '此集成需要外部认证，请在打开的页面中完成授权。', en: 'This integration requires external authentication. Please complete authorization in the opened page.' },
  flowStepNext: { zh: '下一步', en: 'Next' },
  flowStepFinish: { zh: '完成', en: 'Finish' },
  flowCancel: { zh: '取消', en: 'Cancel' },
  flowClose: { zh: '关闭', en: 'Close' },
  flowDone: { zh: '完成', en: 'Done' },
  flowGotIt: { zh: '知道了', en: 'Got it' },

  flowResultCreated: { zh: '配置完成', en: 'Setup Complete' },
  flowResultCreatedDesc: { zh: '集成已成功添加到设备与服务', en: 'Integration has been added to Devices & Services' },
  flowResultAborted: { zh: '无需配置', en: 'Skipped' },
  flowResultAbortedDesc: { zh: '该集成已被跳过', en: 'Integration was skipped' },
  flowResultExternal: { zh: '外部认证', en: 'External Authentication' },
  flowResultExternalDesc: { zh: '请在外部页面完成授权。', en: 'Please authorize in the external page.' },
  flowResultFailed: { zh: '配置失败', en: 'Setup Failed' },
  flowResultFailedDesc: { zh: '请稍后在设备与服务中重试', en: 'Please retry in Devices & Services' },
  flowAbortAlreadyConfigured: { zh: '该集成已在设备与服务中配置', en: 'Already configured in Devices & Services' },
  flowAbortSingleInstance: { zh: '此集成只允许配置一次', en: 'Only one instance allowed' },
  flowAbortNoDevices: { zh: '未找到可配置的设备', en: 'No devices found' },
  flowAbortInProgress: { zh: '已有进行中的流程', en: 'Flow already in progress' },
  flowOpenAuthPage: { zh: '打开认证页面 ↗', en: 'Open auth page ↗' },
};

/**
 * Get translated text by key
 * @param {string} key - Translation key
 * @param {object} [params] - Optional interpolation params, e.g. { n: 3 } replaces {n}
 * @returns {string} Translated text
 */
export function t(key, params) {
  const entry = T[key];
  if (!entry) return key;
  let text = entry[_LANG] || entry.zh || entry.en || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return text;
}

/**
 * Set language from HA hass object (called when panel receives hass)
 * @param {object} hass - HA hass object
 */
export function setLangFromHass(hass) {
  if (hass?.language) {
    _LANG = hass.language.indexOf('zh') === 0 ? 'zh' : 'en';
  }
}

/**
 * Get current language code
 * @returns {string} 'zh' or 'en'
 */
export function getLang() {
  return _LANG;
}

export default { t, getLang, setLangFromHass };
