import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { showToast } from '../hacs-vision-panel.js';

class IntegrationsList extends LitElement {
  static properties = {
    hass: { type: Object },
    configEntries: { type: Array },
    loading: { type: Boolean },
    searchText: { type: String },
    _statusFilter: { type: String, state: true },
    _showAddDialog: { type: Boolean, state: true },
    _handlerSearch: { type: String, state: true },
    _handlers: { type: Array, state: true },
    _handlersLoading: { type: Boolean, state: true },
    _removing: { type: Object, state: true },
    _reloading: { type: Object, state: true },
    _detailDomain: { type: String, state: true },
    _detailEntries: { type: Array, state: true },
    _showDetail: { type: Boolean, state: true },
    _domainNames: { type: Object, state: true },
    _domainIcons: { type: Object, state: true },
  };

  constructor() {
    super();
    this.configEntries = [];
    this.loading = true;
    this.searchText = '';
    this._statusFilter = 'all';
    this._showAddDialog = false;
    this._handlerSearch = '';
    this._handlers = [];
    this._handlersLoading = false;
    this._removing = {};
    this._reloading = {};
    this._detailDomain = '';
    this._detailEntries = [];
    this._showDetail = false;
    this._domainNames = {};
    this._domainIcons = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    this.loading = true;
    try {
      const result = await api.getConfigEntries();
      this.configEntries = result.entries || [];
      // Preload translations for all domains
      await this._preloadDomainNames();
    } catch(e) {
      console.error('Failed to load config entries:', e);
      showToast(t('loadFailed'), 'error');
    }
    this.loading = false;
  }

  async _preloadDomainNames() {
    if (!this.hass?.loadBackendTranslation) return;
    const domains = [...new Set(this.configEntries.map(e => e.domain))];
    const results = await Promise.all(domains.map(async (domain) => {
      let name = null;
      let icon = null;
      // Try hass.localize first (works if translation already loaded)
      if (this.hass.localize) {
        const localized = this.hass.localize(`component.${domain}.title`);
        if (localized && localized !== `component.${domain}.title`) name = localized;
        const localizedIcon = this.hass.localize(`component.${domain}.icon`);
        if (localizedIcon && localizedIcon !== `component.${domain}.icon`) icon = localizedIcon;
      }
      // Try loading backend translation and localize again
      if (!name || !icon) {
        try {
          await this.hass.loadBackendTranslation('config', domain);
          if (this.hass.localize) {
            if (!name) {
              const localized = this.hass.localize(`component.${domain}.title`);
              if (localized && localized !== `component.${domain}.title`) name = localized;
            }
            if (!icon) {
              const localizedIcon = this.hass.localize(`component.${domain}.icon`);
              if (localizedIcon && localizedIcon !== `component.${domain}.icon`) icon = localizedIcon;
            }
          }
        } catch(e) {
          // ignore load failures
        }
      }
      return { domain, name: name || domain, icon: icon || null };
    }));
    const names = {};
    const icons = {};
    for (const r of results) {
      names[r.domain] = r.name;
      icons[r.domain] = r.icon;
    }
    this._domainNames = names;
    this._domainIcons = icons;
  }

  async _loadHandlers() {
    if (this._handlers.length > 0) return;
    this._handlersLoading = true;
    try {
      const data = await this.hass.callApi('GET', 'config/config_entries/flow_handlers');
      this._handlers = Array.isArray(data)
        ? data.map(h => typeof h === 'string' ? { domain: h, name: h } : h)
        : [];
      this._handlers.sort((a, b) => (a.name || a.domain).localeCompare(b.name || b.domain));
    } catch(e) {
      console.error('Failed to load flow handlers:', e);
      this._handlers = [];
    }
    this._handlersLoading = false;
  }

