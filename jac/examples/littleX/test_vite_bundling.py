#!/usr/bin/env python3
"""Test the ViteClientBundleBuilder with actual Jac module."""

import os
import sys
from pathlib import Path

# Add jaclang to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

def test_vite_bundling():
    """Test ViteClientBundleBuilder with littleX module."""
    
    try:
        # Import Jac and server
        from jaclang.runtimelib.machine import JacMachine as Jac
        from jaclang.runtimelib.vite_client_bundle import ViteClientBundleBuilder
        
        # Reset Jac machine
        Jac.reset_machine()
        
        # Import the littleX module
        module_path = Path(__file__).parent / "littleX_single_nodeps.jac"
        print(f"Loading module: {module_path}")
        
        # Import the Jac module
        module = Jac.jac_import("littleX_single_nodeps", str(module_path.parent))[0]
        print(f"✅ Module loaded: {module.__name__}")
        
        # Create ViteClientBundleBuilder
        builder = ViteClientBundleBuilder(
            vite_package_json=Path("package.json"),
            vite_output_dir=Path("static/client/js"),
            vite_minify=False
        )
        print("✅ ViteClientBundleBuilder created")
        
        # Build the bundle
        print("Building bundle...")
        bundle = builder.build(module)
        print(f"✅ Bundle built successfully!")
        print(f"Bundle size: {len(bundle.code)} characters")
        print(f"Bundle hash: {bundle.hash}")
        print(f"Client functions: {len(bundle.client_functions)}")
        print(f"Client globals: {len(bundle.client_globals)}")
        
        # Check if output file was created
        output_files = list(Path("static/client/js").glob("client.*.js"))
        if output_files:
            print(f"✅ Output file created: {output_files[0]}")
            print(f"Output file size: {output_files[0].stat().st_size} bytes")
        else:
            print("⚠️  No output file found in static/client/js/")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_vite_bundling()
    sys.exit(0 if success else 1)
