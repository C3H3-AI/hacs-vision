import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { getCommonStyles } from '../shared/styles.js';

/**
 * Config Flow Dialog — inline HA config flow inside HACS Vision.
 *
 * Usage:
 *   <config-flow-dialog
 *     .domain=${'esphome'}
 *     .entryId=${null}
 *     .configEntries=${map}
 *     @close=${this._onFlowClose}>
 *   </config-flow-dialog>
 *
 *   Call .openFlow() to start, or set .domain + set .open=true.
 *   If entryId is set, it starts an OPTIONS flow instead.
 */
class ConfigFlowDialog extends LitElement {
  static properties = {
    hass: { type: Object },
    domain: { type: String },
    entryId: { type: String },
    configEntries: { type: Object },
    open: { type: Boolean, reflect: true },
    _loading: { type: Boolean, state: true },
    _flowId: { type: String, state: true },
    _step: { type: Object, state: true },
    _errors: { type: Object, state: true },
    _finished: { type: Boolean, state: true },
    _result: { type: Object, state: true },
    _isOptions: { type: Boolean, state: true },
    _isSubentry: { type: Boolean, state: true },
    _subentryTypes: { type: Array, state: true },
    _subentryType: { type: String, state: true },
    _existingSubentries: { type: Array, state: true },
    _isSubentryReconfigure: { type: Boolean, state: true },
    _subentryReconfigureId: { type: String, state: true },
  };

  constructor() {
    super();
    this.domain = '';
    this.entryId = null;
    this.configEntries = null;
    this.open = false;
    this._loading = false;
    this._flowId = null;
    this._step = null;
    this._errors = {};
    this._finished = false;
    this._result = null;
    this._isOptions = false;
    this._isSubentry = false;
    this._subentryTypes = [];
    this._subentryType = '';
    this._existingSubentries = [];
    this._isSubentryReconfigure = false;
    this._subentryReconfigureId = '';
    this._loadingTimeout = null;
    this._translations = null;
    this._lang = 'zh-Hans';
    this._dialogDrag = { offsetX: 0, offsetY: 0, startX: 0, startY: 0, dragging: false };
    this._cleanedUp = false;
  }

  /** Get hass object — from prop or directly from parent HA iframe */
  _getHass() {
    if (this.hass) return this.hass;
    try {
      const haEl = window.parent?.document?.querySelector('home-assistant');
      return haEl?.hass || null;
    } catch(e) { return null; }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearLoadingTimeout();
    this._cleanedUp = true;
  }

