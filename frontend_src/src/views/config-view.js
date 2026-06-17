import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { getCommonStyles } from '../shared/styles.js';
import { ConfirmDialog } from '../shared/confirm-dialog.js';

class ConfigView extends LitElement {
  static properties = {
    hass: { type: Object },
    _settings: { type: Object, state: true },
    _saving: { type: Boolean, state: true },
    _version: { type: String, state: true },
    _importing: { type: Boolean, state: true },
    _exporting: { type: Boolean, state: true },
    _depLoading: { type: Boolean, state: true },
    _depResults: { type: Object, state: true },
    _githubUser: { type: String, state: true },
    _githubAvatar: { type: String, state: true },
    _githubTokenInput: { type: String, state: true },
    _githubVerifying: { type: Boolean, state: true },
    _githubVerifyMsg: { type: String, state: true },
    _githubVerifyOk: { type: Boolean, state: true },
    _starredRepos: { type: Array, state: true },
    _starredLoading: { type: Boolean, state: true },
    _starredSyncing: { type: Boolean, state: true },
    _starredSyncResult: { type: String, state: true },
    _starredFilter: { type: String, state: true },
    _selectedStarred: { type: Object, state: true },
    _orgInput: { type: String, state: true },
    _orgRepos: { type: Array, state: true },
    _orgLoading: { type: Boolean, state: true },
    _orgFilter: { type: String, state: true },
    _selectedOrgRepos: { type: Object, state: true },
    _orgSyncResult: { type: String, state: true },
    _orgSyncing: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._settings = {};
    this._saving = false;
    this._version = '';
    this._importing = false;
    this._exporting = false;
    this._depLoading = false;
    this._depResults = null;
    this._githubUser = '';
    this._githubAvatar = '';
    this._githubTokenInput = '';
    this._githubVerifying = false;
    this._githubVerifyMsg = '';
    this._githubVerifyOk = false;
    this._syncFavToStarring = false;
    this._syncFavToStarResult = '';
    this._syncStarToFaving = false;
    this._syncStarToFavResult = '';
    this._starredRepos = [];
    this._starredLoading = false;
    this._starredSyncing = false;
    this._starredSyncResult = '';
    this._starredFilter = '';
    this._selectedStarred = {};
    this._orgInput = '';
    this._orgRepos = [];
    this._orgLoading = false;
    this._orgFilter = '';
    this._selectedOrgRepos = {};
    this._orgSyncResult = '';
    this._orgSyncing = false;
  }

  get _filteredStarredCount() {
    if (!this._starredFilter) return this._starredRepos.length;
    return this._starredRepos.filter(r => r.full_name.toLowerCase().includes(this._starredFilter.toLowerCase())).length;
  }

  get _orgFilteredCount() {
    return this._filteredSortedOrgRepos.length;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    try {
      this._settings = (await api.getSettings()) || {};
    } catch(e) {
      console.error('Settings load failed:', e);
      this._settings = {};
    }
    try {
      const data = await api.getVersion();
      this._version = data?.version || '';
    } catch(e) { /* ignore */ }
    try {
      const user = await api.getGitHubUser();
      if (user?.login) {
        this._githubUser = user.login;
        this._githubAvatar = user.avatar_url || '';
      }
    } catch(e) { /* not logged in */ }
  }

