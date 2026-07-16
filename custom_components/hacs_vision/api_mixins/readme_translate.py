"""Mixin: README translation powered by HA conversation agents.

Lets the user translate any repository's README inside the HACS Vision popup
by calling the HA ``conversation.process`` service with a user-selected agent
(e.g. MiMo / GPT / Ollama Assist pipelines). No hardcoded endpoints, no extra
API keys — the agent is chosen in the HACS Vision settings page.
"""
from __future__ import annotations

import logging
import time

import aiohttp

from ..response import _ok, _bad_request, _error, _upstream_error
from .hacs_ops import (
    _README_CACHE,
    _README_CACHE_TTL,
    _README_CACHE_MAX,
    _cache_put,
)


_LOGGER = logging.getLogger(__name__)

# Translation result cache keyed by (full_name, target_lang)
_README_TRANS_CACHE: dict[tuple[str, str], dict] = {}
_README_TRANS_CACHE_TTL = 21600  # 6h
_README_TRANS_CACHE_MAX = 100

# Supported target languages (key → human label for the prompt)
SUPPORTED_TRANSLATION_LANGS = {
    "zh": "Chinese (中文)",
    "en": "English",
    "de": "German (Deutsch)",
}

# The built-in command router is not an LLM translator — exclude from the picker.
_DEFAULT_CONVERSATION_ENTITY = "conversation.home_assistant"


def _trans_cache_put(key: tuple[str, str], value: dict) -> None:
    """Put into translation cache with size limit (evict oldest by timestamp)."""
    if len(_README_TRANS_CACHE) >= _README_TRANS_CACHE_MAX:
        try:
            oldest = min(_README_TRANS_CACHE, key=lambda k: _README_TRANS_CACHE[k].get("timestamp", 0))
            del _README_TRANS_CACHE[oldest]
        except (ValueError, KeyError):
            _README_TRANS_CACHE.clear()
    _README_TRANS_CACHE[key] = value


