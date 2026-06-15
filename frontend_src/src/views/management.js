import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { showToast } from '../hacs-vision-panel.js';
import { ConfirmDialog } from '../shared/confirm-dialog.js';
import { getCategoryColor } from '../shared/constants.js';
import { getCommonStyles } from '../shared/styles.js';
import '../components/repo-card.js';

const MGMT_STATE_KEY = 'hacs_vision_mgmt_state';
function _loadMgmtState() {
  try { return JSON.parse(localStorage.getItem(MGMT_STATE_KEY) || '{}'); } catch { return {}; }
}
function _saveMgmtState(state) {
  try { localStorage.setItem(MGMT_STATE_KEY, JSON.stringify(state)); } catch {} 
}

export class ManagementView extends LitElement {
  static properties = {
    customRepos: { type: Array },
    archivedRepos: { type: Array },
    ignoredRepos: { type: Array },
    renamedEntries: { type: Array },
    loading: { type: Boolean },
    _customRepoUrl: { type: String },
    _customRepoCategory: { type: String },
    _showAddCustom: { type: Boolean },
    _addingCustom: { type: Boolean },
    erLoading: { type: Boolean },
    iLoading: { type: Boolean },
    importing: { type: Boolean },
    exporting: { type: Boolean },
    _viewMode: { type: String },
    _collapsed: { type: Object },
    _renamedRefreshing: { type: Boolean },
    _customRepoSearch: { type: String },
    _customRepofilter: { type: String },
    _customRepoSort: { type: String },
    _statusFilter: { type: String },
    _typeFilter: { type: String },
    _selectedRepos: { type: Array, state: true },
    _favorites: { type: Array, state: true },
    _tagFilters: { type: Array, state: true },
  };

  constructor() {
    super();
    const saved = _loadMgmtState();
    this.customRepos = [];
    this.archivedRepos = [];
    this.ignoredRepos = [];
    this.renamedEntries = [];
    this.loading = false;
    this.exporting = false;
    this.importing = false;
    this._renamedRefreshing = false;
    this._showAddCustom = false;
    this._customRepoUrl = '';
    this._customRepoCategory = 'integration';
    this._addingCustom = false;
    this._viewMode = 'card';
    this._customRepoSearch = '';
    this._customRepofilter = saved.customRepofilter || 'all';
    this._customRepoSort = saved.customRepoSort || 'name';
    this._statusFilter = saved.statusFilter || '';
    this._typeFilter = saved.typeFilter || '';
    this._selectedRepos = [];
    this._favorites = [];
    this._tagFilters = [];
    this._collapsed = {
      customRepos: false,
      archived: false,
      ignored: false,
      tools: false,
    };
  }

