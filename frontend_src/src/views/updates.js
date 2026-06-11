import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { showToast } from '../hacs-vision-panel.js';
import { t } from '../i18n.js';
import { getCommonStyles } from '../shared/styles.js';
import { ConfirmDialog } from '../shared/confirm-dialog.js';
import { getCategoryColor } from '../shared/constants.js';

class UpdatesView extends LitElement {
  static properties = {
    updates: { type: Array },
    loading: { type: Boolean },
    updating: { type: Boolean },
    search: { type: String },
    _installingIds: { type: Object, state: true },
    _changelogs: { type: Object, state: true },
    _searchText: { type: String, state: true },
    _selectedIds: { type: Object, state: true },
    _selectedRepos: { type: Array, state: true },
    _batchMode: { type: Boolean, state: true },
    _viewMode: { type: String, state: true },
  };

  constructor() {
    super();
    this.updates = [];
    this.loading = false;
    this.updating = false;
    this.search = '';
    this._searchTimer = null;
    this._installingIds = {};
    this._changelogs = {};
    this._changelogsLoading = {};
    this._expandedChangelogs = {};
    this._searchText = '';
    this._selectedIds = {};
    this._selectedRepos = [];
    this._batchMode = false;
    const saved = localStorage.getItem('hacs_vision_view_mode');
    this._viewMode = saved || 'card';
  }

