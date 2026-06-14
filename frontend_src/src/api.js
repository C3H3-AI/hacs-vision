const API_BASE = '/api/hacs_vision';

class HACSEnhancedAPI {
  constructor() {
    this._token = null;
    this._hassRef = null;
  }

  /** Call this when hass becomes available */
  setHass(hass) {
    this._hassRef = hass;
    // Try to extract auth token from hass
    try {
      if (hass?.auth?.data?.access_token) {
        this._token = hass.auth.data.access_token;
      } else if (hass?.authToken) {
        this._token = hass.authToken;
      } else if (hass?.connection?.accessToken) {
        this._token = hass.connection.accessToken;
      } else if (hass?.config?.authToken) {
        this._token = hass.config.authToken;
      }
    } catch(e) { /* ignore */ }
  }

  _getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    // Try to get token from hass ref (setHass called)
    if (!this._token) {
      try {
        if (this._hassRef?.auth?.data?.access_token) {
          this._token = this._hassRef.auth.data.access_token;
        }
      } catch(e) {}
    }
    // Fallback: iframe embed mode → HA is in parent frame
    if (!this._token) {
      try {
        const parentDoc = window.parent?.document;
        if (parentDoc) {
          const haEl = parentDoc.querySelector('home-assistant');
          const hass = haEl?.hass;
          if (hass?.auth?.data?.access_token) {
            this._token = hass.auth.data.access_token;
          }
        }
      } catch(e) {
        // Cross-origin iframe → fall through to document
      }
    }
    // Final fallback: direct document
    if (!this._token) {
      try {
        const haEl = document.querySelector('home-assistant');
        const hass = haEl?.hass;
        if (hass?.auth?.data?.access_token) {
          this._token = hass.auth.data.access_token;
        }
      } catch(e) {}
    }
    if (this._token) {
      headers['Authorization'] = `Bearer ${this._token}`;
    }
    return headers;
  }

  async request(method, path, body, options = {}) {
    const opts = {
      method,
      headers: this._getHeaders(),
      credentials: 'include',
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const resp = await fetch(`${API_BASE}/${path}`, opts);
      if (!resp.ok) {
        const err = new Error(`API error: ${resp.status}`);
        err.status = resp.status;
        // F2: Network status callback (skip if suppressed for non-critical calls)
        if (!options.suppressNetworkError && this._onNetworkStatus) {
          if (resp.status === 429) this._onNetworkStatus('rate_limited');
          else if (resp.status >= 500) this._onNetworkStatus('server_error');
        }
        throw err;
      }
      // F2: Clear error on success
      if (this._onNetworkStatus) this._onNetworkStatus('online');
      return resp.json();
    } catch(e) {
      // F2: Detect offline
      if (!navigator.onLine && this._onNetworkStatus) {
        this._onNetworkStatus('offline');
      }
      throw e;
    }
  }

  get(path, options = {}) { return this.request('GET', path, null, options); }
  post(path, body) { return this.request('POST', path, body); }
  delete(path, body) { return this.request('DELETE', path, body); }

  /* Repositories */
  listRepositories(params = {}) {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.category) q.set('category', params.category);
    if (params.sort) q.set('sort', params.sort);
    if (params.sortDir) q.set('sortDir', params.sortDir);
    if (params.status) q.set('status', params.status);
    if (params.tag) q.set('tag', params.tag);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    return this.get(`repositories?${q}`);
  }
  getRepository(id) { return this.get(`repositories/${id}`); }
  getInstalled() { return this.get('installed'); }
  getStats() { return this.get('installed/stats'); }
  getUpdates() { return this.get('updates'); }
  install(repository, category) { return this.post('install', { repository, category }); }
  update(repositoryIds) { return this.post('update', { repository_ids: repositoryIds }); }
  remove(repository) { return this.post('remove', { repository }); }
  getConfig() { return this.get('config'); }
  updateConfig(config) { return this.post('config', config); }
  getCustomRepos() { return this.get('config/custom'); }
  addCustomRepo(repository, category) { return this.post('config/custom', { repository, category }); }
  removeCustomRepo(repository) { return this.delete('config/custom', { repository }); }
  removeArchivedRepo(repoName) { return this.post('management/remove_archived', { repository: repoName }); }
  removeRenamedRepo(oldName) { return this.post('management/remove_renamed', { old_name: oldName }); }
  replaceRenamedRepo(oldName, newName) { return this.post('management/replace_renamed', { old_name: oldName, new_name: newName }); }
  exportBackup() { return this.get('backup/export'); }
  importBackup(data) { return this.post('backup/import', data); }
  checkDependencies() { return this.get('dependencies'); }
  refresh() { return this.post('refresh'); }
  redownload(repository, category) { return this.post('redownload', { repository, category }); }
  ignoreRepo(repository) { return this.post('ignore', { repository }); }
  restartHA() { return this.post('restart'); }
  reloadHA() {
    // Clear any pending reload markers on success
    return this.post('reload').then(result => {
      if (result.success) {
        try { localStorage.removeItem('hacs_vision_pending_reload'); } catch(e) {}
      }
      return result;
    });
  }

  /* Pending Reload tracking (frontend-only, localStorage-backed) */
  getPendingReloads() {
    try {
      return JSON.parse(localStorage.getItem('hacs_vision_pending_reload') || '[]');
    } catch(e) { return []; }
  }
  addPendingReload(fullName) {
    try {
      const list = this.getPendingReloads();
      if (!list.includes(fullName)) {
        list.push(fullName);
        localStorage.setItem('hacs_vision_pending_reload', JSON.stringify(list));
      }
    } catch(e) {}
  }
  clearPendingReloads() {
    try { localStorage.removeItem('hacs_vision_pending_reload'); } catch(e) {}
  }

  /* Settings */
  getSettings() { return this.get('settings'); }
  updateSettings(settings) { return this.post('settings', settings); }

  /* Config Entries (for Add Integration button) */
  getConfigEntries() { return this.get('config_entries'); }
  getDeviceCounts(domain) { return this.get(`device_counts/${domain}`, { suppressNetworkError: true }); }
  getVersion() { return this.get('version'); }

  /* Batch Operations */
  batchInstall(repos) { return this.post('batch/install', { repositories: repos }); }
  batchRemove(repos) { return this.post('batch/remove', { repositories: repos }); }

  /* Check Updates + Notification */
  checkUpdatesWithNotify() { return this.post('check_updates'); }

  /* Config Flow (proxied through backend) */
  getFlowHandlers() { return this.get('config_flow/handlers'); }
  startConfigFlow(domain) { return this.post('config_flow/start', { handler: domain }); }
  stepConfigFlow(flowId, data) { return this.post(`config_flow/step/${flowId}`, data); }
  cancelConfigFlow(flowId) { return this.request('DELETE', `config_flow/flow/${flowId}`); }
  startOptionsFlow(entryId) { return this.post('config_flow/options/start', { handler: entryId }); }
  stepOptionsFlow(flowId, data) { return this.post(`config_flow/options/step/${flowId}`, data); }

  /* Subentry Flow — for integrations with supported_subentry_types */
  startSubentryFlow(entryId, subentryType, opts) { return this.post('config_flow/subentry/start', { handler: [entryId, subentryType], ...opts }); }
  stepSubentryFlow(flowId, data) { return this.post(`config_flow/subentry/step/${flowId}`, data); }
  cancelSubentryFlow(flowId) { return this.request('DELETE', `config_flow/subentry/flow/${flowId}`); }
  getSubentries(entryId) { return this.request('GET', `config_entries/subentries/${entryId}`); }

  /* Translations — read custom component translation files */
  getTranslations(domain, lang) {
    const langParam = lang || 'zh-Hans';
    return this.get(`translations/${encodeURIComponent(domain)}?lang=${encodeURIComponent(langParam)}`);
  }

  /* F3: Get single repo status (for progress polling) — uses real-time HACS memory data */
  getRepoStatus(repoId) { return this.get(`repos/status/${encodeURIComponent(repoId)}`); }

  /* Favorites (server-side storage) */
  getFavorites() { return this.get('favorites'); }
  setFavorites(favorites) { return this.post('favorites', { favorites }); }

  /* Version selector: get releases for a repo */
  getRepoReleases(repoId) {
    return this._fetch(`/repos/releases?id=${encodeURIComponent(repoId)}`);
  }

  /* Version selector: install a specific version */
  installVersion(repoId, version) {
    return this._post('/repos/install_version', { id: repoId, version });
  }

  /* Internal fetch helpers for version endpoints */
  async _fetch(path) {
    const opts = {
      method: 'GET',
      headers: this._getHeaders(),
      credentials: 'include',
    };
    try {
      const resp = await fetch(`${API_BASE}${path}`, opts);
      if (!resp.ok) {
        const err = new Error(`API error: ${resp.status}`);
        err.status = resp.status;
        throw err;
      }
      return resp.json();
    } catch(e) {
      if (!navigator.onLine && this._onNetworkStatus) {
        this._onNetworkStatus('offline');
      }
      throw e;
    }
  }

  async _post(path, body) {
    const opts = {
      method: 'POST',
      headers: this._getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    };
    try {
      const resp = await fetch(`${API_BASE}${path}`, opts);
      if (!resp.ok) {
        const err = new Error(`API error: ${resp.status}`);
        err.status = resp.status;
        if (this._onNetworkStatus) {
          if (resp.status === 429) this._onNetworkStatus('rate_limited');
          else if (resp.status >= 500) this._onNetworkStatus('server_error');
        }
        throw err;
      }
      if (this._onNetworkStatus) this._onNetworkStatus('online');
      return resp.json();
    } catch(e) {
      if (!navigator.onLine && this._onNetworkStatus) {
        this._onNetworkStatus('offline');
      }
      throw e;
    }
  }

  /* F6: Get changelog with localStorage cache — tag optional, omit for latest stable */
  async getChangelog(fullName, tag) {
    const cacheKey = `hacs_changelog_${fullName}_${tag || 'latest'}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 3600000) return data;
      }
    } catch(e) {}
    try {
      const qs = tag ? `?tag=${encodeURIComponent(tag)}` : '';
      const data = await this.get(`changelog/${fullName}${qs}`);
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      } catch(e) {}
      return data;
    } catch(e) {
      console.error('Changelog fetch failed:', e);
      return null;
    }
  }

  /* README from backend proxy */
  async getReadme(fullName) {
    // Check cache first
    const cacheKey = `hacs_readme_${fullName}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { html, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 3600000) { // 1 hour cache
          return html;
        }
      }
    } catch(e) {}

    try {
      // Use backend proxy instead of direct GitHub API
      const resp = await fetch(`${API_BASE}/readme/${fullName}`, {
        headers: this._getHeaders(),
        credentials: 'include',
      });
      if (resp.ok) {
        const html = await resp.text();
        // Cache the result
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ html, timestamp: Date.now() }));
        } catch(e) {}
        return html;
      }
      return null;
    } catch(e) {
      console.error('Failed to fetch README:', e);
      return null;
    }
  }
}

export const api = new HACSEnhancedAPI();