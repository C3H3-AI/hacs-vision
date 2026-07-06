import { LitElement, html, css } from 'lit';
import { api } from '../api.js';
import { t } from '../i18n.js';
import { getCategoryColor } from '../shared/constants.js';

class RepoCard extends LitElement {
  static properties = {
    repo: { type: Object },
    starred: { type: Boolean },  // Passed from parent — source of icon state
    _starred: { type: Boolean, state: true },
    _starring: { type: Boolean, state: true },
    _installing: { type: Boolean },
    _updating: { type: Boolean, state: true },
    _removing: { type: Boolean, state: true },
    selected: { type: Boolean },
    showCheckbox: { type: Boolean },
    viewMode: { type: String },
    renamedFrom: { type: String },
    showRemoveBtn: { type: Boolean },
    configEntries: { type: Object },
    autoUpdateRepos: { type: Array },
  };

  constructor() {
    super();
    this.repo = {};
    this.starred = false;
    this._starred = false;
    this._starring = false;
    this._installing = false;
    this._updating = false;
    this._removing = false;
    this.viewMode = 'store';
    this.renamedFrom = null;
    this.showRemoveBtn = false;
    this.configEntries = {};
    this.autoUpdateRepos = [];
  }

  willUpdate(changedProps) {
    // Sync parent's starred prop to internal _starred
    if (changedProps.has('starred') && this.starred !== undefined && this.starred !== null) {
      this._starred = this.starred;
    }
    if (changedProps.has('repo')) {
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
    .status-badge.update-available { background: rgba(255,152,0,0.15); color: var(--warning-color,#ff9800); }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: var(--error-color,#f44336); }
    .status-badge.pending-reload { background: rgba(255,152,0,0.15); color: var(--warning-color,#ff9800); }

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
    .right-tags .tag.load-failed { background: rgba(244,67,54,0.15); color: var(--error-color,#f44336); }
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

    /* ===== Star/Fav button (merged, top-right) ===== */
    .star-fav-btn {
      position: absolute; top: 8px; right: 8px; z-index: 2;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(0,0,0,0.25); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: transform 0.15s;
    }
    .star-fav-btn:hover { transform: scale(1.15); }
    .star-fav-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .star-fav-btn svg { width: 18px; height: 18px; transition: all 0.2s; }
    .star-fav-btn.starred svg { fill: var(--warning-color,#ff9800); color: var(--warning-color,#ff9800); }
    .star-fav-btn:not(.starred) svg { fill: none; color: #fff; }

    .remove-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(244,67,54,0.12);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0; color: var(--error-color,#f44336);
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
    .stars svg { width: 14px; height: 14px; fill: var(--warning-color,#ff9800); color: var(--warning-color,#ff9800); }

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
    .rename-tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      background: var(--warning-color, #ff9800); color: #fff;
      font-weight: 600; display: flex; align-items: center; gap: 2px;
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
    .action-btn.au-active {
      background: rgba(76,175,80,0.12); border-color: #4caf50; color: #4caf50;
    }
    .action-btn.au-active:hover {
      background: rgba(76,175,80,0.25);
    }
    .action-btn.readme-btn {
      flex: 0 0 auto; min-width: auto; padding: 8px 10px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      border-color: transparent; color: var(--primary-color, #03a9f4);
    }
    .action-btn.readme-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .action-btn .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* Report Issue button - subtle text link style */
    .issue-btn { background: none; border: none; color: var(--secondary-text-color); cursor: pointer; font-size: 11px; padding: 2px 6px; text-decoration: none; opacity: 0.6; transition: opacity 0.2s; }
    .issue-btn:hover { opacity: 1; color: var(--primary-color, #03a9f4); text-decoration: underline; }
    /* Issue dialog overlay */
    .issue-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999; display: flex; align-items: center; justify-content: center; }
    .issue-dialog { background: var(--card-background-color,#fff); border-radius: 12px; padding: 20px; max-width: 480px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
    .issue-dialog h3 { margin: 0 0 12px; font-size: 16px; color: var(--primary-text-color); }
    .issue-dialog input, .issue-dialog textarea { width: 100%; box-sizing: border-box; padding: 8px 10px; margin-bottom: 10px; border: 1px solid var(--divider-color,#e0e0e0); border-radius: 6px; background: var(--input-background-color,#f5f5f5); color: var(--primary-text-color); font-size: 14px; }
    .issue-dialog textarea { min-height: 60px; resize: vertical; }
    .issue-dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .issue-dialog-actions button { padding: 6px 16px; border-radius: 6px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); cursor: pointer; font-size: 13px; }
    .issue-dialog-actions button.primary { background: var(--primary-color,#03a9f4); color: #fff; border-color: var(--primary-color,#03a9f4); }
    .issue-dialog-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
    .issue-dialog .error { color: #f44336; font-size: 12px; margin-bottom: 8px; }

    .action-btn.installing {
      opacity: 0.7; cursor: not-allowed;
      animation: btnPulse 1.5s infinite;
    }
    @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

    /* Auto-update toggle row (in card body, not actions bar) */
    .au-toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0 4px; margin: 0 0 2px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      font-size: 12px;
    }
    .au-toggle-row .au-label {
      color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px;
    }
    .au-toggle-row .au-label svg {
      width: 14px; height: 14px;
    }
    .au-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; cursor: pointer; }
    .au-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .au-toggle .slider {
      position: absolute; inset: 0; background: var(--divider-color, #ccc);
      border-radius: 20px; transition: 0.3s; cursor: pointer;
    }
    .au-toggle .slider::before {
      content: ''; position: absolute; height: 16px; width: 16px;
      left: 2px; bottom: 2px; background: #fff;
      border-radius: 50%; transition: 0.3s;
    }
    .au-toggle input:checked + .slider { background: #4caf50; }
    .au-toggle input:checked + .slider::before { transform: translateX(16px); }

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
      .star-fav-btn { width: 36px; height: 36px; }
      .star-fav-btn svg { width: 20px; height: 20px; }
      .remove-btn { width: 36px; height: 36px; font-size: 18px; }
    }

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
    if (repo.installed && repo.has_update) {
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

  /** Decide whether to show the config/add-integration button based on config entry capabilities */
  _renderConfigButton(r) {
    // Data not loaded yet → no button
    if (!this.configEntries || typeof this.configEntries !== 'object' || Object.keys(this.configEntries).length === 0) {
      return '';
    }

    const entries = this.configEntries?.[r.domain];
    const hasEntry = entries && entries.length > 0;
    const entry = hasEntry ? entries[0] : null;

    // Has a config entry → check if it supports any configuration
    if (hasEntry && entry) {
      const hasAnyCapability = entry.supports_options || entry.supports_reconfigure ||
        (entry.supported_subentry_types && entry.supported_subentry_types.length > 0);
      if (!hasAnyCapability) {
        return '';
      }
    }

    // Show the config button
    return html`
      <button class="action-btn" @click=${e => this._handleAction(e, hasEntry ? 'configure' : 'add-integration')}
        style="${hasEntry ? '' : 'background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span class="label">${hasEntry ? t('configure') : t('addIntegrationHint')}</span>
      </button>
    `;
  }

  async _handleReportIssue() {
    const r = this.repo;
    const fullName = r.full_name || (r.repository && r.repository.replace('https://github.com/', ''));
    if (!fullName || !fullName.includes('/')) {
      this._showCardToast('Invalid repository', 'error');
      return;
    }
    // Check if GitHub token exists first
    try {
      const user = await api.get('github/user', { suppressNetworkError: true });
      if (!user || user.error) {
        this._showCardToast(t('issueNotLoggedIn'), 'error');
        return;
      }
    } catch {
      this._showCardToast(t('issueNotLoggedIn'), 'error');
      return;
    }
    // Delegate to parent panel's full Issue dialog
    this.dispatchEvent(new CustomEvent('report-issue', {
      bubbles: true, composed: true,
      detail: { repo: r }
    }));
  }

  _showCardToast(msg, type) {
  }

  async _handleStar(e) {
    e.stopPropagation();
    if (this._starring) return;
    this._starring = true;
    const repo = this.repo.full_name;
    const repoId = repo;  // Always use full_name for favorites storage (compatible with GitHub Star API)
    if (!repo) { this._starring = false; return; }

    // 1. Toggle icon + update count immediately
    this._starred = !this._starred;
    if (this.repo) {
      this.repo.stars = this._starred
        ? (this.repo.stars || this.repo.stargazers_count || 0) + 1
        : Math.max(0, (this.repo.stars || this.repo.stargazers_count || 0) - 1);
    }
    this.requestUpdate();

    // 2. Parallel: GitHub(后端自己判断Token) + 本地收藏
    try {
      const starOp = this._starred ? api.starRepo(repo) : api.unstarRepo(repo);
      const [favsResp] = await Promise.allSettled([api.getFavorites(), starOp]);
      const favsResult = favsResp.status === 'fulfilled' ? favsResp.value : { favorites: [] };
      const favs = Array.isArray(favsResult) ? [...favsResult] : [...(favsResult?.favorites || [])];
      if (this._starred) {
        if (!favs.includes(repoId)) favs.push(repoId);
      } else {
        const idx = favs.indexOf(repoId);
        if (idx >= 0) favs.splice(idx, 1);
      }
      await api.setFavorites(favs);
    } catch(e) { /* ignore */ }

    // 3. Dispatch sync event
    this.dispatchEvent(new CustomEvent('star-changed', {
      detail: { repo: this.repo, starred: this._starred },
      bubbles: true, composed: true,
    }));
    // Notify parent panel to refresh header count
    this.dispatchEvent(new CustomEvent('favorite', {
      detail: { isFavorite: this._starred, repo: this.repo },
      bubbles: true, composed: true,
    }));
    this._starring = false;
  }

  _handleCardClick() {
    this.dispatchEvent(new CustomEvent('detail', {
      detail: { repo: this.repo },
      bubbles: true, composed: true,
    }));
  }

  _handleAutoUpdateToggle(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('auto-update-toggle', {
      detail: { repo: this.repo },
      bubbles: true, composed: true,
    }));
  }

  get _isAutoUpdate() {
    return Array.isArray(this.autoUpdateRepos) && this.autoUpdateRepos.includes(this.repo?.full_name);
  }

  updated(changed) {
    // Placeholder for future post-render work
  }

  render() {
    const r = this.repo;
    const name = r.manifest_name || r.repository_manifest?.name || r.full_name || r.name || 'unknown';
    const desc = r.description || '';
    const category = r.category || 'integration';
    const stars = r.stars || r.stargazers_count || 0;
    const downloads = r.downloads || 0;
    const isInstalled = r.installed || false;
    const isUpdateAvailable = isInstalled && r.has_update;
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
                    if (el) { el.style.display = 'flex'; el.style.background = categoryColor; }
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
            ${r.source === 'gitee' ? html`<span class="tag" style="background:#c71d23;color:#fff;font-size:9px;">Gitee</span>` : ''}
            ${r.is_custom && this.viewMode !== 'management' ? html`<span class="tag custom-tag">${t('customBadge')}</span>` : ''}
            ${this.renamedFrom ? html`<span class="tag rename-tag"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.renamedFrom}</span>` : ''}
          </div>
          ${this.viewMode !== 'management' ? html`
          <button class="star-fav-btn ${this._starred ? 'starred' : ''}"
                  @click=${this._handleStar} ?disabled=${this._starring}
                  title=${this._starred ? t('starred') : t('starBtn')}>
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
          ${this.viewMode !== 'management' && isInstalled ? html`
          <div class="au-toggle-row">
            <span class="au-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              ${t('autoUpdateSection')}
            </span>
            <label class="au-toggle" @click=${(e) => e.stopPropagation()}>
              <input type="checkbox" .checked=${this._isAutoUpdate}
                @change=${this._handleAutoUpdateToggle}>
              <span class="slider"></span>
            </label>
          </div>
          ` : ''}
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
          ${r.pending_restart ? html`
            <button class="action-btn primary" @click=${e => { e.stopPropagation(); this.dispatchEvent(new CustomEvent('restart-ha', { bubbles: true, composed: true })); }}
              style="flex:1;background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              <span class="label">${t('pendingRestart') }</span>
            </button>
          ` : ''}
          ${this.showRemoveBtn ? html`
            <button class="action-btn ${this._removing ? 'installing' : ''}"
              @click=${e => { this._removing = true; this._handleAction(e, 'remove-repo'); }} ?disabled=${this._removing}
              style="color:var(--error-color,#f44336);border-color:var(--error-color,#f44336);flex:1;">
              ${this._removing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing ? (t('removing') ) : (this.viewMode === 'management' ? t('removeRepo') : t('remove'))}</span>
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
          ${category === 'plugin' && !isInstalled ? html`
            <button class="action-btn" @click=${e => this._handleAction(e, 'preview')} title="${t('preview')}"
              style="flex:0 0 auto;padding:8px 10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
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
            ${category === 'integration' && r.domain ? html`
              ${this._renderConfigButton(r)}
            ` : ''}
            <button class="action-btn ${this._removing ? 'installing' : ''}"
              @click=${e => { this._removing = true; this._handleAction(e, 'uninstall'); }} ?disabled=${this._removing}
              style="color:var(--error-color,#f44336);border-color:var(--error-color,#f44336);">
              ${this._removing
                ? html`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing ? t('removing')  : (this.viewMode === 'management' ? t('removeRepo') : t('remove'))}</span>
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
        <!-- Report Issue link -->
        <div style="display:flex;justify-content:flex-end;margin-top:6px;padding:0 2px;">
          <button class="issue-btn" @click=${e => { e.stopPropagation(); this._handleReportIssue(); }}
                  title="${t('reportIssueDesc')}">🐛 ${t('reportIssue')}</button>
        </div>
      </div>
    `;
  }
}

customElements.define('repo-card', RepoCard);
