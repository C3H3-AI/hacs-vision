"""后端适配层：HACS（旧，≤2026.10）与 Marketplace（HA 2026.11+ 内置）。

HA 2026.11 起核心自带 `marketplace` 集成，接管并**删除** `custom_components/hacs`。
本模块让 hacs_vision 在两种后端下都能工作：

- `MarketplaceBackend`：包装 `entry.runtime_data` 上的 MarketplaceManager，
  把它的 Repository 适配成 HACS Repository 的形状（`.data` / `.async_install` …）。
- `LegacyHacsBackend`：直接透传 `hass.data["hacs"]`，保持旧行为不变。

调用方只依赖：`backend.available`、`backend.name`、
`backend.repositories.list_all / list_downloaded / list_installed / get_by_id /
get_by_full_name / is_registered / register / unregister`、
`backend.async_register_repository(...)`、`backend.data.async_write()`。
"""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN_HACS

_LOGGER = logging.getLogger(__name__)

DOMAIN_MARKETPLACE = "marketplace"

BACKEND_HACS = "hacs"
BACKEND_MARKETPLACE = "marketplace"


# ─────────────────────────── Marketplace 适配 ───────────────────────────


class MarketplaceRepositoryAdapter:
    """把 marketplace 的 Repository 包成 HACS Repository 的形状。

    只做转发与改名，不复制状态——`data` 直接返回 marketplace 的
    RepositoryData 对象，字段名（full_name / installed / installed_version /
    last_version / category / stargazers_count / …）本来就一致。

    没有 `__slots__`：operator 在「按分支/SHA 安装」时会对 repo 打补丁
    （`repo.download_content = …`、`repo.force_branch = …`），__slots__ 会让
    这类赋值直接抛 AttributeError。写入统一转给底层对象，保证补丁真的生效。
    """

    def __init__(self, repo: Any) -> None:
        object.__setattr__(self, "_repo", repo)

    def __getattr__(self, name: str) -> Any:
        """未显式转发的属性，直接取底层的（update_filenames / ref / …）。"""
        return getattr(object.__getattribute__(self, "_repo"), name)

    def __setattr__(self, name: str, value: Any) -> None:
        """补丁写到最底层，HACS 的 monkey-patch 才能被 marketplace 用到。"""
        if name == "_repo":
            object.__setattr__(self, name, value)
            return
        setattr(object.__getattribute__(self, "_repo"), name, value)

    # 记录本体（operator 用它做兜底判断）
    @property
    def raw(self) -> Any:
        return self._repo

    @property
    def data(self) -> Any:
        return self._repo.data

    @property
    def releases(self) -> Any:
        return getattr(self._repo, "releases", None)

    @property
    def content(self) -> Any:
        return getattr(self._repo, "content", None)

    @property
    def display_installed_version(self) -> str:
        return self._repo.display_installed_version

    @property
    def display_available_version(self) -> str:
        return self._repo.display_available_version

    async def async_install(self, version: str | None = None, **kwargs: Any) -> None:
        """对应 HACS 的 async_install(version=…)。"""
        await self._repo.async_install_repository(ref=version)

    async def uninstall(self) -> None:
        await self._repo.uninstall()

    async def update_repository(
        self, ignore_issues: bool = False, force: bool = False
    ) -> None:
        await self._repo.update_repository(ignore_issues=ignore_issues, force=force)

    async def async_download_repository(self, ref: str | None = None) -> None:
        """按 ref 下载；无 ref 时走 zip 下载。"""
        if ref:
            await self._repo.download_content(version=ref)
        else:
            await self._repo.download_repository_zip()

    def __repr__(self) -> str:  # pragma: no cover - 调试用
        return f"<MarketplaceRepoAdapter {getattr(self._repo.data, 'full_name', '?')}>"


class MarketplaceRepositoriesAdapter:
    """包装 marketplace 的 Repositories 注册表。"""

    __slots__ = ("_repos",)

    def __init__(self, repos: Any) -> None:
        self._repos = repos

    @property
    def list_all(self) -> list[MarketplaceRepositoryAdapter]:
        return [MarketplaceRepositoryAdapter(r) for r in self._repos.list_all]

    @property
    def list_installed(self) -> list[MarketplaceRepositoryAdapter]:
        return [MarketplaceRepositoryAdapter(r) for r in self._repos.list_installed]

    # HACS 里叫 list_downloaded
    @property
    def list_downloaded(self) -> list[MarketplaceRepositoryAdapter]:
        return self.list_installed

    @property
    def _default_repositories(self) -> set[str]:
        return set(getattr(self._repos, "_default_repositories", ()) or ())

    def get_by_id(self, repository_id: str | None) -> MarketplaceRepositoryAdapter | None:
        repo = self._repos.get_by_id(repository_id)
        return None if repo is None else MarketplaceRepositoryAdapter(repo)

    def get_by_full_name(
        self, full_name: str | None
    ) -> MarketplaceRepositoryAdapter | None:
        repo = self._repos.get_by_full_name(full_name)
        return None if repo is None else MarketplaceRepositoryAdapter(repo)

    def is_registered(
        self,
        repository_id: str | None = None,
        repository_full_name: str | None = None,
    ) -> bool:
        try:
            return bool(
                self._repos.is_registered(
                    repository_id=repository_id,
                    repository_full_name=repository_full_name,
                )
            )
        except TypeError:
            # marketplace 的关键字名可能随版本变化，退化用位置参数
            return bool(self._repos.is_registered(repository_full_name))

    def unregister(self, repository: Any) -> None:
        raw = getattr(repository, "raw", repository)
        self._repos.unregister(raw)


