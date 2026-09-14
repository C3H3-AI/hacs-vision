"""HACS Vision HACS 操作平台。"""
from __future__ import annotations
import asyncio
import logging
import re
import threading

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from packaging.version import Version, InvalidVersion

from .const import DOMAIN_HACS
from .hacs_data import HACSData
from .hacs_history import HACSHubHistory

_LOGGER = logging.getLogger(__name__)

_PRERELEASE_RE = re.compile(r'(?i)(?:[-_.]?(?:alpha|beta|pre|rc|dev)\d*|b\d+)')

def _compare_versions(v1: str, v2: str) -> int:
    """用 PEP 440 语义比较两个版本字符串。"""
    try:
        p1, p2 = Version(v1), Version(v2)
        if p1 > p2:
            return 1
        if p1 < p2:
            return -1
        return 0
    except InvalidVersion:
        # 兜底：对清洗后的字符串做字典序排序
        pass
    v1c, v2c = v1.strip().lower(), v2.strip().lower()
    if v1c > v2c:
        return 1
    if v1c < v2c:
        return -1
    return 0

def _is_prerelease_version(version: str | None) -> bool:
    """判断版本字符串是否表示预发布（alpha/beta/rc/dev）。"""
    if not version:
        return False
    v = version.lstrip('vV').strip()
    return bool(_PRERELEASE_RE.search(v))

