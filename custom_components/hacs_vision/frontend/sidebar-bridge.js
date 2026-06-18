// HACS Vision Sidebar Bridge
// Runs in HA's main document context (via add_extra_js_url)
// Has full access to home-assistant's shadow DOM

(function() {
  'use strict';

  function toggleSidebar() {
    try {
      const ha = document.querySelector('home-assistant');
      if (!ha) return;

      // Try shadowRoot access
      const root = ha.shadowRoot;
      if (!root) return;

      // Try ha-sidebar toggle method (desktop + mobile)
      const sidebar = root.querySelector('ha-sidebar');
      if (sidebar && typeof sidebar.toggle === 'function') {
        sidebar.toggle();
        return;
      }

      // Try ha-drawer (mobile drawer variant)
      const drawer = root.querySelector('ha-drawer');
      if (drawer && typeof drawer.toggle === 'function') {
        drawer.toggle();
        return;
      }

      // Fallback: find menu button in app-toolbar
      const toolbar = root.querySelector('app-toolbar');
      if (toolbar) {
        const menuBtn = toolbar.querySelector('[icon="menu"], ha-menu-button, .menu-button');
        if (menuBtn) { menuBtn.click(); return; }
      }

      // Last resort: dispatch toggle-menu event from main document
      window.dispatchEvent(new CustomEvent('hass-toggle-menu', {
        bubbles: true, composed: true, cancelable: true
      }));
    } catch(e) {
      console.warn('[HACS Vision] Sidebar toggle failed:', e);
    }
  }

  // Listen for toggle requests from our panel (dispatched on window)
  window.addEventListener('hacs-vision-toggle-sidebar', function() {
    toggleSidebar();
  });

  // Also allow direct function call from panel
  window.__hacsVisionToggleSidebar = toggleSidebar;

  console.log('[HACS Vision] Sidebar bridge loaded');
})();
