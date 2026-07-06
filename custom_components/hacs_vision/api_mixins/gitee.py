"""Mixin: Gitee repository operations (search, browse, install)."""
from __future__ import annotations

import json
import logging
import re

import aiohttp
from aiohttp import web

from ..response import _error, _ok, _not_found, _bad_request, _server_error

_LOGGER = logging.getLogger(__name__)

GITEE_API_BASE = "https://gitee.com/api/v5"


class GiteeMixin:
    """Gitee repository search, browse, and install operations."""

    # ── Token management ─────────────────────────────────

    async def _get_gitee_token(self) -> str | None:
        """Get Gitee access token from Vision's storage."""
        try:
            data = await self.data.read_storage("gitee_token")
            if data and isinstance(data, dict) and data.get("token"):
                return data["token"]
        except Exception:
            pass
        return None

    async def _set_gitee_token(self, token: str, user: str = "") -> None:
        """Save Gitee access token."""
        await self.data.write_storage("gitee_token", {"token": token, "user": user})

    async def _clear_gitee_token(self) -> None:
        """Clear Gitee token."""
        await self.data.write_storage("gitee_token", {})

    # ── Gitee API caller ─────────────────────────────────

    async def _gitee_api(self, path: str, params: dict | None = None) -> dict:
        """Call Gitee API with the active token."""
        token = await self._get_gitee_token()
        url = f"{GITEE_API_BASE}{path}"
        if params is None:
            params = {}
        if token:
            params["access_token"] = token
        try:
            session = await self._get_session()
            async with session.get(url, params=params,
                                   timeout=aiohttp.ClientTimeout(total=15)) as resp:
                if resp.status == 200:
                    return await resp.json()
                elif resp.status == 401:
                    return {"error": "not_authenticated"}
                elif resp.status == 404:
                    return {"error": "not_found"}
                else:
                    text = await resp.text()
                    return {"error": f"gitee_api_{resp.status}", "text": text[:200]}
        except aiohttp.ClientError as e:
            _LOGGER.error("Gitee API network error: %s", e)
            return {"error": "network_error"}
        except Exception as e:
            _LOGGER.error("Gitee API error: %s", e, exc_info=True)
            return {"error": "operation_failed"}

    # ── Token verification ───────────────────────────────

    async def _gitee_verify_token(self, body: dict) -> web.Response:
        """Verify and store a Gitee access token."""
        token = body.get("token", "").strip()
        if not token:
            await self._clear_gitee_token()
            return _ok(ok=True, logout=True)

        # Verify by calling Gitee user API
        result = await self._gitee_api("/user", {"access_token": token})
        if "error" in result:
            return _bad_request("invalid_token")

        login = result.get("login", "")
        await self._set_gitee_token(token, login)
        return _ok(ok=True, user=login, avatar=result.get("avatar_url", ""))

    async def _gitee_user(self) -> web.Response:
        """Get current Gitee user info."""
        token = await self._get_gitee_token()
        if not token:
            return _error("not_authenticated", 401)

        result = await self._gitee_api("/user")
        if "error" in result:
            return _error(result["error"], 401)

        return _ok(
            login=result.get("login", ""),
            avatar=result.get("avatar_url", ""),
            name=result.get("name", ""),
        )

    # ── Search repos ─────────────────────────────────────

    async def _gitee_search(self, query) -> web.Response:
        """Search Gitee repositories."""
        q = query.get("q", "").strip()
        if not q:
            return _bad_request("q required")

        page = int(query.get("page", 1))
        per_page = min(int(query.get("per_page", 20)), 50)
        sort = query.get("sort", "updated")  # stars | forks | updated
        category = query.get("category", "")  # integration | plugin | theme

        params = {
            "q": q,
            "page": page,
            "per_page": per_page,
            "sort": sort,
        }

        # Gitee search API
        result = await self._gitee_api("/search/repositories", params)
        if "error" in result:
            return _error(result["error"], 502)

        repos = []
        for item in (result if isinstance(result, list) else []):
            full_name = item.get("full_name", "")
            desc = item.get("description", "") or ""
            topics = item.get("topics", []) or []
            # Detect HACS category from topics
            detected_cat = self._detect_category_from_topics(topics, desc, item.get("language", ""))
            if category and detected_cat != category:
                continue
            repos.append({
                "id": item.get("id"),
                "full_name": full_name,
                "name": item.get("name", ""),
                "description": desc[:200],
                "stars": item.get("stargazers_count", 0),
                "forks": item.get("forks_count", 0),
                "language": item.get("language", ""),
                "topics": topics,
                "category": detected_cat,
                "html_url": item.get("html_url", ""),
                "updated_at": item.get("updated_at", ""),
                "source": "gitee",
            })

        return _ok(repos=repos, total=len(repos), page=page)

    # ── List user/org repos ──────────────────────────────

    async def _gitee_list_repos(self, query) -> web.Response:
        """List repos of a Gitee user or organization."""
        owner = query.get("owner", "").strip()
        if not owner:
            return _bad_request("owner_required")

        # Clean URL
        owner = owner.rstrip("/")
        for prefix in ["https://gitee.com/", "http://gitee.com/", "gitee.com/"]:
            if owner.startswith(prefix):
                owner = owner[len(prefix):]
        owner = owner.replace(".git", "").rstrip("/")
        if not owner or "/" in owner:
            return _bad_request("invalid_owner")

        page = int(query.get("page", 1))
        per_page = min(int(query.get("per_page", 20)), 50)

        # Try user repos first, then org repos
        result = await self._gitee_api(
            f"/users/{owner}/repos",
            {"page": page, "per_page": per_page, "sort": "updated"}
        )

        if "error" in result and result["error"] == "not_found":
            # Try as organization
            result = await self._gitee_api(
                f"/orgs/{owner}/repos",
                {"page": page, "per_page": per_page, "sort": "updated"}
            )

        if "error" in result:
            return _error(result["error"], 502)

        repos = []
        for item in (result if isinstance(result, list) else []):
            full_name = item.get("full_name", "")
            desc = item.get("description", "") or ""
            topics = item.get("topics", []) or []
            detected_cat = self._detect_category_from_topics(topics, desc, item.get("language", ""))
            repos.append({
                "id": item.get("id"),
                "full_name": full_name,
                "name": item.get("name", ""),
                "description": desc[:200],
                "stars": item.get("stargazers_count", 0),
                "forks": item.get("forks_count", 0),
                "language": item.get("language", ""),
                "topics": topics,
                "category": detected_cat,
                "html_url": item.get("html_url", ""),
                "updated_at": item.get("updated_at", ""),
                "source": "gitee",
            })

        return _ok(repos=repos, total=len(repos), page=page)

    # ── Get repo detail ──────────────────────────────────

    async def _gitee_repo(self, query) -> web.Response:
        """Get Gitee repo detail."""
        full_name = query.get("full_name", "").strip()
        if not full_name or "/" not in full_name:
            return _bad_request("full_name required (owner/repo)")

        result = await self._gitee_api(f"/repos/{full_name}")
        if "error" in result:
            return _error(result["error"], 404 if result["error"] == "not_found" else 502)

        desc = result.get("description", "") or ""
        topics = result.get("topics", []) or []
        detected_cat = self._detect_category_from_topics(topics, desc, result.get("language", ""))

        return _ok(
            id=result.get("id"),
            full_name=result.get("full_name", ""),
            name=result.get("name", ""),
            description=desc,
            stars=result.get("stargazers_count", 0),
            forks=result.get("forks_count", 0),
            language=result.get("language", ""),
            topics=topics,
            category=detected_cat,
            html_url=result.get("html_url", ""),
            default_branch=result.get("default_branch", "master"),
            updated_at=result.get("updated_at", ""),
            source="gitee",
        )

    # ── Get releases ─────────────────────────────────────

    async def _gitee_releases(self, query) -> web.Response:
        """Get Gitee repo releases."""
        full_name = query.get("full_name", "").strip()
        if not full_name or "/" not in full_name:
            return _bad_request("full_name required")

        page = int(query.get("page", 1))
        per_page = min(int(query.get("per_page", 20)), 50)

        result = await self._gitee_api(
            f"/repos/{full_name}/releases",
            {"page": page, "per_page": per_page}
        )

        if "error" in result:
            return _error(result["error"], 502)

        releases = []
        for item in (result if isinstance(result, list) else []):
            releases.append({
                "tag_name": item.get("tag_name", ""),
                "name": item.get("name", ""),
                "body": (item.get("body", "") or "")[:2000],
                "prerelease": item.get("prerelease", False),
                "published_at": item.get("published_at", ""),
                "zipball_url": item.get("zipball_url", ""),
                "tarball_url": item.get("tarball_url", ""),
            })

        return _ok(releases=releases, total=len(releases))

    # ── Add Gitee repo to HACS ──────────────────────────

    async def _gitee_add_repo(self, body: dict) -> web.Response:
        """Add a Gitee repo as a custom repository in HACS."""
        full_name = body.get("full_name", "").strip()
        category = body.get("category", "integration")

        if not full_name or "/" not in full_name:
            return _bad_request("full_name required (owner/repo)")

        # Verify repo exists on Gitee
        result = await self._gitee_api(f"/repos/{full_name}")
        if "error" in result:
            return _error(result["error"], 404)

        # Build GitHub-compatible URL for HACS
        # HACS expects GitHub URLs, but we can store the Gitee URL
        gitee_url = f"https://gitee.com/{full_name}"

        # Add to HACS custom repos
        config = await self.data.get_config()
        custom_repos = config.get("custom_repositories", [])
        already = any(r.get("repository") == gitee_url for r in custom_repos)
        if not already:
            custom_repos.append({"repository": gitee_url, "category": category})
            config["custom_repositories"] = custom_repos
            await self.data.update_config(config)

        # Try to register in HACS memory
        if self.operator and self.operator.available:
            try:
                await self.operator._hacs.async_register_repository(
                    repository_full_name=full_name,
                    category=category,
                    check=False,
                )
                await self.operator._hacs.data.async_write()
            except Exception as e:
                _LOGGER.warning("HACS register failed for Gitee repo %s: %s", full_name, e)

        self.operator.invalidate_index()
        return _ok(success=True, repository=full_name, source="gitee")

    # ── Category detection ───────────────────────────────

    def _detect_category_from_topics(self, topics: list, desc: str, lang: str) -> str:
        """Detect HACS category from Gitee repo metadata."""
        topics_lower = [t.lower() for t in topics]
        desc_lower = desc.lower()

        topic_map = {
            "hacs-integration": "integration",
            "home-assistant-integration": "integration",
            "hacs-plugin": "plugin",
            "lovelace-card": "plugin",
            "hacs-theme": "theme",
            "hacs-python-script": "python_script",
        }
        for key, cat in topic_map.items():
            if key in topics_lower:
                return cat

        if any(w in desc_lower for w in ["plugin", "lovelace", "card", "dashboard"]):
            return "plugin"
        if any(w in desc_lower for w in ["theme"]):
            return "theme"
        if any(w in desc_lower for w in ["integration", "component", "custom_component"]):
            return "integration"

        return "integration"  # Default