  static styles = [getCommonStyles(), css`
    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    /* ===== Section Base ===== */
    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 20px; margin-bottom: 16px;
    }
    .section-title {
      font-size: 15px; font-weight: 700; color: var(--primary-text-color);
      display: flex; align-items: center; gap: 8px; flex: 1;
    }
    .section-title svg { width: 20px; height: 20px; color: var(--primary-color); flex-shrink: 0; }
    .section-desc { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 16px; line-height: 1.6; }

    /* ===== Search (uses shared styles from styles.js) ===== */
    .search { position: relative; }
    .edit-input {
      padding: 8px 12px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; transition: border-color 0.2s;
      box-sizing: border-box; font-family: inherit;
    }
    .edit-input:focus { border-color: var(--primary-color); }

    /* ===== Collapsible ===== */
    .section-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
      cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
    }
    .section-header .arrow {
      width: 18px; height: 18px; transition: transform 0.25s; flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .section-header .arrow.open { transform: rotate(0deg); }
    .section-header .arrow.closed { transform: rotate(-90deg); }
    .section-content { overflow: hidden; }
    .section-content.collapsed { display: none; }

    /* ===== View Toggle (aligned with browse) ===== */
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle button {
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation; font-family: inherit;
    }
    .view-toggle button + button { border-left: 1px solid var(--divider-color); }
    .view-toggle button.active {
      background: var(--primary-color); color: #fff;
      box-shadow: none;
    }
    .view-toggle button:hover:not(.active) { color: var(--primary-color); }

    /* ===== List View (enhanced) ===== */
    .repo-list { display: flex; flex-direction: column; gap: 8px; }
    .repo-item {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 12px 14px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; transition: all 0.2s; gap: 12px;
      cursor: pointer;
    }
    .repo-item:hover { border-color: var(--primary-color); }
    .col-icon { flex-shrink: 0; }
    .icon-cell {
      width: 32px; height: 32px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 14px; font-weight: 700;
      overflow: hidden;
    }
    .repo-info { flex: 1; min-width: 0; }
    .repo-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
    .repo-name { color: var(--primary-text-color); font-weight: 600; font-size: 14px; }
    .repo-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px; }
    .repo-fullname { color: var(--secondary-text-color); }
    .repo-version { color: var(--text-primary-color); }
    .repo-not-installed { color: var(--secondary-text-color); font-style: italic; font-size: 10px; }
    .update-badge { color: #f44336; font-weight: 600; }
    .repo-stars { color: #f9a825; }
    .repo-desc { font-size: 12px; color: var(--secondary-text-color); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 2px; }
    .topic-chips { display: flex; gap: 4px; flex-wrap: wrap; }
    .topic-chip {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }
    .repo-actions { display: flex; gap: 4px; flex-shrink: 0; align-items: center; flex-wrap: wrap; }

    .category-badge {
      display: inline-block; padding: 1px 8px; border-radius: 4px;
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
    }
    .category-badge.integration { background: #e8f5e9; color: #2e7d32; }
    .category-badge.plugin { background: #fff3e0; color: #e65100; }
    .category-badge.theme { background: #f3e5f5; color: #7b1fa2; }
    .category-badge.python_script { background: #e3f2fd; color: #1565c0; }
    .category-badge.template { background: #fce4ec; color: #c62828; }
    .category-badge.appdaemon { background: #e0f2f1; color: #00695c; }
    .category-badge.netdaemon { background: #ede7f6; color: #4527a0; }
    .category-badge.dashboard { background: #fff8e1; color: #f57f17; }

    .renamed-badge {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
      background: #fff3e0; color: #e65100; letter-spacing: 0.3px;
    }
    .custom-badge-tag { font-size: 10px; padding: 1px 6px; border-radius: 4px; background: #ff6f00; color: #fff; font-weight: 700; display: inline-flex; align-items: center; }

    .refresh-btn {
      padding: 8px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.25s; width: 36px; height: 36px;
      touch-action: manipulation; flex-shrink: 0;
    }
    .refresh-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .refresh-btn svg { width: 16px; height: 16px; }

    /* ===== Filter Chips (aligned with browse) ===== */
    .filter-group { margin-bottom: 10px; }
    .filter-label { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; overflow-x: auto; scrollbar-width: none; }
    .filter-chips::-webkit-scrollbar { display: none; }
    .filter-chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 12px; border-radius: 18px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color); color: var(--secondary-text-color, #727272);
      font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
      touch-action: manipulation; user-select: none;
    }
    .filter-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }

    /* ===== Controls (aligned with browse) ===== */
    .controls-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: none; background: var(--card-background-color,#fff);
      color: var(--secondary-text-color,#727272);
      cursor: pointer; font-size: 14px; transition: all 0.2s;
      min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

    .sort-bar { display: flex; align-items: center; margin-bottom: 10px; padding: 6px 14px; background: var(--secondary-background-color,#f0f0f0); border-radius: 8px; flex-wrap: wrap; gap: 4px; }
    .sort-chips { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .sort-chip {
      padding: 4px 10px; border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 11px; transition: all 0.2s; white-space: nowrap;
      touch-action: manipulation;
    }
    .sort-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .sort-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .sort-chip .sort-dir { font-size: 9px; margin-left: 2px; }

    /* ===== Filter-Sort Row (compact, aligned with store) ===== */
    .filter-sort-row {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 10px; padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 10px; flex-wrap: wrap;
    }
    .filter-sort-row .fs-chips {
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap; flex: 1; min-width: 0;
    }
    .filter-sort-row .fs-divider {
      display: inline-block; width: 1px; height: 22px;
      background: var(--divider-color, #e0e0e0); margin: 0 10px; flex-shrink: 0;
    }
    .sort-inline { opacity: 0.85; }
    .sort-inline.active { opacity: 1; }
    .sort-inline .sort-dir { font-size: 9px; margin-left: 2px; }
    .fs-label {
      font-size: 11px; font-weight: 700; color: var(--primary-color, #03a9f4);
      text-transform: uppercase; letter-spacing: 0.5px; padding: 0 4px;
      user-select: none; flex-shrink: 0;
    }
    .add-repo-form {
      background: var(--card-background-color,#fff); border: 1px solid var(--divider-color,#e0e0e0);
      border-radius: 14px; padding: 16px; margin-bottom: 14px;
    }
    .form-input, .form-select {
      padding: 10px 12px; border: 1px solid var(--divider-color,#e0e0e0); border-radius: 10px;
      background: var(--card-background-color,#fff); color: var(--primary-text-color,#212121);
      font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.2s;
    }
    .form-input:focus, .form-select:focus { border-color: var(--primary-color); }

    @media (max-width: 768px) {
      .filter-chips { flex-wrap: wrap; gap: 3px; }
      .filter-chip { padding: 4px 8px; font-size: 11px; }
      .controls-right { flex-wrap: wrap; }
      .form-input, .form-select { width: 100%; }
    }

    .section-badge {
      display: inline-flex; align-items: center; padding: 2px 10px;
      border-radius: 10px; font-size: 11px; font-weight: 500;
      background: var(--primary-color); color: #fff;
    }

    /* ===== Card View ===== */
    .repo-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }
    .repo-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
      display: flex; flex-direction: column; position: relative;
    }
    .repo-card:hover { border-color: var(--primary-color, #03a9f4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .repo-card-img {
      height: 100px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .repo-card-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    .repo-card-badge-cat {
      position: absolute; top: 10px; left: 10px;
      padding: 3px 8px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff; text-transform: uppercase;
    }
    .repo-card-custom {
      position: absolute; top: 10px; left: 50%;
      transform: translateX(-50%);
      padding: 3px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 700; color: #fff; text-transform: uppercase;
      background: #ff6f00; box-shadow: 0 2px 6px rgba(255,111,0,0.4);
    }
    .repo-card-actions-img {
      position: absolute; top: 10px; right: 10px; z-index: 2;
    }
    .repo-card-actions-img .btn-icon {
      width: 30px; height: 30px;
      background: rgba(255,255,255,0.85); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      padding: 0; color: var(--secondary-text-color);
      transition: all 0.2s;
    }
    .repo-card-actions-img .btn-icon:hover { color: #f44336; }
    .repo-card-installed {
      position: absolute; bottom: 10px; left: 10px;
      padding: 2px 8px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
      background: rgba(76,175,80,0.15); color: #4caf50;
    }
    .repo-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; }
    .repo-card-body .name {
      font-size: 14px; font-weight: 600; color: var(--primary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;
    }
    .repo-card-body .fullname {
      font-size: 11px; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;
    }
    .repo-card-body .desc {
      font-size: 12px; color: var(--secondary-text-color);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 8px; line-height: 1.5; height: 36px;
    }
    .repo-card-body .meta {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 4px; margin-top: auto;
    }
    .repo-card-body .meta .stars {
      display: flex; align-items: center; gap: 3px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .repo-card-renamed {
      position: absolute; top: 10px; right: 48px; z-index: 2;
      padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 600;
      background: #fff3e0; color: #e65100;
    }

    /* ===== Buttons ===== */
    .btn {
      padding: 8px 14px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 12px; transition: all 0.2s;
      touch-action: manipulation; display: inline-flex; align-items: center; gap: 8px; font-family: inherit;
    }
    .btn.sm { padding: 4px 10px; font-size: 11px; }
    .btn-icon {
      width: 32px; height: 32px; padding: 0; display: inline-flex;
      align-items: center; justify-content: center; border-radius: 8px;
      border: 1px solid var(--divider-color); cursor: pointer;
      color: var(--primary-text-color); transition: all 0.2s; text-decoration: none;
    }
    .btn-icon:hover { border-color: var(--primary-color); color: var(--primary-color); }

    .edit-input {
      padding: 6px 10px; border: 1px solid var(--primary-color); border-radius: 6px;
      font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; flex: 1; min-width: 0; font-family: inherit;
    }
    .edit-input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color), 0.15); }

    .btn-group { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }
    .btn-group-wide { display: flex; gap: 12px; flex-wrap: wrap; }

    .empty { font-size: 13px; color: var(--secondary-text-color); padding: 32px 0; text-align: center; }

    /* ===== Add Form ===== */
    .add-form {
      padding: 14px; border: 1px dashed var(--primary-color);
      border-radius: 10px; background: rgba(var(--rgb-primary-color, 0, 123, 255), 0.04);
      margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px;
    }
    .add-form-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .add-form-controls select { flex: 0 0 auto; max-width: 160px; }
    .add-preview { font-size: 12px; color: var(--secondary-text-color); padding: 4px 2px; }
    .add-error { color: #f44336; }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Batch Bar (aligned with browse) ===== */
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

    /* ===== Mobile ===== */
    @media (max-width: 768px) {
      .section { padding: 14px; border-radius: 12px; }
      .controls { flex-wrap: wrap; }
      .search { flex: 1; min-width: 0; }
      .search input { width: 100%; }
      .filter-sort-row { padding: 6px 10px; }
      .btn { min-height: 44px; }
      .btn.sm { min-height: 36px; }
      .btn-group-wide { flex-direction: column; gap: 8px; }
      .btn-group-wide .btn { width: 100%; justify-content: center; }
      .repo-item { flex-direction: column; gap: 8px; padding: 10px 12px; }
      .repo-actions { width: 100%; justify-content: flex-end; }
      .repo-name { font-size: 13px; }
      .repo-meta { font-size: 10px; }
      .repo-desc { font-size: 11px; }
      .repo-cards { grid-template-columns: 1fr; }
      .repo-card-img { height: 80px; }
      .repo-card-avatar { width: 36px; height: 36px; font-size: 16px; }
      .add-form { padding: 10px; }
      .add-form-controls { flex-direction: column; align-items: stretch; }
      .add-form-controls select { max-width: 100%; }
      .add-form-controls .btn { width: 100%; justify-content: center; }
      .section-badge { font-size: 10px; padding: 1px 8px; }
      .category-badge { font-size: 9px; padding: 1px 6px; }
      .form-row { flex-direction: column; }
      .form-input, .form-select { width: 100%; }
      .form-actions { flex-direction: column; }
      .form-actions .btn { width: 100%; min-height: 44px; justify-content: center; }
    }
  `];

