import { LitElement, html, css } from 'lit';
import { api } from './api.js';
import { themeMixin } from './theme.js';
import { t } from './i18n.js';
import { getCategoryColor } from './shared/constants.js';
import DOMPurify from 'dompurify';

export class HacsVisionPanel extends themeMixin(LitElement) {
  static properties = {
    currentView: { type: String },
    stats: { type: Object },
    hass: { type: Object },
    narrow: { type: Boolean },
    _apiReady: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _detailRepo: { type: Object, state: true },
    _showDetail: { type: Boolean, state: true },
    _favoriteCount: { type: Number, state: true },
    _readmeHtml: { type: String, state: true },
    _readmeLoading: { type: Boolean, state: true },
    _viewTransition: { type: Boolean, state: true },
    _networkStatus: { type: String, state: true },
    _detailExpanded: { type: Boolean, state: true },
    _showVersionSelector: { type: Boolean, state: true },
    _releases: { type: Array, state: true },
    _releasesLoading: { type: Boolean, state: true },
    _installingVersion: { type: Boolean, state: true },
    _changelogData: { type: Object, state: true },
    _changelogLoading: { type: Boolean, state: true },
    _presetFilter: { type: String, state: true },
  };

  constructor() {
    super();
    this.currentView = 'browse';
    this.stats = { pendingRestart: 0 };
    this.narrow = window.innerWidth < 768;
    this._apiReady = false;
    this._error = '';
    this._detailRepo = null;
    this._showDetail = false;
    this._favoriteCount = 0;
    this._readmeHtml = null;
    this._readmeLoading = false;
    this._viewTransition = false;
    this._networkStatus = 'online';
    this._detailExpanded = false;
    this._showVersionSelector = false;
    this._releases = [];
    this._releasesLoading = false;
    this._installingVersion = false;
    this._changelogData = null;
    this._changelogLoading = false;
    this._presetFilter = '';
    registerPanel(this);
    window.addEventListener('resize', () => {
      this.narrow = window.innerWidth < 768;
    });
    // F2: Network status listeners
    window.addEventListener('online', () => { this._networkStatus = 'online'; });
    window.addEventListener('offline', () => { this._networkStatus = 'offline'; });
    // _updateFavoriteCount() deferred to willUpdate when hass becomes available
  }

  async _updateFavoriteCount() {
    try {
      const result = await api.getFavorites();
      const favs = Array.isArray(result) ? result : (result.favorites || []);
      this._favoriteCount = favs.length;
    } catch { this._favoriteCount = 0; }
  }

