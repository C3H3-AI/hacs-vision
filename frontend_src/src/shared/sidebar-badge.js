/**
 * Sidebar badge manager for HACS Vision.
 *
 * HA has no official API for custom panels to display badges on sidebar items.
 * The built-in config/notification badges are hardcoded in ha-sidebar.ts.
 * This module works around it by finding the "HACS Vision" text node anywhere
 * in the DOM (including shadow roots) and appending a styled badge element.
 *
 * Compatible with:
 *   - Stock HA sidebar (items in shadow DOM via ha-md-list-item)
 *   - custom-sidebar plugin (items in light DOM)
 *   - Any HA version
 */

const BADGE_CLASS = 'hacs-vision-sb-badge';

/**
 * Update (or remove) the sidebar badge showing available update count.
 * @param {number} count - Number of available updates (0 to hide badge)
 */
export function updateSidebarBadge(count) {
  try {
    const textNode = _findSidebarTextNode(document.body, new Set());
    if (!textNode) return;

    const parent = textNode.parentElement;
    if (!parent) return;

    // Strip any existing count suffix from the text
    textNode.textContent = textNode.textContent.replace(/ \(\d+\)$/, '');

    // Remove old badge if exists
    const oldBadge = parent.querySelector(`.${BADGE_CLASS}`);
    if (oldBadge) oldBadge.remove();

    if (count > 0) {
      // Ensure parent can anchor absolute positioning
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
    }
  } catch (e) {
    // Silently ignore — DOM structure varies across HA versions / sidebar plugins
  }
}

/**
 * Recursively search light DOM + open shadow DOMs for the "HACS Vision" text.
 */
function _findSidebarTextNode(root, visited) {
  if (!root || visited.has(root)) return null;
  visited.add(root);

  // Search text nodes in this root
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const t = node.textContent.trim();
    if (t === 'HACS Vision' || /^HACS Vision \(\d+\)$/.test(t)) {
      return node;
    }
  }

  // Recurse into shadow roots of child elements
  const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
  let el;
  while ((el = iter.nextNode())) {
    if (el.shadowRoot) {
      const found = _findSidebarTextNode(el.shadowRoot, visited);
      if (found) return found;
    }
  }
  return null;
}
