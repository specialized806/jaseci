"""Jac Machine module."""

from __future__ import annotations

import ast as py_ast
import marshal
import types
from typing import Any, Iterable, Optional, TYPE_CHECKING, Literal, cast

import jaclang.compiler.unitree as uni
from jaclang.compiler.parser import JacParser
from jaclang.compiler.passes.main import (
    Alert,
    CFGBuildPass,
    DeclImplMatchPass,
    DefUsePass,
    JacAnnexPass,
    JacImportDepsPass,
    PreDynamoPass,
    PyBytecodeGenPass,
    PyJacAstLinkPass,
    PyastBuildPass,
    PyastGenPass,
    SemDefMatchPass,
    SymTabBuildPass,
    Transform,
    TypeCheckPass,
)
from jaclang.compiler.passes.tool import (
    DocIRGenPass,
    FuseCommentsPass,
    JacFormatPass,
)
from jaclang.compiler.emcascript import EsastGenPass
from jaclang.compiler.emcascript.es_unparse import es_to_js
from jaclang.runtimelib.utils import read_file_with_encoding
from jaclang.settings import settings
from jaclang.utils.log import logging

if TYPE_CHECKING:
    from jaclang.compiler.type_system.type_evaluator import TypeEvaluator


logger = logging.getLogger(__name__)

ClientCodegenMode = Literal["js_only", "both"]

ir_gen_sched = [
    SymTabBuildPass,
    DeclImplMatchPass,
    DefUsePass,
    SemDefMatchPass,
    CFGBuildPass,
]
type_check_sched: list = [
    TypeCheckPass,
]
py_code_gen = [
    PyastGenPass,
    PyJacAstLinkPass,
    PyBytecodeGenPass,
]
format_sched = [FuseCommentsPass, DocIRGenPass, JacFormatPass]


