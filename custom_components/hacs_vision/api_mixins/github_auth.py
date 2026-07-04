"""Mixin: GitHub authentication (token verify, OAuth device flow, user info)."""
from __future__ import annotations

import asyncio
import json
import logging

import aiohttp
from aiohttp import web

_LOGGER = logging.getLogger(__name__)


class GitHubAuthMixin:
    """GitHub authentication operations — token management and OAuth device flow."""

    # ── Token helpers ───────────────────────────────────

    def _get_hacs_token(self) -> str | None:
        """Get GitHub token from HACS config entry — used only for explicit HACS import."""
        try:
            for entry in self.hass.config_entries.async_entries("hacs"):
                token = entry.data.get("token")
                if token:
                    return token
        except Exception:
            pass
        return None

    async def _get_vision_github_token(self) -> str | None:
        """Get GitHub token from hacs-vision own storage."""
        try:
            data = await self.data.read_storage("github_token")
            if data and isinstance(data, dict) and data.get("token"):
                return data["token"]
        except Exception:
            pass
        return None

    async def _get_active_github_token(self) -> str | None:
        """Get GitHub token from Vision's own storage only."""
        return await self._get_vision_github_token()

    # ── Generic GitHub API caller ───────────────────────

    async def _github_api(self, method: str, path: str, body: dict | None = None) -> dict:
        """Call GitHub API with the active token."""
        token = await self._get_active_github_token()
        headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        url = f"https://api.github.com{path}"
        try:
            session = await self._get_session()
            kwargs = {"headers": headers, "timeout": aiohttp.ClientTimeout(total=15)}
            if body is not None and method in ("POST", "PATCH", "PUT"):
                kwargs["json"] = body
            async with session.request(method, url, **kwargs) as resp:
                if resp.status in (204, 304):
                    return {"status": resp.status}
                if resp.status == 404:
                    return {"error": "not_found", "status": 404}
                text = await resp.text()
                try:
                    return {"status": resp.status, **json.loads(text)}
                except json.JSONDecodeError:
                    return {"status": resp.status, "text": text}
        except Exception as e:
            return {"error": "操作失败", "status": 0}

    # ── Token verification ─────────────────────────────

    async def _github_verify_token(self, body: dict) -> web.Response:
        """Verify and store a GitHub personal access token."""
        token = body.get("token", "").strip()
        if not token:
            # Empty token = logout: clear stored token
            await self.data.write_storage("github_token", {})
            return web.json_response({"ok": True, "logout": True})
        # Verify by calling GitHub user API
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return web.json_response({"error": "invalid_token", "status": resp.status}, status=400)
                user = await resp.json()
                login = user.get("login", "?")
                # Check rate limit
                async with session.get("https://api.github.com/rate_limit", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as rl_resp:
                    rl = await rl_resp.json()
                    remaining = rl.get("rate", {}).get("remaining", 0)
        except Exception as e:
            return web.json_response({"error": "操作失败"}, status=500)
        # Store token to Vision's own storage
        await self.data.write_storage("github_token", {"token": token, "user": login})
        return web.json_response({"ok": True, "user": login, "avatar_url": user.get("avatar_url"), "rate_limit_remaining": remaining})

    async def _github_user(self) -> web.Response:
        """Get current GitHub user info from Vision's stored token."""
        token = await self._get_active_github_token()
        if not token:
            return web.json_response({"error": "not_authenticated"}, status=401)
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return web.json_response({"error": "token_invalid"}, status=401)
                user = await resp.json()
        except Exception as e:
            return web.json_response({"error": "操作失败"}, status=500)
        return web.json_response({"login": user.get("login"), "avatar_url": user.get("avatar_url")})

    async def _github_import_token(self) -> web.Response:
        """Import GitHub token from HACS and save to Vision's own storage."""
        token = self._get_hacs_token()
        if not token:
            return web.json_response({"error": "hacs_no_token"}, status=404)
        # Verify the token before saving
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return web.json_response({"error": "token_invalid", "status": resp.status}, status=400)
                user = await resp.json()
                login = user.get("login", "?")
            await self.data.write_storage("github_token", {"token": token, "user": login})
            return web.json_response({"ok": True, "user": login, "avatar_url": user.get("avatar_url", "")})
        except Exception as e:
            return web.json_response({"error": "操作失败"}, status=500)

    # ── OAuth device flow ──────────────────────────────

    async def _github_oauth_start(self, body: dict) -> web.Response:
        """Start GitHub OAuth device flow using bare aiohttp to bypass SSRF."""
        try:
            from custom_components.hacs.const import CLIENT_ID

            register_url = "https://github.com/login/device/code"
            payload = {"client_id": CLIENT_ID, "scope": "repo"}
            headers = {"Accept": "application/json"}

            connector = aiohttp.TCPConnector(force_close=True)
            async with aiohttp.ClientSession(connector=connector) as session:
                async with session.post(register_url, data=payload, headers=headers,
                                         timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    data = await resp.json()
                    _LOGGER.debug("GitHub device code response: %s (status=%d)", data, resp.status)
                    if "error" in data:
                        return web.json_response({"error": data.get("error_description", data["error"])}, status=400)
                    # Store device_code for poll
                    self._oauth_device_code = data.get("device_code", "")
                    return web.json_response({
                        "user_code": data["user_code"],
                        "device_code": data["device_code"],
                        "verification_uri": data["verification_uri"],
                        "interval": data.get("interval", 5),
                    })
        except asyncio.TimeoutError:
            _LOGGER.error("OAuth start timeout after 15s")
            return web.json_response({"error": "连接 GitHub 超时，请稍后重试"}, status=504)
        except Exception as e:
            _LOGGER.error("OAuth start error: %s", e, exc_info=True)
            return web.json_response({"error": "操作失败"}, status=500)

    async def _github_oauth_poll(self, body: dict) -> web.Response:
        """Poll for OAuth device flow activation using bare aiohttp."""
        device_code = body.get("device_code", "")
        if not device_code:
            return web.json_response({"error": "device_code_required"}, status=400)
        try:
            from custom_components.hacs.const import CLIENT_ID

            poll_url = "https://github.com/login/oauth/access_token"
            payload = {
                "client_id": CLIENT_ID,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            }
            headers = {"Accept": "application/json"}

            connector = aiohttp.TCPConnector(force_close=True)
            async with aiohttp.ClientSession(connector=connector) as session:
                async with session.post(poll_url, data=payload, headers=headers,
                                         timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    data = await resp.json()

            err = data.get("error", "")
            if err == "authorization_pending":
                return web.json_response({"status": "pending"})
            if err == "slow_down":
                return web.json_response({"status": "pending", "slow_down": True})
            if err:
                return web.json_response({"error": data.get("error_description", err)}, status=400)

            token = data["access_token"]

            # Get user info
            gh_headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
            async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(force_close=True)) as session2:
                async with session2.get("https://api.github.com/user",
                                         headers=gh_headers,
                                         timeout=aiohttp.ClientTimeout(total=10)) as resp:
                    user_data = await resp.json()
                    login = user_data.get("login", "?")
                    avatar = user_data.get("avatar_url", "")

            await self.data.write_storage("github_token", {"token": token, "user": login})

            return web.json_response({
                "ok": True,
                "token": token,
                "user": login,
                "avatar_url": avatar,
            })
        except asyncio.TimeoutError:
            _LOGGER.error("OAuth poll timeout")
            return web.json_response({"error": "连接 GitHub 超时，请稍后重试"}, status=504)
        except Exception as e:
            err_str = str(e)
            if "pending" in err_str.lower() or "authorization_pending" in err_str.lower():
                return web.json_response({"status": "pending"})
            _LOGGER.error("OAuth poll error: %s", e, exc_info=True)
            return web.json_response({"error": "操作失败"}, status=500)