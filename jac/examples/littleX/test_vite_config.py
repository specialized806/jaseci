#!/usr/bin/env python3
"""Test ViteClientBundleBuilder configuration."""

import os
import sys
from pathlib import Path

# Add jaclang to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

def test_vite_configuration():
    """Test that ViteClientBundleBuilder is properly configured."""
    
    try:
        from jaclang.runtimelib.server import JacAPIServer
        
        # Initialize server with littleX module
        server = JacAPIServer(
            module_name='littleX_single_nodeps',
            session_path='./littleX_single_nodeps.session',
            base_path='.'  # Current directory
        )
        
        print("✅ Server initialized successfully!")
        
        # Check bundle builder configuration
        builder = server.introspector._bundle_builder
        print(f"Bundle builder type: {type(builder).__name__}")
        print(f"Package.json path: {builder.vite_package_json}")
        print(f"Output directory: {builder.vite_output_dir}")
        print(f"Minify enabled: {builder.vite_minify}")
        
        # Check if files exist
        if builder.vite_package_json:
            print(f"Package.json exists: {builder.vite_package_json.exists()}")
        
        if builder.vite_output_dir:
            print(f"Output dir exists: {builder.vite_output_dir.exists()}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_vite_configuration()
    sys.exit(0 if success else 1)