  static styles = [
    getCommonStyles(),
    css`
      :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

      .search { min-width: 160px; }

      .card {
        border: 1px solid var(--divider-color); border-radius: 14px;
        background: var(--card-background-color); overflow: hidden;
        padding: 16px; transition: all 0.2s; cursor: pointer;
        display: flex; flex-direction: column; min-height: 220px;
      }
      .card:hover { border-color: var(--primary-color); }

      .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
      .card-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
      .card-name { font-size: 14px; font-weight: 600; color: var(--primary-text-color); word-break: break-all; }
      .card-name .category-badge {
        display: inline-block; font-size: 9px; padding: 2px 7px;
        border-radius: 4px; background: rgba(var(--rgb-primary-color), 0.08);
        color: var(--primary-color); margin-left: 6px; vertical-align: middle;
      }

      .version-row { display: flex; gap: 12px; margin-bottom: 12px; }
      .version-item { flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: var(--secondary-background-color); }
      .version-label { font-size: 10px; color: var(--secondary-text-color); text-transform: uppercase; margin-bottom: 4px; }
      .version-value { font-size: 14px; font-weight: 700; }
      .version-value.old { color: var(--warning-color, #ff8f00); }
      .version-value.new { color: var(--success-color, #0f9d58); }

      .card-desc { font-size: 12px; color: var(--secondary-text-color); margin-bottom: 12px; line-height: 1.5; }

      /* Multi-select checkbox */
      .checkbox {
        width: 18px; height: 18px; border-radius: 4px;
        border: 2px solid var(--secondary-text-color); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all 0.2s; background: transparent;
        -webkit-appearance: none; appearance: none; touch-action: manipulation;
      }
      .checkbox:checked {
        background: var(--primary-color); border-color: var(--primary-color);
      }
      .checkbox:checked::after {
        content: '✓'; color: #fff; font-size: 12px; font-weight: 700;
      }
      .select-all {
        display: flex; align-items: center; gap: 6px;
        font-size: 12px; color: var(--secondary-text-color); cursor: pointer;
        touch-action: manipulation; user-select: none;
      }
      .select-all:hover { color: var(--primary-text-color); }

      .btn.primary { width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: auto; }
      .btn.primary:hover { opacity: 0.9; }
      /* F3: Progress button pulse */
      .btn.primary.installing {
        opacity: 0.7; cursor: not-allowed;
        animation: btnPulse 1.5s infinite;
      }
      @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

      /* F6: Changelog preview */
      .changelog-preview {
        margin-top: 8px; padding: 10px 12px;
        background: var(--secondary-background-color);
        border-radius: 8px; font-size: 12px;
      }
      .changelog-preview-title { font-weight: 600; margin-bottom: 6px; color: var(--primary-text-color); }
      .changelog-preview-body {
        color: var(--secondary-text-color); white-space: pre-wrap;
        line-height: 1.5; max-height: 80px; overflow: hidden;
      }
      .changelog-preview-link {
        color: var(--primary-color); font-size: 11px; text-decoration: none;
        display: inline-block; margin-top: 6px;
      }
      .changelog-preview-link:hover { text-decoration: underline; }
      .changelog-preview-body.expanded { max-height: none; }
      .changelog-expand-btn {
        display: inline-block; margin-top: 6px; margin-right: 10px;
        color: var(--primary-color); font-size: 11px; cursor: pointer;
        background: none; border: none; padding: 0;
      }
      .changelog-expand-btn:hover { text-decoration: underline; }

      .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
      .mini-icon.spin { animation: spin 1s linear infinite; }
      @keyframes spin { 100% { transform: rotate(360deg); } }

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

      /* ===== List View (HACS-style table) ===== */
      .list-view { width: 100%; overflow-x: auto; }
      .list-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: auto; }
      .list-table th {
        text-align: left; padding: 10px 8px; font-size: 11px; font-weight: 600;
        color: var(--secondary-text-color); text-transform: uppercase;
        border-bottom: 2px solid var(--divider-color); white-space: nowrap;
        user-select: none; letter-spacing: 0.3px;
      }
      .list-table td {
        padding: 10px 8px; border-bottom: 1px solid var(--divider-color);
        vertical-align: middle;
      }
      .list-table .col-icon { width: 40px; }
      .list-table .icon-cell {
        width: 32px; height: 32px; border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 14px; font-weight: 700;
        overflow: hidden;
      }
      .list-table .name-cell {
        font-weight: 500; color: var(--primary-text-color); width: 100%;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .list-table .desc-cell {
        font-size: 11px; color: var(--secondary-text-color);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 0;
      }
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

      .status-badge {
        display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;
      }
      .status-badge.pending-upgrade { background: rgba(255,152,0,0.15); color: #ff9800; }

      .update-all-bar {
        display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px;
      }
      .update-all-btn {
        padding: 10px 20px; border-radius: 10px;
        background: var(--primary-color); color: #fff; border: none;
        font-size: 13px; font-weight: 600; cursor: pointer;
        display: flex; align-items: center; gap: 6px; transition: opacity 0.2s;
        touch-action: manipulation;
      }
      .update-all-btn:hover { opacity: 0.9; }
      .update-all-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .update-all-btn.selected-btn {
        background: transparent; border: 1px solid var(--primary-color);
        color: var(--primary-color);
      }
      .update-all-btn.selected-btn:disabled { opacity: 0.4; }

      @media (max-width: 768px) {
        .search { min-width: 0; }
        .card { padding: 12px; }
        .version-row { gap: 8px; }
        .version-item { padding: 6px; }
        .version-label { font-size: 9px; }
        .version-value { font-size: 12px; }
        .card-desc { font-size: 11px; margin-bottom: 10px; }
        .btn.primary { min-height: 44px; }
        .update-all-bar { justify-content: stretch; flex-wrap: wrap; }
        .update-all-btn { flex: 1; min-width: 120px; justify-content: center; min-height: 44px; }
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
    `
  ];

  async connectedCallback() {
    super.connectedCallback();
    await this._load();
  }

  /* Lazy load changelogs: load one at a time with gap */
  _lazyLoadChangelogs() {
    const repos = this.updates.filter(r => r.full_name && !this._changelogs[r.full_name]);
    if (repos.length === 0) return;
    let i = 0;
    const next = () => {
      if (i >= repos.length) return;
      this._loadChangelog(repos[i++].full_name);
      setTimeout(next, 150);
    };
    setTimeout(next, 300);
  }

