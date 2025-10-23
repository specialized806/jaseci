#!/usr/bin/env python3
"""Test script to verify ViteClientBundleBuilder setup."""

import sys
from pathlib import Path

# Add the jaclang path to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from jaclang.runtimelib.vite_client_bundle import ViteClientBundleBuilder

def test_vite_setup():
    """Test that ViteClientBundleBuilder can be initialized properly."""
    
    # Paths for littleX example
    package_json_path = Path("/home/musab/Desktop/projects/jaseci/jaseci/jac/examples/littleX/package.json")
    vite_output_dir = Path("/home/musab/Desktop/projects/jaseci/jaseci/jac/examples/littleX/static/client/js")
    
    print("Testing ViteClientBundleBuilder setup...")
    print(f"Package.json path: {package_json_path}")
    print(f"Package.json exists: {package_json_path.exists()}")
    print(f"Output directory: {vite_output_dir}")
    print(f"Output directory exists: {vite_output_dir.exists()}")
    
    try:
        builder = ViteClientBundleBuilder(
            vite_package_json=package_json_path,
            vite_output_dir=vite_output_dir,
            vite_minify=False
        )
        print("✅ ViteClientBundleBuilder initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Error initializing ViteClientBundleBuilder: {e}")
        return False

if __name__ == "__main__":
    success = test_vite_setup()
    sys.exit(0 if success else 1)
