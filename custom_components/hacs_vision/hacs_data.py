"""HACS Vision HACS 数据平台。"""
from __future__ import annotations
import asyncio
import json
import logging
import os
import time

from homeassistant.helpers.translation import async_get_translations

from .const import STORAGE_PATHS

_LOGGER = logging.getLogger(__name__)

class HACSData:
    """通过 SSH/文件访问读写 HACS 存储数据。"""

    def __init__(self, hass) -> None:
        self.hass = hass
        self._config_cache = None  # 配置项缓存映射
        self._cache_ready = False
        self._key_locks: dict[str, asyncio.Lock] = {}

    def _key_lock(self, key: str) -> asyncio.Lock:
        """按存储键加锁——串行化读-改-写周期。"""
        if key not in self._key_locks:
            self._key_locks[key] = asyncio.Lock()
        return self._key_locks[key]

    async def update_storage(self, key: str, updater) -> bool:
        """对存储文件加锁的读-改-写。"""

        async with self._key_lock(key):
            data = await self.read_storage(key)
            new_data = updater(data)
            if new_data is None:
                return True
            return await self.write_storage(key, new_data)

    @staticmethod
    def _read_json_sync(path: str) -> dict | None:
        """阻塞式 JSON 文件读取——须通过 executor 执行。"""
        try:
            with open(path) as f:
                return json.load(f)
        except Exception:
            return None

    def _get_path(self, key: str) -> str:
        rel_path = STORAGE_PATHS.get(key)
        if not rel_path:
            raise ValueError(f"Unknown storage key: {key}")
        return self.hass.config.path(rel_path)

    async def _async_read_file(self, path: str) -> str | None:
        """在 executor 中读取文件以避免阻塞。"""
        # 先检查文件是否存在，避免刷错误日志
        if not os.path.isfile(path):
            _LOGGER.debug("File not found, skipping: %s", path)
            return None
        try:
            return await self.hass.async_add_executor_job(self._read_file, path)
        except Exception as e:
            _LOGGER.error("Failed to read %s: %s", path, e)
            return None

    def _read_file(self, path: str) -> str:
        """同步读取文件。"""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    async def _async_write_file(self, path: str, content: str) -> bool:
        """在 executor 中写入文件。"""
        try:
            await self.hass.async_add_executor_job(self._write_file, path, content)
            return True
        except Exception as e:
            _LOGGER.error("Failed to write %s: %s", path, e)
            return False

    def _write_file(self, path: str, content: str) -> None:
        """原子写入：写临时文件 → fsync → 重命名（不保留中间备份）。"""
        temp_path = f"{path}.tmp"
        # 写临时文件并 fsync，保证崩溃安全
        with open(temp_path, "w", encoding="utf-8") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        # 原子替换（同文件系统），不保留中间备份
        os.replace(temp_path, path)
        # 清理上一轮遗留的备份
        backup_path = f"{path}.bak"
        if os.path.isfile(backup_path):
            try:
                os.remove(backup_path)
            except OSError:
                pass

    async def read_storage(self, key: str) -> dict | None:
        """读取 .storage 文件并返回解析后的 JSON。"""
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
        """写入 .storage 文件并做原子备份。"""
        content = json.dumps(data, indent=2, ensure_ascii=False)
        path = self._get_path(key)
        return await self._async_write_file(path, content)

    async def get_all_repositories(self) -> list[dict]:
        """从目录获取所有仓库。"""
        data = await self.read_storage("repositories")
        if not data:
            return []
        repos_dict = data.get("data", {})
        result = []
        for repo_id, repo_info in repos_dict.items():
            r = dict(repo_info)
            r["id"] = repo_id
            # 将存储字段名映射到 API 字段名
            if "installed_version" not in r and "version_installed" in r:
                r["installed_version"] = r["version_installed"] or None
            if "latest_version" not in r and "last_version" in r:
                r["latest_version"] = r["last_version"] or None
            result.append(r)
        return result

    async def get_repository(self, repo_id: str) -> dict | None:
        """按 ID 或 full_name 获取单个仓库。"""
        repos = await self.get_all_repositories()
        for r in repos:
            if str(r.get("id", "")) == repo_id or r.get("full_name") == repo_id:
                return r
        return None

    async def get_installed_repositories(self) -> list[dict]:
        """从 hacs.data 获取所有已安装仓库。"""
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
        """获取 HACS 配置。"""
        data = await self.read_storage("config")
        if not data:
            return {}
        return data.get("data", {})

    async def update_config(self, config_data: dict) -> bool:
        """将键合并进 HACS 配置。"""
        def _merge(data):
            if not data:
                return None
            merged = dict(data.get("data") or {})
            merged.update(config_data)
            data["data"] = merged
            return data
        return await self.update_storage("config", _merge)

    async def get_install_times(self) -> dict[str, str]:
        """获取安装时间。返回 {full_name: ISO 时间戳}。"""
        data = await self.read_storage("install_times")
        if not data:
            return {}
        return data.get("data", {})

    async def set_install_time(self, full_name: str, timestamp: str) -> bool:
        """记录仓库的安装时间。"""
        times = await self.get_install_times()
        times[full_name] = timestamp
        return await self.write_storage("install_times", {"data": times})

    async def remove_install_time(self, full_name: str) -> bool:
        """移除仓库的安装时间记录。"""
        times = await self.get_install_times()
        if full_name in times:
            del times[full_name]
            return await self.write_storage("install_times", {"data": times})
        return True

    async def get_favorites(self) -> list[str]:
        """获取收藏的仓库 ID 列表。"""
        data = await self.read_storage("favorites")
        if not data:
            return []
        return data.get("data", [])

    async def set_favorites(self, favorites: list[str]) -> bool:
        """保存完整收藏列表。"""
        return await self.write_storage("favorites", {"data": favorites})

    async def get_settings(self) -> dict:
        """获取 HACS Vision 的用户设置。"""
        data = await self.read_storage("settings")
        if not data:
            return {}
        return data.get("data", {})

    async def set_settings(self, settings: dict) -> bool:
        """保存 HACS Vision 的用户设置。"""
        return await self.write_storage("settings", {"data": settings})

    async def get_config_entries_map(self, force_refresh=False) -> list[dict]:
        """获取所有配置项（含子配置项类型与翻译名称）。"""
        if self._cache_ready and not force_refresh and self._config_cache is not None:
            # 返回缓存前先从实时配置项刷新状态与能力字段
            await self._refresh_dynamic_fields(self._config_cache)
            return self._config_cache

        result = []
        domains = set()
        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                domains.add(entry.domain)

        # 一次性加载所有域的翻译
        translations = {}
        try:
            lang = self.hass.config.language
            _LOGGER.debug("Loading translations for %d domains (lang=%s)", len(domains), lang)

            # 方法 1：从 HA 翻译系统取配置流标题
            trans_data = await async_get_translations(
                self.hass, lang, "config", list(domains)
            )
            for domain in domains:
                name = trans_data.get(f"component.{domain}.config.title")
                if name:
                    translations[domain] = name

            # 方法 2：直接读取翻译文件获取根级标题
            for domain in domains:
                if domain in translations:
                    continue
                # 先尝试 custom_components 翻译
                trans_path = self.hass.config.path(
                    "custom_components", domain, "translations", f"{lang}.json"
                )
                # 再尝试内置组件的翻译
                if not os.path.isfile(trans_path):
                    try:
                        import homeassistant.components as ha_comp
                        comp_base = os.path.dirname(
                            ha_comp.__file__
                        ) if hasattr(ha_comp, '__file__') and ha_comp.__file__ else None
                        # 回退：components 目录相对 homeassistant 包
                        if not comp_base or not os.path.isdir(comp_base):
                            import homeassistant
                            comp_base = os.path.join(
                                os.path.dirname(homeassistant.__file__), "components"
                            )
                        if comp_base and os.path.isdir(comp_base):
                            trans_path = os.path.join(
                                comp_base, domain, "translations", f"{lang}.json"
                            )
                    except Exception:
                        pass

                if trans_path and os.path.isfile(trans_path):
                    try:
                        root = await self.hass.async_add_executor_job(
                            self._read_json_sync, trans_path
                        )
                        if root:
                            title = root.get("title") or root.get("name")
                            if title:
                                translations[domain] = title
                    except Exception:
                        pass

            # 方法 3：回退到 manifest.json 名称（对自定义集成有效）
            for domain in domains:
                if domain in translations:
                    continue
                # 尝试 custom_components 的 manifest
                manifest_path = self.hass.config.path(
                    "custom_components", domain, "manifest.json"
                )
                if os.path.isfile(manifest_path):
                    try:
                        manifest = await self.hass.async_add_executor_job(
                            self._read_json_sync, manifest_path
                        )
                        if manifest:
                            name = manifest.get("name", "")
                            if name:
                                translations[domain] = name
                    except Exception:
                        pass

            _LOGGER.debug("Translations loaded: %d/%d domains",
                          len(translations), len(domains))
        except Exception as exc:
            _LOGGER.warning("Failed to load translations: %s", exc)

        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                entry_state = None
                try:
                    if hasattr(entry, 'state') and entry.state is not None:
                        entry_state = entry.state.name.lower()
                except Exception:
                    pass
                subentry_types = None
                try:
                    if hasattr(entry, 'supported_subentry_types'):
                        st = entry.supported_subentry_types
                        if st:
                            subentry_types = list(st.keys())
                except Exception:
                    pass
                supports_options = None
                try:
                    if hasattr(entry, 'supports_options'):
                        supports_options = entry.supports_options
                except Exception:
                    pass
                supports_reconfigure = None
                try:
                    if hasattr(entry, 'supports_reconfigure'):
                        supports_reconfigure = entry.supports_reconfigure
                except Exception:
                    pass
                supports_remove_device = None
                try:
                    if hasattr(entry, 'supports_remove_device'):
                        supports_remove_device = entry.supports_remove_device
                except Exception:
                    pass
                num_subentries = 0
                try:
                    if hasattr(entry, 'num_subentries'):
                        num_subentries = entry.num_subentries
                except Exception:
                    pass
                # 读取 manifest 中的 iot_class
                iot_class = None
                manifest_path = self.hass.config.path(
                    "custom_components", entry.domain, "manifest.json"
                )
                is_custom = os.path.isfile(manifest_path)
                # 也尝试内置组件的 manifest
                if not is_custom:
                    import homeassistant.components as ha_comp
                    builtin_base = os.path.dirname(ha_comp.__file__) if hasattr(ha_comp, '__file__') and ha_comp.__file__ else None
                    if builtin_base and os.path.isdir(builtin_base):
                        manifest_path = os.path.join(builtin_base, entry.domain, "manifest.json")
                if os.path.isfile(manifest_path):
                    try:
                        manifest = await self.hass.async_add_executor_job(
                            self._read_json_sync, manifest_path
                        )
                        if manifest:
                            iot_class = manifest.get("iot_class")
                    except Exception:
                        pass

                result.append({
                    "domain": entry.domain,
                    "entry_id": entry.entry_id,
                    "title": entry.title,
                    "translated_name": translations.get(entry.domain),
                    "source": entry.source,
                    "state": entry_state or "loaded",
                    "disabled_by": entry.disabled_by.value if hasattr(entry.disabled_by, 'value') else entry.disabled_by,
                    "supports_options": supports_options,
                    "supports_reconfigure": supports_reconfigure,
                    "supports_remove_device": supports_remove_device,
                    "supported_subentry_types": subentry_types,
                    "num_subentries": num_subentries,
                    "is_custom": is_custom,
                    "iot_class": iot_class,
                })
        self._config_cache = result
        self._cache_ready = True
        # 构建缓存后，从实时配置项刷新状态与能力字段
        #（这些字段读取成本低且频繁变化）
        await self._refresh_dynamic_fields(result)
        return result

    async def _refresh_dynamic_fields(self, cached: list[dict]) -> None:
        """从实时配置项刷新状态与能力字段。"""
        try:
            live_entries = {e.entry_id: e for e in self.hass.config_entries.async_entries()}
            for item in cached:
                eid = item.get("entry_id")
                entry = live_entries.get(eid)
                if not entry:
                    continue
                # 状态
                try:
                    item["state"] = entry.state.name.lower() if entry.state else "loaded"
                except Exception:
                    item["state"] = "loaded"
                # 支持选项
                try:
                    item["supports_options"] = entry.supports_options if hasattr(entry, 'supports_options') else None
                except Exception:
                    item["supports_options"] = None
                # 是否支持重配置
                try:
                    item["supports_reconfigure"] = entry.supports_reconfigure if hasattr(entry, 'supports_reconfigure') else None
                except Exception:
                    item["supports_reconfigure"] = None
                # 支持移除设备
                try:
                    item["supports_remove_device"] = entry.supports_remove_device if hasattr(entry, 'supports_remove_device') else None
                except Exception:
                    item["supports_remove_device"] = None
                # 子配置项类型 + 数量
                try:
                    st = entry.supported_subentry_types if hasattr(entry, 'supported_subentry_types') else None
                    if st:
                        item["supported_subentry_types"] = list(st.keys()) if isinstance(st, dict) else list(st)
                    else:
                        item["supported_subentry_types"] = None
                except Exception:
                    pass
                try:
                    if hasattr(entry, 'num_subentries'):
                        item["num_subentries"] = entry.num_subentries
                except Exception:
                    pass
        except Exception as exc:
            _LOGGER.warning("Dynamic field refresh error: %s", exc)

    async def get_custom_repos_list(self) -> list[dict]:
        """从本集成自有备份存储获取自定义仓库。"""

        data = await self.read_storage("custom_repos")
        if not data:
            return []
        return data.get("data", [])

    async def set_custom_repos_list(self, repos: list[dict]) -> bool:
        """将自定义仓库保存到本集成自有备份存储。"""
        return await self.write_storage("custom_repos", {"data": repos})

    async def send_persistent_notification(self, title: str, message: str, notification_id: str | None = None) -> None:
        """向 HA 发送持久化通知。"""
        try:
            nid = notification_id or f"hacs_vision_{int(time.monotonic())}"
            await self.hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": title,
                    "message": message,
                    "notification_id": nid,
                },
                blocking=False,
            )
        except Exception as e:
            _LOGGER.error("Failed to send notification: %s", e)