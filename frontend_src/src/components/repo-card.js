import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { getCategoryColor } from '../shared/constants.js';

class RepoCard extends LitElement {
  static properties = {
    repo: { type: Object },
    _isFavorite: { type: Boolean, state: true },
    _starred: { type: Boolean, state: true },
    _starring: { type: Boolean, state: true },
    _installing: { type: Boolean },
    _updating: { type: Boolean, state: true },
    _removing: { type: Boolean, state: true },
    favorites: { type: Array },  // Received from parent — no independent API call
    selected: { type: Boolean },
    showCheckbox: { type: Boolean },
    viewMode: { type: String },
    renamedFrom: { type: String },
    showRemoveBtn: { type: Boolean },
  };

  constructor() {
    super();
    this.repo = {};
    this._isFavorite = false;
    this._starred = false;
    this._starring = false;
    this._installing = false;
    this._updating = false;
    this._removing = false;
    this.favorites = [];  // Set by parent component
    this.viewMode = 'store'; // 'store' | 'installed' | 'management' | 'updates'
    this.renamedFrom = null;
    this.showRemoveBtn = false;
  }

  _updateFavoriteState() {
    if (this.repo && this.favorites) {
      this._isFavorite = this.favorites.includes(this.repo.id || this.repo.full_name);
    }
  }

  willUpdate(changedProps) {
    if (changedProps.has('repo') || changedProps.has('favorites')) {
      this._updateFavoriteState();
    }
    if (changedProps.has('repo')) {
      // Reset transient state when repo data refreshes (operation completed)
      this._updating = false;
      this._removing = false;
    }
  }

