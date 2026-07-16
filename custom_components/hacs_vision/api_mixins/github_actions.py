"""Mixin: GitHub interactions (star/unstar, issue creation, log fetching, sync)."""
from __future__ import annotations

import asyncio
import json
import logging
import time

import aiohttp
from aiohttp import web

from ..const import VERSION
from ..response import _error, _ok, _not_found, _bad_request, _unauthorized, _server_error

_LOGGER = logging.getLogger(__name__)


class GitHubActionsMixin:
    """GitHub star/unstar, issue creation, log fetching, and starred-repo sync."""

    # ── Star / Unstar ──────────────────────────────────

    async def _github_star(self, body: dict) -> web.Response:
        """Star a repository."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return _bad_request("invalid_repo")
        token = await self._get_active_github_token()
        if not token:
            return _unauthorized()
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json",
                   "Content-Length": "0"}
        try:
            session = await self._get_session()
            async with session.put(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 204:
                    return _ok(ok=True)
                return _error(f"star_failed_{resp.status}", resp.status)
        except Exception as e:
            return _server_error()

    async def _github_auto_star(self) -> web.Response:
        """Auto-star hacs-vision repo if not already starred."""
        repo = "C3H3-AI/hacs-vision"
        check_resp = await self._github_check_starred(repo)
        check_data = json.loads(check_resp.body)
        if check_data.get("starred"):
            return web.json_response({"ok": True, "already_starred": True})
        return await self._github_star({"repo": repo})

    async def _github_unstar(self, body: dict) -> web.Response:
        """Unstar a repository."""
        repo = body.get("repo", "").strip()
        if not repo or "/" not in repo:
            return _bad_request("invalid_repo")
        token = await self._get_active_github_token()
        if not token:
            return _unauthorized()
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.delete(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                      timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 204:
                    return _ok(ok=True)
                return _error(f"unstar_failed_{resp.status}", resp.status)
        except Exception as e:
            return _server_error()

    async def _github_check_starred(self, repo: str) -> web.Response:
        """Check if the authenticated user has starred a repo."""
        if not repo or "/" not in repo:
            return _bad_request("invalid_repo")
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"starred": False})
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get(f"https://api.github.com/user/starred/{repo}", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                return web.json_response({"starred": resp.status == 204})
        except Exception as e:
            return web.json_response({"starred": False, "error": "operation_failed"})

    async def _github_list_starred(self) -> web.Response:
        """Fetch all starred repos for the authenticated user, paginated."""
        token = await self._get_active_github_token()
        if not token:
            return _unauthorized(repos=[])
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        repos = []
        page = 1
        per_page = 100
        try:
            session = await self._get_session()
            while True:
                async with session.get(
                    f"https://api.github.com/user/starred?per_page={per_page}&page={page}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as resp:
                        if resp.status != 200:
                            break
                        data = await resp.json()
                        if not data:
                            break
                        for r in data:
                            full_name = r.get("full_name", "")
                            desc = r.get("description", "") or ""
                            topics = r.get("topics", []) or []
                            language = r.get("language") or ""
                            category = self._detect_hacs_category(r)
                            repos.append({
                                "full_name": full_name,
                                "name": r.get("name", ""),
                                "description": desc,
                                "stars": r.get("stargazers_count", 0),
                                "topics": topics,
                                "language": language,
                                "category": category,
                                "html_url": r.get("html_url", ""),
                                "updated_at": r.get("updated_at", ""),
                            })
                        if len(data) < per_page:
                            break
                        page += 1
        except Exception as e:
            _LOGGER.error("_github_list_starred error: %s", e, exc_info=True)
            return _server_error(repos=repos)
        return web.json_response({"repos": repos, "total": len(repos)})

    async def _github_list_org_repos(self, query) -> web.Response:
        """List repos of a GitHub user or organization, optionally filtering for HA-related."""
        org = query.get("org", "").strip()
        if not org:
            return _bad_request("org_required")
        org = org.rstrip("/")
        for prefix in ["https://github.com/", "http://github.com/", "github.com/"]:
            if org.startswith(prefix):
                org = org[len(prefix):]
        org = org.replace(".git", "").rstrip("/")
        if not org or "/" in org:
            return _bad_request("invalid_org")

        token = await self._get_active_github_token()
        headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        repos = []
        page = 1
        per_page = 100
        try:
            session = await self._get_session()
            while True:
                async with session.get(
                    f"https://api.github.com/users/{org}/repos?per_page={per_page}&page={page}&sort=updated&type=owner",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as resp:
                    if resp.status == 404:
                        async with session.get(
                            f"https://api.github.com/orgs/{org}/repos?per_page={per_page}&page={page}&sort=updated",
                            headers=headers,
                            timeout=aiohttp.ClientTimeout(total=15)
                        ) as org_resp:
                            if org_resp.status != 200:
                                return _error(f"user_or_org_not_found: {org}", 404)
                            data = await org_resp.json()
                    else:
                        data = await resp.json()
                    if not data:
                        break
                    for r in data:
                        full_name = r.get("full_name", "")
                        desc = r.get("description") or ""
                        topics = r.get("topics") or []
                        category = self._detect_hacs_category(r)
                        repos.append({
                            "full_name": full_name,
                            "name": r.get("name", ""),
                            "description": desc,
                            "stars": r.get("stargazers_count", 0),
                            "topics": topics,
                            "language": r.get("language") or "",
                            "category": category,
                            "html_url": r.get("html_url", ""),
                            "updated_at": r.get("updated_at", ""),
                        })
                    if len(data) < per_page:
                        break
                    page += 1
        except Exception as e:
            _LOGGER.error("_github_list_org_repos error: %s", e, exc_info=True)
            return _server_error()
        return web.json_response({"repos": repos, "total": len(repos)})

    def _detect_hacs_category(self, repo: dict) -> str:
        """Detect HACS category from a GitHub repo's metadata."""
        topics = [t.lower() for t in (repo.get("topics") or [])]
        desc = (repo.get("description") or "").lower()
        lang = (repo.get("language") or "").lower()
        name = (repo.get("name") or "").lower()

        topic_category_map = {
            "hacs-integration": "integration",
            "hacs-custom": "integration",
            "home-assistant-integration": "integration",
            "hacs-plugin": "plugin",
            "hacs-dashboard": "plugin",
            "lovelace-plugin": "plugin",
            "lovelace-card": "plugin",
            "hacs-theme": "theme",
            "home-assistant-theme": "theme",
            "hacs-python-script": "python_script",
            "hacs-appdaemon": "appdaemon",
            "hacs-netdaemon": "netdaemon",
            "hacs-addon": "addon",
        }
        for topic_key, cat in topic_category_map.items():
            if topic_key in topics:
                return cat

        if any(w in desc for w in ["plugin", "lovelace", "card", "dashboard"]):
            return "plugin"
        if any(w in desc for w in ["theme"]):
            return "theme"
        if any(w in desc for w in ["integration", "component", "custom_component"]):
            return "integration"
        if any(w in desc for w in ["addon", "add-on"]):
            return "addon"

        if any(w in desc for w in ["home assistant", "home-assistant", "hacs"]) or "home-assistant" in topics:
            return "integration"

        return "integration"

    # ── Sync starred to custom repos / favorites ───────

    async def _github_sync_starred(self, body: dict) -> web.Response:
        """Add selected starred repos as custom repositories."""
        selected = body.get("repos", [])
        if not selected:
            return _bad_request("no_repos")
        results = []
        for item in selected:
            if isinstance(item, str):
                full_name = item
                category = "integration"
            else:
                full_name = item.get("full_name", "")
                category = item.get("category", "integration")
            if not full_name or "/" not in full_name:
                results.append({"full_name": full_name, "success": False, "error": "invalid_name"})
                continue
            try:
                result = await self.operator.add_custom_repository(full_name, category)
                results.append({"full_name": full_name, "success": result.get("success", False),
                                "error": result.get("error", "")})
            except Exception as e:
                results.append({"full_name": full_name, "success": False, "error": "operation_failed"})
        return web.json_response({"results": results})

    async def _github_sync_favorites(self) -> web.Response:
        """Sync GitHub starred repos to local favorites. One backend call, all internal."""
        token = await self._get_active_github_token()
        if not token:
            return _unauthorized(added=[], synced=0, total=0)
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        starred_all: set[str] = set()
        page = 1
        per_page = 100
        try:
            session = await self._get_session()
            while True:
                async with session.get(
                    f"https://api.github.com/user/starred?per_page={per_page}&page={page}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as resp:
                        if resp.status != 200:
                            break
                        data = await resp.json()
                        if not data:
                            break
                        for r in data:
                            fn = r.get("full_name", "")
                            if fn:
                                starred_all.add(fn)
                        if len(data) < per_page:
                            break
                        page += 1
        except Exception as e:
            _LOGGER.error("_github_sync_favorites fetch error: %s", e, exc_info=True)
            return _error("operation_failed", 502, added=[], synced=0, total=0)
        hacs_repos = await self.operator.get_all_repos_from_hacs()
        if not hacs_repos:
            hacs_repos = await self.data.get_all_repositories()
        known_names = {r.get("full_name", "") for r in hacs_repos if r.get("full_name")}
        starred_names = {n for n in starred_all if n in known_names}
        current = await self.data.get_favorites()
        current_set = {str(f) for f in current}
        non_hacs_favs = {f for f in current_set if f not in known_names}
        hacs_favs_new = {f for f in current_set if f in known_names and f in starred_names}
        added = sorted(starred_names - {f for f in current_set})
        removed = sorted({f for f in current_set if f in known_names} - starred_names)
        new_favs = sorted(non_hacs_favs | hacs_favs_new | starred_names)
        if added or removed:
            await self.data.set_favorites(new_favs)
        return web.json_response({
            "synced_total": len(starred_all),
            "synced_hacs": len(starred_names),
            "added": added,
            "removed": removed,
            "total": len(new_favs),
        })

    # ── Log fetching ───────────────────────────────────

    async def _github_fetch_logs(self, domain: str | None = None, max_lines: int = 50) -> str:
        """Fetch HA error logs, optionally filtered by domain.

        Priority: supervisor Docker logs -> system_log component -> error_log API -> file fallback
        """
        text = ""
        import os as _os

        # 1. Supervisor API
        if not text:
            try:
                token = _os.environ.get("SUPERVISOR_TOKEN")
                if token:
                    connector = aiohttp.TCPConnector(force_close=True)
                    async with aiohttp.ClientSession(connector=connector) as sess:
                        async with sess.get(
                            "http://supervisor/core/logs",
                            headers={"Authorization": f"Bearer {token}"},
                            timeout=aiohttp.ClientTimeout(total=15),
                        ) as resp:
                            if resp.status == 200:
                                raw = await resp.text()
                                if raw and len(raw) > 50:
                                    lines = raw.strip().split("\n")
                                    import re as _re
                                    clean = []
                                    for ln in lines:
                                        ln = ln.strip()
                                        if not ln:
                                            continue
                                        ln = _re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', ln)
                                        if ln and len(ln) > 10:
                                            clean.append(ln)
                                    if clean:
                                        text = "\n".join(clean[-max_lines * 4:])
                                        _LOGGER.debug("Got %d lines from supervisor/core/logs", len(clean))
            except Exception:
                pass

        # 2. HA system_log component
        if not text:
            try:
                log_data = self.hass.data.get("system_log")
                if log_data and hasattr(log_data, "get_log_entries"):
                    entries = log_data.get_log_entries()
                elif log_data and isinstance(log_data, dict):
                    entries = log_data.get("log_entries", [])
                else:
                    entries = []
                if entries:
                    formatted = []
                    for entry in entries[-100:]:
                        ts = entry.get("timestamp", "") or entry.get("first_occurred", "")
                        name = entry.get("name", "")
                        message = entry.get("message", "")
                        if isinstance(message, list):
                            message = "\n".join(message)
                        if domain and domain not in name and domain not in message:
                            continue
                        if ts:
                            formatted.append(f"[{ts}] {name}: {message}")
                        else:
                            formatted.append(f"{name}: {message}")
                    text = "\n".join(formatted[-max_lines:])
            except Exception:
                pass

        # 3. HA error_log API
        if not text:
            try:
                session = await self._get_session()
                ha_url = self.hass.http.get_url()
                token = None
                for var in ("HASSIO_TOKEN", "SUPERVISOR_TOKEN", "HA_TOKEN"):
                    v = _os.environ.get(var)
                    if v:
                        token = v
                        break
                if not token:
                    token = await self._get_active_github_token()
                if token:
                    async with session.get(
                        f"{ha_url}/api/error_log",
                        headers={"Authorization": f"Bearer {token}"},
                        timeout=aiohttp.ClientTimeout(total=5),
                    ) as resp:
                        if resp.status == 200:
                            text = await resp.text()
            except Exception:
                pass

        # 4. Docker CLI
        if not text:
            try:
                proc = await asyncio.create_subprocess_exec(
                    "docker", "logs", "homeassistant", "--tail", "200",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=10)
                text = stdout.decode("utf-8", errors="replace") if stdout else ""
            except Exception:
                pass

        # 5. HA log file
        if not text:
            for log_path in ("/share/second-core/home-assistant.log", "/config/home-assistant.log"):
                try:
                    if _os.path.exists(log_path):
                        with open(log_path, "r", encoding="utf-8", errors="replace") as f:
                            all_lines = f.readlines()
                            text = "".join(all_lines[-200:])
                            if text and len(text.strip()) > 10:
                                break
                except Exception:
                    continue

        lines = text.split("\n") if text else []
        if domain:
            filtered = [l for l in lines if domain.lower() in l.lower() and
                        any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))]
            if not filtered:
                filtered = [l for l in lines if any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))]
        else:
            filtered = [l for l in lines if any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))]

        return "\n".join(filtered[-max_lines:])

    # ── Issue creation ─────────────────────────────────

    async def _build_issue_body(self, repo_info: dict | None, user_title: str, user_body: str,
                                  repo_domain: str | None) -> str:
        """Build a detailed GitHub issue body with system info and logs."""
        try:
            from homeassistant.const import __version__ as ha_version
        except ImportError:
            ha_version = getattr(self.hass, "version", "unknown") or "unknown"
        lines = []
        lines.append(f"## 描述\n{user_body}\n" if user_body else "## 描述\n_无详细描述_\n")
        lines.append("## 系统信息")
        lines.append(f"| 项目 | 值 |")
        lines.append(f"|------|-----|")
        lines.append(f"| HA 版本 | {ha_version} |")
        if repo_info:
            inst_ver = repo_info.get("installed_version", repo_info.get("version", "?"))
            if inst_ver and inst_ver != "?":
                lines.append(f"| 版本 | {inst_ver} |")
        if repo_domain:
            lines.append(f"| 领域 | {repo_domain} |")
        lines.append(f"| 时间 | {time.strftime('%Y-%m-%d %H:%M:%S')} |")
        lines.append("")

        logs = await self._github_fetch_logs(repo_domain, max_lines=60)
        if logs:
            lines.append("## 相关日志")
            lines.append("```")
            lines.append(logs[-3000:] if len(logs) > 3000 else logs)
            lines.append("```")
        else:
            lines.append("_无相关错误日志_")

        return "\n".join(lines)

    async def _github_issue_preview(self, query) -> web.Response:
        """Preview logs and system info before creating an issue."""
        repo = (query.get("repo") if hasattr(query, "get") else query or "").strip()
        repo_info = None
        repo_domain = None
        try:
            repo_info = await self.data.get_repository(repo) if repo else None
            if repo_info:
                repo_domain = repo_info.get("domain")
        except Exception:
            pass

        logs = await self._github_fetch_logs(repo_domain, max_lines=60)
        try:
            from homeassistant.const import __version__ as ha_version
        except ImportError:
            ha_version = getattr(self.hass, "version", "unknown") or "unknown"

        return web.json_response({
            "ha_version": ha_version,
            "vision_version": VERSION,
            "repo": repo,
            "repo_domain": repo_domain,
            "repo_version": repo_info.get("installed_version", repo_info.get("version")) if repo_info else None,
            "logs": logs[-2000:] if logs else "",
        })

    async def _save_screenshot(self, base64_data: str, filename: str) -> str | None:
        """Save a base64 screenshot to HA's www dir and return accessible URL."""
        try:
            import os as _os
            www_dir = self.hass.config.path("www", "hacs_vision_screenshots")
            _os.makedirs(www_dir, exist_ok=True)
            raw = base64_data
            if "," in raw:
                raw = raw.split(",", 1)[1]
            decoded = __import__("base64").b64decode(raw)
            filepath = _os.path.join(www_dir, filename)
            with open(filepath, "wb") as f:
                f.write(decoded)
            ha_url = None
            try:
                if hasattr(self.hass.config, "external_url") and self.hass.config.external_url:
                    ha_url = self.hass.config.external_url
                elif hasattr(self.hass.config, "internal_url") and self.hass.config.internal_url:
                    ha_url = self.hass.config.internal_url
                else:
                    ha_url = self.hass.http.get_url(prefer_external=True)
            except Exception:
                try:
                    ha_url = self.hass.http.get_url()
                except Exception:
                    pass
            if not ha_url:
                # No external/internal URL configured in HA — derive a best-effort
                # base URL from the local HA host/port instead of a hard-coded domain.
                host = getattr(self.hass.config, "host", None) or "localhost"
                http = getattr(self.hass, "http", None)
                port = getattr(http, "server_port", 8123) if http else 8123
                ha_url = f"http://{host}:{port}"
            _LOGGER.info("Screenshot URL base: %s", ha_url)
            return f"{ha_url.rstrip('/')}/local/hacs_vision_screenshots/{filename}"
        except Exception as e:
            _LOGGER.warning("Save screenshot error: %s", e)
        return None

    def _cleanup_screenshots(self, filenames: list[str]) -> None:
        """Remove temporary screenshot files."""
        import os as _os
        if not filenames:
            return
        www_dir = self.hass.config.path("www", "hacs_vision_screenshots")
        for fname in filenames:
            try:
                fp = _os.path.join(www_dir, fname)
                if _os.path.exists(fp):
                    _os.remove(fp)
            except Exception as e:
                _LOGGER.warning("Cleanup screenshot %s error: %s", fname, e)

    async def _delayed_cleanup(self, filenames: list[str], delay: int = 300) -> None:
        """Clean up screenshots after a delay to let GitHub cache them."""
        import asyncio as _asyncio
        await _asyncio.sleep(delay)
        self._cleanup_screenshots(filenames)

    async def _github_create_issue(self, body: dict) -> web.Response:
        """Create a GitHub issue with auto-collected error logs."""
        repo = body.get("repo", "").strip()
        title = body.get("title", "").strip()
        user_body = body.get("body", "").strip()
        repo_domain = body.get("domain")

        if not repo or "/" not in repo:
            return _bad_request("repo required (format: owner/repo)")
        if not title:
            return _bad_request("title required")

        repo_info = None
        if not repo_domain:
            try:
                repo_info = await self.data.get_repository(repo)
                if repo_info:
                    repo_domain = repo_info.get("domain")
            except Exception:
                pass

        issue_body = await self._build_issue_body(repo_info, title, user_body, repo_domain)

        screenshot_files = []
        screenshots = body.get("screenshots", [])
        if screenshots and isinstance(screenshots, list):
            import uuid as _uuid
            _LOGGER.info("Saving %d screenshots to HA www...", len(screenshots))
            for i, ss_b64 in enumerate(screenshots):
                if not ss_b64 or not isinstance(ss_b64, str) or len(ss_b64) < 100:
                    continue
                if len(ss_b64) > 3 * 1024 * 1024:
                    _LOGGER.warning("Screenshot %d too large, skipped", i)
                    continue
                fname = f"issue_{_uuid.uuid4().hex[:12]}_{i+1}.png"
                url = await self._save_screenshot(ss_b64, fname)
                if url:
                    issue_body += f"\n\n![截图{i+1}]({url})"
                    screenshot_files.append(fname)
                else:
                    _LOGGER.warning("Failed to save screenshot %d", i)

        result = await self._github_api("POST", f"/repos/{repo}/issues", {
            "title": title,
            "body": issue_body,
            "labels": body.get("labels", ["bug"]),
        })

        status = result.get("status", 500)
        if status in (200, 201):
            html_url = result.get("html_url", "")
            number = result.get("number", "")
            _LOGGER.info("Created issue #%s for %s: %s", number, repo, html_url)
            if screenshot_files:
                _LOGGER.info("Screenshots will be cleaned up in 5 minutes")
                asyncio.ensure_future(self._delayed_cleanup(screenshot_files, 300))
            return web.json_response({"ok": True, "issue_url": html_url, "issue_number": number})
        elif status == 401:
            if screenshot_files:
                self._cleanup_screenshots(screenshot_files)
            return _unauthorized("GitHub token not authorized")
        elif status == 403:
            if screenshot_files:
                self._cleanup_screenshots(screenshot_files)
            return _error("Rate limited or no permission", 403)
        elif status == 404:
            if screenshot_files:
                self._cleanup_screenshots(screenshot_files)
            return _not_found("Repository not found")
        else:
            if screenshot_files:
                self._cleanup_screenshots(screenshot_files)
            err_msg = result.get("error", result.get("message", f"GitHub API error ({status})"))
            return _error(err_msg, 502)