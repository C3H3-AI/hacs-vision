"""HACS internal operations via hass.data['hacs']."""
from __future__ import annotations
import asyncio
import logging
import re
import threading
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN_HACS, VERSION
from .hacs_data import HACSData
from .hacs_history import HACSHubHistory

_LOGGER = logging.getLogger(__name__)

_PRERELEASE_RE = re.compile(r'(?i)(?:[-_.]?(?:alpha|beta|pre|rc|dev)\d*|b\d+)')


def _compare_versions(v1: str, v2: str) -> int:
    """Compare two version strings using PEP 440 semantics.
    Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
    Handles semver-style and PEP 440 versions: '2.0.0' > '2.0.0b24', '5.0.0.alpha1' < '5.0.0'."""
    # import lazily to avoid startup overhead when HA may not have it in path
    try:
        from packaging.version import Version, InvalidVersion
        p1, p2 = Version(v1), Version(v2)
        if p1 > p2:
            return 1
        if p1 < p2:
            return -1
        return 0
    except (ImportError, InvalidVersion):
        # Fallback: lexicographic sort on cleaned strings
        pass
    v1c, v2c = v1.strip().lower(), v2.strip().lower()
    if v1c > v2c:
        return 1
    if v1c < v2c:
        return -1
    return 0


def _is_prerelease_version(version: str | None) -> bool:
    """Check if a version string indicates a pre-release (alpha/beta/rc/dev).

    Handles common patterns: 2.0.0b24, 1.0.0-alpha.1, 2.0.0-rc1, 1.0.0.dev0.
    """
    if not version:
        return False
    v = version.lstrip('vV').strip()
    return bool(_PRERELEASE_RE.search(v))

