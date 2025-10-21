#!/usr/bin/env python3
"""
Jac Unified Development & Build Tool

This script provides a unified interface for both development and production workflows:
- `dev`: Start development server with HMR
- `build`: Create production bundle
- `serve`: Serve production bundle locally
- `watch`: Watch mode for development

Usage:
    python jac_unified.py dev          # Start development server
    python jac_unified.py build        # Build production bundle
    python jac_unified.py serve        # Serve production bundle
    python jac_unified.py watch        # Watch mode (rebuild on changes)
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Import the existing bundler and dev server modules
sys.path.append(str(Path(__file__).parent / "jac-vite-poc-new"))
sys.path.append(str(Path(__file__).parent / "jac-vite-poc-dev"))

class JacFileWatcher(FileSystemEventHandler):
    """File watcher for automatic rebuilds in watch mode."""
    
    def __init__(self, build_callback):
        self.build_callback = build_callback
        self.last_build = 0
        
    def on_modified(self, event):
        if event.is_directory:
            return
            
        # Only watch JavaScript files
        if not event.src_path.endswith(('.js', '.jac')):
            return
            
        # Debounce rapid file changes
        current_time = time.time()
        if current_time - self.last_build < 1.0:
            return
            
        self.last_build = current_time
        print(f"\n🔄 File changed: {Path(event.src_path).name}")
        print("📦 Rebuilding...")
        
        try:
            self.build_callback()
            print("✅ Build completed successfully")
        except Exception as e:
            print(f"❌ Build failed: {e}")

def run_development_server():
    """Start the development server with HMR."""
    print("🚀 Starting Jac Development Server...")
    
    dev_server_path = Path(__file__).parent / "jac-vite-poc-dev" / "jac_dev_server_improved.py"
    
    if not dev_server_path.exists():
        print(f"❌ Development server not found: {dev_server_path}")
        return False
        
    try:
        subprocess.run([sys.executable, str(dev_server_path)], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Development server failed: {e}")
        return False

def run_production_build():
    """Build the production bundle."""
    print("📦 Building Jac Production Bundle...")
    
    bundler_path = Path(__file__).parent / "jac-vite-poc-new" / "jac_bundler_cli.py"
    
    if not bundler_path.exists():
        print(f"❌ Bundler not found: {bundler_path}")
        return False
        
    try:
        subprocess.run([sys.executable, str(bundler_path)], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Production build failed: {e}")
        return False

def serve_production_bundle():
    """Serve the production bundle locally."""
    print("🌐 Serving Production Bundle...")
    
    # Find the latest bundle
    bundle_dir = Path(__file__).parent / "jac-vite-poc-new" / "static" / "client" / "js"
    
    if not bundle_dir.exists():
        print("❌ No production bundle found. Run 'build' first.")
        return False
        
    bundles = list(bundle_dir.glob("client.*.js"))
    if not bundles:
        print("❌ No bundle files found. Run 'build' first.")
        return False
        
    latest_bundle = max(bundles, key=lambda p: p.stat().st_mtime)
    print(f"📄 Serving bundle: {latest_bundle.name}")
    
    # Update HTML to reference latest bundle
    html_path = Path(__file__).parent / "jac-vite-poc-new" / "index.html"
    if html_path.exists():
        html_content = html_path.read_text()
        # Update script src to latest bundle
        import re
        pattern = r'src="/static/client/js/client\.[^"]+\.js"'
        replacement = f'src="/static/client/js/{latest_bundle.name}"'
        updated_html = re.sub(pattern, replacement, html_content)
        html_path.write_text(updated_html)
        print(f"✅ Updated HTML to reference {latest_bundle.name}")
    
    # Start simple HTTP server
    try:
        import http.server
        import socketserver
        import webbrowser
        
        PORT = 8080
        os.chdir(Path(__file__).parent / "jac-vite-poc-new")
        
        Handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🌐 Server running at http://localhost:{PORT}/")
            print("Press Ctrl+C to stop")
            webbrowser.open(f"http://localhost:{PORT}/")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
        return True
    except Exception as e:
        print(f"❌ Server failed: {e}")
        return False

def watch_mode():
    """Watch mode - rebuild on file changes."""
    print("👀 Starting Watch Mode...")
    print("📁 Watching for changes in app_logic.js and runtime.js")
    print("Press Ctrl+C to stop")
    
    # Initial build
    print("📦 Initial build...")
    if not run_production_build():
        return False
    
    # Set up file watcher
    watch_dir = Path(__file__).parent / "jac-vite-poc-new"
    event_handler = JacFileWatcher(run_production_build)
    observer = Observer()
    observer.schedule(event_handler, str(watch_dir), recursive=False)
    
    try:
        observer.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Watch mode stopped")
        observer.stop()
    finally:
        observer.join()
    
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Jac Unified Development & Build Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python jac_unified.py dev          # Start development server with HMR
  python jac_unified.py build        # Build production bundle
  python jac_unified.py serve        # Serve production bundle locally
  python jac_unified.py watch        # Watch mode (rebuild on changes)
        """
    )
    
    parser.add_argument(
        'command',
        choices=['dev', 'build', 'serve', 'watch'],
        help='Command to execute'
    )
    
    args = parser.parse_args()
    
    print("🎯 Jac Unified Development & Build Tool")
    print("=" * 50)
    
    success = False
    
    if args.command == 'dev':
        success = run_development_server()
    elif args.command == 'build':
        success = run_production_build()
    elif args.command == 'serve':
        success = serve_production_bundle()
    elif args.command == 'watch':
        success = watch_mode()
    
    if not success:
        sys.exit(1)
    
    print("\n✅ Command completed successfully")

if __name__ == "__main__":
    main()
