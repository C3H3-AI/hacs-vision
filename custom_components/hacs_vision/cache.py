"""Generic TTL cache for HACS Vision."""

from __future__ import annotations

import time
from typing import Any


class TTLCache:
    """Thread-safe TTL cache with automatic eviction of oldest entry on overflow.

    Not safe for concurrent writes from multiple coroutines sharing the same
    cache instance without external locking — HACS Vision uses one event loop
    per Home Assistant instance, so coroutine-level interleaving is acceptable.
    """

    __slots__ = ("_ttl", "_max_size", "_data")

    def __init__(self, ttl_seconds: float, max_size: int = 200) -> None:
        self._ttl = ttl_seconds
        self._max_size = max_size
        self._data: dict[str, dict] = {}

    def get(self, key: str) -> Any | None:
        """Get cached value. Returns None if missing or expired."""
        entry = self._data.get(key)
        if entry is None:
            return None
        if time.monotonic() - entry["ts"] >= self._ttl:
            del self._data[key]
            return None
        return entry["value"]

    def put(self, key: str, value: Any) -> None:
        """Store value with current timestamp. Evicts oldest entry if at capacity."""
        if len(self._data) >= self._max_size:
            try:
                oldest = min(self._data, key=lambda k: self._data[k]["ts"])
                del self._data[oldest]
            except (ValueError, KeyError):
                self._data.clear()
        self._data[key] = {"value": value, "ts": time.monotonic()}

    def invalidate(self, key: str | None = None) -> None:
        """Invalidate one key or clear entire cache (if key is None)."""
        if key is None:
            self._data.clear()
        else:
            self._data.pop(key, None)

    @property
    def size(self) -> int:
        return len(self._data)


# ── Module-level cache instances ──
readme_cache = TTLCache(3600, 200)       # README HTML — 1 hour TTL
star_cache = TTLCache(1800, 500)        # Star counts — 30 minutes
download_cache = TTLCache(7200, 500)     # Download counts — 2 hours