  async connectedCallback() {
    super.connectedCallback();
    await this._load();
  }

  async _load() {
    this.loading = true;
    try {
      const config = (await api.getConfig()) || {};
      this.archivedRepos = config.archived_repositories || [];
      this.ignoredRepos = config.ignored_repositories || [];
      this.renamedEntries = Object.entries(config.renamed_repositories || {});
      const customResult = await api.getCustomRepos();
      this.customRepos = Array.isArray(customResult) ? customResult : (customResult.custom_repositories || []);
      // Load favorites
      try {
        const favResult = await api.getFavorites();
        this._favorites = Array.isArray(favResult) ? favResult : (favResult.favorites || []);
      } catch { this._favorites = []; }
    } catch(e) {
      console.error('Config load error', e);
    }
    this.loading = false;
  }

  async _removeArchivedRepo(repoName) {
    const ok = await ConfirmDialog.show(this, {
      message: t('confirmRemoveArchived', { repo: repoName }),
      confirmText: t('removeArchived'), danger: true,
    });
    if (!ok) return;
    try {
      await api.removeArchivedRepo(repoName);
      this._load();
    } catch(e) {
      showToast(`${t('removeRepoFailed')}: ${e.message}`, 'error');
    }
  }

  async _removeRenamedRepo(oldName) {
    const ok = await ConfirmDialog.show(this, {
      message: t('confirmRemoveRenamed', { old: oldName }),
      confirmText: t('removeRenamed'), danger: true,
    });
    if (!ok) return;
    try {
      await api.removeRenamedRepo(oldName);
      this._load();
    } catch(e) {
      showToast(`${t('removeRepoFailed')}: ${e.message}`, 'error');
    }
  }

