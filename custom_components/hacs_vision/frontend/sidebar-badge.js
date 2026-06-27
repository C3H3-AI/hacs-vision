// HACS Vision Sidebar Badge
// Loaded globally via Lovelace resource — runs on every HA page load
// Updates the sidebar badge with pending update count

(function() {
  'use strict';

  const BADGE_URL = '/api/hacs_vision/updates';
  const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const INITIAL_DELAY = 2000; // Wait 2s after page load for HA to initialize

  let pollTimer = null;
  let lastCount = -1;
  let haReady = false;

  function getHaRoot() {
    try {
      const ha = document.querySelector('home-assistant');
      if (!ha || !ha.shadowRoot) return null;
      return ha.shadowRoot;
    } catch(e) {
      return null;
    }
  }

  function findSidebarItem(root) {
    if (!root) return null;
    // Try modern ha-sidebar-item (HA 2025+)
    const items = root.querySelectorAll('ha-sidebar-item');
    for (const item of items) {
      const link = item.querySelector('a[href*="hacs-vision"], a[href*="hacs_vision"]');
      if (link) return item;
    }
    // Fallback: check by text
    for (const item of items) {
      if (item.textContent.toLowerCase().includes('hacs') && 
          !item.textContent.toLowerCase().includes('hacs原始')) {
        return item;
      }
    }
    return null;
  }

  function updateBadge(count) {
    if (count === lastCount) return; // No change
    lastCount = count;

    const root = getHaRoot();
    const item = findSidebarItem(root);
    if (!item) return;

    // For HA 2024+: use `notification` property
    if (count > 0) {
      item.notification = count;
      item.setAttribute('notification', String(count));
    } else {
      item.notification = 0;
      item.removeAttribute('notification');
    }
  }

  async function getAuthToken() {
    try {
      // HA stores its connection promise on window
      if (window.hassConnection) {
        const conn = await Promise.resolve(window.hassConnection);
        if (conn?.auth?.data?.access_token) {
          return conn.auth.data.access_token;
        }
      }
      // Fallback: try cookie-based auth (for non-auth endpoints)
      return '';
    } catch(e) {
      return '';
    }
  }

  async function fetchUpdateCount() {
    try {
      const token = await getAuthToken();
      if (!token) return; // Not logged in yet

      const resp = await fetch(BADGE_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      const updates = data.updates || [];
      updateBadge(updates.length);
    } catch(e) {
      // Silently retry on next poll
    }
  }

  function startPolling() {
    // Initial fetch after HA is ready
    setTimeout(() => {
      fetchUpdateCount();
    }, INITIAL_DELAY);

    // Periodic polling
    pollTimer = setInterval(fetchUpdateCount, POLL_INTERVAL);

    // Also listen for panel visibility changes (user returns to HA tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchUpdateCount();
      }
    });

    // Hook into HA's connection
    const origPushState = window.history.pushState;
    window.history.pushState = function() {
      origPushState.apply(this, arguments);
      setTimeout(fetchUpdateCount, 1000);
    };
  }

  // Wait for HA to be ready
  function waitForHA() {
    if (document.querySelector('home-assistant')) {
      haReady = true;
      startPolling();
      return;
    }
    // DOM observer fallback
    const observer = new MutationObserver(() => {
      if (document.querySelector('home-assistant') && !haReady) {
        haReady = true;
        startPolling();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check after a timeout
    setTimeout(() => {
      if (!haReady) {
        // HA might be loading in shadow DOM already
        haReady = true;
        startPolling();
      }
    }, 10000);
  }

  // Start on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForHA);
  } else {
    waitForHA();
  }

  console.log('[HACS Vision] Sidebar badge initialized');
})();
