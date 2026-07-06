import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';

/**
 * CardPreviewDialog — Live preview of Lovelace card plugins.
 *
 * Loads the plugin's JS from GitHub in a sandboxed iframe,
 * creates a mock hass object with sample entities, and renders
 * the card with default config.
 */
class CardPreviewDialog extends LitElement {
  static properties = {
    repo: { type: Object },
    open: { type: Boolean },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _iframeSrc: { type: String, state: true },
    _cardName: { type: String, state: true },
  };

  constructor() {
    super();
    this.repo = null;
    this.open = false;
    this._loading = false;
    this._error = null;
    this._iframeSrc = null;
    this._cardName = null;
  }

  willUpdate(changed) {
    if (changed.has('open') && this.open && this.repo) {
      this._startPreview();
    }
    if (changed.has('open') && !this.open) {
      this._cleanup();
    }
  }

  _cleanup() {
    this._iframeSrc = null;
    this._error = null;
    this._cardName = null;
    this._loading = false;
  }

  async _startPreview() {
    this._loading = true;
    this._error = null;
    this._iframeSrc = null;

    const fullName = this.repo?.full_name;
    const branch = this.repo?.default_branch || 'main';
    if (!fullName) {
      this._error = t('previewNoRepo');
      this._loading = false;
      return;
    }

    // Step 1: Find the plugin JS file
    const jsUrl = await this._findPluginJs(fullName, branch);
    if (!jsUrl) {
      this._error = t('previewNoJs');
      this._loading = false;
      return;
    }

    // Step 2: Build the iframe HTML
    this._iframeSrc = this._buildIframeSrc(fullName, branch, jsUrl);
    this._loading = false;
  }

  async _findPluginJs(fullName, branch) {
    const base = `https://raw.githubusercontent.com/${fullName}/${branch}`;

    // Strategy 1: Check dist/ directory (most common for bundled cards)
    const distCandidates = ['dist/card.js', 'dist/mini-graph-card.js', 'dist/index.js', 'dist/card.js'];
    for (const path of distCandidates) {
      try {
        const resp = await fetch(`${base}/${path}`, { method: 'HEAD' });
        if (resp.ok) return `${base}/${path}`;
      } catch {}
    }

    // Strategy 2: Check root for common card JS patterns
    try {
      const treeResp = await fetch(`https://api.github.com/repos/${fullName}/git/trees/${branch}?recursive=1`);
      if (treeResp.ok) {
        const tree = await treeResp.json();
        const jsFiles = (tree.tree || [])
          .filter(f => f.path.endsWith('.js') && f.type === 'blob')
          .map(f => f.path);

        // Prefer dist/ files, then root files
        const distJs = jsFiles.filter(p => p.startsWith('dist/'));
        const rootJs = jsFiles.filter(p => !p.includes('/') && p.endsWith('.js'));
        const candidates = [...distJs, ...rootJs];

        for (const path of candidates) {
          // Skip test files, configs, etc.
          if (path.includes('test') || path.includes('config') || path.includes('rollup') || path.includes('webpack')) continue;
          return `${base}/${path}`;
        }

        // Last resort: any JS file
        if (candidates.length > 0) {
          return `${base}/${candidates[0]}`;
        }
      }
    } catch {}

    return null;
  }