class HACSOperator:
    """Operate HACS via its internal API."""

    def __init__(self, hass: HomeAssistant, shared_data: HACSData | None = None) -> None:
        self.hass = hass
        # N3: Accept shared HACSData instance to avoid redundant file reads
        self._data = shared_data or HACSData(hass)
        self._history = HACSHubHistory(hass)
        self._repo_index_by_id = None
        self._repo_index_by_name = None
        self._index_lock = threading.Lock()
        # P1: Install/update/remove locks for idempotency protection
        self._install_locks: dict[str, asyncio.Lock] = {}
        # F1: Track whether custom repos have been verified from config in this session
        self._custom_repos_verified: bool = False
        # P2: Real-time install progress tracking (for frontend progress bar)
        self._install_progress: dict[str, dict] = {}

    @property
    def _hacs(self):
        """Dynamically get HACS instance — may not be available at init time."""
        return self.hass.data.get(DOMAIN_HACS)

    @property
    def available(self) -> bool:
        """Check if HACS is loaded and accessible."""
        return self._hacs is not None

    def _ensure_index(self):
        """Build lookup index if not cached — thread-safe."""
        with self._index_lock:
            if self._repo_index_by_id is not None:
                return
            self._repo_index_by_id = {}
            self._repo_index_by_name = {}
            try:
                for repo in self._hacs.repositories.list_all:
                    rid = str(repo.data.id)
                    self._repo_index_by_id[rid] = repo
                    self._repo_index_by_name[repo.data.full_name] = repo
            except (AttributeError, KeyError, TypeError) as e:
                _LOGGER.error("Index build error: %s", e, exc_info=True)

    def invalidate_index(self):
        """Clear cached index, will be rebuilt on next access."""
        self._repo_index_by_id = None
        self._repo_index_by_name = None

    async def _ensure_custom_repos_registered(self):
        """Ensure HACS repository index is ready.

        HACS 2.0 handles custom repo registration internally via is_default().
        This method just ensures the lookup index is built.
        """
        if not self.available:
            return
        if self._custom_repos_verified:
            return
        self._custom_repos_verified = True
        self._ensure_index()

    

    def _get_lock(self, repo_id: str) -> asyncio.Lock:
        """Get or create an asyncio.Lock for a specific repo."""
        if repo_id not in self._install_locks:
            self._install_locks[repo_id] = asyncio.Lock()
        return self._install_locks[repo_id]

    def _cleanup_lock(self, repo_id: str) -> None:
        """Remove a lock that's no longer in use."""
        lock = self._install_locks.get(repo_id)
        if lock and not lock.locked():
            del self._install_locks[repo_id]

    def set_install_progress(self, repo_key: str, percentage: int, stage: str, message: str = "") -> None:
        self._install_progress[repo_key] = {
            "percentage": min(100, max(0, percentage)),
            "stage": stage,
            "message": message,
        }

    def get_install_progress(self, repo_key: str) -> dict | None:
        entry = self._install_progress.get(repo_key)
        if not entry:
            return None
        return entry

    def clear_install_progress(self, repo_key: str) -> None:
        self._install_progress.pop(repo_key, None)

    def _find_repo_by_id(self, repo_id: str):
        """Find a repository object by its string ID."""
        if not self.available:
            return None
        self._ensure_index()
        return self._repo_index_by_id.get(str(repo_id))

    def _find_repo_by_full_name(self, full_name: str):
        """Find a repository object by its full_name."""
        if not self.available:
            return None
        self._ensure_index()
        return self._repo_index_by_name.get(full_name)

    def _find_repo(self, repo_id_or_name: str):
        """Find repo by full_name first, then by ID."""
        repo = self._find_repo_by_full_name(repo_id_or_name)
        if not repo:
            repo = self._find_repo_by_id(repo_id_or_name)
        return repo

    async def install_repository(self, repo_id_or_name: str, category: str) -> dict:
        """Install a repository via HACS internal API — with idempotency lock."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        lock = self._get_lock(repo_id_or_name)
        if lock.locked():
            return {"success": False, "error": "install_already_in_progress"}

        async with lock:
            try:
                repo = self._find_repo(repo_id_or_name)
                if not repo:
                    return {"success": False, "error": f"Repository '{repo_id_or_name}' not found in HACS catalog"}

                # Idempotency: already installed?
                if repo.data.installed:
                    return {
                        "success": True,
                        "repository": repo.data.full_name,
                        "version": repo.display_installed_version or "unknown",
                        "note": "already_installed",
                    }

                await repo.async_install(version=repo.display_available_version)
                # N1: Invalidate index after mutation
                self.invalidate_index()
                return {
                    "success": True,
                    "repository": repo.data.full_name,
                    "version": repo.display_installed_version or "unknown",
                }
            except (AttributeError, KeyError, ValueError) as e:
                _LOGGER.error("Install failed for %s: %s", repo_id_or_name, e, exc_info=True)
                return {"success": False, "error": str(e)}
            except Exception as e:
                _LOGGER.error("Install unexpected error for %s: %s", repo_id_or_name, e, exc_info=True)
                return {"success": False, "error": str(e)}
            finally:
                self._cleanup_lock(repo_id_or_name)

    async def update_repositories(self, repo_ids: list[str]) -> dict:
        """Batch update repositories — with per-repo locks."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        results = {"success": [], "failed": []}
        for rid in repo_ids:
            lock = self._get_lock(rid)
            if lock.locked():
                results["failed"].append({"id": rid, "error": "update_already_in_progress"})
                continue
            async with lock:
                repo = self._find_repo(rid)
                if not repo:
                    results["failed"].append({"id": rid, "error": "not found"})
                    continue
                try:
                    from_version = repo.data.installed_version or ""
                    repo_key = repo.data.full_name or rid
                    self.set_install_progress(repo_key, 5, "starting", "Preparing download...")
                    await repo.async_install(version=repo.display_available_version)
                    self.set_install_progress(repo_key, 100, "complete", "Update complete")
                    results["success"].append(rid)
                    to_version = repo.display_installed_version or ""
                    if from_version and to_version and from_version != to_version:
                        await self._history.add_record(repo.data.full_name, from_version, to_version)
                except (AttributeError, KeyError, ValueError) as e:
                    _LOGGER.error("Update failed for %s: %s", rid, e, exc_info=True)
                    results["failed"].append({"id": rid, "error": str(e)})
                except Exception as e:
                    _LOGGER.error("Update unexpected error for %s: %s", rid, e, exc_info=True)
                    results["failed"].append({"id": rid, "error": str(e)})
                finally:
                    self._cleanup_lock(rid)

        # N1: Invalidate index after batch mutations
        if results["success"]:
            self.invalidate_index()
        return results

    async def remove_repository(self, repo_id_or_name: str) -> dict:
        """Uninstall an installed repository — with idempotency lock."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        lock = self._get_lock(repo_id_or_name)
        if lock.locked():
            return {"success": False, "error": "remove_already_in_progress"}

        async with lock:
            try:
                repo = self._find_repo(repo_id_or_name)
                if not repo:
                    return {"success": False, "error": f"Repository '{repo_id_or_name}' not found"}

                if not repo.data.installed:
                    return {"success": True, "repository": repo.data.full_name, "note": "not_installed"}

                await repo.uninstall()
                # N1: Invalidate index after mutation
                self.invalidate_index()
                return {"success": True, "repository": repo.data.full_name}
            except (AttributeError, KeyError, ValueError) as e:
                _LOGGER.error("Remove failed for %s: %s", repo_id_or_name, e, exc_info=True)
                return {"success": False, "error": str(e)}
            except Exception as e:
                _LOGGER.error("Remove unexpected error for %s: %s", repo_id_or_name, e, exc_info=True)
                return {"success": False, "error": str(e)}
            finally:
                self._cleanup_lock(repo_id_or_name)

    async def _get_available_with_prerelease(self, repo, installed: str | None, available: str | None) -> str | None:
        """Get latest available version, falling back to GitHub API for pre-release detection.

        Rules:
        - Stable → Stable only (use HACS as-is)
        - Pre-release → Any NEWER version from GitHub (pre-release OR stable).
          Beta testers want to know when the stable release ships.
        """
        if not installed or not available:
            return available
        installed_prerelease = _is_prerelease_version(installed)
        available_prerelease = _is_prerelease_version(available)
        if not installed_prerelease:
            return available  # Stable user: no override needed

        # Pre-release user: always check GitHub for ANY newer version
        # Handles two scenarios:
        #   A. installed=beta.3, available=beta.3 (same version) → check if v5.0.0 stable exists
        #   B. installed=beta.3, available=v5.0.0 (HACS says stable only) → check if newer pre-release exists
        full_name = getattr(repo.data, 'full_name', '')
        if '/' in full_name:
            try:
                releases = await self._fetch_github_releases(full_name)
                installed_clean = installed.lstrip("vV")
                for r in releases:
                    tag = r.get("tag_name", "")
                    clean_tag = tag.lstrip("vV")
                    if clean_tag and clean_tag != installed_clean and _compare_versions(clean_tag, installed_clean) > 0:
                        return tag  # Return full tag (with v prefix) for changelog API
            except Exception:
                pass
        return available

    def get_installed_list(self) -> list[dict]:
        """Get actually installed repos from HACS in-memory data."""
        if not self.available:
            return []
        result = []
        for repo in self._hacs.repositories.list_all:
            try:
                if not repo.data.installed:
                    continue
                installed = repo.data.installed_version
                available = repo.display_available_version
                installed_prerelease = _is_prerelease_version(installed)
                available_prerelease = _is_prerelease_version(available)
                same_channel = installed_prerelease or installed_prerelease == available_prerelease
                has_update = installed and available and installed != available and same_channel
                domain = getattr(repo.data, 'domain', None)
                manifest = getattr(repo.data, 'repository_manifest', None)
                manifest_name = getattr(repo.data, 'manifest_name', None) or (
                    getattr(manifest, 'name', None) if manifest else None
                ) or repo.data.full_name.split("/")[-1]
                result.append({
                    "id": str(repo.data.id),
                    "full_name": repo.data.full_name,
                    "name": repo.data.name or repo.data.full_name.split("/")[-1],
                    "manifest_name": manifest_name,
                    "installed_version": repo.display_installed_version,
                    "category": repo.data.category,
                    "has_update": has_update,
                    "installed": repo.data.installed or False,
                    "pending_restart": getattr(repo, 'pending_restart', False),
                    "update_channel": "prerelease" if installed_prerelease else "stable",
                    "domain": domain,
                })
            except (AttributeError, KeyError, TypeError) as e:
                _LOGGER.warning("Skipping repo %s (data incomplete): %s",
                                getattr(repo.data, 'full_name', 'unknown'), e)
                continue
        return result

    async def get_available_updates(self) -> list[dict]:
        """Get list of repositories with available updates from HACS."""
        if not self.available:
            return []
        updates = []
        try:
            for repo in self._hacs.repositories.list_all:
                if not repo.data.installed:
                    continue
                installed = repo.data.installed_version
                hacs_available = repo.display_available_version
                available = await self._get_available_with_prerelease(repo, installed, hacs_available)
                installed_prerelease = _is_prerelease_version(installed)
                same_channel = installed_prerelease or installed_prerelease == _is_prerelease_version(available)
                if installed and available and installed != available and same_channel:
                    updates.append({
                        "id": str(repo.data.id),
                        "full_name": repo.data.full_name,
                        "name": repo.data.name or repo.data.full_name.split("/")[-1],
                        "installed_version": installed,
                        "latest_version": available,
                        "category": repo.data.category,
                        "installed": True,
                        "has_update": True,
                    })
        except (AttributeError, KeyError, TypeError) as e:
            _LOGGER.error("get_available_updates error: %s", e, exc_info=True)

        return updates

    async def get_updates_from_ha_entities(self) -> list[dict]:
        """Get repositories with available updates from HA update.* entities.

        Primary data source — reads HA state machine directly instead of iterating
        HACS internal data. Falls back to HACS repo index only for category/name.
        """
        updates = []
        try:
            for state in self.hass.states.async_all():
                eid = state.entity_id
                if not eid.startswith("update."):
                    continue
                if state.state != "on":
                    continue
                release_url = (state.attributes.get("release_url", "") or "")
                if "github.com" not in release_url.lower():
                    continue
                # Parse owner/repo from release_url
                # Pattern: https://github.com/owner/repo/...
                path = release_url.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) < 2:
                    continue
                full_name = f"{parts[0]}/{parts[1]}"
                # Look up HACS repo for category and name
                repo = self._find_repo_by_full_name(full_name)
                category = repo.data.category if repo else "integration"
                name = (repo.data.name or parts[1]) if repo else parts[1]
                pending_restart = getattr(repo.data, 'pending_restart', False) if repo else False
                updates.append({
                    "id": str(repo.data.id) if repo else full_name,
                    "full_name": full_name,
                    "name": name,
                    "installed_version": state.attributes.get("installed_version"),
                    "latest_version": state.attributes.get("latest_version"),
                    "skipped_version": state.attributes.get("skipped_version"),
                    "in_progress": state.attributes.get("in_progress", False),
                    "category": category,
                    "installed": True,
                    "has_update": True,
                    "pending_restart": pending_restart,
                })
        except (AttributeError, TypeError) as e:
            _LOGGER.error("get_updates_from_ha_entities error: %s", e, exc_info=True)

        return updates

    async def get_all_repos_from_hacs(self) -> list[dict]:
        """Get ALL repositories from HACS in-memory data (same source as HACS UI)."""
        if not self.available:
            return []

        # F1: Ensure custom repos from config are registered in HACS memory
        # (handles restart race condition where HACS hasn't loaded custom repos yet)
        await self._ensure_custom_repos_registered()

        # Pre-load custom repo names from HACS config for is_custom detection
        custom_repo_names = set()
        try:
            config = await self._data.get_config()
            for r in config.get("custom_repositories", []):
                repo_name = r.get("repository", "")
                if repo_name:
                    custom_repo_names.add(repo_name.lower())
        except Exception:
            pass

        # Build domain→entry_id map once (avoids N+1 config entry traversal)
        _domain_entry_map = {}
        try:
            for _entry in self._hacs.hass.config_entries.async_entries():
                if _entry.domain and _entry.domain not in _domain_entry_map:
                    _domain_entry_map[_entry.domain] = _entry.entry_id
        except Exception:
            pass

        result = []
        errors = []
        try:
            repo_list = list(self._hacs.repositories.list_all)
            for i, repo in enumerate(repo_list):
                try:
                    installed_ver = repo.data.installed_version
                    # Capture HACS's original available version before _get_available_with_prerelease
                    # may override it with a GitHub result
                    hacs_available = (
                        repo.display_available_version
                        or getattr(repo.data, 'available_version', None)
                        or getattr(repo.data, 'last_version', None)
                    )
                    latest_ver = await self._get_available_with_prerelease(
                        repo, installed_ver, hacs_available
                    )
                    # Channel detection: prevent stable→prerelease, but allow prerelease→stable
                    # ONLY when _get_available_with_prerelease actually returned a verified-newer
                    # version from GitHub (not just the stale HACS cache)
                    installed_prerelease = _is_prerelease_version(installed_ver)
                    latest_prerelease = _is_prerelease_version(latest_ver)
                    same_channel = installed_prerelease or installed_prerelease == latest_prerelease
                    has_update = bool(
                        installed_ver and latest_ver
                        and installed_ver != latest_ver
                        and same_channel
                    )
                    update_channel = "prerelease" if installed_prerelease else "stable"

                    display_installed = (
                        installed_ver
                        or repo.display_installed_version
                        or (getattr(repo.data, 'installed_commit', None)[:7] if getattr(repo.data, 'installed_commit', None) else None)
                    )
                    display_latest = (
                        latest_ver
                        or (getattr(repo.data, 'last_commit', None)[:7] if getattr(repo.data, 'last_commit', None) else None)
                    )

                    pending_restart = getattr(repo, 'pending_restart', False)

                    status = "default"
                    if repo.data.installed:
                        status = "installed"
                    if has_update:
                        status = "pending-upgrade"
                    if pending_restart:
                        status = "pending-restart"
                    if hasattr(repo.data, 'new') and repo.data.new:
                        status = "new"

                    # Get manifest_name safely
                    manifest_name = getattr(repo.data, 'manifest_name', None)
                    if not manifest_name and hasattr(repo.data, 'repository_manifest') and repo.data.repository_manifest:
                        try:
                            manifest_name = repo.data.repository_manifest.name
                        except Exception:
                            pass

                    # is_custom detection: use HACS's is_default() directly
                    # HACS 2.0 doesn't populate custom_repositories in hacs.hacs
                    is_custom = False
                    full_name_lower = repo.data.full_name.lower()
                    if full_name_lower in custom_repo_names:
                        is_custom = True
                    else:
                        # Use is_default() if available (HACS fetches default list from GitHub)
                        try:
                            if hasattr(self._hacs.repositories, '_default_repositories'):
                                is_custom = not self._hacs.repositories.is_default(str(repo.data.id))
                        except Exception:
                            pass

                    # authors: filter out "@user" placeholder HACS sets for custom repos,
                    # fallback to GitHub owner extracted from full_name
                    authors_raw = repo.data.authors or []
                    _authors = [a.lstrip('@') for a in authors_raw if a and a != "@user"]
                    if not _authors:
                        owner = repo.data.full_name.split("/")[0] if repo.data.full_name else None
                        _authors = [owner] if owner else []

                    result.append({
                        "id": str(repo.data.id),
                        "full_name": repo.data.full_name,
                        "name": repo.data.name or repo.data.full_name.split("/")[-1],
                        "manifest_name": manifest_name,
                        "category": repo.data.category,
                        "description": repo.data.description or "",
                        "authors": _authors,
                        "stargazers_count": repo.data.stargazers_count or 0,
                        "downloads": getattr(repo.data, 'downloads', 0) or 0,
                        "last_updated": repo.data.last_updated or "",
                        "installed": repo.data.installed or False,
                        "installed_version": display_installed,
                        "latest_version": display_latest,
                        "has_update": has_update,
                        "update_channel": update_channel,
                        "status": status,
                        "pending_restart": pending_restart,
                        "new": getattr(repo.data, 'new', False),
                        "topics": getattr(repo.data, 'topics', []) or [],
                        "custom": is_custom,
                        "is_custom": is_custom,
                        "domain": getattr(repo.data, 'domain', None),
                        "releases": getattr(repo.data, 'releases', None),
                        "config_entry_id": _domain_entry_map.get(getattr(repo.data, 'domain', None)),
                        "default_branch": getattr(repo.data, 'default_branch', None) or "main",
                    })
                except Exception as inner_e:
                    if len(errors) < 5:
                        errors.append(f"repo#{i}({getattr(repo, 'data', None) and getattr(repo.data, 'full_name', '?')}): {type(inner_e).__name__}: {inner_e}")
            self._last_debug = f"total={len(repo_list)} ok={len(result)} errors={len(errors)}"
            if errors:
                self._last_debug += f" first_errors={errors}"
        except (AttributeError, KeyError, TypeError) as e:
            self._last_debug = f"outer_error: {e}"

        return result

    async def get_repo_releases(self, repo_id_or_name: str) -> list[dict]:
        """Get available releases for a repository — falls back to GitHub API if HACS cache is thin."""
        if not self.available:
            return []
        repo = self._find_repo(repo_id_or_name)
        if not repo:
            return []
        releases = []
        try:
            # Try HACS internal releases first
            if hasattr(repo, 'releases') and repo.releases:
                try:
                    releases_iter = iter(repo.releases)
                except TypeError:
                    releases_iter = []
                for release in releases_iter:
                    releases.append({
                        "tag_name": getattr(release, 'tag_name', str(release)),
                        "name": getattr(release, 'name', ''),
                        "prerelease": release.get('prerelease', False) if isinstance(release, dict) else getattr(release, 'prerelease', False),
                        "published_at": getattr(release, 'published_at', ''),
                    })

            # If HACS cache is thin (< 3 releases), fetch from GitHub API directly
            full_name = getattr(repo.data, 'full_name', repo_id_or_name)
            if len(releases) < 3 and '/' in full_name:
                try:
                    gh_releases = await self._fetch_github_releases(full_name)
                    # Merge: prefer API data, deduplicate by tag_name
                    seen_tags = {r["tag_name"] for r in releases}
                    for r in gh_releases:
                        if r["tag_name"] not in seen_tags:
                            releases.append(r)
                            seen_tags.add(r["tag_name"])
                    releases.sort(key=lambda r: r.get("published_at", ""), reverse=True)
                except Exception as e:
                    _LOGGER.debug("GitHub API fetch for %s failed: %s", full_name, e)

            # Last resort: at least show last_version
            if not releases and hasattr(repo.data, 'last_version') and repo.data.last_version:
                releases.append({
                    "tag_name": repo.data.last_version,
                    "name": repo.data.last_version,
                    "prerelease": False,
                    "published_at": getattr(repo.data, 'last_updated', ''),
                })
            return releases
        except Exception as e:
            _LOGGER.error("get_repo_releases error: %s", e)
            return []

    async def _fetch_github_releases(self, full_name: str) -> list[dict]:
        """Fetch releases from GitHub API."""
        try:
            import aiohttp
            headers = {"Accept": "application/vnd.github.v3+json"}
            token = self._get_github_token()
            if token:
                headers["Authorization"] = f"token {token}"
            url = f"https://api.github.com/repos/{full_name}/releases?per_page=20"
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return [{
                            "tag_name": r.get("tag_name", ""),
                            "name": r.get("name", ""),
                            "prerelease": r.get("prerelease", False),
                            "published_at": r.get("published_at", ""),
                        } for r in data]
                    _LOGGER.debug("GitHub API returned %d for %s", resp.status, full_name)
        except Exception as e:
            _LOGGER.debug("_fetch_github_releases error: %s", e)
        return []

    def _get_github_token(self) -> str | None:
        """Get GitHub token from HACS config entry."""
        try:
            for entry in self.hass.config_entries.async_entries("hacs"):
                token = entry.data.get("token")
                if token:
                    return token
        except Exception:
            pass
        return None

    async def install_repository_version(self, repo_id_or_name: str, version: str | None = None) -> dict:
        """Install a specific version of a repository."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}
        lock = self._get_lock(repo_id_or_name)
        if lock.locked():
            return {"success": False, "error": "install_already_in_progress"}
        async with lock:
            try:
                repo = self._find_repo(repo_id_or_name)
                if not repo:
                    return {"success": False, "error": "not found"}
                from_version = repo.data.installed_version or ""
                repo_key = repo.data.full_name or repo_id_or_name
                self.set_install_progress(repo_key, 5, "starting", "Preparing download...")
                await repo.async_install(version=version or repo.display_available_version)
                self.set_install_progress(repo_key, 75, "installing", "Installing...")
                self.invalidate_index()
                self._cleanup_lock(repo_id_or_name)
                to_version = version or repo.display_installed_version or ""
                if from_version and to_version and from_version != to_version:
                    await self._history.add_record(repo.data.full_name, from_version, to_version)
                self.set_install_progress(repo_key, 100, "complete", "Update complete")
                return {"success": True, "repository": repo.data.full_name, "version": version or repo.display_installed_version}
            except Exception as e:
                _LOGGER.error("Install version failed: %s", e, exc_info=True)
                return {"success": False, "error": str(e)}

    def get_repo_rt_status(self, repo_id_or_name: str) -> dict | None:
        """Get real-time status from HACS in-memory data (not from .storage file)."""
        repo = self._find_repo(repo_id_or_name)
        if not repo:
            return None
        installed = repo.data.installed_version
        available = repo.display_available_version
        result = {
            "id": str(repo.data.id),
            "full_name": repo.data.full_name,
            "installed": repo.data.installed or False,
            "installed_version": installed,
            "latest_version": available,
            "has_update": bool(installed and available and installed != available),
            "pending_restart": getattr(repo, 'pending_restart', False),
        }
        # Attach install progress if available
        progress = self.get_install_progress(repo.data.full_name) or self.get_install_progress(repo_id_or_name)
        if progress:
            result["progress"] = progress
        return result

    async def refresh_repositories(self) -> dict:
        """Refresh HACS repository data — concurrent update with rate-limit awareness."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        await self._ensure_custom_repos_registered()

        repos = list(self._hacs.repositories.list_downloaded)
        if not repos:
            self.invalidate_index()
            return {"success": True, "updated": 0, "errors": []}

        updated = 0
        errors = []
        rate_limited = False

        # Limit concurrency to 5 to avoid hammering GitHub API
        sem = asyncio.Semaphore(5)

        async def _update_one(repo):
            nonlocal updated, rate_limited
            async with sem:
                try:
                    await repo.update_repository(ignore_issues=True)
                    updated += 1
                except (ConnectionError, TimeoutError, OSError) as e:
                    errors.append(f"{repo.data.full_name}: network error: {e}")
                except Exception as e:
                    err_str = str(e)
                    if "403" in err_str or "rate limit" in err_str.lower():
                        rate_limited = True
                    errors.append(f"{repo.data.full_name}: {type(e).__name__}: {str(e)[:120]}")

        await asyncio.gather(*[_update_one(r) for r in repos])
        self.invalidate_index()

        _LOGGER.info("Refresh: updated %d/%d repos, %d errors, rate_limited=%s",
                     updated, len(repos), len(errors), rate_limited)
        return {
            "success": not rate_limited,
            "updated": updated,
            "total": len(repos),
            "errors": errors[:5],
            "rate_limited": rate_limited,
        }

    async def add_custom_repository(self, full_name: str, category: str) -> dict:
        """Add a custom repository to HACS."""
        config = await self._data.get_config()
        custom_repos = config.get("custom_repositories", [])

        already_in_config = any(r.get("repository") == full_name for r in custom_repos)

        if not already_in_config:
            custom_repos.append({"repository": full_name, "category": category})
            config["custom_repositories"] = custom_repos
            ok = await self._data.update_config(config)
            if not ok:
                return {"success": False, "error": "write_failed"}

        self.invalidate_index()

        if self.available:
            already_in_memory = self._hacs.repositories.is_registered(
                repository_full_name=full_name.lower()
            )
            if not already_in_memory:
                try:
                    await self._hacs.async_register_repository(
                        repository_full_name=full_name,
                        category=category,
                    )
                except Exception as e:
                    _LOGGER.warning("HACS register failed after add: %s", e, exc_info=True)
                    return {"success": False, "error": f"HACS register failed: {e}"}

            # Persist the newly registered repo to .storage/hacs.repositories immediately.
            try:
                await self._hacs.data.async_write()
            except Exception as e:
                _LOGGER.warning("HACS data write failed after add: %s", e, exc_info=True)

        return {"success": True, "repository": full_name}

    async def _find_config_entry_id(self, domain: str | None) -> str | None:
        """Find HA config entry ID for a given integration domain."""
        if not domain:
            return None
        try:
            for entry in self._hacs.hass.config_entries.async_entries():
                if entry.domain == domain:
                    return entry.entry_id
        except Exception:
            pass
        return None

    async def remove_custom_repository(self, full_name: str) -> dict:
        """Remove a custom repository from HACS."""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        try:
            repository = self._hacs.repositories.get_by_full_name(full_name)
            if not repository:
                for r in self._hacs.repositories.list_all:
                    if r.data.full_name.lower() == full_name.lower():
                        repository = r
                        break
            if repository:
                self._hacs.repositories.unregister(repository)
                self.invalidate_index()
                return {"success": True, "repository": full_name}
            return {"success": False, "error": "not_found"}
        except Exception as e:
            _LOGGER.warning("HACS unregister failed: %s", e, exc_info=True)
            return {"success": False, "error": str(e)}
