"""HACS Vision 备份平台。"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any

from .hacs_data import HACSData
from .hacs_operator import HACSOperator

class BackupManager:
    def __init__(self, hass, shared_data: HACSData | None = None, operator: HACSOperator | None = None) -> None:
        self.data = shared_data or HACSData(hass)
        self.hass = hass
        self.operator = operator

    async def export(self) -> dict:
        """将已安装仓库列表导出为 JSON——使用 HACS 内存数据以保证实时准确。"""
        # 优先用 HACS 内存数据（实时），而非可能过期的 .storage 文件
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
            # HACS 不可用时回退到存储文件
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
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "version": "1.0",
            "installed": installed_records,
            "custom_repositories": self._custom_records(
                config.get("custom_repositories", [])
            ),
        }

    def _custom_records(self, entries) -> list[dict]:
        """把自定义仓库记录统一成 [{"repository": "owner/repo", "category": …}]。

        marketplace 的 custom_repositories 存的是仓库 ID 字符串，直接导出成 ID
        既看不懂也没法导入回别的安装，这里尽量还原成 owner/repo。
        """
        by_id: dict[str, Any] = {}
        if self.operator is not None:
            try:
                for repo in self.operator._hacs.repositories.list_all:
                    repo_id = str(getattr(getattr(repo, "data", None), "id", "") or "")
                    if repo_id:
                        by_id[repo_id] = repo
            except Exception:
                by_id = {}

        records: list[dict] = []
        for entry in entries or []:
            name = entry if isinstance(entry, str) else entry.get("repository", "")
            category = entry.get("category", "integration") if isinstance(entry, dict) else "integration"
            if not name:
                continue
            if "/" not in name and name in by_id:
                repo = by_id[name]
                repo_data = getattr(repo, "data", None)
                full_name = str(getattr(repo_data, "full_name", "") or "")
                if full_name:
                    name = full_name
                    category = str(getattr(repo_data, "category", "") or category)
            if "/" in name:
                records.append({"repository": name, "category": category})
        return records

    async def import_data(self, backup_data: dict) -> dict:
        """从备份字典导入仓库列表——实际写入 HACS 存储。"""
        if not backup_data or not isinstance(backup_data, dict):
            return {"success": False, "error": "empty_data"}

        installed = backup_data.get("installed", [])
        custom = backup_data.get("custom_repositories", [])

        added_custom = 0
        if custom and isinstance(custom, list):
            backend_name = None
            if self.operator is not None:
                try:
                    backend_name = self.operator.backend_name
                except Exception:
                    backend_name = None

            if backend_name == "marketplace":
                # marketplace 的 custom_repositories 存的是仓库 ID 集合，只能
                # 通过注册流程写入；直接往配置里塞 {"repository": 名字} 会写坏
                # 它的形状，而且下一次它自己 async_write 时还会把改动覆盖掉。
                existing_names = set()
                try:
                    for r in await self.data.get_custom_repos_list():
                        name = r.get("repository") if isinstance(r, dict) else r
                        if name:
                            existing_names.add(str(name).lower())
                except Exception:
                    pass

                for repo in custom:
                    repo_url = repo if isinstance(repo, str) else repo.get("repository", "")
                    repo_category = repo.get("category", "integration") if isinstance(repo, dict) else "integration"
                    if not repo_url or repo_url.lower() in existing_names:
                        continue
                    result = await self.operator.add_custom_repository(repo_url, repo_category)
                    if result.get("success"):
                        existing_names.add(repo_url.lower())
                        added_custom += 1
            else:
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

        count_installed = len(installed) if isinstance(installed, list) else 0
        count_custom = len(custom) if isinstance(custom, list) else 0

        return {
            "success": True,
            "installed_count": count_installed,
            "custom_count": count_custom,
            "custom_added": added_custom,
            "note": "Custom repositories have been restored. Installed repositories need to be reinstalled manually through the browse page.",
        }