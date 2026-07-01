"""Unified GitHub API client for HACS Vision.



Consolidates all GitHub HTTP interactions into a single class with:

- One token management path (Vision's own storage only)

- One low-level _request() method for all API calls

- OAuth device flow with independent session (bypasses SSRF)

- TTL caching for stars, downloads, README

- 5-level log fetching fallback

- Full-english issue body generation

"""



from __future__ import annotations



import asyncio

import json

import logging

import os

import re

import time

from typing import Any



import aiohttp

from homeassistant.core import HomeAssistant

from homeassistant.helpers import aiohttp_client



from .cache import download_cache, readme_cache, star_cache

from .const import (

    GITHUB_API_BASE,

    GITHUB_COM_BASE,

    GITHUB_LOGIN_BASE,

    HA_LOCALHOST_FALLBACK,

    VERSION,

)

from .hacs_data import HACSData



_LOGGER = logging.getLogger(__name__)



# ── Category detection map ──

_TOPIC_CATEGORY_MAP: dict[str, str] = {

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



_DESC_PLUGIN_WORDS = {"plugin", "lovelace", "card", "dashboard"}

_DESC_THEME_WORDS = {"theme"}

_DESC_INTEGRATION_WORDS = {"integration", "component", "custom_component"}

_DESC_ADDON_WORDS = {"addon", "add-on"}

_DESC_HA_WORDS = {"home assistant", "home-assistant", "hacs"}





class GitHubClient:

    """Unified GitHub HTTP client for HACS Vision."""



    def __init__(self, hass: HomeAssistant, data: HACSData) -> None:

        self.hass = hass

        self.data = data



    # ── Session ──────────────────────────────────────────



    def _get_session(self) -> aiohttp.ClientSession:

        """Get HA's shared aiohttp session (reuses connection pool)."""

        return aiohttp_client.async_get_clientsession(self.hass)



    # ── Internal request — single HTTP entry point ──────



    async def _request(

        self,

        method: str,

        path: str,

        *,

        headers: dict[str, str] | None = None,

        body: dict | None = None,

        token: str | None = None,

        timeout: int = 15,

    ) -> dict:

        """Make a GitHub API request and return a normalized response dict.



        Returns: {"ok": True, "data": <parsed dict or list>, "status": <int>}

                 {"ok": False, "error": <str>, "status": <int>}

        """

        url = f"{GITHUB_API_BASE}{path}"

        req_headers: dict[str, str] = {

            "Accept": "application/vnd.github.v3+json",

        }

        t = token or (await self.get_token())

        if t:

            req_headers["Authorization"] = f"Bearer {t}"

        if headers:

            req_headers.update(headers)



        try:

            session = self._get_session()

            kwargs: dict = {"headers": req_headers, "timeout": aiohttp.ClientTimeout(total=timeout)}

            if body is not None and method in ("POST", "PATCH", "PUT"):

                kwargs["json"] = body

            async with session.request(method, url, **kwargs) as resp:

                if resp.status in (204, 304):

                    return {"ok": True, "data": {"status": resp.status}, "status": resp.status}

                if resp.status == 404:

                    return {"ok": False, "error": "not_found", "status": 404}

                text = await resp.text()

                try:

                    data = json.loads(text)

                    data["status"] = resp.status

                    return {"ok": 200 <= resp.status < 300, "data": data, "status": resp.status}

                except json.JSONDecodeError:

                    return {"ok": 200 <= resp.status < 300, "data": {"text": text, "status": resp.status}, "status": resp.status}

        except asyncio.TimeoutError:

            return {"ok": False, "error": "timeout", "status": 0}

        except aiohttp.ClientError as e:

            return {"ok": False, "error": str(e), "status": 0}

        except OSError as e:

            return {"ok": False, "error": str(e), "status": 0}



    async def _request_oauth(

        self, method: str, url: str, data: dict | None = None, headers: dict | None = None

    ) -> dict:

        """Make an OAuth device flow request using an independent session (bypass SSRF)."""

        req_headers = dict(headers or {})

        if "Accept" not in req_headers:

            req_headers["Accept"] = "application/json"

        connector = aiohttp.TCPConnector(force_close=True)

        try:

            async with aiohttp.ClientSession(connector=connector) as session:

                kwargs: dict = {"headers": req_headers, "timeout": aiohttp.ClientTimeout(total=15)}

                if data is not None:

                    kwargs["data"] = data

                async with session.request(method, url, **kwargs) as resp:

                    return {"ok": resp.status < 400, "data": await resp.json(), "status": resp.status}

        except asyncio.TimeoutError:

            return {"ok": False, "error": "timeout", "status": 0}

        except aiohttp.ClientError as e:

            return {"ok": False, "error": str(e), "status": 0}

        except OSError as e:

            return {"ok": False, "error": str(e), "status": 0}



    # ── Token management ────────────────────────────────



    async def get_token(self) -> str | None:

        """Get GitHub token from hacs-vision own storage."""

        try:

            data = await self.data.read_storage("github_token")

            if data and isinstance(data, dict) and data.get("token"):

                return data["token"]

        except Exception:

            pass

        return None



    async def verify_token(self, token: str) -> dict:

        """Verify a GitHub PAT by calling /user and /rate_limit.

        Returns: {"ok": True, "user": "<login>", "avatar_url": "...", "rate_limit_remaining": N}

                 {"ok": False, "error": "..."}

        """

        headers = {

            "Authorization": f"Bearer {token}",

            "Accept": "application/vnd.github.v3+json",

        }

        try:

            session = self._get_session()

            async with session.get(

                f"{GITHUB_API_BASE}/user", headers=headers, timeout=aiohttp.ClientTimeout(total=10)

            ) as resp:

                if resp.status != 200:

                    return {"ok": False, "error": "invalid_token", "status": resp.status}

                user = await resp.json()

                login = user.get("login", "?")

            async with session.get(

                f"{GITHUB_API_BASE}/rate_limit", headers=headers, timeout=aiohttp.ClientTimeout(total=10)

            ) as rl_resp:

                rl = await rl_resp.json()

                remaining = rl.get("rate", {}).get("remaining", 0)

        except Exception as e:

            return {"ok": False, "error": str(e)}

        # Save to Vision's own storage

        await self.data.write_storage("github_token", {"token": token, "user": login})

        return {

            "ok": True,

            "user": login,

            "avatar_url": user.get("avatar_url"),

            "rate_limit_remaining": remaining,

        }



    async def get_user(self) -> dict:

        """Get current GitHub user info from Vision's stored token.

        Returns: {"ok": True, "login": "...", "avatar_url": "..."}

                 {"ok": False, "error": "not_authenticated"}

        """

        token = await self.get_token()

        if not token:

            return {"ok": False, "error": "not_authenticated"}

        result = await self._request("GET", "/user", token=token)

        if result["ok"]:

            d = result["data"]

            return {"ok": True, "login": d.get("login"), "avatar_url": d.get("avatar_url")}

        return {"ok": False, "error": "token_invalid"}



    async def import_from_hacs(self) -> dict:

        """Import GitHub token from HACS config entry and save to Vision's own storage.

        Returns: {"ok": True, "user": "...", "avatar_url": "..."}

                 {"ok": False, "error": "..."}

        """

        # Try to find HACS token

        token = None

        try:

            for entry in self.hass.config_entries.async_entries("hacs"):

                t = entry.data.get("token")

                if t:

                    token = t

                    break

        except Exception:

            pass

        if not token:

            return {"ok": False, "error": "hacs_no_token"}

        # Verify before saving

        result = await self.verify_token(token)

        if not result.get("ok"):

            return {"ok": False, "error": "token_invalid"}

        return result



    # ── OAuth device flow ───────────────────────────────



    async def oauth_start(self) -> dict:

        """Start GitHub OAuth device code flow.

        Returns: {"ok": True, "user_code": "...", "device_code": "...", "verification_uri": "...", "interval": N}

                 {"ok": False, "error": "..."}

        """

        try:

            from custom_components.hacs.const import CLIENT_ID



            register_url = f"{GITHUB_LOGIN_BASE}/device/code"

            payload = {"client_id": CLIENT_ID, "scope": "repo"}

            result = await self._request_oauth("POST", register_url, data=payload)

            if not result["ok"]:

                err_data = result.get("data", {})

                err_msg = err_data.get("error_description", err_data.get("error", str(result)))

                return {"ok": False, "error": err_msg}

            data = result["data"]

            _LOGGER.debug("GitHub device code response: %s (status=%d)", data, result["status"])

            return {

                "ok": True,

                "user_code": data["user_code"],

                "device_code": data["device_code"],

                "verification_uri": data["verification_uri"],

                "interval": data.get("interval", 5),

            }

        except Exception as e:

            _LOGGER.error("OAuth start error: %s", e, exc_info=True)

            return {"ok": False, "error": str(e)}



    async def oauth_poll(self, device_code: str) -> dict:

        """Poll for OAuth device flow activation.

        Returns: {"ok": True, "token": "...", "user": "...", "avatar_url": "..."}

                 {"ok": False, "error": "..."}  (including "authorization_pending")

        """

        try:

            from custom_components.hacs.const import CLIENT_ID



            poll_url = f"{GITHUB_LOGIN_BASE}/oauth/access_token"

            payload = {

                "client_id": CLIENT_ID,

                "device_code": device_code,

                "grant_type": "urn:ietf:params:oauth:grant-type:device_code",

            }

            result = await self._request_oauth("POST", poll_url, data=payload)

            data = result.get("data", {})

            err = data.get("error", "")

            if err == "authorization_pending":

                return {"ok": False, "error": "pending", "status": "pending"}

            if err == "slow_down":

                return {"ok": False, "error": "pending", "status": "pending", "slow_down": True}

            if err:

                return {"ok": False, "error": data.get("error_description", err)}



            token = data["access_token"]

            # Get user info

            user_result = await self._request("GET", "/user", token=token)

            login = "?"

            avatar = ""

            if user_result["ok"]:

                ud = user_result["data"]

                login = ud.get("login", "?")

                avatar = ud.get("avatar_url", "")



            await self.data.write_storage("github_token", {"token": token, "user": login})

            return {"ok": True, "token": token, "user": login, "avatar_url": avatar}

        except Exception as e:

            _LOGGER.error("OAuth poll error: %s", e, exc_info=True)

            return {"ok": False, "error": str(e)}



    # ── Repo star/unstar ────────────────────────────────



    async def star_repo(self, repo: str) -> bool:

        """Star a repository. Returns True on success."""

        result = await self._request(

            "PUT", f"/user/starred/{repo}",

            headers={"Content-Length": "0"},

            timeout=10,

        )

        return result["ok"] and result["status"] == 204



    async def unstar_repo(self, repo: str) -> bool:

        """Unstar a repository. Returns True on success."""

        result = await self._request("DELETE", f"/user/starred/{repo}", timeout=10)

        return result["ok"] and result["status"] == 204



    async def check_starred(self, repo: str) -> bool:

        """Check if the authenticated user has starred a repo."""

        result = await self._request("GET", f"/user/starred/{repo}", timeout=10)

        return result["status"] == 204



    async def auto_star(self, repo: str = "C3H3-AI/hacs-vision") -> bool:

        """Auto-star a repo if not already starred."""

        if await self.check_starred(repo):

            return True

        return await self.star_repo(repo)



    async def list_starred(self) -> list[dict]:

        """Fetch all starred repos for the authenticated user (paginated)."""

        repos = []

        page = 1

        per_page = 100

        try:

            while True:

                result = await self._request(

                    "GET",

                    f"/user/starred?per_page={per_page}&page={page}",

                    timeout=15,

                )

                if not result["ok"]:

                    break

                data = result["data"]

                if not isinstance(data, list) or not data:

                    break

                for r in data:

                    full_name = r.get("full_name", "")

                    desc = r.get("description", "") or ""

                    repos.append({

                        "full_name": full_name,

                        "name": r.get("name", ""),

                        "description": desc,

                        "stars": r.get("stargazers_count", 0),

                        "topics": r.get("topics", []) or [],

                        "language": r.get("language") or "",

                        "category": self._detect_hacs_category(r),

                        "html_url": r.get("html_url", ""),

                        "updated_at": r.get("updated_at", ""),

                    })

                if len(data) < per_page:

                    break

                page += 1

        except Exception as e:

            _LOGGER.error("list_starred error: %s", e, exc_info=True)

        return repos



    async def list_org_repos(self, org: str) -> list[dict]:

        """List repos of a GitHub user or organization, detecting HACS categories."""

        # Strip URL prefix if user pasted full URL

        org = org.rstrip("/")

        for prefix in [f"{GITHUB_COM_BASE}/", "http://github.com/", "github.com/"]:

            if org.startswith(prefix):

                org = org[len(prefix):]

        org = org.replace(".git", "").rstrip("/")

        if not org or "/" in org:

            return []



        repos = []

        page = 1

        per_page = 100

        try:

            while True:

                # Try user route first

                result = await self._request(

                    "GET",

                    f"/users/{org}/repos?per_page={per_page}&page={page}&sort=updated&type=owner",

                    timeout=15,

            stars = None

                if result["status"] == 404:
            if stars is not None:
                sc.put(fn_lower, stars)

                    result = await self._request(

                        "GET",

                        f"/orgs/{org}/repos?per_page={per_page}&page={page}&sort=updated",

                        timeout=15,

                    )
            if fn in result_map:
                if not result["ok"]:

                    break

                data = result["data"]

                if not isinstance(data, list) or not data:

                    break

                for r in data:

                    repos.append({

                        "full_name": r.get("full_name", ""),

                        "name": r.get("name", ""),

                        "description": r.get("description") or "",

                        "stars": r.get("stargazers_count", 0),

                        "topics": r.get("topics") or [],

                        "language": r.get("language") or "",

                        "category": self._detect_hacs_category(r),

                        "html_url": r.get("html_url", ""),

                        "updated_at": r.get("updated_at", ""),

                    })

                if len(data) < per_page:

                    break

                page += 1

        except Exception as e:

            _LOGGER.error("list_org_repos error: %s", e, exc_info=True)

        return repos



    @staticmethod

    def _detect_hacs_category(repo: dict) -> str:

        """Detect HACS category from a GitHub repo's metadata."""

        topics = [t.lower() for t in (repo.get("topics") or [])]

        desc = (repo.get("description") or "").lower()

        lang = (repo.get("language") or "").lower()

        name = (repo.get("name") or "").lower()



        # Check topics for explicit HACS category hints

        for topic_key, cat in _TOPIC_CATEGORY_MAP.items():

            if topic_key in topics:

                return cat



        # Check description for hints

        if any(w in desc for w in _DESC_PLUGIN_WORDS):

            return "plugin"

        if any(w in desc for w in _DESC_THEME_WORDS):

            return "theme"

        if any(w in desc for w in _DESC_INTEGRATION_WORDS):

            return "integration"

        if any(w in desc for w in _DESC_ADDON_WORDS):

            return "addon"



        # Default to integration for home-assistant related repos

        if any(w in desc for w in _DESC_HA_WORDS) or "home-assistant" in topics:

            return "integration"



        return "integration"  # safest default



    # ── Create issue ────────────────────────────────────



    async def create_issue(

        self, repo: str, title: str, body: str, labels: list[str] | None = None

    ) -> dict:

        """Create a GitHub issue.

        Returns: {"ok": True, "issue_url": "...", "issue_number": N}

                 {"ok": False, "error": "...", "status": N}

        """

        payload: dict = {"title": title, "body": body}

        if labels:

            payload["labels"] = labels

        result = await self._request("POST", f"/repos/{repo}/issues", body=payload)

        if result["ok"] and result["status"] in (200, 201):

            d = result["data"]

            return {"ok": True, "issue_url": d.get("html_url", ""), "issue_number": d.get("number", "")}

        return result



    async def build_issue_body(

        self,

        repo_info: dict | None,

        user_title: str,

        user_body: str,

        repo_domain: str | None,

    ) -> str:

        """Build a detailed GitHub issue body with system info and logs (in English)."""

        try:

            from homeassistant.const import __version__ as ha_version

        except ImportError:

            ha_version = getattr(self.hass, "version", "unknown") or "unknown"



        lines: list[str] = []

        lines.append(f"## Description\n{user_body}\n" if user_body else "## Description\n_No description provided._\n")

        lines.append("## System Information")

        lines.append("| Field | Value |")

        lines.append("|-------|-------|")

        lines.append(f"| HA Version | {ha_version} |")

        if repo_info:

            inst_ver = repo_info.get("installed_version", repo_info.get("version", "?"))

            if inst_ver and inst_ver != "?":

                lines.append(f"| Version | {inst_ver} |")

        if repo_domain:

            lines.append(f"| Domain | {repo_domain} |")

        lines.append(f"| Timestamp | {time.strftime('%Y-%m-%d %H:%M:%S')} |")

        lines.append("")



        logs = await self.fetch_logs(repo_domain, max_lines=60)

        if logs:

            lines.append("## Related Logs")

            lines.append("```")

            lines.append(logs[-3000:] if len(logs) > 3000 else logs)

            lines.append("```")

        else:

            lines.append("_No relevant error logs._")



        return "\n".join(lines)



    async def fetch_logs(self, domain: str | None = None, max_lines: int = 50) -> str:

        """Fetch HA error logs using a 5-level fallback strategy.

        Priority: supervisor Docker logs -> system_log component -> error_log API -> file fallback.

        """

        text = ""



        # 1. Supervisor API: http://supervisor/core/logs

        if not text:

            try:

                token = os.environ.get("SUPERVISOR_TOKEN")

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

                                    _lines = raw.strip().split("\n")

                                    clean = []

                                    for ln in _lines:

                                        ln = ln.strip()

                                        if not ln:

                                            continue

                                        ln = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', ln)

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

                entries = []

                if log_data and hasattr(log_data, "get_log_entries"):

                    entries = log_data.get_log_entries()

                elif log_data and isinstance(log_data, dict):

                    entries = log_data.get("log_entries", [])

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

                session = self._get_session()

                ha_url = getattr(self.hass.http, "get_url", lambda: HA_LOCALHOST_FALLBACK)()

                token = os.environ.get("SUPERVISOR_TOKEN") or os.environ.get("HASSIO_TOKEN")

                if not token:

                    token = await self.get_token()

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



        # 5. Log file fallback

        if not text:

            for log_path in ("/share/second-core/home-assistant.log", "/config/home-assistant.log"):

                try:

                    if os.path.exists(log_path):

                        with open(log_path, "r", encoding="utf-8", errors="replace") as f:

                            all_lines = f.readlines()

                            text = "".join(all_lines[-200:])

                            if text and len(text.strip()) > 10:

                                break

                except Exception:

                    continue



        # Parse and filter

        _lines = text.split("\n") if text else []

        if domain:

            filtered = [

                l for l in _lines

                if domain.lower() in l.lower()

                and any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))

            ]

            if not filtered:

                filtered = [

                    l for l in _lines

                    if any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))

                ]

        else:

            filtered = [

                l for l in _lines

                if any(kw in l for kw in ("ERROR", "WARNING", "Traceback", "Error", "Warning"))

            ]



        return "\n".join(filtered[-max_lines:])



    # ── Data methods ────────────────────────────────────



    async def get_repo_info(self, full_name: str) -> dict | None:

        """Get repository info from GitHub API (with star cache)."""

        # Check cache first

        cached = star_cache.get(full_name.lower())

        if cached is not None:

            return {"full_name": full_name, "stargazers_count": cached}

        result = await self._request("GET", f"/repos/{full_name}", timeout=10)

        if result["ok"]:

            d = result["data"]

            stars = d.get("stargazers_count", 0)

            star_cache.put(full_name.lower(), stars)

            return {"full_name": full_name, "stargazers_count": stars, **d}

        return None



    async def get_latest_release_downloads(self, full_name: str) -> int:

        """Get total download count of latest release (with cache)."""

        cached = download_cache.get(full_name.lower())

        if cached is not None:

            return cached

        result = await self._request("GET", f"/repos/{full_name}/releases/latest", timeout=10)

        total = 0

        if result["ok"]:

            data = result["data"]

            total = sum(

                asset.get("download_count", 0) for asset in data.get("assets", [])

            )

        download_cache.put(full_name.lower(), total)

        return total



    async def get_readme_html(self, full_name: str) -> str | None:

        """Get README HTML from GitHub, with server-side cache."""

        cached = readme_cache.get(full_name.lower())

        if cached is not None:

            return cached

        result = await self._request(

            "GET", f"/repos/{full_name}/readme",

            headers={"Accept": "application/vnd.github.v3.html"},

            timeout=10,

        )

        if result["ok"]:

            html = result["data"] if isinstance(result["data"], str) else result["data"].get("text", "")

            if html:

                readme_cache.put(full_name.lower(), html)

                return html

        return None



    async def get_releases(self, full_name: str, tag: str | None = None) -> list[dict]:

        """Get releases for a repository. If tag specified, returns single release."""

        path = f"/repos/{full_name}/releases/tags/{tag}" if tag else f"/repos/{full_name}/releases?per_page=20"

        result = await self._request("GET", path, timeout=15)

        if result["ok"]:

            data = result["data"]

            if tag:

                # Single release

                return [{

                    "tag": data.get("tag_name", ""),

                    "name": data.get("name", ""),

                    "body": (data.get("body", "") or "")[:10000],

                    "url": data.get("html_url", f"{GITHUB_COM_BASE}/{full_name}/releases"),

                    "prerelease": data.get("prerelease", False),

                }] if data else []

            # List of releases

            if isinstance(data, list):

                return [

                    {

                        "tag": r.get("tag_name", ""),

                        "name": r.get("name", ""),

                        "body": (r.get("body", "") or "")[:10000],

                        "url": r.get("html_url", f"{GITHUB_COM_BASE}/{full_name}/releases"),

                        "prerelease": r.get("prerelease", False),

                    }

                    for r in data

                ]

        return []



    async def get_changelog(self, full_name: str, tag: str = "") -> dict:

        """Get changelog data for display. Mirrors original _get_changelog behavior."""

        if tag:

            result = await self._request("GET", f"/repos/{full_name}/releases/tags/{tag}", timeout=10)

        else:

            result = await self._request("GET", f"/repos/{full_name}/releases/latest", timeout=10)



        if result["ok"] and result["status"] == 200:

            d = result["data"]

            body = d.get("body", "") or ""

            return {

                "tag": d.get("tag_name", ""),

                "name": d.get("name", ""),

                "body": body[:10000],

                "url": d.get("html_url", f"{GITHUB_COM_BASE}/{full_name}/releases"),

            }

        if result["status"] == 404:

            return {"tag": tag or "", "body": "", "not_found": True}

        # Rate limit check

        if isinstance(result.get("data"), dict):

            remaining = result["data"].get("status", 0)

            if remaining == 429:

                return {"error": "rate_limited"}

        return {"error": f"github_api_{result['status']}"}



    # ── Cache enrichment ────────────────────────────────



    async def enrich_star_counts(self, repos: list[dict]) -> None:

        """Batch refresh stargazers_count from GitHub API with 6h TTL cache."""

        token = await self.get_token()

        if not token:

            return

        session = self._get_session()

        now = time.monotonic()

        from .cache import star_cache as sc



        need_fetch: list[str] = []

        for r in repos:

            fn = r.get("full_name", "")

            if not fn or "/" not in fn:

                continue

            cached = sc.get(fn.lower())

            if cached is not None:

                r["stargazers_count"] = cached

                continue

            need_fetch.append(fn)



        if not need_fetch:

            return



        sem = asyncio.Semaphore(3)



        async def _fetch_one(full_name: str) -> tuple[str, int]:

            fn_lower = full_name.lower()

            result = await self._request(

                "GET", f"/repos/{full_name}",

                headers={

                    "Authorization": f"token {token}",

                    "Accept": "application/vnd.github.v3+json",

                },

                timeout=10,

            )

            stars = 0

            if result["ok"]:

                stars = result["data"].get("stargazers_count", 0)

            sc.put(fn_lower, stars)

            return full_name, stars



        tasks = [_fetch_one(fn) for fn in need_fetch]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        result_map = {

            res[0]: res[1] for res in results if isinstance(res, tuple)

        }



        applied = 0

        for r in repos:

            fn = r.get("full_name", "")

            if fn in result_map:

                r["stargazers_count"] = result_map[fn]

                applied += 1



        if applied:

            _LOGGER.debug("Enriched star counts for %d repos", applied)



    async def enrich_download_counts(self, repos: list[dict]) -> None:

        """Enrich repos with GitHub release download counts where HACS data is 0."""

        from .cache import download_cache as dc



        need_fetch: list[str] = []

        for r in repos:

            if r.get("downloads", 0) > 0:

                continue

            fn = r.get("full_name", "")

            if not fn or "/" not in fn:

                continue

            cached = dc.get(fn.lower())

            if cached is not None:

                r["downloads"] = cached

                continue

            need_fetch.append(fn)



        if not need_fetch:

            return



        sem = asyncio.Semaphore(5)



        async def _fetch_one(full_name: str) -> tuple[str, int]:

            fn_lower = full_name.lower()

            result = await self._request(

                "GET", f"/repos/{full_name}/releases/latest", timeout=10,

            )

            total = 0

            if result["ok"]:

                data = result["data"]

                total = sum(

                    asset.get("download_count", 0) for asset in data.get("assets", [])

                )

            dc.put(fn_lower, total)

            return full_name, total



        tasks = [_fetch_one(fn) for fn in need_fetch]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        result_map = {

            res[0]: res[1] for res in results if isinstance(res, tuple)

        }



        for r in repos:

            fn = r.get("full_name", "")

            if fn in result_map and result_map[fn]:

                r["downloads"] = result_map[fn]

