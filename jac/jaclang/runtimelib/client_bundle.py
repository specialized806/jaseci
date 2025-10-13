"""Client bundle generation utilities for Jac web front-ends."""

from __future__ import annotations

import hashlib
import inspect
import json
from dataclasses import dataclass
from pathlib import Path
from types import ModuleType
from typing import Any, Iterable, Sequence

from jaclang.compiler.program import JacProgram


class ClientBundleError(RuntimeError):
    """Raised when the client bundle cannot be generated."""


@dataclass(slots=True)
class ClientBundle:
    """Container for a compiled client bundle."""

    module_name: str
    code: str
    client_functions: list[str]
    client_globals: list[str]
    hash: str


@dataclass(slots=True)
class _CachedBundle:
    signature: str
    bundle: ClientBundle


class ClientBundleBuilder:
    """Compile Jac modules and runtime support into a browser-ready bundle."""

    def __init__(self, runtime_path: Path | None = None) -> None:
        self.runtime_path = runtime_path or Path(__file__).with_name(
            "client_runtime.jac"
        )
        self._cache: dict[str, _CachedBundle] = {}

    def build(self, module: ModuleType, force: bool = False) -> ClientBundle:
        """Build (or reuse) a client bundle for the supplied module."""
        module_path = getattr(module, "__jac_source__", None)
        if not module_path:
            raise ClientBundleError(
                f"Module '{module.__name__}' is missing '__jac_source__'; "
                "recompile with an updated Jac compiler."
            )

        source_path = Path(module_path).resolve()
        runtime_path = self.runtime_path.resolve()
        signature = self._signature([source_path, runtime_path])

        if not force and (cached := self._cache.get(module.__name__)):
            if cached.signature == signature:
                return cached.bundle

        bundle = self._compile_bundle(module, source_path, runtime_path)
        self._cache[module.__name__] = _CachedBundle(signature=signature, bundle=bundle)
        return bundle

    def _compile_bundle(
        self,
        module: ModuleType,
        module_path: Path,
        runtime_path: Path,
    ) -> ClientBundle:
        """Compile bundle pieces and stitch them together."""
        runtime_js = self._compile_to_js(runtime_path)

        manifest = getattr(module, "__jac_client_manifest__", {}) or {}
        manifest_exports = manifest.get("exports", [])
        manifest_globals = manifest.get("globals", [])
        manifest_globals_values = manifest.get("globals_values", {})
        manifest_js = manifest.get("js", "")

        if manifest_js:
            module_js = manifest_js
        else:
            module_js = self._compile_to_js(module_path)

        if manifest_exports:
            client_exports = list(manifest_exports)
        else:
            client_exports = [
                name
                for name, member in inspect.getmembers(module)
                if getattr(member, "__jac_client__", False)
                and (inspect.isfunction(member) or inspect.isclass(member))
            ]

        if manifest_globals:
            client_globals_list = list(manifest_globals)
        else:
            raw_globals = getattr(module, "__jac_client_globals__", [])
            client_globals_list = sorted(str(item) for item in raw_globals)

        client_globals_map: dict[str, Any] = {}
        for name in client_globals_list:
            if name in manifest_globals_values:
                client_globals_map[name] = manifest_globals_values[name]
            elif hasattr(module, name):
                client_globals_map[name] = getattr(module, name)
            else:
                client_globals_map[name] = None

        client_exports = sorted(dict.fromkeys(client_exports))
        client_globals_map = {
            key: client_globals_map[key] for key in sorted(client_globals_map)
        }

        registration_js = self._generate_registration_js(
            module.__name__, client_exports, client_globals_map
        )

        bundle_pieces = [
            "// Jac client runtime",
            runtime_js,
            "",
            f"// Client module: {module.__name__}",
            module_js,
            "",
            registration_js,
        ]
        bundle_code = "\n".join(piece for piece in bundle_pieces if piece is not None)
        bundle_hash = hashlib.sha256(bundle_code.encode("utf-8")).hexdigest()

        return ClientBundle(
            module_name=module.__name__,
            code=bundle_code,
            client_functions=client_exports,
            client_globals=list(client_globals_map.keys()),
            hash=bundle_hash,
        )

    def _compile_to_js(self, source_path: Path) -> str:
        """Compile the provided Jac file into JavaScript."""
        program = JacProgram(client_codegen_mode="js_only")
        mod = program.compile(str(source_path), client_codegen_mode="js_only")
        if program.errors_had:
            formatted = "\n".join(str(err) for err in program.errors_had)
            raise ClientBundleError(
                f"Failed to compile '{source_path}' for client bundle:\n{formatted}"
            )
        return mod.gen.js or ""

    @staticmethod
    def _signature(paths: Iterable[Path]) -> str:
        """Compute a cache signature based on file modification times."""
        parts: list[str] = []
        for path in paths:
            try:
                stat = path.stat()
                parts.append(f"{path}:{stat.st_mtime_ns}")
            except FileNotFoundError:
                parts.append(f"{path}:missing")
        return hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()

    @staticmethod
    def _generate_registration_js(
        module_name: str,
        client_functions: Sequence[str],
        client_globals: dict[str, Any],
    ) -> str:
        """Generate registration code that exposes client symbols globally."""
        lines: list[str] = [
            "(function registerJacClientModule(){",
            "  const scope = typeof globalThis !== 'undefined' ? globalThis : window;",
            "  const registry = scope.__jacClient || (scope.__jacClient = { functions: {}, globals: {}, modules: {} });",
            "  const moduleFunctions = {};",
            "  const moduleGlobals = {};",
        ]

        for name in client_functions:
            lines.append(f"  moduleFunctions[{json.dumps(name)}] = {name};")
            lines.append(f"  scope[{json.dumps(name)}] = {name};")
        for name, value in client_globals.items():
            value_literal = json.dumps(value)
            lines.append(f"  moduleGlobals[{json.dumps(name)}] = {value_literal};")
            lines.append(f"  scope[{json.dumps(name)}] = {value_literal};")

        lines.extend(
            [
                f"  registry.modules[{json.dumps(module_name)}] = {{",
                f"    functions: {json.dumps(list(client_functions))},",
                f"    globals: {json.dumps(list(client_globals.keys()))}",
                "  };",
                "  registry.state = registry.state || {};",
                "  registry.state.globals = registry.state.globals || {};",
                "  Object.assign(registry.functions, moduleFunctions);",
                "  Object.assign(registry.globals, moduleGlobals);",
                "  Object.assign(scope, moduleGlobals);",
                "  function hydrateJacClient(){",
                "    if (typeof document === 'undefined') { return; }",
                "    const initEl = document.getElementById('__jac_init__');",
                "    const rootEl = document.getElementById('__jac_root');",
                "    if (!initEl || !rootEl || initEl.dataset.jacHydrated === 'true') { return; }",
                "    initEl.dataset.jacHydrated = 'true';",
                "    let payload;",
                "    try { payload = JSON.parse(initEl.textContent || '{}'); } catch (err) { console.error('[Jac] Failed to parse hydration payload', err); return; }",
                "    if (!payload || !payload.function) { return; }",
                f"    const moduleName = payload.module || {json.dumps(module_name)};",
                "    const argsOrder = Array.isArray(payload.argOrder) ? payload.argOrder : [];",
                "    const argsDict = payload.args || {};",
                "    const orderedArgs = argsOrder.map((name) => argsDict[name]);",
                "    const targetName = payload.function;",
                "    const target = moduleFunctions[targetName] || registry.functions[targetName];",
                "    if (typeof target !== 'function') { console.error('[Jac] Client function not found:', targetName); return; }",
                "    registry.state.globals[moduleName] = payload.globals || {};",
                "    for (const [gName, gValue] of Object.entries(payload.globals || {})) {",
                "      scope[gName] = gValue;",
                "    }",
                "    const applyRender = (node) => {",
                "      const renderer = scope.renderJsxTree || (typeof renderJsxTree === 'function' ? renderJsxTree : null);",
                "      if (!renderer) { console.warn('[Jac] renderJsxTree is not available in client bundle'); return; }",
                "      try { renderer(node, rootEl); } catch (err) { console.error('[Jac] Failed to render JSX tree', err); }",
                "    };",
                "    let result;",
                "    try { result = target.apply(scope, orderedArgs); } catch (err) { console.error('[Jac] Error executing client function', targetName, err); return; }",
                "    if (result && typeof result.then === 'function') {",
                "      result.then(applyRender).catch((err) => console.error('[Jac] Error resolving client function promise', err));",
                "    } else {",
                "      applyRender(result);",
                "    }",
                "  }",
                "  if (typeof document !== 'undefined') {",
                "    if (document.readyState === 'loading') {",
                "      document.addEventListener('DOMContentLoaded', hydrateJacClient, { once: true });",
                "    } else {",
                "      hydrateJacClient();",
                "    }",
                "  }",
                "})();",
            ]
        )
        return "\n".join(lines)
