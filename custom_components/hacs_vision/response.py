"""Standardized API response helpers for HACS Vision.

All endpoints should use these helpers instead of raw web.json_response()
to ensure consistent error/success format across the API layer.
"""
from __future__ import annotations

from aiohttp import web


def _error(code: str, status: int = 500, **extra) -> web.Response:
    """Return a standardized error response.

    Args:
        code: Machine-readable error code (e.g. "not_found", "operation_failed").
        status: HTTP status code.
        **extra: Additional fields merged into the response body.
    """
    body = {"error": code}
    body.update(extra)
    return web.json_response(body, status=status)


def _ok(**data) -> web.Response:
    """Return a success response with optional data fields."""
    return web.json_response(data)


def _not_found(msg: str = "not_found") -> web.Response:
    return _error(msg, 404)


def _bad_request(msg: str = "bad_request") -> web.Response:
    return _error(msg, 400)


def _unauthorized(msg: str = "not_authenticated") -> web.Response:
    return _error(msg, 401)


def _rate_limited(**extra) -> web.Response:
    return _error("rate_limited", 429, **extra)


def _server_error(msg: str = "operation_failed") -> web.Response:
    return _error(msg, 500)


def _upstream_error(msg: str = "upstream_error") -> web.Response:
    return _error(msg, 502)


def _timeout(msg: str = "connection_timeout") -> web.Response:
    return _error(msg, 504)
