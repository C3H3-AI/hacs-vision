import { LitElement, html, css } from 'lit';
import { getCommonStyles } from '../shared/styles.js';
import { t } from '../i18n.js';
import { api } from '../api.js';

class DeviceView extends LitElement {
  static properties = {
    hass: { type: Object },
    entryId: { type: String },
    domain: { type: String },
    entryTitle: { type: String },
    _groups: { type: Array, state: true },
    _loading: { type: Boolean, state: true },
    _collapsed: { type: Object, state: true },
    _error: { type: String, state: true },
    _toggling: { type: Object, state: true },
    _deviceCollapsed: { type: Object, state: true },
  };

  constructor() {
    super();
    this.entryId = '';
    this.domain = '';
    this.entryTitle = '';
    this._groups = [];
    this._loading = false;
    this._collapsed = {};
    this._allCollapsed = false;
    this._error = '';
    this._toggling = {};
    this._deviceCollapsed = {};
  }

  get _totalDeviceCount() {
    return this._groups.reduce((a, g) => a + g.devices.length, 0);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.entryId) this._load();
  }

  updated(changedProps) {
    if (changedProps.has('entryId') && this.entryId) {
      this._load();
    }
  }

  async _load() {
    this._loading = true;
    this._error = '';
    try {
      const data = await api.get(`devices/${this.entryId}`);
      this._groups = data.groups || [];
      // Auto-collapse groups with 0 devices
      for (const g of this._groups) {
        if (!this._collapsed[g.area]) {
          this._collapsed[g.area] = false;
        }
      }
      this.requestUpdate();
    } catch(e) {
      this._error = e.message || 'Failed to load devices';
      this._groups = [];
    }
    this._loading = false;
  }

  _toggleArea(area) {
    this._collapsed = { ...this._collapsed, [area]: !this._collapsed[area] };
  }

  _toggleDevice(deviceId) {
    this._deviceCollapsed = { ...this._deviceCollapsed, [deviceId]: !this._deviceCollapsed[deviceId] };
  }

  _toggleAll() {
    this._allCollapsed = !this._allCollapsed;
    const newState = {};
    const newDeviceState = {};
    for (const g of this._groups) {
      newState[g.area] = this._allCollapsed;
      for (const d of g.devices) {
        newDeviceState[d.device_id || d.entity_id || d.name] = this._allCollapsed;
      }
    }
    this._collapsed = newState;
    this._deviceCollapsed = newDeviceState;
  }

  _entityIcon(domain, state) {
    if (!state || state === 'unavailable' || state === 'unknown') return '⊙';
    if (state === 'on' || state === 'open' || state === 'home') return '●';
    if (state === 'off' || state === 'closed' || state === 'not_home') return '○';
    // Domain-based icons
    const icons = {
      light: '💡', switch: '🔌', sensor: '📊', binary_sensor: '🔍',
      climate: '🌡️', cover: '🚪', fan: '🌀', lock: '🔒',
      alarm_control_panel: '🔔', camera: '📷', media_player: '📺',
      vacuum: '🧹', weather: '☀️', device_tracker: '📍',
      person: '👤', sun: '☀️', automation: '⚡', script: '📜',
      input_boolean: '🔘', input_number: '🔢', input_select: '📋',
      number: '🔢', select: '📋', button: '🔘', text: '📝',
    };
    return icons[domain] || '◆';
  }

  _stateColor(state) {
    if (!state || state === 'unavailable' || state === 'unknown') return 'var(--secondary-text-color, #888)';
    if (state === 'on' || state === 'open' || state === 'home') return '#4caf50';
    if (state === 'off' || state === 'closed' || state === 'not_home') return '#9e9e9e';
    return 'var(--primary-text-color, #212121)';
  }

  _formatState(state, domain, unit) {
    if (!state || state === 'unavailable') return '不可用';
    if (state === 'unknown') return '未知';
    if (state === 'on') return '开';
    if (state === 'off') return '关';
    if (state === 'open') return '已打开';
    if (state === 'closed') return '已关闭';
    if (state === 'home') return '在家';
    if (state === 'not_home') return '离家';
    // Climate modes
    const modes = { cool: '❄️ 制冷', heat: '🔥 制热', fan_only: '🌀 送风', dry: '💧 除湿', auto: '🤖 自动', 'off': '关' };
    if (modes[state]) return modes[state];
    // Return value with unit
    return unit ? `${state} ${unit}` : state;
  }

  _stateIcon(state) {
    if (!state || state === 'unavailable' || state === 'unknown') return '⊙';
    if (state === 'on' || state === 'open' || state === 'home') return '●';
    if (state === 'off' || state === 'closed' || state === 'not_home') return '○';
    return '◆';
  }

  render() {
    return html`
      <div class="device-view">
        <div class="dv-header">
          <div class="dv-header-left">
            <div class="dv-back" @click=${() => this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <div class="dv-header-icon">
              <img class="dv-header-img" src="https://brands.home-assistant.io/${this.domain}/icon.png" alt=""
                @error=${function() {
                  try {
                    if (!this.parentElement) return;
                    this.style.display = 'none';
                    const fl = this.parentElement.querySelector('.dv-header-letter');
                    if (fl) fl.style.display = 'flex';
                  } catch(e) {}
                }}>
              <span class="dv-header-letter" style="display:none">${(this.domain || '').charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div class="dv-title">${this.entryTitle || this.domain}</div>
              <div class="dv-subtitle">${t('deviceAndService') || '设备与服务'}</div>
            </div>
          </div>
          <button class="dv-close" aria-label="${t('close') || '关闭'}" title="${t('close') || '关闭'}" @click=${() => this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        ${this._loading ? html`
          <div class="dv-loading">
            <div class="spinner-sm"></div>
            <div>${t('loading')}</div>
          </div>
        ` : this._error ? html`
          <div class="dv-error">
            <div class="dv-error-icon">⚠</div>
            <div>${this._error}</div>
          </div>
        ` : this._groups.length === 0 ? html`
          <div class="dv-empty">
            <div>${t('noDevices') || '暂无设备'}</div>
          </div>
        ` : html`
          <div class="dv-toolbar">
            <span class="dv-summary">${this._groups.reduce((a,g) => a + g.devices.length, 0)} ${t('deviceCount') || '个设备'} · ${this._groups.length} ${t('areaCount') || '个区域'}</span>
            <button class="dv-collapse-btn" @click=${this._toggleAll}>${this._allCollapsed ? (t('expandAll') || '展开全部') : (t('collapseAll') || '全部折叠')}</button>
          </div>
          <div class="dv-groups">
            ${this._groups.map(g => html`
              <div class="dv-group">
                <div class="dv-group-header" @click=${() => this._toggleArea(g.area)}>
                  <svg class="dv-arrow ${this._collapsed[g.area] ? 'closed' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                  <span class="dv-group-name">${g.area}</span>
                  <span class="dv-group-count">${g.devices.length} 个设备</span>
                </div>
                ${!this._collapsed[g.area] ? html`
                  <div class="dv-devices">
                    ${g.devices.map(d => html`
                      <div class="dv-device">
                        <div class="dv-device-header" @click=${() => this._toggleDevice(d.device_id || d.entity_id || d.name)}>
                          <svg class="dv-dirarrow ${this._deviceCollapsed[d.device_id || d.entity_id || d.name] ? 'closed' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
                          <svg class="dv-device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                          <span class="dv-device-name">${d.name}</span>
                          ${d.model ? html`<span class="dv-device-model">${d.model}</span>` : ''}
                          <span class="dv-device-ecount">${d.entities.filter(e => !e.disabled).length} 个实体</span>
                        </div>
                        ${!this._deviceCollapsed[d.device_id || d.entity_id || d.name] ? html`
                        <div class="dv-entities">
                          ${d.entities.map(e => e.disabled ? '' : html`
                            <div class="dv-entity ${this._canToggle(e) ? 'toggleable' : ''}"
                              @click=${this._canToggle(e) ? (ev) => this._toggleEntity(e, ev) : () => this._openMoreInfo(e.entity_id)}>
                              <span class="dv-entity-icon">${this._entityIcon(e.domain, e.state)}</span>
                              <span class="dv-entity-name" title="${e.entity_id}">${e.name || e.entity_id.split('.').pop()}</span>
                              <span class="dv-entity-state" style="color:${this._stateColor(e.state)}">${this._formatState(e.state, e.domain, e.unit)}</span>
                              ${this._canToggle(e) ? html`
                                <span class="dv-toggle ${e.state === 'on' || e.state === 'open' ? 'on' : ''}">
                                  ${this._toggling[e.entity_id] ? '⟳' : ''}
                                </span>
                              ` : html`
                                <span class="dv-more">›</span>
                              `}
                            </div>
                          `)}
                        </div>
                        ` : ''}
                      </div>
                    `)}
                  </div>
                ` : ''}
              </div>
            `)}
          </div>
        `}
      </div>
    `;
  }

  _openMoreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('more-info', {
      bubbles: true, composed: true,
      detail: { entityId },
    }));
  }

  _canToggle(entity) {
    const toggleable = ['switch', 'light', 'fan', 'input_boolean', 'automation', 'script', 'lock', 'cover', 'vacuum'];
    return toggleable.includes(entity.domain) && this.hass;
  }

  async _toggleEntity(entity, e) {
    e.stopPropagation();
    if (this._toggling[entity.entity_id]) return;
    this._toggling = { ...this._toggling, [entity.entity_id]: true };
    try {
      if (entity.domain === 'lock') {
        const service = entity.state === 'locked' ? 'unlock' : 'lock';
        await this.hass.callService(entity.domain, service, { entity_id: entity.entity_id });
      } else if (entity.domain === 'cover') {
        const service = entity.state === 'open' || entity.state === 'opening' ? 'close' : 'open';
        await this.hass.callService(entity.domain, service, { entity_id: entity.entity_id });
      } else if (entity.domain === 'button') {
        await this.hass.callService(entity.domain, 'press', { entity_id: entity.entity_id });
      } else if (entity.domain === 'vacuum') {
        await this.hass.callService(entity.domain, 'toggle', { entity_id: entity.entity_id });
      } else {
        await this.hass.callService('homeassistant', 'toggle', { entity_id: entity.entity_id });
      }
    } catch(e) {
      console.error('Toggle failed:', e);
    }
    this._toggling = { ...this._toggling, [entity.entity_id]: false };
  }

  static styles = [getCommonStyles(), css`
    .device-view {
      display: flex; flex-direction: column; height: 100%;
      user-select: text;
      -webkit-user-select: text;
    }
    .dv-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 18px; border-bottom: 1px solid var(--divider-color, #e0e0e0); flex-shrink: 0;
    }
    .dv-header-left { display: flex; align-items: center; gap: 12px; }
    .dv-back {
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      border-radius: 50%; cursor: pointer; color: var(--primary-color, #03a9f4);
      transition: background 0.15s;
    }
    .dv-back:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.08); }
    .dv-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
    .dv-subtitle { font-size: 11px; color: var(--secondary-text-color); margin-top: 1px; }
    .dv-header-icon {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-color, #03a9f4); overflow: hidden;
    }
    .dv-header-img { width: 100%; height: 100%; object-fit: cover; }
    .dv-header-letter { font-size: 15px; font-weight: 700; color: #fff; }
    .dv-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color);
      cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
    }
    .dv-close svg { width: 16px; height: 16px; }
    .dv-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }

    .dv-loading, .dv-error, .dv-empty {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; color: var(--secondary-text-color); padding: 40px;
    }
    .dv-error-icon { font-size: 32px; }

    .dv-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 18px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }
    .dv-summary { font-size: 12px; color: var(--secondary-text-color); }
    .dv-collapse-btn {
      font-size: 12px; color: var(--primary-color, #03a9f4); background: none;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
      padding: 4px 10px; cursor: pointer;
    }
    .dv-collapse-btn:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.06); }

    .dv-groups { flex: 1; overflow-y: auto; padding: 8px 0; }
    .dv-group-header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 18px; cursor: pointer; transition: background 0.1s;
      user-select: none;
    }
    .dv-group-header:hover { background: var(--secondary-background-color, #f5f5f5); }
    .dv-arrow { width: 14px; height: 14px; transition: transform 0.2s; color: var(--secondary-text-color); }
    .dv-arrow.closed { transform: rotate(-90deg); }
    .dv-group-name { font-size: 14px; font-weight: 600; color: var(--primary-text-color); flex: 1; }
    .dv-group-count { font-size: 11px; color: var(--secondary-text-color); }

    .dv-devices { padding: 0 18px 8px; }
    .dv-device {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 10px; margin-bottom: 8px; overflow: hidden;
    }
    .dv-device-header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer; user-select: none;
    }
    .dv-dirarrow { width: 12px; height: 12px; transition: transform 0.2s; color: var(--secondary-text-color); flex-shrink: 0; }
    .dv-dirarrow.closed { transform: rotate(-90deg); }
    .dv-device-icon { color: var(--primary-color, #03a9f4); flex-shrink: 0; }
    .dv-device-name { font-size: 13px; font-weight: 500; color: var(--primary-text-color); flex: 1; }
    .dv-device-model { font-size: 11px; color: var(--secondary-text-color); }
    .dv-device-ecount { font-size: 11px; color: var(--secondary-text-color); background: var(--divider-color, #e0e0e0); padding: 1px 8px; border-radius: 8px; }

    .dv-entities { padding: 2px 0; }
    @media (min-width: 768px) {
      .dv-entities { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    }
    .dv-entity {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 12px; cursor: pointer; transition: background 0.1s;
    }
    .dv-entity:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .dv-entity-icon { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }
    .dv-entity-name { font-size: 13px; color: var(--primary-text-color); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dv-entity-state { font-size: 13px; font-weight: 500; flex-shrink: 0; margin-right: 4px; }
    .dv-toggle {
      width: 28px; height: 18px; border-radius: 10px; flex-shrink: 0;
      background: var(--secondary-background-color, #e0e0e0); position: relative;
      transition: background 0.2s; cursor: pointer;
    }
    .dv-toggle.on { background: var(--primary-color, #03a9f4); }
    .dv-toggle.on::after { transform: translateX(10px); }
    .dv-toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #fff; transition: transform 0.2s;
    }
    .dv-more {
      font-size: 16px; color: var(--secondary-text-color); width: 20px; text-align: center; flex-shrink: 0;
      opacity: 0; transition: opacity 0.15s;
    }
    .dv-entity:hover .dv-more { opacity: 1; }

    @media (max-width: 600px) {
      .dv-entity { min-height: 44px; padding: 10px 14px; }
      .dv-entity-name { font-size: 14px; }
      .dv-entity-state { font-size: 14px; }
      .dv-device { border-radius: 12px; }
      .dv-group-header { padding: 12px 16px; font-size: 14px; }
    }
  `];
}

customElements.define('hacs-vision-device-view', DeviceView);
