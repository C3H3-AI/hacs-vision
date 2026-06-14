/**
 * Make a dialog element draggable by its header/title bar.
 *
 * Usage:
 *   import { makeDraggable } from '../shared/draggable.js';
 *   // In firstUpdated or connectedCallback:
 *   this._cleanupDrag = makeDraggable(
 *     this.shadowRoot.querySelector('.dialog'),
 *     this.shadowRoot.querySelector('.title-bar, .header, .modal-header, .dv-header')
 *   );
 *   // In disconnectedCallback:
 *   if (this._cleanupDrag) this._cleanupDrag();
 *
 * @param {HTMLElement} dialogEl - The dialog container element to move
 * @param {HTMLElement} handleEl - The drag handle (header/title bar)
 * @returns {Function} cleanup function
 */
export function makeDraggable(dialogEl, handleEl) {
  if (!dialogEl || !handleEl) return () => {};

  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;
  let dragging = false;

  function onPointerDown(e) {
    // Only drag on primary button (left click / touch)
    if (e.button !== undefined && e.button !== 0) return;
    // Skip drag when clicking a button/input inside the handle (e.g. close button)
    if (e.target.closest('button, input, select, textarea')) return;
    dragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    dialogEl.style.transition = 'none';
    dialogEl.style.cursor = 'grabbing';
    handleEl.style.userSelect = 'none';
    // Capture pointer so we don't lose events
    dialogEl.setPointerCapture(e.pointerId);
    dialogEl.addEventListener('pointermove', onPointerMove);
    dialogEl.addEventListener('pointerup', onPointerUp);
    dialogEl.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    dialogEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function onPointerUp(e) {
    dragging = false;
    dialogEl.style.cursor = '';
    handleEl.style.userSelect = '';
    dialogEl.removeEventListener('pointermove', onPointerMove);
    dialogEl.removeEventListener('pointerup', onPointerUp);
    dialogEl.removeEventListener('pointercancel', onPointerUp);
    try { dialogEl.releasePointerCapture(e.pointerId); } catch(er) {}
  }

  // Use pointerdown on the handle
  handleEl.addEventListener('pointerdown', onPointerDown);
  handleEl.style.cursor = 'grab';
  handleEl.style.touchAction = 'none';

  return function cleanup() {
    handleEl.removeEventListener('pointerdown', onPointerDown);
    dialogEl.removeEventListener('pointermove', onPointerMove);
    dialogEl.removeEventListener('pointerup', onPointerUp);
    dialogEl.removeEventListener('pointercancel', onPointerUp);
    handleEl.style.cursor = '';
    handleEl.style.touchAction = '';
  };
}
