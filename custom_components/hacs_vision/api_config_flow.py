"""Config Flow handlers for HACS Enhanced API."""
from __future__ import annotations

import json
import logging

from aiohttp import web

_LOGGER = logging.getLogger(__name__)


class ConfigFlowMixin:
    """Config Flow proxy handlers — extracted from HACSEnhancedAPI.

    Each method proxies to HA's native REST API for config/options/subentry flows.
    Uses self.hass, self._ha_base_url, self._get_session, self._extract_token
    from the parent HACSEnhancedAPI class.
    """

    async def _config_flow_handlers(self, request: web.Request) -> web.Response:
        """Get available config flow handlers — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow_handlers"
            headers = {"Authorization": f"Bearer {token}"}
            async with session.get(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow handlers error: %s", e, exc_info=True)
            return web.json_response({"error": str(e)}, status=500)

    async def _config_flow_start(self, request: web.Request, body: dict) -> web.Response:
        """Start a config flow (initial or reconfigure) — proxy to HA native REST API."""
        handler = body.get("handler")
        if not handler:
            return web.json_response({"error": "handler required"}, status=400)
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            for key in ("source", "entry_id", "show_advanced_options"):
                if key in body:
                    payload[key] = body[key]
            if "show_advanced_options" not in payload:
                payload["show_advanced_options"] = False
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow start error for %s: %s", handler, e, exc_info=True)
            return web.json_response({"error": f"flow_start_error: {e}"}, status=500)

    async def _config_flow_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        """Submit a config flow step — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow step error %s: %s", flow_id, e, exc_info=True)
            return web.json_response({"error": f"flow_step_error: {e}"}, status=500)

    async def _config_flow_cancel(self, request: web.Request, flow_id: str) -> web.Response:
        """Cancel a config flow — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.delete(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Config flow cancel error %s: %s", flow_id, e, exc_info=True)
            return web.json_response({"error": f"flow_cancel_error: {e}"}, status=500)

    async def _config_flow_subentry_cancel(self, request: web.Request, flow_id: str) -> web.Response:
        """Cancel a subentry flow — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.delete(url, headers=headers) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow cancel error %s: %s", flow_id, e, exc_info=True)
            return web.json_response({"error": f"subentry_cancel_error: {e}"}, status=500)

    async def _config_flow_options_start(self, request: web.Request, body: dict) -> web.Response:
        """Start an options flow — proxy to HA native REST API."""
        handler = body.get("handler")
        if not handler:
            return web.json_response({"error": "handler (entry_id) required"}, status=400)
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/options/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Options flow start error %s: %s", handler, e, exc_info=True)
            return web.json_response({"error": f"options_start_error: {e}"}, status=500)

    async def _config_flow_options_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        """Submit an options flow step — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/options/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Options flow step error %s: %s", flow_id, e, exc_info=True)
            return web.json_response({"error": f"options_step_error: {e}"}, status=500)

    async def _config_flow_subentry_start(self, request: web.Request, body: dict) -> web.Response:
        """Start a subentry flow — proxy to HA native REST API."""
        handler = body.get("handler")
        if not handler or not isinstance(handler, list) or len(handler) != 2:
            return web.json_response({"error": "handler must be [entry_id, subentry_type]"}, status=400)
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {"handler": handler}
            if "source" in body:
                payload["source"] = body["source"]
            if "subentry_id" in body:
                payload["subentry_id"] = body["subentry_id"]
            async with session.post(url, headers=headers, json=payload) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow start error %s: %s", handler, e, exc_info=True)
            return web.json_response({"error": f"subentry_start_error: {e}"}, status=500)

    async def _get_subentries(self, request: web.Request, entry_id: str) -> web.Response:
        """List subentries of a config entry."""
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if not entry:
            return web.json_response({"error": "entry_not_found"}, status=404)
        result = [
            {
                "subentry_id": se.subentry_id,
                "subentry_type": se.subentry_type,
                "title": se.title,
                "unique_id": se.unique_id,
            }
            for se in entry.subentries.values()
        ]
        return web.json_response({"subentries": result})

    async def _config_flow_subentry_step(self, request: web.Request, flow_id: str, body: dict) -> web.Response:
        """Submit a subentry flow step — proxy to HA native REST API."""
        token = self._extract_token(request)
        if not token:
            return web.json_response({"error": "unauthorized"}, status=401)
        try:
            session = await self._get_session()
            url = f"{self._ha_base_url}/api/config/config_entries/subentries/flow/{flow_id}"
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            async with session.post(url, headers=headers, json=body) as resp:
                data = await resp.json()
                return web.Response(text=json.dumps(data), content_type="application/json", status=resp.status)
        except Exception as e:
            _LOGGER.error("Subentry flow step error %s: %s", flow_id, e, exc_info=True)
            return web.json_response({"error": f"subentry_step_error: {e}"}, status=500)
