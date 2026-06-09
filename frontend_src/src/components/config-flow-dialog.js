import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';

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
  }

  connectedCallback() {
    super.connectedCallback();
    // Don't auto-start here — updated() handles it
  }

  updated(changed) {
    if (changed.has('open') && this.open) {
      if (this.entryId) {
        // entryId set from outside → options flow
        this._isOptions = true;
        this.domain = '';
        this._startFlow();
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
    this.domain = domain;
    this.open = true;
  }

  /** Public: open an OPTIONS flow for an existing config entry */
  openOptionsFlow(entryId) {
    this.domain = '';
    this._isOptions = true;
    this.entryId = entryId;
    this.open = true;
  }

  async _startFlow() {
    this._loading = true;
    this._finished = false;
    this._result = null;
    this._step = null;
    this._errors = {};
    this.requestUpdate();

    try {
      let result;
      if (this._isOptions && this.entryId) {
        result = await this.hass.callApi('POST', 'config/config_entries/options/flow', { handler: this.entryId });
      } else {
        result = await this.hass.callApi('POST', 'config/config_entries/flow', { handler: this.domain, show_advanced_options: true });
      }

      this._handleFlowResponse(result);
    } catch (e) {
      console.error('HACS Vision: config flow start error:', e);
      this._finished = true;
      this._result = { type: 'error', message: e.message || (this._isOptions ? t('flowStartFailedOptions') : t('flowStartFailed')) };
      this._loading = false;
      this.requestUpdate();
    }
  }

  _handleFlowResponse(result) {
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

    if (result.type === 'form') {
      this._flowId = result.flow_id || result.flowId;
      this._step = result;
      this._errors = result.errors || {};
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
      if (this._isOptions && this._step) {
        result = await this.hass.callApi('POST', `config/config_entries/options/flow/${this._flowId}`, data);
      } else {
        result = await this.hass.callApi('POST', `config/config_entries/flow/${this._flowId}`, data);
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
    for (const el of form.elements) {
      if (el.name && el.type !== 'submit' && el.type !== 'button') {
        if (el.type === 'checkbox') {
          data[el.name] = el.checked;
        } else if (el.type === 'select-multiple') {
          data[el.name] = Array.from(el.selectedOptions).map(o => o.value);
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
    // Menu selection submits the chosen option
    this._submitStep({ next_step_id: value });
  }

  _cancelFlow() {
    if (this._flowId) {
      this.hass.callApi('DELETE', `config/config_entries/flow/${this._flowId}`).catch(() => {});
    }
    this._close();
  }

  _close() {
    this.open = false;
    this._flowId = null;
    this._step = null;
    this._finished = false;
    this._result = null;
    this._errors = {};
    this._isOptions = false;
    this.domain = '';
    this.entryId = null;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  static styles = css`
    :host { display: block; }
    :host([open]) {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
      pointer-events: none;
    }
    .overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999;
      display: flex; align-items: center; justify-content: center;
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
      width: 90%; max-width: 520px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 24px;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .title { font-size: 18px; font-weight: 700; color: var(--primary-text-color, #212121); }
    .close-btn {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color, #727272);
      cursor: pointer; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .close-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }

    .loading { text-align: center; padding: 40px 0; color: var(--secondary-text-color, #727272); }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

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
    .form-field input, .form-field select {
      width: 100%; box-sizing: border-box;
      padding: 10px 12px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; font-size: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .form-field input:focus, .form-field select:focus {
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
    .btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
    .btn.primary {
      background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .btn.primary:hover { opacity: 0.9; color: #fff; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn.external {
      background: #2196f3; border-color: #2196f3; color: #fff;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 10px; padding: 8px 20px;
    }
  `;

  /* ── Top-level render ── */

  render() {
    if (!this.open) return '';

    const title = this._step?.handler || this.domain || (this._isOptions ? t('flowTitleOptions') : t('flowTitle'));

    return html`
      <div class="overlay" @click=${(e) => { if (e.target === e.currentTarget) this._cancelFlow(); }}>
        <div class="dialog">
          <div class="header">
            <span class="title">${title}</span>
            <button class="close-btn" @click=${this._cancelFlow}>&times;</button>
          </div>

          ${this._loading ? html`
            <div class="loading">
              <div class="spinner"></div>
              <div>${t('flowProcessing')}</div>
            </div>
          ` : ''}

          ${this._finished && this._result ? this._renderResult() : ''}

          ${!this._loading && !this._finished && this._step ? this._renderStep() : ''}

          ${!this._loading && !this._finished && !this._step && !this._result ? html`
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
          const label = isSimple ? opt : opt.label || opt.title || opt.value || '';
          const desc = isSimple ? '' : opt.description || '';
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
    const placeholders = step.description_placeholders || {};
    for (const [key, val] of Object.entries(placeholders)) {
      if (key === 'description') continue;
      desc = desc.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    }
    // Show placeholder values if no description template
    if (!desc && Object.keys(placeholders).length > 0) {
      const lines = Object.entries(placeholders)
        .filter(([k]) => k !== 'description')
        .map(([, v]) => v);
      desc = lines.join('\n');
    }
    return desc;
  }

  /* ── Single form field renderer ── */

  _renderField(schema) {
    const name = schema.name;
    const label = schema.label || schema.name.replace(/_/g, ' ');
    const type = schema.type || 'string';
    const required = schema.required !== false;
    const hasDefault = schema.default !== undefined && schema.default !== null;
    const defaultValue = hasDefault ? schema.default : '';
    const placeholder = schema.description || schema.placeholder || '';
    const fieldDesc = schema.description || '';
    const error = this._errors?.[name] || '';

    // Select (enum) rendering
    if (type === 'select' || type === 'multi_select' || schema.options || schema.enum) {
      const options = schema.options || schema.enum || [];
      const isMulti = type === 'multi_select';

      return html`
        <div class="form-field">
          <label>${label}${required ? ' *' : ''}</label>
          ${fieldDesc ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
          <select name=${name} ?multiple=${isMulti} ?required=${required}>
            ${!required && !isMulti ? html`<option value="">${t('flowSelectOption')}</option>` : ''}
            ${options.map(opt => {
              const optValue = typeof opt === 'string' ? opt : opt.value || opt;
              const optLabel = typeof opt === 'string' ? opt : opt.label || opt.description || opt.value || opt;
              const isSelected = hasDefault && (Array.isArray(defaultValue)
                ? defaultValue.includes(optValue)
                : defaultValue === optValue);
              return html`<option value=${optValue} ?selected=${isSelected}>${optLabel}</option>`;
            })}
          </select>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // Boolean (checkbox)
    if (type === 'boolean') {
      return html`
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name=${name} ?checked=${defaultValue === true || defaultValue === 'true'}>
            <span>${fieldDesc || label}</span>
          </label>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // Number / integer
    if (type === 'integer' || type === 'number') {
      return html`
        <div class="form-field">
          <label>${label}${required ? ' *' : ''}</label>
          ${fieldDesc ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
          <input type="number" name=${name} .value=${defaultValue}
                 ?required=${required} placeholder=${placeholder}
                 step=${type === 'integer' ? 1 : 'any'}>
          ${error ? html`<div class="form-error">${error}</div>` : ''}
        </div>
      `;
    }

    // String / text (default)
    return html`
      <div class="form-field">
        <label>${label}${required ? ' *' : ''}</label>
        ${fieldDesc && fieldDesc !== placeholder ? html`<div class="field-desc">${fieldDesc}</div>` : ''}
        <input type="text" name=${name} .value=${defaultValue}
               ?required=${required} placeholder=${placeholder}>
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