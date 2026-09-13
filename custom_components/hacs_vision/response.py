"""HACS Vision 响应处理平台。"""
from __future__ import annotations

from aiohttp import web

def _error(code: str, status: int = 500, **extra) -> web.Response:
    """返回标准化错误响应。"""
    body = {"error": code}
    body.update(extra)
    return web.json_response(body, status=status)

def _ok(**data) -> web.Response:
    """返回成功响应，可携带可选数据字段。"""
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
