"""Read/write HACS .storage files."""
from __future__ import annotations
import json
import logging
import time
from typing import Any

from .const import STORAGE_PATHS

_LOGGER = logging.getLogger(__name__)

class HACSData:
    """Read and write HACS storage data via SSH/file access."""

    def __init__(self, hass) -> None:
        self.hass = hass
        self._config_cache = None  # cached config entries map
        self._cache_ready = False

    @staticmethod
    def _read_json_sync(path: str) -> dict | None:
        """Blocking JSON file read — must run via executor."""
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
        """Read a file in executor to avoid blocking."""
        # Check if file exists first to avoid spamming error logs
        import os
        if not os.path.isfile(path):
            _LOGGER.debug("File not found, skipping: %s", path)
            return None
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
        """Atomic write: write to temp file, fsync, then rename (no intermediate backup).

        Correct atomic write sequence:
          1. Write content to a .tmp file with fsync
          2. os.replace(.tmp → target) — atomic on same filesystem
          3. Clean up any stale .bak from previous runs

        Do NOT create a .bak before replacing — that introduces a window where
        crash between os.replace(old→bak) and os.replace(tmp→old) loses the file.
        """
        import os
        temp_path = f"{path}.tmp"
        # Write to temp file, then fsync for crash safety
        with open(temp_path, "w", encoding="utf-8") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        # Atomic replace (same filesystem) — no intermediate backup
        os.replace(temp_path, path)
        # Clean up stale backup from previous runs
        backup_path = f"{path}.bak"
        if os.path.isfile(backup_path):
            try:
                os.remove(backup_path)
            except OSError:
                pass

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

    # ===== Settings (our own data) =====

    async def get_settings(self) -> dict:
        """Get user settings for HACS Vision."""
        data = await self.read_storage("settings")
        if not data:
            return {}
        return data.get("data", {})

    async def set_settings(self, settings: dict) -> bool:
        """Save user settings for HACS Vision."""
        return await self.write_storage("settings", {"data": settings})

    async def get_config_entries_map(self, force_refresh=False) -> list[dict]:
        """Get all config entries with subentry_type info and translated names.
        
        Results are cached in-memory for the lifetime of the component.
        Call with force_refresh=True to rebuild.
        """
        if self._cache_ready and not force_refresh and self._config_cache is not None:
            # Refresh state & capabilities from live entries before returning cache
            await self._refresh_dynamic_fields(self._config_cache)
            return self._config_cache

        result = []
        domains = set()
        for entry in self.hass.config_entries.async_entries():
            if entry.domain:
                domains.add(entry.domain)

        # Load translations for all domains at once
        translations = {}
        try:
            from homeassistant.helpers.translation import async_get_translations
            lang = self.hass.config.language
            _LOGGER.debug("Loading translations for %d domains (lang=%s)", len(domains), lang)

            # Method 1: Config flow titles from HA translation system
            trans_data = await async_get_translations(
                self.hass, lang, "config", list(domains)
            )
            for domain in domains:
                name = trans_data.get(f"component.{domain}.config.title")
                if name:
                    translations[domain] = name

            # Method 2: Read translation file directly for root-level title
            import json, os
            for domain in domains:
                if domain in translations:
                    continue
                # Try custom_components translations first
                trans_path = self.hass.config.path(
                    "custom_components", domain, "translations", f"{lang}.json"
                )
                # Try built-in component translations
                if not os.path.isfile(trans_path):
                    try:
                        import homeassistant.components as ha_comp
                        comp_base = os.path.dirname(
                            ha_comp.__file__
                        ) if hasattr(ha_comp, '__file__') and ha_comp.__file__ else None
                        # Fallback: components folder is relative to homeassistant package
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

            # Method 3: Fallback to manifest.json name (works for custom integrations)
            for domain in domains:
                if domain in translations:
                    continue
                # Try custom_components manifest
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
                # Read manifest for iot_class
                iot_class = None
                manifest_path = self.hass.config.path(
                    "custom_components", entry.domain, "manifest.json"
                )
                is_custom = os.path.isfile(manifest_path)
                # Also try built-in components manifest
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
        # After building cache, refresh state & capabilities from live entries
        # (state and capabilities are cheap to read and change frequently)
        await self._refresh_dynamic_fields(result)
        return result

    async def _refresh_dynamic_fields(self, cached: list[dict]) -> None:
        """Refresh state and capability fields from live config entries.
        These fields change dynamically (entry load/unload, etc.) and
        should not be stale even when the cache is valid.
        """
        try:
            live_entries = {e.entry_id: e for e in self.hass.config_entries.async_entries()}
            for item in cached:
                eid = item.get("entry_id")
                entry = live_entries.get(eid)
                if not entry:
                    continue
                # State
                try:
                    item["state"] = entry.state.name.lower() if entry.state else "loaded"
                except Exception:
                    item["state"] = "loaded"
                # Supports options
                try:
                    item["supports_options"] = entry.supports_options if hasattr(entry, 'supports_options') else None
                except Exception:
                    item["supports_options"] = None
                # Supports reconfigure
                try:
                    item["supports_reconfigure"] = entry.supports_reconfigure if hasattr(entry, 'supports_reconfigure') else None
                except Exception:
                    item["supports_reconfigure"] = None
                # Supports remove device
                try:
                    item["supports_remove_device"] = entry.supports_remove_device if hasattr(entry, 'supports_remove_device') else None
                except Exception:
                    item["supports_remove_device"] = None
                # Subentry types + count
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

    def invalidate_config_cache(self) -> None:
        """Invalidate the config entries cache on changes."""
        self._cache_ready = False
        self._config_cache = None

    # ===== Custom Repositories (our own backup for HACS 2.0 compat) =====

    async def get_custom_repos_list(self) -> list[dict]:
        """Get custom repositories from our own backup storage.
        
        HACS 2.0 may strip custom_repositories from hacs.hacs, so we
        maintain our own copy to ensure persistence across restarts.
        """
        data = await self.read_storage("custom_repos")
        if not data:
            return []
        return data.get("data", [])

    async def set_custom_repos_list(self, repos: list[dict]) -> bool:
        """Save custom repositories to our own backup storage."""
        return await self.write_storage("custom_repos", {"data": repos})

    async def send_persistent_notification(self, title: str, message: str, notification_id: str | None = None) -> None:
        """Send a persistent notification to HA.

        Args:
            title: Notification title.
            message: Notification body (supports markdown).
            notification_id: Optional fixed ID. If provided, new notifications
                             replace old ones with the same ID. Defaults to
                             a unique monotonic ID.
        """
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

