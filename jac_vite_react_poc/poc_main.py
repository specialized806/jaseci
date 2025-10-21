# poc_main.py (Vite Default Mode Orchestrator)

import subprocess
import shutil
from pathlib import Path

# --- VITE CONFIGS ---

def generate_vite_config_js() -> str:
    """Configures Vite for Default SPA Mode."""
    return """
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: true,
        // 🚨 REMOVED: The 'lib' configuration is gone. 
        // Vite will now look for index.html as the entry.
        rollupOptions: {
            input: 'index.html', // Point Vite to the HTML shell
        }
    },
});
"""

def generate_package_json() -> str:
    """Minimal package.json with necessary dependencies."""
    return """
{
    "type": "module",
    "scripts": {
        "build": "vite build"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.2.1"
    }
}
"""

def generate_index_html() -> str:
    """
    Generates the standard HTML entry shell required by Vite Default Mode.
    The Jac server's job is now just to serve this file.
    """
    return """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Jac React App</title>
  </head>
  <body>
    <div id="__jac_root"></div> 
    
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
"""

# --- ORCHESTRATOR LOGIC ---

class ViteDefaultModeOrchestrator:
    def __init__(self, runtime_path: Path, app_path: Path):
        self.runtime_path = runtime_path
        self.app_path = app_path

    def build_bundle(self) -> Path | None:
        temp_dir = Path("temp")
        temp_dir.mkdir(exist_ok=True)
        print(f"📦 Using temp dir: {temp_dir.resolve()}")

        # 1. Copy and create source files in React structure
        shutil.copy(self.runtime_path, temp_dir / "jac_runtime_react.js")
        shutil.copy(self.app_path, temp_dir / "jac_app_react.jsx")
        
        # 2. Create the standard entry point and HTML shell
        (temp_dir / "main.jsx").write_text(Path("main.jsx").read_text())
        (temp_dir / "index.html").write_text(generate_index_html())
        
        # 3. Create config files
        (temp_dir / "vite.config.js").write_text(generate_vite_config_js())
        (temp_dir / "package.json").write_text(generate_package_json())

        print("⚙️ Installing npm dependencies...")
        subprocess.run(["npm", "install", "--silent"], cwd=temp_dir, check=True, capture_output=True)
        
        print("⚡️ Starting Vite production build (Default Mode)...")

        # 4. Execute the Vite build
        subprocess.run(["npx", "vite", "build"], cwd=temp_dir, check=True, capture_output=True)

        # 5. Find the final output directory (dist) and copy it out
        final_dist_path = Path("jac_react_dist")
        if final_dist_path.exists():
            shutil.rmtree(final_dist_path)
        shutil.copytree(temp_dir / "dist", final_dist_path)
        
        print(f"✅ Build successful. Assets copied to: {final_dist_path.resolve()}")
        return final_dist_path

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    # Setup the mock source files for the POC
    Path("jac_runtime_react.js").write_text(Path("jac_runtime_react.js").read_text() if Path("jac_runtime_react.js").exists() else '...')
    Path("jac_app_react.jsx").write_text(Path("jac_app_react.jsx").read_text() if Path("jac_app_react.jsx").exists() else '...')
    Path("main.jsx").write_text(Path("main.jsx").read_text() if Path("main.jsx").exists() else '...')
    
    orchestrator = ViteDefaultModeOrchestrator(
        runtime_path=Path("jac_runtime_react.js"),
        app_path=Path("jac_app_react.jsx")
    )
    
    final_dist = orchestrator.build_bundle()
    
    if final_dist:
        print("\n--- Final Output Directory Contents ---")
        # Show the generated files, including the hashed JS file
        for p in final_dist.glob("**/*"):
            if p.is_file():
                print(f"  - {p.relative_to(final_dist)}")
        print("\nThis architecture means the Python server only needs to serve the index.html and the /assets/ directory.")