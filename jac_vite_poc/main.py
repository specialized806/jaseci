# main.py

import argparse
from pathlib import Path
from bundle_orchestrator import run_vite_bundling, ClientBundleError

def main():
    parser = argparse.ArgumentParser(
        description="Jac Client Bundler POC: Uses Vite as a pre-processor for compiled JS."
    )
    parser.add_argument(
        "--runtime_file", type=str, help="Path to the generated runtime.js file (e.g., runtime.js)"
    )
    parser.add_argument(
        "--app_logic_file", type=str, help="Path to the transpiled application logic file (e.g., app_logic.js)"
    )
    parser.add_argument(
        "--entry", type=str, default="littlex_app",
        help="The name of the main client function to run (e.g., littlex_app)"
    )
    parser.add_argument(
        "--output", type=str, default="jac_client_bundle.js",
        help="The name of the final output bundle file."
    )
    
    args = parser.parse_args()

    runtime_path = Path(args.runtime_file)
    print(f"Runtime path: {runtime_path}")
    app_path = Path(args.app_logic_file)
    print(f"App path: {app_path}")
    output_path = Path(args.output)
    print(f"Output path: {output_path}")
    
    if not runtime_path.is_file() or not app_path.is_file():
        print(f"Error: One or both input files not found. Check paths.")
        return 1

    # In a real scenario, client_functions would come from the Jac manifest.
    # For the POC, we take the main entry point from the CLI argument.
    client_functions = [args.entry]
    
    print("\n--- Starting Jac Client Bundler POC ---")
    print(f"Runtime: {runtime_path.name}")
    print(f"App Logic: {app_path.name}")
    print(f"Entry Function: {args.entry}")
    
    try:
        final_code = run_vite_bundling(runtime_path, app_path, client_functions)
        
        # Write the final bundled code
        output_path.write_text(final_code)
        
        print(f"\n✨ Successfully wrote final bundle to: {output_path.resolve()}")
        print("------------------------------------------")
        return 0
        
    except ClientBundleError as e:
        print(f"\n❌ Client Bundle Error: {e}")
        return 1
        
if __name__ == "__main__":
    exit(main())