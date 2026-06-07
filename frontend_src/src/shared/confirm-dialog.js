import { LitElement, html, css } from 'lit';
import { t } from '../i18n.js';

/**
 * Custom confirm dialog component to replace native confirm()
 * Usage:
 *   const result = await ConfirmDialog.show(this, { message: '确定删除?', confirmText: '删除', danger: true });
 *   if (result) { ... }
 */
class ConfirmDialog extends LitElement {
  static properties = {
    _message: { type: String, state: true },
    _confirmText: { type: String, state: true },
    _cancelText: { type: String, state: true },
    _danger: { type: Boolean, state: true },
    _visible: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._message = '';
    this._confirmText = t('confirm');
    this._cancelText = t('cancel');
    this._danger = false;
    this._visible = false;
    this._resolve = null;
  }

  static styles = css`
    :host { display: contents; }
    .overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px; padding: 24px;
      max-width: 380px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .message {
      font-size: 15px; color: var(--primary-text-color, #212121);
      line-height: 1.6; margin-bottom: 20px;
    }
    .actions { display: flex; gap: 10px; justify-content: flex-end; }
    .btn {
      padding: 10px 20px; border-radius: 10px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.2s; touch-action: manipulation;
    }
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.danger {
      background: #f44336; border-color: #f44336; color: #fff;
    }
    .btn.danger:hover { opacity: 0.9; }
    @media (max-width: 768px) {
      .actions { flex-direction: column-reverse; }
      .btn { width: 100%; text-align: center; min-height: 44px; }
    }
  `;

  static show(host, { message, confirmText, cancelText, danger } = {}) {
    let dialog = host.shadowRoot?.querySelector('confirm-dialog');
    if (!dialog) {
      dialog = document.createElement('confirm-dialog');
      host.shadowRoot.appendChild(dialog);
    }
    return new Promise(resolve => {
      dialog._resolve = resolve;
      dialog._message = message || 'Are you sure?';
      dialog._confirmText = confirmText || t('confirm');
      dialog._cancelText = cancelText || t('cancel');
      dialog._danger = !!danger;
      dialog._visible = true;
    });
  }

  _onConfirm() {
    this._visible = false;
    if (this._resolve) this._resolve(true);
  }

  _onCancel() {
    this._visible = false;
    if (this._resolve) this._resolve(false);
  }

  _onOverlayClick(e) {
    if (e.target === e.currentTarget) this._onCancel();
  }

  render() {
    if (!this._visible) return html``;
    return html`
      <div class="overlay" @click=${this._onOverlayClick}>
        <div class="dialog">
          <div class="message">${this._message}</div>
          <div class="actions">
            <button class="btn" @click=${this._onCancel}>${this._cancelText}</button>
            <button class="btn ${this._danger ? 'danger' : ''}" @click=${this._onConfirm}>${this._confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);

export { ConfirmDialog };
