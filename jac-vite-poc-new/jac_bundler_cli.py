import argparse
import os
import subprocess
from pathlib import Path

# --- Configuration ---
APP_LOGIC_FILE = "app_logic.js"
RUNTIME_FILE = "runtime.js"
PACKAGE_JSON_FILE = "package.json"
JAC_CLIENT_MODULE_NAME = "littleX_single_nodeps"


TEMP_ENTRY_FILE = "temp_main_entry.js" # Temporary file for Vite input
VITE_CONFIG_FILE = "vite.config.js"    # Temporary Vite config
FINAL_OUTPUT_DIR = Path("static/client/js")
FINAL_BUNDLE_NAME = "client" # The output file will be client.[hash].js


def create_temp_entry(app_logic_path: Path, runtime_path: Path, output_path: Path):
    """
    Reads the app_logic and runtime files, injects the necessary Jac runtime
    initialization, and combines them into a single temporary output file.
    """
    print("--- 1. Orchestrating File Combination ---")
    try:
        # Read files
        runtime_content = runtime_path.read_text(encoding="utf-8")
        app_logic_content = app_logic_path.read_text(encoding="utf-8")
        
        # NOTE: We must list all top-level functions from app_logic.js here
        # to ensure the Jac runtime (in runtime.js) can register them.
        client_functions = [
            "navigate_to", "render_app", "get_current_route", "handle_popstate", 
            "init_router", "TweetCard", "like_tweet_action", "FeedView", 
            "LoginForm", "handle_login", "SignupForm", "go_to_login", 
            "go_to_signup", "go_to_home", "go_to_profile", "handle_signup", 
            "logout_action", "App", "get_view_for_route", "HomeViewLoader", 
            "load_home_view", "build_nav_bar", "HomeView", "ProfileView", 
            "littlex_app"
        ]

        # Create the essential Jac runtime initialization logic
        jac_init_script = f"""
// --- JAC CLIENT INITIALIZATION SCRIPT ---
// Expose functions globally for Jac runtime registration
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
for (const funcName of clientFunctions) {{
    globalThis[funcName] = functionMap[funcName];
}}
__jacRegisterClientModule("{JAC_CLIENT_MODULE_NAME}", clientFunctions, {{}});
globalThis.start_app = littlex_app;
// Call the start function immediately if we're not hydrating from the server
if (!document.getElementById('__jac_init__')) {{
    globalThis.start_app();
}}
// --- END JAC CLIENT INITIALIZATION SCRIPT ---
"""

        # Construct the final bundled content (Order: Runtime, App Logic, Init)
        final_content = [
            "// --- START: runtime.js (Jac Client Utils) ---",
            runtime_content,
            "\n// --- END: runtime.js ---\n",
            "// --- START: app_logic.js (Jac Application Logic) ---",
            app_logic_content,
            "\n// --- END: app_logic.js ---\n",
            jac_init_script,
        ]

        output_path.write_text("\n".join(final_content), encoding="utf-8")
        print(f"✅ Intermediate entry point created: {output_path.name}")
        return True

    except FileNotFoundError as e:
        print(f"❌ Error: Required file not found: {e.filename}")
        return False
    except Exception as e:
        print(f"❌ An unexpected error during file combination occurred: {e}")
        return False

def create_vite_config(entry_file: Path, config_file: Path, final_output_dir: Path):
    """
    Generates a temporary vite.config.js file for the build.
    """
    print("\n--- 2. Generating Vite Configuration ---")
    
    # Use PosixPath for the config content to ensure correct path separators
    entry_name = entry_file.as_posix()
    output_dir_name = final_output_dir.as_posix()
    runtime_name = Path(RUNTIME_FILE).as_posix()
    
    config_content = f"""
import {{ defineConfig }} from 'vite';
import {{ resolve }} from 'path';

export default defineConfig({{
  build: {{
    outDir: '{output_dir_name}',
    emptyOutDir: true,
    rollupOptions: {{
      input: {{
        main: resolve(__dirname, '{entry_name}'),
      }},
      output: {{
        entryFileNames: '{FINAL_BUNDLE_NAME}.[hash].js',
        // Preserve function names for Jac runtime registration
        format: 'iife',
        name: 'JacClient',
      }},
    }},
    minify: false, // Disable minification to preserve function names
  }},
  // CRUCIAL: Resolves 'client_runtime' import used in app_logic.js 
  // to the local runtime file, satisfying Vite's module resolution.
  resolve: {{
    alias: {{
      'client_runtime': resolve(__dirname, '{runtime_name}'),
    }},
  }},
}});
"""
    config_file.write_text(config_content, encoding="utf-8")
    print(f"✅ Temporary Vite config created: {config_file.name}")