class MarketplaceBackend:
    """HA 2026.11+ 内置 marketplace。"""

    name = BACKEND_MARKETPLACE

    def __init__(self, manager: Any) -> None:
        self._manager = manager
        self.repositories = MarketplaceRepositoriesAdapter(manager.repositories)

    @property
    def available(self) -> bool:
        return self._manager is not None

    @property
    def data(self) -> Any:
        """marketplace 的 MarketplaceData，提供 async_write()。"""
        return self._manager.data

    async def async_register_repository(
        self,
        repository_full_name: str,
        category: str,
        **kwargs: Any,
    ) -> Any:
        return await self._manager.async_register_repository(
            repository_full_name, category
        )

    @property
    def raw(self) -> Any:
        return self._manager


class LegacyHacsBackend:
    """≤2026.10：直接用 HACS 本体，行为与旧版一致。"""

    name = BACKEND_HACS

    def __init__(self, hacs: Any) -> None:
        self._hacs = hacs
        self.repositories = hacs.repositories

    @property
    def available(self) -> bool:
        return self._hacs is not None

    @property
    def data(self) -> Any:
        return self._hacs.data

    async def async_register_repository(
        self,
        repository_full_name: str,
        category: str,
        **kwargs: Any,
    ) -> Any:
        return await self._hacs.async_register_repository(
            repository_full_name=repository_full_name,
            category=category,
            **kwargs,
        )

    @property
    def raw(self) -> Any:
        return self._hacs


# ─────────────────────────── 检测与存储路径 ───────────────────────────


def async_detect_backend(hass: HomeAssistant) -> MarketplaceBackend | LegacyHacsBackend | None:
    """优先内置 marketplace，其次旧 HACS。两者都不在时返回 None。"""
    for entry in hass.config_entries.async_entries(DOMAIN_MARKETPLACE):
        manager = getattr(entry, "runtime_data", None)
        if manager is not None and getattr(manager, "repositories", None) is not None:
            return MarketplaceBackend(manager)

    hacs = hass.data.get(DOMAIN_HACS)
    if hacs is not None:
        return LegacyHacsBackend(hacs)

    return None


def async_backend_name(hass: HomeAssistant) -> str | None:
    """只做检测、不构造适配器的轻量查询（日志与面板用）。"""
    if hass.config_entries.async_entries(DOMAIN_MARKETPLACE):
        return BACKEND_MARKETPLACE
    if hass.data.get(DOMAIN_HACS) is not None:
        return BACKEND_HACS
    return None


def resolve_storage_path(hass: HomeAssistant, key: str, defaults: dict[str, str]) -> str | None:
    """按后端选择存储文件名。

    marketplace 与 HACS 的记录格式一致，只有文件名不同：
    `hacs.repositories` → `marketplace.repositories`，
    `hacs.hacs` → `marketplace.common`，`hacs.critical` → `marketplace.critical`。
    先探测文件是否已存在，避免在迁移尚未完成时读错。
    """
    rel = defaults.get(key)
    if not rel:
        return None

    if async_backend_name(hass) != BACKEND_MARKETPLACE:
        return rel

    renamed = {
        "repositories": ".storage/marketplace.repositories",
        "config": ".storage/marketplace.common",
        "data": ".storage/marketplace.repositories",  # marketplace 无 hacs.data，旧数据已在 repositories
    }.get(key)

    if not renamed:
        return rel

    # 新旧并存时以哪个为准：marketplace 文件存在就用它
    import os

    if os.path.isfile(hass.config.path(renamed)):
        return renamed
    return rel


def storage_paths(hass: HomeAssistant, defaults: dict[str, str]) -> dict[str, str]:
    """把整张 STORAGE_PATHS 表按当前后端解析一遍。"""
    resolved: dict[str, str] = {}
    for key in defaults:
        path = resolve_storage_path(hass, key, defaults)
        if path:
            resolved[key] = path
    return resolved
