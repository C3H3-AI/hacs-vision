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
    :host { display: block; }
    .container {
      margin: 0 auto; padding: 14px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px;
    }

    @media (min-width: 1024px) {
      .config-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        align-items: start;
      }
    }

    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 16px; margin-bottom: 14px;
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

        <!-- ⚙️ 基本设置 -->
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

        <!-- 🛠️ 维护 -->
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

        <!-- 💾 数据管理 -->
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

        <!-- 依赖检查 -->
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

        </div> <!-- config-grid -->
        <div class="version">HACS Vision${this._version ? ` v${this._version}` : ''}</div>
      </div>
    `;
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
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      localStorage.clear();
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(t('clearCacheDone'), 'success');
      setTimeout(() => location.reload(), 1500);
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`${t('clearCache')}: ${e.message}`, 'error');
    }
  }

}

customElements.define('config-view', ConfigView);