  willUpdate(changedProps) {
    if (changedProps.has('hass') && this.hass) {
      api.setHass(this.hass);
      if (!this._apiReady) {
        this._apiReady = true;
        this._loadStats();
        // F2: Register network status callback once
        api._onNetworkStatus = (status) => { this._networkStatus = status; };
      }
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .store {
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      min-height: 60vh;
      background: var(--primary-background-color, #f5f5f5);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    }

    /* ===== Error Banner ===== */
    .error-banner {
      margin-bottom: 12px; padding: 12px 16px;
      background: #fff3e0; border: 1px solid #ff9800; border-radius: 10px;
      color: #e65100; font-size: 13px;
    }
    .error-banner.error { background: #ffebee; border-color: #f44336; color: #c62828; }
    .error-banner code { background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 12px; }

    /* ===== Header ===== */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px; padding: 14px 20px;
      background: linear-gradient(135deg, rgba(var(--rgb-primary-color, 3,169,244), 0.08) 0%, rgba(var(--rgb-primary-color, 3,169,244), 0.03) 100%);
      border-radius: 16px; border: 1px solid var(--divider-color, #e0e0e0);
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .header-icon {
      width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
      background: var(--primary-color, #03a9f4); border-radius: 12px; color: #fff;
      font-size: 22px; font-weight: 700;
    }
    .title-group h1 { font-size: 19px; font-weight: 700; color: var(--primary-text-color, #212121); margin: 0; }
    .title-group p { font-size: 12px; color: var(--secondary-text-color, #727272); margin: 4px 0 0; }
    .header-right { display: flex; gap: 24px; flex-wrap: wrap; }
    .stat { text-align: center; cursor: pointer; }
    .stat:hover .stat-num { opacity: 0.8; }
    .stat-num { font-size: 20px; font-weight: 700; color: var(--primary-color, #03a9f4); transition: opacity 0.15s; }
    .stat-label { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; text-transform: uppercase; }

    /* ===== Sticky Tabs ===== */
    .sticky-header {
      position: sticky; top: 0; z-index: 100;
      background: var(--primary-background-color, #f5f5f5);
      margin: 0 -16px 12px; padding: 0 16px 12px;
      padding-top: env(safe-area-inset-top, 0px);
    }
    .tabs-wrapper { position: relative; }
    .tabs {
      display: flex; gap: 6px; overflow-x: auto;
      padding-bottom: 4px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      -webkit-overflow-scrolling: touch;
    }
    .tabs::-webkit-scrollbar { display: none; }
    /* Mobile scroll hint - gradient fade on right */
    .tabs-wrapper::after {
      content: ''; position: absolute; right: 0; top: 0; bottom: 4px; width: 30px;
      background: linear-gradient(to right, transparent, var(--primary-background-color, #f5f5f5));
      pointer-events: none; opacity: 0; transition: opacity 0.3s;
    }
    .tabs-wrapper.scrollable::after { opacity: 1; }
    .tab {
      padding: 10px 18px; border-radius: 10px 10px 0 0;
      background: transparent; border: none;
      color: var(--secondary-text-color, #727272); cursor: pointer;
      font-size: 13px; font-weight: 500; transition: all 0.2s;
      white-space: nowrap; position: relative;
      touch-action: manipulation;
    }
    .tab:hover { color: var(--primary-color, #03a9f4); background: rgba(var(--rgb-primary-color, 3,169,244), 0.05); }
    .tab.active { color: var(--primary-color, #03a9f4); font-weight: 600; }
    .tab.active::after {
      content: ''; position: absolute; bottom: -1px; left: 10px; right: 10px;
      height: 2px; background: var(--primary-color, #03a9f4); border-radius: 2px;
    }
    .tab .badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 18px; height: 18px; padding: 0 5px;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 9px; font-size: 10px; font-weight: 600;
      margin-left: 6px; vertical-align: middle;
    }

    /* ===== Content with transition ===== */
    .content {
      transition: opacity 0.15s ease;
    }
    .content.transitioning { opacity: 0; }

    /* ===== Loading ===== */
    .loading { text-align: center; padding: 60px 20px; color: var(--secondary-text-color, #727272); }
    .spinner {
      width: 40px; height: 40px; border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4); border-radius: 50%;
      animation: spin 1s linear infinite; margin: 0 auto 16px;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* ===== Network Banner (F2) ===== */
    .network-banner {
      margin-bottom: 12px; padding: 12px 16px;
      border-radius: 10px; font-size: 13px; text-align: center;
      animation: slideDown 0.3s ease;
    }
    .network-banner.offline { background: #ffebee; border: 1px solid #f44336; color: #c62828; }
    .network-banner.warning { background: #fff3e0; border: 1px solid #ff9800; color: #e65100; }
    @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* ===== Toast Queue ===== */
    .toast-container {
      position: fixed;
      bottom: calc(30px + env(safe-area-inset-bottom, 0px));
      left: 50%; transform: translateX(-50%);
      z-index: 10000; display: flex; flex-direction: column-reverse; gap: 8px;
      pointer-events: none; max-width: calc(100vw - 32px);
    }
    .toast {
      background: var(--primary-color, #03a9f4); color: #fff;
      padding: 14px 26px; border-radius: 12px; font-size: 14px; font-weight: 500;
      opacity: 0; transform: translateY(20px);
      transition: all 0.35s; text-align: center;
      pointer-events: auto;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.success { background: #4caf50; }
    .toast.error { background: #f44336; }

    /* ===== Utility icons ===== */
    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .update-badge { background: var(--warning-color, #ff9800); color: #fff; padding: 1px 6px; border-radius: 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 2px; }

    /* ===== Detail Modal ===== */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 16px; width: 100%; max-width: 720px;
      max-height: 90vh; min-width: 360px; min-height: 300px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.25s ease;
      position: relative; overflow: hidden;
      resize: both;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* Resize handle indicator */
    .modal::after {
      content: ''; position: absolute; bottom: 4px; right: 4px;
      width: 14px; height: 14px; pointer-events: none; opacity: 0.3;
      border-right: 2px solid var(--secondary-text-color, #727272);
      border-bottom: 2px solid var(--secondary-text-color, #727272);
    }

    /* Expanded (double-click zoom) */
    .modal.expanded {
      max-width: 95vw; max-height: 95vh;
      width: 95vw; height: 95vh;
      transition: all 0.3s ease;
    }
    .modal:not(.expanded) {
      transition: all 0.3s ease;
    }

    /* Double-click hint */
    .modal-expand-hint {
      position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
      font-size: 10px; color: var(--secondary-text-color, #727272);
      opacity: 0.5; pointer-events: none;
    }

    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0; flex-shrink: 0;
    }
    .modal-title { font-size: 18px; font-weight: 700; color: var(--primary-text-color); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .modal-close {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #727272); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: all 0.2s; flex-shrink: 0; margin-left: 12px;
      touch-action: manipulation;
    }
    .modal-close:hover { background: var(--divider-color, #e0e0e0); }

    .modal-body { padding: 16px 24px 24px; overflow-y: auto; flex: 1; }

    .detail-category {
      display: inline-block; padding: 4px 12px; border-radius: 6px;
      font-size: 11px; font-weight: 600; color: #fff; text-transform: uppercase;
      margin-bottom: 12px;
    }

    .detail-desc {
      font-size: 14px; color: var(--secondary-text-color); line-height: 1.6;
      margin-bottom: 16px;
    }

    .detail-authors {
      font-size: 12px; color: var(--secondary-text-color); margin-bottom: 12px;
    }
    .detail-authors svg { width: 14px; height: 14px; vertical-align: -2px; margin-right: 4px; }
    .detail-author-link { color: var(--primary-color); text-decoration: none; margin-right: 8px; }
    .detail-author-link:hover { text-decoration: underline; }

    .detail-topics {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
    }
    .detail-topic-tag {
      display: inline-block; padding: 2px 10px; border-radius: 4px;
      font-size: 11px; background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }

    .detail-stats {
      display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;
    }
    .detail-stat {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--secondary-text-color);
    }
    .detail-stat svg { width: 16px; height: 16px; }
    .detail-stat .val { font-weight: 600; color: var(--primary-text-color); }

    .detail-version {
      padding: 12px 16px; background: var(--secondary-background-color, #f0f0f0);
      border-radius: 10px; margin-bottom: 16px;
    }
    .detail-version-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-version-label { font-size: 12px; color: var(--secondary-text-color); }
    .detail-version-value { font-size: 14px; font-weight: 600; color: var(--primary-text-color); }

    /* Version Selector */
    .version-selector {
      margin-bottom: 16px; border: 1px solid var(--divider-color);
      border-radius: 10px; overflow: hidden;
    }
    .version-selector-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; cursor: pointer; background: var(--secondary-background-color, #f0f0f0);
      font-size: 13px; font-weight: 600; color: var(--primary-text-color);
      touch-action: manipulation;
    }
    .version-selector-header:hover { background: var(--divider-color, #e0e0e0); }
    .version-selector-arrow { transition: transform 0.2s; font-size: 10px; }
    .version-selector-arrow.open { transform: rotate(180deg); }
    .version-selector-body {
      max-height: 300px; overflow-y: auto; border-top: 1px solid var(--divider-color);
    }
    .release-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-bottom: 1px solid var(--divider-color);
      font-size: 13px; transition: background 0.15s;
    }
    .release-item:last-child { border-bottom: none; }
    .release-item:hover { background: var(--secondary-background-color); }
    .release-info { flex: 1; min-width: 0; }
    .release-tag { font-weight: 600; color: var(--primary-text-color); display: flex; align-items: center; gap: 6px; }
    .release-tag .prerelease-badge {
      font-size: 9px; padding: 2px 6px; border-radius: 4px;
      background: #ff9800; color: #fff; font-weight: 600;
    }
    .release-date { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
    .release-install-btn {
      padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600;
      border: 1px solid var(--primary-color); background: transparent;
      color: var(--primary-color); cursor: pointer; transition: all 0.2s;
      touch-action: manipulation; flex-shrink: 0;
    }
    .release-install-btn:hover { background: var(--primary-color); color: #fff; }
    .release-install-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .releases-loading { text-align: center; padding: 16px; color: var(--secondary-text-color); font-size: 13px; }
    .releases-empty { text-align: center; padding: 16px; color: var(--secondary-text-color); font-size: 13px; font-style: italic; }

    .modal-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .modal-btn {
      padding: 10px 18px; border-radius: 10px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
      touch-action: manipulation;
    }
    .modal-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .modal-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .modal-btn.primary:hover { opacity: 0.9; }
    .modal-btn.danger { color: #f44336; border-color: #f44336; }
    .modal-btn.danger:hover { background: #f44336; color: #fff; }
    .modal-btn svg { width: 16px; height: 16px; }

    /* ===== Detail README — single scroll (no double scroll) ===== */
    .detail-changelog {
      margin-bottom: 16px; padding: 14px 16px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 10px; border-left: 3px solid var(--success-color, #0f9d58);
    }
    .detail-changelog-title {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color); margin-bottom: 10px;
    }
    .changelog-body {
      font-size: 13px; color: var(--primary-text-color);
      line-height: 1.6; white-space: pre-wrap;
      max-height: 200px; overflow-y: auto;
    }
    .changelog-tag {
      font-size: 11px; color: var(--secondary-text-color);
      margin-top: 8px;
    }
    .changelog-link {
      display: inline-block; margin-top: 8px;
      font-size: 12px; color: var(--primary-color);
      text-decoration: none;
    }
    .changelog-link:hover { text-decoration: underline; }
    .changelog-empty {
      font-size: 13px; color: var(--secondary-text-color);
      font-style: italic;
    }

    .detail-readme {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding-top: 16px;
    }
    .detail-readme-title {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color); margin-bottom: 12px;
    }
    .readme-content {
      font-size: 13px; line-height: 1.6;
      color: var(--primary-text-color); padding-right: 8px;
    }
    .readme-content img { max-width: 100%; height: auto; }
    .readme-content pre {
      background: var(--secondary-background-color, #f5f5f5);
      padding: 12px; border-radius: 8px;
      overflow-x: auto; font-size: 12px;
    }
    .readme-content code {
      background: var(--secondary-background-color, #f5f5f5);
      padding: 2px 6px; border-radius: 4px; font-size: 12px;
    }
    .readme-content h1, .readme-content h2, .readme-content h3 {
      margin-top: 16px; margin-bottom: 8px;
    }
    .readme-content table { border-collapse: collapse; width: 100%; }
    .readme-content th, .readme-content td {
      border: 1px solid var(--divider-color); padding: 8px; text-align: left;
    }
    .readme-loading {
      text-align: center; padding: 20px;
      color: var(--secondary-text-color);
    }
    .readme-error {
      text-align: center; padding: 20px;
      color: var(--secondary-text-color); font-style: italic;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .store { padding: 8px 10px; padding-top: calc(8px + env(safe-area-inset-top, 0px)); padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); }
      .header {
        flex-direction: row; align-items: center; justify-content: space-between;
        padding: 8px 12px; margin-bottom: 8px; border-radius: 12px;
      }
      .header-left { gap: 6px; align-items: center; }
      .header-icon { width: 28px; height: 28px; font-size: 14px; border-radius: 8px; flex-shrink: 0; }
      .title-group h1 { font-size: 14px; text-align: left; }
      .title-group p { display: none; }
      .header-right { gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
      .stat { text-align: center; min-width: 32px; }
      .stat-num { font-size: 12px; }
      .stat-label { font-size: 8px; }
      .sticky-header { margin: 0 -10px 8px; padding: 0 10px 8px; }
      .tab { padding: 8px 12px; font-size: 12px; min-height: 44px; display: flex; align-items: center; }

      /* Mobile modal: fullscreen */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal {
        max-width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0;
        resize: none;
      }
      .modal::after { display: none; }
      .modal-header { padding: 16px 16px 0; }
      .modal-body { padding: 12px 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
      .modal-actions { flex-direction: column; }
      .modal-btn { width: 100%; justify-content: center; min-height: 44px; }
      .version-selector-body { max-height: 200px; }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this.addEventListener('refresh-stats', () => this._loadStats());
    this.addEventListener('detail', (e) => this._openDetail(e.detail.repo));
    this.addEventListener('favorite', () => this._loadStats());
    // F1: Keyboard shortcuts
    this._keydownHandler = (e) => {
      if (e.key === 'Escape' && this._showDetail) {
        e.preventDefault();
        this._closeDetail();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = this.renderRoot?.querySelector('.search input');
        if (searchInput) { searchInput.focus(); searchInput.select(); }
        return;
      }
      if (!this._showDetail && document.activeElement?.tagName !== 'INPUT'
          && document.activeElement?.tagName !== 'SELECT'
          && document.activeElement?.tagName !== 'TEXTAREA') {
        const views = ['browse', 'updates', 'management'];
        const num = parseInt(e.key);
        if (num >= 1 && num <= views.length) {
          e.preventDefault();
          this.switchView(views[num - 1]);
        }
      }
    };
    window.addEventListener('keydown', this._keydownHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._keydownHandler);
  }

  async _loadStats() {
    try {
      this._error = '';
      this.stats = await api.getStats();
      // Also update favorite count from server
      const favResult = await api.getFavorites();
      const favs = Array.isArray(favResult) ? favResult : (favResult.favorites || []);
      this._favoriteCount = favs.length;
    } catch(e) {
      console.error('Stats error:', e);
      this.stats = {};
      this._error = `API: ${e.message}`;
    }
  }

  switchView(view) {
    if (this.currentView === view) return;
    // Tab transition animation
    this._viewTransition = true;
    this.currentView = view;
    this.dispatchEvent(new CustomEvent('view-changed', {
      detail: { view },
      bubbles: true, composed: true,
    }));
    setTimeout(() => { this._viewTransition = false; }, 150);
  }

  _openDetail(repo) {
    this._detailRepo = repo;
    this._showDetail = true;
    this._readmeHtml = null;
    this._readmeLoading = true;
    this._showVersionSelector = false;
    this._releases = [];
    this._releasesLoading = false;
    this._changelogData = null;
    this._changelogLoading = true;
    this._loadReadme(repo);
    this._loadChangelog(repo);
  }

  async _loadReadme(repo) {
    if (!repo?.full_name) {
      this._readmeLoading = false;
      return;
    }
    try {
      const rawHtml = await api.getReadme(repo.full_name);
      // P0: Sanitize README HTML with DOMPurify to prevent XSS
      this._readmeHtml = rawHtml ? DOMPurify.sanitize(rawHtml) : null;
    } catch(e) {
      this._readmeHtml = null;
    }
    this._readmeLoading = false;
  }

  async _loadChangelog(repo) {
    if (!repo?.full_name) {
      this._changelogLoading = false;
      return;
    }
    try {
      const data = await api.getChangelog(repo.full_name);
      this._changelogData = data?.body ? data : null;
    } catch(e) {
      this._changelogData = null;
    }
    this._changelogLoading = false;
  }

  _applyFilter(filter) {
    this._presetFilter = filter;
    this.switchView('browse');
    // Reset after applying so re-clicking same stat re-applies
    setTimeout(() => { this._presetFilter = ''; }, 100);
  }

  _closeDetail() {
    this._showDetail = false;
    this._detailRepo = null;
    this._readmeHtml = null;
    this._readmeLoading = false;
    this._detailExpanded = false;
    this._showVersionSelector = false;
    this._releases = [];
    this._releasesLoading = false;
  }

  _toggleDetailExpand() {
    this._detailExpanded = !this._detailExpanded;
  }

  async _toggleVersionSelector() {
    this._showVersionSelector = !this._showVersionSelector;
    if (this._showVersionSelector && this._releases.length === 0) {
      this._releasesLoading = true;
      try {
        const repoId = this._detailRepo?.id || this._detailRepo?.full_name;
        if (repoId) {
          const result = await api.getRepoReleases(repoId);
          this._releases = Array.isArray(result) ? result : (result.releases || []);
        }
      } catch(e) {
        console.error('Failed to load releases:', e);
        this._releases = [];
      }
      this._releasesLoading = false;
    }
  }

  async _installVersion(version) {
    const repoId = this._detailRepo?.id || this._detailRepo?.full_name;
    if (!repoId || !version) return;
    this._installingVersion = true;
    try {
      await api.installVersion(repoId, version);
      showToast(`${t('installComplete')}: ${version}`, 'success');
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      this._closeDetail();
    } catch(e) {
      showToast(`${t('installFailed')}: ${e.message}`, 'error');
    }
    this._installingVersion = false;
  }

  _getCategoryLabel(category) {
    const labels = {
      integration: t('catIntegration'), plugin: t('catPlugin'), theme: t('catTheme'),
      appdaemon: t('catAppDaemon'), netdaemon: t('catNetDaemon'),
      python_script: t('catPython'), template: t('catTemplate'),
    };
    return labels[category] || category;
  }

  async _modalAction(action) {
    const repo = this._detailRepo;
    if (!repo) return;
    try {
      if (action === 'install') {
        await api.install(repo.id || repo.full_name, repo.category);
        showToast(t('installComplete'), 'success');
      } else if (action === 'update') {
        await api.update([repo.id || repo.full_name]);
        showToast(t('updateStarted'), 'success');
      } else if (action === 'uninstall') {
        const { ConfirmDialog } = await import('./shared/confirm-dialog.js');
        const ok = await ConfirmDialog.show(this, {
          message: `${t('confirmRemove')} ${repo.full_name || repo.name}?`,
          confirmText: t('remove'),
          danger: true,
        });
        if (!ok) return;
        await api.remove(repo.id || repo.full_name);
        showToast(t('removed'), 'success');
      } else if (action === 'github') {
        const url = repo.html_url || `https://github.com/${repo.full_name}`;
        window.open(url, '_blank');
        return;
      }
      this.dispatchEvent(new CustomEvent('refresh-stats', { bubbles: true, composed: true }));
      this._closeDetail();
    } catch(e) {
      showToast(`${t('updateFailed')}: ${e.message}`, 'error');
    }
  }

  _checkTabsScrollable() {
    const wrapper = this.renderRoot?.querySelector('.tabs-wrapper');
    const tabs = wrapper?.querySelector('.tabs');
    if (wrapper && tabs) {
      wrapper.classList.toggle('scrollable', tabs.scrollWidth > tabs.clientWidth);
    }
  }

  async updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('narrow')) {
      requestAnimationFrame(() => this._checkTabsScrollable());
    }
  }

  firstUpdated() {
    requestAnimationFrame(() => this._checkTabsScrollable());
  }

  render() {
    const tabs = [
      { view: 'browse', label: t('tabBrowse'), icon: '', count: null },
      { view: 'updates', label: t('tabUpdates'), icon: '', count: null },
      { view: 'management', label: t('tabManagement'), icon: '', count: null },
    ];

    const r = this._detailRepo;
    const isInstalled = r?.installed || false;
    const isUpdateAvailable = isInstalled && (
      r?.has_update ||
      (r?.installed_version && r?.latest_version && r.installed_version !== r.latest_version)
    );
    const categoryColor = r ? getCategoryColor(r.category) : '#03a9f4';

    return html`
      <div class="store">
        ${this._error ? html`
          <div class="error-banner error">
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${t('connectFailed')}: <code>${this._error}</code>
          </div>
        ` : ''}
        ${!this._apiReady ? html`
          <div class="error-banner">
            ${t('waitingHA')}
          </div>
        ` : ''}

        ${this._networkStatus === 'offline' ? html`
          <div class="network-banner offline">${t('networkOffline')}</div>
        ` : this._networkStatus === 'rate_limited' ? html`
          <div class="network-banner warning">${t('rateLimited')}</div>
        ` : this._networkStatus === 'server_error' ? html`
          <div class="network-banner warning">${t('haRestarting')}</div>
        ` : ''}

        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="header-icon">H</div>
            <div class="title-group">
              <h1>HACS Vision</h1>
              <p>${t('storeSubtitle')}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="stat" @click=${() => this._applyFilter('installed')}>
              <div class="stat-num">${this.stats.total_installed ?? 0}</div>
              <div class="stat-label">${t('statInstalled')}</div>
            </div>
            <div class="stat" @click=${() => this._applyFilter('update_available')}>
              <div class="stat-num">${this.stats.available_updates ?? 0}</div>
              <div class="stat-label">${t('statUpdates')}</div>
            </div>
            ${(this.stats.pending_restart ?? 0) > 0 ? html`
            <div class="stat" style="color:#f44336;" @click=${() => this._applyFilter('pending_restart')}>
              <div class="stat-num">${this.stats.pending_restart}</div>
              <div class="stat-label">${t('statusPendingRestart')}</div>
            </div>
            ` : ''}
            <div class="stat" @click=${() => this._applyFilter('favorites')}>
              <div class="stat-num">${this._favoriteCount ?? 0}</div>
              <div class="stat-label">${t('statFavorites') || '收藏'}</div>
            </div>
            <div class="stat" @click=${() => this._applyFilter('custom')}>
              <div class="stat-num">${this.stats.custom_count ?? 0}</div>
              <div class="stat-label">${t('statCustom') || '自定义'}</div>
            </div>
            <div class="stat" @click=${() => this._applyFilter('')}>
              <div class="stat-num">${this.stats.total_repos ?? 0}</div>
              <div class="stat-label">${t('statRepos')}</div>
            </div>
          </div>
        </div>

        <!-- Sticky Tabs -->
        <div class="sticky-header">
          <div class="tabs-wrapper">
            <div class="tabs">
              ${tabs.map(tab => html`
                <button class="tab ${this.currentView === tab.view ? 'active' : ''}"
                        @click=${() => this.switchView(tab.view)}>
                  ${tab.icon ? html`${tab.icon} ` : ''}${tab.label}
                  ${tab.count !== undefined && tab.count !== null ? html`<span class="badge">${tab.count}</span>` : ''}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Content with fade transition -->
        <div class="content ${this._viewTransition ? 'transitioning' : ''}">
          ${this.currentView === 'browse' ? html`<browse-view .hass=${this.hass} .presetFilter=${this._presetFilter}></browse-view>` : ''}
          ${this.currentView === 'updates' ? html`<updates-view .hass=${this.hass}></updates-view>` : ''}
          ${this.currentView === 'management' ? html`<management-view .hass=${this.hass}></management-view>` : ''}
        </div>
      </div>

      <!-- Detail Modal -->
      ${this._showDetail && r ? html`
        <div class="modal-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._closeDetail(); }}>
          <div class="modal ${this._detailExpanded ? 'expanded' : ''}" @dblclick=${this._toggleDetailExpand}>
            ${!this._detailExpanded ? html`<div class="modal-expand-hint">${t('dblZoomHint') || '双击放大'}</div>` : ''}
            <div class="modal-header">
              <div class="modal-title">${r.manifest_name || r.repository_manifest?.name || r.full_name || r.name || 'unknown'}</div>
              <button class="modal-close" @click=${this._closeDetail}>✕</button>
            </div>
            <div class="modal-body">
              <div class="detail-category" style="background: ${categoryColor}">
                ${this._getCategoryLabel(r.category || 'integration')}
              </div>

              <div class="detail-desc">${r.description || t('noDesc')}</div>

              ${r.authors && r.authors.length ? html`
                <div class="detail-authors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
<<<<<<< HEAD
                  ${r.authors.filter(a => a && a !== '@user').map(a => html`
                    <a class="detail-author-link" href="https://github.com/${a.replace(/^@/, '')}" target="_blank" rel="noopener">@${a.replace(/^@/, '')}</a>
=======
                  ${r.authors.map(a => html`
                    <a class="detail-author-link" href="https://github.com/${a}" target="_blank" rel="noopener">@${a}</a>
>>>>>>> origin/main
                  `)}
                </div>
              ` : ''}

              <div class="detail-stats">
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="#ff9800"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
                  <span class="val">${(r.stars || r.stargazers_count || 0).toLocaleString()}</span> ${t('stars')}
                </div>
                ${r.downloads ? html`
                  <div class="detail-stat">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                    <span class="val">${r.downloads.toLocaleString()}</span> ${t('downloads')}
                  </div>
                ` : ''}
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  <span class="val">${r.full_name || r.name || ''}</span>
                </div>
              </div>

              ${r.topics && r.topics.length ? html`
                <div class="detail-topics">
                  ${r.topics.map(topic => html`
                    <span class="detail-topic-tag">${topic}</span>
                  `)}
                </div>
              ` : ''}

              ${isInstalled ? html`
                <div class="detail-version">
                  <div class="detail-version-row">
                    <span class="detail-version-label">${t('currentVersion')}</span>
                    <span class="detail-version-value">${r.installed_version || t('unknown')}</span>
                  </div>
                  ${isUpdateAvailable ? html`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${t('availableVersion')}</span>
                      <span class="detail-version-value" style="color:var(--success-color, #0f9d58);">${r.latest_version || t('unknown')}</span>
                    </div>
                  ` : ''}
                  ${r.installed_at ? html`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${t('installedAt')}</span>
                      <span class="detail-version-value">${new Date(r.installed_at).toLocaleString()}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Version Selector -->
              <div class="version-selector">
                <div class="version-selector-header" @click=${this._toggleVersionSelector}>
                  ${t('selectVersion')}
                  <span class="version-selector-arrow ${this._showVersionSelector ? 'open' : ''}">▼</span>
                </div>
                ${this._showVersionSelector ? html`
                  <div class="version-selector-body">
                    ${this._releasesLoading ? html`
                      <div class="releases-loading">
                        <div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto 8px;"></div>
                        ${t('loading')}
                      </div>
                    ` : this._releases.length === 0 ? html`
                      <div class="releases-empty">${t('noReleases')}</div>
                    ` : this._releases.map(release => html`
                      <div class="release-item">
                        <div class="release-info">
                          <div class="release-tag">
                            ${release.tag_name || release.tag || '?'}
                            ${release.prerelease ? html`<span class="prerelease-badge">${t('prerelease')}</span>` : ''}
                          </div>
                          ${release.published_at || release.created_at ? html`
                            <div class="release-date">${t('publishedAt')} ${new Date(release.published_at || release.created_at).toLocaleDateString()}</div>
                          ` : ''}
                        </div>
                        <button class="release-install-btn"
                                @click=${() => this._installVersion(release.tag_name || release.tag)}
                                ?disabled=${this._installingVersion}>
                          ${t('installVersion')}
                        </button>
                      </div>
                    `)}
                  </div>
                ` : ''}
              </div>

              <!-- Changelog (What's New) — shown when update is available -->
              ${isUpdateAvailable ? html`
                <div class="detail-changelog">
                  <div class="detail-changelog-title">${t('changelogTitle') || '更新内容'}</div>
                  ${this._changelogLoading ? html`
                    <div class="readme-loading">
                      <div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto 8px;"></div>
                      ${t('loading') || '加载中...'}
                    </div>
                  ` : this._changelogData ? html`
                    <div class="changelog-body">${this._changelogData.body}</div>
                    ${this._changelogData.tag ? html`
                      <div class="changelog-tag">${this._changelogData.tag}</div>
                    ` : ''}
                    ${this._changelogData.url ? html`
                      <a class="changelog-link" href="${this._changelogData.url}" target="_blank" rel="noopener">${t('viewFullChangelog') || '查看完整更新日志'} →</a>
                    ` : ''}
                  ` : html`
                    <div class="changelog-empty">${t('noChangelog') || '暂无更新日志'}</div>
                  `}
                </div>
              ` : ''}

              <div class="modal-actions">
                ${isInstalled ? html`
                  ${isUpdateAvailable ? html`
                    <button class="modal-btn primary" @click=${() => this._modalAction('update')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                      ${t('update')}
                    </button>
                  ` : ''}
                  <button class="modal-btn danger" @click=${() => this._modalAction('uninstall')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    ${t('remove')}
                  </button>
                ` : html`
                  <button class="modal-btn primary" @click=${() => this._modalAction('install')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${t('install')}
                  </button>
                `}
                <button class="modal-btn" @click=${() => this._modalAction('github')}>
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  ${t('openGithub')}
                </button>
              </div>

              <!-- README Section — no max-height, single scroll via modal-body -->
              <div class="detail-readme">
                <div class="detail-readme-title">${t('readmeTitle')}</div>
                ${this._readmeLoading ? html`
                  <div class="readme-loading">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;margin:0 auto 8px;"></div>
                    ${t('loadingReadme')}
                  </div>
                ` : this._readmeHtml ? html`
                  <div class="readme-content" .innerHTML=${this._readmeHtml}></div>
                ` : html`
                  <div class="readme-error">${t('readmeLoadFailed')}</div>
                `}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Toast container (supports queue) -->
      <div class="toast-container" id="toast-container"></div>
    `;
  }
}

// Global toast helper with queue support
let _panelRef = null;
export function registerPanel(panel) { _panelRef = panel; }

const _toastQueue = [];
let _toastShowing = false;

export function showToast(msg, type = 'info') {
  const panel = _panelRef || document.querySelector('hacs-vision-panel');
  const container = panel?.shadowRoot?.querySelector('#toast-container');
  if (!container) { console.warn('Toast container not found:', msg); return; }

  _toastQueue.push({ msg, type });
  if (!_toastShowing) _showNextToast(container);
}

function _showNextToast(container) {
  if (_toastQueue.length === 0) { _toastShowing = false; return; }
  _toastShowing = true;
  const { msg, type } = _toastQueue.shift();

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type) toast.classList.add(type);
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
      _showNextToast(container);
    }, 350);
  }, 3000);
}
