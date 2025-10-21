import argparse
import os
import subprocess
import signal
import sys
from pathlib import Path

# --- Configuration ---

APP_LOGIC_FILE = "app_logic.js"
RUNTIME_FILE = "runtime.js"
PACKAGE_JSON_FILE = "package.json"
JAC_CLIENT_MODULE_NAME = "littleX_single_nodeps"
# List all functions that need to be registered (same as production) 
client_functions = [
    "navigate_to", "render_app", "get_current_route", "handle_popstate", 
    "init_router", "TweetCard", "like_tweet_action", "FeedView", 
    "LoginForm", "handle_login", "SignupForm", "go_to_login", 
    "go_to_signup", "go_to_home", "go_to_profile", "handle_signup", 
    "logout_action", "App", "get_view_for_route", "HomeViewLoader", 
    "load_home_view", "build_nav_bar", "HomeView", "ProfileView", 
    "littlex_app"
]

DEV_ENTRY_FILE = "dev_entry.js"      # Development entry point
VITE_CONFIG_FILE = "vite.config.js"  # Temporary Vite config
DEFAULT_HOST = "localhost"
DEFAULT_PORT = 3000


def create_dev_entry(app_logic_path: Path, runtime_path: Path, output_path: Path):
    """
    Creates a development entry point that properly combines runtime and app logic
    with Jac runtime registration, similar to production but optimized for dev.
    """
    print("--- 1. Creating Development Entry Point ---")
    
    try:
        # Read files
        runtime_content = runtime_path.read_text(encoding="utf-8")
        app_logic_content = app_logic_path.read_text(encoding="utf-8")        


        # Create development-specific initialization
        dev_init_script = f"""
// --- JAC DEV INITIALIZATION SCRIPT ---
console.log("[Jac Dev] Initializing Jac runtime...");

// Register all client functions with Jac runtime
const clientFunctions = {client_functions};
const functionMap = {{
    "navigate_to": navigate_to,
    "render_app": render_app,
    "get_current_route": get_current_route,
    "handle_popstate": handle_popstate,
    "init_router": init_router,
    "TweetCard": TweetCard,
    "like_tweet_action": like_tweet_action,
    "FeedView": FeedView,
    "LoginForm": LoginForm,
    "handle_login": handle_login,
    "SignupForm": SignupForm,
    "go_to_login": go_to_login,
    "go_to_signup": go_to_signup,
    "go_to_home": go_to_home,
    "go_to_profile": go_to_profile,
    "handle_signup": handle_signup,
    "logout_action": logout_action,
    "App": App,
    "get_view_for_route": get_view_for_route,
    "HomeViewLoader": HomeViewLoader,
    "load_home_view": load_home_view,
    "build_nav_bar": build_nav_bar,
    "HomeView": HomeView,
    "ProfileView": ProfileView,
    "littlex_app": littlex_app
}};

// Expose functions globally for Jac runtime registration
for (const funcName of clientFunctions) {{
    globalThis[funcName] = functionMap[funcName];
}}

// Register with Jac runtime
__jacRegisterClientModule("{JAC_CLIENT_MODULE_NAME}", clientFunctions, {{}});
globalThis.start_app = littlex_app;

console.log("[Jac Dev] Jac runtime initialized successfully");
console.log("[Jac Dev] Registered functions:", clientFunctions.length);

// Auto-start if no hydration element found
if (!document.getElementById('__jac_init__')) {{
    console.log("[Jac Dev] No hydration element found, starting app directly...");
    globalThis.start_app();
}} else {{
    console.log("[Jac Dev] Hydration element found, waiting for hydration...");
}}

// --- END JAC DEV INITIALIZATION SCRIPT ---
"""

        # Combine files for development (same structure as production)
        dev_entry_content = [
            "// --- START: runtime.js (Jac Client Utils) ---",
            runtime_content,
            "\n// --- END: runtime.js ---\n",
            "// --- START: app_logic.js (Jac Application Logic) ---",
            app_logic_content,
            "\n// --- END: app_logic.js ---\n",
            dev_init_script,
        ]

        output_path.write_text("\n".join(dev_entry_content), encoding="utf-8")
        print(f"✅ Development entry point created: {output_path.name}")
        return True

    except FileNotFoundError as e:
        print(f"❌ Error: Required file not found: {e.filename}")
        return False
    except Exception as e:
        print(f"❌ An unexpected error during file combination occurred: {e}")
        return False

def setup_dev_html():
    """
    Copy the development HTML template to index.html for Vite to serve.
    """
    print("\n--- 2. Setting up Development HTML ---")
    
    dev_html_path = Path("index_dev.html")
    main_html_path = Path("index.html")
    
    if not dev_html_path.exists():
        print(f"❌ Development HTML template not found: {dev_html_path}")
        return False
    
    try:
        # Copy dev HTML to main HTML for Vite to serve
        dev_html_content = dev_html_path.read_text(encoding="utf-8")
        main_html_path.write_text(dev_html_content, encoding="utf-8")
        print(f"✅ Development HTML setup complete")
        return True
    except Exception as e:
        print(f"❌ Error setting up HTML: {e}")
        return False

