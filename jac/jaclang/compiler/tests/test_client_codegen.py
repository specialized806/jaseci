from __future__ import annotations

from pathlib import Path

from jaclang.compiler.program import JacProgram


FIXTURE_DIR = Path(__file__).resolve().parent.parent / "passes" / "ecmascript" / "tests" / "fixtures"


def test_js_only_mode_generates_js_and_manifest() -> None:
    fixture = FIXTURE_DIR / "client_jsx.jac"
    prog = JacProgram(client_codegen_mode="js_only")
    module = prog.compile(str(fixture), client_codegen_mode="js_only")

    assert module.gen.js.strip(), "Expected JavaScript output for client declarations"
    assert "function component" in module.gen.js

    # Client Python code should be omitted in js_only mode
    assert "def component" not in module.gen.py

    # Metadata should capture exported symbols and globals
    assert "__jac_client_manifest__" in module.gen.py
    assert "component" in module.gen.client_exports
    assert "API_URL" in module.gen.client_globals
    assert module.gen.client_export_params.get("component", []) == []


def test_both_mode_keeps_python_for_clients() -> None:
    fixture = FIXTURE_DIR / "client_jsx.jac"
    prog = JacProgram(client_codegen_mode="both")
    module = prog.compile(str(fixture), client_codegen_mode="both")

    assert module.gen.js.strip(), "Expected JavaScript output when emitting both"
    assert "function component" in module.gen.js

    # In both mode the Python definition should still exist
    assert "def component" in module.gen.py
    assert "__jac_client__" in module.gen.py

    # Manifest data should still be populated
    assert "__jac_client_manifest__" in module.gen.py
    assert "component" in module.gen.client_exports
