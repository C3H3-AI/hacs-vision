import { LitElement, html, css } from 'lit';
import { getCommonStyles } from '../shared/styles.js';
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
    _detailDeviceCounts: { type: Object, state: true },
    _showDetail: { type: Boolean, state: true },
    _deviceViewEntryId: { type: String, state: true },
    _domainNames: { type: Object, state: true },
    _viewMode: { type: String, state: true },
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
    this._viewMode = localStorage.getItem('hacs_int_view_mode') || 'card';
    this._modalDrag = { offsetX: 0, offsetY: 0, startX: 0, startY: 0, dragging: false, cleanup: null };
  }

  _modalPointerDown(e) {
    // Only drag on header area, not on buttons
    const header = e.target.closest('.modal-header, .dv-header');
    if (!header || e.target.closest('button, input, select, textarea')) return;
    if (e.button !== undefined && e.button !== 0) return;
    const drag = this._modalDrag;
    const modal = e.currentTarget;
    drag.dragging = true;
    drag.startX = e.clientX - drag.offsetX;
    drag.startY = e.clientY - drag.offsetY;
    modal.style.transition = 'none';
    modal.style.cursor = 'grabbing';
    header.style.userSelect = 'none';
    modal.setPointerCapture(e.pointerId);
    const onMove = (ev) => {
      if (!drag.dragging) return;
      drag.offsetX = ev.clientX - drag.startX;
      drag.offsetY = ev.clientY - drag.startY;
      modal.style.transform = `translate(${drag.offsetX}px, ${drag.offsetY}px)`;
    };
    const onUp = (ev) => {
      drag.dragging = false;
      modal.style.cursor = '';
      header.style.userSelect = '';
      modal.removeEventListener('pointermove', onMove);
      modal.removeEventListener('pointerup', onUp);
      modal.removeEventListener('pointercancel', onUp);
      try { modal.releasePointerCapture(ev.pointerId); } catch(er) {}
    };
    modal.addEventListener('pointermove', onMove);
    modal.addEventListener('pointerup', onUp);
    modal.addEventListener('pointercancel', onUp);
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  _setViewMode(mode) {
    this._viewMode = mode;
    try { localStorage.setItem('hacs_int_view_mode', mode); } catch(e) {}
  }

  async _load() {
    this.loading = true;
    try {
      const result = await api.getConfigEntries();
      this.configEntries = result.entries || [];
      // Build domain name map from backend translated_name → domain fallback
      const names = {};
      for (const e of this.configEntries) {
        if (names[e.domain]) continue;
        names[e.domain] = e.translated_name || e.domain;
      }
      this._domainNames = names;
    } catch(e) {
      console.error('Failed to load config entries:', e);
      showToast(t('loadFailed'), 'error');
    }
    this.loading = false;
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
      message: t('confirmDelete', { domain: entry.domain }),
      confirmText: t('delete'),
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
      showToast(`${entry.domain} ${t('deleted')}`, 'success');
      this._load();
    } catch(e) {
      showToast(`${t('deleteFailed')}: ${e.message}`, 'error');
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

  async _toggleDisabled(entry, e) {
    e.stopPropagation();
    const newState = entry.disabled_by ? null : "user";
    const actionLabel = newState ? t('disableEntry') || '禁用' : t('enableEntry') || '启用';
    try {
      const headers = api._getHeaders();
      const resp = await fetch(`/api/config/config_entries/entry`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ entry_id: entry.entry_id, disabled_by: newState }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      showToast(`${entry.domain} ${actionLabel}${t('successSuffix') || '成功'}`, 'success');
      setTimeout(() => this._load(), 1500);
    } catch(err) {
      showToast(`${actionLabel}${t('failedSuffix') || '失败'}: ${err.message}`, 'error');
    }
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
    this._detailDeviceCounts = null;
    // Fetch device/entity counts for this domain
    api.getDeviceCounts(domain).then(r => {
      this._detailDeviceCounts = r;
    }).catch(e => {
      console.warn('Failed to get device counts for', domain, e);
    });
  }

  _closeDetail() {
    this._showDetail = false;
    this._detailDomain = '';
    this._detailEntries = [];
    this._deviceViewEntryId = '';
    // Reset drag offset for next open
    const modal = this.shadowRoot?.querySelector('.modal');
    if (modal) modal.style.transform = '';
  }

  _openDeviceView(entry) {
    this._showDetail = true;
    this._detailDomain = entry.domain;
    this._detailEntries = [entry];
    this._deviceViewEntryId = entry.entry_id;
  }

  /* ─── Localized domain name ─── */
  _translateDomain(domain) {
    return this._domainNames?.[domain] || domain;
  }

  /* ─── Render avatar with CDN icon → local fallback → initials ─── */
  _renderAvatar(domain) {
    const brandUrl = `https://brands.home-assistant.io/${domain}/icon.png`;
    const localUrl = `${window.location.origin}/api/hacs_vision_brand/${domain}`;
    const color = this._getDomainColor(domain);
    const letter = domain.charAt(0).toUpperCase();
    return html`
      <div class="avatar">
        <img class="avatar-img" src="${brandUrl}" alt=""
          @error=${e => {
            if (!e.target.dataset.fallbackTried) {
              e.target.dataset.fallbackTried = 'cdn';
              e.target.src = localUrl;
            } else {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = '${color}';
              const fl = e.target.parentElement.querySelector('.avatar-letter');
              if (fl) fl.style.display = 'flex';
            }
          }}>
        <span class="avatar-letter" style="display:none">${letter}</span>
      </div>
    `;
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
    if (s.includes('fail') || s.includes('setup_retry') || s.includes('retry')) return { label: t('badgeLoadFailed'), cls: 'state-failed', dot: '#f44336' };
    if (s.includes('not_loaded')) return { label: t('statusNotLoaded'), cls: 'state-not-loaded', dot: '#ff9800' };
    return { label: t('statusInstalled'), cls: 'state-loaded', dot: '#4caf50' };
  }

  _groupState(entries) {
    const hasFailed = entries.some(e => !e.disabled_by && ((e.state || '').toLowerCase().includes('fail') || (e.state || '').toLowerCase().includes('setup_retry') || (e.state || '').toLowerCase().includes('retry')));
    const hasNotLoaded = entries.some(e => !e.disabled_by && (e.state || '').toLowerCase().includes('not_loaded'));
    const hasDisabled = entries.some(e => e.disabled_by);
    if (hasFailed) return 'failed';
    if (hasNotLoaded) return 'not-loaded';
    if (hasDisabled) return 'disabled';
    return 'loaded';
  }

  _groupLabel(state) {
    const map = { loaded: t('statusInstalled'), failed: t('badgeLoadFailed'), disabled: t('statusDisabled'), 'not-loaded': t('statusNotLoaded') };
    return map[state] || state;
  }

  _groupColor(state) {
    const map = { loaded: '#4caf50', failed: '#f44336', disabled: '#9e9e9e', 'not-loaded': '#ff9800' };
    return map[state] || '#999';
  }

  /* ─── Filtered + sorted groups ─── */
  get _filteredDomainGroups() {
    const search = this.searchText.toLowerCase().trim();
    const map = {};
    for (const e of this.configEntries) {
      if (search) {
        const translated = this._translateDomain(e.domain).toLowerCase();
        const statusLabel = this._groupLabel(this._groupState([e])).toLowerCase();
        if (!e.domain.toLowerCase().includes(search) &&
            !translated.includes(search) &&
            !statusLabel.includes(search)) continue;
      }
      if (!map[e.domain]) map[e.domain] = [];
      map[e.domain].push(e);
    }
    let groups = Object.entries(map).map(([domain, entries]) => ({
      domain, entries,
      _state: this._groupState(entries),
      _supports_options: entries.some(e => e.supports_options),
    }));
    // Filter by status
    if (this._statusFilter !== 'all') {
      groups = groups.filter(g => g._state === this._statusFilter);
    }
    // Sort: failed first, then disabled, then loaded, then alphabetically
    const order = { failed: 0, 'not-loaded': 1, disabled: 2, loaded: 3 };
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
    const counts = { all: 0, loaded: 0, failed: 0, disabled: 0, 'not-loaded': 0 };
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
    return this._handlers.filter(h => {
      const translated = (this._domainNames?.[h.domain] || '').toLowerCase();
      return (h.name || '').toLowerCase().includes(q)
          || (h.domain || '').toLowerCase().includes(q)
          || translated.includes(q);
    });
  }

  /* ─── Render ─── */
  render() {
    const groups = this._filteredDomainGroups;
    const cc = this._chipCounts;
    return html`
      <div class="integrations">
        <div class="controls">
          <div class="search" style="flex:1;min-width:120px;">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text"
              .value=${this.searchText}
              @input=${e => { this.searchText = e.target.value; }}
              placeholder="${t('searchIntegration')}">
            ${this.searchText ? html`<button class="search-clear" @click=${() => { this.searchText = ''; }}>✕</button>` : ''}
          </div>
          <div class="controls-right">
            <div class="view-toggle">
              <button class="view-toggle-btn ${this._viewMode === 'card' ? 'active' : ''}" @click=${() => this._setViewMode('card')} title="${t('viewCard')}">${t('viewCard')}</button>
              <button class="view-toggle-btn ${this._viewMode === 'list' ? 'active' : ''}" @click=${() => this._setViewMode('list')} title="${t('viewList')}">${t('viewList')}</button>
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
          ${['all','loaded','failed','disabled','not-loaded'].map(key => html`
            <button class="chip ${this._statusFilter === key ? 'chip-active' : ''} chip-${key}"
              @click=${() => { this._statusFilter = key; }}>
              <span class="chip-label">${key === 'all' ? t('filterAll') : key === 'loaded' ? t('filterLoaded') : key === 'failed' ? t('filterFailed') : key === 'disabled' ? t('filterDisabled') : t('filterNotLoaded')}</span>
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
        ` : this._viewMode === 'list' ? html`
          <div class="integrations-list">
            <div class="list-header">
              <span class="list-header-name">${t('colName')}</span>
              <span class="list-header-status">${t('colStatus')}</span>
              <span class="list-header-action"></span>
            </div>
            ${groups.map(g => this._renderListRow(g))}
          </div>
        ` : html`
          <div class="grid">
            ${groups.map(g => this._renderCard(g))}
          </div>
        `}
      </div>

      ${this._renderAddDialog()}
      ${this._renderDetailDialog()}
    `;
  }

  _renderListRow(group) {
    const { domain, entries } = group;
    const st = group._state;
    const multiEntry = entries.length > 1;
    const entry0 = entries[0];
    const anyProcessing = entries.some(e => this._removing[e.entry_id] || this._reloading[e.entry_id]);

    return html`
      <div class="list-row list-row-${st}" @click=${() => multiEntry ? this._openDetail(domain, entries) : this._openDeviceView(entry0)}>
        <span class="list-row-name">
          <span class="list-row-icon">${this._renderAvatar(domain)}</span>
          <span class="list-row-title">${this._translateDomain(domain)}</span>
          <span class="list-row-domain">${domain}</span>
        </span>
        <span class="list-row-status">
          <span class="list-status-badge state-${st}">${this._groupLabel(st)}</span>
          ${multiEntry ? html`<span class="list-entry-count">${entries.length} ${t('entryCount')}</span>` : ''}
        </span>
        <span class="list-row-actions">
          ${group._supports_options ? html`
          <button class="list-action-btn" @click=${e => { e.stopPropagation(); multiEntry ? this._openDetail(domain, entries) : this._openDeviceView(entry0); }} title="${multiEntry ? t('viewDetail') : t('configure')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          ` : ''}
          <button class="list-action-btn reload" @click=${e => { e.stopPropagation(); this._reloadEntry(entry0 || entries[0], e); }} title="${t('reloadEntry')}" ?disabled=${anyProcessing}>
            ${this._reloading[entry0?.entry_id || ''] ? '⋯' : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`}
          </button>
        </span>
      </div>
    `;
  }

  _renderCard(group) {
    const { domain, entries } = group;
    const color = this._getDomainColor(domain);
    const st = group._state;
    const anyProcessing = entries.some(e => this._removing[e.entry_id] || this._reloading[e.entry_id]);
    const multiEntry = entries.length > 1;
    const entry0 = entries[0];

    return html`
      <div class="card card-${st}" @click=${() => multiEntry ? this._openDetail(domain, entries) : this._openDeviceView(entry0)} role="button" tabindex="0"
        @keydown=${e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (multiEntry) this._openDetail(domain, entries); else this._openDeviceView(entry0); } }}>

          <div class="card-img">
            <span class="category-badge" style="background:${color}">${t('catIntegration')}</span>
            ${this._renderAvatar(domain)}
            ${st !== 'loaded' ? html`<span class="img-status-badge state-${st}">${this._groupLabel(st)}</span>` : ''}
          </div>

        <div class="card-body">
          <div class="card-name" title="${domain}">${this._translateDomain(domain)}</div>
          <div class="card-meta">
            <span>${entries.length} ${t('entryCount')}</span>
            ${entry0 ? html`<span class="dot-sep"></span><span class="status-label" style="color:${this._groupColor(st)}">${entry0.title || entry0.entry_id.substring(0,8)}</span>` : ''}
          </div>
        </div>

        <div class="card-footer" @click=${e => e.stopPropagation()}>
          ${group._supports_options ? html`
          <button class="footer-btn configure" @click=${() => multiEntry ? this._openDetail(domain, entries) : this._configureEntry(entry0, { stopPropagation: () => {} })}
            title="${t('configureEntry')}" ?disabled=${anyProcessing}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span class="btn-label">${multiEntry ? t('viewDetail') || '详情' : t('configure') || '配置'}</span>
          </button>
          ` : ''}
          <button class="footer-btn reload" @click=${() => this._reloadEntry(entry0 || entries[0], { stopPropagation: () => {} })}
            title="${t('reloadEntry')}" ?disabled=${anyProcessing}>
            ${anyProcessing ? html`<span class="spinning-mini">⟳</span>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`}
            <span class="btn-label">${t('reloadEntry') || '重载'}</span>
          </button>
          <button class="footer-btn remove" @click=${e => this._removeEntry(entry0 || entries[0], e)}
            title="${t('removeEntry')}" ?disabled=${anyProcessing}>
            ${anyProcessing ? html`<span class="spinning-mini">⋯</span>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
            <span class="btn-label">${t('delete')}</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ─── Detail Dialog: side panel on desktop, bottom sheet on mobile ─── */
  _renderDetailDialog() {
    if (!this._showDetail) return '';
    // Device view mode
    if (this._deviceViewEntryId) {
      const entry = this._detailEntries.find(e => e.entry_id === this._deviceViewEntryId);
      return html`
        <div class="detail-overlay" role="dialog" aria-modal="true" @click=${e => { if (e.target === e.currentTarget) this._closeDetail(); }} @keydown=${e => { if (e.key === 'Escape') this._closeDetail(); }}>
          <div class="modal" @pointerdown=${this._modalPointerDown}>
            <div class="modal-header">
              <div class="modal-header-left">
                <span class="modal-title">${(entry && entry.title) || this._translateDomain(this._detailDomain)}</span>
              </div>
              <button class="modal-close" aria-label="${t('close') || '关闭'}" @click=${this._closeDetail}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <hacs-vision-device-view
              .hass=${this.hass}
              .entryId=${this._deviceViewEntryId}
              .domain=${this._detailDomain}
              .entryTitle=${(entry && entry.title) || this._detailDomain}
              @back=${() => { this._deviceViewEntryId = ''; }}
              @close=${() => this._closeDetail()}
              style="flex:1;min-height:0;display:flex;flex-direction:column;">
            </hacs-vision-device-view>
          </div>
        </div>
      `;
    }

    if (!this._detailEntries.length) return '';
    const domain = this._detailDomain;
    const color = this._getDomainColor(domain);
    const entries = this._detailEntries;
    const hasSubentries = entries.length > 0 && (
      entries.some(e => e.supported_subentry_types || (e.title && e.title.startsWith('subentry'))) ||
      entries.length >= 3
    );
    const useTwoCol = hasSubentries;

    return html`
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${this._translateDomain(domain)}" @click=${e => { if (e.target === e.currentTarget) this._closeDetail(); }} @keydown=${e => { if (e.key === 'Escape') this._closeDetail(); }}>
        <div class="modal ${useTwoCol ? 'two-col' : ''}" @pointerdown=${this._modalPointerDown}>
          <div class="modal-header">
            <div class="modal-header-left">
              ${this._renderAvatar(domain)}
              <div>
                <div class="modal-title">${this._translateDomain(domain)}</div>
                <div class="modal-subtitle">
                  ${entries.length} ${t('entryCount')}
                  ${this._detailDeviceCounts ? html` · ${this._detailDeviceCounts.devices} ${t('deviceCount')} · ${this._detailDeviceCounts.entities} 个实体` : ''}
                </div>
              </div>
            </div>
            <button class="modal-close" aria-label="${t('close') || '关闭'}" @click=${this._closeDetail}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body ${useTwoCol ? 'grid-2col' : ''}">
            ${useTwoCol ? html`
              <div class="col-left">
                <div class="col-title">${t('subentryConfig') || '子项配置'}</div>
                ${entries.map(entry => this._renderEntryRow(entry))}
              </div>
              <div class="col-right">
                <div class="col-title">${t('addSubentry') || '添加新子项'}</div>
                <div class="add-subentry-card">
                  <div class="add-subentry-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                  <div class="add-subentry-text">${t('addSubentryHint') || '点击添加新的子项配置'}</div>
                  <button class="add-subentry-btn" @click=${() => {
                    this._closeDetail();
                    this.dispatchEvent(new CustomEvent('add-integration', {
                      bubbles: true, composed: true,
                      detail: { domain, isSubentry: true },
                    }));
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    ${t('addSubentry') || '添加新子项'}
                  </button>
                </div>
              </div>
            ` : entries.map(entry => this._renderEntryRow(entry))}
          </div>
        </div>
      </div>
    `;
  }

  _renderEntryRow(entry) {
    const state = this._getState(entry);
    const isProcessing = this._removing[entry.entry_id] || this._reloading[entry.entry_id];
    const title = entry.title || entry.entry_id.substring(0, 8);
    const isDisabled = !!entry.disabled_by;
    return html`
      <div class="entry-row ${isDisabled ? 'disabled' : ''}">
        <span class="entry-dot" style="background:${state.dot}"></span>
        <div class="entry-info">
          <span class="entry-label">${state.label}</span>
          <span class="entry-id" title="entry_id: ${entry.entry_id}">${title}</span>
        </div>
        <div class="entry-actions" @click=${e => e.stopPropagation()}>
          <!-- Enable/Disable toggle -->
          <button class="entry-btn ${isDisabled ? 'enable' : 'disable'}"
            @click=${e => this._toggleDisabled(entry, e)}
            title="${isDisabled ? t('enableEntry') || '启用' : t('disableEntry') || '禁用'}"
            ?disabled=${isProcessing}>
            ${isDisabled ? html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            ` : html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            `}
          </button>
          ${entry.supports_options ? html`
          <button class="entry-btn" @click=${e => this._configureEntry(entry, e)} title="${t('configureEntry')}" ?disabled=${isProcessing}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          ` : ''}
          <button class="entry-btn reload" @click=${e => this._reloadEntry(entry, e)} title="${t('reloadEntry')}" ?disabled=${isProcessing}>
            ${this._reloading[entry.entry_id] ? html`<span class="spinning">⋯</span>` : html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            `}
          </button>
          <button class="entry-btn device" @click=${e => { e.stopPropagation(); this._openDeviceView(entry); }} title="${t('viewDevices') || '设备'}" ?disabled=${isProcessing}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
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
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${t('addHAIntegration')}" @click=${e => { if (e.target === e.currentTarget) this._closeAddDialog(); }}>
        <div class="modal add-modal" @pointerdown=${this._modalPointerDown}>
          <div class="modal-header">
            <span class="modal-title">${t('addHAIntegration')}</span>
            <button class="modal-close" aria-label="${t('close') || '关闭'}" @click=${this._closeAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-search">
            <input type="text" class="add-search-input"
              placeholder="${t('searchIntegration')}"
              .value=${this._handlerSearch}
              @input=${e => { this._handlerSearch = e.target.value; }}
              @keydown=${e => { if (e.key === 'Escape') this._closeAddDialog(); }} />
          </div>
          <div class="add-panel-count">${filtered.length} ${t('integrationCount')}</div>
          <div class="modal-body">
            ${this._handlersLoading ? html`
              <div class="dv-loading"><div class="spinner-sm"></div><div>${t('loading')}</div></div>
            ` : filtered.length === 0 ? html`
              <div class="dv-empty">${t('noIntegrationMatch')}</div>
            ` : filtered.map(h => html`
              <div class="add-item" @click=${() => this._addIntegration(h.domain)}>
                ${this._renderAvatar(h.domain)}
                <span class="add-item-name">${this._translateDomain(h.domain)}</span>
                ${h.name && h.name !== h.domain ? html`<span class="add-item-domain">${h.domain}</span>` : ''}
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  static styles = [getCommonStyles(), css`
    :host { display: block; touch-action: manipulation; }

    /* ===== Controls Bar (unified with store/management/updates) ===== */
    .controls {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
    }
    .page-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--primary-text-color); }
    .controls-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .search input {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; font-size: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); outline: none;
      box-sizing: border-box; transition: border-color 0.2s; font-family: inherit;
    }
    .search input:focus { border-color: var(--primary-color, #03a9f4); }

    .action-btn {
      padding: 9px 18px; border-radius: 10px; font-size: 14px; font-weight: 600;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s; white-space: nowrap; min-height: 36px;
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

    /* ===== View Toggle ===== */
    .view-toggle {
      display: inline-flex; border: 1px solid var(--divider-color);
      border-radius: 8px; overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; touch-action: manipulation; min-height: 36px;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

    /* ===== List View ===== */
    .integrations-list {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px; overflow: hidden;
    }
    .list-header {
      display: flex; align-items: center; padding: 10px 14px;
      background: var(--secondary-background-color, #f5f5f5);
      font-size: 11px; font-weight: 600; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .list-header-name { flex: 1; }
    .list-header-status { width: 120px; text-align: center; }
    .list-header-action { width: 80px; text-align: right; }
    .list-row {
      display: flex; align-items: center; padding: 10px 14px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer; transition: background 0.15s;
    }
    .list-row:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.03); }
    .list-row-name { flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }
    .list-row-icon { width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .list-row-icon img { width: 100%; height: 100%; object-fit: cover; }
    .list-row-icon .initials { font-size: 12px; font-weight: 700; color: #fff; }
    .list-row-title { font-size: 13px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .list-row-domain { font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0; }
    .list-row-status { width: 120px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .list-status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
    .list-status-badge.state-loaded { background: rgba(76,175,80,0.12); color: #4caf50; }
    .list-status-badge.state-failed { background: rgba(244,67,54,0.12); color: #f44336; }
    .list-status-badge.state-disabled { background: rgba(158,158,158,0.12); color: #9e9e9e; }
    .list-status-badge.state-not-loaded { background: rgba(255,152,0,0.12); color: #ff9800; }
    .list-entry-count { font-size: 11px; color: var(--secondary-text-color); }
    .list-row-actions { width: 80px; text-align: right; display: flex; gap: 4px; justify-content: flex-end; }
    .list-action-btn {
      width: 28px; height: 28px; border: 1px solid var(--divider-color);
      border-radius: 6px; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .list-action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .list-action-btn.reload:hover { border-color: #ff9800; color: #ff9800; }
    .list-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
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
    .chip-active.chip-not-loaded { border-color: #ff9800; background: rgba(255,152,0,0.08); }
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
    .card.card-not-loaded { border-color: rgba(255,152,0,0.25); }
    .card:focus-visible {
      box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3,169,244), 0.3);
      outline: none;
    }

    /* ===== Card Image Area (compact, like store) ===== */
    .card-img {
      height: 90px; flex-shrink: 0; position: relative;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
    }
    .avatar {
      width: 42px; height: 42px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; font-weight: 700; color: #fff;
      box-shadow: 0 3px 10px rgba(0,0,0,0.13);
      overflow: hidden; position: relative;
    }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
    .avatar-letter { font-size: 17px; font-weight: 700; color: #fff; z-index: 1; }
    /* Status badge overlay on image area (bottom left, like store) */
    .img-status-badge {
      position: absolute; bottom: 8px; left: 8px;
      padding: 3px 8px; border-radius: 5px;
      font-size: 11px; font-weight: 600; color: #fff; line-height: 1.3;
    }
    .img-status-badge.state-loaded { background: rgba(76,175,80,0.85); }
    .img-status-badge.state-failed { background: rgba(244,67,54,0.85); }
    .img-status-badge.state-disabled { background: rgba(158,158,158,0.85); }

    /* Category badge at top-left */
    .category-badge {
      position: absolute; top: 8px; left: 8px;
      padding: 3px 8px; border-radius: 5px;
      font-size: 10px; font-weight: 600; color: #fff; text-transform: uppercase;
    }

    /* ===== Card Body ===== */
    .card-body { padding: 10px 12px 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .card-name {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color, #212121);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-meta {
      font-size: 11px; color: var(--secondary-text-color, #727272);
      display: flex; align-items: center; gap: 4px;
      flex-wrap: wrap;
    }
    .card-meta .dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--divider-color); }
    .card-meta .status-label { font-weight: 500; }

    /* ===== Card Footer Action Bar (always visible, like store) ===== */
    .card-footer {
      display: flex; gap: 4px; padding: 8px 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 8px;
    }
    .card-footer .footer-btn {
      flex: 1; min-width: 0;
      padding: 7px 4px; border-radius: 8px;
      font-size: 11px; font-weight: 500;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; touch-action: manipulation;
      display: flex; align-items: center; justify-content: center; gap: 3px;
      transition: all 0.15s;
    }
    .card-footer .footer-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .card-footer .footer-btn.configure:hover { border-color: #2196f3; color: #2196f3; }
    .card-footer .footer-btn.reload:hover { border-color: #ff9800; color: #ff9800; }
    .card-footer .footer-btn.remove:hover { border-color: #f44336; color: #f44336; }
    .card-footer .footer-btn svg { width: 13px; height: 13px; flex-shrink: 0; }
    .card-footer .footer-btn .spinning-mini { display: inline-block; animation: spin 1s linear infinite; font-size: 13px; }
    .card-footer .footer-btn .btn-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* ===== Modal ===== */
    .detail-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      padding: 40px; box-sizing: border-box;
      animation: overlayFadeIn 0.2s ease;
    }
    @media (max-width: 768px) {
      .detail-overlay { padding: 16px; }
    }
    @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px; width: 100%; max-width: 720px;
      max-height: 90vh; min-width: 360px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: modalSlideUp 0.2s ease;
      overflow: hidden;
      user-select: text;
      -webkit-user-select: text;
    }
    @media (min-width: 1024px) {
      .modal { max-width: 860px; }
      .modal.two-col { max-width: 960px; }
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }
    .modal-header-left { display: flex; align-items: center; gap: 12px; }
    .modal-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
    .modal-subtitle { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
    .modal-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color);
      cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .modal-close svg { width: 16px; height: 16px; }
    .modal-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .modal-search { padding: 12px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .modal-body {
      overflow-y: auto; flex: 1; padding: 8px 0;
    }
    .modal-body.grid-2col {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 0;
    }
    @media (min-width: 1024px) {
      .modal-body.grid-2col { grid-template-columns: 1.2fr 0.8fr; }
    }
    .col-left { overflow-y: auto; border-right: 1px solid var(--divider-color, #e0e0e0); padding: 8px 0; }
    .col-right { overflow-y: auto; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .col-title {
      font-size: 12px; font-weight: 600; color: var(--secondary-text-color);
      padding: 8px 20px 12px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .add-subentry-card {
      width: 100%; max-width: 240px;
      background: var(--secondary-background-color, #f5f5f5);
      border: 2px dashed var(--divider-color, #ccc);
      border-radius: 12px; padding: 24px 16px;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      text-align: center; margin-top: 8px;
    }
    .add-subentry-icon { color: var(--primary-color, #03a9f4); opacity: 0.5; }
    .add-subentry-text { font-size: 13px; color: var(--secondary-text-color); line-height: 1.5; }
    .add-subentry-btn {
      padding: 10px 20px; border-radius: 10px; border: none;
      background: var(--primary-color, #03a9f4); color: #fff;
      font-size: 14px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      transition: all 0.15s; touch-action: manipulation;
    }
    .add-subentry-btn:hover { opacity: 0.9; }

    /* Entry rows */
    .entry-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 20px; transition: background 0.1s;
    }
    .entry-row:hover { background: var(--secondary-background-color, #f5f5f5); }
    .entry-row.disabled { opacity: 0.45; }
    .entry-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .entry-info { flex: 1; min-width: 0; }
    .entry-label { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .entry-id {
      font-size: 11px; font-family: monospace;
      color: var(--secondary-text-color); display: block; margin-top: 1px;
    }
    .entry-actions { display: flex; gap: 2px; flex-shrink: 0; }
    .entry-btn {
      width: 28px; height: 28px; padding: 0;
      display: inline-flex; align-items: center; justify-content: center;
      border: none; border-radius: 6px;
      background: none; font-size: 13px; cursor: pointer;
      color: var(--secondary-text-color); transition: all 0.15s;
    }
    .entry-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .entry-btn:not(:disabled):hover { background: rgba(33,150,243,0.08); color: #2196f3; }
    .entry-btn.reload:not(:disabled):hover { background: rgba(255,152,0,0.08); color: #ff9800; }
    .entry-btn.device:not(:disabled):hover { background: rgba(76,175,80,0.08); color: #4caf50; }
    .entry-btn.remove:not(:disabled):hover { background: rgba(244,67,54,0.08); color: #f44336; }
    .entry-btn.enable:not(:disabled):hover { background: rgba(76,175,80,0.08); color: #4caf50; }
    .entry-btn.disable:not(:disabled):hover { background: rgba(158,158,158,0.08); color: #9e9e9e; }

    /* Mobile responsive */
    @media (max-width: 600px) {
      .detail-overlay { padding: 12px; }
      .modal { max-width: 100%; max-height: 92vh; }
      .modal-search { padding: 10px 16px; }
      .modal-body { padding: 4px 0; }
      .entry-btn { width: 32px; height: 32px; }
      .modal-body.grid-2col { grid-template-columns: 1fr; }
      .col-left { border-right: none; border-bottom: 1px solid var(--divider-color, #e0e0e0); max-height: 50vh; }
    }

    /* ===== Add Integration Side Panel ===== */
    /* Add integration search input */
    .add-search-input {
      width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); font-size: 14px; outline: none; box-sizing: border-box;
    }
    .add-search-input:focus { border-color: var(--primary-color, #03a9f4); }
    .add-panel-count { padding: 8px 20px; font-size: 12px; color: var(--secondary-text-color); flex-shrink: 0; }
    .add-panel-list { flex: 1; overflow-y: auto; padding: 4px 0; }
    .add-loading, .add-empty { padding: 40px; text-align: center; color: var(--secondary-text-color); }
    .add-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 20px; cursor: pointer; transition: background 0.1s;
    }
    .add-item:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .add-item-name { font-size: 14px; font-weight: 500; color: var(--primary-text-color); }
    .add-item-domain {
      font-size: 12px; background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4); padding: 2px 8px; border-radius: 4px; margin-left: auto;
    }

    @media (max-width: 600px) {
      .controls { flex-direction: column; align-items: flex-start; }
      .controls-right { width: 100%; }
      .search input { width: 100%; }
      .card-img { height: 100px; }
      .avatar { width: 40px; height: 40px; font-size: 17px; }
      .card-footer .footer-btn { min-height: 44px; font-size: 12px; }
      .card-footer .footer-btn .btn-label { display: inline; }
      .chip { font-size: 12px; padding: 6px 14px; }
      .detail-overlay { padding: 12px; }
      .modal { max-width: 100%; max-height: 92vh; }
    }
  `];
}

customElements.define('integrations-list', IntegrationsList);