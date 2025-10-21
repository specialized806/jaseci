# bundle_orchestrator.py

import subprocess
import shutil
from pathlib import Path
from typing import Sequence
from vite_config_generator import (
    generate_vite_config_js,
    generate_package_json,
    generate_main_entry_js,
)

class ClientBundleError(RuntimeError):
    """Raised on failure during the bundling process."""
    pass

def run_vite_bundling(
    runtime_js_path: Path, 
    app_logic_js_path: Path, 
    client_functions: Sequence[str]
) -> str:
    """
    Pre-processes and bundles the Jac files using Vite/Rollup.

    Args:
        runtime_js_path: Path to the generated runtime.js file.
        app_logic_js_path: Path to the transpiled application logic file.
        client_functions: List of top-level client functions to export (e.g., ['littlex_app']).

    Returns:
        The content of the final bundled client.js file.
    """
    
    # 1. Use the temp/ directory for the Vite project
    temp_dir = Path(__file__).parent / "temp"
    temp_dir.mkdir(exist_ok=True)
    print(f"📦 Using Vite project directory: {temp_dir}")

    # 2. Copy the generated Jac files into the temp directory
    shutil.copy(runtime_js_path, temp_dir / "jac_runtime.js")
    shutil.copy(app_logic_js_path, temp_dir / "app_logic.js")
    
    # 3. Generate the required Vite configuration files
    (temp_dir / "vite.config.js").write_text(generate_vite_config_js())
    (temp_dir / "package.json").write_text(generate_package_json())
    
    # 4. Generate the main entry wrapper file
    main_entry_content = generate_main_entry_js(
        app_module_name="app_logic",
        client_functions=list(client_functions)
    )
    (temp_dir / "main_entry.js").write_text(main_entry_content)

    print("⚙️ Installing Vite dependencies (using npm install)...")
    
    # 5. Execute npm install to get Vite
    try:
        subprocess.run(
            ["npm", "install"], 
            cwd=temp_dir, 
            check=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
    except subprocess.CalledProcessError as e:
        raise ClientBundleError(
            f"npm install failed:\n{e.stderr.decode()}"
        )
    
    print("⚡️ Starting Vite production build...")

    # 6. Execute the Vite build command
    try:
        # We use 'npx' here to ensure the locally installed Vite is used
        subprocess.run(
            ["npx", "vite", "build"], 
            cwd=temp_dir, 
            check=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
    except subprocess.CalledProcessError as e:
        raise ClientBundleError(
            f"Vite build failed:\n{e.stderr.decode()}"
        )

    # 7. Read and return the final bundled code
    final_bundle_path = temp_dir / "dist" / "client.js"
    if not final_bundle_path.exists():
        raise ClientBundleError("Vite output file 'dist/client.js' not found.")
        
    print(f"✅ Build successful! Final bundle size: {final_bundle_path.stat().st_size} bytes")
    return final_bundle_path.read_text()