def create_vite_config(entry_file: Path, config_file: Path):
    """
    Generates a Vite config optimized for development with HMR and proper module resolution.
    """
    print("\n--- 3. Generating Vite Development Configuration ---")
    
    entry_name = entry_file.as_posix()
    
    config_content = f"""
import {{ defineConfig }} from 'vite';
import {{ resolve }} from 'path';

export default defineConfig({{
  // Development-specific configuration
  root: '.',
  
  build: {{
    outDir: 'dist',
    rollupOptions: {{
      input: {{
        main: resolve(__dirname, '{entry_name}'),
      }},
    }},
    // Keep function names for easier debugging
    minify: false,
  }},
  
  // Development server configuration
  server: {{
    host: 'localhost',
    port: 3000,
    open: '/',
    // Enable HMR for better development experience
    hmr: {{
      overlay: true,
    }},
  }},
  
  // Module resolution
  resolve: {{
    alias: {{
      // No alias needed since we're combining files directly
    }},
  }},
  
  // Development optimizations
  optimizeDeps: {{
    // Force re-optimization on changes
    force: true,
  }},
  
  // Better error reporting
  logLevel: 'info',
}});
"""
    
    try:
        config_file.write_text(config_content, encoding="utf-8")
        print(f"✅ Development Vite config created: {config_file.name}")
        return True
    except Exception as e:
        print(f"❌ Error creating config file: {e}")
        return False

def run_vite_dev(config_file: Path, host: str, port: int):
    """
    Executes the Vite development server with proper error handling.
    """
    print("\n--- 4. Starting Vite Development Server ---")
    
    try:
        command = ["npx", "vite", "dev", 
                   "--config", config_file.as_posix(), 
                   "--host", host, 
                   "--port", str(port)]
        
        print(f"Executing: {' '.join(command)}")
        print(f"🚀 Development server starting at http://{host}:{port}/")
        print("📝 Hot Module Replacement (HMR) enabled")
        print("🔄 Auto-reload on file changes")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)

        # Execute the command
        subprocess.run(command, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Vite Dev Server failed with exit code {e.returncode}.")
        print("💡 Make sure 'npm install' has been run to install Vite.")
        return False
    except KeyboardInterrupt:
        print("\n👋 Development server stopped by user.")
        return True
    except Exception as e:
        print(f"\n❌ An unexpected error during server execution: {e}")
        return False

def clean_up_files(*files):
    """
    Removes temporary files created during development.
    """
    print("\n--- 5. Cleaning Up Development Files ---")
    for file_path in files:
        if file_path.exists():
            file_path.unlink()
            print(f"🧹 Removed {file_path.name}")

def main():
    parser = argparse.ArgumentParser(
        description="Jac Development Server - Improved version with proper Jac runtime integration",
    )
    parser.add_argument(
        "--host",
        type=str,
        default=DEFAULT_HOST,
        help=f"Host address for the development server (default: {DEFAULT_HOST})",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"Port for the development server (default: {DEFAULT_PORT})",
    )
    parser.add_argument(
        "--no-cleanup",
        action="store_true",
        help="Don't clean up temporary files on exit (useful for debugging)",
    )
    
    args = parser.parse_args()
    
    dev_entry_path = Path(DEV_ENTRY_FILE)
    vite_config_path = Path(VITE_CONFIG_FILE)
    app_logic_path = Path(APP_LOGIC_FILE)
    runtime_path = Path(RUNTIME_FILE)

    # Validate required files
    if not app_logic_path.exists():
        print(f"❌ Missing required file: {APP_LOGIC_FILE}")
        sys.exit(1)
    if not runtime_path.exists():
        print(f"❌ Missing required file: {RUNTIME_FILE}")
        sys.exit(1)

    print("🎯 Jac Development Server - Improved Version")
    print("=" * 50)

    try:
        # 1. Create development entry point
        if not create_dev_entry(app_logic_path, runtime_path, dev_entry_path):
            sys.exit(1)

        # 2. Setup development HTML
        if not setup_dev_html():
            sys.exit(1)

        # 3. Generate Vite config
        if not create_vite_config(dev_entry_path, vite_config_path):
            sys.exit(1)

        # 4. Run development server
        success = run_vite_dev(vite_config_path, args.host, args.port)
        
        if not success:
            sys.exit(1)

    finally:
        # 5. Clean up temporary files (unless --no-cleanup is specified)
        if not args.no_cleanup:
            # Restore original HTML file
            original_html_path = Path("index.html")
            if original_html_path.exists():
                # Check if we have a backup or need to restore from git
                try:
                    # Try to restore from git if available
                    subprocess.run(["git", "checkout", "--", "index.html"], 
                                 capture_output=True, check=False)
                    print("🔄 Restored original index.html")
                except:
                    print("⚠️  Could not restore original index.html")
            
            clean_up_files(dev_entry_path, vite_config_path)
        else:
            print("\n🔧 Temporary files preserved (--no-cleanup specified)")
            print(f"   Entry file: {dev_entry_path}")
            print(f"   Config file: {vite_config_path}")
            print(f"   HTML file: index.html (modified for dev)")

if __name__ == "__main__":
    main()