class ReadmeTranslateMixin:
    """Provides README translation via HA conversation agents."""

    # ── Fetch source README (reuses the shared upstream cache) ──

    async def _fetch_readme_html(self, full_name: str) -> tuple[str | None, str | None]:
        """Fetch rendered README HTML.

        Reuses the exact upstream logic from ``HACSOpsMixin._get_readme`` so the
        translated view shares the same GitHub cache as the original view.
        Returns ``(html, error_code)``; ``error_code`` is ``None`` on success.
        """
        cached = _README_CACHE.get(full_name)
        if cached and (time.monotonic() - cached["timestamp"] < _README_CACHE_TTL):
            return cached["html"], None

        session = await self._get_session()
        url = f"https://api.github.com/repos/{full_name}/readme"
        headers = {"Accept": "application/vnd.github.v3.html"}
        token = await self._get_vision_github_token()
        if token:
            headers["Authorization"] = f"token {token}"
        try:
            async with session.get(url, headers=headers) as resp:
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining is not None and int(remaining) <= 0:
                    reset_time = resp.headers.get("X-RateLimit-Reset", "0")
                    _LOGGER.warning("GitHub API rate limit exceeded, resets at %s", reset_time)
                    return None, "rate_limited"
                if resp.status == 200:
                    content = await resp.text()
                    _cache_put(_README_CACHE, full_name,
                               {"html": content, "timestamp": time.monotonic()}, _README_CACHE_MAX)
                    return content, None
                elif resp.status == 404:
                    return None, "not_found"
                elif resp.status == 403:
                    return None, "rate_limited"
                else:
                    return None, "upstream_error"
        except (aiohttp.ClientError, TimeoutError, OSError) as e:
            _LOGGER.error("README fetch network error: %s", e)
            return None, "network_error"
        except Exception as e:  # pragma: no cover - defensive
            _LOGGER.error("README fetch unexpected error: %s", e, exc_info=True)
            return None, "operation_failed"

    # ── Call HA conversation agent to translate ──

    async def _call_conversation_agent(
        self, agent_id: str, target_lang: str, source_html: str
    ) -> tuple[str | None, str | None]:
        """Translate ``source_html`` into ``target_lang`` via a HA conversation agent.

        Returns ``(translated_html, error_code)``.
        """
        lang_name = SUPPORTED_TRANSLATION_LANGS.get(target_lang, "English")
        prompt = (
            f"Translate the following GitHub README documentation from its original "
            f"language into {lang_name}. Preserve ALL Markdown and HTML structure, "
            f"code blocks, inline code, tables, links, and image references exactly. "
            f"Only translate human-readable prose. Do NOT add summaries, headings, "
            f"or commentary of your own. Return the complete translated document as "
            f"HTML.\n\n"
            f"{source_html}"
        )
        try:
            result = await self.hass.services.async_call(
                "conversation", "process",
                {"text": prompt, "agent_id": agent_id, "language": target_lang},
                blocking=True,
                return_response=True,
            )
        except Exception as e:
            _LOGGER.error("conversation.process failed for agent %s: %s", agent_id, e)
            return None, "agent_call_failed"

        translated = self._extract_agent_text(result)
        if not translated:
            return None, "agent_empty_response"
        return translated, None

    @staticmethod
    def _extract_agent_text(result) -> str | None:
        """Robustly extract the spoken text from a conversation.process response.

        HA returns the result either as a ``ConversationResult`` dict
        (``response.speech.plain.speech``) or already flattened
        (``speech.plain.speech``). Handle both shapes defensively.
        """
        if not result:
            return None

        speech = None
        # Shape 1: nested under "response"
        if isinstance(result, dict):
            resp = result.get("response")
            if isinstance(resp, dict):
                speech = resp.get("speech")
            # Shape 2: flattened
            if speech is None:
                speech = result.get("speech")
            # Shape 3: direct plain text field
            if speech is None and isinstance(result.get("text"), str):
                return result["text"]

        if not isinstance(speech, dict):
            return None
        plain = speech.get("plain")
        if not isinstance(plain, dict):
            return None
        text = plain.get("speech")
        return text if isinstance(text, str) else None

    # ── Public translate entry ──

    async def _translate_readme(
        self, full_name: str, target_lang: str, agent_id: str | None = None
    ) -> tuple[str | None, str | None]:
        """Translate a repository README into ``target_lang``.

        ``target_lang == "original"`` short-circuits to the cached/source HTML.
        Returns ``(html, error_code)``.
        """
        if target_lang == "original":
            return await self._fetch_readme_html(full_name)

        if target_lang not in SUPPORTED_TRANSLATION_LANGS:
            return None, "unsupported_lang"

        cache_key = (full_name, target_lang)
        cached = _README_TRANS_CACHE.get(cache_key)
        if cached and (time.monotonic() - cached["timestamp"] < _README_TRANS_CACHE_TTL):
            return cached["html"], None

        source_html, err = await self._fetch_readme_html(full_name)
        if err:
            return None, err

        # Resolve agent: explicit arg wins, else read from saved settings
        if not agent_id:
            settings = await self.data.get_settings()
            agent_id = settings.get("translation_agent")
        if not agent_id or agent_id == _DEFAULT_CONVERSATION_ENTITY:
            return None, "no_translation_agent"

        translated_html, err = await self._call_conversation_agent(agent_id, target_lang, source_html)
        if err:
            return None, err

        _trans_cache_put(cache_key, {"html": translated_html, "timestamp": time.monotonic()})
        return translated_html, None

    async def _translate_readme_endpoint(self, body: dict) -> object:
        """HTTP POST handler for ``readme/translate``."""
        full_name = (body or {}).get("full_name")
        target_lang = (body or {}).get("target_lang")
        if not full_name or not target_lang:
            return _bad_request("missing_params")

        html, err = await self._translate_readme(full_name, target_lang)
        if err:
            status = {
                "rate_limited": 429,
                "upstream_error": 502,
                "network_error": 502,
                "agent_call_failed": 502,
                "no_translation_agent": 400,
                "unsupported_lang": 400,
                "not_found": 404,
                "operation_failed": 500,
            }.get(err, 500)
            msg = "translation_failed" if err in (
                "agent_call_failed", "agent_empty_response"
            ) else err
            return _error(msg, status)

        return _ok(html=html)
