import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';

class ConfigView extends LitElement {
  static properties = {
    hass: { type: Object },
    _settings: { type: Object, state: true },
    _saving: { type: Boolean, state: true },
    _showIntegrationPicker: { type: Boolean, state: true },
    _handlers: { type: Array, state: true },
    _handlerSearch: { type: String, state: true },
    _handlersLoading: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._settings = {};
    this._saving = false;
    this._showIntegrationPicker = false;
    this._handlers = [];
    this._handlerSearch = '';
    this._handlersLoading = false;
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

  async _openIntegrationPicker() {
    this._showIntegrationPicker = true;
    this._handlerSearch = '';
    if (this._handlers.length === 0) {
      this._handlersLoading = true;
      try {
        const data = await this.hass.callApi('GET', 'config/config_entries/flow_handlers');
        // API returns array of strings (domain names)
        this._handlers = Array.isArray(data)
          ? data.map(h => typeof h === 'string' ? { domain: h, name: h } : h)
          : [];
        this._handlers.sort((a, b) => (a.name || a.domain).localeCompare(b.name || b.domain));
      } catch(e) {
        console.error('Failed to load flow handlers:', e);
        this._handlers = [];
      }
      this._handlersLoading = false;
    }
  }

  _closeIntegrationPicker() {
    this._showIntegrationPicker = false;
    this._handlerSearch = '';
  }

  _selectHandler(domain) {
    this._showIntegrationPicker = false;
    this._handlerSearch = '';
    this.dispatchEvent(new CustomEvent('open-flow', {
      detail: { domain },
      bubbles: true,
      composed: true,
    }));
  }

  get _filteredHandlers() {
    const q = this._handlerSearch.toLowerCase().trim();
    if (!q) return this._handlers;
    return this._handlers.filter(h =>
      (h.name || '').toLowerCase().includes(q) ||
      (h.domain || '').toLowerCase().includes(q)
    );
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

    /* Integration Picker — match store modal style */
    .picker-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .picker-dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%; max-width: 520px; max-height: 80vh;
      display: flex; flex-direction: column;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .picker-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .picker-title { font-size: 16px; font-weight: 700; color: var(--primary-text-color, #212121); }
    .picker-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color, #727272);
      cursor: pointer; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .picker-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .picker-search {
      padding: 12px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .picker-search input {
      width: 100%; padding: 10px 12px; border-radius: 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121); font-size: 14px;
      box-sizing: border-box; transition: border-color 0.2s;
    }
    .picker-search input:focus { border-color: var(--primary-color, #03a9f4); outline: none; }
    .picker-count {
      font-size: 12px; color: var(--secondary-text-color); padding: 8px 20px 0;
    }
    .picker-list {
      overflow-y: auto; flex: 1; padding: 8px 12px;
    }
    .picker-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s;
    }
    .picker-item:hover {
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.04);
      border-color: var(--primary-color, #03a9f4);
    }
    .picker-item-domain {
      font-size: 12px; color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4);
      padding: 2px 8px; border-radius: 4px; flex-shrink: 0;
    }
    .picker-item-name { font-size: 14px; font-weight: 500; }
    .picker-empty {
      text-align: center; padding: 32px 0; color: var(--secondary-text-color); font-size: 14px;
    }
    .picker-loading {
      text-align: center; padding: 32px 0; color: var(--secondary-text-color);
    }
    .spinner {
      width: 28px; height: 28px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%; animation: spin 1s linear infinite;
      margin: 0 auto 8px;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
          <button class="action-btn primary" @click=${this._openIntegrationPicker}>
            ${t('addHAIntegration')}
          </button>
          <button class="action-btn" @click=${this._checkUpdates}>
            ${t('checkUpdatesNotify')}
          </button>
          <button class="action-btn" @click=${this._checkAndRestart}>
            ${t('restartHA')}
          </button>
        </div>

        <div class="version">HACS Vision v2.0.0</div>
      </div>

      ${this._showIntegrationPicker ? this._renderPicker() : ''}
    `;
  }

  _renderPicker() {
    const filtered = this._filteredHandlers;
    return html`
      <div class="picker-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._closeIntegrationPicker(); }}>
        <div class="picker-dialog">
          <div class="picker-header">
            <span class="picker-title">${t('addHAIntegration')}</span>
            <button class="picker-close" @click=${this._closeIntegrationPicker}>&times;</button>
          </div>
          <div class="picker-search">
            <input type="text"
              placeholder=${t('searchIntegration')}
              .value=${this._handlerSearch}
              @input=${e => { this._handlerSearch = e.target.value; }}
              @keydown=${e => { if (e.key === 'Escape') this._closeIntegrationPicker(); }}
            />
          </div>
          <div class="picker-count">${filtered.length} ${t('integrationCount')}</div>
          <div class="picker-list">
            ${this._handlersLoading ? html`
              <div class="picker-loading">
                <div class="spinner"></div>
                <div>${t('loading')}</div>
              </div>
            ` : filtered.length === 0 ? html`
              <div class="picker-empty">${t('noIntegrationMatch')}</div>
            ` : filtered.map(h => html`
              <div class="picker-item" @click=${() => this._selectHandler(h.domain)}>
                <span class="picker-item-name">${h.name || h.domain}</span>
                ${h.name && h.name !== h.domain ? html`
                  <span class="picker-item-domain">${h.domain}</span>
                ` : ''}
              </div>
            `)}
          </div>
        </div>
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