  _clearLoadingTimeout() {
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout);
      this._loadingTimeout = null;
    }
  }

  _startLoadingTimeout() {
    this._clearLoadingTimeout();
    this._loadingTimeout = setTimeout(() => {
      if (this._loading && !this._finished) {
        this._clearLoadingTimeout();
        this._finished = true;
        this._result = { type: 'error', message: t('flowTimeout') };
        this._loading = false;
        this.requestUpdate();
      }
    }, 30000); // 30s timeout
  }

  connectedCallback() {
    super.connectedCallback();
    // Don't auto-start here — updated() handles it
  }

  _dialogPointerDown(e) {
    const header = e.target.closest('.header');
    if (!header || e.target.closest('button')) return;
    if (e.button !== undefined && e.button !== 0) return;
    const drag = this._dialogDrag;
    const dialog = e.currentTarget;
    drag.dragging = true;
    drag.startX = e.clientX - drag.offsetX;
    drag.startY = e.clientY - drag.offsetY;
    dialog.style.transition = 'none';
    dialog.style.cursor = 'grabbing';
    header.style.userSelect = 'none';
    dialog.setPointerCapture(e.pointerId);
    const onMove = (ev) => {
      if (!drag.dragging) return;
      drag.offsetX = ev.clientX - drag.startX;
      drag.offsetY = ev.clientY - drag.startY;
      dialog.style.transform = `translate(${drag.offsetX}px, ${drag.offsetY}px)`;
    };
    const onUp = (ev) => {
      drag.dragging = false;
      dialog.style.cursor = '';
      header.style.userSelect = '';
      dialog.removeEventListener('pointermove', onMove);
      dialog.removeEventListener('pointerup', onUp);
      dialog.removeEventListener('pointercancel', onUp);
      try { dialog.releasePointerCapture(ev.pointerId); } catch(er) {}
    };
    dialog.addEventListener('pointermove', onMove);
    dialog.addEventListener('pointerup', onUp);
    dialog.addEventListener('pointercancel', onUp);
  }

  updated(changed) {
    if (changed.has('open') && this.open) {
      if (this.entryId) {
        this._isOptions = false;
        this._isSubentry = false;
        this._subentryTypes = [];
        this._subentryType = '';
        this._existingSubentries = [];
        this._isSubentryReconfigure = false;
        this._subentryReconfigureId = '';

        const entry = this._findEntry(this.entryId);
        if (entry && entry.supported_subentry_types && entry.supported_subentry_types.length > 0) {
          this._isSubentry = true;
          this._subentryTypes = entry.supported_subentry_types;
          this._loadExistingSubentries();
          this._startFlow();
        } else {
          this._isOptions = true;
          this._startFlow();
        }
      } else if (this.domain) {
        this._isOptions = false;
        this.entryId = null;
        this._startFlow();
      }
    }
  }

  /** Public: open a config flow for a given domain */
  openFlow(domain) {
    this.entryId = null;
    this._isOptions = false;
    this._isSubentry = false;
    this._subentryTypes = [];
    this._subentryType = '';
    this._existingSubentries = [];
    this._isSubentryReconfigure = false;
    this._subentryReconfigureId = '';
    this.domain = domain;
    this.open = true;
  }

  /** Public: open an OPTIONS flow for an existing config entry */
  openOptionsFlow(entryId) {
    this.domain = '';
    this._isOptions = false;
    this._isSubentry = false;
    this._subentryTypes = [];
    this._subentryType = '';
    this._existingSubentries = [];
    this._isSubentryReconfigure = false;
    this._subentryReconfigureId = '';
    this.entryId = entryId;
    this.open = true;
  }

  /** Find entry data from configEntries by entryId */
  _findEntry(entryId) {
    if (!this.configEntries || !entryId) return null;
    for (const entries of Object.values(this.configEntries)) {
      const found = entries.find(e => e.entry_id === entryId);
      if (found) return found;
    }
    return null;
  }

  /** Fetch existing subentries for the current entry */
  async _loadExistingSubentries() {
    if (!this.entryId) return;
    try {
      const resp = await api.getSubentries(this.entryId);
      this._existingSubentries = resp?.subentries || [];
    } catch {
      this._existingSubentries = [];
    }
  }

  /** Load translations from BOTH our custom API AND HA's backend built-in system.
   *  Custom components → our API reads from /config/custom_components/{domain}/translations/{lang}.json
   *  Built-in HA integrations → hass.loadBackendTranslation() loads from HA core.
   *  Merge both so we have full coverage.
   */
  async _loadTranslations(domain) {
    if (!domain) return;
    if (this._translations && this._translations._domain === domain) return;

    let merged = {};

    // 1. Try our custom backend API (for custom_components/ translations)
    try {
      const resp = await api.getTranslations(domain, this._lang);
      const data = resp?.data || {};
      merged = this._deepMerge(merged, data);
    } catch (e) {
      // ignore custom API failures
    }

    // 2. Try HA's built-in loadBackendTranslation (for HA core integrations)
    try {
      const hass = this._getHass();
      if (hass && typeof hass.loadBackendTranslation === 'function') {
        // Try both argument orders: (category, integration) vs (integration, category)
        // HA 2024+ uses (category, integration): loadBackendTranslation('config', domain)
        // Some versions use (integration, category) — we try both
        let haData;
        try {
          // HA 2024+ order: category first
          haData = await hass.loadBackendTranslation('config', domain);
        } catch (e1) {
          try {
            // Older order: integration first
            haData = await hass.loadBackendTranslation(domain, 'config');
          } catch (e2) {
            console.warn(`HACS Vision: loadBackendTranslation failed for ${domain}:`, e1?.message || e2?.message);
          }
        }
        if (haData && typeof haData === 'object') {
          if (typeof haData === 'object' && Object.keys(haData).length > 0) {
            haData = this._flatToNested(haData);
            merged = this._deepMerge(merged, haData);
            console.debug(`HACS Vision: loaded HA backend translations for ${domain}:`, Object.keys(haData).length, 'keys');
          }
        }
      } else {
        console.warn('HACS Vision: hass.loadBackendTranslation is not available');
      }
    } catch (e) {
      console.warn(`HACS Vision: loadBackendTranslation error for ${domain}:`, e);
    }

    // 3. Try HA's built-in for options flow too
    if (this._isOptions) {
      try {
        const hass = this._getHass();
        if (hass && typeof hass.loadBackendTranslation === 'function') {
          let haOptionsData;
          try {
            haOptionsData = await hass.loadBackendTranslation('options', domain);
          } catch (e1) {
            try {
              haOptionsData = await hass.loadBackendTranslation(domain, 'options');
            } catch (e2) {
              // both orders failed
            }
          }
          if (haOptionsData && typeof haOptionsData === 'object' && Object.keys(haOptionsData).length > 0) {
            haOptionsData = this._flatToNested(haOptionsData);
            merged = this._deepMerge(merged, haOptionsData);
          }
        }
      } catch (e) {
        // ignore
      }
    }

    this._translations = { _domain: domain, _data: merged };
  }

  /** Deep merge b into a (mutates a, returns a) */
  _deepMerge(a, b) {
    for (const key of Object.keys(b)) {
      if (b[key] && typeof b[key] === 'object' && !Array.isArray(b[key])) {
        if (!a[key] || typeof a[key] !== 'object') a[key] = {};
        this._deepMerge(a[key], b[key]);
      } else {
        a[key] = b[key];
      }
    }
    return a;
  }

  /** Convert flat key-value map (e.g. {"component.xiaomi.config.step.user.title":"..."})
   *  into nested structure that our _t() / _traverse() can navigate. */
  _flatToNested(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    // Check if it's already nested (first key has no dot) → return as-is
    const firstKey = Object.keys(obj)[0];
    if (!firstKey || !firstKey.includes('.')) return obj;
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value !== 'string') continue;
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] !== 'object') current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    }
    return result;
  }

  /** Look up a translation key in our loaded translations.
   *  Strips 'component.{domain}.' prefix and traverses the nested data.
   *  HA stores config-flow keys under 'config.' and options-flow under 'options.',
   *  but our key format always uses 'config.step.{id}'. So we try:
   *  1. The key as-is (works for 'config.step.{id}')
   *  2. Replace 'config.' with 'options.' (works for 'options.step.{id}')
   */
  _t(key) {
    if (!this._translations?._data) return null;
    const domain = this._translations._domain;
    const prefix = 'component.' + domain + '.';
    const cleanKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;

    let result = this._traverse(this._translations._data, cleanKey);
    if (result) return result;

    if (cleanKey.startsWith('config.')) {
      result = this._traverse(this._translations._data, 'options.' + cleanKey.slice('config.'.length));
      if (result) return result;
    }

    return null;
  }

  _traverse(data, key) {
    const parts = key.split('.');
    let node = data;
    for (const part of parts) {
      if (node == null || typeof node !== 'object') return null;
      node = node[part];
    }
    return typeof node === 'string' ? node : null;
  }

  async _startFlow() {
    if (this._isSubentry && !this._subentryType && !this._isSubentryReconfigure) {
      this._loading = false;
      this._finished = false;
      this._result = null;
      this._step = null;
      this.requestUpdate();
      return;
    }

    this._loading = true;
    this._finished = false;
    this._result = null;
    this._step = null;
    this._errors = {};
    this.requestUpdate();

    this._startLoadingTimeout();

    try {
      const flowDomain = this._isOptions || this._isSubentry
        ? this._getFlowDomain()
        : this.domain;
      if (flowDomain) {
        await this._loadTranslations(flowDomain);
      }

      let result;
      if (this._isSubentryReconfigure && this._subentryType && this.entryId) {
        result = await api.startSubentryFlow(
          this.entryId, this._subentryType,
          { source: 'reconfigure', subentry_id: this._subentryReconfigureId }
        );
      } else if (this._isSubentry && this._subentryType && this.entryId) {
        result = await api.startSubentryFlow(this.entryId, this._subentryType);
      } else if (this._isOptions && this.entryId) {
        result = await api.startOptionsFlow(this.entryId);
      } else {
        result = await api.startConfigFlow(this.domain);
      }

      await this._handleFlowResponse(result);
    } catch (e) {
      console.error('HACS Vision: config flow start error:', e);
      this._clearLoadingTimeout();
      const message = this._getFlowErrorMessage(e);
      // For simple errors (no options flow, etc.), just show toast and close
      if (message === t('flowOptionsNotSupported') || e.message?.includes('404')) {
        // Close immediately and show a brief toast so user isn't blocked
        const { showToast } = await import('../hacs-vision-panel.js');
        showToast(message, 'info');
        this._close();
        return;
      }
      this._finished = true;
      this._result = { type: 'error', message };
      this._loading = false;
      this.requestUpdate();
    }
  }

  async _handleFlowResponse(result) {
    if (result.type === 'abort') {
      this._finished = true;
      this._result = { type: 'abort', reason: result.reason };
      this._loading = false;
      this.requestUpdate();
      return;
    }

    if (result.type === 'create_entry') {
      this._finished = true;
      this._result = { type: 'create_entry', title: result.title || this.domain || t('flowDone') };
      this._loading = false;
      this.requestUpdate();
      return;
    }

    // HA returns "already_in_progress" when a flow is already active for this
    // integration (HTTP 409). Continue the existing flow by fetching its current step.
    if (result.type === 'already_in_progress') {
      this._flowId = result.flow_id || result.flowId;
      this._clearLoadingTimeout();
      try {
        const stepResult = await (this._isOptions
          ? api.stepOptionsFlow(this._flowId, {})
          : api.stepConfigFlow(this._flowId, {}));
        await this._handleFlowResponse(stepResult);
      } catch (e) {
        this._finished = true;
        this._result = { type: 'error', message: this._getFlowErrorMessage(e) };
        this._loading = false;
        this.requestUpdate();
      }
      return;
    }

    if (result.type === 'form') {
      this._flowId = result.flow_id || result.flowId;
      this._step = result;
      this._errors = result.errors || {};
      // Load translations BEFORE rendering so hass.localize() works
      // Use the real domain (not result.handler which can be a UUID)
      const transDomain = this._getFlowDomain() || result.handler;
      if (transDomain) {
        await this._loadTranslations(transDomain);
      }
      this._loading = false;
      this.requestUpdate();
      return;
    }

    if (result.type === 'external') {
      this._finished = true;
      const url = result.url || '';
      this._result = {
        type: 'external',
        url: url,
        message: t('flowExternalAuth'),
      };
      this._loading = false;
      this.requestUpdate();
      return;
    }

    if (result.type === 'menu') {
      this._flowId = result.flow_id || result.flowId;
      this._step = result;
      this._errors = {};
      this._loading = false;
      this.requestUpdate();
      return;
    }

    // Unknown type
    this._finished = true;
    this._result = {
      type: 'unsupported',
      message: t('flowUnknownType', { type: result.type }),
    };
    this._loading = false;
    this.requestUpdate();
  }

  async _submitStep(data) {
    this._loading = true;
    this._errors = {};
    this.requestUpdate();

    try {
      let result;
      if (this._isSubentry && this._flowId) {
        result = await api.stepSubentryFlow(this._flowId, data);
      } else if (this._isOptions && this._step) {
        result = await api.stepOptionsFlow(this._flowId, data);
      } else {
        result = await api.stepConfigFlow(this._flowId, data);
      }

      this._handleFlowResponse(result);
    } catch (e) {
      console.error('HACS Vision: flow step error:', e);
      this._errors = { base: e.message || t('flowSubmitFailed') };
      this._loading = false;
      this.requestUpdate();
    }
  }

  _handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {};
    // Track which checkbox names are multi-select (appear more than once)
    const checkboxCounts = {};
    for (const el of form.elements) {
      if (el.type === 'checkbox' && el.name) {
        checkboxCounts[el.name] = (checkboxCounts[el.name] || 0) + 1;
      }
    }
    for (const el of form.elements) {
      if (el.name && el.type !== 'submit' && el.type !== 'button') {
        if (el.type === 'checkbox') {
          // If multiple checkboxes share the same name → it's a multi_select array
          if (checkboxCounts[el.name] > 1) {
            if (!Array.isArray(data[el.name])) data[el.name] = [];
            if (el.checked) data[el.name].push(el.value);
          } else {
            data[el.name] = el.checked;
          }
        } else if (el.value !== undefined && el.value !== null) {
          // Preserve type (string/number)
          data[el.name] = el.valueAsNumber !== undefined && !isNaN(el.valueAsNumber) && el.type === 'number'
            ? el.valueAsNumber : el.value;
        }
      }
    }
    this._submitStep(data);
  }

  _handleMenuSelect(value) {
    this._submitStep({ next_step_id: value });
  }

  _onMultiCheckboxChange(e) {
    // Just trigger re-render to update state — actual values collected in _handleSubmit
    this.requestUpdate();
  }

  _handleSubentrySelect(type) {
    this._subentryType = type;
    this._isSubentryReconfigure = false;
    this._subentryReconfigureId = '';
    this._startFlow();
  }

  _handleExistingSubentrySelect(subentry) {
    this._subentryType = subentry.subentry_type;
    this._isSubentryReconfigure = true;
    this._subentryReconfigureId = subentry.subentry_id;
    this._subentryType = subentry.subentry_type;
    this._startFlow();
  }

  _cancelFlow() {
    // Reset transform and drag state for next open
    const dialog = this.shadowRoot?.querySelector('.dialog');
    if (dialog) dialog.style.transform = '';
    this._dialogDrag = { offsetX: 0, offsetY: 0, startX: 0, startY: 0, dragging: false };
    if (this._flowId) {
      if (this._isSubentry) {
        api.cancelSubentryFlow(this._flowId).catch(() => {});
      } else {
        api.cancelConfigFlow(this._flowId).catch(() => {});
      }
    }
    this._close();
  }

  _close() {
    try {
      this._clearLoadingTimeout();
      this.open = false;
      this._flowId = null;
      this._step = null;
      this._finished = false;
      this._result = null;
      this._errors = {};
      this._isOptions = false;
      this._isSubentry = false;
      this._subentryTypes = [];
      this._subentryType = '';
      this._existingSubentries = [];
      this._isSubentryReconfigure = false;
      this._subentryReconfigureId = '';
      this.domain = '';
      this.entryId = null;
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    } catch(e) {
      console.error('HACS Vision: config flow close error:', e);
      // Force parent cleanup even on crash
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
  }

  static styles = [getCommonStyles(), css`
    :host { display: block; }
    :host([open]) {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
      pointer-events: none;
    }
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999;
      display: grid; place-items: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
      pointer-events: auto;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%; max-width: 580px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      animation: slideUp 0.25s ease;
      user-select: text;
      -webkit-user-select: text;
    }
    @media (min-width: 1024px) {
      .overlay { padding: 40px; }
      .dialog { max-width: 680px; max-height: 80vh; }
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .title { font-size: 18px; font-weight: 700; color: var(--primary-text-color, #212121); }
    .cfg-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-color, #03a9f4); overflow: hidden;
    }
    .cfg-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .cfg-avatar-letter { font-size: 14px; font-weight: 700; color: #fff; z-index: 1; }
    .close-btn {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color, #727272);
      cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .close-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .close-btn svg { width: 16px; height: 16px; }

    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    .step-desc {
      font-size: 14px; color: var(--secondary-text-color, #727272);
      margin-bottom: 16px;
      white-space: pre-wrap;
      line-height: 1.6;
    }

    /* Form Fields — match store card style */
    .form-field { margin-bottom: 16px; }
    .form-field label {
      display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;
      color: var(--primary-text-color, #212121);
    }
    .form-field input, .form-field select, .form-field textarea {
      width: 100%; box-sizing: border-box;
      padding: 10px 12px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; font-size: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .form-field textarea {
      min-height: 80px; resize: vertical;
      line-height: 1.5;
    }
    .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
      border-color: var(--primary-color, #03a9f4); outline: none;
    }
    .form-field select { cursor: pointer; appearance: auto; }
    .field-desc { font-size: 12px; color: var(--secondary-text-color, #727272); margin-bottom: 6px; line-height: 1.5; }
    .checkbox-label {
      display: inline-flex; align-items: center; gap: 10px;
      cursor: pointer; font-size: 14px; font-weight: 400;
      padding: 6px 0;
    }
    .checkbox-label input[type="checkbox"] { width: auto; margin: 0; flex-shrink: 0; }
    .multi-select-checkboxes { display: flex; flex-direction: column; gap: 4px; padding: 4px 0; }
    .multi-select-checkboxes .multi-option { display: flex; align-items: center; gap: 8px; padding: 4px 0; cursor: pointer; }
    .multi-select-checkboxes .multi-option:hover { background: var(--primary-color, #03a9f4)08; }
    .form-error { color: #f44336; font-size: 12px; margin-top: 4px; }

    /* Menu (step type) — match store action-btn style */
    .menu-option {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; margin-bottom: 8px;
      cursor: pointer; transition: all 0.2s;
      background: var(--card-background-color, #fff);
    }
    .menu-option:hover {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.04);
    }
    .menu-option .menu-label { font-size: 14px; font-weight: 500; flex: 1; }
    .menu-option .menu-desc { font-size: 12px; color: var(--secondary-text-color); }
    .menu-option .menu-arrow { color: var(--secondary-text-color); font-size: 18px; }
    .menu-label-group { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .menu-sublabel { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 1px; }
    .menu-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; background: rgba(var(--rgb-primary-color, 3,169,244), 0.1); flex-shrink: 0; }
    .subentry-divider { height: 1px; background: var(--divider-color, #e0e0e0); margin: 10px 0; }

    /* Result States */
    .result { text-align: center; padding: 24px 0; }
    .result-icon { width: 48px; height: 48px; margin: 0 auto 12px; }
    .result-icon.success { color: #4caf50; }
    .result-icon.abort { color: #ff9800; }
    .result-icon.error { color: #f44336; }
    .result-icon.external { color: #2196f3; }
    .result-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
    .result-desc { font-size: 14px; color: var(--secondary-text-color, #727272); margin-bottom: 16px; }

    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
    .btn {
      padding: 8px 20px; border-radius: 10px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; font-size: 14px; font-family: inherit;
      transition: all 0.2s;
    }
    .btn.primary {
      background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color);
    }
    .btn.primary:hover { opacity: 0.9; color: #fff; }
    .btn.external {
      background: #2196f3; border-color: #2196f3; color: #fff;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 10px; padding: 8px 20px;
    }

    @media (max-width: 600px) {
      .overlay { padding: 12px; }
      .dialog { padding: 16px; }
      .dialog { max-width: 100%; max-height: 92vh; border-radius: 16px; padding-bottom: 24px; }
    }
  `];

  render() {
    if (!this.open) return '';

    const title = this._isSubentry
      ? (this._getFlowDomain() || '') + ' - ' + t('subentryTitle')
      : this._isOptions
      ? (this._getFlowDomain() || t('flowTitleOptions'))
      : (this._step?.title || this._localizeTitle() || this._step?.handler || this.domain || t('flowTitle'));

    return html`
      <div class="overlay" role="dialog" aria-modal="true" aria-label="${this._flowTitle || t('flowTitle')}" @keydown=${(e) => { if (e.key === 'Escape') this._cancelFlow(); }} @click=${(e) => { if (e.target === e.currentTarget) this._cancelFlow(); }}>
        <div class="dialog" @pointerdown=${this._dialogPointerDown}>
          <div class="header">
            <div class="header-left">
              ${this.domain ? html`
                <div class="cfg-avatar">
                  <img class="cfg-avatar-img" src="https://brands.home-assistant.io/${this.domain}/icon.png" alt=""
                    @error=${function(e) {
                      if (!this.isConnected) return;
                      this.style.display = 'none';
                      const fl = this.parentElement.querySelector('.cfg-avatar-letter');
                      if (fl) fl.style.display = 'flex';
                    }}>
                  <span class="cfg-avatar-letter" style="display:none">${this.domain.charAt(0).toUpperCase()}</span>
                </div>
              ` : ''}
              <span class="title">${title}</span>
            </div>
            <button class="close-btn" aria-label="${t('close')}" @click=${this._cancelFlow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          ${this._loading ? html`
            <div class="loading">
              <div class="spinner"></div>
              <div>${t('flowProcessing')}</div>
            </div>
          ` : ''}

          ${this._finished && this._result ? this._renderResult() : ''}

          ${!this._loading && !this._finished && this._step ? this._renderStep() : ''}

          ${!this._loading && !this._finished && !this._step && !this._result && this._isSubentry && !this._subentryType ? html`
            <div class="subentry-list">
              ${this._existingSubentries.length > 0 ? html`
                <div class="step-desc" style="margin-bottom:8px">${t('subentryExisting')}</div>
                ${this._existingSubentries.map(se => html`
                  <div class="menu-option" @click=${() => this._handleExistingSubentrySelect(se)}>
                    <span class="menu-icon">⚙</span>
                    <div class="menu-label-group">
                      <span class="menu-label">${se.title || this._getSubentryTypeLabel(se.subentry_type)}</span>
                      <span class="menu-sublabel">${this._getSubentryTypeLabel(se.subentry_type)}</span>
                    </div>
                    <span class="menu-arrow">${t('subentryReconfigure')}</span>
                  </div>
                `)}
                <div class="subentry-divider"></div>
              ` : ''}

              <div class="step-desc" style="margin-bottom:8px">${t('subentryAddNew')}</div>
              ${this._subentryTypes.map(type => html`
                <div class="menu-option" @click=${() => this._handleSubentrySelect(type)}>
                  <span class="menu-icon">+</span>
                  <span class="menu-label">${t('subentryAddPrefix')} ${this._getSubentryTypeLabel(type)}</span>
                  <span class="menu-arrow">→</span>
                </div>
              `)}
              <div class="actions" style="margin-top:16px">
                <button class="btn" @click=${this._cancelFlow}>${t('flowCancel')}</button>
              </div>
            </div>
          ` : ''}

          ${!this._loading && !this._finished && !this._step && !this._result && !(this._isSubentry && !this._subentryType) ? html`
            <div class="loading">
              <div class="spinner"></div>
              <div>${t('flowStarting')}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /* ── Step renderer (dispatches to form or menu) ── */

  _renderStep() {
    const step = this._step;
    if (!step) return '';

    if (step.type === 'menu') {
      return this._renderMenu(step);
    }

    if (step.type === 'form') {
      return this._renderForm(step);
    }

    return html`<div class="result error"><div class="result-title">${t('flowResultFailed')}: ${step.type}</div></div>`;
  }

  /* ── Menu step ── */

  _renderMenu(step) {
    const descText = this._buildDescription(step);
    const options = step.menu_options || [];

    return html`
      ${descText ? html`<div class="step-desc">${descText}</div>` : ''}
      <div class="menu-list">
        ${options.map((opt, i) => {
          const isSimple = typeof opt === 'string';
          const value = isSimple ? opt : opt.value || '';
          const label = this._t(`component.${this._getFlowDomain()}.config.step.${step.step_id}.menu_options.${value}`)
            || (this._isOptions && this._t(`component.${this._getFlowDomain()}.options.step.${step.step_id}.menu_options.${value}`))
            || (isSimple ? opt : opt.label || opt.title || opt.value || '');
          const desc = isSimple ? '' : (opt.description || '');
          return html`
            <div class="menu-option" @click=${() => this._handleMenuSelect(value)}>
              <span class="menu-label">${label}</span>
              ${desc ? html`<span class="menu-desc">${desc}</span>` : ''}
              <span class="menu-arrow">→</span>
            </div>
          `;
        })}
      </div>
      <div class="actions">
        <button class="btn" @click=${this._cancelFlow}>${t('flowCancel')}</button>
      </div>
    `;
  }

  /* ── Form step ── */

  _renderForm(step) {
    const descText = this._buildDescription(step);
    const schema = step.data_schema || [];
    const baseError = this._errors?.base || '';

    return html`
      ${descText ? html`<div class="step-desc">${descText}</div>` : ''}
      ${baseError ? html`<div class="form-error" style="margin-bottom:12px">${baseError}</div>` : ''}
      <form @submit=${this._handleSubmit}>
        ${schema.map(s => this._renderField(s))}
        <div class="actions">
          <button type="button" class="btn" @click=${this._cancelFlow}>${t('flowCancel')}</button>
          <button type="submit" class="btn primary" ?disabled=${this._loading}>
            ${this._loading ? t('flowProcessing') : (step.last_step ? t('flowStepFinish') : t('flowStepNext'))}
          </button>
        </div>
      </form>
    `;
  }

  /* ── Build description with placeholders ── */

  _buildDescription(step) {
    let desc = step.description || step.description_placeholders?.description || '';

    // If description looks like a translation key (contains dots), resolve it
    if (desc && desc.includes('.')) {
      const resolved = this._t(desc) || null;
      if (resolved) desc = resolved;
    }

    // Try localization from our translations if API didn't provide description
    if (!desc) {
      const translated = this._translateField('description');
      if (translated) desc = translated;
    }

    // Substitute description_placeholders (e.g. {note_url} → "http://...")
    const placeholders = step.description_placeholders || {};
    for (const [key, val] of Object.entries(placeholders)) {
      // val could be a string, number, or object — only substitute primitives
      const strVal = (val !== null && val !== undefined && typeof val !== 'object') ? String(val) : '';
      desc = desc.replace(new RegExp(`\\{${key}\\}`, 'g'), strVal);
    }

    // If still no description, show placeholder values (primitives only)
    if (!desc && Object.keys(placeholders).length > 0) {
      const lines = Object.entries(placeholders)
        .map(([, v]) => (v !== null && v !== undefined && typeof v !== 'object') ? String(v) : '')
        .filter(Boolean);
      desc = lines.join('\n');
    }
    return desc;
  }

  /* ── Derive domain for translation ── */

  _getFlowDomain() {
    if (this.domain) return this.domain;
    if (this.entryId && this.configEntries) {
      for (const entries of Object.values(this.configEntries)) {
        for (const entry of entries) {
          if (entry.entry_id === this.entryId) {
            return entry.domain || '';
          }
        }
      }
    }
    const handler = this._step?.handler;
    if (handler && !/^[0-9A-Z]{20,}$/.test(handler)) {
      return handler;
    }
    return '';
  }

  _getSubentryTypeLabel(type) {
    const mapped = {
      'conversation': 'subentryConversation',
      'tts': 'subentryTts',
      'stt': 'subentryStt',
      'translation': 'subentryTranslation',
      'ai_task_data': 'subentryAiTaskData',
      'device': 'subentryDevice',
      'wecom': 'subentryWecom',
      'wechat': 'subentryWechat',
      'qq': 'subentryQq',
      'feishu': 'subentryFeishu',
      'dingtalk': 'subentryDingtalk',
      'xiaoyi': 'subentryXiaoyi',
      'custom': 'subentryCustom',
    };
    const key = mapped[type];
    return key ? t(key) : type;
  }

  /* ── Localize title via hass.localize() when not in API response ── */

  _localizeTitle() {
    const domain = this._getFlowDomain();
    const stepId = this._step?.step_id;
    if (domain && stepId) {
      const translated = this._translateField('title');
      if (translated) return translated;
    }
    if (domain) {
      const key = `component.${domain}.title`;
      const translated = this._t(key);
      if (translated) return translated;
    }
    return '';
  }

  /* ── Translate field label via hass.localize() ──
   *  For subentry flows, subentry translations are stored under
   *  `config_subentries.<type>.step.<id>` in translation files. */

  _translateField(suffix) {
    const domain = this._getFlowDomain();
    const stepId = this._step?.step_id;
    if (!domain || !stepId) return null;
    if (this._isSubentry && this._subentryType) {
      const key = `component.${domain}.config_subentries.${this._subentryType}.step.${stepId}.${suffix}`;
      const result = this._t(key);
      if (result) return result;
    }
    const key = `component.${domain}.config.step.${stepId}.${suffix}`;
    return this._t(key);
  }

  _getFieldLabel(schema) {
    const translated = this._translateField(`data.${schema.name}`);
    if (translated) return translated;
    return schema.label || this._friendlyName(schema.name);
  }

  /** Convert snake_case field name to human-readable label */
  _friendlyName(name) {
    return name
      .replace(/_/g, ' ')
      .replace(/(^|\s)\w/g, c => c.toUpperCase())
      .replace(/Id\b/gi, 'ID')
      .replace(/Ip\b/gi, 'IP')
      .replace(/Url\b/gi, 'URL')
      .replace(/Api\b/gi, 'API');
  }

  /* ── Translate field description from our translations ── */

  _getFieldDescription(schema) {
    const translated = this._translateField(`data.${schema.name}.description`);
    if (translated) return translated;
    // schema.description can be a string OR an object {suggested_value: ...} in selector format
    const desc = schema.description;
    if (typeof desc === 'string') return desc;
    if (desc && typeof desc === 'object') {
      // In selector format, description is {suggested_value, ...} — not a user-visible description
      return '';
    }
    return '';
  }

  /* ── Translate field placeholder from our translations ── */

  _getFieldPlaceholder(schema) {
    const translated = this._translateField(`data.${schema.name}.placeholder`);
    if (translated) return translated;
    return schema.placeholder || '';
  }

  /* ── Translate select option labels from our translations ── */

  _getOptionLabel(schema, optValue) {
    const translated = this._translateField(`data.${schema.name}.options.${optValue}`);
    if (translated) return translated;
    return null;
  }

  /* ── Translate error messages ── */

  _getFlowErrorMessage(e) {
    const msg = e?.message || '';
    if (msg.includes('404')) {
      if (this._isSubentry) return this._getSubentryTypeLabel(this._subentryType) + ' ' + t('flowHandlerNotFound');
      return this._isOptions
        ? t('flowOptionsNotSupported')
        : t('flowHandlerNotFound');
    }
    if (msg.includes('500') && this._isOptions) {
      return t('flowOptionsNotSupported');
    }
    if (msg.includes('401') || msg.includes('403')) {
      return t('flowAuthError');
    }
    return msg || (this._isOptions ? t('flowStartFailedOptions') : t('flowStartFailed'));
  }

  /* ── Single form field renderer ── */

  _renderField(schema) {
    const name = schema.name;
    const label = this._getFieldLabel(schema);
    const type = schema.type || 'string';
    const required = schema.required !== false;
    // Default value: schema.default (old format) or schema.description.suggested_value (selector format)
    const suggestedValue = schema.description?.suggested_value;
    const hasDefault = schema.default !== undefined && schema.default !== null
      || suggestedValue !== undefined && suggestedValue !== null;
    const defaultValue = schema.default !== undefined && schema.default !== null
      ? schema.default
      : (suggestedValue !== undefined ? suggestedValue : '');
    const placeholder = this._getFieldPlaceholder(schema);
    const fieldDesc = this._getFieldDescription(schema);
    const error = this._errors?.[name] || '';
    const multiline = schema.multiline === true;
    const isPassword = schema.password === true
      || schema.type === 'password'
      || (/token|secret|password|key|api_key|apiKey/i.test(name) && type === 'string');

    // HA 2024+ selector format: { selector: { select: { options: [...] } } }
    const selector = schema.selector || {};
    const selectorType = Object.keys(selector)[0]; // 'select', 'text', 'number', 'boolean', 'entity', etc.

    // Select (enum) rendering — handles both old format and selector format
    const isSelectType = type === 'select' || type === 'multi_select' || schema.options || schema.enum
      || selectorType === 'select';
    if (isSelectType) {
      // Extract options from: schema.options / schema.enum / selector.select.options
      let rawOptions = schema.options || schema.enum || [];
      if (!rawOptions.length && selector.select?.options) {
        rawOptions = selector.select.options;
      }
      const isMulti = type === 'multi_select' || selector.select?.multiple === true;
      // Debug: log select field schema for troubleshooting
      if (!rawOptions.length) {
        console.warn(`HACS Vision: select field "${name}" has empty options`, schema);
      } else {
        console.debug(`HACS Vision: select field "${name}" options:`, JSON.stringify(rawOptions).slice(0, 200));
      }
      // multi_select options can be an object: {"add": "新增", "del": "不可用", ...}
      // Also handle edge case where rawOptions is falsy or empty
      let options = [];
      if (Array.isArray(rawOptions)) {
        options = rawOptions;
      } else if (rawOptions && typeof rawOptions === 'object') {
        options = Object.entries(rawOptions).map(([k, v]) => ({ value: k, label: v }));
      }
      // Normalize each option to {value, label} format regardless of input format
      options = options.filter(Boolean).map(opt => {
        if (typeof opt === 'string') return { value: opt, label: opt };
        if (Array.isArray(opt)) return { value: opt[0], label: opt[1] || opt[0] };
        if (opt && typeof opt === 'object') {
          const v = opt.value ?? opt.val ?? opt.id ?? Object.values(opt)[0] ?? '';
          const l = opt.label ?? opt.name ?? opt.description ?? Object.values(opt)[1] ?? v;
          return { value: String(v), label: String(l) };
        }
        return { value: String(opt), label: String(opt) };
      });

      return html`
        <div class="form-field">
          <label>${label}${required ? ' *' : ''}</label>
          ${fieldDesc ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
          ${isMulti ? html`
            <!-- multi_select: render as checkboxes instead of multi-select dropdown -->
            <div class="multi-select-checkboxes">
              ${options.map(opt => {
                const optTranslated = this._getOptionLabel(schema, opt.value);
                const optLabel = optTranslated || opt.label;
                const isChecked = hasDefault && (Array.isArray(defaultValue)
                  ? defaultValue.includes(opt.value)
                  : defaultValue === opt.value);
                return html`
                  <label class="checkbox-label multi-option">
                    <input type="checkbox" name=${name} value=${opt.value}
                           ?checked=${isChecked} @change=${this._onMultiCheckboxChange}>
                    <span>${optLabel}</span>
                  </label>
                `;
              })}
            </div>
          ` : html`
            <select name=${name} ?required=${required}>
              ${!required ? html`<option value="">${t('flowSelectOption')}</option>` : ''}
              ${options.map(opt => {
                const optTranslated = this._getOptionLabel(schema, opt.value);
                const optLabel = optTranslated || opt.label;
                const isSelected = hasDefault && defaultValue === opt.value;
                return html`<option value=${opt.value} ?selected=${isSelected}>${optLabel}</option>`;
              })}
            </select>
          `}
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // Boolean (checkbox) — also handles selector.boolean
    // Special case: "back" field renders as a "Go Back" button instead of a checkbox
    if (type === 'boolean' || selectorType === 'boolean') {
      if (name === 'back' && !required) {
        return html`
          <div class="form-field">
            <button type="button" class="btn" @click=${this._cancelFlow}>${t('flowBack')}</button>
          </div>
        `;
      }
      const isChecked = defaultValue === true || defaultValue === 'true'
        || defaultValue === 1 || defaultValue === '1';
      return html`
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name=${name} ?checked=${isChecked}>
            <span>${label !== schema.name.replace(/_/g, ' ') ? label : (fieldDesc || label)}</span>
          </label>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // Number / integer — also handles selector.number / selector.integer
    if (type === 'integer' || type === 'number' || selectorType === 'number' || selectorType === 'integer') {
      const step = selector.number?.step || (type === 'integer' ? 1 : 'any');
      const min = selector.number?.min ?? schema.valueMin ?? schema.minimum ?? '';
      const max = selector.number?.max ?? schema.valueMax ?? schema.maximum ?? '';
      return html`
        <div class="form-field">
          <label>${label}${required ? ' *' : ''}</label>
          ${fieldDesc ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
          <input type="number" name=${name} .value=${defaultValue}
                 ?required=${required} placeholder=${placeholder}
                 step=${step} min=${min ?? ''} max=${max ?? ''}>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // String / text (default) — also handles selector.text / selector.entity / selector.area etc.
    // For entity/area selectors, render as text input (full entity picker requires HA components)
    if (multiline || selectorType === 'text' && selector.text?.multiline) {
      return html`
        <div class="form-field">
          <label>${label}${required ? ' *' : ''}</label>
          ${fieldDesc ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
          <textarea name=${name} .value=${defaultValue}
                    ?required=${required} placeholder=${placeholder}></textarea>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }
    return html`
      <div class="form-field">
        <label>${label}${required ? ' *' : ''}</label>
        ${fieldDesc && fieldDesc !== placeholder ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
        <input type=${isPassword ? 'password' : 'text'} name=${name}
               .value=${defaultValue} ?required=${required} placeholder=${placeholder}>
        ${error ? html`<div class="form-error">${error}</div>` : ''}
      </div>
    `;
  }

  /* ── Result renderer ── */

  _renderResult() {
    if (!this._result) return '';
    const r = this._result;

    if (r.type === 'create_entry') {
      return html`
        <div class="result">
          <svg class="result-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div class="result-title">${t('flowResultCreated')}</div>
          <div class="result-desc">${r.title || t('flowResultCreatedDesc')}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${t('flowDone')}</button>
          </div>
        </div>
      `;
    }

    if (r.type === 'abort') {
      const reasons = {
        'already_configured': t('flowAbortAlreadyConfigured'),
        'single_instance_allowed': t('flowAbortSingleInstance'),
        'no_devices_found': t('flowAbortNoDevices'),
        'already_in_progress': t('flowAbortInProgress'),
      };
      return html`
        <div class="result">
          <svg class="result-icon abort" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div class="result-title">${t('flowResultAborted')}</div>
          <div class="result-desc">${reasons[r.reason] || r.reason || t('flowResultAbortedDesc')}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${t('flowGotIt')}</button>
          </div>
        </div>
      `;
    }

    if (r.type === 'external') {
      return html`
        <div class="result">
          <svg class="result-icon external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <div class="result-title">${t('flowResultExternal')}</div>
          <div class="result-desc">${r.message || t('flowResultExternalDesc')}</div>
          ${r.url ? html`<a href=${r.url} target="_blank" class="btn external">${t('flowOpenAuthPage')}</a>` : ''}
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${t('flowClose')}</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="result">
        <svg class="result-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <div class="result-title">${t('flowResultFailed')}</div>
        <div class="result-desc">${r.message || t('flowResultFailedDesc')}</div>
        <div class="actions">
          <button class="btn primary" @click=${this._close}>${t('flowClose')}</button>
        </div>
      </div>
    `;
  }
}

customElements.define('config-flow-dialog', ConfigFlowDialog);