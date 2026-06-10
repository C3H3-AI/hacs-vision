import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { showToast } from '../hacs-vision-panel.js';
import { ConfirmDialog } from '../shared/confirm-dialog.js';
import '../components/repo-card.js';

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
    _depResults: { type: Object },
    _depLoading: { type: Boolean },
    _customRepoSearch: { type: String },
    _customRepoSort: { type: String },
  };

  constructor() {
    super();
    this.customRepos = [];
    this.archivedRepos = [];
    this.ignoredRepos = [];
    this.renamedEntries = [];
    this.loading = false;
    this.exporting = false;
    this.importing = false;
    this._depResults = null;
    this._depLoading = false;
    this._renamedRefreshing = false;
    this._showAddCustom = false;
    this._customRepoUrl = '';
    this._customRepoCategory = 'integration';
    this._addingCustom = false;
    this._viewMode = 'card';
    this._customRepoSearch = '';
    this._customRepoSort = 'name';
    this._collapsed = {
      customRepos: false,
      archived: false,
      ignored: false,
      tools: false,
    };
  }

  static styles = css`
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

    /* ===== Search ===== */
    .search { position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 10px; width: 16px; height: 16px; color: var(--secondary-text-color); pointer-events: none; }
    .search input {
      width: 100%; padding: 8px 12px 8px 34px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; transition: border-color 0.2s;
      box-sizing: border-box; font-family: inherit;
    }
    .search input:focus { border-color: var(--primary-color); }
    .search input::placeholder { color: var(--secondary-text-color); }
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

    /* ===== View Toggle ===== */
    .view-toggle {
      display: flex; gap: 2px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 8px; padding: 2px; flex-shrink: 0;
    }
    .view-toggle button {
      border: none; background: none; padding: 4px 10px; border-radius: 6px;
      cursor: pointer; font-size: 11px; color: var(--secondary-text-color);
      transition: all 0.2s; font-family: inherit;
    }
    .view-toggle button.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

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
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .btn.primary:hover { opacity: 0.9; }
    .btn.danger { color: #f44336; border-color: #f44336; }
    .btn.danger:hover { background: #f44336; color: #fff; }
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

    /* ===== Dep Check Results ===== */
    .dep-panel {
      margin-top:12px;padding:12px 14px;border-radius:10px;font-size:13px;
      background:var(--secondary-background-color);
    }
    .dep-summary { display:flex;justify-content:space-between;align-items:center;margin-bottom:8px; }
    .dep-summary .title { font-weight:600;color:var(--primary-text-color); }
    .dep-summary .issues { color:#f44336;font-weight:600; }
    .dep-item {
      margin-top:8px;padding:10px 12px;border-radius:8px;
      background:var(--card-background-color);border:1px solid var(--divider-color);
    }
    .dep-item .repo { font-weight:500;color:var(--primary-text-color);margin-bottom:4px; }
    .dep-item .missing { font-size:11px;color:#f44336; }
    .dep-ok { color:var(--success-color,#0f9d58);font-weight:500; }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Mobile ===== */
    @media (max-width: 768px) {
      .section { padding: 14px; border-radius: 12px; }
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
    }
  `;

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
    } catch(e) {
      console.error('Config load error', e);
    }
    this.loading = false;
  }

  async _removeArchivedRepo(repoName) {
    const ok = await ConfirmDialog.show(this, {
      message: `${t('confirmRemoveArchived')} ${repoName}?`,
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
      message: `${t('confirmRemoveRenamed')} ${oldName}?`,
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
      message: `${t('confirmReplaceRenamed')}: ${oldName} → ${newName}${t('replaceRenamedWarning')}?`,
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

  async _checkDependencies() {
    this._depLoading = true;
    try {
      const result = await api.checkDependencies();
      this._depResults = result;
      if (result.all_ok) showToast(t('depOk'), 'success');
      else showToast(`${t('depMissing')} (${result.issues_count})`, 'error');
    } catch(e) {
      this._depResults = null;
      showToast(`${t('checkFailed')}: ${e.message}`, 'error');
    }
    this._depLoading = false;
  }

  _depMissingCount() {
    if (!this._depResults?.dependencies) return 0;
    return this._depResults.dependencies.filter(r => r.has_issues).length;
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
      message: `${t('confirmRemoveRepo')} ${repoName}?`,
      confirmText: t('removeRepo'), danger: true,
    });
    if (!ok) return;
    try {
      const result = await api.removeCustomRepo(repoName);
      if (result && result.success === false) {
        showToast(`${t('removeRepoFailed')}: ${result.error}`, 'error');
      }
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) { showToast(`${t('removeRepoFailed')}: ${e.message}`, 'error'); }
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
      python_script: t('catPython'), template: t('catTemplate'),
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
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 16px;color:var(--secondary-text-color);">
          <div class="spinner"></div>
          <div>${t('loading')}</div>
        </div>
      ` : ''}

      <!-- Custom Repos -->
      <div class="section">
        <div class="section-header" @click=${() => this._toggleSection('customRepos')}>
          <svg class="arrow ${_collapsed.customRepos ? 'closed' : 'open'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            ${t('customRepos')}
            ${renamedEntries.length > 0 ? html`<span class="section-badge">${renamedEntries.length} ${t('renamedRepos')}</span>` : ''}
          </div>
          <div class="view-toggle">
            <button class=${classMap({ active: _viewMode === 'card' })} @click=${(e) => { e.stopPropagation(); this._setViewMode('card'); }}>
              ${t('catDashboard') || '卡片'}
            </button>
            <button class=${classMap({ active: _viewMode === 'list' })} @click=${(e) => { e.stopPropagation(); this._setViewMode('list'); }}>
              ${t('list') || '列表'}
            </button>
          </div>
          <button class="btn sm" @click=${(e) => { e.stopPropagation(); this._load(); }} title="${t('refresh')}" style="flex-shrink:0;"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg></button>
        </div>
        <div class="section-content ${_collapsed.customRepos ? 'collapsed' : ''}">
          <div class="section-desc">${t('customReposDesc')}</div>

          <!-- Search & Sort -->
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <div class="search" style="flex:1;min-width:150px;">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="${t('search') || '搜索...'}" .value=${this._customRepoSearch} @input=${e => this._customRepoSearch = e.target.value}>
            </div>
            <select class="edit-input" style="width:auto;" .value=${this._customRepoSort} @change=${e => this._customRepoSort = e.target.value}>
              <option value="name">${t('sortByName')}</option>
              <option value="stars">${t('sortByStars')}</option>
              <option value="updated">${t('sortByUpdated')}</option>
            </select>
          </div>

          ${this._showAddCustom ? html`
            <div class="add-form">
              <input class="edit-input" .value=${this._customRepoUrl} @input=${e => this._customRepoUrl = e.target.value} placeholder="owner/repo 或 GitHub URL" @keydown=${e => e.key === 'Enter' && this._addCustomRepo()}>
              <div class="add-form-controls">
                <select class="edit-input" .value=${this._customRepoCategory} @change=${e => this._customRepoCategory = e.target.value}>
                  ${['integration','plugin','theme','dashboard','python_script','template','appdaemon','netdaemon'].map(c => html`<option value=${c}>${this._getCategoryLabel(c)}</option>`)}
                </select>
                <button class="btn primary sm" @click=${this._addCustomRepo} ?disabled=${this._addingCustom || !this._customRepoUrl.trim()}>
                  ${this._addingCustom
                    ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('add')}`
                    : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${t('add')}`}
                </button>
                <button class="btn sm" @click=${this._toggleAddCustom}>${t('cancel')}</button>
              </div>
              ${this._customRepoUrl.trim() ? html`
                <div class="add-preview">${this._parseRepoUrl(this._customRepoUrl)
                  ? html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${this._parseRepoUrl(this._customRepoUrl)}`
                  : html`<span class="add-error">${t('invalidRepoUrl')}</span>`}</div>
              ` : ''}
            </div>
          ` : html`
            <button class="btn primary" @click=${this._toggleAddCustom} style="margin-bottom:12px;">+ ${t('addRepo')}</button>
          `}

          ${customRepos.length > 0
            ? (_viewMode === 'card'
              ? html`<div class="repo-cards">${this._getFilteredCustomRepos().map(r => {
              const renamedEntry = this.renamedEntries.find(([old, nw]) => nw === (r.full_name || r.repository));
              return html`
                <repo-card .repo=${r} viewMode="management"
                  .renamedFrom=${renamedEntry ? renamedEntry[0] : undefined}
                  showRemoveBtn=true
                  @detail=${(e) => this._openCardDetail(e.detail.repo)}
                  @remove-repo=${(e) => this._removeCustomRepo(e.detail.repo?.full_name || e.detail.repo?.repository, e.detail.repo?.category)}>
                </repo-card>`;
            })}</div>`
              : html`<div class="repo-list">${this._getFilteredCustomRepos().map(r => this._renderListItem(r, renamedEntries))}</div>`)
            : html`<div class="empty">${t('noCustomRepos')}</div>`}
        </div>
      </div>

      <!-- Archived -->
      <div class="section">
        <div class="section-header" @click=${() => this._toggleSection('archived')}>
          <svg class="arrow ${_collapsed.archived ? 'closed' : 'open'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
            ${t('archivedRepos')}
          </div>
        </div>
        <div class="section-content ${_collapsed.archived ? 'collapsed' : ''}">
          ${archivedRepos.length > 0 ? html`
            <div class="repo-list">
              ${archivedRepos.map(r => html`
                <div class="repo-item" style="cursor:default;">
                  <div class="repo-info"><div class="repo-top"><span class="repo-name">${r}</span></div></div>
                  <div class="repo-actions">
                    <a class="btn sm" href="https://github.com/${r}" target="_blank" rel="noopener">${t('viewOnGithub')}</a>
                    <button class="btn danger sm" @click=${() => this._removeArchivedRepo(r)}>${t('removeArchived')}</button>
                  </div>
                </div>
              `)}
            </div>
          ` : html`<div class="empty">${t('noArchived')}</div>`}
        </div>
      </div>

      <!-- Ignored -->
      <div class="section">
        <div class="section-header" @click=${() => this._toggleSection('ignored')}>
          <svg class="arrow ${_collapsed.ignored ? 'closed' : 'open'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            ${t('ignoredRepos')}
          </div>
        </div>
        <div class="section-content ${_collapsed.ignored ? 'collapsed' : ''}">
          ${ignoredRepos.length > 0 ? html`
            <div class="repo-list">
              ${ignoredRepos.map(r => html`
                <div class="repo-item" style="cursor:default;"><div class="repo-info"><div class="repo-top"><span class="repo-name">${r}</span></div></div></div>
              `)}
            </div>
          ` : html`<div class="empty">${t('noIgnored')}</div>`}
        </div>
      </div>

      <!-- Tools: Export / Import / Dep Check -->
      <div class="section">
        <div class="section-header" @click=${() => this._toggleSection('tools')}>
          <svg class="arrow ${_collapsed.tools ? 'closed' : 'open'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 5.74-.94 3.71-3.71.94L8 14.31"/><path d="M14.31 8L8 14.31l-2.23.45a1 1 0 0 0-.86 1.16l.6 3.02a1 1 0 0 0 1.16.86l3.02-.6L16 12.69"/></svg>
            ${t('tools') || '工具'}
          </div>
        </div>
        <div class="section-content ${_collapsed.tools ? 'collapsed' : ''}">
          <div class="section-desc">${t('toolsDesc') || '导出、导入和依赖检查'}</div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
            <button class="btn primary" @click=${this._export} ?disabled=${this.exporting}>
              ${this.exporting ? t('exporting') : t('exportBtn')}
            </button>
            <button class="btn" @click=${this._import} ?disabled=${this.importing}>
              ${this.importing ? t('importing') : t('importBtn')}
            </button>
            <button class="btn" @click=${this._checkDependencies} ?disabled=${this._depLoading}>
              ${this._depLoading
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('checkingUpdates')}`
                : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${t('checkDep')}`}
            </button>
          </div>

          ${this._depResults ? html`
            <div class="dep-panel">
              <div class="dep-summary">
                <span class="title">${this._depResults.all_ok
                  ? html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
                  : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`} ${t('totalPrefix') || '共'} ${this._depResults.total_checked} ${t('totalRepos')}</span>
                ${!this._depResults.all_ok ? html`<span class="issues">${this._depResults.issues_count} ${t('depMissing') || '缺失'}</span>` : ''}
              </div>
              ${!this._depResults.all_ok ? html`
                ${this._depResults.dependencies.filter(r => r.has_issues).map(r => html`
                  <div class="dep-item">
                    <div class="repo">${r.repository}</div>
                    <div class="missing">${r.missing.join(', ')}</div>
                  </div>
                `)}
              ` : html`<div class="dep-ok"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${t('depOk')}</div>`}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('management-view', ManagementView);