  async _replaceRenamedOneClick(oldName, newName) {
    const ok = await ConfirmDialog.show(this, {
      message: t('confirmReplaceRenamed', { old: oldName, new: newName }),
      confirmText: t('replace'), danger: true,
    });
    if (!ok) return;
    this._renamedRefreshing = true;
    try {
      await api.replaceRenamedRepo(oldName, newName);
      showToast(`${t('replace')}: ${oldName} → ${newName}`, 'success');
      await api.refresh();
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) {
      showToast(`${t('updateFailed')}: ${e.message}`, 'error');
    }
    this._renamedRefreshing = false;
  }


  async _export() {
    this.exporting = true;
    try {
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `hacs-vision-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click(); URL.revokeObjectURL(url);
      showToast(t('exportSuccess'), 'success');
    } catch(e) {
      showToast(`${t('exportFailed')}: ${e.message}`, 'error');
    }
    this.exporting = false;
  }

  async _import() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      this.importing = true;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await api.importBackup(data);
        showToast(t('importSuccess'), 'success');
        this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      } catch(e) {
        showToast(`${t('importFailed')}: ${e.message}`, 'error');
      }
      this.importing = false;
    };
    input.click();
  }

  _toggleAddCustom() {
    this._showAddCustom = !this._showAddCustom;
    if (!this._showAddCustom) {
      this._customRepoUrl = '';
      this._customRepoCategory = 'integration';
    }
  }

  _parseRepoUrl(url) {
    url = url.trim();
    const match = url.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);
    if (match) return match[1].replace(/\.git$/, '');
    if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(url)) return url;
    return null;
  }

  async _addCustomRepo() {
    const fullName = this._parseRepoUrl(this._customRepoUrl);
    if (!fullName) { showToast(t('invalidRepoUrl'), 'error'); return; }
    const exists = this.customRepos.some(r => (r.full_name || r.repository) === fullName);
    if (exists) { showToast(`${fullName} ${t('alreadyExists')}`, 'error'); return; }
    this._addingCustom = true;
    try {
      const result = await api.addCustomRepo(fullName, this._customRepoCategory);
      if (result.success) {
        showToast(`${t('addSuccess')}: ${fullName}`, 'success');
        this._customRepoUrl = '';
        this._load();
        this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      } else showToast(`${t('addFailed')}: ${result.error}`, 'error');
    } catch(e) { showToast(`${t('addFailed')}: ${e.message}`, 'error'); }
    this._addingCustom = false;
  }

  async _removeCustomRepo(repoName, category) {
    const ok = await ConfirmDialog.show(this, {
      message: t('confirmRemoveRepo', { repo: repoName }),
      confirmText: t('removeRepo'), danger: true,
    });
    if (!ok) return;
    try {
      const result = await api.removeCustomRepo(repoName);
      if (result && result.success === false) {
        showToast(`${t('removeRepoFailed')}: ${result.error}`, 'error');
      }
      this._selectedRepos = this._selectedRepos.filter(n => n !== repoName);
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) { showToast(`${t('removeRepoFailed')}: ${e.message}`, 'error'); }
  }

  _toggleSelectRepo(fullName) {
    if (this._selectedRepos.includes(fullName)) {
      this._selectedRepos = this._selectedRepos.filter(n => n !== fullName);
    } else {
      this._selectedRepos = [...this._selectedRepos, fullName];
    }
  }

  async _batchRemove() {
    const count = this._selectedRepos.length;
    const ok = await ConfirmDialog.show(this, {
      message: `${t('batchRemoveRepoConfirm') || '确认移除'} ${count} ${t('totalRepos')}?`,
      confirmText: t('removeRepo'), danger: true,
    });
    if (!ok) return;
    for (const name of [...this._selectedRepos]) {
      try {
        await api.removeCustomRepo(name);
      } catch(e) {
        showToast(`${t('removeRepoFailed')}: ${name} - ${e.message}`, 'error');
      }
    }
    this._selectedRepos = [];
    this._load();
    this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
  }

  _toggleSection(name) {
    this._collapsed = { ...this._collapsed, [name]: !this._collapsed[name] };
  }

  _setViewMode(mode) {
    this._viewMode = mode;
  }

  _openCardDetail(repo) {
    this.dispatchEvent(new CustomEvent('detail', {
      detail: { repo },
      bubbles: true, composed: true,
    }));
  }

  _getRepoStatus(repo) {
    if (repo.pending_restart) return 'pending_restart';
    if (repo.installed && (repo.has_update || (repo.installed_version && repo.latest_version && repo.installed_version !== repo.latest_version))) return 'update_available';
    if (repo.installed) return 'installed';
    return 'not_installed';
  }

  _getFilteredCustomRepos() {
    let repos = [...this.customRepos];
    // Search filter
    const search = (this._customRepoSearch || '').toLowerCase();
    if (search) {
      repos = repos.filter(r => {
        const name = (r.manifest_name || r.name || r.full_name || '').toLowerCase();
        const desc = (r.description || '').toLowerCase();
        return name.includes(search) || desc.includes(search);
      });
    }
    // Status filter
    const status = this._statusFilter || '';
    if (status) {
      repos = repos.filter(r => this._getRepoStatus(r) === status);
    }
    // Type filter
    const type = this._typeFilter || '';
    if (type) {
      repos = repos.filter(r => (r.category || '') === type);
    }
    // Tag filters (favorites)
    if (this._tagFilters.includes('favorites')) {
      repos = repos.filter(r => this._favorites.includes(r.id || r.full_name));
    }
    // Sort
    const sort = this._customRepoSort || 'name';
    if (sort === 'stars') {
      repos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    } else if (sort === 'updated') {
      repos.sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));
    } else {
      repos.sort((a, b) => (a.manifest_name || a.name || a.full_name || '').localeCompare(b.manifest_name || b.name || b.full_name || ''));
    }
    return repos;
  }

  _getStatusCounts() {
    const counts = { installed: 0, update_available: 0, not_installed: 0, pending_restart: 0 };
    for (const r of this.customRepos) {
      const st = this._getRepoStatus(r);
      if (counts[st] !== undefined) counts[st]++;
    }
    return counts;
  }

  _getTypeCounts() {
    const counts = {};
    for (const r of this.customRepos) {
      const cat = r.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }

  /* ===== Render content based on active filter ===== */
  _renderFilteredContent(customRepos, archivedRepos, ignoredRepos, renamedEntries) {
    const filter = this._customRepofilter || 'all';

    // Archived — card style
    if (filter === 'archived') {
      return archivedRepos.length > 0 ? html`
        <div class="repo-cards">${archivedRepos.map(r => html`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#6a1b9a20,#7b1fa220);">
              <div class="repo-card-avatar" style="background:#7b1fa2;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${r}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${t('archivedRepos')}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <a class="action-btn" href="https://github.com/${r}" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;font-size:12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                ${t('viewOnGithub')}
              </a>
              <button class="action-btn" @click=${() => this._removeArchivedRepo(r)} style="color:#f44336;border-color:#f44336;flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                ${t('removeArchived')}
              </button>
            </div>
          </div>
        `)}</div>
      ` : html`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${t('noArchived')}</div></div>`;
    }

    // Ignored — card style
    if (filter === 'ignored') {
      return ignoredRepos.length > 0 ? html`
        <div class="repo-cards">${ignoredRepos.map(r => html`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#e0e0e0,#f5f5f5);">
              <div class="repo-card-avatar" style="background:#9e9e9e;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${r}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${t('ignoredRepos')}</span>
              </div>
            </div>
          </div>
        `)}</div>
      ` : html`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg><div>${t('noIgnored')}</div></div>`;
    }

    // Renamed — card style with replace button at bottom
    if (filter === 'renamed') {
      return renamedEntries.length > 0 ? html`
        <div class="repo-cards">${renamedEntries.map(([oldName, newName]) => html`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#ff8f0020,#ff980020);">
              <div class="repo-card-avatar" style="background:#ff9800;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:12px;color:var(--secondary-text-color);text-decoration:line-through;">${oldName}</div>
              <div style="display:flex;align-items:center;gap:4px;margin:2px 0;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                <span class="name" style="font-size:13px;font-weight:600;color:var(--primary-color);">${newName}</span>
              </div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${t('renamedRepos')}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <button class="action-btn primary" @click=${() => this._replaceRenamedOneClick(oldName, newName)} ?disabled=${this._renamedRefreshing} style="flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                ${t('replace') || '替换'}
              </button>
              <button class="action-btn" @click=${() => this._removeRenamedRepo(oldName)} style="color:#f44336;border-color:#f44336;flex:0 0 auto;padding:8px 10px;" title="${t('removeRenamed')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `)}</div>
      ` : html`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg><div>${t('noRenamed') || '无重命名仓库'}</div></div>`;
    }

    // Default: custom repos (all / custom)
    if (customRepos.length === 0) return html`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${t('noCustomRepos')}</div></div>`;
    if (this._viewMode === 'card') {
      return html`<div class="repo-cards">${this._getFilteredCustomRepos().map(r => {
        const renamedEntry = renamedEntries.find(([old, nw]) => nw === (r.full_name || r.repository));
        return html`
          <repo-card .repo=${r} viewMode="management"
            .renamedFrom=${renamedEntry ? renamedEntry[0] : undefined}
            showRemoveBtn=true
            .showCheckbox=${true}
            .selected=${this._selectedRepos.includes(r.full_name || r.repository)}
            @detail=${(e) => this._openCardDetail(e.detail.repo)}
            @remove-repo=${(e) => this._removeCustomRepo(e.detail.repo?.full_name || e.detail.repo?.repository, e.detail.repo?.category)}
            @check-change=${(e) => { const fn = e.detail.fullName; if (fn) this._toggleSelectRepo(fn); }}>
          </repo-card>`;
      })}</div>`;
    }
    return html`<div class="repo-list">${this._getFilteredCustomRepos().map(r => this._renderListItem(r, renamedEntries))}</div>`;
  }

  _getInitials(name) {
    if (!name) return '?';
    const parts = name.split('/');
    const last = parts[parts.length - 1] || name;
    return last.charAt(0).toUpperCase();
  }

  _getCategoryColor(cat) {
    return getCategoryColor(cat);
  }

  _getCategoryLabel(category) {
    const labels = {
      integration: t('catIntegration'), plugin: t('catPlugin'), theme: t('catTheme'),
      appdaemon: t('catAppDaemon'), netdaemon: t('catNetDaemon'),
      python_script: t('catPythonScript'), template: t('catTemplate'),
      dashboard: t('catDashboard'),
    };
    return labels[category] || category;
  }

  /* ===== Render a single repo as Card ===== */
  _renderCard(r, renamedEntries) {
    const fullName = r.full_name || r.repository;
    const displayName = r.manifest_name || r.name || fullName;
    const renamedEntry = renamedEntries.find(([old, nw]) => nw === fullName);
    const isRenamed = !!renamedEntry;
    const oldName = isRenamed ? renamedEntry[0] : null;
    const installedVer = r.installed_version || '';
    const latestVer = r.latest_version || '';
    const hasUpdate = r.has_update;
    const stars = r.stargazers_count || 0;
    const desc = r.description || '';
    const isInstalled = r.installed || false;
    const catColor = this._getCategoryColor(r.category);

    return html`
      <div class="repo-card" @click=${() => this._openCardDetail(r)}>
        <div class="repo-card-img" style="background:linear-gradient(135deg, ${catColor}44 0%, ${catColor}22 100%);">
          <div class="repo-card-avatar" style="background:${catColor}">
            ${r.domain && r.category === 'integration' ? html`
              <img src="https://brands.home-assistant.io/${r.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}>
              <span style="display:none">${this._getInitials(displayName)}</span>
            ` : this._getInitials(displayName)}
          </div>
          <span class="repo-card-badge-cat" style="background:${catColor}">
            ${this._getCategoryLabel(r.category)}
          </span>
          ${r.is_custom ? html`<span class="repo-card-custom">${t('customBadge')}</span>` : ''}
          ${isRenamed ? html`<span class="repo-card-renamed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${oldName}</span>` : ''}
          ${isInstalled ? html`<span class="repo-card-installed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${t('installed')}</span>` : ''}
          <div class="repo-card-actions-img">
            <button class="btn-icon" @click=${(e) => { e.stopPropagation(); this._removeCustomRepo(fullName, r.category); }} title="${t('removeRepo')}">
              ✕
            </button>
          </div>
        </div>
        <div class="repo-card-body">
          <div class="name" title=${displayName}>${displayName}</div>
          <div class="fullname">${fullName}</div>
          <div class="desc">${desc || t('noDesc')}</div>
          ${r.topics && r.topics.length ? html`
            <div class="topic-chips" style="margin-top:6px;">
              ${r.topics.slice(0, 3).map(t => html`<span class="topic-chip">${t}</span>`)}
            </div>
          ` : ''}
          <div class="meta">
            <span class="stars">
              <svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${stars > 0 ? (typeof stars === 'number' ? stars.toLocaleString() : stars) : 0}
            </span>
            ${isInstalled ? html`
              <span style="font-size:10px;color:var(--secondary-text-color);">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${installedVer}${hasUpdate ? html` <span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${latestVer}</span>` : ''}
              </span>
            ` : html`<span class="repo-not-installed">${t('notInstalled')}</span>`}
          </div>
        </div>
      </div>
    `;
  }

  /* ===== Render a single repo as List Item ===== */
  _renderListItem(r, renamedEntries) {
    const fullName = r.full_name || r.repository;
    const displayName = r.manifest_name || r.name || fullName;
    const renamedEntry = renamedEntries.find(([old, nw]) => nw === fullName);
    const isRenamed = !!renamedEntry;
    const oldName = isRenamed ? renamedEntry[0] : null;
    const installedVer = r.installed_version || '';
    const latestVer = r.latest_version || '';
    const hasUpdate = r.has_update;
    const stars = r.stargazers_count || 0;
    const desc = r.description || '';

    return html`
      <div class="repo-item" @click=${() => this._openCardDetail(r)}>
        <div class="col-icon">
          <div class="icon-cell" style="background:${this._getCategoryColor(r.category)}">
            ${r.domain && r.category === 'integration'
              ? html`
                <img src="https://brands.home-assistant.io/${r.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}>
                <span style="display:none">${displayName.charAt(0).toUpperCase()}</span>
              `
              : displayName.charAt(0).toUpperCase()
            }
          </div>
        </div>
        <div class="repo-info">
          <div class="repo-top">
            <span class="repo-name">${displayName}</span>
            <span class="category-badge ${r.category}">${this._getCategoryLabel(r.category)}</span>
            ${r.is_custom ? html`<span class="custom-badge-tag">${t('customBadge')}</span>` : ''}
            ${isRenamed ? html`<span class="renamed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${oldName}</span>` : ''}
          </div>
          <div class="repo-meta">
            <span class="repo-fullname">${fullName}</span>
            <span class="stars" style="color:#f9a825;"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${stars > 0 ? (typeof stars === 'number' ? stars.toLocaleString() : stars) : 0}</span>
            ${r.installed ? html`
              <span class="repo-version"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${installedVer}</span>
              ${hasUpdate ? html`<span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${latestVer}</span>` : ''}
            ` : html`<span class="repo-not-installed">${t('notInstalled')}</span>`}
          </div>
          ${desc ? html`<div class="repo-desc">${desc}</div>` : ''}
          ${r.topics && r.topics.length ? html`
            <div class="topic-chips" style="margin-top:4px;">
              ${r.topics.slice(0, 4).map(t => html`<span class="topic-chip">${t}</span>`)}
            </div>
          ` : ''}
        </div>
        <div class="repo-actions">
          <a class="btn btn-icon" href="https://github.com/${fullName}" target="_blank" rel="noopener" @click=${e => e.stopPropagation()} title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          ${isRenamed ? html`
            <button class="btn primary sm" @click=${(e) => { e.stopPropagation(); this._replaceRenamedOneClick(oldName, fullName); }} ?disabled=${this._renamedRefreshing}>
              ${this._renamedRefreshing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : t('replace')}
            </button>
            <button class="btn danger sm" @click=${(e) => { e.stopPropagation(); this._removeRenamedRepo(oldName); }} title=${t('removeRenamed')}>✕</button>
          ` : ''}
          <button class="btn danger sm" @click=${(e) => { e.stopPropagation(); this._removeCustomRepo(fullName, r.category); }}>✕</button>
        </div>
      </div>
    `;
  }

  render() {
    const { archivedRepos, ignoredRepos, renamedEntries, customRepos, loading, _viewMode, _collapsed } = this;

    return html`
      ${loading ? html`
        <div class="skeleton-grid" style="margin-bottom:16px;">
          ${[1,2,3,4,5,6].map(() => html`
            <div class="skeleton-card">
              <div class="skeleton-card-img"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line" style="width:40%"></div>
              </div>
            </div>
          `)}
        </div>
      ` : ''}

      <!-- Controls: Search + Sort Dropdown + Add Button + View Toggle -->
      <div class="controls">
        <div class="search" style="flex:1;min-width:150px;">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="${t('search') || '搜索...'}" .value=${this._customRepoSearch} @input=${e => this._customRepoSearch = e.target.value}>
          ${this._customRepoSearch ? html`<button class="search-clear" @click=${() => this._customRepoSearch = ''}>✕</button>` : ''}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${() => this._load()} title="${t('refreshTitle')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <div class="view-toggle">
            <button class="view-toggle-btn ${_viewMode === 'card' ? 'active' : ''}" @click=${() => this._setViewMode('card')}>${t('viewCard')}</button>
            <button class="view-toggle-btn ${_viewMode === 'list' ? 'active' : ''}" @click=${() => this._setViewMode('list')}>${t('viewList')}</button>
          </div>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:36px;" @click=${this._toggleAddCustom}>+ ${t('addRepo')}</button>
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._getFilteredCustomRepos().length > 0 && this._selectedRepos.length === this._getFilteredCustomRepos().length}
                   @click=${e => e.stopPropagation()}
                   @change=${() => { if (this._selectedRepos.length > 0) { this._selectedRepos = []; } else { this._selectedRepos = this._getFilteredCustomRepos().map(r => r.full_name || r.repository).filter(Boolean); } }}>
            ${t('selectAll') || '全选'}
            ${this._selectedRepos.length > 0 ? html`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>` : ''}
          </label>
        </div>
      </div>

      <!-- Add Custom Repo Form (right after controls, before filters — matches store) -->
      ${this._showAddCustom ? html`
        <div class="add-repo-form">
          <div class="form-row" style="display:flex;gap:8px;flex-wrap:wrap;">
            <input class="form-input" type="text" style="flex:1;min-width:200px;" .value=${this._customRepoUrl} @input=${e => this._customRepoUrl = e.target.value} placeholder="owner/repo 或 GitHub URL" @keydown=${e => e.key === 'Enter' && this._addCustomRepo()}>
            <select class="form-select" .value=${this._customRepoCategory} @change=${e => this._customRepoCategory = e.target.value}>
              ${['integration','plugin','theme','dashboard','python_script','template','appdaemon','netdaemon'].map(c => html`<option value=${c}>${this._getCategoryLabel(c)}</option>`)}
            </select>
          </div>
          <div class="form-actions" style="display:flex;gap:6px;margin-top:8px;">
            <button class="btn primary" @click=${this._addCustomRepo} ?disabled=${this._addingCustom || !this._customRepoUrl.trim()}>
              ${this._addingCustom ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('add')}` : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${t('add')}`}
            </button>
            <button class="btn" @click=${this._toggleAddCustom}>${t('cancel')}</button>
          </div>
          ${this._customRepoUrl.trim() && this._parseRepoUrl(this._customRepoUrl) ? html`
            <div style="margin-top:4px;font-size:11px;color:var(--secondary-text-color);display:flex;align-items:center;gap:4px;">
              <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${this._parseRepoUrl(this._customRepoUrl)}
            </div>
          ` : this._customRepoUrl.trim() ? html`
            <div style="margin-top:4px;font-size:11px;color:#f44336;">${t('invalidRepoUrl')}</div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Filter + Sort: single compact row -->
      <div class="filter-sort-row">
        <div class="fs-chips">
          <span class="fs-label">${t('repoStatus')}</span>
          <button class="filter-chip ${this._customRepofilter === 'all' ? 'active' : ''}" @click=${() => { this._customRepofilter = 'all'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('all') || '全部'}</button>
          ${archivedRepos.length > 0 ? html`<button class="filter-chip ${this._customRepofilter === 'archived' ? 'active' : ''}" @click=${() => { this._customRepofilter = 'archived'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('archivedRepos')} (${archivedRepos.length})</button>` : ''}
          ${renamedEntries.length > 0 ? html`<button class="filter-chip ${this._customRepofilter === 'renamed' ? 'active' : ''}" @click=${() => { this._customRepofilter = 'renamed'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('renamedRepos')} (${renamedEntries.length})</button>` : ''}
          ${ignoredRepos.length > 0 ? html`<button class="filter-chip ${this._customRepofilter === 'ignored' ? 'active' : ''}" @click=${() => { this._customRepofilter = 'ignored'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('ignoredRepos')} (${ignoredRepos.length})</button>` : ''}
          <span class="fs-divider"></span>
          <span class="fs-label">${t('filterStatus')}</span>
          <button class="filter-chip ${!this._statusFilter ? 'active' : ''}" @click=${() => { this._statusFilter = ''; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('all') || '全部'}</button>
          ${['installed','update_available','not_installed','pending_restart'].filter(k => (this._getStatusCounts()[k] ?? 0) > 0).map(k => html`
            <button class="filter-chip ${this._statusFilter === k ? 'active' : ''}" @click=${() => { this._statusFilter = k; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>
              ${k === 'installed' ? t('statusInstalled') : k === 'update_available' ? t('statusPendingUpgrade') : k === 'not_installed' ? t('statusNotInstalled') : t('statusPendingRestart')}
              <span class="chip-count">${this._getStatusCounts()[k]}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${t('filterType')}</span>
          <button class="filter-chip ${!this._typeFilter ? 'active' : ''}" @click=${() => { this._typeFilter = ''; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>${t('all') || '全部'}</button>
          ${Object.entries(this._getTypeCounts()).filter(([cat, cnt]) => cnt > 0).map(([cat, cnt]) => html`
            <button class="filter-chip ${this._typeFilter === cat ? 'active' : ''}" @click=${() => { this._typeFilter = cat; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>
              ${this._getCategoryLabel(cat)}<span class="chip-count">${cnt}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${t('sort') || '排序'}</span>
          <button class="filter-chip sort-inline ${this._customRepoSort === 'name' ? 'active' : ''}" @click=${() => { this._customRepoSort = 'name'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>
            ${t('sortByName')}${this._customRepoSort === 'name' ? html`<span class="sort-dir">▲</span>` : ''}
          </button>
          <button class="filter-chip sort-inline ${this._customRepoSort === 'stars' ? 'active' : ''}" @click=${() => { this._customRepoSort = 'stars'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>
            ${t('sortByStars')}${this._customRepoSort === 'stars' ? html`<span class="sort-dir">▼</span>` : ''}
          </button>
          <button class="filter-chip sort-inline ${this._customRepoSort === 'updated' ? 'active' : ''}" @click=${() => { this._customRepoSort = 'updated'; _saveMgmtState({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter}); }}>
            ${t('sortByUpdated')}${this._customRepoSort === 'updated' ? html`<span class="sort-dir">▼</span>` : ''}
          </button>
        </div>
      </div>

      <!-- Batch Action Bar -->
      ${this._selectedRepos.length > 0 ? html`
        <div class="batch-bar">
          <span>${t('batchSelected', { n: this._selectedRepos.length })}</span>
          <button class="batch-bar-btn" @click=${() => this._batchRemove()} style="border-color:#ff5252;color:#ff5252;">${t('removeRepo')}</button>
          <button class="batch-bar-btn" @click=${() => { this._selectedRepos = []; }}>${t('cancel')}</button>
        </div>
      ` : ''}

      ${this._renderFilteredContent(customRepos, archivedRepos, ignoredRepos, renamedEntries)}
    `;
  }
}

customElements.define('management-view', ManagementView);