  static styles = css`
    :host { display: block; touch-action: manipulation; }
    .card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
      box-sizing: border-box;
      display: flex; flex-direction: column;
      position: relative; min-height: 290px;
    }
    .card.custom-repo {
      border-left: 3px solid #ff6f00;
    }
    .card:hover { border-color: var(--primary-color, #03a9f4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

    .img-container {
      height: 120px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
      position: relative;
    }
    .avatar {
      width: 52px; height: 52px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden; background: transparent;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar .initials {
      display: flex; width: 100%; height: 100%;
      align-items: center; justify-content: center;
      border-radius: 50%;
    }
    .badge {
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff;
      text-transform: uppercase; flex-shrink: 0;
    }
    .badge.integration { background: #1565c0; }
    .badge.plugin { background: #7b1fa2; }
    .badge.theme { background: #2e7d32; }
    .badge.template { background: #6a1b9a; }

    /* Status badge — auto switches between states, only one shown */
    .status-badge {
      position: absolute; bottom: 10px; left: 10px;
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
    }
    .status-badge.installed { background: rgba(76,175,80,0.15); color: #4caf50; }
    .status-badge.update-available { background: rgba(255,152,0,0.15); color: #ff9800; }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: #f44336; }
    .status-badge.pending-reload { background: rgba(255,152,0,0.15); color: #ff9800; }

    /* Right-side independent badges — symmetrical with status-badge */
    .right-tags {
      position: absolute; bottom: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 2px;
      align-items: flex-end; pointer-events: none; z-index: 2;
    }
    .right-tags .tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      white-space: nowrap; line-height: 1.5;
    }
    .right-tags .tag.configured { background: rgba(33,150,243,0.15); color: #2196f3; }
    .right-tags .tag.load-failed { background: rgba(244,67,54,0.15); color: #f44336; }
    .right-tags .tag.custom-tag { background: rgba(255,111,0,0.15); color: #ff6f00; font-weight: 600; }

    .top-bar {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; align-items: center; gap: 6px;
      padding: 10px; z-index: 2;
    }
    .checkbox {
      width: 18px; height: 18px; border-radius: 4px;
      border: 2px solid rgba(255,255,255,0.7); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s;
      background: rgba(0,0,0,0.25);
      -webkit-appearance: none; appearance: none; touch-action: manipulation;
    }
    .checkbox:checked {
      background: var(--primary-color); border-color: var(--primary-color);
    }
    .checkbox:checked::after {
      content: '✓'; color: #fff; font-size: 12px; font-weight: 700;
    }

    .fav-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(255,255,255,0.85);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }
    .fav-btn:hover { transform: scale(1.1); }
    .fav-btn svg { width: 18px; height: 18px; transition: all 0.2s; }
    .fav-btn.active svg { fill: #ff9800; color: #ff9800; }
    .fav-btn:not(.active) svg { fill: none; color: var(--secondary-text-color, #727272); }

    .remove-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(244,67,54,0.12);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0; color: #f44336;
      font-size: 16px; font-weight: 700; line-height: 1;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }
    .remove-btn:hover { background: rgba(244,67,54,0.25); transform: scale(1.1); }

    .content { padding: 14px; flex: 1; display: flex; flex-direction: column; }

    .name {
      font-size: 15px; font-weight: 600; color: var(--primary-text-color, #212121);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;
    }

    .fullname {
      font-size: 11px; color: var(--secondary-text-color, #727272);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;
      min-height: 16px;
    }

    .desc {
      font-size: 12px; color: var(--secondary-text-color, #727272);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 10px; line-height: 1.5; height: 36px;
    }

    .meta {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 4px; margin-top: auto;
    }
    .author { font-size: 12px; color: var(--primary-color, #03a9f4); }
    .stars {
      display: flex; align-items: center; gap: 3px;
      font-size: 11px; color: var(--secondary-text-color, #727272);
    }
    .stars svg { width: 14px; height: 14px; fill: #ff9800; color: #ff9800; }

    .tags { display: flex; gap: 4px; flex-wrap: wrap; }
    .tag {
      font-size: 9px; padding: 2px 7px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4); border-radius: 4px;
    }
    .custom-tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      background: #ff6f00; color: #fff; font-weight: 700;
    }
    .topic-tag {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }

    .actions {
      display: flex; gap: 6px;
      padding: 8px 14px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: auto; background: var(--card-background-color, #fff);
    }
    .action-btn {
      flex: 1; min-width: 0; padding: 8px 4px; border-radius: 10px;
      font-size: 12px; text-align: center; justify-content: center;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 4px;
      touch-action: manipulation;
    }
    .action-btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
    .action-btn.primary {
      background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4); color: #fff;
    }
    .action-btn.primary:hover { opacity: 0.9; }
    .action-btn.readme-btn {
      flex: 0 0 auto; min-width: auto; padding: 8px 10px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      border-color: transparent; color: var(--primary-color, #03a9f4);
    }
    .action-btn.readme-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .action-btn .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .action-btn.star-btn { flex: 0 0 auto; min-width: auto; padding: 8px 10px; }
    .action-btn.star-btn.starred { background: rgba(255,152,0,0.1); border-color: #ff9800; color: #ff9800; }

    .action-btn.installing {
      opacity: 0.7; cursor: not-allowed;
      animation: btnPulse 1.5s infinite;
    }
    @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

    @media (max-width: 768px) {
      :host { width: 100%; max-width: 100%; min-width: 0; }
      .card { width: 100%; max-width: 100%; min-height: 270px; box-sizing: border-box; }
      .img-container { height: 100px; }
      .avatar { width: 44px; height: 44px; font-size: 20px; }
      .content { padding: 10px; }
      .name { font-size: 14px; }
      .desc { font-size: 11px; height: 32px; }
      .fullname { min-height: 15px; font-size: 10px; }
      .action-btn {
        min-height: 44px;
        padding: 10px 6px;
        font-size: 11px;
      }
      .action-btn .label { display: none; }
      .fav-btn { width: 36px; height: 36px; }
      .fav-btn svg { width: 20px; height: 20px; }
      .remove-btn { width: 36px; height: 36px; font-size: 18px; }
    }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;

  _getInitials(name) {
    if (!name) return '?';
    const parts = name.split('/');
    const last = parts[parts.length - 1] || name;
    return last.charAt(0).toUpperCase();
  }

  _getIconUrls(repo) {
    // Returns ordered array of icon URLs to try, in priority order
    const domain = repo.domain;
    const fullName = repo.full_name || repo.repository_manifest?.full_name || '';
    const owner = fullName.split('/')[0];
    const repoName = fullName.split('/')[1] || '';
    const branch = repo.default_branch || 'main';
    const isCustom = repo.custom || repo.is_custom || (owner && owner !== 'home-assistant');

    if (!domain || repo.category !== 'integration') return [];

    const urls = [];

    // 1. HA brands CDN — works for BOTH official and many popular custom integrations
    urls.push(`https://brands.home-assistant.io/${domain}/icon.png`);

