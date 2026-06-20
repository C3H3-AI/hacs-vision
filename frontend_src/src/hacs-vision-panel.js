import { LitElement, html, css } from 'lit';
import { api } from './api.js';
import { themeMixin } from './theme.js';
import { t, setLangFromHass } from './i18n.js';
import { getCategoryColor } from './shared/constants.js';
import { getCommonStyles } from './shared/styles.js';
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
    _presetTag: { type: String, state: true },
    _releaseTab: { type: Number, state: true },
    // Config Flow
    _configFlowDomain: { type: String, state: true },
    _configFlowEntryId: { type: String, state: true },
    _configFlowSubentryType: { type: String, state: true },
    _configFlowIsReconfigure: { type: Boolean, state: true },
    _configFlowAction: { type: String, state: true },
    _showConfigFlow: { type: Boolean, state: true },
    _configEntries: { type: Object, state: true },
    // Entry selector (multiple entries for same domain)
    _showEntrySelector: { type: Boolean, state: true },
    _entrySelectorDomain: { type: String, state: true },
    _entrySelectorEntries: { type: Array, state: true },
    _entrySelectorCurrentId: { type: String, state: true },
  };

  constructor() {
    super();
    this.currentView = (() => { try { return localStorage.getItem('hacs_vision_tab'); } catch { return null; } })() || 'browse';
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
    this._presetTag = '';
    this._releaseTab = 0;
    this._configFlowDomain = '';
    this._configFlowEntryId = null;
    this._showConfigFlow = false;
    this._configEntries = {};
    this._showEntrySelector = false;
    this._entrySelectorDomain = '';
    this._entrySelectorEntries = [];
    this._entrySelectorCurrentId = null;
    registerPanel(this);
    this._resizeHandler = () => { this.narrow = window.innerWidth < 768; };
    window.addEventListener('resize', this._resizeHandler);
    // F2: Network status listeners
    this._onlineHandler = () => { this._networkStatus = 'online'; };
    this._offlineHandler = () => { this._networkStatus = 'offline'; };
    window.addEventListener('online', this._onlineHandler);
    window.addEventListener('offline', this._offlineHandler);
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
      setLangFromHass(this.hass);
      api.setHass(this.hass);
      if (!this._apiReady) {
        this._apiReady = true;
        // Set page title on first load
        this._updatePageTitle(this.currentView);
        // Parallel init: stats (includes favorites) + config entries
        Promise.all([this._loadStats(), this._loadConfigEntries()]).catch(e => console.error('Init error:', e));
        // F2: Register network status callback once
        api._onNetworkStatus = (status) => { this._networkStatus = status; };
      }
    }
  }

  static styles = [getCommonStyles(), css`
    :host {
      display: block;
      --fs-xs: 10px;
      --fs-sm: 11px;
      --fs-md: 12px;
      --fs-body: 13px;
      --fs-lg: 14px;
      --fs-xl: 16px;
    }

    /* ===== Typography Normalization ===== */
    .store { --fs: var(--fs-body); }

    .store {
      padding: 0 16px 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      min-height: 100vh;
      background: var(--primary-background-color, #f5f5f5);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
      display: flex; flex-direction: column;
    }
    .store-content {
      flex: 1; overflow-y: auto; min-height: 0;
      padding-top: 12px;
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
    .sidebar-toggle {
      display: none; align-items: center; justify-content: center;
      width: 36px; height: 36px; border: none; background: transparent;
      color: var(--primary-text-color); cursor: pointer; border-radius: 8px;
      flex-shrink: 0; touch-action: manipulation;
    }
    .sidebar-toggle:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.1); }
    @media (max-width: 768px) { .sidebar-toggle { display: flex; } }
    .title-group h1 { font-size: 19px; font-weight: 700; color: var(--primary-text-color, #212121); margin: 0; }
    .title-group p { font-size: 12px; color: var(--secondary-text-color, #727272); margin: 4px 0 0; }
    .header-right { display: flex; gap: 24px; flex-wrap: wrap; }
    .stat { text-align: center; cursor: pointer; }
    .stat:hover .stat-num { opacity: 0.8; }
    .stat-num { font-size: 20px; font-weight: 700; color: var(--primary-color, #03a9f4); transition: opacity 0.15s; }
    .restart-btn {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 12px; border: 1px solid #f44336; border-radius: 4px;
      background: rgba(244,67,54,0.1); color: #f44336;
      line-height: 1.3; white-space: nowrap; cursor: pointer; font-size: 12px; font-weight: 600;
      transition: background 0.15s;
    }
    .restart-btn:hover { background: rgba(244,67,54,0.25); }
    .restart-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

    /* ===== Restart Bar (between header and content) ===== */
    .restart-bar {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 10px 14px; margin: 0 0 6px;
      background: rgba(244,67,54,0.08); border: 1px solid rgba(244,67,54,0.25);
      border-radius: 10px; font-size: 13px;
    }
    .restart-bar span { font-weight: 600; color: #f44336; flex: 1; }
    .restart-bar-btn {
      padding: 6px 14px; border: none; border-radius: 8px;
      font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;
      background: #f44336; color: #fff; transition: opacity 0.15s;
    }
    .restart-bar-btn:hover { opacity: 0.85; }
    .restart-bar-btn.outline { background: transparent; border: 1px solid #f44336; color: #f44336; }
    .restart-bar-btn.outline:hover { background: rgba(244,67,54,0.1); }
    .restart-bar svg { flex-shrink: 0; }
    .stat-label { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; text-transform: uppercase; }

    /* ===== Sticky Tabs ===== */
    .sticky-header {
      position: sticky; top: 0; z-index: 100;
      background: var(--primary-background-color, #f5f5f5);
      margin: 0 -16px 12px; padding: 0 16px 12px;
      padding-top: 12px;
    }
    .store-content {
      flex: 1; overflow-y: auto; min-height: 0;
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
      transition: opacity 0.12s ease;
      position: relative;
    }
    .content.transitioning { opacity: 0; }
    /* Smooth view transitions: hidden views are invisible but stay rendered */
    .content > [hidden] {
      display: none !important;
    }

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
    .toast.success { background: var(--success-color, #4caf50); }
    .toast.error { background: var(--error-color, #f44336); }
    .toast.info { background: var(--primary-color, #03a9f4); }

    /* ===== Utility icons ===== */
    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .update-badge { background: var(--warning-color, #ff9800); color: #fff; padding: 1px 6px; border-radius: 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 2px; }

    .action-btn-sm {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 3px 10px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer;
      font-size: 11px; white-space: nowrap;
    }
    .action-btn-sm:hover { border-color: var(--primary-color); }

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
    .modal-expand-btn {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #727272); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: all 0.2s; flex-shrink: 0;
      touch-action: manipulation;
    }
    .modal-expand-btn:hover { background: var(--divider-color, #e0e0e0); }

    .modal-header-left {
      display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
    }
    .detail-avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; position: relative;
    }
    .detail-avatar-img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
    .detail-avatar-letter { font-size: 18px; font-weight: 700; color: #fff; z-index: 1; }    .modal-body { padding: 16px 24px 24px; overflow-y: auto; flex: 1; }

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

    .release-tabs {
      display: flex; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      margin: 0 -16px; padding: 0 16px; flex-shrink: 0;
    }
    .release-tab {
      padding: 8px 16px; font-size: 12px; font-weight: 600;
      cursor: pointer; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); transition: all 0.2s;
      user-select: none;
    }
    .release-tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .release-tab:hover { color: var(--primary-text-color); }

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

    .detail-action-btn {
      display: inline-block; padding: 6px 14px; border-radius: 6px;
      background: var(--primary-color); color: #fff;
      border: none; cursor: pointer; font-size: 12px; font-weight: 600;
      margin: 4px 4px 0 0;
    }
    .detail-action-btn:hover { opacity: 0.9; }

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
      .store { padding: 0 10px 8px; padding-top: calc(0px + env(safe-area-inset-top, 0px)); padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); }
      .header {
        flex-direction: row; align-items: center; justify-content: space-between;
        padding: 8px 12px; margin-bottom: 8px; border-radius: 12px;
      }
      .header-left { gap: 6px; align-items: center; }
      .header-icon { width: 28px; height: 28px; font-size: 14px; border-radius: 8px; flex-shrink: 0; }
      .title-group h1 { font-size: 14px; text-align: left; }
      .title-group p { display: none; }
      .restart-bar { font-size: 12px; padding: 8px 10px; }
      .restart-bar-btn { font-size: 11px; padding: 5px 10px; }
      .header-right { gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
      .stat { text-align: center; min-width: 32px; }
      .stat-num { font-size: 13px; }
      .stat-label { font-size: 10px; white-space: nowrap; }
      .restart-btn { font-size: 10px; padding: 2px 8px; }
      .restart-btn svg { width: 12px; height: 12px; }
      .sticky-header { margin: 0 -10px 8px; padding: 0 10px 8px; padding-top: 8px; }
      .tab { padding: 8px 12px; font-size: 12px; min-height: 44px; display: flex; align-items: center; }
      .controls-right { gap: 4px; }
      .controls .search { min-width: 80px; }
      .chip { font-size: 11px; padding: 5px 10px; }

      /* Mobile modal: fullscreen */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal {
        max-width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0;
        resize: none;
      }
      .modal::after { display: none; }
      .modal::before {
        content: ''; display: block; width: 36px; height: 4px;
        border-radius: 2px; background: var(--divider-color, #ccc);
        margin: 8px auto 0; flex-shrink: 0;
      }
      .modal-header { padding: 8px 16px 0; }
      .modal-body { padding: 12px 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
      .modal-actions { flex-direction: column; }
      .modal-btn { width: 100%; justify-content: center; min-height: 44px; }
      .version-selector-body { max-height: 200px; }
    }

    /* ===== Entry Selector ===== */
    .entry-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.15s ease;
    }
    .entry-dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px; padding: 24px;
      max-width: 400px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease;
      user-select: text;
      -webkit-user-select: text;
    }
    .entry-title { font-size: 17px; font-weight: 600; margin-bottom: 4px; color: var(--primary-text-color, #212121); }
    .entry-subtitle { font-size: 13px; color: var(--secondary-text-color, #727272); margin-bottom: 16px; }
    .entry-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .entry-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px; background: var(--card-background-color, #fff);
      cursor: pointer; transition: all 0.15s; text-align: left; width: 100%;
    }
    .entry-btn:hover { border-color: var(--primary-color, #03a9f4); background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .entry-btn-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.1);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 16px;
    }
    .entry-btn-text { display: flex; flex-direction: column; min-width: 0; }
    .entry-btn-title { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); }
    .entry-btn-domain { font-size: 12px; color: var(--secondary-text-color, #727272); }
    .entry-btn-current { font-size: 11px; color: var(--primary-color, #03a9f4); }
    .entry-cancel {
      display: block; width: 100%; text-align: center;
      padding: 10px; border: none; background: none;
      color: var(--secondary-text-color, #727272); font-size: 14px;
      cursor: pointer; border-radius: 10px;
    }
    .entry-cancel:hover { background: rgba(0,0,0,0.04); }
  `];

  async connectedCallback() {
    super.connectedCallback();
    this.addEventListener('refresh-stats', () => this._loadStats());
    this.addEventListener('detail', (e) => this._openDetail(e.detail.repo));
    this.addEventListener('favorite', () => this._loadStats());
    // Config flow events from child views
    this.addEventListener('open-flow', (e) => {
      const domain = e.detail?.domain;
      if (domain) this._openConfigFlow(domain);
    });
    this.addEventListener('open-options-flow', (e) => {
      const { entryId, domain } = e.detail || {};
      if (entryId) this._openOptionsFlow(entryId, domain);
    });
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
    };
    window.addEventListener('keydown', this._keydownHandler);
    // Check cache version only once per page visibility cycle
    if (!document.hidden) this._checkCacheVersion();
    this._visibilityHandler = () => {
      if (!document.hidden) this._checkCacheVersion();
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._statsRetryTimer) {
      clearTimeout(this._statsRetryTimer);
      this._statsRetryTimer = null;
    }
    this._clearFlowTimeout();
    window.removeEventListener('resize', this._resizeHandler);
    window.removeEventListener('online', this._onlineHandler);
    window.removeEventListener('offline', this._offlineHandler);
    window.removeEventListener('keydown', this._keydownHandler);
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
      this._visibilityHandler = null;
    }
  }

  async _loadStats() {
    try {
      this._error = '';
      this.stats = await api.getStats();
      // HA is back online — clear network error banners
      if (this._networkStatus === 'server_error') {
        this._networkStatus = 'online';
      }
      // Also update favorite count from server
      const favResult = await api.getFavorites();
      const favs = Array.isArray(favResult) ? favResult : (favResult.favorites || []);
      this._favoriteCount = favs.length;
    } catch(e) {
      console.error('Stats error:', e);
      this.stats = {};
      this._error = `API: ${e.message}`;
      // Retry loadStats with backoff when HA is restarting
      if (this._networkStatus === 'server_error' && !this._statsRetryTimer) {
        this._scheduleStatsRetry();
      }
    }
  }

  _scheduleStatsRetry() {
    this._statsRetryTimer = setTimeout(async () => {
      this._statsRetryTimer = null;
      try {
        this.stats = await api.getStats();
        if (this._networkStatus === 'server_error') {
          this._networkStatus = 'online';
        }
      } catch(e) {
        // Still down, retry again
        this._scheduleStatsRetry();
      }
    }, 5000);
  }

  async _checkCacheVersion() {
    try {
      const script = document.querySelector('script[src*="panel.js"]');
      if (!script) return;
      const url = new URL(script.src, location.href);
      const currentHash = url.searchParams.get('v');
      if (!currentHash) return;
      const resp = await fetch('./build.json?_t=' + Date.now());
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.hash && data.hash !== currentHash) {
        location.reload();
      }
    } catch(e) {
      console.warn('Cache check error:', e);
    }
  }

  async _restartHA() {
    const { ConfirmDialog } = await import('./shared/confirm-dialog.js');
    const ok = await ConfirmDialog.show(this, {
      message: t('restartConfirm'),
      confirmText: t('restartHA'),
      danger: true,
    });
    if (!ok) return;
    try {
      await api.restartHA();
      showToast(t('haRestarting'), 'info');
    } catch(e) {
      showToast(`${t('restartFailed')}: ${e.message}`, 'error');
    }
  }

  switchView(view) {
    if (this.currentView === view) return;
    // Tab transition animation
    this._viewTransition = true;
    this.currentView = view;
    try { localStorage.setItem('hacs_vision_tab', view); } catch(e) {}
    this.dispatchEvent(new CustomEvent('view-changed', {
      detail: { view },
      bubbles: true, composed: true,
    }));
    setTimeout(() => { this._viewTransition = false; }, 150);
    // Update page title for current view
    this._updatePageTitle(view);
  }

  _updatePageTitle(view) {
    const titles = {
      browse: t('tabBrowse') || '商店',
      integrations: t('tabIntegrations') || '集成管理',
      updates: t('tabUpdates') || '更新',
      management: t('tabManagement') || '管理',
      settings: t('tabSettings') || '设置',
    };
    document.title = `${titles[view] || view} · HACS Vision`;
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
    // Focus trap: install after render
    requestAnimationFrame(() => this._installFocusTrap());
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
    setTimeout(() => { this._presetFilter = ''; }, 100);
  }
  _applyTag(tag) {
    this._presetTag = tag;
    this.switchView('browse');
    setTimeout(() => { this._presetTag = ''; }, 100);
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
    this._removeFocusTrap();
  }

  /** Focus trap: keep Tab within modal */
  _installFocusTrap() {
    this._removeFocusTrap();
    const overlay = this.renderRoot?.querySelector('.modal-overlay');
    if (!overlay) return;
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !overlay.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !overlay.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Focus the close button initially
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    window.addEventListener('keydown', this._focusTrapHandler);
  }

  _removeFocusTrap() {
    if (this._focusTrapHandler) {
      window.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
  }

  /** Open a new config flow for a given integration domain */
  _openConfigFlow(domain) {
    this._configFlowDomain = domain;
    this._configFlowEntryId = null;
    this._showConfigFlow = true;
  }

  /** Open an options flow to reconfigure an existing config entry */
  _openOptionsFlow(entryId, domain) {
    // Keep domain for translation lookups (don't clear it)
    this._configFlowDomain = domain || '';
    this._configFlowEntryId = null;

    // Check for multiple entries for the same domain
    if (domain && this._configEntries && this._configEntries[domain] && this._configEntries[domain].length > 1) {
      this._entrySelectorDomain = domain;
      this._entrySelectorEntries = this._configEntries[domain];
      this._entrySelectorCurrentId = entryId;
      this._showEntrySelector = true;
      return;
    }

    this._configFlowEntryId = entryId;
    this._showConfigFlow = true;
  }

  _selectConfigEntry(entryId) {
    this._showEntrySelector = false;
    this._configFlowEntryId = entryId;
    // Try to resolve domain from selected entry
    if (this._configEntries) {
      for (const entries of Object.values(this._configEntries)) {
        const found = entries.find(e => e.entry_id === entryId);
        if (found) {
          this._configFlowDomain = found.domain || '';
          break;
        }
      }
    }
    this._showConfigFlow = true;
  }

  async _loadConfigEntries() {
    try {
      const resp = await api.getConfigEntries();
      // Convert to a map of domain -> entries for quick lookup
      const entries = resp?.entries || [];
      const map = {};
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          const d = entry.domain || entry.handler || '?';
          if (!map[d]) map[d] = [];
          map[d].push(entry);
        }
      }
      this._configEntries = map;
    } catch {
      this._configEntries = {};
    }
  }

  async _checkUpdates() {
    try {
      const result = await api.checkUpdatesWithNotify();
      if (result.success) {
        if (result.updates_found > 0) {
          showToast(t('updatesChecked', { n: result.updates_found }), 'success');
        } else {
          showToast(t('noUpdatesFound'), 'info');
        }
        if (result.notified) showToast(t('notifySent'), 'success');
        this._loadStats();
      }
    } catch(e) {
      showToast(`Update check failed: ${e.message}`, 'error');
    }
  }

  _onConfigureIntegration(e) {
    const { domain, entry_id, action } = e.detail;
    console.debug('HACS Vision: _onConfigureIntegration', domain, entry_id, 'action:', action);
    this._configFlowDomain = domain;
    this._configFlowEntryId = entry_id;
    this._configFlowAction = action || 'configure';
    // Reset + re-open to ensure Lit detects the change even if already open
    if (this._showConfigFlow) {
      this._showConfigFlow = false;
      this._configFlowEntryId = null;
    }
    this.requestUpdate();
    setTimeout(() => {
      this._configFlowDomain = domain;
      this._configFlowEntryId = entry_id;
      this._showConfigFlow = true;
      this._scheduleFlowTimeout();
    }, 10);
  }

  _onAddIntegration(e) {
    const { domain } = e.detail;
    this._configFlowDomain = domain;
    this._configFlowEntryId = null;
    this._showConfigFlow = true;
    this._scheduleFlowTimeout();
  }

  _scheduleFlowTimeout() {
    this._clearFlowTimeout();
    this._flowTimeout = setTimeout(() => {
      if (this._showConfigFlow) {
        this._showConfigFlow = false;
        this._configFlowDomain = '';
        this._configFlowEntryId = null;
      }
    }, 300000);
  }

  _clearFlowTimeout() {
    if (this._flowTimeout) {
      clearTimeout(this._flowTimeout);
      this._flowTimeout = null;
    }
  }

  _onFlowClose() {
    this._clearFlowTimeout();
    this._showConfigFlow = false;
    this._configFlowDomain = '';
    this._configFlowEntryId = null;
    this._configFlowSubentryType = '';
    this._configFlowIsReconfigure = false;
    this._configFlowAction = '';
    this._showEntrySelector = false;
  }

  _toggleDetailExpand() {
    this._detailExpanded = !this._detailExpanded;
  }

  _toggleSidebar() {
    // Approach 1: Dispatch hass-toggle-menu from component (standard method)
    try {
      this.dispatchEvent(new Event('hass-toggle-menu', { bubbles: true, composed: true }));
    } catch(e) {}

    // Approach 2: Direct DOM - find ha-sidebar and toggle its opened state
    // In panel_custom(embed_iframe=False) mode, this component's document
    // IS the main HA document, so document.querySelector works.
    try {
      const ha = document.querySelector('home-assistant');
      if (!ha) return;
      // Try accessing shadowRoot
      const root = ha.shadowRoot;
      if (!root) return;
      // Try ha-sidebar toggle method
      const sidebar = root.querySelector('ha-sidebar');
      if (sidebar && typeof sidebar.toggle === 'function') {
        sidebar.toggle();
        return;
      }
      // Fallback: set opened property directly
      if (sidebar && sidebar.hasAttribute('opened')) {
        sidebar.removeAttribute('opened');
      } else if (sidebar) {
        sidebar.setAttribute('opened', '');
      }
    } catch(e) {
      console.warn('[HACS Vision] Sidebar DOM approach failed:', e);
    }
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

  async _selectVersion(release) {
    const tag = release.tag_name || release.tag;
    if (!tag) return;
    this._changelogLoading = true;
    this._changelogData = null;
    try {
      const fullName = this._detailRepo?.full_name;
      if (fullName) {
        const data = await api.getChangelog(fullName, tag);
        this._changelogData = data?.body ? { ...data, tag } : { tag, body: '(No release notes)' };
      }
    } catch(e) {
      this._changelogData = { tag, body: t('noChangelog') || '暂无更新日志' };
    }
    this._changelogLoading = false;
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
      dashboard: t('catDashboard'),
    };
    return labels[category] || category;
  }

  _getDomainColor(domain) {
    const colors = ['#1565c0','#7b1fa2','#2e7d32','#e65100','#00838f','#6a1b9a','#c62828','#283593'];
    let hash = 0;
    for (let i = 0; i < domain.length; i++) hash = ((hash << 5) - hash) + domain.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  }

  _renderDetailAvatar(repo) {
    const domain = repo.domain;
    if (!domain) return '';
    const brandUrl = `https://brands.home-assistant.io/${domain}/icon.png`;
    const localUrl = `${window.location.origin}/api/hacs_vision_brand/${domain}`;
    const color = this._getDomainColor(domain);
    const letter = domain.charAt(0).toUpperCase();
    return html`
      <div class="detail-avatar">
        <img class="detail-avatar-img" src="${brandUrl}" alt=""
          @error=${function() {
            if (!this.dataset.fallbackTried) {
              this.dataset.fallbackTried = 'cdn';
              this.src = localUrl;
            } else {
              this.style.display = 'none';
              this.parentElement.style.background = color;
              const fl = this.parentElement.querySelector('.detail-avatar-letter');
              if (fl) fl.style.display = 'flex';
            }
          }}>
        <span class="detail-avatar-letter" style="display:none">${letter}</span>
      </div>
    `;
  }

  /** Render store detail action buttons based on integration state + capabilities */
  _renderStoreActionButtons(r) {
    const isInstalled = r.installed;
    const domain = r.domain;
    const entries = domain ? this._configEntries?.[domain] : null;
    const hasEntry = entries && entries.length > 0;
    const entry = hasEntry ? entries[0] : null;
    const isUpdateAvailable = r.installed_version && r.available_version && r.installed_version !== r.available_version;

    // Not installed → install button
    if (!isInstalled) {
      return html`
        <button class="modal-btn primary" @click=${() => this._modalAction('install')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t('install')}
        </button>`;
    }

    // Installed buttons
    const buttons = [];

    // Update available?
    if (isUpdateAvailable) {
      buttons.push(html`
        <button class="modal-btn primary" @click=${() => this._modalAction('update')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          ${t('update')}
        </button>`);
    }

    // Redownload
    buttons.push(html`
      <button class="modal-btn" style="color:#ff9800;border-color:#ff9800;" @click=${() => this._modalAction('redownload')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
        ${t('redownload')}
      </button>`);

    // Has config entry → check capabilities
    if (domain && hasEntry && entry) {
      const opts = entry.supports_options;
      const reconf = entry.supports_reconfigure;
      const subTypes = entry.supported_subentry_types && entry.supported_subentry_types.length > 0
        ? entry.supported_subentry_types : null;
      const disabled = entry.disabled_by;
      const state = entry.state;

      // Disabled → show enable button
      if (disabled === 'user') {
        buttons.push(html`
          <button class="modal-btn" @click=${() => this._modalAction('enable')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ${t('enable') || '启用'}
          </button>`);
      }

      // Error states → show retry/logs
      if (state === 'setup_error' || state === 'setup_retry') {
        buttons.push(html`
          <button class="modal-btn" style="color:#ff9800;border-color:#ff9800;" @click=${() => this._modalAction('view-logs')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            ${t('viewLogs') || '查看日志'}
          </button>`);
      }

      // Normal loaded state → show action buttons
      if (state === 'loaded' || !state) {
        if (opts) {
          buttons.push(html`
            <button class="modal-btn" @click=${() => this._modalAction('configure')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${t('configure')}
            </button>`);
        }
        if (reconf) {
          buttons.push(html`
            <button class="modal-btn" @click=${() => this._modalAction('reconfigure')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M21 8a9 9 0 1 1-3.64-6.36L21 2"/></svg>
              ${t('reconfigure') || '重配置'}
            </button>`);
        }
        if (subTypes) {
          buttons.push(html`
            <button class="modal-btn" style="background:var(--primary-color, #03a9f4);color:#fff;border-color:var(--primary-color, #03a9f4);" @click=${() => this._modalAction('add-subentry')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${t('addSubentry') || '添加服务'}
            </button>`);
        }
      }
    } else if (domain && !hasEntry) {
      // Installed but no config entry → show "Add Integration"
      buttons.push(html`
        <button class="modal-btn" @click=${() => this._modalAction('configure')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${t('addIntegration')}
        </button>`);
    }

    // Only show remove button for non-system entries
    if (!domain || entry?.source !== 'system') {
      buttons.push(html`
        <button class="modal-btn danger" @click=${() => this._modalAction('uninstall')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          ${t('remove')}
        </button>`);
    }

    return html`${buttons}`;
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
      } else if (action === 'redownload') {
        const { ConfirmDialog } = await import('./shared/confirm-dialog.js');
        const ok = await ConfirmDialog.show(this, {
          message: `${t('redownload')} ${repo.full_name || repo.name}?`,
          confirmText: t('confirm'),
          danger: false,
        });
        if (!ok) return;
        await api.redownload(repo.id || repo.full_name, repo.category);
        showToast(`${t('redownload')} ${t('successSuffix')}`, 'success');
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
      } else if (action === 'enable') {
        this._closeDetail();
        const { showToast } = await import('./hacs-vision-panel.js');
        const entries = this._configEntries?.[repo.domain];
        if (entries && entries.length > 0) {
          const { ConfirmDialog } = await import('./shared/confirm-dialog.js');
          const ok = await ConfirmDialog.show(this, {
            message: `${t('confirmEnable') || '确认启用集成?'}`,
            confirmText: t('enable') || '启用',
            danger: false,
          });
          if (!ok) return;
          // Call HA API to enable - use hass connection directly
          try {
            const token = this.hass?.auth?.data?.access_token;
            const haUrl = this.hass?.auth?.data?.ha_url || window.location.origin;
            const resp = await fetch(`${haUrl}/api/config/config_entries/entry/${entries[0].entry_id}/enable`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (resp.ok) {
              showToast(t('enabled') || '已启用', 'success');
              this._loadConfigEntries();
            } else {
              const errData = await resp.json().catch(() => ({}));
              showToast(errData.message || (t('enableFailed') || '启用失败'), 'error');
            }
          } catch(e) {
            showToast(`${t('enableFailed') || '启用失败'}: ${e.message}`, 'error');
          }
        }
        return;
      } else if (action === 'reconfigure') {
        this._closeDetail();
        const entries = this._configEntries?.[repo.domain];
        if (entries && entries.length > 0) {
          // Open config flow for the domain with entry_id → dialog handles reconfigure mode
          this._configFlowDomain = repo.domain;
          this._configFlowEntryId = entries[0].entry_id;
          this._configFlowIsReconfigure = true;
          this._showConfigFlow = true;
        }
        return;
      } else if (action === 'add-subentry') {
        this._closeDetail();
        const entries = this._configEntries?.[repo.domain];
        if (entries && entries.length > 0) {
          const entry = entries[0];
          const subTypes = entry.supported_subentry_types || [];
          if (subTypes.length === 1) {
            // Single subentry type → open subentry flow directly
            this._configFlowDomain = repo.domain;
            this._configFlowEntryId = entry.entry_id;
            this._configFlowSubentryType = subTypes[0];
            this._showConfigFlow = true;
          } else if (subTypes.length > 1) {
            // Multiple types → show selector first
            this._entrySelectorDomain = repo.domain;
            this._entrySelectorEntries = entries;
            this._entrySelectorCurrentId = entries[0].entry_id;
            this._showEntrySelector = true;
          }
        }
        return;
      } else if (action === 'view-logs') {
        window.location.href = `/config/logs?filter=${encodeURIComponent(repo.domain || '')}`;
        return;
      } else if (action === 'configure') {
        this._closeDetail();
        const domain = repo.domain;
        if (!domain) return;
        // Find matching config entries for this domain
        const entries = this._configEntries?.[domain];
        if (entries && entries.length > 0) {
          // Open options flow for the first entry (entry selector handles multiple)
          this._openOptionsFlow(entries[0].entry_id, domain);
        } else {
          // No existing config → start a brand new config flow
          this._openConfigFlow(domain);
        }
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
    try {
      return this._renderPanel();
    } catch(e) {
      console.error('Panel render error:', e);
      return html`<div class="store"><div class="error-banner error"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${t('connectFailed')}: ${e.message}</div><div style="text-align:center;padding:40px;color:var(--secondary-text-color)"><p>${t('refreshPage') || '请刷新页面重试'}</p><button @click=${() => location.reload()} style="margin-top:12px;padding:8px 24px;border:1px solid var(--primary-color);border-radius:6px;background:var(--card-background-color);color:var(--primary-color);cursor:pointer">${t('refresh') || '刷新'}</button></div></div>`;
    }
  }

  _renderPanel() {
    const tabs = [
      { view: 'browse', label: t('tabBrowse'), icon: '', count: null },
      { view: 'integrations', label: t('tabIntegrations') || '集成管理', icon: '', count: null },
      { view: 'updates', label: t('tabUpdates'), icon: '', count: this.stats.available_updates },
      { view: 'management', label: t('tabManagement'), icon: '', count: null },
      { view: 'settings', label: t('tabSettings'), icon: '', count: null },
    ];

    return html`
      <div class="store">
        <!-- ⚠️: modals must render OUTSIDE this .store container.
             .store uses display:flex; modals use position:fixed — placing
             them as flex children causes browser rendering anomalies
             (overlay fails to cover viewport, clicks blocked).
             Render them below, after </div>. -->

        ${this._renderStoreContent(tabs)}
      </div>

      ${this._renderModals(tabs)}
    `;
  }

  /** Store header, tabs, scrollable content (inside flex container) */
  _renderStoreContent(tabs) {

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

        <!-- Sticky Header + Tabs -->
        <div class="sticky-header">

        <!-- Header -->
          <div class="header">
          ${this.narrow ? html`<button class="sidebar-toggle" @click=${this._toggleSidebar} aria-label="切换侧边栏">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>` : ''}
          <div class="header-left">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
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
            <div class="stat" @click=${() => this._applyTag('favorites')}>
              <div class="stat-num">${this._favoriteCount ?? 0}</div>
              <div class="stat-label">${t('statFavorites') || '收藏'}</div>
            </div>
            <div class="stat" @click=${() => this._applyTag('custom')}>
              <div class="stat-num">${this.stats.custom_count ?? 0}</div>
              <div class="stat-label">${t('statCustom') || '自定义'}</div>
            </div>
            <div class="stat" @click=${() => this._applyFilter('')}>
              <div class="stat-num">${this.stats.total_repos ?? 0}</div>
              <div class="stat-label">${t('statRepos')}</div>
            </div>
          </div>
        </div>

        ${(this.stats.pending_restart ?? 0) > 0 ? html`
        <div class="restart-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${t('statusPendingRestart')}: ${this.stats.pending_restart} ${t('repositories')}</span>
          <button class="restart-bar-btn" @click=${this._restartHA}>${t('restartHA')}</button>
          <button class="restart-bar-btn outline" @click=${() => this._applyFilter('pending_restart')}>${t('viewDetail') || '查看'}</button>
        </div>
        ` : ''}

          <div class="tabs-wrapper">
            <div class="tabs" role="tablist">
              ${tabs.map(tab => html`
                <button class="tab ${this.currentView === tab.view ? 'active' : ''}"
                        role="tab" aria-selected=${this.currentView === tab.view}
                        aria-label=${tab.label}
                        @click=${() => this.switchView(tab.view)}>
                  ${tab.icon ? html`${tab.icon} ` : ''}${tab.label}
                  ${tab.count !== undefined && tab.count !== null ? html`<span class="badge" aria-label="${tab.count}">${tab.count}</span>` : ''}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="store-content">

        <!-- Content with fade transition -->
        <div class="content ${this._viewTransition ? 'transitioning' : ''}">
          <browse-view .hass=${this.hass} .presetFilter=${this._presetFilter} .presetTag=${this._presetTag} .configEntries=${this._configEntries} .pendingRestart=${this.stats.pending_restart ?? 0} ?hidden=${this.currentView !== 'browse'}></browse-view>
          <integrations-list .hass=${this.hass} ?hidden=${this.currentView !== 'integrations'} @configure-integration=${this._onConfigureIntegration} @add-integration=${this._onAddIntegration}></integrations-list>
          <updates-view .hass=${this.hass} ?hidden=${this.currentView !== 'updates'}></updates-view>
          <management-view .hass=${this.hass} ?hidden=${this.currentView !== 'management'}></management-view>
          <config-view .hass=${this.hass} @refresh-stats=${this._loadStats} ?hidden=${this.currentView !== 'settings'}></config-view>
        </div>
      </div>
    `;
  }

  /** Modals rendered outside .store flex container to prevent position:fixed anomalies. */
  _renderModals(tabs) {
    const r = this._detailRepo;
    const categoryColor = r ? getCategoryColor(r.category || 'integration') : '';
    const isInstalled = r?.installed || false;
    const isUpdateAvailable = isInstalled && r?.installed_version && r?.latest_version && r.installed_version !== r.latest_version;

    return html`
      <!-- Detail Modal -->
      ${this._showDetail && r ? html`
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="${r.manifest_name || r.full_name || t('detail')}" @click=${(e) => { if (e.target === e.currentTarget) this._closeDetail(); }}>
          <div class="modal ${this._detailExpanded ? 'expanded' : ''}" @dblclick=${this._toggleDetailExpand}>
            ${!this._detailExpanded ? html`<div class="modal-expand-hint">${t('dblZoomHint') || '双击放大'}</div>` : ''}
            <div class="modal-header">
              <div class="modal-header-left">
                ${this._renderDetailAvatar(r)}
                <div>
                  <div class="modal-title">${r.manifest_name || r.repository_manifest?.name || r.full_name || r.name || 'unknown'}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="modal-expand-btn" aria-label="${t('zoom') || '放大'}" @click=${this._toggleDetailExpand}>${this._detailExpanded ? '⤡' : '⤢'}</button>
                <button class="modal-close" aria-label="${t('close') || '关闭'}" @click=${this._closeDetail}>✕</button>
              </div>
            </div>
            <div class="modal-body">
              <div class="detail-category" style="background: ${categoryColor}">
                ${this._getCategoryLabel(r.category || 'integration')}
              </div>

              <div class="detail-desc">${r.description || t('noDesc')}</div>

              ${r.authors && r.authors.length ? html`
                <div class="detail-authors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ${r.authors.filter(a => a && a !== '@user').map(a => html`
                    <a class="detail-author-link" href="https://github.com/${a.replace(/^@/, '')}" target="_blank" rel="noopener">@${a.replace(/^@/, '')}</a>
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
                    <div class="release-tabs">
                      <div class="release-tab ${this._releaseTab === 0 ? 'active' : ''}" @click=${() => this._releaseTab = 0}>${t('stableReleases') || '正式版'}</div>
                      <div class="release-tab ${this._releaseTab === 1 ? 'active' : ''}" @click=${() => this._releaseTab = 1}>${t('prereleaseTab') || '预发布'}</div>
                    </div>
                    ${this._releasesLoading ? html`
                      <div class="releases-loading">
                        <div class="spinner-sm"></div>
                        ${t('loading')}
                      </div>
                    ` : (() => {
                      const filtered = this._releaseTab === 0
                        ? this._releases.filter(r => !r.prerelease)
                        : this._releases.filter(r => r.prerelease);
                      return filtered.length === 0 ? html`
                        <div class="releases-empty">${t('noReleases')}</div>
                      ` : filtered.map(release => html`
                        <div class="release-item ${this._changelogData?.tag === (release.tag_name || release.tag) ? 'active' : ''}" @click=${() => this._selectVersion(release)}>
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
                                  @click=${(e) => { e.stopPropagation(); this._installVersion(release.tag_name || release.tag); }}
                                  ?disabled=${this._installingVersion}>
                            ${t('installVersion')}
                          </button>
                        </div>
                      `);
                    })()}
                  </div>
                ` : ''}
              </div>

              <!-- Changelog (What's New) — shown when update is available or version selected -->
              ${isUpdateAvailable || this._changelogData ? html`
                <div class="detail-changelog">
                  <div class="detail-changelog-title">${t('changelogTitle') || '更新内容'}${this._changelogData?.tag ? html` <span style="font-weight:400;font-size:12px;color:var(--secondary-text-color);">— ${this._changelogData.tag}</span>` : ''}</div>
                  ${this._changelogLoading ? html`
                    <div class="readme-loading">
                      <div class="spinner-sm"></div>
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
                  ${this._renderStoreActionButtons(r)}
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
                    <div class="spinner-sm"></div>
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
      <div class="toast-container" id="toast-container" aria-live="polite" aria-atomic="true"></div>

      <!-- Entry Selector (multiple config entries for same domain) -->
      ${this._showEntrySelector ? html`
        <div class="entry-overlay" role="dialog" aria-modal="true" aria-label="${t('selectEntryTitle')}" @click=${() => { this._showEntrySelector = false; }}>
          <div class="entry-dialog" @click=${(e) => e.stopPropagation()}>
            <div class="entry-title">${t('selectEntryTitle')}</div>
            <div class="entry-subtitle">${t('selectEntrySubtitle') || '请选择要配置的集成实例'}</div>
            <div class="entry-list">
              ${this._entrySelectorEntries.map(entry => html`
                <button class="entry-btn" @click=${() => this._selectConfigEntry(entry.entry_id)}>
                  <div class="entry-btn-icon">⚙️</div>
                  <div class="entry-btn-text">
                    <span class="entry-btn-title">${entry.title || entry.entry_id}</span>
                    <span class="entry-btn-domain">${entry.domain}${entry.entry_id === this._entrySelectorCurrentId ? ' · ' + (t('currentEntry') || '当前') : ''}</span>
                  </div>
                </button>
              `)}
            </div>
            <button class="entry-cancel" @click=${() => { this._showEntrySelector = false; }}>${t('cancel')}</button>
          </div>
        </div>
      ` : ''}

      <!-- Config Flow Dialog -->
      <config-flow-dialog
        .hass=${this.hass}
        .domain=${this._configFlowDomain}
        .entryId=${this._configFlowEntryId}
        .configEntries=${this._configEntries}
        .isReconfigure=${this._configFlowIsReconfigure}
        .flowAction=${this._configFlowAction}
        .open=${this._showConfigFlow}
        @close=${this._onFlowClose}>
      </config-flow-dialog>
    `;
  }
}

// Global toast helper with queue support
const _panelMap = new WeakMap();
export function registerPanel(panel) { _panelMap.set(panel, true); }

const _toastQueue = [];
let _toastShowing = false;

export function showToast(msg, type = 'info') {
  // Find panel via WeakMap or DOM query
  let panel = null;
  try {
    // Check registered panels in WeakMap (no GC leak)
    const candidates = document.querySelectorAll('hacs-vision-panel');
    for (const c of candidates) {
      if (_panelMap.has(c)) { panel = c; break; }
    }
    if (!panel) panel = candidates[0];
  } catch(e) { /* ignore */ }
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
