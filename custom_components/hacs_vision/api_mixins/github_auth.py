"""HACS Vision GitHub 认证平台。"""
from __future__ import annotations

import asyncio
import json
import logging

import aiohttp
from aiohttp import web

from ..response import _ok, _not_found, _bad_request, _unauthorized, _server_error, _timeout

_LOGGER = logging.getLogger(__name__)

class GitHubAuthMixin:
    """GitHub 认证操作——令牌管理与 OAuth 设备流。"""

    def _get_hacs_token(self) -> str | None:
        """从 HACS 配置项获取 GitHub 令牌——仅用于显式导入 HACS。"""
        try:
            for entry in self.hass.config_entries.async_entries("hacs"):
                token = entry.data.get("token")
                if token:
                    return token
        except Exception:
            pass
        return None

    async def _get_vision_github_token(self) -> str | None:
        """从 hacs-vision 自身存储获取 GitHub 令牌。"""
        try:
            data = await self.data.read_storage("github_token")
            if data and isinstance(data, dict) and data.get("token"):
                return data["token"]
        except Exception:
            pass
        return None

    async def _get_active_github_token(self) -> str | None:
        """获取当前生效的 GitHub 令牌。"""

        hacs_token = self._get_hacs_token()
        if hacs_token:
            return hacs_token
        return await self._get_vision_github_token()

    async def _get_github_headers(self) -> dict[str, str]:
        """用当前令牌构造 GitHub API 请求头。"""
        headers = {"Accept": "application/vnd.github.v3+json"}
        token = await self._get_active_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        return headers

    async def _github_api(self, method: str, path: str, body: dict | None = None) -> dict:
        """用当前令牌调用 GitHub API。"""
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
            return {"error": "operation_failed", "status": 0}

    async def _github_verify_token(self, body: dict) -> web.Response:
        """校验并保存 GitHub 个人访问令牌。"""
        token = body.get("token", "").strip()
        if not token:
            # 空令牌即登出：清除已存令牌
            await self.data.write_storage("github_token", {})
            return web.json_response({"ok": True, "logout": True})
        # 通过调用 GitHub 用户接口校验
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return _bad_request("invalid_token")
                user = await resp.json()
                login = user.get("login", "?")
                # 检查速率限制
                async with session.get("https://api.github.com/rate_limit", headers=headers,
                                       timeout=aiohttp.ClientTimeout(total=10)) as rl_resp:
                    rl = await rl_resp.json()
                    remaining = rl.get("rate", {}).get("remaining", 0)
        except Exception as e:
            return _server_error()
        # 将令牌存入 Vision 自身存储
        await self.data.write_storage("github_token", {"token": token, "user": login})
        return web.json_response({"ok": True, "user": login, "avatar_url": user.get("avatar_url"), "rate_limit_remaining": remaining})

    async def _github_user(self) -> web.Response:
        """用 Vision 存储的令牌获取当前 GitHub 用户信息。"""
        token = await self._get_active_github_token()
        if not token:
            return _unauthorized()
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return _unauthorized("token_invalid")
                user = await resp.json()
        except Exception as e:
            return _server_error()
        return web.json_response({"login": user.get("login"), "avatar_url": user.get("avatar_url")})

    async def _github_import_token(self) -> web.Response:
        """从 HACS 导入 GitHub 令牌并保存到 Vision 自身存储。"""
        token = self._get_hacs_token()
        if not token:
            return _not_found("hacs_no_token")
        # 保存前先校验令牌
        headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"}
        try:
            session = await self._get_session()
            async with session.get("https://api.github.com/user", headers=headers,
                                   timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status != 200:
                    return _bad_request("token_invalid")
                user = await resp.json()
                login = user.get("login", "?")
            await self.data.write_storage("github_token", {"token": token, "user": login})
            return _ok(user=login, avatar_url=user.get("avatar_url", ""))
        except Exception as e:
            return _server_error()

    async def _github_oauth_start(self, body: dict) -> web.Response:
        """发起 GitHub OAuth 设备流。

        用裸 aiohttp 会话而非 HA 共享会话：目标是 github.com 外部端点，
        且不需要 HA 的 SSRF 重定向中间件。
        """
        try:
            # HACS 可能未安装，延迟到调用点导入其 CLIENT_ID
            from custom_components.hacs.const import CLIENT_ID

            register_url = "https://github.com/login/device/code"
            payload = {"client_id": CLIENT_ID, "scope": "repo"}
            headers = {"Accept": "application/json"}

            connector = aiohttp.TCPConnector(force_close=True)
            async with aiohttp.ClientSession(connector=connector) as session:
                async with session.post(register_url, data=payload, headers=headers,
                                         timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    data = await resp.json()
                    _LOGGER.debug("GitHub device code registered (status=%d, keys=%s)", resp.status, sorted(data.keys()))
                    if "error" in data:
                        return _bad_request(data.get("error_description", data["error"]))
                    # 保存 device_code 供轮询使用
                    self._oauth_device_code = data.get("device_code", "")
                    return web.json_response({
                        "user_code": data["user_code"],
                        "device_code": data["device_code"],
                        "verification_uri": data["verification_uri"],
                        "interval": data.get("interval", 5),
                    })
        except asyncio.TimeoutError:
            _LOGGER.error("OAuth start timeout after 15s")
            return _timeout("github_connection_timeout")
        except Exception as e:
            _LOGGER.error("OAuth start error: %s", e, exc_info=True)
            return _server_error()

    async def _github_oauth_poll(self, body: dict) -> web.Response:
        """轮询 OAuth 设备流激活。"""
        device_code = body.get("device_code", "")
        if not device_code:
            return _bad_request("device_code_required")
        try:
            # HACS 可能未安装，延迟到调用点导入其 CLIENT_ID
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
                return _bad_request(data.get("error_description", err))

            token = data["access_token"]

            # 获取用户信息
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
                "user": login,
                "avatar_url": avatar,
            })
        except asyncio.TimeoutError:
            _LOGGER.error("OAuth poll timeout")
            return _timeout("github_connection_timeout")
        except Exception as e:
            err_str = str(e)
            if "pending" in err_str.lower() or "authorization_pending" in err_str.lower():
                return web.json_response({"status": "pending"})
            _LOGGER.error("OAuth poll error: %s", e, exc_info=True)
            return _server_error()