"""
MkDocs development server with file watching, automatic rebuilds, and custom headers.

Uses Starlette + Uvicorn to serve files with security headers,
and watchdog to watch file changes and rebuild MkDocs site.
"""

import os
import subprocess
import threading
from typing import Awaitable, Callable, Optional

from starlette.applications import Starlette
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.staticfiles import StaticFiles

import uvicorn

from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers for COOP and COEP."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        """Add security headers to the response."""
        response: Response = await call_next(request)
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        return response


class DebouncedRebuildHandler(FileSystemEventHandler):
    """File system event handler for debounced MkDocs site rebuilding."""

    def __init__(self, root_dir: str, debounce_seconds: int = 10) -> None:
        """Initialize the handler with root directory and debounce time."""
        self.root_dir = root_dir
        self.debounce_seconds = debounce_seconds
        self._timer: Optional[threading.Timer] = None
        self._lock = threading.Lock()

    def debounced_rebuild(self, event_type: str, path: str) -> None:
        """Schedule a debounced rebuild on file system events."""
        print(f"Change detected: {event_type} — {path}")
        with self._lock:
            if self._timer:
                self._timer.cancel()
            self._timer = threading.Timer(self.debounce_seconds, self.rebuild)
            self._timer.start()

    def on_modified(self, event: FileSystemEvent) -> None:
        """Handle file modification events."""
        if not event.is_directory and "site" not in event.src_path:
            self.debounced_rebuild("modified", str(event.src_path))

    def on_created(self, event: FileSystemEvent) -> None:
        """Handle file creation events."""
        if not event.is_directory and "site" not in event.src_path:
            self.debounced_rebuild("created", str(event.src_path))

    def on_deleted(self, event: FileSystemEvent) -> None:
        """Handle file deletion events."""
        if not event.is_directory and "site" not in event.src_path:
            self.debounced_rebuild("deleted", str(event.src_path))

    def rebuild(self) -> None:
        """Rebuild the MkDocs site."""
        print("\nRebuilding MkDocs site...")
        try:
            subprocess.run(["mkdocs", "build"], check=True, cwd=self.root_dir)
            print("Rebuild complete.")
        except subprocess.CalledProcessError as e:
            print(f"Rebuild failed: {e}")
        except FileNotFoundError:
            print(
                "Error: mkdocs not found. Please install it via `pip install mkdocs`."
            )


def serve_with_watch() -> None:
    """Serve MkDocs site and watch for file changes to trigger rebuilds."""
    port = 8000
    root_dir = os.path.dirname(os.path.dirname(__file__))
    site_dir = os.path.join(root_dir, "site")

    print("Initial build of MkDocs site...")
    subprocess.run(["mkdocs", "build"], check=True, cwd=root_dir)

    # Set up file watcher
    event_handler = DebouncedRebuildHandler(root_dir=root_dir, debounce_seconds=20)
    observer = Observer()
    observer.schedule(event_handler, root_dir, recursive=True)
    observer.start()

    # Create Starlette app and add middleware + static files
    app = Starlette()
    app.add_middleware(SecurityHeadersMiddleware)
    app.mount("/", StaticFiles(directory=site_dir, html=True), name="static")

    print(f"Serving at http://localhost:{port}")

    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except KeyboardInterrupt:
        print("Stopping server...")
    finally:
        observer.stop()
        observer.join()


if __name__ == "__main__":
    serve_with_watch()
