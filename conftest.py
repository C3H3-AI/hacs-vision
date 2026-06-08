"""Pytest configuration for HACS Vision tests."""
import sys
import os

# Add the custom_components path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "custom_components"))
