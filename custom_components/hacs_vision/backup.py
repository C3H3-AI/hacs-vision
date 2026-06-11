"""Backup and restore installed repository lists."""
from __future__ import annotations
from datetime import datetime
from typing import TYPE_CHECKING

from .hacs_data import HACSData

if TYPE_CHECKING:
    from .hacs_operator import HACSOperator

class BackupManager:
    def __init__(self, hass, shared_data: HACSData | None = None, operator: HACSOperator | None = None) -> None:
        self.data = shared_data or HACSData(hass)
        self.hass = hass
        self.operator = operator

    async def export(self) -> dict:
        """Export installed repository list as JSON — uses HACS in-memory data for real-time accuracy."""
        # Prefer HACS in-memory data (real-time) over .storage file (may be stale)
        if self.operator and self.operator.available:
            installed = self.operator.get_installed_list()
            installed_records = [
                {
                    "full_name": r.get("full_name", ""),
                    "category": r.get("category", "integration"),
                    "installed_version": r.get("installed_version", ""),
                }
                for r in installed
            ]
        else:
            # Fallback to storage file if HACS not available
            installed_raw = await self.data.get_installed_repositories()
            installed_records = [
                {
                    "full_name": r.get("full_name", ""),
                    "category": r.get("category", "integration"),
                    "installed_version": r.get("installed_version", ""),
                }
                for r in installed_raw
            ]

        config = await self.data.get_config()
        return {
            "exported_at": datetime.now().isoformat(),
            "version": "1.0",
            "installed": installed_records,
            "custom_repositories": config.get("custom_repositories", []),
        }

    async def import_data(self, backup_data: dict) -> dict:
        """Import repository list from backup dict — actually writes to HACS storage."""
        if not backup_data or not isinstance(backup_data, dict):
            return {"success": False, "error": "empty_data"}

        installed = backup_data.get("installed", [])
        custom = backup_data.get("custom_repositories", [])

        added_custom = 0

        # 1. Add custom repositories to HACS config
        if custom and isinstance(custom, list):
            config = await self.data.get_config()
            existing_custom = config.get("custom_repositories", [])
            existing_urls = {r.get("repository") if isinstance(r, dict) else r for r in existing_custom}

            for repo in custom:
                repo_url = repo if isinstance(repo, str) else repo.get("repository", "")
                repo_category = repo.get("category", "integration") if isinstance(repo, dict) else "integration"
                if repo_url and repo_url not in existing_urls:
                    existing_custom.append({"repository": repo_url, "category": repo_category})
                    existing_urls.add(repo_url)
                    added_custom += 1

            config["custom_repositories"] = existing_custom
            await self.data.update_config(config)

        # 2. For installed repos, we can't directly install them (that requires HACS internal API),
        # but we can return the list so the user knows what needs to be reinstalled
        count_installed = len(installed) if isinstance(installed, list) else 0
        count_custom = len(custom) if isinstance(custom, list) else 0

        return {
            "success": True,
            "installed_count": count_installed,
            "custom_count": count_custom,
            "custom_added": added_custom,
            "note": "Custom repositories have been restored. Installed repositories need to be reinstalled manually through the browse page.",
        }