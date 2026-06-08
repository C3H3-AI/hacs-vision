/**
 * Theme mixin that reads HA CSS variables for consistent theming.
 * Apply this mixin to LitElement components to get theme-aware styling.
 */
export const themeMixin = (superClass) => class extends superClass {
  static properties = {
    _themeReady: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._themeReady = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Apply theme after element is in DOM
    requestAnimationFrame(() => {
      this._applyTheme();
      this._themeReady = true;
    });
    // Watch for HA theme changes
    this._setupThemeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._themeObserver) {
      this._themeObserver.disconnect();
      this._themeObserver = null;
    }
  }

  _getHAVar(name, fallback = '') {
    try {
      const root = document.querySelector('home-assistant')?.shadowRoot ||
                   document.querySelector('ha-app')?.shadowRoot ||
                   document.documentElement;
      // Try cascade: element's shadow root → document root → parent window
      const sources = [
        this.renderRoot?.host,
        root,
        document.documentElement,
        document.body,
      ];
      for (const el of sources) {
        if (!el) continue;
        try {
          const val = getComputedStyle(el).getPropertyValue(name).trim();
          if (val) return val;
        } catch(e) { /* continue */ }
      }
      // Try parent window if in iframe
      try {
        if (window.parent && window.parent !== window) {
          const pRoot = window.parent.document.querySelector('home-assistant')?.shadowRoot ||
                       window.parent.document.documentElement;
          if (pRoot) {
            const val = getComputedStyle(pRoot).getPropertyValue(name).trim();
            if (val) return val;
          }
        }
      } catch(e) { /* cross-origin */ }
    } catch(e) { /* ignore */ }
    return fallback;
  }

  _applyTheme() {
    const root = this.renderRoot?.host || this;
    const isDark = this._isDarkMode();

    const defaults = {
      '--primary-background-color': isDark ? '#111111' : '#f5f5f5',
      '--secondary-background-color': isDark ? '#1c1c1c' : '#e0e0e0',
      '--primary-text-color': isDark ? '#e1e1e1' : '#212121',
      '--secondary-text-color': isDark ? '#9e9e9e' : '#727272',
      '--card-background-color': isDark ? '#1c1c1c' : '#ffffff',
      '--divider-color': isDark ? '#333333' : '#e0e0e0',
      '--primary-color': '#03a9f4',
      '--rgb-primary-color': '3, 169, 244',
      '--ha-card-border-radius': '12px',
    };

    for (const [name, fallback] of Object.entries(defaults)) {
      const val = this._getHAVar(name);
      root.style.setProperty(name, val || fallback);
      if (name === '--primary-color' && !val) {
        // Compute rgb-primary-color from primary-color
        const rgb = this._hexToRgb(fallback);
        if (rgb) root.style.setProperty('--rgb-primary-color', rgb);
      }
    }

    // Compute rgb-primary-color from primary-color if not set
    const primaryColor = root.style.getPropertyValue('--primary-color').trim() || defaults['--primary-color'];
    const rgbVal = this._getHAVar('--rgb-primary-color') || this._hexToRgb(primaryColor) || '3, 169, 244';
    root.style.setProperty('--rgb-primary-color', rgbVal);
  }

  _isDarkMode() {
    try {
      const bg = this._getHAVar('--primary-background-color');
      if (bg) {
        const hex = bg.replace('#', '').toLowerCase();
        if (/^[0-3]/.test(hex)) return true;
        const m = bg.match(/rgba?\((\d+)/);
        if (m && parseInt(m[1]) < 80) return true;
        if (bg.includes('#111') || bg.includes('#1c1c')) return true;
      }
      const dt = document.body?.getAttribute('data-theme');
      if (dt && dt.includes('dark')) return true;
    } catch(e) { /* ignore */ }
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch(e) { return false; }
  }

  _hexToRgb(hex) {
    const rgbMatch = hex.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return null;
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    if (isNaN(r+g+b)) return null;
    return `${r}, ${g}, ${b}`;
  }

  _setupThemeObserver() {
    try {
      const target = document.querySelector('home-assistant') ||
                    document.querySelector('ha-app') ||
                    document.documentElement;
      if (target) {
        this._themeObserver = new MutationObserver(() => {
          if (this._themeObserver?._debounce) return;
          this._themeObserver._debounce = true;
          setTimeout(() => { if (this._themeObserver) this._themeObserver._debounce = false; this._applyTheme(); }, 200);
        });
        this._themeObserver.observe(target, { attributes: true, attributeFilter: ['class', 'style'], subtree: true });
      }
    } catch(e) { /* ignore */ }
  }
};