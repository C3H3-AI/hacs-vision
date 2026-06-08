import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';

class ConfigView extends LitElement {
  static properties = {
    hass: { type: Object },
    _settings: { type: Object, state: true },
    _saving: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._settings = {};
    this._saving = false;
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

  static styles = css`
    :host { display: block; }
    .settings { padding: 0 4px; }
    .settings-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); margin-bottom: 4px; }
    .settings-desc { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 20px; }
    .field {
      margin-bottom: 18px; padding: 14px 16px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
    }
    .field-label { font-size: 13px; font-weight: 600; color: var(--primary-text-color); margin-bottom: 6px; }
    .field input, .field select {
      width: 100%; padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color); font-size: 14px;
      box-sizing: border-box;
    }
    .field select { appearance: auto; }
    .save-btn {
      padding: 10px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;
      background: var(--primary-color, #03a9f4); color: #fff;
      border: none; cursor: pointer; transition: opacity 0.15s;
    }
    .save-btn:hover { opacity: 0.9; }
    .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .version { font-size: 12px; color: var(--secondary-text-color); margin-top: 24px; text-align: center; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .action-btn {
      padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
    }
    .action-btn:hover { border-color: var(--primary-color); }
    .action-btn.primary { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .action-btn.primary:hover { opacity: 0.9; }
  `;

  render() {
    return html`
      <div class="settings">
        <div class="settings-title">${t('settingsTitle')}</div>
        <div class="settings-desc">${t('settingsDesc')}</div>

        <div class="field">
          <div class="field-label">${t('settingsRefreshInterval')}</div>
          <input type="number" min="60" max="86400"
            .value=${this._settings.refresh_interval ?? 3600}
            @change=${e => this._set('refresh_interval', parseInt(e.target.value) || 3600)}
          />
        </div>

        <div class="field">
          <div class="field-label">${t('settingsDefaultView')}</div>
          <select @change=${e => this._set('default_view', e.target.value)}
            .value=${this._settings.default_view || 'browse'}>
            <option value="browse">${t('tabBrowse')}</option>
            <option value="updates">${t('tabUpdates')}</option>
            <option value="management">${t('tabManagement')}</option>
          </select>
        </div>

        <div class="field">
          <div class="field-label">${t('settingsNotifyUpdates')}</div>
          <select @change=${e => this._set('notify_updates', e.target.value === 'true')}
            .value=${String(this._settings.notify_updates ?? true)}>
            <option value="true">${t('confirm')}</option>
            <option value="false">${t('cancel')}</option>
          </select>
        </div>

        <div class="field">
          <div class="field-label">${t('settingsNotifyRestart')}</div>
          <select @change=${e => this._set('notify_restart', e.target.value === 'true')}
            .value=${String(this._settings.notify_restart ?? true)}>
            <option value="true">${t('confirm')}</option>
            <option value="false">${t('cancel')}</option>
          </select>
        </div>

        <button class="save-btn" @click=${this._save} ?disabled=${this._saving}>
          ${this._saving ? t('loading') : t('confirm')}
        </button>

        <div class="actions">
          <button class="action-btn primary" @click=${this._checkUpdates}>
            ${t('checkUpdatesNotify')}
          </button>
          <button class="action-btn" @click=${this._checkAndRestart}>
            ${t('restartHA')}
          </button>
        </div>

        <div class="version">HACS Vision v1.1.2</div>
      </div>
    `;
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
    const { ConfirmDialog } = await import('../shared/confirm-dialog.js');
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
}

customElements.define('config-view', ConfigView);