  async _removeEntry(entry, e) {
    e.stopPropagation();
    const { ConfirmDialog } = await import('../shared/confirm-dialog.js');
    const ok = await ConfirmDialog.show(this, {
      title: entry.domain,
      message: t('confirmDelete'),
      confirmText: t('remove'),
      danger: true,
    });
    if (!ok) return;
    this._removing = { ...this._removing, [entry.entry_id]: true };
    try {
      const headers = api._getHeaders();
      const resp = await fetch(`/api/config/config_entries/entry/${entry.entry_id}`, {
        method: 'DELETE', headers: headers, credentials: 'include',
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      showToast(`${entry.domain} ${t('removed')}`, 'success');
      this._load();
    } catch(e) {
      showToast(`${t('removeFailed')}: ${e.message}`, 'error');
    }
    const r = { ...this._removing };
    delete r[entry.entry_id];
    this._removing = r;
  }

  async _reloadEntry(entry, e) {
    e.stopPropagation();
    this._reloading = { ...this._reloading, [entry.entry_id]: true };
    try {
      const headers = api._getHeaders();
      const resp = await fetch(`/api/config/config_entries/entry/${entry.entry_id}/reload`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        credentials: 'include', body: '{}',
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      showToast(`${entry.domain} ${t('reloaded')}`, 'success');
      setTimeout(() => this._load(), 1500);
    } catch(e) {
      showToast(`${t('reloadFailed')}: ${e.message}`, 'error');
    }
    const r = { ...this._reloading };
    delete r[entry.entry_id];
    this._reloading = r;
  }

  _configureEntry(entry, e) {
    e.stopPropagation();
    this._closeDetail();
    this.dispatchEvent(new CustomEvent('configure-integration', {
      bubbles: true, composed: true,
      detail: { domain: entry.domain, entry_id: entry.entry_id },
    }));
  }

  _openAddDialog() {
    this._showAddDialog = true;
    this._handlerSearch = '';
    this._loadHandlers();
  }

  _closeAddDialog() {
    this._showAddDialog = false;
    this._handlerSearch = '';
  }

  _addIntegration(domain) {
    this._closeAddDialog();
    this.dispatchEvent(new CustomEvent('add-integration', {
      bubbles: true, composed: true,
      detail: { domain },
    }));
  }

  _openDetail(domain, entries) {
    this._detailDomain = domain;
    this._detailEntries = entries;
    this._showDetail = true;
  }

  _closeDetail() {
    this._showDetail = false;
    this._detailDomain = '';
    this._detailEntries = [];
  }

  /* ─── Localized domain name ─── */
  _translateDomain(domain) {
    return this._domainNames?.[domain] || domain;
  }

  /* ─── Render avatar with integration initials ─── */
  _renderAvatar(domain) {
    const icon = this._domainIcons?.[domain];
    if (icon) {
      return html`<ha-icon class="domain-icon" icon="${icon}"></ha-icon>`;
    }
    const color = this._getDomainColor(domain);
    const letter = domain.charAt(0).toUpperCase();
    return html`<div class="avatar" style="background:${color}">${letter}</div>`;
  }

  /* ─── Helpers ─── */
  _getDomainColor(domain) {
    const colors = ['#1565c0','#7b1fa2','#2e7d32','#e65100','#00838f','#6a1b9a','#c62828','#283593'];
    let hash = 0;
    for (let i = 0; i < domain.length; i++) hash = ((hash << 5) - hash) + domain.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  }

  _getState(entry) {
    const s = (entry.state || 'loaded').toLowerCase();
    if (entry.disabled_by) return { label: t('statusDisabled'), cls: 'state-disabled', dot: '#9e9e9e' };
    if (s.includes('fail')) return { label: t('badgeLoadFailed'), cls: 'state-failed', dot: '#f44336' };
    if (s === 'not_loaded') return { label: t('statusNotInstalled'), cls: 'state-not-loaded', dot: '#9e9e9e' };
    return { label: t('statusInstalled'), cls: 'state-loaded', dot: '#4caf50' };
  }

  _groupState(entries) {
    const hasFailed = entries.some(e => !e.disabled_by && (e.state || '').toLowerCase().includes('fail'));
    const hasDisabled = entries.some(e => e.disabled_by);
    if (hasFailed) return 'failed';
    if (hasDisabled) return 'disabled';
    return 'loaded';
  }

  _groupLabel(state) {
    const map = { loaded: t('statusInstalled'), failed: t('badgeLoadFailed'), disabled: t('statusDisabled') };
    return map[state] || state;
  }

  _groupColor(state) {
    const map = { loaded: '#4caf50', failed: '#f44336', disabled: '#9e9e9e' };
    return map[state] || '#999';
  }

  /* ─── Filtered + sorted groups ─── */
  get _filteredDomainGroups() {
    const search = this.searchText.toLowerCase().trim();
    const map = {};
    for (const e of this.configEntries) {
      if (search && !e.domain.toLowerCase().includes(search)) continue;
      if (!map[e.domain]) map[e.domain] = [];
      map[e.domain].push(e);
    }
    let groups = Object.entries(map).map(([domain, entries]) => ({ domain, entries, _state: this._groupState(entries) }));
    // Filter by status
    if (this._statusFilter !== 'all') {
      groups = groups.filter(g => g._state === this._statusFilter);
    }
    // Sort: failed first, then disabled, then loaded, then alphabetically
    const order = { failed: 0, disabled: 1, loaded: 2 };
    groups.sort((a, b) => {
      const oa = order[a._state] ?? 3;
      const ob = order[b._state] ?? 3;
      if (oa !== ob) return oa - ob;
      return a.domain.localeCompare(b.domain);
    });
    return groups;
  }

  /* ─── Status filter chip counts ─── */
  get _chipCounts() {
    const counts = { all: 0, loaded: 0, failed: 0, disabled: 0 };
    const seen = {};
    for (const e of this.configEntries) {
      if (!seen[e.domain]) {
        seen[e.domain] = true;
        counts.all++;
      }
    }
    const groups = {};
    for (const e of this.configEntries) {
      if (!groups[e.domain]) groups[e.domain] = [];
      groups[e.domain].push(e);
    }
    for (const [domain, entries] of Object.entries(groups)) {
      const st = this._groupState(entries);
      if (counts[st] !== undefined) counts[st]++;
    }
    return counts;
  }

  get _filteredHandlers() {
    const q = this._handlerSearch.toLowerCase().trim();
    if (!q) return this._handlers;
    return this._handlers.filter(h =>
      (h.name || '').toLowerCase().includes(q) || (h.domain || '').toLowerCase().includes(q)
    );
  }

  /* ─── Render ─── */
  render() {
    const groups = this._filteredDomainGroups;
    const cc = this._chipCounts;
    return html`
      <div class="integrations">
        <div class="header">
          <div class="header-left">
            <h1 class="page-title">${t('tabIntegrations')}</h1>
            <span class="count-badge">${cc.all}</span>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <input type="text" class="search-input"
                .value=${this.searchText}
                @input=${e => { this.searchText = e.target.value; }}
                placeholder="${t('searchIntegration')}">
            </div>
            <button class="action-btn icon-btn" @click=${this._load} title="${t('refresh')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
            <button class="action-btn primary" @click=${this._openAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${t('addHAIntegration')}
            </button>
          </div>
        </div>

        <!-- Filter chips -->
        <div class="filter-bar">
          ${['all','loaded','failed','disabled'].map(key => html`
            <button class="chip ${this._statusFilter === key ? 'chip-active' : ''} chip-${key}"
              @click=${() => { this._statusFilter = key; }}>
              <span class="chip-label">${key === 'all' ? t('filterAll') : key === 'loaded' ? t('filterLoaded') : key === 'failed' ? t('filterFailed') : t('filterDisabled')}</span>
              <span class="chip-count">${cc[key] ?? 0}</span>
            </button>
          `)}
        </div>

        ${this.loading ? html`
          <div class="loading"><div class="spinner-sm"></div><div class="loading-text">${t('loading')}</div></div>
        ` : groups.length === 0 ? html`
          <div class="empty-state">
            <div class="empty-icon">⚙</div>
            <div class="empty-title">${t('noData')}</div>
          </div>
        ` : html`
          <div class="card-grid">
            ${groups.map(g => this._renderCard(g))}
          </div>
        `}
      </div>

      ${this._renderAddDialog()}
      ${this._renderDetailDialog()}
    `;
  }

  _renderCard(group) {
    const { domain, entries } = group;
    const color = this._getDomainColor(domain);
    const st = group._state;
    // Check if any entry is processing
    const anyProcessing = entries.some(e => this._removing[e.entry_id] || this._reloading[e.entry_id]);
    const canReload = !anyProcessing && entries.some(e => !this._removing[e.entry_id]);

    return html`
      <div class="card card-${st}" @click=${() => this._openDetail(domain, entries)} role="button" tabindex="0"
        @keydown=${e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._openDetail(domain, entries); } }}>
        <!-- Top-left status bar -->
        <div class="card-stripe" style="background:${this._groupColor(st)}"></div>

        <div class="card-img">
          ${this._renderAvatar(domain)}
        </div>
        <div class="card-body">
          <div class="card-name" title="${domain}">${this._translateDomain(domain)}</div>
          <div class="card-meta">${entries.length}${t('entryCount')}</div>
          <div class="card-status" style="color:${this._groupColor(st)}">
            <span class="status-dot" style="background:${this._groupColor(st)}"></span>
            ${this._groupLabel(st)}
          </div>
        </div>
        <div class="card-actions" @click=${e => e.stopPropagation()}>
          <button class="card-btn reload" @click=${() => this._quickReloadDomain(domain, entries)}
            title="${t('reloadDomain')}" ?disabled=${!canReload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button class="card-btn" @click=${() => this._openDetail(domain, entries)} title="${t('viewDetail')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  async _quickReloadDomain(domain, entries) {
    const target = entries.filter(e => !this._removing[e.entry_id]);
    if (!target.length) return;
    // Reload all entries sequentially
    for (const entry of target) {
      await this._reloadEntry(entry, { stopPropagation: () => {} });
    }
  }

  /* ─── Detail Dialog ─── */
  _renderDetailDialog() {
    if (!this._showDetail || !this._detailEntries.length) return '';
    const domain = this._detailDomain;
    const color = this._getDomainColor(domain);
    return html`
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="${this._translateDomain(domain)}" @click=${e => { if (e.target === e.currentTarget) this._closeDetail(); }}>
        <div class="modal">
          <div class="modal-header">
            <div class="modal-header-left">
              ${this._renderAvatar(domain)}
              <div>
                <div class="modal-title">${this._translateDomain(domain)}</div>
                <div class="modal-subtitle">${t('detailEntries', { count: this._detailEntries.length })}</div>
              </div>
            </div>
            <button class="modal-close" aria-label="${t('close') || '关闭'}" @click=${this._closeDetail}>✕</button>
          </div>
          <div class="modal-body">
            ${this._detailEntries.map(entry => this._renderEntryRow(entry))}
          </div>
        </div>
      </div>
    `;
  }

  _renderEntryRow(entry) {
    const state = this._getState(entry);
    const isProcessing = this._removing[entry.entry_id] || this._reloading[entry.entry_id];
    const title = entry.title || entry.entry_id.substring(0, 8);
    return html`
      <div class="entry-row ${entry.disabled_by ? 'disabled' : ''}">
        <span class="entry-dot" style="background:${state.dot}"></span>
        <div class="entry-info">
          <span class="entry-label">${state.label}</span>
          <span class="entry-id" title="entry_id: ${entry.entry_id}">${title}</span>
        </div>
        <div class="entry-actions" @click=${e => e.stopPropagation()}>
          <button class="entry-btn" @click=${e => this._configureEntry(entry, e)} title="${t('configureEntry')}" ?disabled=${isProcessing}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button class="entry-btn reload" @click=${e => this._reloadEntry(entry, e)} title="${t('reloadEntry')}" ?disabled=${isProcessing}>
            ${this._reloading[entry.entry_id] ? html`<span class="spinning">⋯</span>` : html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            `}
          </button>
          <button class="entry-btn remove" @click=${e => this._removeEntry(entry, e)} title="${t('removeEntry')}" ?disabled=${isProcessing}>
            ${this._removing[entry.entry_id] ? html`<span class="spinning">⋯</span>` : html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            `}
          </button>
        </div>
      </div>
    `;
  }

  /* ─── Add Integration Dialog ─── */
  _renderAddDialog() {
    if (!this._showAddDialog) return '';
    const filtered = this._filteredHandlers;
    return html`
      <div class="picker-overlay" role="dialog" aria-modal="true" aria-label="${t('addIntegration')}" @click=${e => { if (e.target === e.currentTarget) this._closeAddDialog(); }}>
        <div class="picker-dialog">
          <div class="picker-header">
            <span class="picker-title">${t('addHAIntegration')}</span>
            <button class="picker-close" aria-label="${t('close') || '关闭'}" @click=${this._closeAddDialog}>&times;</button>
          </div>
          <div class="picker-search">
            <input type="text" class="handler-search-input"
              placeholder="${t('searchIntegration')}"
              .value=${this._handlerSearch}
              @input=${e => { this._handlerSearch = e.target.value; }}
              @keydown=${e => { if (e.key === 'Escape') this._closeAddDialog(); }} />
          </div>
          <div class="picker-count">${filtered.length} ${t('integrationCount')}</div>
          <div class="picker-list">
            ${this._handlersLoading ? html`
              <div class="picker-loading"><div class="spinner-sm"></div><div>${t('loading')}</div></div>
            ` : filtered.length === 0 ? html`
              <div class="picker-empty">${t('noIntegrationMatch')}</div>
            ` : filtered.map(h => html`
              <div class="picker-item" @click=${() => this._addIntegration(h.domain)}>
                ${this._renderAvatar(h.domain)}
                <span class="picker-item-name">${this._translateDomain(h.domain)}</span>
                ${h.name && h.name !== h.domain ? html`<span class="picker-item-domain">${h.domain}</span>` : ''}
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; padding: 16px; }

    /* ===== Header ===== */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; margin-bottom: 12px; flex-wrap: wrap;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .page-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--primary-text-color); }
    .count-badge {
      font-size: 12px; padding: 2px 10px; border-radius: 12px;
      background: var(--primary-color, #03a9f4); color: #fff; font-weight: 600;
    }
    .header-actions { display: flex; align-items: center; gap: 6px; }
    .search-box { position: relative; }
    .search-input {
      padding: 9px 14px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; font-size: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); width: 200px; outline: none;
      box-sizing: border-box; transition: border-color 0.2s;
    }
    .search-input:focus { border-color: var(--primary-color, #03a9f4); }

    .action-btn {
      padding: 9px 18px; border-radius: 10px; font-size: 14px; font-weight: 600;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s; white-space: nowrap;
    }
    .action-btn:hover { border-color: var(--primary-color, #03a9f4); }
    .action-btn.icon-btn { padding: 9px 12px; }
    .action-btn.primary {
      background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color, #03a9f4);
    }
    .action-btn.primary:hover { opacity: 0.9; }

    /* ===== Filter Chips ===== */
    .filter-bar {
      display: flex; gap: 8px; margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 20px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color); cursor: pointer;
      font-size: 12px; font-weight: 500;
      transition: all 0.15s;
    }
    .chip:hover { border-color: var(--primary-color, #03a9f4); }
    .chip-active {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.06);
    }
    .chip-active.chip-loaded { border-color: #4caf50; background: rgba(76,175,80,0.08); }
    .chip-active.chip-failed { border-color: #f44336; background: rgba(244,67,54,0.08); }
    .chip-active.chip-disabled { border-color: #9e9e9e; background: rgba(158,158,158,0.1); }
    .chip-label { color: var(--primary-text-color); }
    .chip-count {
      font-size: 11px; padding: 1px 7px; border-radius: 10px;
      background: var(--divider-color, #e8e8e8); font-weight: 600;
    }

    .loading { text-align: center; padding: 60px 0; }
    .loading-text { font-size: 14px; color: var(--secondary-text-color); margin-top: 8px; }
    .spinner-sm {
      width: 20px; height: 20px; margin: 0 auto;
      border: 2px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; display: inline-block; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
    .empty-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }

    /* ===== Card Grid ===== */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      cursor: pointer; position: relative;
      display: flex; flex-direction: column;
      transition: box-shadow 0.2s; touch-action: manipulation;
    }
    .card:hover {
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    }
    .card.card-failed { border-color: rgba(244,67,54,0.25); }
    .card.card-disabled { border-color: rgba(158,158,158,0.25); }
    .card:focus-visible {
      box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3,169,244), 0.3);
      outline: none;
    }

    .card-stripe {
      height: 3px; flex-shrink: 0;
    }

    .card-img {
      height: 90px;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
    }
    .domain-icon {
      --mdc-icon-size: 46px;
      color: var(--primary-text-color, #212121);
    }
    .avatar {
      width: 46px; height: 46px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: #fff;
      box-shadow: 0 3px 10px rgba(0,0,0,0.13);
    }

    .card-body { padding: 10px 14px 12px; flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .card-name {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color, #212121);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-meta { font-size: 11px; color: var(--secondary-text-color, #727272); }
    .card-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 500; margin-top: 2px;
    }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

    .card-actions {
      position: absolute; top: 8px; right: 8px;
      opacity: 0; transition: opacity 0.15s;
      display: flex; gap: 4px; z-index: 2;
    }
    .card:hover .card-actions, .card:focus-visible .card-actions { opacity: 1; }
    .card-btn {
      width: 28px; height: 28px; padding: 0;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; border: none;
      background: rgba(255,255,255,0.92);
      color: var(--secondary-text-color);
      cursor: pointer;
      transition: all 0.15s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .card-btn:hover { background: #fff; }
    .card-btn.reload:hover { color: #ff9800; }
    .card-btn:hover:not(.reload) { color: var(--primary-color, #03a9f4); }

    /* ===== Detail Modal ===== */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: grid; place-items: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%; max-width: 460px; max-height: 70vh;
      display: flex; flex-direction: column;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px 14px; flex-shrink: 0;
    }
    .modal-header-left { display: flex; align-items: center; gap: 14px; }
    .modal-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
    .modal-subtitle { font-size: 11px; color: var(--secondary-text-color); }
    .modal-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color); cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .modal-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .modal-body { overflow-y: auto; flex: 1; padding: 0 6px 10px; }

    .entry-row {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 14px; margin: 2px 6px;
      border-radius: 10px; transition: background 0.1s;
    }
    .entry-row:hover { background: var(--secondary-background-color, #f5f5f5); }
    .entry-row.disabled { opacity: 0.45; }

    .entry-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .entry-info { flex: 1; min-width: 0; }
    .entry-label { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .entry-id {
      font-size: 10px; font-family: monospace;
      color: var(--secondary-text-color); display: block; margin-top: 1px;
    }
    .entry-actions {
      display: flex; gap: 2px; flex-shrink: 0;
      opacity: 0; transition: opacity 0.15s;
    }
    .entry-row:hover .entry-actions { opacity: 1; }
    .entry-btn {
      width: 28px; height: 28px; padding: 0;
      display: inline-flex; align-items: center; justify-content: center;
      border: 1px solid transparent; border-radius: 6px;
      background: none; font-size: 13px; cursor: pointer;
      color: var(--secondary-text-color); transition: all 0.15s;
    }
    .entry-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .entry-btn:hover { background: rgba(33,150,243,0.08); color: #2196f3; }
    .entry-btn.reload:hover { background: rgba(255,152,0,0.08); color: #ff9800; }
    .entry-btn.remove:hover { background: rgba(244,67,54,0.08); color: #f44336; }

    /* ===== Picker Dialog ===== */
    .picker-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: grid; place-items: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    }
    .picker-dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%; max-width: 520px; max-height: 80vh;
      display: flex; flex-direction: column;
      animation: slideUp 0.25s ease;
    }
    .picker-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .picker-title { font-size: 16px; font-weight: 700; color: var(--primary-text-color); }
    .picker-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color); cursor: pointer; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .picker-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .picker-search { padding: 12px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .handler-search-input {
      width: 100%; padding: 10px 12px; border-radius: 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); font-size: 14px;
      box-sizing: border-box; transition: border-color 0.2s;
    }
    .handler-search-input:focus { border-color: var(--primary-color, #03a9f4); outline: none; }
    .picker-count { font-size: 12px; color: var(--secondary-text-color); padding: 8px 20px 0; }
    .picker-list { overflow-y: auto; flex: 1; padding: 8px 12px; }
    .picker-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s;
    }
    .picker-item:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .picker-item-domain {
      font-size: 12px; background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4); padding: 2px 8px; border-radius: 4px;
    }
    .picker-item-name { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); }
    .picker-empty, .picker-loading { text-align: center; padding: 32px 0; color: var(--secondary-text-color); }

    @media (max-width: 600px) {
      :host { padding: 12px; }
      .header { flex-direction: column; align-items: flex-start; }
      .header-actions { width: 100%; }
      .search-input { width: 100%; }
      .card-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
      .card-img { height: 75px; }
      .domain-icon { --mdc-icon-size: 40px; }
      .avatar { width: 40px; height: 40px; font-size: 16px; }
      .card-actions { opacity: 1; }
      .chip { font-size: 11px; padding: 4px 12px; }
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal { max-width: 100%; max-height: 75vh; border-radius: 16px 16px 0 0; padding-bottom: max(16px, env(safe-area-inset-bottom, 12px)); }
      .entry-actions { opacity: 1; }
    }
  `;
}

customElements.define('integrations-list', IntegrationsList);