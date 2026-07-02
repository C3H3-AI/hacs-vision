// HACS Vision Sidebar Badge (v2 - WebSocket, no HTTP fetch)
// Uses HA's native WebSocket connection (already authenticated) instead of HTTP fetch.

(function() {
  'use strict';

  const POLL_INTERVAL = 5 * 60 * 1000;
  const BADGE_CLASS = 'hacs-vision-sb-badge';
  let lastCount = -1;

  let PANEL_NAME = ''; // Will be fetched dynamically from HA

  // Get HACS Vision panel title from HA's panel registry
  async function getPanelName() {
    try {
      const conn = await Promise.resolve(window.hassConnection);
      if (conn?.conn) {
        const result = await conn.conn.sendMessagePromise({type: 'get_panels'});
        for (const [path, panel] of Object.entries(result)) {
          if (path === 'hacs-vision' && panel?.title) {
            return panel.title;
          }
        }
      }
    } catch(e) {}
    return 'HACS Vision'; // fallback
  }

  // Walk ALL shadow DOMs recursively
  function findTextNode(root, visited, panelName) {
    if (!root || visited.has(root)) return null;
    visited.add(root);

    // Strategy 1: find by href at this shadow DOM level
    const link = root.querySelector('a[href="/hacs-vision"]');
    if (link) {
      const container = link.closest('[role="listitem"], ha-sidebar-item, li, a') || link.parentElement;
      if (container) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent.trim();
          if (text) return node;
        }
      }
    }

    // Recurse into shadow DOMs
    const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
    let el;
    while (el = iter.nextNode()) {
      if (el.shadowRoot) {
        const found = findTextNode(el.shadowRoot, visited, panelName);
        if (found) return found;
      }
    }

    // Strategy 2: text search — use dynamically fetched panel name
    if (panelName) {
      const lowerTarget = panelName.toLowerCase();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent.trim().toLowerCase();
        if (text === lowerTarget || text === lowerTarget + ' (' || text.startsWith(lowerTarget + ' (')) {
          return node;
        }
      }
    }

    return null;
  }

  // Exact same badge injection as panel.js
  function updateBadge(count) {
    if (count === lastCount) return;
    lastCount = count;

    try {
      const textNode = findTextNode(document.body, new Set(), PANEL_NAME);
      if (!textNode) return;

      const parent = textNode.parentElement;
      if (!parent) return;

      textNode.textContent = textNode.textContent.replace(/ \(\d+\)$/, '');
      const oldBadge = parent.querySelector('.' + BADGE_CLASS);
      if (oldBadge) oldBadge.remove();
      if (count <= 0) return;

      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }

      const badge = document.createElement('span');
      badge.className = BADGE_CLASS;
      badge.textContent = count;
      Object.assign(badge.style, {
        position: 'absolute',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '22px',
        height: '22px',
        background: 'var(--primary-color, #03a9f4)',
        color: '#fff',
        borderRadius: '50%',
        fontSize: '12px',
        fontWeight: '700',
        lineHeight: '22px',
        pointerEvents: 'none',
      });
      parent.appendChild(badge);
    } catch(e) {}
  }

  // Get update count via WebSocket (already authenticated, no tokens needed)
  async function fetchUpdateCount() {
    try {
      const conn = await Promise.resolve(window.hassConnection);
      if (!conn?.conn) return;
      const result = await conn.conn.sendMessagePromise({type: 'hacs_vision/updates'});
      const updates = result?.updates || [];
      updateBadge(updates.length);
    } catch(e) {}
  }

  function startPolling() {
    // First fetch the panel name from HA
    getPanelName().then(name => {
      PANEL_NAME = name;
    });
    setTimeout(fetchUpdateCount, 2000);
    setInterval(fetchUpdateCount, POLL_INTERVAL);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) fetchUpdateCount();
    });
    const origPushState = window.history.pushState;
    window.history.pushState = function() {
      origPushState.apply(this, arguments);
      setTimeout(fetchUpdateCount, 1000);
    };
  }

  function waitForHA() {
    if (document.querySelector('home-assistant')) {
      startPolling();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector('home-assistant')) {
        startPolling();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); startPolling(); }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForHA);
  } else {
    waitForHA();
  }

  console.log('[HACS Vision] Sidebar badge v2 initialized (WebSocket)');
})();