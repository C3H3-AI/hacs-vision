"""Tests for HACS Enhanced integration."""
import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from custom_components.hacs_vision.const import DOMAIN


@pytest.fixture
def hass():
    """Create a mock Home Assistant instance."""
    h = MagicMock()
    h.data = {DOMAIN: {}}
    h.config.path = lambda p: f"/config/{p}"
    h.http = MagicMock()
    h.services = MagicMock()
    return h


class TestHACSData:
    """Test HACSData path resolution and JSON parsing."""

    def test_get_path_resolves_relative(self, hass):
        """Storage paths should be resolved via hass.config.path()."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)
        path = data._get_path("repositories")
        assert path == "/config/.storage/hacs.repositories"

    def test_get_path_unknown_key_raises(self, hass):
        """Unknown storage key should raise ValueError."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)
        with pytest.raises(ValueError, match="Unknown storage key"):
            data._get_path("nonexistent")

    @pytest.mark.asyncio
    async def test_get_all_repositories_field_mapping(self, hass):
        """Storage fields should be mapped to API field names."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)

        mock_storage = {
            "data": {
                "12345": {
                    "full_name": "test/repo",
                    "category": "integration",
                    "version_installed": "1.0.0",
                    "last_version": "2.0.0",
                    "stargazers_count": 100,
                }
            }
        }

        with patch.object(data, 'read_storage', new_callable=AsyncMock, return_value=mock_storage):
            repos = await data.get_all_repositories()
            assert len(repos) == 1
            r = repos[0]
            assert r["id"] == "12345"
            assert r["installed_version"] == "1.0.0"
            assert r["latest_version"] == "2.0.0"

    @pytest.mark.asyncio
    async def test_get_all_repositories_empty(self, hass):
        """Empty storage should return empty list."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)
        with patch.object(data, 'read_storage', new_callable=AsyncMock, return_value=None):
            repos = await data.get_all_repositories()
            assert repos == []

    @pytest.mark.asyncio
    async def test_get_repository_by_id(self, hass):
        """Should find a repo by ID."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)
        mock_storage = {
            "data": {
                "99": {"full_name": "a/b", "category": "plugin"},
                "100": {"full_name": "c/d", "category": "theme"},
            }
        }
        with patch.object(data, 'read_storage', new_callable=AsyncMock, return_value=mock_storage):
            repo = await data.get_repository("99")
            assert repo is not None
            assert repo["full_name"] == "a/b"

    @pytest.mark.asyncio
    async def test_get_repository_by_full_name(self, hass):
        """Should find a repo by full_name."""
        from custom_components.hacs_vision.hacs_data import HACSData
        data = HACSData(hass)
        mock_storage = {
            "data": {
                "99": {"full_name": "a/b", "category": "plugin"},
            }
        }
        with patch.object(data, 'read_storage', new_callable=AsyncMock, return_value=mock_storage):
            repo = await data.get_repository("a/b")
            assert repo is not None
            assert repo["id"] == "99"


class TestHACSOperator:
    """Test HACSOperator index and lock behavior."""

    def test_invalidate_index(self, hass):
        """invalidate_index should clear cached indices."""
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        op = HACSOperator(hass)
        op._repo_index_by_id = {"1": MagicMock()}
        op._repo_index_by_name = {"a/b": MagicMock()}
        op.invalidate_index()
        assert op._repo_index_by_id is None
        assert op._repo_index_by_name is None

    def test_available_false_when_hacs_missing(self, hass):
        """available should be False when HACS is not loaded."""
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        hass.data = {}  # No 'hacs' key
        op = HACSOperator(hass)
        assert op.available is False

    def test_get_lock_returns_same_lock(self, hass):
        """Same repo ID should always get the same lock."""
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        import asyncio
        op = HACSOperator(hass)
        lock1 = op._get_lock("repo1")
        lock2 = op._get_lock("repo1")
        assert lock1 is lock2

    @pytest.mark.asyncio
    async def test_install_returns_error_when_hacs_unavailable(self, hass):
        """Install should return error when HACS is not available."""
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        hass.data = {}
        op = HACSOperator(hass)
        result = await op.install_repository("test/repo", "integration")
        assert result["success"] is False
        assert "not available" in result["error"]

    @pytest.mark.asyncio
    async def test_remove_returns_error_when_hacs_unavailable(self, hass):
        """Remove should return error when HACS is not available."""
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        hass.data = {}
        op = HACSOperator(hass)
        result = await op.remove_repository("test/repo")
        assert result["success"] is False

    def test_shared_data_instance(self, hass):
        """Operator should use shared HACSData when provided."""
        from custom_components.hacs_vision.hacs_data import HACSData
        from custom_components.hacs_vision.hacs_operator import HACSOperator
        shared = HACSData(hass)
        op = HACSOperator(hass, shared_data=shared)
        assert op._data is shared


class TestConfigFlow:
    """Test config flow singleton behavior."""

    def test_domain_constant(self):
        """DOMAIN should be 'hacs_vision'."""
        from custom_components.hacs_vision.const import DOMAIN
        assert DOMAIN == "hacs_vision"