    if (isCustom) {
      // 2. GitHub raw: brand icon from the repo itself (use actual default branch)
      if (owner && repoName) {
        urls.push(`https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/custom_components/${domain}/brand/icon.png`);
      }
      // 3. Local fallback (only works if integration is installed on this HA)
      urls.push(`/api/hacs_vision_brand/${domain}`);
      // 4. GitHub owner avatar as last resort
      if (owner) urls.push(`https://github.com/${owner}.png`);
    }

    return urls;
  }

  _getStatusBadge(repo) {
    if (repo.pending_restart) return { label: t('statusPendingRestart'), cls: 'pending-restart' };
    // Check frontend-side pending reload marker (for non-integration items)
    const pendingReloads = api.getPendingReloads();
    if (repo.installed && pendingReloads.length > 0 && repo.full_name && pendingReloads.includes(repo.full_name)) {
      return { label: t('statusPendingReload'), cls: 'pending-reload' };
    }
    if (repo.installed && (repo.has_update || (repo.installed_version && repo.latest_version && repo.installed_version !== repo.latest_version))) {
      return { label: t('statusPendingUpgrade'), cls: 'update-available' };
    }
    if (repo.installed) return { label: t('installed'), cls: 'installed' };
    return null; // not installed → no status badge
  }

  _getCategoryLabel(category) {
    const labels = {
      integration: t('catIntegration'), plugin: t('catPlugin'), theme: t('catTheme'),
      template: t('catTemplate'),
      dashboard: t('catDashboard'),
    };
    return labels[category] || category;
  }

  _handleAction(e, action) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent(action, {
      detail: { repo: this.repo },
      bubbles: true, composed: true,
    }));
  }

  async _handleStar(e) {
    e.stopPropagation();
    if (this._starring) return;
    this._starring = true;
    const repo = this.repo.full_name;
    if (!repo) { this._starring = false; return; }
    try {
      if (this._starred) {
        await api.unstarRepo(repo);
        this._starred = false;
      } else {
        await api.starRepo(repo);
        this._starred = true;
      }
      // Dispatch event for list view sync
      this.dispatchEvent(new CustomEvent('star-changed', {
        detail: { repo: this.repo, starred: this._starred },
        bubbles: true, composed: true,
      }));
    } catch(e) {
      const { showToast } = await import('../hacs-vision-panel.js');
      showToast(`Star 失败: ${e.message}`, 'error');
    }
    this._starring = false;
  }

  async _handleFavorite(e) {
    e.stopPropagation();
    const repoId = this.repo.id || this.repo.full_name;
    // Toggle favorite via server
    const favs = [...this.favorites];
    const idx = favs.indexOf(repoId);
    if (idx >= 0) {
      favs.splice(idx, 1);
      this._isFavorite = false;
    } else {
      favs.push(repoId);
      this._isFavorite = true;
    }
    try {
      await api.setFavorites(favs);
      this.favorites = favs;
    } catch(e) {
      // Revert on failure
      this._isFavorite = !this._isFavorite;
    }
    this.dispatchEvent(new CustomEvent('favorite', {
      detail: { repo: this.repo, isFavorite: this._isFavorite },
      bubbles: true, composed: true,
    }));
  }

  _handleCardClick() {
    this.dispatchEvent(new CustomEvent('detail', {
      detail: { repo: this.repo },
      bubbles: true, composed: true,
    }));
  }

  updated(changed) {
    if (changed.has('repo') && this.repo?.full_name) {
      this._checkStarred();
    }
  }

  async _checkStarred() {
    try {
      const result = await api.checkStarred(this.repo.full_name);
      if (result?.starred === true || result?.starred === false) {
        this._starred = result.starred;
      }
    } catch(e) { /* not logged in or network error */ }
  }

  render() {
    const r = this.repo;
    const name = r.manifest_name || r.repository_manifest?.name || r.full_name || r.name || 'unknown';
    const desc = r.description || '';
    const category = r.category || 'integration';
    const stars = r.stars || r.stargazers_count || 0;
    const downloads = r.downloads || 0;
    const isInstalled = r.installed || false;
    const isUpdateAvailable = isInstalled && (
      r.has_update ||
      (r.installed_version && r.latest_version && r.installed_version !== r.latest_version)
    );
    const categoryColor = getCategoryColor(category);

    const iconUrls = this._getIconUrls(r);

    return html`
      <div class="card${r.is_custom ? ' custom-repo' : ''}" @click=${this._handleCardClick}>
        <div class="img-container">
          ${this.showCheckbox ? html`
            <div class="top-bar">
              <input type="checkbox" class="checkbox" ?checked=${this.selected}
                     @click=${(e) => e.stopPropagation()}
                     @change=${() => this.dispatchEvent(new CustomEvent('check-change', { detail: { fullName: this.repo?.full_name }, bubbles: true, composed: true }))}>
              <span class="badge ${category}">${this._getCategoryLabel(category)}</span>
            </div>
          ` : html`<span class="badge ${category}" style="position:absolute;top:10px;left:10px;">${this._getCategoryLabel(category)}</span>`}
          <div class="avatar">
            ${iconUrls.length > 0 ? html`
              <img class="repo-icon" src="${iconUrls[0]}"
                data-fallback-chain="${iconUrls.slice(1).join(',')}"
                data-fb-idx="0"
                @error=${(e) => {
                  const chain = (e.target.dataset.fallbackChain || '').split(',');
                  let idx = parseInt(e.target.dataset.fbIdx || '0');
                  idx++;
                  if (idx < chain.length && chain[idx]) {
                    e.target.dataset.fbIdx = String(idx);
                    e.target.src = chain[idx];
                  } else {
                    e.target.style.display = 'none';
                    const el = e.target.parentElement.querySelector('.initials');
                    if (el) { el.style.display = 'flex'; el.style.background = '${categoryColor}'; }
                  }
                }} alt="">
              <span class="initials" style="display:none">${this._getInitials(name)}</span>
            ` : html`
              <span class="initials" style="display:flex;background:${categoryColor}">${this._getInitials(name)}</span>
            `}
          </div>
          ${this._getStatusBadge(r) ? html`<span class="status-badge ${this._getStatusBadge(r).cls}">${this._getStatusBadge(r).label}</span>` : ''}
          <!-- Right-side badges (symmetrical with status-badge) -->
          <div class="right-tags">
            ${r.config_entry_id ? html`<span class="tag configured">${t('badgeConfigured')}</span>` : ''}
            ${r.load_failed ? html`<span class="tag load-failed">${t('badgeLoadFailed')}</span>` : ''}
            ${r.is_custom && this.viewMode !== 'management' ? html`<span class="tag custom-tag">${t('customBadge')}</span>` : ''}
            ${this.renamedFrom ? html`<span class="tag" style="background:#ff9800;color:#fff;font-weight:600;display:flex;align-items:center;gap:2px;"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.renamedFrom}</span>` : ''}
          </div>
          ${this.viewMode !== 'management' ? html`
          <button class="fav-btn ${this._isFavorite ? 'active' : ''}"
                  @click=${this._handleFavorite}
                  title=${this._isFavorite ? t('favOn') : t('favOff')}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          ` : ''}
        </div>

        <div class="content">
          <div class="name" title=${name}>${name}</div>
          <div class="fullname">${r.full_name || ''}</div>
          <div class="desc">${desc || t('noDesc')}</div>
          <div class="meta">
            <div class="tags">
              ${r.topics && r.topics.length ? r.topics.slice(0, 3).map(t => html`<span class="topic-tag">${t}</span>`) : ''}
            </div>
            <span class="stars">
              <svg viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
              ${typeof stars === 'number' ? stars.toLocaleString() : stars}
            </span>
            ${downloads ? html`
              <span class="stars">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                ${downloads.toLocaleString()}
              </span>
            ` : ''}
            ${this.viewMode !== 'store' ? html`
              <span style="font-size:10px;color:var(--secondary-text-color);display:flex;align-items:center;gap:3px;">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                ${isUpdateAvailable
                  ? html`${r.installed_version || '?'} → <span style="color:var(--primary-color);font-weight:600;">${r.latest_version || '?'}</span>`
                  : r.installed_version || t('installed')}
              </span>
            ` : ''}
          </div>
        </div>

        ${this.viewMode === 'management' ? html`
        <div class="actions">
          ${this.showRemoveBtn ? html`
            <button class="action-btn ${this._removing ? 'installing' : ''}"
              @click=${e => { this._removing = true; this._handleAction(e, 'remove-repo'); }} ?disabled=${this._removing}
              style="color:#f44336;border-color:#f44336;flex:1;">
              ${this._removing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing ? (t('removing') || '移除中…') : (this.viewMode === 'management' ? t('removeRepo') : t('remove'))}</span>
            </button>
          ` : ''}
        </div>
        ` : html`
        <div class="actions">
          ${this.viewMode === 'management' ? html`
          <button class="action-btn readme-btn" @click=${e => this._handleAction(e, 'readme')} title="README">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          ` : ''}
          ${this.viewMode === 'store' ? html`
            <button class="action-btn star-btn ${this._starred ? 'starred' : ''}"
              @click=${this._handleStar} ?disabled=${this._starring}
              title=${this._starred ? t('unstar') || '取消星标' : t('star') || '星标'}>
              ${this._starring
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : html`<svg viewBox="0 0 20 20" fill="${this._starred ? '#ff9800' : 'none'}" stroke="#ff9800" stroke-width="1.5"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>`}
              <span class="label">${this._starred ? (t('starred') || '已星标') : (t('starBtn') || '星标')}</span>
            </button>
          ` : ''}
          ${isInstalled ? html`
            ${isUpdateAvailable ? html`
              <button class="action-btn primary ${this._updating ? 'installing' : ''}"
                @click=${e => { this._updating = true; this._handleAction(e, 'update'); }} ?disabled=${this._updating}>
                ${this._updating
                  ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                  : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`}
                <span class="label">${this._updating ? t('updatingProgress') : t('update')}</span>
              </button>
            ` : ''}
            ${category === 'integration' ? html`
              <button class="action-btn" @click=${e => this._handleAction(e, r.config_entry_id ? 'configure' : 'add-integration')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="label">${r.config_entry_id ? t('addIntegration') : t('addIntegrationHint')}</span>
              </button>
            ` : ''}
            <button class="action-btn ${this._removing ? 'installing' : ''}"
              @click=${e => { this._removing = true; this._handleAction(e, 'uninstall'); }} ?disabled=${this._removing}
              style="color:#f44336;border-color:#f44336;">
              ${this._removing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing ? t('removing') || '卸载中…' : (this.viewMode === 'management' ? t('removeRepo') : t('remove'))}</span>
            </button>
            ${this.viewMode === 'management' ? html`
            <button class="action-btn" @click=${e => this._handleAction(e, 'ignore')} title="${t('ignore')}"
              style="flex:0 0 auto;padding:8px 10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>
            ` : ''}
          ` : html`
            <button class="action-btn primary ${this._installing ? 'installing' : ''}"
                    @click=${e => this._handleAction(e, 'install')} ?disabled=${this._installing}>
              ${this._installing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('installing')}`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="label">${t('install')}</span>`}
            </button>
          `}
        </div>
        `}
      </div>
    `;
  }
}

customElements.define('repo-card', RepoCard);