  _buildIframeSrc(fullName, branch, jsUrl) {
    // Build a self-contained HTML page that loads the plugin and renders it
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0; padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--ha-card-background, #1c1c1c);
    color: var(--primary-text-color, #e0e0e0);
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
  }
  #card-container {
    width: 100%; max-width: 500px;
  }
  .error {
    color: #f44336; padding: 20px; text-align: center;
    font-size: 14px; border: 1px dashed #f44336; border-radius: 8px;
  }
  .loading {
    color: #999; text-align: center; padding: 40px;
    font-size: 14px;
  }
</style>
</head>
<body>
<div id="card-container"><div class="loading">Loading plugin...</div></div>

<script>
// ── Mock hass object with sample entities ──
const MOCK_HASS = {
  language: 'zh-Hans',
  config: { unit_system: { length: 'km', mass: 'kg', temperature: '°C' } },
  states: {
    'light.living_room': {
      entity_id: 'light.living_room', state: 'on',
      attributes: { friendly_name: '客厅灯', brightness: 180, color_temp: 370, icon: 'mdi:ceiling-light' },
    },
    'light.bedroom': {
      entity_id: 'light.bedroom', state: 'off',
      attributes: { friendly_name: '卧室灯', brightness: 0, icon: 'mdi:lamp' },
    },
    'light.kitchen': {
      entity_id: 'light.kitchen', state: 'on',
      attributes: { friendly_name: '厨房灯', brightness: 255, rgb_color: [255, 200, 100] },
    },
    'sensor.temperature': {
      entity_id: 'sensor.temperature', state: '24.5',
      attributes: { friendly_name: '温度', unit_of_measurement: '°C', device_class: 'temperature' },
    },
    'sensor.humidity': {
      entity_id: 'sensor.humidity', state: '62',
      attributes: { friendly_name: '湿度', unit_of_measurement: '%', device_class: 'humidity' },
    },
    'sensor.power': {
      entity_id: 'sensor.power', state: '1250',
      attributes: { friendly_name: '功率', unit_of_measurement: 'W', device_class: 'power' },
    },
    'switch.fan': {
      entity_id: 'switch.fan', state: 'on',
      attributes: { friendly_name: '风扇' },
    },
    'binary_sensor.door': {
      entity_id: 'binary_sensor.door', state: 'off',
      attributes: { friendly_name: '门传感器', device_class: 'door' },
    },
    'binary_sensor.motion': {
      entity_id: 'binary_sensor.motion', state: 'on',
      attributes: { friendly_name: '人体传感器', device_class: 'motion' },
    },
    'climate.thermostat': {
      entity_id: 'climate.thermostat', state: 'cool',
      attributes: {
        friendly_name: '空调', temperature: 25, current_temperature: 24.5,
        hvac_modes: ['cool', 'heat', 'off'], hvac_mode: 'cool',
      },
    },
    'cover.garage': {
      entity_id: 'cover.garage', state: 'closed',
      attributes: { friendly_name: '车库门', device_class: 'garage' },
    },
    'media_player.living_room': {
      entity_id: 'media_player.living_room', state: 'playing',
      attributes: { friendly_name: '客厅音箱', media_title: 'Music', volume_level: 0.5 },
    },
    'person.user': {
      entity_id: 'person.user', state: 'home',
      attributes: { friendly_name: '用户' },
    },
    'weather.home': {
      entity_id: 'weather.home', state: 'sunny',
      attributes: { friendly_name: '天气', temperature: 26, humidity: 55 },
    },
  },
  // Mock entity helpers
  states: null, // Will be set above
  callService: function(domain, service, data) { console.log('callService', domain, service, data); },
  callWS: function(msg) { return Promise.resolve({}); },
};
MOCK_HASS.states = MOCK_HASS.states;

// ── Mock lovelace ──
window.lovelace = {
  config: { views: [{ cards: [] }] },
};

// ── Register custom card system ──
window.customCards = window.customCards || [];

// ── Load the plugin JS ──
const script = document.createElement('script');
script.src = '${jsUrl}';
script.crossOrigin = 'anonymous';
script.onload = function() {
  // Wait for custom element to be defined
  setTimeout(function() {
    const container = document.getElementById('card-container');
    if (!container) return;

    // Find registered card name
    const cards = window.customCards || [];
    if (cards.length === 0) {
      container.innerHTML = '<div class="error">No custom card registered by this plugin.<br>The JS loaded but did not register via window.customCards.</div>';
      return;
    }

    const card = cards[0];
    const tagName = 'custom:' + card.name;

    // Try to create the element
    try {
      const el = document.createElement(tagName);

      // Build a default config
      const config = {
        type: tagName,
        entities: ['light.living_room', 'light.bedroom', 'light.kitchen', 'sensor.temperature', 'sensor.humidity'],
        entity: 'light.living_room',
        name: card.name,
      };

      // Some cards expect specific config
      if (card.name.includes('graph') || card.name.includes('chart')) {
        config.entities = ['sensor.temperature', 'sensor.humidity', 'sensor.power'];
        config.hours_to_show = 24;
        config.show = { icon: true, name: true, state: true, graph: 'line' };
      }
      if (card.name.includes('gauge')) {
        config.entity = 'sensor.temperature';
        config.min = 0;
        config.max = 40;
        config.severity = [{ value: 0, color: '#2196f3' }, { value: 20, color: '#4caf50' }, { value: 35, color: '#f44336' }];
      }
      if (card.name.includes('weather')) {
        config.entity = 'weather.home';
      }
      if (card.name.includes('media') || card.name.includes('player')) {
        config.entity = 'media_player.living_room';
      }
      if (card.name.includes('thermostat') || card.name.includes('climate')) {
        config.entity = 'climate.thermostat';
      }

      el.setConfig(config);

      // Try to set hass if the element has the method
      if (typeof el.setHass === 'function') {
        el.setHass(MOCK_HASS);
      } else if ('hass' in el) {
        el.hass = MOCK_HASS;
      }

      container.innerHTML = '';
      container.appendChild(el);

      // Signal success
      window.parent.postMessage({ type: 'hacs-preview-ready', cardName: card.name }, '*');
    } catch (e) {
      container.innerHTML = '<div class="error">Failed to render card:<br><pre>' + e.message + '</pre></div>';
      window.parent.postMessage({ type: 'hacs-preview-error', error: e.message }, '*');
    }
  }, 500); // Wait for element registration
};
script.onerror = function() {
  document.getElementById('card-container').innerHTML =
    '<div class="error">Failed to load plugin JS from GitHub.<br>The file may not exist at the expected path.</div>';
  window.parent.postMessage({ type: 'hacs-preview-error', error: 'Failed to load JS' }, '*');
};
document.head.appendChild(script);
</script>
</body>
</html>`;

    // Use data URI for srcdoc-like behavior
    return 'data:text/html;base64,' + btoa(unescape(encodeURIComponent(html)));
  }

  _onMessage(e) {
    if (e.data?.type === 'hacs-preview-ready') {
      this._cardName = e.data.cardName;
    } else if (e.data?.type === 'hacs-preview-error') {
      this._error = e.data.error;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._messageHandler = this._onMessage.bind(this);
    window.addEventListener('message', this._messageHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('message', this._messageHandler);
    super.disconnectedCallback();
  }

  _close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  static styles = css`
    :host { display: none; }
    :host([open]) { display: block; }

