"""Unit test utilities for JacLangServer."""

import os
import tempfile

from jaclang.vendor.pygls.uris import from_fs_path
from jaclang.vendor.pygls.workspace import Workspace


def create_temp_jac_file(initial_content: str = "") -> str:
    """Create a temporary Jac file with optional initial content and return its path."""
    temp = tempfile.NamedTemporaryFile(
        delete=False, suffix=".jac", mode="w", encoding="utf-8"
    )
    temp.write(initial_content)
    temp.close()
    return temp.name

def load_jac_template(template_file: str, code: str) -> str:
    """Load a Jac template file and inject code into placeholder."""
    with open(template_file, "r") as f:
        jac_template = f.read()
    return jac_template.replace("#{{INJECT_CODE}}", code)


def create_ls_with_workspace(file_path: str):
    """Create JacLangServer and workspace for a given file path, return (uri, ls)."""
    from jaclang.langserve.engine import JacLangServer

    ls = JacLangServer()
    uri = from_fs_path(file_path)
    ls.lsp._workspace = Workspace(os.path.dirname(file_path), ls)
    return uri, ls