def run_vite_build(config_file: Path, package_json_path: Path):
    """
    Executes the Vite build command using npx.
    """
    print("\n--- 3. Running Vite Build ---")
    
    if not package_json_path.exists():
        print(f"❌ Error: {package_json_path.name} not found. Ensure 'npm install' has been run to install Vite.")
        return False
        
    try:
        # Use npx to run the locally installed vite command
        command = ["npx", "vite", "build", "--config", config_file.as_posix()]
        print(f"Executing command: {' '.join(command)}")
        
        # Execute the command and stream output
        process = subprocess.run(
            command, 
            check=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True
        )

        print(process.stdout)
        print("✅ Vite build completed successfully.")
        return True

    except subprocess.CalledProcessError as e:
        print(f"❌ Vite build failed with exit code {e.returncode}.")
        print("--- Vite Stderr ---")
        print(e.stderr)
        return False
    except FileNotFoundError:
        print("❌ Error: 'npx' or 'vite' command not found. Ensure Node.js and npm are installed and configured.")
        return False
    except Exception as e:
        print(f"❌ An unexpected error during Vite execution occurred: {e}")
        return False

def clean_up_files(*files):
    """
    Removes temporary files.
    """
    print("\n--- 4. Cleaning Up Temporary Files ---")
    for file_path in files:
        if file_path.exists():
            file_path.unlink()
            print(f"🧹 Removed {file_path.name}")
        else:
            print(f"File not found for cleanup: {file_path.name}")

def get_final_bundle_path(output_dir: Path):
    """
    Finds the hash-appended final bundle file.
    """
    for file in output_dir.glob(f"{FINAL_BUNDLE_NAME}.*.js"):
        return file
    return None

def main():
    parser = argparse.ArgumentParser(
        description="Complete Jac Bundler Pipeline CLI. Combines transpiled files and runs Vite.",
    )
    parser.add_argument(
        "--app-logic",
        type=Path,
        default=Path(APP_LOGIC_FILE),
        help=f"Path to the application logic file (default: {APP_LOGIC_FILE})",
    )
    parser.add_argument(
        "--runtime",
        type=Path,
        default=Path(RUNTIME_FILE),
        help=f"Path to the runtime utils file (default: {RUNTIME_FILE})",
    )
    parser.add_argument(
        "--package-json",
        type=Path,
        default=Path(PACKAGE_JSON_FILE),
        help=f"Path to package.json (needed for npx to find Vite) (default: {PACKAGE_JSON_FILE})",
    )
    
    args = parser.parse_args()
    
    temp_entry_path = Path(TEMP_ENTRY_FILE)
    vite_config_path = Path(VITE_CONFIG_FILE)

    try:
        # 1. Combine files
        if not create_temp_entry(args.app_logic, args.runtime, temp_entry_path):
            return

        # 2. Generate Vite config
        create_vite_config(temp_entry_path, vite_config_path, FINAL_OUTPUT_DIR)

        # 3. Run Vite build
        if not run_vite_build(vite_config_path, args.package_json):
            return
        
        # 4. Final verification and report
        final_bundle = get_final_bundle_path(FINAL_OUTPUT_DIR)
        
        print("\n=====================================")
        if final_bundle:
            print(f"🎉 SUCCESS! Final bundle created at:")
            print(f"   {final_bundle.as_posix()}")
            print("=====================================")
        else:
            print("🛑 WARNING: Vite finished, but could not find the final bundle file.")
            print(f"   Check directory: {FINAL_OUTPUT_DIR.as_posix()}")
            print("=====================================")

    finally:
        # Clean up temporary files regardless of success/failure
        clean_up_files(temp_entry_path, vite_config_path)

if __name__ == "__main__":
    main()