    .overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      width: 90vw; max-width: 600px;
      max-height: 85vh;
      display: flex; flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.25s ease;
    }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }
    .header-title {
      font-size: 16px; font-weight: 600;
      color: var(--primary-text-color, #333);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .header-btn {
      background: none; border: none; cursor: pointer;
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: var(--secondary-text-color, #666);
      transition: background 0.15s;
    }
    .header-btn:hover { background: var(--secondary-background-color, #f0f0f0); }
    .header-btn svg { width: 18px; height: 18px; }

    .body {
      flex: 1; overflow: hidden;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative;
      min-height: 300px;
      background: #1c1c1c;
    }

    .loading-spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text {
      color: #999; font-size: 13px; margin-top: 12px;
    }
    .error-box {
      color: #f44336; padding: 20px; text-align: center;
      font-size: 13px; background: rgba(244,67,54,0.1);
      border-radius: 8px; margin: 16px;
    }

    .preview-iframe {
      width: 100%; height: 100%;
      border: none; min-height: 300px;
    }

    .card-badge {
      position: absolute; top: 8px; right: 8px;
      background: rgba(0,0,0,0.6); color: #fff;
      padding: 4px 10px; border-radius: 10px;
      font-size: 11px; font-weight: 500;
      z-index: 5;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay" @click=${(e) => { if (e.target === e.currentTarget) this._close(); }}>
        <div class="dialog">
          <div class="header">
            <div class="header-title">
              ${t('previewTitle')}: ${this.repo?.manifest_name || this.repo?.name || this.repo?.full_name || ''}
            </div>
            <div class="header-actions">
              <button class="header-btn" @click=${this._close} title="${t('close')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div class="body">
            ${this._cardName ? html`
              <div class="card-badge">${this._cardName}</div>
            ` : ''}

            ${this._loading ? html`
              <div class="loading-spinner"></div>
              <div class="loading-text">${t('previewLoading')}</div>
            ` : this._error ? html`
              <div class="error-box">${this._error}</div>
            ` : this._iframeSrc ? html`
              <iframe class="preview-iframe" src=${this._iframeSrc} sandbox="allow-scripts" allow="cross-origin-isolated"></iframe>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('card-preview-dialog', CardPreviewDialog);
