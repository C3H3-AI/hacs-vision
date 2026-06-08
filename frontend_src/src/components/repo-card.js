import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { getCategoryColor } from '../shared/constants.js';

class RepoCard extends LitElement {
  static properties = {
    repo: { type: Object },
    _isFavorite: { type: Boolean, state: true },
    _installing: { type: Boolean },
    _favorites: { type: Array, state: true },
    selected: { type: Boolean },
    showCheckbox: { type: Boolean },
  };

  constructor() {
    super();
    this.repo = {};
    this._isFavorite = false;
    this._installing = false;
    this._favorites = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    // Load favorites from server
    await this._loadFavorites();
  }

  async _loadFavorites() {
    try {
      const result = await api.getFavorites();
      this._favorites = Array.isArray(result) ? result : (result.favorites || []);
    } catch(e) {
      this._favorites = [];
    }
    this._updateFavoriteState();
  }

  _updateFavoriteState() {
    if (this.repo) {
      this._isFavorite = this._favorites.includes(this.repo.id || this.repo.full_name);
    }
  }

  willUpdate(changedProps) {
    if (changedProps.has('repo') && this.repo) {
      this._updateFavoriteState();
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
      overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar .initials { display: flex; }
    .badge {
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff;
      text-transform: uppercase; flex-shrink: 0;
    }
    .badge.integration { background: #1565c0; }
    .badge.plugin { background: #7b1fa2; }
    .badge.theme { background: #2e7d32; }
    .badge.appdaemon { background: #e65100; }
    .badge.netdaemon { background: #00838f; }
    .badge.python_script { background: #f9a825; color: #333; }
    .badge.template { background: #6a1b9a; }

    .installed-badge {
      position: absolute; bottom: 10px; left: 10px;
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
      background: rgba(76,175,80,0.15); color: #4caf50;
    }

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

  _getIconUrl(repo) {
    // For integrations with a domain, use HA brands icon
    const domain = repo.domain;
    if (domain && repo.category === 'integration') {
      return `https://brands.home-assistant.io/${domain}/icon.png`;
    }
    return null;
  }

  _getCategoryLabel(category) {
    const labels = {
      integration: t('catIntegration'), plugin: t('catPlugin'), theme: t('catTheme'),
      appdaemon: t('catAppDaemon'), netdaemon: t('catNetDaemon'),
      python_script: t('catPython'), template: t('catTemplate'),
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

  async _handleFavorite(e) {
    e.stopPropagation();
    const repoId = this.repo.id || this.repo.full_name;
    // Toggle favorite via server
    const favs = [...this._favorites];
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
      this._favorites = favs;
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
          <div class="avatar" style="background: ${categoryColor}">
            ${this._getIconUrl(r) ? html`
              <img src="${this._getIconUrl(r)}" @error=${(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} alt="">
              <span class="initials" style="display:none">${this._getInitials(name)}</span>
            ` : this._getInitials(name)}
          </div>
          ${isInstalled ? html`<span class="installed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${t('installed')}</span>` : ''}
          <button class="fav-btn ${this._isFavorite ? 'active' : ''}"
                  @click=${this._handleFavorite}
                  title=${this._isFavorite ? t('favOn') : t('favOff')}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>

        <div class="content">
          <div class="name" title=${name}>${name}</div>
          <div class="fullname">${r.full_name || ''}</div>
          <div class="desc">${desc || t('noDesc')}</div>
          <div class="meta">
            <div class="tags">
              <span class="tag">${category}</span>
              ${r.is_custom ? html`<span class="custom-tag">${t('customBadge')}</span>` : ''}
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
          </div>
        </div>

        <div class="actions">
          <button class="action-btn readme-btn" @click=${e => this._handleAction(e, 'readme')} title="README">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          ${isInstalled ? html`
            ${isUpdateAvailable ? html`
              <button class="action-btn primary" @click=${e => this._handleAction(e, 'update')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                <span class="label">${t('update')}</span>
              </button>
            ` : ''}
            ${r.config_entry_id ? html`
              <button class="action-btn" @click=${e => { e.stopPropagation(); window.open('/config/integrations/dashboard/settings?config_entry=' + r.config_entry_id, '_blank'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="label">${t('addIntegration')}</span>
              </button>
            ` : ''}
            <button class="action-btn" @click=${e => this._handleAction(e, 'uninstall')} style="color:#f44336;border-color:#f44336;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span class="label">${t('remove')}</span>
            </button>
          ` : html`
            <button class="action-btn primary ${this._installing ? 'installing' : ''}"
                    @click=${e => this._handleAction(e, 'install')} ?disabled=${this._installing}>
              ${this._installing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${t('installing')}`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="label">${t('install')}</span>`}
            </button>
          `}
        </div>
      </div>
    `;
  }
}

customElements.define('repo-card', RepoCard);
