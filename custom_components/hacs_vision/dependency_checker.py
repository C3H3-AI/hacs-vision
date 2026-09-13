"""HACS Vision 依赖检查平台。"""
from __future__ import annotations
import importlib
import json
import logging
from .hacs_data import HACSData

_LOGGER = logging.getLogger(__name__)

# pip 包名 → Python import 名映射（处理命名不一致的情况）
_PACKAGE_IMPORT_MAP = {
    "pillow": "PIL",
    "scikit-learn": "sklearn",
    "beautifulsoup4": "bs4",
    "python-slugify": "slugify",
    "pyyaml": "yaml",
    "python-dotenv": "dotenv",
    "Pillow": "PIL",
    "scikit_image": "skimage",
    "opencv-python": "cv2",
    "opencv-contrib-python": "cv2",
    "protobuf": "google.protobuf",
    "paho-mqtt": "paho.mqtt.client",
}

def _check_import(pkg_name: str) -> bool:
    """检查包是否可导入，处理名称不一致的情况。"""
    import_name = _PACKAGE_IMPORT_MAP.get(pkg_name, pkg_name.replace("-", "_"))
    try:
        importlib.import_module(import_name)
        return True
    except ImportError:
        pass
    # 尝试顶层模块（如 google.protobuf 这类带点的导入名）
    if "." in import_name:
        try:
            importlib.import_module(import_name.split(".")[0])
            return True
        except ImportError:
            pass
    return False

class DependencyChecker:
    def __init__(self, hass, shared_data: HACSData | None = None) -> None:
        self.data = shared_data or HACSData(hass)
        self.hass = hass

    async def check_all(self) -> dict:
        """检查所有已安装仓库的依赖。"""
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

            # 实际检查每个依赖是否可导入
            missing = []
            for req in requirements:

                pkg_name = req.split(">=")[0].split("==")[0].split("<=")[0].split("<")[0].split(">")[0].split("[")[0].split("!=")[0].split("~=")[0].strip()
                if pkg_name and not await self.hass.async_add_executor_job(
                    _check_import, pkg_name
                ):
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