  async _load() {
    this.loading = true;
    try {
      // Trigger backend refresh first (register custom repos, check versions)
      await api.refresh().catch(() => {});
      // Then fetch the updated updates list
      const result = await api.getUpdates();
      this.updates = Array.isArray(result) ? result : (result.updates || []);
      this._lazyLoadChangelogs();
    } catch(e) {
      console.error('Failed to load updates', e);
      this.updates = [];
    }
    this.loading = false;
  }

  /* Lazy load changelog for a single repo */
  async _loadChangelog(fullName) {
    if (!fullName || this._changelogs[fullName] || this._changelogsLoading[fullName]) return;
    this._changelogsLoading = { ...this._changelogsLoading, [fullName]: true };
    try {
      const data = await api.getChangelog(fullName);
      if (data?.body) {
        this._changelogs = { ...this._changelogs, [fullName]: data };
      }
    } catch {}
    this._changelogsLoading = { ...this._changelogsLoading, [fullName]: false };
  }

  _toggleChangelog(fullName) {
    this._expandedChangelogs = {
      ...this._expandedChangelogs,
      [fullName]: !this._expandedChangelogs?.[fullName]
    };
  }

  /* F6: Load changelogs for all updates — parallel */
  async _loadChangelogs() {
    const repos = this.updates.filter(r => r.full_name);
    if (repos.length === 0) return;
    const results = await Promise.allSettled(
      repos.map(r =>
        api.getChangelog(r.full_name).then(data => ({ fullName: r.full_name, data }))
      )
    );
    const logs = {};
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.data?.body) {
        logs[r.value.fullName] = r.value.data;
      }
    }
    if (Object.keys(logs).length > 0) {
      this._changelogs = { ...this._changelogs, ...logs };
    }
  }

  /* "Update Selected" — updates only checked repos */
  async _updateSelected() {
    const ids = Object.keys(this._selectedIds).filter(k => this._selectedIds[k]);
    if (ids.length === 0) return;
    const confirmed = await ConfirmDialog.show(this, {
      message: `${t('confirmUpdateAll')} ${ids.length}?`,
      confirmText: t('confirmUpdate'),
      danger: false,
    });
    if (!confirmed) return;
    this.updating = true;
    try {
      await api.update(ids);
      showToast(`${t('allUpdatesStarted')} (${ids.length})`, 'success');
      this._selectedIds = {};
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) {
      showToast(`${t('updateFailed')}: ${e.message}`, 'error');
    }
    this.updating = false;
  }

  /* "Update All" — updates ALL repos without requiring selection */
  async _updateAll() {
    const allIds = this.updates.map(r => r.id || r.full_name);
    if (allIds.length === 0) return;
    const confirmed = await ConfirmDialog.show(this, {
      message: `${t('updateAll')} ${allIds.length}?`,
      confirmText: t('confirmUpdate'),
      danger: false,
    });
    if (!confirmed) return;
    this.updating = true;
    try {
      await api.update(allIds);
      showToast(`${t('allUpdatesStarted')} (${allIds.length})`, 'success');
      this._selectedIds = {};
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) {
      showToast(`${t('updateFailed')}: ${e.message}`, 'error');
    }
    this.updating = false;
  }

  _toggleSelect(repoId) {
    this._selectedIds = { ...this._selectedIds, [repoId]: !this._selectedIds[repoId] };
  }

  _toggleSelectFull(fullName) {
    if (this._selectedRepos.includes(fullName)) {
      this._selectedRepos = this._selectedRepos.filter(n => n !== fullName);
    } else {
      this._selectedRepos = [...this._selectedRepos, fullName];
    }
  }

  async _batchDo(action) {
    if (this._selectedRepos.length === 0) return;
    if (action === 'remove') {
      const ok = await ConfirmDialog.show(this, {
        message: t('batchRemoveConfirm', { n: this._selectedRepos.length }),
        confirmText: t('batchRemove'),
        danger: true,
      });
      if (!ok) return;
    }
    try {
      showToast(t('batchInProgress'), 'info');
      if (action === 'update') {
        await api.update(this._selectedRepos);
      } else if (action === 'remove') {
        await api.batchRemove(this._selectedRepos.map(r => r));
      }
      showToast(t('batchComplete'), 'success');
      this._selectedRepos = [];
      this._batchMode = false;
      this._load();
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
    } catch(e) {
      showToast(`${action} failed: ${e.message}`, 'error');
    }
  }

  _toggleSelectAll() {
    const filtered = this._getFiltered();
    if (this._isAllSelected()) {
      this._selectedIds = {};
    } else {
      const sel = {};
      for (const r of filtered) {
        sel[r.id || r.full_name] = true;
      }
      this._selectedIds = sel;
    }
  }

  _isAllSelected() {
    const filtered = this._getFiltered();
    if (filtered.length === 0) return false;
    return filtered.every(r => this._selectedIds[r.id || r.full_name]);
  }

  _selectedCount() {
    return Object.keys(this._selectedIds).filter(k => this._selectedIds[k]).length;
  }

  /* F3: Single update with progress indicator + polling */
  async _updateOne(repo) {
    const repoId = repo.id || repo.full_name;
    this._installingIds = { ...this._installingIds, [repoId]: true };
    try {
      await api.update([repoId]);
      // Poll for completion
      const targetVer = repo.latest_version;
      let attempts = 0;
      const poll = async () => {
        if (attempts++ > 30) {
          this._installingIds = { ...this._installingIds };
          delete this._installingIds[repoId];
          showToast(`${t('installFailed')}: timeout`, 'error');
          return;
        }
        try {
          const status = await api.getRepoStatus(repoId);
          if (status?.installed_version === targetVer || (status?.installed && !status?.has_update)) {
            this._installingIds = { ...this._installingIds };
            delete this._installingIds[repoId];
            showToast(`${t('updateComplete')}: ${repo.full_name || repo.name}`, 'success');
            this._load();
            this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
            return;
          }
        } catch(e) {}
        setTimeout(poll, 2000);
      };
      setTimeout(poll, 2000);
    } catch(e) {
      this._installingIds = { ...this._installingIds };
      delete this._installingIds[repoId];
      showToast(`${t('updateFailed')}: ${e.message}`, 'error');
    }
  }

  _getFiltered() {
    if (!this.search) return this.updates;
    const q = this.search.toLowerCase();
    return this.updates.filter(r => (r.full_name || r.name || '').toLowerCase().includes(q));
  }

  _clearSearch() {
    this._searchText = '';
    this.search = '';
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    }
  }

  _openDetail(repo) {
    this.dispatchEvent(new CustomEvent('detail', { detail: { repo }, bubbles: true, composed: true }));
  }

  _setViewMode(mode) {
    this._viewMode = mode;
    try { localStorage.setItem('hacs_vision_view_mode', mode); } catch {}
  }

  _renderListTable(filtered) {
    return html`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th>${t('colName') || '名称'}</th>
            <th>${t('currentVersion')}</th>
            <th>${t('latestVersion')}</th>
            <th>${t('colStatus') || '状态'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => this._renderListRow(r))}
        </tbody>
      </table>
    `;
  }

  _renderListRow(r) {
    const repoId = r.id || r.full_name;
    const isInstalling = !!this._installingIds?.[repoId];
    const isChecked = !!this._selectedIds[repoId];
    const name = r.manifest_name || r.name || r.full_name || '?';
    const catColor = getCategoryColor(r.category);
    const domain = r.domain;

    return html`
      <tr @click=${(e) => { if (e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.checkbox')) return; this._openDetail(r); }}>
        <td class="col-icon">
          <div class="icon-cell" style="background:${catColor}">
            ${domain && r.category === 'integration'
              ? html`
                <img src="https://brands.home-assistant.io/${domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }}>
                <span style="display:none">${name.charAt(0).toUpperCase()}</span>
              `
              : name.charAt(0).toUpperCase()
            }
          </div>
        </td>
        <td>
          <div class="name-cell">${name}</div>
          ${r.description ? html`<div class="desc-cell">${r.description}</div>` : ''}
          ${r.is_custom ? html`<span class="custom-tag-list">${t('customBadge')}</span>` : ''}
          ${r.topics && r.topics.length ? html`<div class="topic-chips">${r.topics.slice(0, 4).map(t => html`<span class="topic-chip">${t}</span>`)}</div>` : ''}
        </td>
        <td style="font-size:12px;color:var(--warning-color);white-space:nowrap;">${r.installed_version || '?'}</td>
        <td style="font-size:12px;color:var(--success-color);white-space:nowrap;">${r.latest_version || '?'}</td>
        <td><span class="status-badge pending-upgrade">${t('statusPendingUpgrade')}</span></td>
        <td style="white-space:nowrap;">
          <input type="checkbox" class="checkbox" .checked=${isChecked}
                 @click=${(e) => e.stopPropagation()}
                 @change=${() => this._toggleSelect(repoId)} style="margin-right:6px;">
          <button class="btn primary ${isInstalling ? 'installing' : ''}" style="padding:4px 10px;font-size:11px;"
                  @click=${(e) => { e.stopPropagation(); this._updateOne(r); }} ?disabled=${isInstalling || this.updating}>
            ${isInstalling
              ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
              : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${t('updateNow')}`}
          </button>
        </td>
      </tr>
    `;
  }

  render() {
    const filtered = this._getFiltered();

    return html`
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${t('searchUpdates')}" .value=${this._searchText || ''}
                 @input=${e => {
                   this._searchText = e.target.value;
                   clearTimeout(this._searchTimer);
                   this._searchTimer = setTimeout(() => { this.search = this._searchText; }, 300);
                 }}>
          ${this.search ? html`
            <button class="search-clear" @click=${this._clearSearch}>✕</button>
          ` : ''}
        </div>
        <div class="view-toggle">
          <button class="view-toggle-btn ${this._viewMode === 'card' ? 'active' : ''}" @click=${() => this._setViewMode('card')} title="${t('viewCard')}">${t('viewCard')}</button>
          <button class="view-toggle-btn ${this._viewMode === 'list' ? 'active' : ''}" @click=${() => this._setViewMode('list')} title="${t('viewList')}">${t('viewList')}</button>
        </div>
        <button class="batch-toggle" @click=${() => { this._batchMode = !this._batchMode; if (!this._batchMode) this._selectedRepos = []; }}>
          ${this._batchMode ? t('cancel') : t('batchSelect')}
        </button>
      </div>

      ${this.loading ? html`
        <div class="skeleton-grid">
          ${[1,2,3,4].map(() => html`
            <div class="skeleton-card">
              <div class="skeleton-card-img"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line" style="width:50%"></div>
              </div>
            </div>
          `)}
        </div>
      ` : this.updates.length === 0 ? html`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div>${t('allUpToDate')}</div>
        </div>
      ` : html`
        <div class="info-bar">
          <div style="display:flex;align-items:center;gap:8px;">
            <label class="select-all">
              <input type="checkbox" class="checkbox" .checked=${this._isAllSelected()}
                     @click=${(e) => e.stopPropagation()}
                     @change=${this._toggleSelectAll}>
              ${t('selectAll') || '全选'}
            </label>
            <span>${t('totalPrefix')} <span class="count">${this.updates.length}</span> ${t('totalUpdates')}</span>
          </div>
          <button class="btn" @click=${this._load}>
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${t('refresh')}
          </button>
        </div>

        ${this.updates.length > 1 ? html`
          <div class="update-all-bar">
            ${this._selectedCount() > 0 ? html`
              <button class="update-all-btn selected-btn" @click=${this._updateSelected} ?disabled=${this.updating || this._selectedCount() === 0}>
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> ${t('updateSelected')} (${this._selectedCount() || 0})
              </button>
            ` : html`
              <button class="update-all-btn" @click=${this._updateAll} ?disabled=${this.updating || this.updates.length === 0}>
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.updating ? t('updatingProgress') : t('updateAllNow')}
              </button>
            `}
          </div>
        ` : ''}

        ${this._batchMode && this._selectedRepos.length > 0 ? html`
          <div class="batch-bar">
            <span>${t('batchSelected', { n: this._selectedRepos.length })}</span>
            <button class="batch-bar-btn" @click=${() => this._batchDo('update')}>${t('batchUpdate')}</button>
            <button class="batch-bar-btn danger" @click=${() => this._batchDo('remove')}>${t('batchRemove')}</button>
            <button class="batch-bar-btn" @click=${() => { this._selectedRepos = []; this._batchMode = false; }}>${t('cancel')}</button>
          </div>
        ` : ''}

        ${this._viewMode === 'list' ? html`
          <div class="list-view">${this._renderListTable(filtered)}</div>
        ` : html`
          <div class="grid">
            ${filtered.map(r => {
              const repoId = r.id || r.full_name;
              const isInstalling = !!this._installingIds?.[repoId];
              const changelog = this._changelogs?.[r.full_name];
              const isChecked = !!this._selectedIds[repoId];
              return html`
              <div class="card" @click=${(e) => { if (e.target.closest('.btn') || e.target.closest('a') || e.target.closest('.checkbox')) return; this._openDetail(r); }}>
                <div class="card-header">
                  <div class="card-left">
                    <input type="checkbox" class="checkbox" .checked=${isChecked}
                           @click=${(e) => e.stopPropagation()}
                           @change=${() => this._toggleSelect(repoId)}>
                    <div class="card-name">
                      ${r.name || r.full_name}
                      ${r.category ? html`<span class="category-badge">${r.category}</span>` : ''}
                    </div>
                  </div>
                </div>
                <div class="version-row">
                  <div class="version-item">
                    <div class="version-label">${t('currentVersion')}</div>
                    <div class="version-value old">${r.installed_version || '?'}</div>
                  </div>
                  <div class="version-item">
                    <div class="version-label">${t('latestVersion')}</div>
                    <div class="version-value new">${r.latest_version || '?'}</div>
                  </div>
                </div>
                <div class="card-desc">${r.description || ''}</div>

                ${changelog?.body ? html`
                  <div class="changelog-preview">
                    <div class="changelog-preview-title">${t('changelogTitle')} ${changelog.tag ? html`<small>(${changelog.tag})</small>` : ''}</div>
                    <div class="changelog-preview-body${this._expandedChangelogs?.[r.full_name] ? ' expanded' : ''}">${changelog.body}</div>
                    <div>
                      <button class="changelog-expand-btn" @click=${() => this._toggleChangelog(r.full_name)}>${this._expandedChangelogs?.[r.full_name] ? t('changelogShowLess') : t('changelogShowMore')}</button>
                      <a class="changelog-preview-link" href="${changelog.url || `https://github.com/${r.full_name}/releases`}" target="_blank" rel="noopener">${t('viewFullChangelog')} →</a>
                    </div>
                  </div>
                ` : ''}

                <button class="btn primary ${isInstalling ? 'installing' : ''}"
                        @click=${() => this._updateOne(r)} ?disabled=${isInstalling || this.updating}>
                  ${isInstalling
                    ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('updatingProgress')}`
                    : html`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${t('updateNow')}`}
                </button>
              </div>
            `;})}
          </div>
        `}
      `}
    `;
  }
}

customElements.define('updates-view', UpdatesView);
