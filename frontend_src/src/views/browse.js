import { LitElement, html, css } from 'lit';
import '../components/repo-card.js';
import { api } from '../api.js';
import { showToast } from '../hacs-vision-panel.js';
import { t } from '../i18n.js';
import { commonStyles } from '../shared/styles.js';
import { getCategoryColor } from '../shared/constants.js';
import { ConfirmDialog } from '../shared/confirm-dialog.js';

const BROWSE_STATE_KEY = 'hacs_vision_browse_state';
const VIEW_MODE_KEY = 'hacs_vision_view_mode';

function _loadBrowseState() {
  try { return JSON.parse(localStorage.getItem(BROWSE_STATE_KEY) || '{}'); } catch { return {}; }
}

function _saveBrowseState(state) {
  try { localStorage.setItem(BROWSE_STATE_KEY, JSON.stringify(state)); } catch {}
}

class BrowseView extends LitElement {
  static properties = {
    repos: { type: Array },
    total: { type: Number },
    search: { type: String },
    category: { type: String },
    statusFilter: { type: String },
    sort: { type: String },
    sortDir: { type: String },
    page: { type: Number },
    loading: { type: Boolean },
    categoryCounts: { type: Object },
    statusCounts: { type: Object },
    viewMode: { type: String },
    groupBy: { type: String },
    pageSize: { type: Number },
    _installingIds: { type: Object, state: true },
    _searchText: { type: String, state: true },
    _showAddRepo: { type: Boolean, state: true },
    _newRepoUrl: { type: String, state: true },
    _newRepoCategory: { type: String, state: true },
    _addRepoInstalling: { type: Boolean, state: true },
    _collapsedGroups: { type: Object, state: true },
    _filterExpanded: { type: Boolean, state: true },
    _favorites: { type: Array, state: true },
    presetFilter: { type: String },
    _selectedRepos: { type: Array, state: true },
    _batchMode: { type: Boolean, state: true },
  };

  constructor() {
    super();
    const saved = _loadBrowseState();
    this.repos = [];
    this.total = 0;
    this.search = saved.search || '';
    this.category = saved.category || '';
    this.statusFilter = saved.statusFilter || '';
    this.sort = saved.sort || 'stars';
    this.sortDir = saved.sortDir || 'desc';
    this.page = saved.page || 1;
    this.loading = false;
    this.limit = saved.pageSize || 50;
    this.pageSize = this.limit;
    this.categoryCounts = {};
    this.statusCounts = {};
    this._installingIds = {};
    this._searchTimer = undefined;
    this._searchText = saved.search || '';
    this.viewMode = localStorage.getItem(VIEW_MODE_KEY) || 'card';
    this.groupBy = saved.groupBy || 'none';
    this._showAddRepo = false;
    this._newRepoUrl = '';
    this._newRepoCategory = 'integration';
    this._addRepoInstalling = false;
    this._collapsedGroups = {};
    this._filterExpanded = false;
    this._favorites = [];
    this._selectedRepos = [];
    this._batchMode = false;

    this.statusOptions = [
      { value: '', label: t('statusAll') },
      { value: 'installed', label: t('statusInstalled') },
      { value: 'not_installed', label: t('statusNotInstalled') },
      { value: 'update_available', label: t('statusPendingUpgrade') },
      { value: 'favorites', label: t('statusFavorites') },
      { value: 'new', label: t('statusNew') },
      { value: 'custom', label: t('statusCustom') },
      { value: 'pending_restart', label: t('statusPendingRestart') },
    ];

    this.typeOptions = [
      { value: '', label: t('typeAll') },
      { value: 'integration', label: t('typeIntegration') },
      { value: 'plugin', label: t('typePlugin') },
      { value: 'theme', label: t('typeTheme') },
      { value: 'appdaemon', label: t('typeAppDaemon') },
      { value: 'netdaemon', label: t('typeNetDaemon') },
      { value: 'python_script', label: t('typePython') },
      { value: 'template', label: t('typeTemplate') },
    ];

    this.groupOptions = [
      { value: 'none', label: t('groupNone') },
      { value: 'status', label: t('groupStatus') },
      { value: 'type', label: t('groupType') },
    ];

    // HACS-style sortable columns for list view
    this.sortColumns = [
      { key: 'name', label: t('colName') || '名称', sortable: true },
      { key: 'downloads', label: t('colDownloads') || '下载', sortable: true },
      { key: 'stars', label: t('colStars') || '星数', sortable: true },
      { key: 'last_updated', label: t('colLastUpdated') || '更新时间', sortable: true },
      { key: 'installed_version', label: t('colInstalledVer') || '已安装', sortable: true },
      { key: 'latest_version', label: t('colAvailableVer') || '可用', sortable: true },
      { key: 'installed_at', label: t('colInstalledAt') || '安装时间', sortable: true },
      { key: 'status', label: t('colStatus') || '状态', sortable: true },
    ];
  }

