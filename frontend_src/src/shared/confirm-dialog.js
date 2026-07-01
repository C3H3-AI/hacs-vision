import { LitElement, html, css } from 'lit';
import DOMPurify from 'dompurify';
import { t } from '../i18n.js';

/** Auto-link bare URLs in text, return HTML-safe string */
function _linkify(text) {
  if (!text) return '';
  let html = String(text).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--primary-color,#03a9f4);text-decoration:underline">$1</a>');
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href', 'target', 'rel', 'style'] });
}

/**
 * Custom confirm dialog component to replace native confirm()
 *
 * Usage:
 *   const result = await ConfirmDialog.show(this, {
 *     title: '确认删除',
 *     message: '将立即停止运行，仓库文件不会被删除。',
 *     confirmText: '删除',
 *     danger: true,
 *   });
 *   if (result) { ... }
 *
 * Types: 'danger' | 'warning' | 'info' (default: 'info' when no danger)
 */
class ConfirmDialog extends LitElement {
  static properties = {
    _title: { type: String, state: true },
    _message: { type: String, state: true },
    _confirmText: { type: String, state: true },
    _cancelText: { type: String, state: true },
    _thirdText: { type: String, state: true },
    _danger: { type: Boolean, state: true },
    _type: { type: String, state: true },
    _visible: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._title = '';
    this._message = '';
    this._confirmText = t('confirm');
    this._cancelText = t('cancel');
    this._thirdText = '';
    this._danger = false;
    this._type = 'info';
    this._visible = false;
    this._resolve = null;
    this._dialogDrag = { offsetX: 0, offsetY: 0, startX: 0, startY: 0, dragging: false };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    :host { display: contents; }
    .overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 40px; box-sizing: border-box;
      animation: overlayFadeIn 0.15s ease;
    }
    @media (max-width: 768px) {
      .overlay { padding: 16px; }
    }
    @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dialogSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      max-width: 440px; width: 100%;
      max-height: 85vh;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: dialogSlideUp 0.2s ease;
      display: flex; flex-direction: column;
      user-select: text;
      -webkit-user-select: text;
    }

    /* ===== Title Bar ===== */
    .title-bar {
      display: flex; align-items: center; gap: 10px;
      padding: 18px 20px 0;
    }
    .title-icon {
      width: 24px; height: 24px; flex-shrink: 0;
    }
    .title-icon.danger { color: #f44336; }
    .title-icon.warning { color: #ff9800; }
    .title-icon.info { color: var(--primary-color, #03a9f4); }
    .title-text {
      font-size: 16px; font-weight: 600; color: var(--primary-text-color);
    }

    /* ===== Body ===== */
    .message {
      font-size: 14px; color: var(--primary-text-color, #212121);
      line-height: 1.6; padding: 12px 20px 20px;
      overflow-y: auto; flex: 1; min-height: 0;
    }

    /* ===== Actions ===== */
    .actions {
      display: flex; gap: 10px;
      padding: 0 20px 18px; justify-content: flex-end;
    }
    .btn {
      padding: 10px 22px; border-radius: 10px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.15s; touch-action: manipulation;
      min-height: 40px; user-select: none;
    }
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.danger {
      background: #f44336; border-color: #f44336; color: #fff;
    }
    .btn.danger:hover { opacity: 0.9; }
    .btn.warning {
      background: #ff9800; border-color: #ff9800; color: #fff;
    }
    .btn.warning:hover { opacity: 0.9; }

    @media (max-width: 768px) {
      .actions { flex-direction: column-reverse; }
      .btn { width: 100%; text-align: center; min-height: 44px; }
    }
  `;

  static show(host, { title, message, confirmText, cancelText, thirdText, danger, type } = {}) {
    let dialog = host.shadowRoot?.querySelector('confirm-dialog');
    if (!dialog) {
      dialog = document.createElement('confirm-dialog');
      host.shadowRoot.appendChild(dialog);
    }
    return new Promise(resolve => {
      dialog._resolve = resolve;
      dialog._title = title || '';
      dialog._message = message || 'Are you sure?';
      dialog._confirmText = confirmText || t('confirm');
      dialog._cancelText = cancelText || t('cancel');
      dialog._thirdText = thirdText || '';
      dialog._danger = !!danger;
      dialog._type = type || (danger ? 'danger' : 'info');
      dialog._visible = true;
      // Focus trap: focus confirm button
      setTimeout(() => {
        const btn = dialog.shadowRoot?.querySelector('.btn-confirm');
        if (btn) btn.focus();
      }, 100);
    });
  }

  _getIcon(type) {
    if (type === 'danger') return html`<svg class="title-icon danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    if (type === 'warning') return html`<svg class="title-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    return html`<svg class="title-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._onCancel();
    }
    if (e.key === 'Enter') {
      e.stopPropagation();
      this._onConfirm();
    }
  }

  _onConfirm() {
    this._visible = false;
    // Reset transform for next open
    const dialog = this.shadowRoot?.querySelector('.dialog');
    if (dialog) dialog.style.transform = '';
    if (this._resolve) this._resolve(true);
  }

  _onCancel() {
    this._visible = false;
    // Reset transform for next open
    const dialog = this.shadowRoot?.querySelector('.dialog');
    if (dialog) dialog.style.transform = '';
    if (this._resolve) this._resolve(false);
  }

  _onThird() {
    this._visible = false;
    // Reset transform for next open
    const dialog = this.shadowRoot?.querySelector('.dialog');
    if (dialog) dialog.style.transform = '';
    if (this._resolve) this._resolve('third');
  }

  _onOverlayClick(e) {
    if (e.target === e.currentTarget) this._onCancel();
  }

  _dialogPointerDown(e) {
    const titleBar = e.target.closest('.title-bar');
    if (!titleBar || e.target.closest('button')) return;
    if (e.button !== undefined && e.button !== 0) return;
    const drag = this._dialogDrag;
    const dialog = e.currentTarget;
    drag.dragging = true;
    drag.startX = e.clientX - drag.offsetX;
    drag.startY = e.clientY - drag.offsetY;
    dialog.style.transition = 'none';
    dialog.style.cursor = 'grabbing';
    titleBar.style.userSelect = 'none';
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
      titleBar.style.userSelect = '';
      dialog.removeEventListener('pointermove', onMove);
      dialog.removeEventListener('pointerup', onUp);
      dialog.removeEventListener('pointercancel', onUp);
      try { dialog.releasePointerCapture(ev.pointerId); } catch(er) {}
    };
    dialog.addEventListener('pointermove', onMove);
    dialog.addEventListener('pointerup', onUp);
    dialog.addEventListener('pointercancel', onUp);
  }

  render() {
    if (!this._visible) return html``;
    return html`
      <div class="overlay" @click=${this._onOverlayClick} @keydown=${this._onKeyDown}>
        <div class="dialog" role="alertdialog" aria-modal="true" @pointerdown=${this._dialogPointerDown}>
          ${this._title ? html`
            <div class="title-bar">
              ${this._getIcon(this._type)}
              <span class="title-text">${this._title}</span>
            </div>
          ` : ''}
          <div class="message" .innerHTML=${_linkify(this._message)}></div>
          <div class="actions">
            <button class="btn" @click=${this._onCancel}>${this._cancelText}</button>
            ${this._thirdText ? html`
              <button class="btn" style="border:1px solid var(--primary-color, #03a9f4);color:var(--primary-color, #03a9f4);" @click=${this._onThird}>${this._thirdText}</button>
            ` : ''}
            <button class="btn btn-confirm ${this._danger ? 'danger' : this._type === 'warning' ? 'warning' : ''}" @click=${this._onConfirm}>${this._confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);

export { ConfirmDialog };