class HACSOperator:
    """通过 HACS 内部 API 操作。"""

    def __init__(self, hass: HomeAssistant, shared_data: HACSData | None = None) -> None:
        self.hass = hass
        # N3：接受共享的 HACSData 实例，避免重复读文件
        self._data = shared_data or HACSData(hass)
        self._history = HACSHubHistory(hass)
        self._repo_index_by_id = None
        self._repo_index_by_name = None
        self._index_lock = threading.Lock()
        # P1：安装/更新/移除加锁以保护幂等
        self._install_locks: dict[str, asyncio.Lock] = {}
        # F1：跟踪本会话中自定义仓库是否已从配置验证
        self._custom_repos_verified: bool = False
        # P2：实时安装进度追踪（供前端进度条）
        self._install_progress: dict[str, dict] = {}

    @property
    def _hacs(self):
        """动态获取 HACS 实例——初始化时可能尚不可用。"""
        return self.hass.data.get(DOMAIN_HACS)

    @property
    def available(self) -> bool:
        """检查 HACS 是否已加载且可访问。"""
        return self._hacs is not None

    def _ensure_index(self):
        """若未缓存则构建查找索引——线程安全。"""
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
            # 空的 HACS 注册表说明 HACS 尚未就绪——保留索引
            # 不缓存，下次访问重试，而非缓存空结果。
            if not self._repo_index_by_id:
                self._repo_index_by_id = None
                self._repo_index_by_name = None

    def invalidate_index(self):
        """清除缓存索引，下次访问时重建。"""
        self._repo_index_by_id = None
        self._repo_index_by_name = None

    async def _ensure_custom_repos_registered(self):
        """确保 HACS 仓库索引就绪。"""
        if not self.available:
            return
        if self._custom_repos_verified:
            return
        self._custom_repos_verified = True
        self._ensure_index()

    def _get_lock(self, repo_id: str) -> asyncio.Lock:
        """获取或创建某仓库的 asyncio.Lock。"""
        if repo_id not in self._install_locks:
            # _cleanup_lock 在锁仍持有（位于 `async with` 内）时被调用，

            # 因此条目永远不会被移除——改为定期清理。
            if len(self._install_locks) > 128:
                for rid in [k for k, v in self._install_locks.items() if not v.locked()]:
                    del self._install_locks[rid]
            self._install_locks[repo_id] = asyncio.Lock()
        return self._install_locks[repo_id]

    def _cleanup_lock(self, repo_id: str) -> None:
        """移除不再使用的锁。"""
        lock = self._install_locks.get(repo_id)
        if lock and not lock.locked():
            del self._install_locks[repo_id]

    def set_install_progress(self, repo_key: str, percentage: int, stage: str, message: str = "") -> None:
        if len(self._install_progress) > 256:
            for k in list(self._install_progress)[: len(self._install_progress) - 256]:
                del self._install_progress[k]
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

    def _find_repo_by_id(self, repo_id: str):
        """按字符串 ID 查找仓库对象。"""
        if not self.available:
            return None
        self._ensure_index()
        return self._repo_index_by_id.get(str(repo_id))

    def _find_repo_by_full_name(self, full_name: str):
        """按 full_name 查找仓库对象。"""
        if not self.available:
            return None
        self._ensure_index()
        return self._repo_index_by_name.get(full_name)

    def _find_repo(self, repo_id_or_name: str):
        """先按 full_name 再按 ID 查找仓库。"""
        repo = self._find_repo_by_full_name(repo_id_or_name)
        if not repo:
            repo = self._find_repo_by_id(repo_id_or_name)
        return repo

    async def install_repository(self, repo_id_or_name: str, category: str) -> dict:
        """经 HACS 内部 API 安装仓库——带幂等锁。"""
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

                # 幂等：已安装？
                if repo.data.installed:
                    return {
                        "success": True,
                        "repository": repo.data.full_name,
                        "version": repo.display_installed_version or "unknown",
                        "note": "already_installed",
                    }

                await repo.async_install(version=repo.display_available_version)
                # N1：变更后使索引失效
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
        """批量更新仓库——带逐仓库锁。"""
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

        # N1：批量变更后使索引失效
        if results["success"]:
            self.invalidate_index()
        return results

    async def remove_repository(self, repo_id_or_name: str) -> dict:
        """卸载已安装仓库——带幂等锁。"""
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
                # N1：变更后使索引失效
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
        """获取最新可用版本，预发布检测回退到 GitHub API。"""

        if not installed or not available:
            return available
        installed_prerelease = _is_prerelease_version(installed)
        available_prerelease = _is_prerelease_version(available)
        if not installed_prerelease:
            return available  # 稳定版用户：无需覆盖
        # 预发布用户：总是向 GitHub 查询任意更新的版本
        full_name = getattr(repo.data, 'full_name', '')
        if '/' in full_name:
            try:
                releases = await self._fetch_github_releases(full_name)
                installed_clean = installed.lstrip("vV")
                for r in releases:
                    tag = r.get("tag_name", "")
                    clean_tag = tag.lstrip("vV")
                    if clean_tag and clean_tag != installed_clean and _compare_versions(clean_tag, installed_clean) > 0:
                        return tag  # 返回完整标签（含 v 前缀）供更新日志 API 使用
            except Exception:
                pass
        return available

    def get_installed_list(self) -> list[dict]:
        """从 HACS 内存数据获取实际已安装仓库。"""
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
        """从 HACS 获取有可用更新的仓库列表。"""
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
        """从 HA 的 update.* 实体获取有可用更新的仓库。"""

        if not self.available:
            return []
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
                # 从 release_url 解析 owner/repo
                # 模式：https://github.com/owner/repo/...
                path = release_url.replace("https://github.com/", "").replace("http://github.com/", "")
                parts = path.split("/")
                if len(parts) < 2:
                    continue
                full_name = f"{parts[0]}/{parts[1]}"
                # 查 HACS 仓库以获取类别与名称
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
        """从 HACS 内存数据获取全部仓库（与 HACS 界面同源）。"""
        if not self.available:
            return []

        await self._ensure_custom_repos_registered()
        custom_repo_names = set()
        try:
            config = await self._data.get_config()
            for r in config.get("custom_repositories", []):
                repo_name = r.get("repository", "")
                if repo_name:
                    custom_repo_names.add(repo_name.lower())
        except Exception:
            pass
        try:
            our_repos = await self._data.get_custom_repos_list()
            for r in our_repos:
                repo_name = r.get("repository", "")
                if repo_name:
                    custom_repo_names.add(repo_name.lower())
        except Exception:
            pass

        _domain_entry_map = {}
        try:
            for _entry in self.hass.config_entries.async_entries():
                if _entry.domain and _entry.domain not in _domain_entry_map:
                    _domain_entry_map[_entry.domain] = _entry.entry_id
        except Exception:
            pass

        default_ids = set()
        default_category_counts = {}
        try:
            default_ids = set(getattr(self._hacs.repositories, "_default_repositories", ()) or ())
            for _r in self._hacs.repositories.list_all:
                _rid = str(getattr(_r.data, "id", "") or "")
                if _rid and _rid in default_ids:
                    default_category_counts[_r.data.category] = default_category_counts.get(_r.data.category, 0) + 1
        except Exception:
            default_ids = set()
        if not default_ids:
            _LOGGER.debug("HACS default repository set is empty; custom flag relies on name lists only")

        result = []
        errors = []
        try:
            repo_list = list(self._hacs.repositories.list_all)
            for i, repo in enumerate(repo_list):
                try:
                    installed_ver = repo.data.installed_version
                    # 在 _get_available_with_prerelease 前捕获 HACS 原始可用版本
                    # 可能被 GitHub 结果覆盖
                    hacs_available = (
                        repo.display_available_version
                        or getattr(repo.data, 'available_version', None)
                        or getattr(repo.data, 'last_version', None)
                    )
                    latest_ver = await self._get_available_with_prerelease(
                        repo, installed_ver, hacs_available
                    )
                    # 通道检测：阻止稳定→预发布，但允许预发布→稳定）
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

                    # 安全获取 manifest_name
                    manifest_name = getattr(repo.data, 'manifest_name', None)
                    if not manifest_name and hasattr(repo.data, 'repository_manifest') and repo.data.repository_manifest:
                        try:
                            manifest_name = repo.data.repository_manifest.name
                        except Exception:
                            pass

                    is_custom = False
                    full_name_lower = repo.data.full_name.lower()
                    if full_name_lower in custom_repo_names:
                        is_custom = True
                    elif repo.data.id and default_ids and str(repo.data.id) not in default_ids:

                        if default_category_counts.get(repo.data.category, 0) > 0:
                            is_custom = True
                    # 作者：过滤 HACS 为自定义仓库设的 "@user" 占位符，
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
        """获取仓库可用发布——HACS 缓存稀薄时回退 GitHub API。"""
        if not self.available:
            return []
        repo = self._find_repo(repo_id_or_name)
        if not repo:
            return []
        releases = []
        try:
            # 优先尝试 HACS 内部发布
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

            # 若 HACS 缓存稀薄（< 3 个发布），直接从 GitHub API 拉取
            full_name = getattr(repo.data, 'full_name', repo_id_or_name)
            if len(releases) < 3 and '/' in full_name:
                try:
                    gh_releases = await self._fetch_github_releases(full_name)
                    # 合并：优先用 API 数据，按 tag_name 去重
                    seen_tags = {r["tag_name"] for r in releases}
                    for r in gh_releases:
                        if r["tag_name"] not in seen_tags:
                            releases.append(r)
                            seen_tags.add(r["tag_name"])
                    releases.sort(key=lambda r: r.get("published_at", ""), reverse=True)
                except Exception as e:
                    _LOGGER.debug("GitHub API fetch for %s failed: %s", full_name, e)

            # 最后手段：至少展示 last_version
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
        """从 GitHub API 拉取发布。"""
        try:
            headers = {"Accept": "application/vnd.github.v3+json"}
            token = self._get_github_token()
            if token:
                headers["Authorization"] = f"token {token}"
            url = f"https://api.github.com/repos/{full_name}/releases?per_page=20"
            # HA 的共享会话——每次调用新建 ClientSession 会泄漏连接器。
            session = async_get_clientsession(self.hass)
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
        """从 HACS 配置项获取 GitHub 令牌。"""
        try:
            for entry in self.hass.config_entries.async_entries("hacs"):
                token = entry.data.get("token")
                if token:
                    return token
        except Exception:
            pass
        return None

    # 仅用于特性分支（feature/foo），绝不用 tags/ 或 heads/ 前缀。
    _REF_RE = re.compile(r"^[A-Za-z0-9._](?:[A-Za-z0-9._-]*/)*[A-Za-z0-9._-]{0,200}$")
    _REF_BAD = re.compile(r"(\.\.|//|^/|\\|[\s\r\n]|^(tags|heads)/)")

    @staticmethod
    def _normalize_ref(version: str | None) -> str | None:
        """校验用户提供的引用并拒绝任何不安全内容。"""

        if not version or not isinstance(version, str):
            return None
        ref = version.strip()
        if not ref or len(ref) > 200:
            return None
        # 7-40 位十六进制字符串 → 提交 SHA，直接透传
        if re.fullmatch(r"[a-fA-F0-9]{7,40}", ref):
            return ref.lower() if len(ref) == 40 else ref
        if not HACSOperator._REF_RE.match(ref) or HACSOperator._REF_BAD.search(ref):
            return None
        return ref

    async def _fetch_repo_meta(self, full_name: str) -> dict:
        """从 GitHub 获取仓库实时元数据（默认分支等）。"""
        session = async_get_clientsession(self.hass)
        headers = {"Accept": "application/vnd.github.v3+json"}
        token = self._get_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            url = f"https://api.github.com/repos/{full_name}"
            async with session.get(url, headers=headers, timeout=15) as resp:
                if resp.status == 200:
                    return await resp.json() or {}
        except Exception as e:
            _LOGGER.debug("Fetch repo meta failed for %s: %s", full_name, e)
        return {}

    async def install_repository_version(self, repo_id_or_name: str, version: str | None = None) -> dict:
        """安装仓库的特定版本。"""

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

                if version:
                    version = self._normalize_ref(version)
                    if not version:
                        return {"success": False, "error": "invalid_ref"}

                is_release = version and self._is_release_version(repo, version)
                saved_releases_objects = None
                saved_download_content = None
                if version and not is_release:
                    # Patch in the live default branch: HACS compares the
                    # requested version against data.default_branch to choose
                    # between the heads/ and tags/ archive URLs, and the value
                    # stored by HACS is frequently stale/None.
                    meta = await self._fetch_repo_meta(repo_key)
                    live_default = meta.get("default_branch")
                    if live_default:
                        repo.data.default_branch = live_default

                    # The tree is refreshed inside a download_content hook
                    # (not here): HACS only assigns self.ref = <requested ref>
                    # inside async_download_repository(), which runs after this
                    # block. Refreshing here caches the PREVIOUS ref's tree,
                    # leaving content.path.remote pointing at the latest
                    # release asset ("release") while download_content() is
                    # called with the branch/SHA — release_contents() then
                    # finds no matching release, gathering yields no files and
                    # the install fails with "No content to download".
                    #
                    # The hook also hides release assets while the refresh
                    # runs, so HACS' update_filenames() derives file_name and
                    # content.path.remote from the requested ref's tree rather
                    # than from the latest release asset.
                    saved_releases_objects = repo.releases.objects
                    saved_download_content = repo.download_content

                    async def _download_content_for_ref(
                        version=None, _orig=saved_download_content, _repo=repo
                    ):
                        try:
                            # Refresh the tree for the requested ref (self.ref
                            # is already assigned by async_download_repository).
                            _repo.data.etag_repository = None
                            await _repo.update_repository(force=True)
                            # update_repository() refills releases, and HACS'
                            # update_filenames() prefers a release asset over
                            # the ref's tree — which pins content.path.remote
                            # to "release" and makes download_content() look
                            # for a release named after the branch/SHA. Clear
                            # the assets afterwards and re-derive file_name /
                            # content.path.remote from the ref's tree.
                            _repo.releases.objects = []
                            # update_filenames() derives the expected asset
                            # name from data.name ("<name>.js"); for a repo
                            # whose name was never populated that yields
                            # "None.js" and nothing matches. Fall back to the
                            # repository slug, as HACS does once the manifest
                            # is parsed.
                            if not _repo.data.name:
                                _repo.data.name = (
                                    (_repo.data.full_name or "").split("/")[-1]
                                    or _repo.data.name
                                )
                            _repo.content.path.remote = None
                            _repo.data.file_name = None
                            _repo.update_filenames()
                            return await _orig(version)
                        finally:
                            _repo.releases.objects = saved_releases_objects

                    repo.download_content = _download_content_for_ref

                try:
                    if version and not is_release:
                        # 官方任意引用安装器：处理
                        # selected_tag / force_branch / ref（内部）。
                        await repo.async_download_repository(ref=version)
                    else:
                        await repo.async_install(version=version or repo.display_available_version)
                finally:
                    # 双保险恢复（async_download_repository 亦
                    # 在其自身 finally 块中恢复这些）。
                    if version and getattr(repo.data, "selected_tag", None) == version:
                        repo.data.selected_tag = None
                    if version and getattr(repo, "force_branch", False):
                        repo.force_branch = False
                    if saved_download_content is not None:
                        repo.download_content = saved_download_content
                    if saved_releases_objects is not None:
                        repo.releases.objects = saved_releases_objects
                    # file_name is intentionally NOT restored: it was derived
                    # from the installed ref's tree and the post-install step
                    # (dashboard resource URL) relies on that value.

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

    def _is_release_version(self, repo, version: str) -> bool:
        """判断 `version` 是否为该仓库已知的发布标签。"""

        if not version:
            return True  # 让 HACS 选择默认
        candidate = version.lstrip("vV")
        try:
            for release in (getattr(repo, "releases", None) or []):
                tag = release.get("tag_name") if isinstance(release, dict) else getattr(release, "tag_name", None)
                if tag and tag.lstrip("vV") == candidate:
                    return True
        except (AttributeError, TypeError):
            pass
        return False

    async def get_repo_refs(self, repo_id_or_name: str) -> list[dict]:
        """列出可用于安装的分支与近期提交。 """

        repo = self._find_repo(repo_id_or_name) if self.available else None
        full_name = getattr(getattr(repo, "data", None), "full_name", "") or repo_id_or_name
        if "/" not in full_name:
            return []
        session = async_get_clientsession(self.hass)
        headers = {"Accept": "application/vnd.github.v3+json"}
        token = self._get_github_token()
        if token:
            headers["Authorization"] = f"token {token}"

        # 实时仓库元数据——存储的 default_branch 不可靠。
        meta = await self._fetch_repo_meta(full_name)
        default_branch = meta.get("default_branch") \
            or getattr(getattr(repo, "data", None), "default_branch", None) \
            or "main"

        # 发布标签 → 目标分支映射（target_commitish 为分支名）。
        tag_by_branch: dict[str, str] = {}
        try:
            url = f"https://api.github.com/repos/{full_name}/releases?per_page=30"
            async with session.get(url, headers=headers, timeout=15) as resp:
                if resp.status == 200:
                    for release in await resp.json():
                        tag = (release.get("tag_name") or "").strip()
                        cs = (release.get("target_commitish") or "").strip()
                        if tag and cs and cs not in tag_by_branch:
                            tag_by_branch[cs] = tag
        except Exception as e:
            _LOGGER.debug("Fetch releases for version map failed: %s", e)

        refs: list[dict] = []

        # 分支
        try:
            url = f"https://api.github.com/repos/{full_name}/branches?per_page=30"
            async with session.get(url, headers=headers, timeout=15) as resp:
                if resp.status == 200:
                    for b in await resp.json():
                        name = b.get("name", "")
                        commit_obj = b.get("commit") or {}
                        sha = (commit_obj.get("sha") or "")[:7]
                        branch_info = {
                            "type": "branch",
                            "name": name,
                            "sha": sha,
                            "date": "",
                            "message": "",
                            "default": name == default_branch,
                        }
                        ver = tag_by_branch.get(name)
                        if ver:
                            branch_info["version"] = ver
                        refs.append(branch_info)
                else:
                    _LOGGER.debug("GitHub branches returned %s for %s", resp.status, full_name)
        except Exception as e:
            _LOGGER.debug("Fetch branches failed for %s: %s", full_name, e)

        # 实时默认分支上的近期提交
        try:
            url = f"https://api.github.com/repos/{full_name}/commits?per_page=15&sha={default_branch}"
            async with session.get(url, headers=headers, timeout=15) as resp:
                if resp.status == 200:
                    for c in await resp.json():
                        commit = c.get("commit") or {}
                        sha = (c.get("sha") or "")[:7]
                        commit_info = {
                            "type": "commit",
                            "name": c.get("sha", ""),
                            "sha": sha,
                            "date": (commit.get("committer") or {}).get("date", ""),
                            "message": (commit.get("message") or "").split("\n")[0][:80],
                            "default": False,
                        }
                        refs.append(commit_info)
                else:
                    _LOGGER.debug("GitHub commits returned %s for %s", resp.status, full_name)
        except Exception as e:
            _LOGGER.debug("Fetch commits failed for %s: %s", full_name, e)

        return refs

    def get_repo_rt_status(self, repo_id_or_name: str) -> dict | None:
        """从 HACS 内存数据（而非 .storage 文件）获取实时状态。"""
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
        # 若可用则附加安装进度
        progress = self.get_install_progress(repo.data.full_name) or self.get_install_progress(repo_id_or_name)
        if progress:
            result["progress"] = progress
        return result

    async def refresh_repositories(self) -> dict:
        """刷新 HACS 仓库数据——并发更新并感知速率限制。"""
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

        # 限制并发为 5，避免猛击 GitHub API
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
        """向 HACS 添加自定义仓库。"""
        config = await self._data.get_config()
        custom_repos = config.get("custom_repositories", [])

        already_in_config = any(r.get("repository") == full_name for r in custom_repos)

        if not already_in_config:
            custom_repos.append({"repository": full_name, "category": category})
            config["custom_repositories"] = custom_repos
            ok = await self._data.update_config(config)
            if not ok:
                return {"success": False, "error": "write_failed"}

        # 同时持久化到我们的备份存储（HACS 2.0 可能剥离 custom_repositories）
        our_repos = await self._data.get_custom_repos_list()
        if not any(r.get("repository") == full_name for r in our_repos):
            our_repos.append({"repository": full_name, "category": category})
            await self._data.set_custom_repos_list(our_repos)

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
                    err_str = str(e).lower()

                    if "not compliant" in err_str or "structure" in err_str:
                        _LOGGER.warning(
                            "HACS validation failed for %s (likely latest stable release "
                            "lacks custom_components/). Retrying with check=False...",
                            full_name
                        )
                        # 抓取 GitHub 仓库 ID，使 HACS 的 register() 不会跳过
                        #（register() 在 repo.data.id == "0" 时提前返回）。
                        repo_id = await self._fetch_github_repo_id(full_name)
                        if repo_id:
                            try:
                                await self._hacs.async_register_repository(
                                    repository_full_name=full_name,
                                    category=category,
                                    check=False,
                                    repository_id=repo_id,
                                )
                                _LOGGER.info(
                                    "Repository %s registered with check=False (id=%s)",
                                    full_name, repo_id
                                )
                            except Exception as e2:
                                _LOGGER.warning(
                                    "HACS register still failed after retry: %s", e2,
                                    exc_info=True
                                )
                                return {
                                    "success": False,
                                    "error": f"HACS register failed: {e2}"
                                }
                        else:
                            _LOGGER.warning(
                                "Could not fetch GitHub repo ID for %s, "
                                "falling back to direct registration attempt",
                                full_name
                            )
                            try:
                                await self._hacs.async_register_repository(
                                    repository_full_name=full_name,
                                    category=category,
                                    check=False,
                                )
                            except Exception as e2:
                                _LOGGER.warning(
                                    "HACS register still failed: %s", e2, exc_info=True
                                )
                                return {
                                    "success": False,
                                    "error": f"HACS register failed: {e2}"
                                }
                    else:
                        _LOGGER.warning("HACS register failed after add: %s", e, exc_info=True)
                        return {"success": False, "error": f"HACS register failed: {e}"}

            # 立即将新注册的仓库持久化到 .storage/hacs.repositories。
            try:
                await self._hacs.data.async_write()
            except Exception as e:
                _LOGGER.warning("HACS data write failed after add: %s", e, exc_info=True)

        return {"success": True, "repository": full_name}

    async def _fetch_github_repo_id(self, full_name: str) -> str | None:
        """通过 API 获取 GitHub 仓库数字 ID。"""

        session = async_get_clientsession(self.hass)
        url = f"https://api.github.com/repos/{full_name}"
        try:
            async with session.get(url, timeout=10) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    repo_id = str(data.get("id", "0"))
                    return repo_id if repo_id != "0" else None
                _LOGGER.warning(
                    "GitHub API returned %s for %s", resp.status, full_name
                )
        except asyncio.TimeoutError:
            _LOGGER.warning("GitHub API timed out fetching %s", full_name)
        except Exception as ex:
            _LOGGER.warning("GitHub API error for %s: %s", full_name, ex)
        return None

    async def remove_custom_repository(self, full_name: str) -> dict:
        """从 HACS 移除自定义仓库。"""
        if not self.available:
            return {"success": False, "error": "HACS not available"}

        # 清理我们的备份存储
        our_repos = await self._data.get_custom_repos_list()
        filtered = [r for r in our_repos if r.get("repository", "").lower() != full_name.lower()]
        if len(filtered) < len(our_repos):
            await self._data.set_custom_repos_list(filtered)

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