  static styles = css`
    ${commonStyles}

    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    /* ===== Controls Bar ===== */
    .controls {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .controls-right {
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
    }
    .refresh-btn {
      padding: 8px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.25s; width: 36px; height: 36px;
      touch-action: manipulation; flex-shrink: 0;
    }
    .refresh-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .refresh-btn svg { width: 16px; height: 16px; }

    /* ===== Sort Bar (both card and list mode) ===== */
    .sort-bar {
      display: flex; align-items: center;
      margin-bottom: 10px; padding: 6px 14px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 8px; flex-wrap: wrap; gap: 4px;
    }
    .sort-chips {
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    }
    .sort-chip {
      padding: 4px 10px; border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 11px; transition: all 0.2s; white-space: nowrap;
      touch-action: manipulation;
    }
    .sort-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .sort-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .sort-chip .sort-dir { font-size: 9px; margin-left: 2px; }

    /* ===== View Mode Toggle ===== */
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

    /* ===== Group By Select ===== */
    .group-select {
      padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      font-size: 12px; cursor: pointer; outline: none; flex-shrink: 0;
    }

    /* ===== Filter Row ===== */
    .filter-row {
      display: flex; gap: 16px; margin-bottom: 10px; align-items: flex-start;
    }
    .filter-row .filter-group { margin-bottom: 0; flex: 1; min-width: 0; }

    /* ===== Filter Groups ===== */
    .filter-group { margin-bottom: 10px; }
    .filter-label {
      font-size: 11px; font-weight: 600; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
    }
    .filter-chips {
      display: flex; gap: 6px; flex-wrap: wrap;
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .filter-chips::-webkit-scrollbar { display: none; }
    .filter-chip {
      padding: 6px 12px; border: 1px solid var(--divider-color); border-radius: 18px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 12px; transition: all 0.25s; white-space: nowrap;
      touch-action: manipulation;
    }
    .filter-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Add Custom Repo ===== */
    .add-repo-form {
      margin-bottom: 14px; padding: 16px;
      border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color);
    }
    .form-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .form-input {
      flex: 1; padding: 10px 12px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none;
    }
    .form-input:focus { border-color: var(--primary-color); }
    .form-select {
      padding: 10px 12px; border: 1px solid var(--divider-color); border-radius: 10px;
      font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer; flex-shrink: 0;
    }
    .form-actions { display: flex; gap: 8px; }

    /* ===== List View (HACS-style data table) ===== */
    .list-view { width: 100%; overflow-x: auto; }
    .list-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: auto; }
    .list-table th {
      text-align: left; padding: 10px 8px; font-size: 11px; font-weight: 600;
      color: var(--secondary-text-color); text-transform: uppercase;
      border-bottom: 2px solid var(--divider-color); white-space: nowrap;
      user-select: none; letter-spacing: 0.3px;
    }
    .list-table th.sortable { cursor: pointer; touch-action: manipulation; }
    .list-table th.sortable:hover { color: var(--primary-color); }
    .list-table th .sort-arrow { font-size: 9px; margin-left: 3px; opacity: 0.5; }
    .list-table th.active-sort .sort-arrow { opacity: 1; color: var(--primary-color); }
    .list-table td {
      padding: 10px 8px; border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    .list-table .name-cell,
    .list-table .desc-cell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 0; }
    .list-table .name-cell { font-weight: 500; color: var(--primary-text-color); width: 100%; }
    .list-table .desc-cell { font-size: 11px; color: var(--secondary-text-color); }
    .custom-tag-list {
      display: inline-block; margin-top: 4px;
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: #ff6f00; color: #fff; font-weight: 700;
    }
    .topic-chips { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .topic-chip {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }
    .list-table tr { cursor: pointer; transition: background 0.15s; }
    .list-table tbody tr:hover { background: var(--secondary-background-color); }

    .list-table .col-icon { width: 40px; }
    .list-table .icon-cell {
      width: 32px; height: 32px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 14px; font-weight: 700;
      overflow: hidden;
    }
    .list-table .num-cell { font-size: 12px; color: var(--secondary-text-color); text-align: right; }
    .list-table .ver-cell { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; }
    .list-table .status-cell { font-size: 11px; }
    .status-badge {
      display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;
    }
    .status-badge.installed { background: rgba(76,175,80,0.15); color: #4caf50; }
    .status-badge.pending-upgrade { background: rgba(255,152,0,0.15); color: #ff9800; }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: #f44336; }
    .status-badge.new { background: rgba(33,150,243,0.15); color: #2196f3; }
    .status-badge.default { background: rgba(158,158,158,0.1); color: #9e9e9e; }
    .list-table .actions-cell { white-space: nowrap; }
    .action-sm {
      padding: 4px 8px; border-radius: 6px; font-size: 11px;
      border: 1px solid var(--divider-color); background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer; transition: all 0.2s;
      touch-action: manipulation;
    }
    .action-sm:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .action-sm.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }

    /* ===== Group Headers ===== */
    .group-header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; margin-top: 12px; margin-bottom: 4px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 8px; cursor: pointer; user-select: none;
      font-size: 13px; font-weight: 600; color: var(--primary-text-color);
      touch-action: manipulation;
    }
    .group-header:first-child { margin-top: 0; }
    .group-header .group-arrow { transition: transform 0.2s; font-size: 10px; }
    .group-header .group-arrow.collapsed { transform: rotate(-90deg); }
    .group-header .group-count { font-size: 11px; color: var(--secondary-text-color); font-weight: 400; margin-left: 4px; }

    /* ===== Pagination ===== */
    .pagination {
      display: flex; justify-content: center; align-items: center; gap: 12px;
      margin-top: 24px; padding: 12px 0;
    }
    .page-btn {
      padding: 8px 16px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 13px; transition: all 0.2s; touch-action: manipulation;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .page-size-select {
      padding: 6px 8px; border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color);
      font-size: 13px; margin-left: 8px; cursor: pointer;
    }
    .page-info { font-size: 13px; color: var(--secondary-text-color); }

    /* ===== Filter Toggle (mobile) ===== */
    .filter-toggle {
      display: none; width: 100%; padding: 10px 14px;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 13px; margin-bottom: 8px;
      justify-content: space-between; align-items: center;
      touch-action: manipulation;
    }
    .filter-toggle .toggle-arrow { transition: transform 0.2s; font-size: 10px; }
    .filter-toggle .toggle-arrow.expanded { transform: rotate(180deg); }
    .filter-toggle .active-filters {
      display: flex; gap: 4px; flex-wrap: wrap; margin-left: 8px;
    }
    .filter-toggle .active-filter-tag {
      font-size: 10px; padding: 2px 6px; border-radius: 8px;
      background: var(--primary-color); color: #fff;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .controls { gap: 4px; margin-bottom: 6px; flex-wrap: wrap; }
      .search input { padding: 7px 10px 7px 34px; font-size: 13px; border-radius: 8px; }
      .controls-right { flex-wrap: wrap; }
      .sort-bar { padding: 6px 10px; font-size: 12px; gap: 4px; }
      .sort-chip { padding: 4px 8px; font-size: 11px; }
      .filter-toggle { display: flex; }
      .filter-row:not(.expanded) { display: none; }
      .filter-row.expanded { display: flex; }
      .filter-row { flex-direction: column; gap: 8px; }
      .filter-row .filter-group { margin-bottom: 0; }
      .filter-chips { flex-wrap: wrap; gap: 3px; }
      .filter-chip { padding: 4px 8px; font-size: 11px; }
      .chip-count { min-width: 16px; height: 16px; font-size: 10px; }
      .page-btn { min-height: 44px; }
      .list-table .col-downloads,
      .list-table .col-stars,
      .list-table .col-installed-ver,
      .list-table .col-available-ver,
      .list-table .col-installed-at { display: none; }
    }

    @media (max-width: 480px) {
      .controls-right { gap: 4px; }
      .filter-chips { gap: 4px; }
      .filter-chip { padding: 4px 8px; font-size: 10px; }
      .filter-label { font-size: 10px; margin-bottom: 4px; }
      .list-table .col-last-updated,
      .list-table .col-status { display: none; }
      .form-row { flex-direction: column; }
      .form-input, .form-select { width: 100%; box-sizing: border-box; }
      .form-actions { flex-direction: column; }
      .form-actions .btn { width: 100%; min-height: 44px; justify-content: center; }
    }

    .batch-toggle {
      padding: 3px 10px; border-radius: 4px; font-size: 11px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer;
    }
    .batch-toggle:hover { border-color: var(--primary-color); }
    .batch-bar {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 8px 12px; margin: 6px 0;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 8px; font-size: 13px; font-weight: 600;
    }
    .batch-bar-btn {
      padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;
      background: rgba(255,255,255,0.2); color: #fff;
      border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
    }
    .batch-bar-btn:hover { background: rgba(255,255,255,0.35); }
    .batch-bar-btn.danger { border-color: #ff5252; color: #ff5252; }
    .batch-checkbox {
      display: inline-flex; align-items: center; margin-right: 4px; cursor: pointer;
    }
    .batch-checkbox input { width: 16px; height: 16px; cursor: pointer; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadFavorites();
    await this._load();
    this.addEventListener('install', (e) => this._handleInstall(e.detail.repo));
    this.addEventListener('update', (e) => this._handleUpdate(e.detail.repo));
    this.addEventListener('uninstall', (e) => this._handleUninstall(e.detail.repo));
    this.addEventListener('detail', (e) => this._handleDetail(e.detail.repo));
    this.addEventListener('readme', (e) => this._handleDetail(e.detail.repo));
    this.addEventListener('favorite', () => this._syncFavoriteCount());
  }

  willUpdate(changedProps) {
    if (changedProps.has('presetFilter')) {
      const filter = this.presetFilter;
      const old = changedProps.get('presetFilter');
      // Skip initial mount (old undefined → empty string)
      if (old === undefined && filter === '') return;
      this.presetFilter = '';
      this.statusFilter = filter;
      this.page = 1;
      this._persistState();
      this._load();
    }
  }

  async _loadFavorites() {
    try {
      const result = await api.getFavorites();
      this._favorites = Array.isArray(result) ? result : (result.favorites || []);
    } catch(e) {
      this._favorites = [];
    }
  }

  _syncFavoriteCount() {
    this.statusCounts = { ...this.statusCounts, favorites: this._favorites.length };
    this.requestUpdate();
  }

  _persistState() {
    _saveBrowseState({
      search: this.search, category: this.category, statusFilter: this.statusFilter,
      sort: this.sort, sortDir: this.sortDir, page: this.page, groupBy: this.groupBy,
      pageSize: this.pageSize,
    });
  }

  async _handleInstall(repo) {
    const repoId = repo.id || repo.full_name;
    this._installingIds = { ...this._installingIds, [repoId]: true };
    try {
      await api.install(repoId, repo.category);
      showToast(`${t('installComplete')}: ${repo.full_name || repo.name}`, 'success');
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      this._load();
    } catch(e) {
      showToast(`${t('installFailed')}: ${e.message}`, 'error');
    }
    delete this._installingIds[repoId];
    this._installingIds = { ...this._installingIds };
  }

  async _handleUpdate(repo) {
    try {
      await api.update([repo.id || repo.full_name]);
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      this._load();
    } catch(e) { console.error('Update failed', e); }
  }

  async _handleUninstall(repo) {
    const ok = await ConfirmDialog.show(this, {
      message: `${t('confirmRemove')} ${repo.full_name || repo.name}?`,
      confirmText: t('remove'), danger: true,
    });
    if (!ok) return;
    try {
      await api.remove(repo.id || repo.full_name);
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      this._load();
    } catch(e) { console.error('Uninstall failed', e); }
  }

  _handleDetail(repo) {
    this.dispatchEvent(new CustomEvent('detail', { detail: { repo }, bubbles: true, composed: true }));
  }

  async _load() {
    this.loading = true;
    try {
      const result = await api.listRepositories({
        search: this.search, category: this.category, sort: this.sort,
        sortDir: this.sortDir, page: this.page, limit: this.limit,
        status: this.statusFilter,
      });
      this.repos = result.repositories || [];
      this.total = result.total || 0;
      this.categoryCounts = result.category_counts || {};
      this.statusCounts = result.status_counts || {};
      // Compute favorites count from server
      this.statusCounts = { ...this.statusCounts, favorites: this._favorites.length };
    } catch(e) {
      console.error('Browse load error', e);
      this.repos = []; this.total = 0;
    }
    this.loading = false;
  }

  _onSearch(e) {
    this._searchText = e.target.value;
    clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this.search = this._searchText; this.page = 1;
      this._persistState(); this._load();
    }, 300);
  }

  _clearSearch() {
    this._searchText = ''; this.search = ''; this.page = 1;
    this._persistState(); this._load();
  }

  _onStatusFilter(value) { this.statusFilter = value; this.page = 1; this._persistState(); this._load(); }
  _onTypeFilter(value) { this.category = value; this.page = 1; this._persistState(); this._load(); }

  _onSortColumn(key) {
    if (this.sort === key) {
      this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
    } else {
      this.sort = key;
      this.sortDir = key === 'name' ? 'asc' : 'desc';
    }
    this.page = 1; this._persistState(); this._load();
  }

  _onGroupChange(e) { this.groupBy = e.target.value; this._persistState(); }
  _onViewModeChange(mode) {
    this.viewMode = mode;
    try { localStorage.setItem(VIEW_MODE_KEY, mode); } catch {}
  }
  _toggleGroup(key) { this._collapsedGroups = { ...this._collapsedGroups, [key]: !this._collapsedGroups[key] }; }
  _goPage(p) { this.page = p; this._persistState(); this._load(); }
  _onPageSizeChange(e) {
    this.pageSize = parseInt(e.target.value, 10);
    this.limit = this.pageSize;
    this.page = 1;
    this._persistState();
    this._load();
  }
  _refresh() { this.page = 1; this._persistState(); this._load(); }

  async _addRepo() {
    const fullName = this._parseRepoUrl(this._newRepoUrl);
    if (!fullName) { showToast(t('invalidRepoUrl'), 'error'); return; }
    this._addRepoInstalling = true;
    try {
      const result = await api.addCustomRepo(fullName, this._newRepoCategory);
      if (result.success) {
        showToast(`${t('addSuccess')}: ${fullName}`, 'success');
        this._newRepoUrl = ''; this._showAddRepo = false; this._load();
        this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      } else { showToast(`${t('addFailed')}: ${result.error}`, 'error'); }
    } catch(e) { showToast(`${t('addFailed')}: ${e.message}`, 'error'); }
    this._addRepoInstalling = false;
  }

  _parseRepoUrl(url) {
    const match = url.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);
    if (match) return match[1].replace(/\.git$/, '');
    if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(url)) return url;
    return null;
  }
  _getRepoStatus(repo) {
    const repoId = repo.id || repo.full_name;
    if (repo.pending_restart) return 'pending_restart';
    if (repo.installed && (repo.has_update || (repo.installed_version && repo.latest_version && repo.installed_version !== repo.latest_version))) return 'pending-upgrade';
    if (repo.installed) return 'installed';
    if (repo.new || repo.status === 'new') return 'new';
    return 'default';
  }

  _getStatusBadge(status) {
    const map = {
      'installed': { label: t('statusInstalled'), cls: 'installed' },
      'pending-upgrade': { label: t('statusPendingUpgrade'), cls: 'pending-upgrade' },
      'pending-restart': { label: t('statusPendingRestart'), cls: 'pending-restart' },
      'new': { label: t('statusNew'), cls: 'new' },
      'default': { label: t('statusDefault'), cls: 'default' },
    };
    const info = map[status] || { label: status, cls: 'default' };
    return html`<span class="status-badge ${info.cls}">${info.label}</span>`;
  }

  _getStatusLabel(status) {
    const map = {
      installed: t('statusInstalled'), not_installed: t('statusDefault'),
      update_available: t('statusPendingUpgrade'), favorites: t('statusFavorites'),
      new: t('statusNew'), custom: t('statusCustom'), pending_restart: t('statusPendingRestart'),
    };
    return map[status] || status;
  }

  _applyFilters(repos) {
    // Status filtering is now done server-side, only handle favorites client-side
    if (this.statusFilter === 'favorites') {
      return repos.filter(r => this._favorites.includes(r.id || r.full_name));
    }
    return repos;
  }

  _getFiltered() {
    let repos = this._applyFilters(this.repos);
    if (!this.search) return repos;
    const q = this.search.toLowerCase();
    // Extract owner/repo from GitHub URL if applicable
    let extractedPath = null;
    const githubMatch = q.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);
    if (githubMatch) {
      extractedPath = githubMatch[1].replace(/\.git$/, '').toLowerCase();
    }
    return repos.filter(r => {
      const fullName = (r.full_name || '').toLowerCase();
      const name = (r.name || '').toLowerCase();
      const desc = (r.description || '').toLowerCase();
      const authors = (r.authors || []).join(',').toLowerCase();
      const manifestName = (r.manifest_name || r.repository_manifest?.name || '').toLowerCase();
      // Basic field matching
      if (fullName.includes(q) || name.includes(q) || desc.includes(q) || authors.includes(q)) return true;
      // GitHub URL match: compare extracted owner/repo against full_name
      if (extractedPath && (fullName === extractedPath || fullName.includes(extractedPath))) return true;
      // manifest_name match
      if (manifestName.includes(q)) return true;
      return false;
    });
  }

  _groupRepos(repos) {
    if (this.groupBy === 'none') return null;
    const groups = {};
    for (const repo of repos) {
      let key;
      if (this.groupBy === 'status') key = this._getRepoStatus(repo);
      else if (this.groupBy === 'type') key = repo.category || 'other';
      else key = 'other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(repo);
    }
    const statusOrder = ['pending-restart', 'pending-upgrade', 'installed', 'new', 'default'];
    const typeOrder = ['integration', 'plugin', 'theme', 'appdaemon', 'netdaemon', 'python_script', 'template', 'other'];
    const keys = Object.keys(groups);
    if (this.groupBy === 'status') keys.sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));
    else if (this.groupBy === 'type') keys.sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));
    return keys.map(k => ({
      key: k,
      label: this.groupBy === 'status' ? this._getStatusLabel(k) : this._getCategoryLabel(k),
      repos: groups[k],
    }));
  }

  _getCategoryLabel(cat) {
    const labels = {
      integration: t('catIntegration'), plugin: t('catPlugin'), theme: t('catTheme'),
      appdaemon: t('catAppDaemon'), netdaemon: t('catNetDaemon'),
      python_script: t('catPython'), template: t('catTemplate'), other: cat,
    };
    return labels[cat] || cat;
  }

  _formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = now - d;
      const days = Math.floor(diff / 86400000);
      if (days === 0) return t('today') || '今天';
      if (days === 1) return t('yesterday') || '昨天';
      if (days < 30) return `${days}d`;
      if (days < 365) return `${Math.floor(days / 30)}mo`;
      return `${Math.floor(days / 365)}y`;
    } catch { return ''; }
  }

  _toggleSelect(fullName) {
    if (this._selectedRepos.includes(fullName)) {
      this._selectedRepos = this._selectedRepos.filter(n => n !== fullName);
    } else {
      this._selectedRepos = [...this._selectedRepos, fullName];
    }
  }

  async _batchDo(action) {
    if (this._selectedRepos.length === 0) return;
    const repos = this._selectedRepos.map(name => {
      const repo = this.repos.find(r => r.full_name === name);
      return { repository: name, category: repo?.category || 'integration' };
    });

    if (action === 'remove') {
      const { ConfirmDialog } = await import('../shared/confirm-dialog.js');
      const ok = await ConfirmDialog.show(this, {
        message: t('batchRemoveConfirm', { n: repos.length }),
        confirmText: t('batchRemove'),
        danger: true,
      });
      if (!ok) return;
    }

    try {
      showToast(t('batchInProgress'), 'info');
      const result = action === 'install'
        ? await api.batchInstall(repos)
        : await api.batchRemove(repos.map(r => r.repository));
      showToast(t('batchComplete'), 'success');
      this._selectedRepos = [];
      this._batchMode = false;
      this._load();
    } catch(e) {
      showToast(`${action} failed: ${e.message}`, 'error');
    }
  }

  _renderRepoList(repos) {
    if (this.viewMode === 'list') {
      return html`<div class="list-view">${this._renderListTable(repos)}</div>`;
    }
    return html`<div class="grid">${repos.map(r => html`
      ${this._batchMode ? html`
        <label class="batch-checkbox" @click=${e => e.stopPropagation()}>
          <input type="checkbox" ?checked=${this._selectedRepos.includes(r.full_name)}
            @change=${() => this._toggleSelect(r.full_name)} />
        </label>
      ` : ''}
      <repo-card .repo=${r} ._installing=${!!this._installingIds?.[r.id || r.full_name]}></repo-card>
    `)}</div>`;
  }

  _renderListTable(repos) {
    const sortArrow = (key) => {
      if (this.sort !== key) return '';
      return this.sortDir === 'desc' ? ' ▼' : ' ▲';
    };
    const thClass = (key) => `sortable ${this.sort === key ? 'active-sort' : ''}`;

    return html`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th class="${thClass('name')}" @click=${() => this._onSortColumn('name')}>${t('colName') || '名称'}<span class="sort-arrow">${sortArrow('name')}</span></th>
            <th class="${thClass('downloads')} col-downloads" @click=${() => this._onSortColumn('downloads')}>${t('colDownloads') || '下载'}<span class="sort-arrow">${sortArrow('downloads')}</span></th>
            <th class="${thClass('stars')} col-stars" @click=${() => this._onSortColumn('stars')}>${t('colStars') || '星数'}<span class="sort-arrow">${sortArrow('stars')}</span></th>
            <th class="${thClass('last_updated')} col-last-updated" @click=${() => this._onSortColumn('last_updated')}>${t('colLastUpdated') || '更新'}<span class="sort-arrow">${sortArrow('last_updated')}</span></th>
            <th class="${thClass('installed_version')} col-installed-ver" @click=${() => this._onSortColumn('installed_version')}>${t('colInstalledVer') || '已安装'}<span class="sort-arrow">${sortArrow('installed_version')}</span></th>
            <th class="${thClass('latest_version')} col-available-ver" @click=${() => this._onSortColumn('latest_version')}>${t('colAvailableVer') || '可用'}<span class="sort-arrow">${sortArrow('latest_version')}</span></th>
            <th class="${thClass('installed_at')} col-installed-at" @click=${() => this._onSortColumn('installed_at')}>${t('colInstalledAt') || '安装时间'}<span class="sort-arrow">${sortArrow('installed_at')}</span></th>
            <th class="col-status">${t('colStatus') || '状态'}</th>
            <th class="actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          ${repos.map(r => this._renderListRow(r))}
        </tbody>
      </table>
    `;
  }

  _renderListRow(r) {
    const category = r.category || 'integration';
    const categoryColor = getCategoryColor(category);
    const name = r.manifest_name || r.repository_manifest?.name || r.full_name || r.name || '?';
    const stars = r.stars || r.stargazers_count || 0;
    const downloads = r.downloads || 0;
    const status = this._getRepoStatus(r);
    const isInstalled = r.installed || false;
    const isUpdateAvailable = status === 'pending-upgrade';
    const repoId = r.id || r.full_name;
    const installing = !!this._installingIds?.[repoId];

    return html`
      <tr @click=${() => this._handleDetail(r)}>
        <td class="col-icon"><div class="icon-cell" style="background:${categoryColor}">
          ${r.domain && r.category === 'integration'
            ? html`
              <img src="https://brands.home-assistant.io/${r.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}>
              <span style="display:none">${(name || '?').charAt(0).toUpperCase()}</span>
            `
            : (name || '?').charAt(0).toUpperCase()
          }
        </div></td>
        <td class="name-cell">${name}<br><span class="desc-cell">${r.description || ''}</span>
          ${r.is_custom ? html`<span class="custom-tag-list">${t('customBadge')}</span>` : ''}
          ${r.topics && r.topics.length ? html`<br><span class="topic-chips">${r.topics.slice(0, 4).map(t => html`<span class="topic-chip">${t}</span>`)}</span>` : ''}
        </td>
        <td class="num-cell col-downloads">${downloads ? downloads.toLocaleString() : '-'}</td>
        <td class="num-cell col-stars"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14" style="vertical-align:middle;"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${typeof stars === 'number' ? stars.toLocaleString() : stars}</td>
        <td class="ver-cell col-last-updated">${this._formatDate(r.last_updated)}</td>
        <td class="ver-cell col-installed-ver">${isInstalled ? (r.installed_version || '-') : '-'}</td>
        <td class="ver-cell col-available-ver">${r.latest_version || '-'}</td>
        <td class="ver-cell col-installed-at">${r.installed_at ? this._formatDate(r.installed_at) : '-'}</td>
        <td class="status-cell col-status">${this._getStatusBadge(status)}</td>
        <td class="actions-cell">
          ${isInstalled ? html`
            ${isUpdateAvailable ? html`<button class="action-sm primary" @click=${e => { e.stopPropagation(); this._handleUpdate(r); }}>${t('update')}</button>` : ''}
          ` : html`
            <button class="action-sm primary ${installing ? 'installing' : ''}" @click=${e => { e.stopPropagation(); this._handleInstall(r); }} ?disabled=${installing}>${installing ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>` : t('install')}</button>
          `}
        </td>
      </tr>
    `;
  }

  render() {
    const totalPages = Math.ceil(this.total / this.limit);
    const displayRepos = this._getFiltered();
    const grouped = this._groupRepos(displayRepos);

    return html`
      <!-- Controls: Search + Action Buttons -->
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${t('searchPlaceholder')}" .value=${this._searchText} @input=${this._onSearch} />
          ${this.search ? html`<button class="search-clear" @click=${this._clearSearch}>✕</button>` : ''}
        </div>
        <button class="batch-toggle" @click=${() => { this._batchMode = !this._batchMode; if (!this._batchMode) this._selectedRepos = []; }}>
          ${this._batchMode ? t('cancel') : t('batchSelect')}
        </button>
        <div class="controls-right">
          <div class="view-toggle">
            <button class="view-toggle-btn ${this.viewMode === 'card' ? 'active' : ''}" @click=${() => this._onViewModeChange('card')} title="${t('viewCard')}">${t('viewCard')}</button>
            <button class="view-toggle-btn ${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this._onViewModeChange('list')} title="${t('viewList')}">${t('viewList')}</button>
          </div>
          <select class="group-select" @change=${this._onGroupChange} .value=${this.groupBy}>
            ${this.groupOptions.map(opt => html`<option value=${opt.value}>${t('groupBy')}: ${opt.label}</option>`)}
          </select>
          <button class="refresh-btn" @click=${this._refresh} title="${t('refreshTitle')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:36px;" @click=${() => { this._showAddRepo = !this._showAddRepo; }}>${t('addCustomRepo')}</button>
        </div>
      </div>

      <!-- Add Custom Repo Form -->
      ${this._showAddRepo ? html`
        <div class="add-repo-form">
          <div class="form-row">
            <input class="form-input" type="text" placeholder="${t('repoUrl')}" .value=${this._newRepoUrl} @input=${e => { this._newRepoUrl = e.target.value; }} @keydown=${e => { if (e.key === 'Enter') this._addRepo(); }}>
            <select class="form-select" .value=${this._newRepoCategory} @change=${e => { this._newRepoCategory = e.target.value; }}>
              <option value="integration">${t('catIntegration')}</option><option value="plugin">${t('catPlugin')}</option>
              <option value="theme">${t('catTheme')}</option><option value="appdaemon">${t('catAppDaemon')}</option>
              <option value="python_script">${t('catPython')}</option><option value="template">${t('catTemplate')}</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn primary" @click=${this._addRepo} ?disabled=${this._addRepoInstalling}>${this._addRepoInstalling ? t('installing') : t('add')}</button>
            <button class="btn" @click=${() => { this._showAddRepo = false; }}>${t('cancel')}</button>
          </div>
        </div>
      ` : ''}

      <!-- Filter Toggle (mobile: tap to expand) -->
      <button class="filter-toggle" @click=${() => { this._filterExpanded = !this._filterExpanded; }}>
        <span>${t('filterStatus') || '筛选'} / ${t('filterType') || '类型'}</span>
        <span class="active-filters">
          ${this.statusFilter ? html`<span class="active-filter-tag">${this._getStatusLabel(this.statusFilter)}</span>` : ''}
          ${this.category ? html`<span class="active-filter-tag">${this._getCategoryLabel(this.category)}</span>` : ''}
        </span>
        <span class="toggle-arrow ${this._filterExpanded ? 'expanded' : ''}">▼</span>
      </button>

      <!-- Filters: Status + Type in one row on desktop -->
      <div class="filter-row ${this._filterExpanded ? 'expanded' : ''}">
        <div class="filter-group">
          <div class="filter-label">${t('filterStatus')}</div>
          <div class="filter-chips">
            ${this.statusOptions.map(opt => html`
              <button class="filter-chip ${this.statusFilter === opt.value ? 'active' : ''}" @click=${() => this._onStatusFilter(opt.value)}>${opt.label}${this.statusCounts[opt.value] !== undefined ? html`<span class="chip-count">${this.statusCounts[opt.value]}</span>` : ''}</button>
            `)}
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">${t('filterType')}</div>
          <div class="filter-chips">
            ${this.typeOptions.map(opt => html`
              <button class="filter-chip ${this.category === opt.value ? 'active' : ''}" @click=${() => this._onTypeFilter(opt.value)}>
                ${opt.label}${this.categoryCounts[opt.value] !== undefined ? html`<span class="chip-count">${this.categoryCounts[opt.value]}</span>` : ''}
              </button>
            `)}
          </div>
        </div>
      </div>

      <!-- Batch Action Bar -->
      ${this._batchMode && this._selectedRepos.length > 0 ? html`
        <div class="batch-bar">
          <span>${t('batchSelected', { n: this._selectedRepos.length })}</span>
          <button class="batch-bar-btn" @click=${() => this._batchDo('install')}>${t('batchInstall')}</button>
          <button class="batch-bar-btn danger" @click=${() => this._batchDo('remove')}>${t('batchRemove')}</button>
          <button class="batch-bar-btn" @click=${() => { this._selectedRepos = []; this._batchMode = false; }}>${t('cancel')}</button>
        </div>
      ` : ''}

      <!-- Sort Bar (always visible, both card and list mode) -->
      <div class="sort-bar">
        <div class="sort-chips">
          ${this.sortColumns.map(col => html`
            <button class="sort-chip ${this.sort === col.key ? 'active' : ''}" @click=${() => this._onSortColumn(col.key)}>
              ${col.label}${this.sort === col.key ? html`<span class="sort-dir">${this.sortDir === 'desc' ? '▼' : '▲'}</span>` : ''}
            </button>
          `)}
        </div>
      </div>

      <!-- Content -->
      ${this.loading ? html`
        <div class="loading"><div class="spinner"></div><div>${t('loading')}</div></div>
      ` : displayRepos.length === 0 ? html`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div>${this.search ? t('noMatch') : t('noData')}</div>
        </div>
      ` : html`

        ${grouped ? html`
          ${grouped.map(g => html`
            <div class="group-header" @click=${() => this._toggleGroup(g.key)}>
              <span class="group-arrow ${this._collapsedGroups[g.key] ? 'collapsed' : ''}">▼</span>
              ${g.label}<span class="group-count">(${g.repos.length})</span>
            </div>
            ${!this._collapsedGroups[g.key] ? this._renderRepoList(g.repos) : ''}
          `)}
        ` : html`${this._renderRepoList(displayRepos)}`}

        ${totalPages > 1 ? html`
          <div class="pagination">
            <button class="page-btn" ?disabled=${this.page <= 1} @click=${() => this._goPage(this.page - 1)}>${t('prevPage')}</button>
            <span class="page-info">${t('page')} ${this.page} / ${totalPages}</span>
            <button class="page-btn primary" ?disabled=${this.page >= totalPages} @click=${() => this._goPage(this.page + 1)}>${t('nextPage')}</button>
            <select class="page-size-select" .value=${String(this.pageSize)} @change=${this._onPageSizeChange}>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        ` : ''}
      `}
    `;
  }
}

customElements.define('browse-view', BrowseView);
