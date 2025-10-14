from __future__ import annotations

from pathlib import Path

from jaclang.compiler.program import JacProgram


FIXTURE_DIR = Path(__file__).resolve().parent.parent / "passes" / "ecmascript" / "tests" / "fixtures"


def test_js_codegen_generates_js_and_manifest() -> None:
    fixture = FIXTURE_DIR / "client_jsx.jac"
    prog = JacProgram()
    module = prog.compile(str(fixture))

    assert module.gen.js.strip(), "Expected JavaScript output for client declarations"
    assert "function component" in module.gen.js
    assert "__jacJsx(" in module.gen.js

    # Client Python code should be omitted in js_only mode
    assert "def component" not in module.gen.py

    # Metadata should capture exported symbols and globals
    assert "__jac_client_manifest__" in module.gen.py
    assert "component" in module.gen.client_exports
    assert "ButtonProps" in module.gen.client_exports
    assert "API_URL" in module.gen.client_globals
    assert module.gen.client_export_params.get("component", []) == []
    assert "ButtonProps" not in module.gen.client_export_params


def test_compilation_skips_python_stubs() -> None:
    fixture = FIXTURE_DIR / "client_jsx.jac"
    prog = JacProgram()
    module = prog.compile(str(fixture))

    assert module.gen.js.strip(), "Expected JavaScript output when emitting both"
    assert "function component" in module.gen.js
    assert "__jacJsx(" in module.gen.js

    # Client Python definitions are intentionally omitted
    assert "def component" not in module.gen.py
    assert "__jac_client__" not in module.gen.py
    assert "class ButtonProps" not in module.gen.py

    # Manifest data should still be populated
    assert "__jac_client_manifest__" in module.gen.py
    assert "component" in module.gen.client_exports
    assert "ButtonProps" in module.gen.client_exports
    assert "API_URL" in module.gen.client_globals
    assert module.gen.client_export_params.get("component", []) == []