  async _save() {
    this._saving = true;
    try {
      await api.updateSettings(this._settings);
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('settingsSaved'), 'success');
    } catch(e) {
      showToast(`${t('settingsSaveFailed')}: ${e.message}`, 'error');
    }
    this._saving = false;
  }

  _set(key, val) {
    this._settings = { ...this._settings, [key]: val };
  }

  async _reloadCore() {
    try {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('reloadingHA'), 'info');
      const result = await api.reloadHA();
      if (result.success) {
        showToast(t('reloadSuccess'), 'success');
      } else {
        showToast(`${t('coreReloadFailed')}: ${result.error}`, 'error');
      }
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`${t('coreReloadFailed')}: ${e.message}`, 'error');
    }
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

  static styles = [getCommonStyles(), css`
    :host { display: block; color: var(--primary-text-color); }
    .container {
      margin: 0 auto; padding: 14px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px;
    }

    .config-grid {
      display: grid; grid-template-columns: 1fr; gap: 14px;
      align-items: start;
    }
    @media (min-width: 1024px) {
      .config-grid { grid-template-columns: 1fr 1fr 1fr; }
    }
    .config-col {
      display: flex; flex-direction: column; gap: 14px;
    }

    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 16px;
    }
    .section-title {
      font-size: 14px; font-weight: 700; color: var(--primary-text-color, #212121);
      margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
    }
    .section-title .icon { width: 18px; height: 18px; flex-shrink: 0; }

    .setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0; border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .setting-row:last-of-type { border-bottom: none; }
    .setting-info { flex: 1; min-width: 0; }
    .setting-info .label { font-size: 13px; font-weight: 500; color: var(--primary-text-color, #212121); }
    .setting-info .desc { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; }
    .setting-control { flex-shrink: 0; margin-left: 12px; }
    .setting-control select, .setting-control input {
      padding: 6px 10px; border-radius: 8px; font-size: 13px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color); min-width: 100px;
    }
    .setting-control select:focus, .setting-control input:focus {
      border-color: var(--primary-color, #03a9f4); outline: none;
    }

    .save-bar {
      display: flex; justify-content: flex-end; padding-top: 14px;
    }

    .action-grid {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .action-grid .btn {
      flex: 1; min-width: 100px;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      padding: 8px 10px; font-size: 12px;
    }
    .action-grid .btn svg { width: 16px; height: 16px; flex-shrink: 0; }

    .backup-row {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .backup-row .file-input {
      position: relative; overflow: hidden; display: inline-flex;
    }
    .backup-row .file-input input[type=file] {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer;
    }

    .version {
      text-align: center; font-size: 12px; color: var(--secondary-text-color, #727272);
      padding: 12px 0 4px;
    }
  `];

  render() {
    return html`
      <div class="container">
        <div class="config-grid">

        <!-- 列1：🔑 GitHub -->
        <div class="config-col">

        <!-- 🔑 GitHub 集成 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            GitHub
          </div>
          ${this._githubUser ? html`
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              ${this._githubAvatar
                ? html`<img src="${this._githubAvatar}" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--divider-color);flex-shrink:0;" @error=${e => e.target.style.display='none'}>`
                : html`<span style="width:28px;height:28px;border-radius:50%;background:var(--primary-color,#03a9f4);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">${this._githubUser[0].toUpperCase()}</span>`}
              <span style="font-size:13px;">✅ HACS 用户: <strong>${this._githubUser}</strong></span>
              <button class="btn" style="font-size:11px;padding:4px 10px;" @click=${this._githubLogout}>${t('logout') || '登出'}</button>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
              <button class="btn" style="font-size:11px;padding:6px 12px;" @click=${this._syncFavToStar} ?disabled=${this._syncFavToStarring}>
                ${this._syncFavToStarring ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> 同步中...`
                : this._syncFavToStarResult ? html`<span style="color:var(--primary-color,#03a9f4)">${this._syncFavToStarResult}</span>`
                : html`📤 ${t('syncFavToStar') || '收藏同步点赞'}`}
              </button>
              <button class="btn" style="font-size:11px;padding:6px 12px;" @click=${this._syncStarToFav} ?disabled=${this._syncStarToFaving}>
                ${this._syncStarToFaving ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> 同步中...`
                : this._syncStarToFavResult ? html`<span style="color:var(--primary-color,#03a9f4)">${this._syncStarToFavResult}</span>`
                : html`📥 ${t('syncStarToFav') || '点赞同步收藏'}`}
              </button>
            </div>
          ` : html`
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('githubToken') || 'GitHub Token'}</div>
                <div class="desc">${t('githubTokenDesc') || '在 GitHub Settings → Developer settings → Personal access tokens 生成'}</div>
              </div>
              <div class="setting-control" style="flex-direction:column;gap:6px;align-items:stretch;">
                <input type="text" class="token-input" autocomplete="off" style="-webkit-text-security:disc;padding:8px;border:1px solid var(--divider-color);border-radius:8px;font-size:13px;background:var(--card-background-color);color:var(--primary-text-color);width:100%;box-sizing:border-box;" placeholder="ghp_xxxxxxxxxxxx" .value=${this._githubTokenInput || ''} @input=${e => this._githubTokenInput = e.target.value} />
                <div style="display:flex;gap:6px;justify-content:flex-end;">
                  <button class="btn primary" style="font-size:12px;padding:5px 14px;" @click=${this._importHacsToken}>${this._githubVerifying ? t('importing') || '导入中...' : t('importFromHacs') || '从 HACS 导入'}</button>
                  <button class="btn" style="font-size:11px;padding:4px 10px;" @click=${this._githubVerifyToken} ?disabled=${this._githubVerifying}>${t('verifyAndSave') || '验证并保存'}</button>
                </div>
              </div>
            </div>
          `}
          ${this._githubVerifyMsg ? html`<div style="font-size:12px;margin-top:4px;color:${this._githubVerifyOk ? 'var(--primary-color,#03a9f4)' : '#f44336'};">${this._githubVerifyMsg}</div>` : ''}
        </div>

        ${this._githubUser ? html`
        <!-- ⭐ 星标仓库同步 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${t('syncStarred') || '星标仓库同步'}
          </div>
          <div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;">
            ${t('syncStarredDesc') || '从 GitHub 拉取你点赞过的仓库，勾选后添加到自定义仓库列表'}
          </div>
          ${this._starredLoading ? html`
            <div style="padding:20px;text-align:center;color:var(--secondary-text-color);font-size:13px;">
              <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              正在从 GitHub 加载星标仓库...
            </div>
          ` : this._starredRepos.length > 0 ? html`
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;">
                <input type="checkbox" .checked=${this._filteredStarredCount > 0 && Object.keys(this._selectedStarred).length === this._filteredStarredCount}
                  ?indeterminate=${Object.keys(this._selectedStarred).length > 0 && Object.keys(this._selectedStarred).length < this._filteredStarredCount}
                  @change=${e => this._toggleSelectAllStarred(e.target.checked)}>
                全选
              </label>
              <span style="font-size:13px;font-weight:600;">${this._starredRepos.length} 个星标仓库</span>
              <input type="text" placeholder="筛选..." .value=${this._starredFilter}
                @input=${e => { this._starredFilter = e.target.value; this.requestUpdate(); }}
                style="flex:1;padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--card-background-color);color:var(--primary-text-color);">
              <button class="btn primary" style="font-size:11px;padding:4px 10px;" @click=${this._syncSelectedStarred} ?disabled=${this._starredSyncing || Object.keys(this._selectedStarred).length === 0}>
                ${this._starredSyncing ? '同步中...' : `同步选中 (${Object.keys(this._selectedStarred).length})`}
              </button>
              <button class="btn" style="font-size:11px;padding:4px 10px;" @click=${this._refreshStarred}>
                刷新
              </button>
            </div>
            ${this._starredSyncResult ? html`<div style="font-size:12px;margin-bottom:8px;color:${this._starredSyncResult.includes('失败') ? '#f44336' : 'var(--primary-text-color)'};">${this._starredSyncResult}</div>` : ''}
            <div style="max-height:300px;overflow-y:auto;border:1px solid var(--divider-color);border-radius:8px;">
              ${this._starredRepos.filter(r => !this._starredFilter || r.full_name.toLowerCase().includes(this._starredFilter.toLowerCase())).map(r => html`
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--divider-color);font-size:12px;cursor:pointer;" @click=${() => this._toggleSelectStarred(r.full_name)}>
                  <input type="checkbox" .checked=${!!this._selectedStarred[r.full_name]}
                    @click=${(e) => { e.stopPropagation(); this._toggleSelectStarred(r.full_name); }}
                    style="cursor:pointer;">
                  <span style="flex:1;">
                    <strong>${r.full_name}</strong>
                    <span style="color:var(--secondary-text-color);margin-left:6px;">
                      ⭐${r.stars?.toLocaleString() || 0}
                      ${r.category ? html`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${r.category}</span>` : ''}
                    </span>
                    ${r.description ? html`<br><span style="color:var(--secondary-text-color);">${r.description.slice(0, 80)}</span>` : ''}
                  </span>
                </div>
              `)}
            </div>
          ` : html`
            <button class="btn" style="font-size:12px;padding:6px 14px;" @click=${this._loadStarredRepos}>
              ${t('loadStarred') || '加载星标仓库'}
            </button>
          `}
        </div>
        ` : ''}

        ${this._githubUser ? html`
        <!-- 👥 组织/用户仓库 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${t('orgRepos')}
          </div>
          <div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;">
            ${t('orgReposDesc')}
          </div>
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <input type="text" placeholder="GitHub 组织名或 URL（如 C3H3-AI 或 https://github.com/C3H3-AI）" .value=${this._orgInput}
              @input=${e => this._orgInput = e.target.value}
              @keydown=${e => e.key === 'Enter' && this._loadOrgRepos()}
              style="flex:1;padding:8px;border:1px solid var(--divider-color);border-radius:8px;font-size:13px;background:var(--card-background-color);color:var(--primary-text-color);">
            <button class="btn primary" style="font-size:12px;padding:6px 14px;white-space:nowrap;" @click=${this._loadOrgRepos} ?disabled=${this._orgLoading}>
              ${this._orgLoading ? t('searching') : t('load')}
            </button>
          </div>
          ${this._orgLoading ? html`
            <div style="padding:20px;text-align:center;color:var(--secondary-text-color);font-size:13px;">
              <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              正在加载仓库列表...
            </div>
          ` : this._orgRepos.length > 0 ? html`
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;">
                <input type="checkbox" .checked=${this._orgFilteredCount > 0 && Object.keys(this._selectedOrgRepos).length === this._orgFilteredCount}
                  ?indeterminate=${Object.keys(this._selectedOrgRepos).length > 0 && Object.keys(this._selectedOrgRepos).length < this._orgFilteredCount}
                  @change=${e => this._toggleSelectAllOrgRepos(e.target.checked)}>
              ${t('selectAll')}
              </label>
              <span style="font-size:13px;font-weight:600;">${this._orgRepos.length} ${t('repositories')}</span>
              <input type="text" placeholder="筛选..." .value=${this._orgFilter}
                @input=${e => { this._orgFilter = e.target.value; this.requestUpdate(); }}
                style="flex:1;padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--card-background-color);color:var(--primary-text-color);">
              <button class="btn primary" style="font-size:11px;padding:4px 10px;" @click=${this._syncSelectedOrgRepos} ?disabled=${this._orgSyncing || Object.keys(this._selectedOrgRepos).length === 0}>
                ${this._orgSyncing ? t('syncing') : `${t('syncSelected')} (${Object.keys(this._selectedOrgRepos).length})`}
              </button>
            </div>
            ${this._orgSyncResult ? html`<div style="font-size:12px;margin-bottom:8px;color:${this._orgSyncResult.includes('失败') ? '#f44336' : 'var(--primary-text-color)'};">${this._orgSyncResult}</div>` : ''}
            <div style="max-height:300px;overflow-y:auto;border:1px solid var(--divider-color);border-radius:8px;">
              ${this._filteredSortedOrgRepos.map(r => html`
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--divider-color);font-size:12px;cursor:pointer;" @click=${() => this._toggleSelectOrgRepo(r.full_name)}>
                  <input type="checkbox" .checked=${!!this._selectedOrgRepos[r.full_name]}
                    @click=${(e) => { e.stopPropagation(); this._toggleSelectOrgRepo(r.full_name); }}
                    style="cursor:pointer;">
                  <span style="flex:1;">
                    <strong>${r.full_name}</strong>
                    <span style="color:var(--secondary-text-color);margin-left:6px;">
                      ⭐${r.stars?.toLocaleString() || 0}
                      ${r.category ? html`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${r.category}</span>` : ''}
                      ${r.language ? html`<span style="margin-left:4px;color:var(--secondary-text-color);font-size:10px;">${r.language}</span>` : ''}
                    </span>
                    ${r.description ? html`<br><span style="color:var(--secondary-text-color);">${r.description.slice(0, 80)}</span>` : ''}
                  </span>
                </div>
              `)}
            </div>
          ` : ''}
        </div>
        ` : ''}
        </div> <!-- /config-col: GitHub -->

        <!-- 列2：⚙️ 基本设置 -->
        <div class="config-col">
          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${t('settingsTitle')}
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('settingsRefreshInterval')}</div>
                <div class="desc">${t('settingsDesc')}</div>
              </div>
              <div class="setting-control">
                <input type="number" min="60" max="86400" style="width:90px;"
                  .value=${this._settings.refresh_interval ?? 3600}
                  @change=${e => this._set('refresh_interval', parseInt(e.target.value) || 3600)} />
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('settingsDefaultView')}</div>
              </div>
              <div class="setting-control">
                <select @change=${e => this._set('default_view', e.target.value)}
                  .value=${this._settings.default_view || 'browse'}>
                  <option value="browse">${t('tabBrowse')}</option>
                  <option value="updates">${t('tabUpdates')}</option>
                  <option value="management">${t('tabManagement')}</option>
                </select>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('settingsNotifyUpdates')}</div>
              </div>
              <div class="setting-control">
                <select @change=${e => this._set('notify_updates', e.target.value === 'true')}
                  .value=${String(this._settings.notify_updates ?? true)}>
                  <option value="true">${t('enabled')}</option>
                  <option value="false">${t('disabled')}</option>
                </select>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('settingsNotifyRestart')}</div>
              </div>
              <div class="setting-control">
                <select @change=${e => this._set('notify_restart', e.target.value === 'true')}
                  .value=${String(this._settings.notify_restart ?? true)}>
                  <option value="true">${t('enabled')}</option>
                  <option value="false">${t('disabled')}</option>
                </select>
              </div>
            </div>
            <div class="save-bar">
              <button class="btn primary" @click=${this._save} ?disabled=${this._saving}>
                ${this._saving
                  ? html`<span class="spinner-sm" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;vertical-align:-2px;"></span> ${t('loading')}`
                  : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> ${t('save')}`}
              </button>
            </div>
          </div>
        </div>

        <!-- 列3：🛠️ 维护 + 数据 + 依赖 -->
        <div class="config-col">
          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              ${t('settingsMaintenance')}
            </div>
            <div class="action-grid">
              <button class="btn" @click=${this._checkUpdates}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                ${t('checkUpdatesNotify')}
              </button>
              <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._reloadCore}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                ${t('reloadHA')}
              </button>
              <button class="btn danger" @click=${this._checkAndRestart}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ${t('restartHA')}
              </button>
              <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._clearPanelCache}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                ${t('clearCache')}
              </button>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${t('exportBackup')}
            </div>
            <div class="backup-row">
              <button class="btn primary" @click=${this._export} ?disabled=${this._exporting}>
                ${this._exporting
                  ? html`<span class="spinner-sm" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;"></span> ${t('exporting')}`
                  : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t('exportBtn')}`}
              </button>
              <button class="btn file-input" ?disabled=${this._importing}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                ${this._importing ? html`${t('importing')}` : html`${t('importBackup')}`}
                <input type="file" accept=".json" @change=${e => this._import(e)} />
              </button>
              <span style="font-size:11px;color:var(--secondary-text-color,#727272);">${t('importDesc')}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${t('depCheck')}
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${t('depDesc')}</div>
              </div>
              <div class="setting-control">
                <button class="btn" @click=${this._checkDependencies} ?disabled=${this._depLoading}>
                  ${this._depLoading ? '⟳' : '🔗'} ${t('checkDep')}
                </button>
              </div>
            </div>
            ${this._depResults?.dependencies?.filter(d => d.has_issues).length > 0 ? html`
              <div style="margin-top:8px;font-size:12px;color:var(--secondary-text-color);">
                ${this._depResults.dependencies.filter(d => d.has_issues).map(d => html`
                  <div style="padding:4px 0;display:flex;gap:6px;align-items:center;">
                    <span style="color:#f44336;">✕</span> <span>${d.name}</span>
                    ${d.missing_dependencies?.length ? html`<span style="color:var(--secondary-text-color);">— ${t('depMissing')}: ${d.missing_dependencies.join(', ')}</span>` : ''}
                  </div>
                `)}
              </div>
            ` : this._depResults?.all_ok ? html`
              <div style="margin-top:8px;font-size:12px;color:#4caf50;">✅ ${t('depOk')}</div>
            ` : ''}
          </div>
        </div>

        </div> <!-- /config-col: 维护 -->
        </div> <!-- config-grid -->
        <div class="version">HACS Vision${this._version ? ` v${this._version}` : ''}</div>
      </div>
    `;
  }

  async _githubVerifyToken() {
    if (!this._githubTokenInput?.trim()) {
      this._githubVerifyMsg = t('githubTokenRequired') || '请输入 Token';
      this._githubVerifyOk = false;
      return;
    }
    this._githubVerifying = true;
    this._githubVerifyMsg = '';
    try {
      const { showToast } = await import('../hacs-vision-panel.js');
      const result = await api.verifyGitHubToken(this._githubTokenInput.trim());
      if (result?.ok) {
        this._githubUser = result.user;
        this._githubAvatar = result.avatar_url || '';
        this._githubTokenInput = '';
        this._githubVerifyMsg = `已验证 ✅ 用户: ${result.user} (剩余 ${result.rate_limit_remaining}/5000 次/小时)`;
        this._githubVerifyOk = true;
        showToast(`GitHub 登录成功: ${result.user}`, 'success');
      } else {
        this._githubVerifyMsg = result?.error || '验证失败';
        this._githubVerifyOk = false;
      }
    } catch(e) {
      this._githubVerifyMsg = `验证失败: ${e.message}`;
      this._githubVerifyOk = false;
    }
    this._githubVerifying = false;
  }

  async _githubLogout() {
    try {
      await api.verifyGitHubToken('');
      this._githubUser = '';
      this._githubAvatar = '';
      this._githubVerifyMsg = '已登出';
      this._githubVerifyOk = false;
      this._starredRepos = [];
      this._syncFavToStarResult = '';
      this._syncStarToFavResult = '';
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast('已登出 GitHub', 'info');
    } catch(e) { /* ignore */ }
  }

  async _syncFavToStar() {
    this._syncFavToStarResult = '';
    this._syncFavToStarring = true;
    try {
      const resp = await api.getFavorites();
      const favs = Array.isArray(resp) ? resp : (resp?.favorites || []);
      const valid = favs.filter(f => typeof f === 'string' && f.includes('/'));
      const results = await Promise.allSettled(valid.map(repoId => api.starRepo(repoId)));
      const ok = results.filter(r => r.status === 'fulfilled').length;
      const fail = results.filter(r => r.status === 'rejected').length;
      this._syncFavToStarResult = fail > 0
        ? `已完成: ${ok} 成功, ${fail} 失败`
        : `✓ ${ok} 个同步成功`;
      if (fail > 0) {
        const { showToast } = await import('../hacs-vision-panel.js');
        showToast(`${fail} 个仓库无权限点赞`, 'warning');
      }
    } catch(e) {
      this._syncFavToStarResult = `同步失败: ${e.message}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`同步失败: ${e.message}`, 'error');
    }
    this._syncFavToStarring = false;
  }

  async _syncStarToFav() {
    this._syncStarToFavResult = '';
    this._syncStarToFaving = true;
    try {
      const starredResp = await api.listStarred();
      const starred = starredResp?.repos || [];
      const fullNames = starred.map(r => r.full_name || r.fullName || r.name || '').filter(Boolean);
      const favsResp = await api.getFavorites();
      const existing = Array.isArray(favsResp) ? [...favsResp] : [...(favsResp?.favorites || [])];
      let added = 0;
      for (const name of fullNames) {
        if (!existing.includes(name)) {
          existing.push(name);
          added++;
        }
      }
      if (added > 0) {
        await api.setFavorites(existing);
        this._syncStarToFavResult = `✓ 新增 ${added} 个收藏`;
      } else {
        this._syncStarToFavResult = '无新增';
      }
    } catch(e) {
      this._syncStarToFavResult = `同步失败: ${e.message}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`同步失败: ${e.message}`, 'error');
    }
    this._syncStarToFaving = false;
  }

  async _loadStarredRepos() {
    this._starredLoading = true;
    this._starredSyncResult = '';
    this._selectedStarred = {};
    try {
      const result = await api.listStarred();
      if (result?.repos) {
        this._starredRepos = result.repos;
        if (result.repos.length === 0) {
          const { showToast } = await import('../hacs-vision-panel.js');
          showToast('没有找到星标仓库', 'info');
        }
      } else {
        const { showToast } = await import('../hacs-vision-panel.js');
        showToast(result?.error || '加载失败', 'error');
      }
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`加载失败: ${e.message}`, 'error');
    }
    this._starredLoading = false;
  }

  async _refreshStarred() {
    this._starredRepos = [];
    await this._loadStarredRepos();
  }

  _toggleSelectStarred(fullName) {
    if (this._selectedStarred[fullName]) {
      this._selectedStarred = { ...this._selectedStarred };
      delete this._selectedStarred[fullName];
    } else {
      this._selectedStarred = { ...this._selectedStarred, [fullName]: true };
    }
  }

  _toggleSelectAllStarred(checked) {
    const filtered = this._starredRepos.filter(r => !this._starredFilter || r.full_name.toLowerCase().includes(this._starredFilter.toLowerCase()));
    if (checked) {
      const sel = {};
      filtered.forEach(r => sel[r.full_name] = true);
      this._selectedStarred = sel;
    } else {
      this._selectedStarred = {};
    }
  }

  async _syncSelectedStarred() {
    const selectedNames = Object.keys(this._selectedStarred);
    if (selectedNames.length === 0) return;
    this._starredSyncing = true;
    this._starredSyncResult = '';
    try {
      const reposToSync = this._starredRepos
        .filter(r => this._selectedStarred[r.full_name])
        .map(r => ({
          full_name: r.full_name,
          category: r.category || 'integration',
        }));
      if (reposToSync.length === 0) {
        this._starredSyncResult = '没有选中的仓库';
        this._starredSyncing = false;
        return;
      }
      const result = await api.syncStarred(reposToSync);
      const results = result?.results || [];
      const ok = results.filter(r => r.success).length;
      const fail = results.filter(r => !r.success).length;
      this._starredSyncResult = `同步完成: ${ok} 个成功${fail ? `, ${fail} 个失败` : ''}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`已添加 ${ok} 个星标仓库到自定义列表`, fail ? 'warning' : 'success');
    } catch(e) {
      this._starredSyncResult = `同步失败: ${e.message}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`同步失败: ${e.message}`, 'error');
    }
    this._starredSyncing = false;
  }

  get _filteredSortedOrgRepos() {
    const q = (this._orgFilter || '').trim().toLowerCase();
    if (!q) return this._orgRepos;
    return [...this._orgRepos]
      .filter(r => r.full_name.toLowerCase().includes(q))
      .sort((a, b) => {
        const na = a.full_name.toLowerCase();
        const nb = b.full_name.toLowerCase();
        if (na === q && nb !== q) return -1;
        if (nb === q && na !== q) return 1;
        if (na.startsWith(q) && !nb.startsWith(q)) return -1;
        if (nb.startsWith(q) && !na.startsWith(q)) return 1;
        return na.length - nb.length;
      });
  }

  async _importHacsToken() {
    this._githubVerifying = true;
    this._githubVerifyMsg = '';
    try {
      const { showToast } = await import('../hacs-vision-panel.js');
      const result = await api.importHacsToken();
      if (result?.token) {
        this._githubTokenInput = result.token;
        showToast(t('tokenImported') || '已从 HACS 导入 Token', 'success');
        // Auto verify after import
        await this._githubVerifyToken();
      } else {
        showToast(result?.error || t('tokenImportFailed') || 'HACS 中未找到 Token', 'warning');
      }
    } catch(e) {
      this._githubVerifying = false;
      showToast(`${t('tokenImportFailed') || '导入失败'}: ${e.message}`, 'error');
    }
    this._githubVerifying = false;
  }

  async _loadOrgRepos() {
    const org = this._orgInput?.trim();
    if (!org) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast('请输入 GitHub 组织名或 URL', 'warning');
      return;
    }
    this._orgLoading = true;
    this._orgRepos = [];
    this._selectedOrgRepos = {};
    this._orgSyncResult = '';
    try {
      const result = await api.listOrgRepos(org);
      if (result?.repos) {
        this._orgRepos = result.repos;
        if (result.repos.length === 0) {
          const { showToast } = await import('../hacs-vision-panel.js');
          showToast('没有找到仓库', 'info');
        }
      } else {
        const { showToast } = await import('../hacs-vision-panel.js');
        showToast(result?.error || '加载失败', 'error');
      }
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`加载失败: ${e.message}`, 'error');
    }
    this._orgLoading = false;
  }

  _toggleSelectOrgRepo(fullName) {
    if (this._selectedOrgRepos[fullName]) {
      const updated = { ...this._selectedOrgRepos };
      delete updated[fullName];
      this._selectedOrgRepos = updated;
    } else {
      this._selectedOrgRepos = { ...this._selectedOrgRepos, [fullName]: true };
    }
  }

  _toggleSelectAllOrgRepos(checked) {
    const filtered = this._orgRepos.filter(r => !this._orgFilter || r.full_name.toLowerCase().includes(this._orgFilter.toLowerCase()));
    if (checked) {
      const sel = {};
      filtered.forEach(r => sel[r.full_name] = true);
      this._selectedOrgRepos = sel;
    } else {
      this._selectedOrgRepos = {};
    }
  }

  async _syncSelectedOrgRepos() {
    const selectedNames = Object.keys(this._selectedOrgRepos);
    if (selectedNames.length === 0) return;
    this._orgSyncing = true;
    this._orgSyncResult = '';
    try {
      const reposToSync = this._orgRepos
        .filter(r => this._selectedOrgRepos[r.full_name])
        .map(r => ({
          full_name: r.full_name,
          category: r.category || 'integration',
        }));
      if (reposToSync.length === 0) {
        this._orgSyncResult = '没有选中的仓库';
        this._orgSyncing = false;
        return;
      }
      const result = await api.syncStarred(reposToSync);
      const results = result?.results || [];
      const ok = results.filter(r => r.success).length;
      const fail = results.filter(r => !r.success).length;
      this._orgSyncResult = `同步完成: ${ok} 个成功${fail ? `, ${fail} 个失败` : ''}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`已添加 ${ok} 个仓库到自定义列表`, fail ? 'warning' : 'success');
    } catch(e) {
      this._orgSyncResult = `同步失败: ${e.message}`;
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`同步失败: ${e.message}`, 'error');
    }
    this._orgSyncing = false;
  }

  async _export() {
    this._exporting = true;
    try {
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hacs_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('exportSuccess'), 'success');
    } catch(e) {
      showToast(`${t('exportFailed')}: ${e.message}`, 'error');
    }
    this._exporting = false;
  }

  async _import(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    const ok = await ConfirmDialog.show(this, {
      message: t('importDesc'),
      confirmText: t('importBackup'),
      danger: true,
    });
    if (!ok) return;
    this._importing = true;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const result = await api.importBackup(data);
      const { showToast } = await import('../hacs-vision-panel.js');
      if (result.success) {
        showToast(t('importSuccess'), 'success');
        this._load();
      } else {
        showToast(`${t('importFailed')}: ${result.error}`, 'error');
      }
    } catch(e) {
      showToast(`${t('importFailed')}: ${e.message}`, 'error');
    }
    this._importing = false;
    e.target.value = '';
  }

  async _checkUpdates() {
    try {
      const result = await api.checkUpdatesWithNotify();
      const { showToast } = await import('../hacs-vision-panel.js');
      if (result.success) {
        if (result.updates_found > 0) {
          showToast(t('updatesChecked', { n: result.updates_found }), 'success');
        } else {
          showToast(t('noUpdatesFound'), 'info');
        }
        if (result.notified) showToast(t('notifySent'), 'success');
      }
    } catch(e) {
      showToast(`Update check failed: ${e.message}`, 'error');
    }
  }

  async _checkAndRestart() {
    const ok = await ConfirmDialog.show(this, {
      message: t('restartConfirm'),
      confirmText: t('restartHA'),
      danger: true,
    });
    if (!ok) return;
    try {
      await api.restartHA();
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('haRestarting'), 'info');
    } catch(e) {
      showToast(`${t('restartFailed')}: ${e.message}`, 'error');
    }
  }

  async _clearPanelCache() {
    const { ConfirmDialog } = await import('../shared/confirm-dialog.js');
    const ok = await ConfirmDialog.show(this, {
      message: t('clearCacheConfirm'),
      confirmText: t('confirm'),
      danger: false,
    });
    if (!ok) return;
    try {
      // Try Cache Storage API (only available in secure contexts/HTTPS)
      if (typeof caches !== 'undefined' || typeof window.caches !== 'undefined') {
        const cacheApi = typeof caches !== 'undefined' ? caches : window.caches;
        const keys = await cacheApi.keys();
        await Promise.all(keys.map(k => cacheApi.delete(k)));
      }
      // Clear only HACS Vision localStorage keys (not all localStorage)
      const hacsKeys = Object.keys(localStorage).filter(k => k.startsWith('hacs_vision'));
      hacsKeys.forEach(k => localStorage.removeItem(k));
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('clearCacheDone'), 'success');
      // Cache-busting reload: add a timestamp param to force fresh load
      setTimeout(() => { location.href = location.pathname + '?_t=' + Date.now(); }, 1500);
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`${t('clearCache')}: ${e.message}`, 'error');
    }
  }

}

customElements.define('config-view', ConfigView);
