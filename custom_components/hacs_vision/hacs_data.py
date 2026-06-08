"""Read/write HACS .storage files."""
from __future__ import annotations
import json
import logging
from typing import Any

from .const import STORAGE_PATHS

_LOGGER = logging.getLogger(__name__)

class HACSData:
    """Read and write HACS storage data via SSH/file access."""

    def __init__(self, hass) -> None:
        self.hass = hass

    def _get_path(self, key: str) -> str:
        rel_path = STORAGE_PATHS.get(key)
        if not rel_path:
            raise ValueError(f"Unknown storage key: {key}")
        return self.hass.config.path(rel_path)

    async def _async_read_file(self, path: str) -> str | None:
        """Read a file in executor to avoid blocking."""
        try:
            return await self.hass.async_add_executor_job(self._read_file, path)
        except Exception as e:
            _LOGGER.error("Failed to read %s: %s", path, e)
            return None

    def _read_file(self, path: str) -> str:
        """Synchronous file read."""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    async def _async_write_file(self, path: str, content: str) -> bool:
        """Write a file in executor."""
        try:
            await self.hass.async_add_executor_job(self._write_file, path, content)
            return True
        except Exception as e:
            _LOGGER.error("Failed to write %s: %s", path, e)
            return False

    def _write_file(self, path: str, content: str) -> None:
        """Atomic write: write to temp file, then rename."""
        import os
        temp_path = f"{path}.tmp"
        backup_path = f"{path}.bak"
        # Write to temp file first
        with open(temp_path, "w", encoding="utf-8") as f:
            f.write(content)
        # Backup existing file
        if os.path.exists(path):
            try:
                os.replace(path, backup_path)
            except OSError:
                pass
        # Move temp to target (atomic on same filesystem)
        os.replace(temp_path, path)

    async def read_storage(self, key: str) -> dict | None:
        """Read a .storage file, return parsed JSON."""
        path = self._get_path(key)
        content = await self._async_read_file(path)
        if content is None:
            return None
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            _LOGGER.error("Invalid JSON in %s: %s", path, e)
            return None

    async def write_storage(self, key: str, data: dict) -> bool:
        """Write to a .storage file with atomic backup."""
        content = json.dumps(data, indent=2, ensure_ascii=False)
        path = self._get_path(key)
        return await self._async_write_file(path, content)

    async def get_all_repositories(self) -> list[dict]:
        """Get all repositories from the catalog.

        hacs.repositories structure:
        {"data": {"<repo_id>": {"full_name": ..., "category": ..., ...}, ...}}

        Storage field mapping:
        - key → id
        - version_installed → installed_version
        - last_version → latest_version
        """
        data = await self.read_storage("repositories")
        if not data:
            return []
        repos_dict = data.get("data", {})
        result = []
        for repo_id, repo_info in repos_dict.items():
            r = dict(repo_info)
            r["id"] = repo_id
            # Map storage field names to API field names
            if "installed_version" not in r and "version_installed" in r:
                r["installed_version"] = r["version_installed"] or None
            if "latest_version" not in r and "last_version" in r:
                r["latest_version"] = r["last_version"] or None
            result.append(r)
        return result

    async def get_repository(self, repo_id: str) -> dict | None:
        """Get a single repository by ID or full_name."""
        repos = await self.get_all_repositories()
        for r in repos:
            if str(r.get("id", "")) == repo_id or r.get("full_name") == repo_id:
                return r
        return None

    async def get_installed_repositories(self) -> list[dict]:
        """Get all installed repositories from hacs.data.

        hacs.data structure:
        {"data": {"repositories": {"integration": [...], "plugin": [...], ...}}}
        """
        data = await self.read_storage("data")
        if not data:
            return []
        cat_dict = data.get("data", {}).get("repositories", {})
        installed = []
        for cat_repos in cat_dict.values():
            if isinstance(cat_repos, list):
                installed.extend(cat_repos)
        return installed

    async def get_config(self) -> dict:
        """Get HACS configuration."""
        data = await self.read_storage("config")
        if not data:
            return {}
        return data.get("data", {})

    async def update_config(self, config_data: dict) -> bool:
        """Update HACS configuration."""
        data = await self.read_storage("config")
        if not data:
            return False
        data["data"] = config_data
        return await self.write_storage("config", data)

    # ===== Install Times (our own data) =====

    async def get_install_times(self) -> dict[str, str]:
        """Get install timestamps. Returns {full_name: ISO timestamp}."""
        data = await self.read_storage("install_times")
        if not data:
            return {}
        return data.get("data", {})

    async def set_install_time(self, full_name: str, timestamp: str) -> bool:
        """Record install time for a repository."""
        times = await self.get_install_times()
        times[full_name] = timestamp
        return await self.write_storage("install_times", {"data": times})

    async def remove_install_time(self, full_name: str) -> bool:
        """Remove install time record for a repository."""
        times = await self.get_install_times()
        if full_name in times:
            del times[full_name]
            return await self.write_storage("install_times", {"data": times})
        return True

    # ===== Favorites (our own data) =====

    async def get_favorites(self) -> list[str]:
        """Get favorite repository IDs. Returns list of repo IDs."""
        data = await self.read_storage("favorites")
        if not data:
            return []
        return data.get("data", [])

    async def set_favorites(self, favorites: list[str]) -> bool:
        """Save the full favorites list."""
        return await self.write_storage("favorites", {"data": favorites})

    async def add_favorite(self, repo_id: str) -> bool:
        """Add a repo to favorites."""
        favs = await self.get_favorites()
        if repo_id not in favs:
            favs.append(repo_id)
            return await self.set_favorites(favs)
        return True

    async def remove_favorite(self, repo_id: str) -> bool:
        """Remove a repo from favorites."""
        favs = await self.get_favorites()
        if repo_id in favs:
            favs.remove(repo_id)
            return await self.set_favorites(favs)
        return True