class JacProgram:
    """JacProgram to handle the Jac program-related functionalities."""

    def __init__(
        self,
        main_mod: Optional[uni.ProgramModule] = None,
        client_codegen_mode: ClientCodegenMode | None = None,
    ) -> None:
        """Initialize the JacProgram object."""
        self.mod: uni.ProgramModule = main_mod if main_mod else uni.ProgramModule()
        self.py_raise_map: dict[str, str] = {}
        self.errors_had: list[Alert] = []
        self.warnings_had: list[Alert] = []
        self.type_evaluator: TypeEvaluator | None = None
        default_mode: str = settings.client_codegen_mode
        self.client_codegen_mode: ClientCodegenMode = (
            client_codegen_mode
            if client_codegen_mode is not None
            else self._validate_client_mode(default_mode)
        )
        self.client_metadata: dict[str, dict[str, Any]] = {}
        self.client_js_map: dict[str, str] = {}

    def get_type_evaluator(self) -> TypeEvaluator:
        """Return the type evaluator."""
        from jaclang.compiler.type_system.type_evaluator import TypeEvaluator

        if not self.type_evaluator:
            self.type_evaluator = TypeEvaluator(program=self)
        return self.type_evaluator

    def _validate_client_mode(self, mode: str) -> ClientCodegenMode:
        if mode in ("js_only", "both"):
            return cast(ClientCodegenMode, mode)
        return "js_only"

    @property
    def emit_client_python(self) -> bool:
        return self.client_codegen_mode == "both"

    def get_bytecode(self, full_target: str) -> Optional[types.CodeType]:
        """Get the bytecode for a specific module."""
        if full_target in self.mod.hub and self.mod.hub[full_target].gen.py_bytecode:
            codeobj = self.mod.hub[full_target].gen.py_bytecode
            return marshal.loads(codeobj) if isinstance(codeobj, bytes) else None
        result = self.compile(file_path=full_target)
        return marshal.loads(result.gen.py_bytecode) if result.gen.py_bytecode else None

    def parse_str(self, source_str: str, file_path: str) -> uni.Module:
        """Convert a Jac file to an AST."""
        had_error = False
        if file_path.endswith(".py") or file_path.endswith(".pyi"):
            parsed_ast = py_ast.parse(source_str)
            py_ast_ret = PyastBuildPass(
                ir_in=uni.PythonModuleAst(
                    parsed_ast,
                    orig_src=uni.Source(source_str, mod_path=file_path),
                ),
                prog=self,
            )
            had_error = len(py_ast_ret.errors_had) > 0
            mod = py_ast_ret.ir_out
        else:
            source = uni.Source(source_str, mod_path=file_path)
            jac_ast_ret: Transform[uni.Source, uni.Module] = JacParser(
                root_ir=source, prog=self
            )
            had_error = len(jac_ast_ret.errors_had) > 0
            mod = jac_ast_ret.ir_out
        if had_error:
            return mod
        if self.mod.main.stub_only:
            self.mod = uni.ProgramModule(mod)
        self.mod.hub[mod.loc.mod_path] = mod
        JacAnnexPass(ir_in=mod, prog=self)
        return mod

    def compile(
        self,
        file_path: str,
        use_str: str | None = None,
        # TODO: Create a compilation options class and put the bellow
        # options in it.
        no_cgen: bool = False,
        type_check: bool = False,
        client_codegen_mode: ClientCodegenMode | None = None,
    ) -> uni.Module:
        """Convert a Jac file to an AST."""
        prev_mode = self.client_codegen_mode
        if client_codegen_mode is not None:
            self.client_codegen_mode = self._validate_client_mode(client_codegen_mode)
        try:
            keep_str = use_str or read_file_with_encoding(file_path)
            mod_targ = self.parse_str(keep_str, file_path)
            self.run_schedule(mod=mod_targ, passes=ir_gen_sched)
            if type_check:
                self.run_schedule(mod=mod_targ, passes=type_check_sched)
            # If the module has syntax errors, we skip code generation.
            if (not mod_targ.has_syntax_errors) and (not no_cgen):
                if settings.predynamo_pass and PreDynamoPass not in py_code_gen:
                    py_code_gen.insert(0, PreDynamoPass)
                self._prepare_client_artifacts(mod_targ)
                self.run_schedule(mod=mod_targ, passes=py_code_gen)
            return mod_targ
        finally:
            self.client_codegen_mode = prev_mode

    def build(
        self, file_path: str, use_str: str | None = None, type_check: bool = False
    ) -> uni.Module:
        """Convert a Jac file to an AST."""
        mod_targ = self.compile(file_path, use_str, type_check=type_check)
        JacImportDepsPass(ir_in=mod_targ, prog=self)
        for mod in self.mod.hub.values():
            DefUsePass(mod, prog=self)
        return mod_targ

    def run_schedule(
        self,
        mod: uni.Module,
        passes: list[type[Transform[uni.Module, uni.Module]]],
    ) -> None:
        """Run the passes on the module."""
        final_pass: Optional[type[Transform[uni.Module, uni.Module]]] = None
        for current_pass in passes:
            if current_pass == PyBytecodeGenPass:
                final_pass = current_pass
                break
            current_pass(ir_in=mod, prog=self)  # type: ignore
        if final_pass:
            final_pass(mod, prog=self)

    @staticmethod
    def jac_file_formatter(file_path: str) -> str:
        """Convert a Jac file to an AST."""
        prog = JacProgram()
        source_str = read_file_with_encoding(file_path)
        source = uni.Source(source_str, mod_path=file_path)
        prse: Transform = JacParser(root_ir=source, prog=prog)
        for i in format_sched:
            prse = i(ir_in=prse.ir_out, prog=prog)
        prse.errors_had = prog.errors_had
        prse.warnings_had = prog.warnings_had
        return prse.ir_out.gen.jac

    @staticmethod
    def jac_str_formatter(source_str: str, file_path: str) -> str:
        """Convert a Jac file to an AST."""
        prog = JacProgram()
        source = uni.Source(source_str, mod_path=file_path)
        prse: Transform = JacParser(root_ir=source, prog=prog)
        for i in format_sched:
            prse = i(ir_in=prse.ir_out, prog=prog)
        prse.errors_had = prog.errors_had
        prse.warnings_had = prog.warnings_had
        return prse.ir_out.gen.jac if not prse.errors_had else source_str

    # ------------------------------------------------------------------
    # Client element handling

    def _prepare_client_artifacts(self, root_module: uni.Module) -> None:
        """Collect client metadata and pre-generate JS for modules."""
        for module in self._iter_modules(root_module):
            artifacts = self._collect_client_metadata(module)
            mod_path = module.loc.mod_path
            self.client_metadata[mod_path] = artifacts
            module.gen.client_exports = artifacts["exports"]
            module.gen.client_globals = artifacts["globals"]
            module.gen.client_export_params = artifacts["params"]
            js_code = ""
            if artifacts["has_client"]:
                js_code = self._generate_client_js(module)
            module.gen.js = js_code
            self.client_js_map[mod_path] = js_code

    def _collect_client_metadata(self, module: uni.Module) -> dict[str, Any]:
        exports: set[str] = set()
        globals_set: set[str] = set()
        params: dict[str, list[str]] = {}
        globals_values: dict[str, Any] = {}
        has_client = False

        for node in self._walk_nodes(module):
            if not getattr(node, "is_client_decl", False):
                continue
            has_client = True
            if isinstance(node, uni.Ability) and not node.is_method:
                name = node.name_ref.sym_name
                exports.add(name)
                if isinstance(node.signature, uni.FuncSignature):
                    params[name] = [
                        param.name.sym_name
                        for param in node.signature.params
                        if hasattr(param, "name")
                    ]
                else:
                    params[name] = []
            elif isinstance(node, uni.Archetype):
                exports.add(node.name.sym_name)
            elif isinstance(node, uni.GlobalVars):
                for assignment in node.assignments:
                    for target in assignment.target:
                        sym_name = getattr(target, "sym_name", None)
                        if isinstance(sym_name, str):
                            globals_set.add(sym_name)
                            if assignment.value:
                                lit_val = self._literal_value(assignment.value)
                                if lit_val is not None:
                                    globals_values[sym_name] = lit_val

        return {
            "exports": sorted(exports),
            "globals": sorted(globals_set),
            "params": {key: value for key, value in sorted(params.items())},
            "globals_values": globals_values,
            "has_client": has_client,
        }

    def _generate_client_js(self, module: uni.Module) -> str:
        es_pass = EsastGenPass(ir_in=module, prog=self)
        es_module = es_pass.ir_out
        es_ast = getattr(es_module.gen, "es_ast", None)
        if es_ast:
            return es_to_js(es_ast)
        return ""

    def _iter_modules(self, module: uni.Module) -> Iterable[uni.Module]:
        yield module
        for child in getattr(module, "impl_mod", []):
            if isinstance(child, uni.Module):
                yield from self._iter_modules(child)
        for child in getattr(module, "test_mod", []):
            if isinstance(child, uni.Module):
                yield from self._iter_modules(child)

    def _walk_nodes(self, node: uni.UniNode) -> Iterable[uni.UniNode]:
        yield node
        for child in getattr(node, "kid", []):
            if child:
                yield from self._walk_nodes(child)

    def _literal_value(self, expr: uni.UniNode | None) -> Any:
        if expr is None:
            return None
        if hasattr(expr, "lit_value"):
            return getattr(expr, "lit_value")
        if isinstance(expr, uni.ListVal):
            values = [self._literal_value(item) for item in expr.values]
            if all(val is not None for val in values):
                return values
        if isinstance(expr, uni.TupleVal):
            values = [self._literal_value(item) for item in expr.values]
            if all(val is not None for val in values):
                return tuple(values)
        if isinstance(expr, uni.DictVal):
            items: dict[str, Any] = {}
            for pair in expr.kv_pairs:
                if isinstance(pair, uni.KVPair) and pair.key:
                    key_val = self._literal_value(pair.key)
                    val_val = self._literal_value(pair.value)
                    if isinstance(key_val, str) and val_val is not None:
                        items[key_val] = val_val
            if items:
                return items
        return None
