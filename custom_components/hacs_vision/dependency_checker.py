"""Check Python dependencies for installed repositories."""
from __future__ import annotations
import importlib
import json
import logging
from .hacs_data import HACSData

_LOGGER = logging.getLogger(__name__)

class DependencyChecker:
    def __init__(self, hass, shared_data: HACSData | None = None) -> None:
        self.data = shared_data or HACSData(hass)
        self.hass = hass

    async def check_all(self) -> dict:
        """Check dependencies for all installed repositories."""
        installed = await self.data.get_installed_repositories()
        results = []
        for repo in installed:
            manifest = repo.get("manifest", {})
            if isinstance(manifest, str):
                try:
                    manifest = json.loads(manifest)
                except (json.JSONDecodeError, TypeError):
                    manifest = {}
            requirements = manifest.get("requirements", [])
            if not requirements:
                continue

            # Actually check if each requirement is importable
            missing = []
            for req in requirements:
                # Extract package name from requirement string (e.g., "aiohttp>=3.0" -> "aiohttp")
                pkg_name = req.split(">=")[0].split("==")[0].split("<=")[0].split("<")[0].split(">")[0].split("[")[0].strip()
                if pkg_name:
                    try:
                        importlib.import_module(pkg_name.replace("-", "_"))
                    except ImportError:
                        missing.append(req)

            results.append({
                "repository": repo.get("full_name", ""),
                "dependencies": requirements,
                "missing": missing,
                "has_issues": len(missing) > 0,
            })
        total_with_deps = len(results)
        repos_with_issues = sum(1 for r in results if r["has_issues"])
        all_ok = repos_with_issues == 0
        return {
            "dependencies": results,
            "all_ok": all_ok,
            "status": "ok" if all_ok else "missing",
            "total_checked": total_with_deps,
            "issues_count": repos_with_issues,
            "missing_deps": [r["missing"] for r in results if r["has_issues"]],
        }