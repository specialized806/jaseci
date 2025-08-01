"""Python AST to Jac AST Conversion Pass for the Jac compiler.

This pass transforms Python AST nodes into equivalent Jac AST nodes by:

1. Converting Python modules, classes, functions, and expressions to their Jac equivalents
2. Preserving source location information and symbol relationships
3. Handling Python-specific constructs and adapting them to Jac's object model
4. Supporting both standard Python modules and type stub (.pyi) files
5. Creating appropriate symbol tables and scopes for the converted nodes

This pass is crucial for Python interoperability, allowing Python code to be imported
and used within Jac programs while maintaining type information and semantic relationships.
"""

from __future__ import annotations

import ast as py_ast
import os
from typing import Optional, Sequence, TYPE_CHECKING, TypeAlias, TypeVar

import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes.uni_pass import Transform
from jaclang.utils.helpers import pascal_to_snake

if TYPE_CHECKING:
    from jaclang.compiler.program import JacProgram

T = TypeVar("T", bound=uni.UniNode)


class PyastBuildPass(Transform[uni.PythonModuleAst, uni.Module]):
    """Jac Parser."""

    def __init__(self, ir_in: uni.PythonModuleAst, prog: JacProgram) -> None:
        """Initialize parser."""
        self.mod_path = ir_in.loc.mod_path
        self.orig_src = ir_in.loc.orig_src
        Transform.__init__(self, ir_in=ir_in, prog=prog)

    def nu(self, node: T) -> T:
        """Update node."""
        self.cur_node = node
        return node

    def convert(self, node: py_ast.AST) -> uni.UniNode:
        """Get python node type."""
        if hasattr(self, f"proc_{pascal_to_snake(type(node).__name__)}"):
            ret = getattr(self, f"proc_{pascal_to_snake(type(node).__name__)}")(node)
        else:
            raise self.ice(f"Unknown node type {type(node).__name__}")
        return ret

    def transform(self, ir_in: uni.PythonModuleAst) -> uni.Module:
        """Transform input IR."""
        self.ir_out: uni.Module = self.proc_module(ir_in.ast)
        return self.ir_out

    def extract_with_entry(
        self, body: list[uni.UniNode], exclude_types: TypeAlias = T
    ) -> list[T | uni.ModuleCode]:
        """Extract with entry from a body."""

        def gen_mod_code(with_entry_body: list[uni.CodeBlockStmt]) -> uni.ModuleCode:
            return uni.ModuleCode(
                name=None,
                body=with_entry_body,
                kid=with_entry_body,
                doc=None,
            )

        extracted: list[T | uni.ModuleCode] = []
        with_entry_body: list[uni.CodeBlockStmt] = []
        for i in body:
            if isinstance(i, exclude_types):
                if len(with_entry_body):
                    extracted.append(gen_mod_code(with_entry_body))
                    with_entry_body = []
                extracted.append(i)
            elif isinstance(i, uni.CodeBlockStmt):
                if isinstance(i, uni.ExprStmt) and isinstance(i.expr, uni.String):
                    self.convert_to_doc(i.expr)
                with_entry_body.append(i)
            else:
                continue  # FIXME: check this
                # self.ice("Invalid type for with entry body")
        if len(with_entry_body):
            extracted.append(gen_mod_code(with_entry_body))
        return extracted

    def proc_module(self, node: py_ast.Module) -> uni.Module:
        """Process python node.

        class Module(mod):
            __match_args__ = ("body", "type_ignores")
            body: list[stmt]
            type_ignores: list[TypeIgnore]
        """
        elements: list[uni.UniNode] = [self.convert(i) for i in node.body]
        elements[0] = (
            elements[0].expr
            if isinstance(elements[0], uni.ExprStmt)
            and isinstance(elements[0].expr, uni.String)
            else elements[0]
        )
        doc_str_list = [elements[0]] if isinstance(elements[0], uni.String) else []
        valid = (
            (doc_str_list)
            + self.extract_with_entry(elements[1:], (uni.ElementStmt, uni.EmptyToken))
            if doc_str_list
            else self.extract_with_entry(elements[:], (uni.ElementStmt, uni.EmptyToken))
        )
        doc_str = elements[0] if isinstance(elements[0], uni.String) else None
        self.convert_to_doc(doc_str) if doc_str else None
        ret = uni.Module(
            name=self.mod_path.split(os.path.sep)[-1].split(".")[0],
            source=uni.Source("", mod_path=self.mod_path),
            doc=doc_str,
            body=valid[1:] if valid and isinstance(valid[0], uni.String) else valid,
            terminals=[],
            kid=valid,
        )
        ret.is_raised_from_py = True
        return self.nu(ret)

    def proc_function_def(
        self, node: py_ast.FunctionDef | py_ast.AsyncFunctionDef
    ) -> uni.Ability:
        """Process python node.

        class FunctionDef(stmt):
            name: _Identifier
            args: arguments
            body: list[stmt]
            decorator_list: list[expr]
            returns: expr | None
            if sys.version_info >= (3, 12):
            type_params: list[type_param]
        """
        from jaclang.compiler import TOKEN_MAP

        reserved_keywords = [v for _, v in TOKEN_MAP.items()]

        value = node.name if node.name not in reserved_keywords else f"<>{node.name}"
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=value,
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.name),
            pos_start=0,
            pos_end=0,
        )
        body = [self.convert(i) for i in node.body]
        valid = [i for i in body if isinstance(i, (uni.CodeBlockStmt))]
        if len(valid) != len(body):
            raise self.ice("Length mismatch in function body")

        if (
            len(valid)
            and isinstance(valid[0], uni.ExprStmt)
            and isinstance(valid[0].expr, uni.String)
        ):
            self.convert_to_doc(valid[0].expr)
            doc = valid[0].expr
            valid_body = valid[1:]
        else:
            doc = None
            valid_body = valid
        decorators = [self.convert(i) for i in node.decorator_list]
        valid_dec = [i for i in decorators if isinstance(i, uni.Expr)]
        if len(valid_dec) != len(decorators):
            raise self.ice("Length mismatch in decorators on function")
        valid_decorators = valid_dec if valid_dec else None
        res = self.convert(node.args)
        sig: Optional[uni.FuncSignature] = (
            res if isinstance(res, uni.FuncSignature) else None
        )
        ret_sig = self.convert(node.returns) if node.returns else None
        if isinstance(ret_sig, uni.Expr):
            if not sig:
                sig = uni.FuncSignature(params=[], return_type=ret_sig, kid=[ret_sig])
            else:
                sig.return_type = ret_sig
                sig.add_kids_right([sig.return_type])
        kid = ([doc] if doc else []) + (
            [name, sig, *valid_body] if sig else [name, *valid_body]
        )
        if not sig:
            raise self.ice("Function signature not found")
        ret = uni.Ability(
            name_ref=name,
            is_async=False,
            is_static=False,
            is_abstract=False,
            is_override=False,
            access=None,
            signature=sig,
            body=valid_body,
            decorators=valid_decorators,
            doc=doc,
            kid=kid,
        )
        return ret

    def proc_async_function_def(self, node: py_ast.AsyncFunctionDef) -> uni.Ability:
        """Process python node.

        class AsyncFunctionDef(stmt):
            __match_args__ = ("name", "args", "body", "decorator_list",
                              "returns", "type_comment", "type_params")
            name: _Identifier
            args: arguments
            body: list[stmt]
            decorator_list: list[expr]
            returns: expr | None
            if sys.version_info >= (3, 12):
                type_params: list[type_param]
        """
        ability = self.proc_function_def(node)
        ability.is_async = True
        return ability

    def proc_class_def(self, node: py_ast.ClassDef) -> uni.Archetype | uni.Enum:
        """Process python node.

        class ClassDef(stmt):
            __match_args__ = ("name", "bases", "keywords", "body",
                              "decorator_list", "type_params")
            name: _Identifier
            bases: list[expr]
            keywords: list[keyword]
            body: list[stmt]
            decorator_list: list[expr]
            if sys.version_info >= (3, 12):
            type_params: list[type_param]
        """
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=node.name,
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.name),
            pos_start=0,
            pos_end=0,
        )
        arch_type = uni.Token(
            orig_src=self.orig_src,
            name=Tok.KW_CLASS,
            value="class",
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=0,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )
        body = [self.convert(i) for i in node.body]
        for body_stmt in body:
            if (
                isinstance(body_stmt, uni.Ability)
                and isinstance(body_stmt.name_ref, uni.Name)
                and body_stmt.name_ref.value == "__init__"
            ):
                tok = uni.Name(
                    orig_src=self.orig_src,
                    name=Tok.KW_INIT,
                    value="init",
                    line=node.lineno,
                    end_line=node.end_lineno if node.end_lineno else node.lineno,
                    col_start=node.col_offset,
                    col_end=node.col_offset + len("init"),
                    pos_start=0,
                    pos_end=0,
                )
                body_stmt.name_ref = uni.SpecialVarRef(var=tok)
            if (
                isinstance(body_stmt, uni.Ability)
                and body_stmt.signature
                and isinstance(body_stmt.signature, uni.FuncSignature)
                and body_stmt.signature.params
            ):
                for param in body_stmt.signature.params:
                    if param.name.value == "self":
                        param.type_tag = uni.SubTag[uni.Expr](name, kid=[name])
        doc = (
            body[0].expr
            if isinstance(body[0], uni.ExprStmt)
            and isinstance(body[0].expr, uni.String)
            else None
        )
        self.convert_to_doc(doc) if doc else None
        body = body[1:] if doc else body
        valid: list[uni.ArchBlockStmt] = (
            self.extract_with_entry(body, uni.ArchBlockStmt)
            if body and not (isinstance(body[0], uni.Semi) and len(body) == 1)
            else []
        )
        empty_block: Sequence[uni.UniNode] = [
            self.operator(Tok.LBRACE, "{"),
            self.operator(Tok.RBRACE, "}"),
        ]
        valid_body = valid if valid else empty_block
        converted_base_classes = [self.convert(base) for base in node.bases]
        base_classes: list[uni.Expr] = [
            base for base in converted_base_classes if isinstance(base, uni.Expr)
        ]
        converted_decorators_list = [self.convert(i) for i in node.decorator_list]
        decorators = [i for i in converted_decorators_list if isinstance(i, uni.Expr)]
        if len(decorators) != len(converted_decorators_list):
            raise self.ice("Length mismatch in decorators on class")
        valid_decorators = decorators if decorators else None
        kid = (
            [name, *base_classes, *valid_body, doc]
            if doc and base_classes
            else (
                [name, *base_classes, *valid_body]
                if base_classes
                else [name, *valid_body, doc] if doc else [name, *valid_body]
            )
        )
        return uni.Archetype(
            arch_type=arch_type,
            name=name,
            access=None,
            base_classes=base_classes,
            body=valid,
            kid=kid,
            doc=doc,
            decorators=valid_decorators,
        )

    def proc_return(self, node: py_ast.Return) -> uni.ReturnStmt | None:
        """Process python node.

        class Return(stmt):
            __match_args__ = ("value",)
            value: expr | None
        """
        value = self.convert(node.value) if node.value else None
        if not value:
            return uni.ReturnStmt(
                expr=None, kid=[self.operator(Tok.KW_RETURN, "return")]
            )
        elif value and isinstance(value, uni.Expr):
            return uni.ReturnStmt(expr=value, kid=[value])
        else:
            raise self.ice("Invalid return value")

    def proc_delete(self, node: py_ast.Delete) -> uni.DeleteStmt:
        """Process python node.

        class Delete(stmt):
            __match_args__ = ("targets",)
            targets: list[expr]
        """
        exprs = [self.convert(target) for target in node.targets]
        valid_exprs = [expr for expr in exprs if isinstance(expr, uni.Expr)]
        if not len(valid_exprs) or len(valid_exprs) != len(exprs):
            raise self.ice("Length mismatch in delete targets")
        target_1 = (
            valid_exprs[0]
            if len(valid_exprs) > 1
            else uni.TupleVal(values=valid_exprs, kid=[*valid_exprs])
        )
        return uni.DeleteStmt(
            target=target_1,
            kid=[*valid_exprs],
        )

    def proc_assign(self, node: py_ast.Assign) -> uni.Assignment:
        """Process python node.

        class Assign(stmt):
            targets: list[expr]
            value: expr
        """
        value = self.convert(node.value)
        targets = [self.convert(target) for target in node.targets]
        valid = [target for target in targets if isinstance(target, uni.Expr)]
        if not len(valid) == len(targets):
            raise self.ice("Length mismatch in assignment targets")
        if isinstance(value, uni.Expr):
            return uni.Assignment(
                target=valid,
                value=value,
                type_tag=None,
                kid=[*valid, value],
            )
        else:
            raise self.ice()

    def proc_aug_assign(self, node: py_ast.AugAssign) -> uni.Assignment:
        """Process python node.

        class AugAssign(stmt):
            __match_args__ = ("target", "op", "value")
            target: Name | Attribute | Subscript
            op: operator
            value: expr
        """
        from jaclang.compiler import TOKEN_MAP

        target = self.convert(node.target)
        op = self.convert(node.op)
        if isinstance(op, uni.Token):
            op.name = self.aug_op_map(TOKEN_MAP, op)
        value = self.convert(node.value)
        if (
            isinstance(value, uni.Expr)
            and isinstance(target, uni.Expr)
            and isinstance(op, uni.Token)
        ):
            return uni.Assignment(
                target=[target],
                type_tag=None,
                mutable=True,
                aug_op=op,
                value=value,
                kid=[target, op, value],
            )
        else:
            raise self.ice()

    def proc_ann_assign(self, node: py_ast.AnnAssign) -> uni.Assignment:
        """Process python node.

        class AnnAssign(stmt):
            __match_args__ = ("target", "annotation", "value", "simple")
            target: Name | Attribute | Subscript
            annotation: expr
            value: expr | None
            simple: int
        """
        target = self.convert(node.target)
        annotation = self.convert(node.annotation)
        if isinstance(annotation, uni.Expr):
            annotation_subtag = uni.SubTag[uni.Expr](tag=annotation, kid=[annotation])
        else:
            raise self.ice()
        value = self.convert(node.value) if node.value else None
        if (
            (isinstance(value, (uni.Expr, uni.YieldExpr)) or not value)
            and isinstance(annotation, uni.Expr)
            and isinstance(target, uni.Expr)
        ):
            return uni.Assignment(
                target=[target],
                value=value if isinstance(value, (uni.Expr, uni.YieldExpr)) else None,
                type_tag=annotation_subtag,
                kid=(
                    [target, annotation_subtag, value]
                    if value
                    else [target, annotation_subtag]
                ),
            )
        else:
            raise self.ice()

    def proc_for(self, node: py_ast.For) -> uni.InForStmt:
        """Process python node.

        class For(stmt):
            __match_args__ = ("target", "iter", "body", "orelse")
            target: expr
            iter: expr
            body: list[stmt]
            orelse: list[stmt]
        """
        target = self.convert(node.target)
        iter = self.convert(node.iter)
        body = [self.convert(i) for i in node.body]
        val_body = [i for i in body if isinstance(i, uni.CodeBlockStmt)]
        if len(val_body) != len(body):
            raise self.ice("Length mismatch in for body")

        valid_body = val_body
        orelse = [self.convert(i) for i in node.orelse]
        val_orelse = [i for i in orelse if isinstance(i, uni.CodeBlockStmt)]
        if len(val_orelse) != len(orelse):
            raise self.ice("Length mismatch in for orelse")
        if orelse:
            fin_orelse = uni.ElseStmt(body=val_orelse, kid=val_orelse)
        else:
            fin_orelse = None
        if isinstance(target, uni.Expr) and isinstance(iter, uni.Expr):
            return uni.InForStmt(
                target=target,
                is_async=False,
                collection=iter,
                body=valid_body,
                else_body=fin_orelse,
                kid=(
                    [target, iter, *valid_body, fin_orelse]
                    if fin_orelse
                    else [target, iter, *valid_body]
                ),
            )
        else:
            raise self.ice()

    def proc_async_for(self, node: py_ast.AsyncFor) -> uni.InForStmt:
        """Process AsyncFor node.

        class AsyncFor(stmt):
            __match_args__ = ("target", "iter", "body", "orelse")
            target: expr
            iter: expr
            body: list[stmt]
            orelse: list[stmt]`
        """
        target = self.convert(node.target)
        iter = self.convert(node.iter)
        body = [self.convert(i) for i in node.body]
        val_body = [i for i in body if isinstance(i, uni.CodeBlockStmt)]
        if len(val_body) != len(body):
            raise self.ice("Length mismatch in for body")

        valid_body = val_body
        orelse = [self.convert(i) for i in node.orelse]
        val_orelse = [i for i in orelse if isinstance(i, uni.CodeBlockStmt)]
        if len(val_orelse) != len(orelse):
            raise self.ice("Length mismatch in for orelse")
        if orelse:
            fin_orelse = uni.ElseStmt(body=val_orelse, kid=val_orelse)
        else:
            fin_orelse = None
        if isinstance(target, uni.Expr) and isinstance(iter, uni.Expr):
            return uni.InForStmt(
                target=target,
                is_async=True,
                collection=iter,
                body=valid_body,
                else_body=fin_orelse,
                kid=(
                    [target, iter, *valid_body, fin_orelse]
                    if fin_orelse
                    else [target, iter, *valid_body]
                ),
            )
        else:
            raise self.ice()

    def proc_while(self, node: py_ast.While) -> uni.WhileStmt:
        """Process While node.

        class While(stmt):
            __match_args__ = ("test", "body", "orelse")
            test: expr
            body: list[stmt]
            orelse: list[stmt]
        """
        test = self.convert(node.test)
        body = [self.convert(stmt) for stmt in node.body]
        valid_body = [stmt for stmt in body if isinstance(stmt, uni.CodeBlockStmt)]
        if len(valid_body) != len(body):
            raise self.ice("Length mismatch in while body")
        orelse = [self.convert(i) for i in node.orelse]
        val_orelse = [i for i in orelse if isinstance(i, uni.CodeBlockStmt)]
        if len(val_orelse) != len(orelse):
            raise self.ice("Length mismatch in for orelse")
        if orelse:
            fin_orelse = uni.ElseStmt(body=val_orelse, kid=val_orelse)
        else:
            fin_orelse = None

        if isinstance(test, uni.Expr):
            return uni.WhileStmt(
                condition=test,
                body=valid_body,
                else_body=fin_orelse,
                kid=[test, *valid_body],
            )
        else:
            raise self.ice()

    def proc_if(self, node: py_ast.If) -> uni.IfStmt:
        """Process If node.

        class If(stmt):
            __match_args__ = ("test", "body", "orelse")
            test: expr
            body: list[stmt]
            orelse: list[stmt]
        """
        test = self.convert(node.test)
        body = [self.convert(stmt) for stmt in node.body]
        valid_body = [stmt for stmt in body if isinstance(stmt, uni.CodeBlockStmt)]
        if len(valid_body) != len(body):
            self.log_error("Length mismatch in async for body")
        body2 = valid_body

        orelse = [self.convert(stmt) for stmt in node.orelse]
        valid_orelse = [
            stmt for stmt in orelse if isinstance(stmt, (uni.CodeBlockStmt))
        ]
        if valid_orelse:
            first_elm = valid_orelse[0]
            if isinstance(first_elm, uni.IfStmt):
                else_body: Optional[uni.ElseIf | uni.ElseStmt] = uni.ElseIf(
                    condition=first_elm.condition,
                    body=first_elm.body,
                    else_body=first_elm.else_body,
                    kid=first_elm.kid,
                )
            else:
                else_body = uni.ElseStmt(body=valid_orelse, kid=valid_orelse)
        else:
            else_body = None
        if isinstance(test, uni.Expr):
            ret = uni.IfStmt(
                condition=test,
                body=body2,
                else_body=else_body,
                kid=([test, *body2, else_body] if else_body else [test, *body2]),
            )
        else:
            raise self.ice()
        return ret

    def proc_with(self, node: py_ast.With) -> uni.WithStmt:
        """Process With node.

        class With(stmt):
            __match_args__ = ("items", "body")
            items: list[withitem]
            body: list[stmt]
        """
        items = [self.convert(item) for item in node.items]
        valid_items = [item for item in items if isinstance(item, uni.ExprAsItem)]
        if len(valid_items) != len(items):
            raise self.ice("Length mismatch in with items")
        body = [self.convert(stmt) for stmt in node.body]
        valid_body = [stmt for stmt in body if isinstance(stmt, uni.CodeBlockStmt)]
        if len(valid_body) != len(body):
            raise self.ice("Length mismatch in async for body")
        return uni.WithStmt(
            is_async=False,
            exprs=valid_items,
            body=valid_body,
            kid=[*valid_items, *valid_body],
        )

    def proc_async_with(self, node: py_ast.AsyncWith) -> uni.WithStmt:
        """Process AsyncWith node.

        class AsyncWith(stmt):
            __match_args__ = ("items", "body")
            items: list[withitem]
            body: list[stmt]
        """
        items = [self.convert(item) for item in node.items]
        valid_items = [item for item in items if isinstance(item, uni.ExprAsItem)]
        if len(valid_items) != len(items):
            raise self.ice("Length mismatch in with items")
        body = [self.convert(stmt) for stmt in node.body]
        valid_body = [stmt for stmt in body if isinstance(stmt, uni.CodeBlockStmt)]
        if len(valid_body) != len(body):
            raise self.ice("Length mismatch in async for body")
        return uni.WithStmt(
            is_async=True,
            exprs=valid_items,
            body=valid_body,
            kid=[*valid_items, *valid_body],
        )

    def proc_raise(self, node: py_ast.Raise) -> uni.RaiseStmt:
        """Process python node.

        class Raise(stmt):
            exc: expr | None
            cause: expr | None
        """
        exc = self.convert(node.exc) if node.exc else None
        cause = self.convert(node.cause) if node.cause else None
        kid: list[uni.Expr | uni.Token] = []
        if isinstance(exc, uni.Expr):
            kid = [exc]
        if isinstance(cause, uni.Expr):
            kid.append(cause)
        if not (exc and cause):
            kid.append(self.operator(Tok.KW_RAISE, "raise"))
        if (isinstance(cause, uni.Expr) or cause is None) and (
            isinstance(exc, uni.Expr) or exc is None
        ):
            if exc and not node.cause:
                return uni.RaiseStmt(
                    cause=exc,
                    from_target=None,
                    kid=[self.operator(Tok.KW_RAISE, "raise"), exc],
                )
            else:
                return uni.RaiseStmt(cause=cause, from_target=exc, kid=kid)
        else:
            raise self.ice()

    def proc_assert(self, node: py_ast.Assert) -> uni.AssertStmt:
        """Process python node.

        class Assert(stmt):
            test: expr
            msg: expr | None
        """
        test = self.convert(node.test)
        msg = self.convert(node.msg) if node.msg else None
        if isinstance(test, uni.Expr) and (isinstance(msg, uni.Expr) or msg is None):
            return uni.AssertStmt(
                condition=test,
                error_msg=msg,
                kid=[test, msg] if msg else [test],
            )
        else:
            raise self.ice()

    def proc_attribute(self, node: py_ast.Attribute) -> uni.AtomTrailer:
        """Proassignment targetscess python node.

        class Attribute(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("value", "attr", "ctx")
        value: expr
        attr: _Identifier
        ctx: expr_context
        """
        value = self.convert(node.value)
        if (
            isinstance(value, uni.FuncCall)
            and isinstance(value.target, uni.Name)
            and value.target.value == "super"
        ):
            tok = uni.Name(
                orig_src=self.orig_src,
                name=Tok.KW_SUPER,
                value="super",
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + len("super"),
                pos_start=0,
                pos_end=0,
            )
            value = uni.SpecialVarRef(var=tok)
            # exit()
        attribute = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=(
                ("<>" + node.attr)
                if node.attr == "init"
                else "init" if node.attr == "__init__" else node.attr
            ),
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.attr),
            pos_start=0,
            pos_end=0,
        )
        if isinstance(value, uni.Expr):
            return uni.AtomTrailer(
                target=value,
                right=attribute,
                is_attr=True,
                is_null_ok=False,
                kid=[value, attribute],
            )
        else:
            raise self.ice()

    def proc_await(self, node: py_ast.Await) -> uni.AwaitExpr:
        """Process python node.

        class Await(expr):
            value: expr
        """
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.AwaitExpr(target=value, kid=[value])
        else:
            raise self.ice()

    def proc_bin_op(self, node: py_ast.BinOp) -> uni.AtomUnit:
        """Process python node.

        class BinOp(expr):
            if sys.version_info >= (3, 10):
                __match_args__ = ("left", "op", "right")
            left: expr
            op: operator
            right: expr
        """
        left = self.convert(node.left)
        op = self.convert(node.op)
        right = self.convert(node.right)
        if (
            isinstance(left, uni.Expr)
            and isinstance(op, uni.Token)
            and isinstance(right, uni.Expr)
        ):
            value = uni.BinaryExpr(
                left=left,
                op=op,
                right=right,
                kid=[left, op, right],
            )
            return uni.AtomUnit(
                value=value,
                kid=[
                    self.operator(Tok.RPAREN, "("),
                    value,
                    self.operator(Tok.LPAREN, ")"),
                ],
            )
        else:
            raise self.ice()

    def proc_unary_op(self, node: py_ast.UnaryOp) -> uni.UnaryExpr:
        """Process python node.

        class UnaryOp(expr):
            op: unaryop
            operand: expr
        """
        op = self.convert(node.op)
        operand = self.convert(node.operand)
        if isinstance(op, uni.Token) and isinstance(operand, uni.Expr):
            return uni.UnaryExpr(
                op=op,
                operand=operand,
                kid=[op, operand],
            )
        else:
            raise self.ice()

    def proc_bool_op(self, node: py_ast.BoolOp) -> uni.AtomUnit:
        """Process python node.

        class BoolOp(expr): a and b and c
            op: boolop
            values: list[expr]
        """
        op = self.convert(node.op)
        values = [self.convert(value) for value in node.values]
        valid = [value for value in values if isinstance(value, uni.Expr)]
        if isinstance(op, uni.Token) and len(valid) == len(values):
            expr = uni.BoolExpr(op=op, values=valid, kid=[op, *valid])
            return uni.AtomUnit(
                value=expr,
                kid=[
                    self.operator(Tok.RPAREN, "("),
                    expr,
                    self.operator(Tok.LPAREN, ")"),
                ],
            )
        else:
            raise self.ice()

    def proc_break(self, node: py_ast.Break) -> uni.CtrlStmt:
        """Process python node."""
        break_tok = uni.Token(
            orig_src=self.orig_src,
            name=Tok.KW_BREAK,
            value="break",
            line=0,
            end_line=0,
            col_start=0,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )
        return uni.CtrlStmt(ctrl=break_tok, kid=[break_tok])

    def proc_call(self, node: py_ast.Call) -> uni.FuncCall:
        """Process python node.

        class Call(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("func", "args", "keywords")
        func: expr
        args: list[expr]
        keywords: list[keyword]
        """
        func = self.convert(node.func)
        params_in: list[uni.Expr | uni.KWPair] = []
        args = [self.convert(arg) for arg in node.args]
        keywords = [self.convert(keyword) for keyword in node.keywords]

        for i in args:
            if isinstance(i, uni.Expr):
                params_in.append(i)
        for i in keywords:
            if isinstance(i, uni.KWPair):
                params_in.append(i)
        if len(params_in) != 0:
            kids = [func, *params_in]
        else:
            kids = [func]
        if isinstance(func, uni.Expr):
            return uni.FuncCall(
                target=func,
                params=params_in,
                genai_call=None,
                kid=kids,
            )
        else:
            raise self.ice()

    def proc_compare(self, node: py_ast.Compare) -> uni.AtomUnit:
        """Process python node.

        class Compare(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("left", "ops", "comparators")
        left: expr
        ops: list[cmpop]
        comparators: list[expr]
        """
        left = self.convert(node.left)
        comparators = [self.convert(comparator) for comparator in node.comparators]
        valid_comparators = [
            comparator for comparator in comparators if isinstance(comparator, uni.Expr)
        ]
        ops = [self.convert(op) for op in node.ops]
        valid_ops = [op for op in ops if isinstance(op, uni.Token)]

        kids = [left, *valid_ops, *valid_comparators]
        if (
            isinstance(left, uni.Expr)
            and len(ops) == len(valid_ops)
            and len(comparators) == len(valid_comparators)
        ):
            expr = uni.CompareExpr(
                left=left, rights=valid_comparators, ops=valid_ops, kid=kids
            )
            return uni.AtomUnit(
                value=expr,
                kid=[
                    self.operator(Tok.RPAREN, "("),
                    expr,
                    self.operator(Tok.LPAREN, ")"),
                ],
            )
        else:
            raise self.ice()

    def proc_constant(self, node: py_ast.Constant) -> uni.Literal:
        """Process python node.

        class Constant(expr):
            value: Any  # None, str, bytes, bool, int, float, complex, Ellipsis
            kind: str | None
            # Aliases for value, for backwards compatibility
            s: Any
            n: int | float | complex
        """
        type_mapping = {
            int: uni.Int,
            float: uni.Float,
            str: uni.String,
            bytes: uni.String,
            bool: uni.Bool,
            type(None): uni.Null,
        }
        value_type = type(node.value)
        if value_type in type_mapping:
            if value_type is None:
                token_type = "NULL"
            elif value_type == str:
                token_type = "STRING"
            else:
                token_type = f"{value_type.__name__.upper()}"

            if value_type == str:
                raw_repr = repr(node.value)
                quote = "'" if raw_repr.startswith("'") else '"'
                value = f"{quote}{raw_repr[1:-1]}{quote}"
            else:
                value = str(node.value)
            return type_mapping[value_type](
                orig_src=self.orig_src,
                name=token_type,
                value=value,
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + len(str(node.value)),
                pos_start=0,
                pos_end=0,
            )
        elif node.value == Ellipsis:
            return uni.Ellipsis(
                orig_src=self.orig_src,
                name=Tok.ELLIPSIS,
                value="...",
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + 3,
                pos_start=0,
                pos_end=0,
            )
        else:
            raise self.ice("Invalid type for constant")

    def proc_continue(self, node: py_ast.Continue) -> uni.CtrlStmt:
        """Process python node."""
        continue_tok = uni.Token(
            orig_src=self.orig_src,
            name=Tok.KW_CONTINUE,
            value="continue",
            line=0,
            end_line=0,
            col_start=0,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )
        return uni.CtrlStmt(ctrl=continue_tok, kid=[continue_tok])

    def proc_dict(self, node: py_ast.Dict) -> uni.DictVal:
        """Process python node.

        class Dict(expr):
            keys: list[expr | None]
            values: list[expr]
        """
        keys = [self.convert(i) if i else None for i in node.keys]
        values = [self.convert(i) for i in node.values]
        valid_keys = [i for i in keys if isinstance(i, uni.Expr) or i is None]
        valid_values = [i for i in values if isinstance(i, uni.Expr)]
        kvpair: list[uni.KVPair] = []
        for i in range(len(values)):
            key_pluck = valid_keys[i]
            kvp = uni.KVPair(
                key=key_pluck,
                value=valid_values[i],
                kid=([key_pluck, valid_values[i]] if key_pluck else [valid_values[i]]),
            )
            kvpair.append(kvp)
        return uni.DictVal(
            kv_pairs=kvpair,
            kid=(
                [*kvpair]
                if len(kvpair)
                else [self.operator(Tok.LBRACE, "{"), self.operator(Tok.RBRACE, "}")]
            ),
        )

    def proc_dict_comp(self, node: py_ast.DictComp) -> uni.DictCompr:
        """Process python node.

        class DictComp(expr):
            key: expr
            value: expr
            generators: list[comprehension]
        """
        key = self.convert(node.key)
        value = self.convert(node.value)
        if isinstance(key, uni.Expr) and isinstance(value, uni.Expr):
            kv_pair = uni.KVPair(key=key, value=value, kid=[key, value])
        else:
            raise self.ice()
        generators = [self.convert(i) for i in node.generators]
        valid = [i for i in generators if isinstance(i, (uni.InnerCompr))]
        if len(valid) != len(generators):
            raise self.ice("Length mismatch in dict compr generators")
        return uni.DictCompr(kv_pair=kv_pair, compr=valid, kid=[kv_pair, *valid])

    def proc_ellipsis(self, node: py_ast.Ellipsis) -> None:
        """Process python node."""

    def proc_except_handler(self, node: py_ast.ExceptHandler) -> uni.Except:
        """Process python node.

        class ExceptHandler(excepthandler):
            type: expr | None
            name: _Identifier | None
            body: list[stmt]
        """
        type = self.convert(node.type) if node.type else None
        name: uni.Name | None = None
        if not type and not node.name:
            type = uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value="Exception",
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + 9,
                pos_start=0,
                pos_end=0,
            )
            name = uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value="e",
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + 1,
                pos_start=0,
                pos_end=0,
            )
        else:
            # type = uni.Name(
            #     orig_src=self.orig_src,
            #     name=Tok.NAME,
            #     value=no,
            #     line=node.lineno,
            #     end_line = (node.end_lineno if node.end_lineno else node.lineno,)
            #     col_start=node.col_offset,
            #     col_end=node.col_offset + 9,
            #     pos_start=0,
            #     pos_end=0,
            # )
            name = (
                uni.Name(
                    orig_src=self.orig_src,
                    name=Tok.NAME,
                    value=node.name,
                    line=node.lineno,
                    end_line=node.end_lineno if node.end_lineno else node.lineno,
                    col_start=node.col_offset,
                    col_end=node.col_offset + len(node.name),
                    pos_start=0,
                    pos_end=0,
                )
                if node.name
                else None
            )

        body = [self.convert(i) for i in node.body]
        valid = [i for i in body if isinstance(i, (uni.CodeBlockStmt))]
        if len(valid) != len(body):
            raise self.ice("Length mismatch in except handler body")
        kid = [item for item in [type, name, *valid] if item]
        if isinstance(type, uni.Expr) and (isinstance(name, uni.Name) or not name):
            return uni.Except(
                ex_type=type,
                name=name,
                body=valid,
                kid=kid,
            )
        else:
            raise self.ice()

    def proc_expr(self, node: py_ast.Expr) -> uni.ExprStmt:
        """Process python node.

        class Expr(stmt):
            value: expr
        """
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.ExprStmt(expr=value, in_fstring=False, kid=[value])
        else:
            raise self.ice()

    def proc_formatted_value(self, node: py_ast.FormattedValue) -> uni.ExprStmt:
        """Process python node.

        class FormattedValue(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("value", "conversion", "format_spec")
        value: expr
        conversion: int
        format_spec: expr | None
        """
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            ret = uni.ExprStmt(
                expr=value,
                in_fstring=True,
                kid=[value],
            )
        else:
            raise self.ice()
        return ret

    def proc_function_type(self, node: py_ast.FunctionType) -> None:
        """Process python node."""

    def proc_generator_exp(self, node: py_ast.GeneratorExp) -> uni.GenCompr:
        """Process python node..

        class SetComp(expr):
            elt: expr
            generators: list[comprehension]
        """
        elt = self.convert(node.elt)
        generators = [self.convert(gen) for gen in node.generators]
        valid = [gen for gen in generators if isinstance(gen, uni.InnerCompr)]
        if len(generators) != len(valid):
            raise self.ice("Length mismatch in list comp generators")
        if isinstance(elt, uni.Expr):
            return uni.GenCompr(out_expr=elt, compr=valid, kid=[elt, *valid])
        else:
            raise self.ice()

    def proc_global(self, node: py_ast.Global) -> uni.GlobalStmt:
        """Process python node.

        class Global(stmt):
            names: list[_Identifier]
        """
        names: list[uni.NameAtom] = []
        for id in node.names:
            names.append(
                uni.Name(
                    orig_src=self.orig_src,
                    name=Tok.NAME,
                    value=id,
                    line=node.lineno,
                    end_line=node.end_lineno if node.end_lineno else node.lineno,
                    col_start=node.col_offset,
                    col_end=node.col_offset + len(id),
                    pos_start=0,
                    pos_end=0,
                )
            )
        return uni.GlobalStmt(target=names, kid=names)

    def proc_if_exp(self, node: py_ast.IfExp) -> uni.IfElseExpr:
        """Process python node.

        class IfExp(expr):
            test: expr
            body: expr
            orelse: expr
        """
        test = self.convert(node.test)
        body = self.convert(node.body)
        orelse = self.convert(node.orelse)
        if (
            isinstance(test, uni.Expr)
            and isinstance(body, uni.Expr)
            and isinstance(orelse, uni.Expr)
        ):
            return uni.IfElseExpr(
                value=body, condition=test, else_value=orelse, kid=[body, test, orelse]
            )
        else:
            raise self.ice()

    def proc_import(self, node: py_ast.Import) -> uni.Import:
        """Process python node.

        class Import(stmt):
            names: list[alias]
        """
        names = [self.convert(name) for name in node.names]
        valid_names = [name for name in names if isinstance(name, uni.ExprAsItem)]
        if len(valid_names) != len(names):
            self.log_error("Length mismatch in import names")
        paths = []
        for name in valid_names:
            if isinstance(name.expr, uni.Name) and (
                isinstance(name.alias, uni.Name) or name.alias is None
            ):
                paths.append(
                    uni.ModulePath(
                        path=[name.expr],
                        level=0,
                        alias=name.alias,
                        kid=[i for i in name.kid if i],
                    )
                )
            # Need to unravel atom trailers
            else:
                raise self.ice()
        ret = uni.Import(
            from_loc=None,
            items=paths,
            is_absorb=False,
            kid=paths,
        )
        return ret

    def proc_import_from(self, node: py_ast.ImportFrom) -> uni.Import:
        """Process python node.

        class ImportFrom(stmt):
            module: str | None
            names: list[alias]
            level: int
        """
        lang = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value="py",
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )
        modpaths: list[uni.Name] = []
        if node.module:
            for i in node.module.split("."):
                modpaths.append(
                    uni.Name(
                        orig_src=self.orig_src,
                        name=Tok.NAME,
                        value=i,
                        line=node.lineno,
                        end_line=node.end_lineno if node.end_lineno else node.lineno,
                        col_start=0,
                        col_end=0,
                        pos_start=0,
                        pos_end=0,
                    )
                )
        moddots = [self.operator(Tok.DOT, ".") for _ in range(node.level)]
        modparts = moddots + modpaths
        path = uni.ModulePath(
            path=modpaths if modpaths else None,
            level=node.level,
            alias=None,
            kid=modparts,
        )

        names = [self.convert(name) for name in node.names]
        valid_names = []
        for name in names:
            if (
                isinstance(name, uni.ExprAsItem)
                and isinstance(name.expr, uni.Name)
                and (isinstance(name.alias, uni.Name) or name.alias is None)
            ):
                valid_names.append(
                    uni.ModuleItem(
                        name=name.expr,
                        alias=name.alias if name.alias else None,
                        kid=[i for i in name.kid if i],
                    )
                )
            else:
                raise self.ice()
        items = valid_names
        if not items:
            raise self.ice("No valid names in import from")
        pytag = uni.SubTag[uni.Name](tag=lang, kid=[lang])
        if len(node.names) == 1 and node.names[0].name == "*":
            ret = uni.Import(
                from_loc=None,
                items=[path],
                is_absorb=True,
                kid=[pytag, path],
            )
            return ret
        ret = uni.Import(
            from_loc=path,
            items=items,
            is_absorb=False,
            kid=[pytag, path, *items],
        )
        return ret

    def proc_joined_str(self, node: py_ast.JoinedStr) -> uni.FString:
        """Process python node.

        class JoinedStr(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("values",)
        values: list[expr]
        """
        values = [self.convert(value) for value in node.values]
        valid = [
            value for value in values if isinstance(value, (uni.String, uni.ExprStmt))
        ]
        fstr = uni.FString(
            parts=valid,
            kid=[*valid] if valid else [uni.EmptyToken()],
        )
        return uni.MultiString(strings=[fstr], kid=[fstr])

    def proc_lambda(self, node: py_ast.Lambda) -> uni.LambdaExpr:
        """Process python node.

        class Lambda(expr):
            args: arguments
            body: expr
        """
        args = self.convert(node.args)
        body = self.convert(node.body)
        if isinstance(args, uni.FuncSignature) and isinstance(body, uni.Expr):
            return uni.LambdaExpr(signature=args, body=body, kid=[args, body])
        else:
            raise self.ice()

    def proc_list(self, node: py_ast.List) -> uni.ListVal:
        """Process python node.

        class List(expr):
            elts: list[expr]
            ctx: expr_context
        """
        elts = [self.convert(elt) for elt in node.elts]
        valid_elts = [elt for elt in elts if isinstance(elt, uni.Expr)]
        if len(valid_elts) != len(elts):
            raise self.ice("Length mismatch in list elements")
        l_square = self.operator(Tok.LSQUARE, "[")
        r_square = self.operator(Tok.RSQUARE, "]")
        return uni.ListVal(
            values=valid_elts,
            kid=[*valid_elts] if valid_elts else [l_square, r_square],
        )

    def proc_list_comp(self, node: py_ast.ListComp) -> uni.ListCompr:
        """Process python node.

        class ListComp(expr):
            elt: expr
            generators: list[comprehension]
        """
        elt = self.convert(node.elt)
        generators = [self.convert(gen) for gen in node.generators]
        valid = [gen for gen in generators if isinstance(gen, uni.InnerCompr)]
        if len(generators) != len(valid):
            raise self.ice("Length mismatch in list comp generators")
        if isinstance(elt, uni.Expr):
            return uni.ListCompr(out_expr=elt, compr=valid, kid=[elt, *valid])
        else:
            raise self.ice()

    def proc_match(self, node: py_ast.Match) -> uni.MatchStmt:
        """Process python node.

        class Match(stmt):
            subject: expr
            cases: list[match_case]
        """
        subject = self.convert(node.subject)
        cases = [self.convert(i) for i in node.cases]
        valid = [case for case in cases if isinstance(case, uni.MatchCase)]
        if isinstance(subject, uni.Expr):
            return uni.MatchStmt(target=subject, cases=valid, kid=[subject, *valid])
        else:
            raise self.ice()

    def proc_match_as(self, node: py_ast.MatchAs) -> uni.MatchAs | uni.MatchWild:
        """Process python node.

        class MatchAs(pattern):
            pattern: _Pattern | None
            name: _Identifier | None
        """
        pattern = self.convert(node.pattern) if node.pattern else None
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=node.name if node.name else "_",
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=(
                (node.col_offset + len(node.name))
                if node.name
                else (node.col_offset + 1)
            ),
            pos_start=0,
            pos_end=0,
        )

        if (
            name.value == "_"
            or pattern is not None
            and not isinstance(pattern, uni.MatchPattern)
        ):
            return uni.MatchWild(kid=[name])

        return uni.MatchAs(
            name=name,
            pattern=pattern,
            kid=[name] if pattern is None else [name, pattern],
        )

    def proc_match_class(self, node: py_ast.MatchClass) -> uni.MatchArch:
        """Process python node.

        class MatchClass(pattern):
            cls: expr
            patterns: list[pattern]
            kwd_attrs: list[_Identifier]
            kwd_patterns: list[pattern]
        """
        cls = self.convert(node.cls)
        kid = [cls]
        if len(node.patterns) != 0:
            patterns = [self.convert(i) for i in node.patterns]
            valid_patterns = [i for i in patterns if isinstance(i, uni.MatchPattern)]
            if len(patterns) == len(valid_patterns):
                kid.extend(valid_patterns)
                patterns_list = valid_patterns
            else:
                raise self.ice()
        else:
            patterns_list = None

        if len(node.kwd_patterns):
            names: list[uni.Name] = []
            kv_pairs: list[uni.MatchKVPair] = []
            for kwd_attrs in node.kwd_attrs:
                names.append(
                    uni.Name(
                        orig_src=self.orig_src,
                        name=Tok.NAME,
                        value=kwd_attrs,
                        line=node.lineno,
                        end_line=node.end_lineno if node.end_lineno else node.lineno,
                        col_start=node.col_offset,
                        col_end=node.col_offset + len(kwd_attrs),
                        pos_start=0,
                        pos_end=0,
                    )
                )
            kwd_patterns = [self.convert(i) for i in node.kwd_patterns]
            valid_kwd_patterns = [
                i for i in kwd_patterns if isinstance(i, uni.MatchPattern)
            ]
            for i in range(len(kwd_patterns)):
                kv_pairs.append(
                    uni.MatchKVPair(
                        key=names[i],
                        value=valid_kwd_patterns[i],
                        kid=[names[i], valid_kwd_patterns[i]],
                    )
                )

            kid.extend(kv_pairs)
            kw_patterns_list = kv_pairs
        else:
            kw_patterns_list = None
        if isinstance(cls, (uni.NameAtom, uni.AtomTrailer)):
            return uni.MatchArch(
                name=cls,
                arg_patterns=patterns_list,
                kw_patterns=kw_patterns_list,
                kid=kid,
            )
        else:
            raise self.ice()

    def proc_match_mapping(self, node: py_ast.MatchMapping) -> uni.MatchMapping:
        """Process python node.

        class MatchMapping(pattern):
            keys: list[expr]
            patterns: list[pattern]
            rest: _Identifier | None
        """
        values: list[uni.MatchKVPair | uni.MatchStar] = []
        keys = [self.convert(i) for i in node.keys]
        valid_keys = [
            i
            for i in keys
            if isinstance(i, (uni.MatchPattern, uni.NameAtom, uni.AtomExpr))
        ]
        patterns = [self.convert(i) for i in node.patterns]
        valid_patterns = [i for i in patterns if isinstance(i, uni.MatchPattern)]
        for i in range(len(valid_keys)):
            kv_pair = uni.MatchKVPair(
                key=valid_keys[i],
                value=valid_patterns[i],
                kid=[valid_keys[i], valid_patterns[i]],
            )
            values.append(kv_pair)
        if node.rest:
            name = uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value=node.rest,
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + len(node.rest),
                pos_start=0,
                pos_end=0,
            )
            values.append(uni.MatchStar(name=name, is_list=False, kid=[name]))
        return uni.MatchMapping(values=values, kid=values)

    def proc_match_or(self, node: py_ast.MatchOr) -> uni.MatchOr:
        """Process python node.

        class MatchOr(pattern):
            patterns: list[pattern]
        """
        patterns = [self.convert(i) for i in node.patterns]
        valid = [i for i in patterns if isinstance(i, uni.MatchPattern)]
        return uni.MatchOr(patterns=valid, kid=valid)

    def proc_match_sequence(self, node: py_ast.MatchSequence) -> uni.MatchSequence:
        """Process python node.

        class MatchSequence(pattern):
            patterns: list[pattern]
        """
        patterns = [self.convert(i) for i in node.patterns]
        valid = [i for i in patterns if isinstance(i, uni.MatchPattern)]
        if len(patterns) == len(valid):
            return uni.MatchSequence(values=valid, kid=valid)
        else:
            raise self.ice()

    def proc_match_singleton(self, node: py_ast.MatchSingleton) -> uni.MatchSingleton:
        """Process python node.

        class MatchSingleton(pattern):
            value: Literal[True, False] | None
        """
        type = Tok.NULL if node.value is None else Tok.BOOL
        ret_type = uni.Null if node.value is None else uni.Bool
        value = ret_type(
            orig_src=self.orig_src,
            name=type,
            value=str(node.value),
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(str(node.value)),
            pos_start=0,
            pos_end=0,
        )
        if isinstance(value, (uni.Bool, uni.Null)):
            return uni.MatchSingleton(value=value, kid=[value])
        else:
            raise self.ice()

    def proc_match_star(self, node: py_ast.MatchStar) -> uni.MatchStar:
        """Process python node.

        class MatchStar(pattern):
            name: _Identifier | None
        """
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=node.name if node.name else "_",
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.name if node.name else "_"),
            pos_start=0,
            pos_end=0,
        )
        return uni.MatchStar(name=name, is_list=True, kid=[name])

    def proc_match_value(self, node: py_ast.MatchValue) -> uni.MatchValue:
        """Process python node.

        class MatchValue(pattern):
            value: expr
        """
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.MatchValue(value=value, kid=[value])
        else:
            raise self.ice()

    def proc_name(self, node: py_ast.Name) -> uni.Name:
        """Process python node.

        class Name(expr):
        if sys.version_info >= (3, 10):
            __match_args__ = ("id", "ctx")
        id: _Identifier
        ctx: expr_context
        """
        from jaclang.compiler import TOKEN_MAP

        reserved_keywords = [
            v
            for _, v in TOKEN_MAP.items()
            if v not in ["float", "int", "str", "bool", "self"]
        ]

        value = node.id if node.id not in reserved_keywords else f"<>{node.id}"
        ret = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=value,
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.id),
            pos_start=0,
            pos_end=0,
        )
        return ret

    def proc_named_expr(self, node: py_ast.NamedExpr) -> uni.AtomUnit:
        """Process python node.

        class NamedExpr(expr):
            target: Name
            value: expr
        """
        target = self.convert(node.target)
        value = self.convert(node.value)
        if isinstance(value, uni.Expr) and isinstance(target, uni.Name):
            op = self.operator(Tok.WALRUS_EQ, ":=")
            expr = uni.BinaryExpr(
                left=target,
                op=op,
                right=value,
                kid=[target, op, value],
            )
            return uni.AtomUnit(
                value=expr,
                kid=[
                    self.operator(Tok.RPAREN, "("),
                    expr,
                    self.operator(Tok.LPAREN, ")"),
                ],
            )
        else:
            raise self.ice()

    def proc_nonlocal(self, node: py_ast.Nonlocal) -> uni.NonLocalStmt:
        """Process python node.

        class Nonlocal(stmt):
            names: list[_Identifier]
        """
        from jaclang.compiler import TOKEN_MAP

        reserved_keywords = [v for _, v in TOKEN_MAP.items()]

        names: list[uni.NameAtom] = []
        for name in node.names:
            value = name if name not in reserved_keywords else f"<>{name}"
            names.append(
                uni.Name(
                    orig_src=self.orig_src,
                    name=Tok.NAME,
                    value=value,
                    line=node.lineno,
                    end_line=node.end_lineno if node.end_lineno else node.lineno,
                    col_start=node.col_offset,
                    col_end=node.col_offset + len(name),
                    pos_start=0,
                    pos_end=0,
                )
            )
        return uni.NonLocalStmt(target=names, kid=names)

    def proc_pass(self, node: py_ast.Pass) -> uni.Semi:
        """Process python node."""
        return uni.Semi(
            orig_src=self.orig_src,
            name=Tok.SEMI,
            value=";",
            line=0,
            end_line=0,
            col_start=0,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )

    def proc_set(self, node: py_ast.Set) -> uni.SetVal:
        """Process python node.

        class Set(expr):
            elts: list[expr]
        """
        if len(node.elts) != 0:
            elts = [self.convert(i) for i in node.elts]
            valid = [i for i in elts if isinstance(i, (uni.Expr))]
            if len(valid) != len(elts):
                raise self.ice("Length mismatch in set body")
            kid: list[uni.UniNode] = [*valid]
        else:
            valid = []
            l_brace = self.operator(Tok.LBRACE, "{")
            r_brace = self.operator(Tok.RBRACE, "}")
            kid = [l_brace, r_brace]
        return uni.SetVal(values=valid, kid=kid)

    def proc_set_comp(self, node: py_ast.SetComp) -> uni.ListCompr:
        """Process python node.

        class SetComp(expr):
            elt: expr
            generators: list[comprehension]
        """
        elt = self.convert(node.elt)
        generators = [self.convert(gen) for gen in node.generators]
        valid = [gen for gen in generators if isinstance(gen, uni.InnerCompr)]
        if len(generators) != len(valid):
            raise self.ice("Length mismatch in list comp generators")
        if isinstance(elt, uni.Expr):
            return uni.SetCompr(out_expr=elt, compr=valid, kid=[elt, *valid])
        else:
            raise self.ice()

    def proc_slice(self, node: py_ast.Slice) -> uni.IndexSlice:
        """Process python node.

        class Slice(_Slice):
            lower: expr | None
            upper: expr | None
            step: expr | None
        """
        lower = self.convert(node.lower) if node.lower else None
        upper = self.convert(node.upper) if node.upper else None
        step = self.convert(node.step) if node.step else None
        valid_kid = [i for i in [lower, upper, step] if i]
        if not valid_kid:
            valid_kid = [self.operator(Tok.COLON, ":")]
        if (
            (isinstance(lower, uni.Expr) or lower is None)
            and (isinstance(upper, uni.Expr) or upper is None)
            and (isinstance(step, uni.Expr) or step is None)
        ):
            return uni.IndexSlice(
                slices=[uni.IndexSlice.Slice(lower, upper, step)],
                is_range=True,
                kid=valid_kid,
            )
        else:
            raise self.ice()

    def proc_starred(self, node: py_ast.Starred) -> uni.UnaryExpr:
        """Process python node.

        class Starred(expr):
            value: expr
            ctx: expr_context
        """
        star_tok = self.operator(Tok.STAR_MUL, "*")
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.UnaryExpr(operand=value, op=star_tok, kid=[value, star_tok])
        else:
            raise self.ice()

    def proc_subscript(self, node: py_ast.Subscript) -> uni.AtomTrailer:
        """Process python node.

        class Subscript(expr):
            value: expr
            slice: _Slice
            ctx: expr_context
        """
        value = self.convert(node.value)
        slice = self.convert(node.slice)
        if not isinstance(slice, uni.IndexSlice) and isinstance(slice, uni.Expr):
            slice = uni.IndexSlice(
                slices=[uni.IndexSlice.Slice(slice, None, None)],
                is_range=False,
                kid=[slice],
            )
        if (
            not isinstance(slice, uni.IndexSlice)
            and isinstance(slice, uni.TupleVal)
            and slice.values
        ):

            slices: list[uni.IndexSlice.Slice] = []
            for index_slice in slice.values:
                if not isinstance(index_slice, uni.IndexSlice):
                    raise self.ice()
                slices.append(index_slice.slices[0])

            slice = uni.IndexSlice(
                slices=slices,
                is_range=True,
                kid=[slice],
            )

        if isinstance(value, uni.Expr) and isinstance(slice, uni.IndexSlice):
            return uni.AtomTrailer(
                target=value,
                right=slice,
                is_attr=False,
                is_null_ok=False,
                kid=[value, slice],
            )
        else:
            raise self.ice()

    def proc_try(self, node: py_ast.Try | py_ast.TryStar) -> uni.TryStmt:
        """Process python node.

        class Try(stmt):
            body: list[stmt]
            handlers: list[ExceptHandler]
            orelse: list[stmt]
            finalbody: list[stmt]
        """
        body = [self.convert(i) for i in node.body]
        valid = [i for i in body if isinstance(i, (uni.CodeBlockStmt))]
        if len(valid) != len(body):
            raise self.ice("Length mismatch in try body")
        valid_body = valid
        kid: list[uni.UniNode] = [*valid_body]

        if len(node.handlers) != 0:
            handlers = [self.convert(i) for i in node.handlers]
            valid_handlers = [i for i in handlers if isinstance(i, (uni.Except))]
            if len(handlers) != len(valid_handlers):
                raise self.ice("Length mismatch in try handlers")
            excepts = valid_handlers
            kid.extend(valid_handlers)
        else:
            excepts = []

        if len(node.orelse) != 0:
            orelse = [self.convert(i) for i in node.orelse]
            valid_orelse = [i for i in orelse if isinstance(i, (uni.CodeBlockStmt))]
            if len(orelse) != len(valid_orelse):
                raise self.ice("Length mismatch in try orelse")
            else_body = valid_orelse
            elsestmt = uni.ElseStmt(body=else_body, kid=else_body)
            kid.extend(else_body)
        else:
            else_body = None

        if len(node.finalbody) != 0:
            finalbody = [self.convert(i) for i in node.finalbody]
            valid_finalbody = [
                i for i in finalbody if isinstance(i, (uni.CodeBlockStmt))
            ]
            if len(finalbody) != len(valid_finalbody):
                raise self.ice("Length mismatch in try finalbody")
            finally_stmt_obj: Optional[uni.FinallyStmt] = (
                fin_append := uni.FinallyStmt(
                    body=valid_finalbody,
                    kid=valid_finalbody,
                )
            )
            kid.append(fin_append)
        else:
            finally_stmt_obj = None
        ret = uni.TryStmt(
            body=valid_body,
            excepts=excepts,
            else_body=elsestmt if else_body else None,
            finally_body=finally_stmt_obj,
            kid=kid,
        )
        return ret

    def proc_try_star(self, node: py_ast.TryStar) -> uni.TryStmt:
        """Process python node.

        class Try(stmt):
            body: list[stmt]
            handlers: list[ExceptHandler]
            orelse: list[stmt]
            finalbody: list[stmt]
        """
        return self.proc_try(node)

    def proc_tuple(self, node: py_ast.Tuple) -> uni.TupleVal:
        """Process python node.

        class Tuple(expr):
            elts: list[expr]
            ctx: expr_context
        """
        elts = [self.convert(elt) for elt in node.elts]
        if len(node.elts) != 0:
            valid_elts = [i for i in elts if isinstance(i, (uni.Expr, uni.KWPair))]
            if len(elts) != len(valid_elts):
                raise self.ice("Length mismatch in tuple elts")
            kid = elts
        else:
            l_paren = self.operator(Tok.LPAREN, "(")
            r_paren = self.operator(Tok.RPAREN, ")")
            valid_elts = []
            kid = [l_paren, r_paren]
        return uni.TupleVal(values=valid_elts, kid=kid)

    def proc_yield(self, node: py_ast.Yield) -> uni.YieldExpr:
        """Process python node.

        class Yield(expr):
            value: expr | None
        """
        value = self.convert(node.value) if node.value else None
        if isinstance(value, uni.Expr):
            return uni.YieldExpr(expr=value, with_from=False, kid=[value])
        elif not value:
            return uni.YieldExpr(
                expr=None, with_from=False, kid=[self.operator(Tok.KW_YIELD, "yield")]
            )
        else:
            raise self.ice()

    def proc_yield_from(self, node: py_ast.YieldFrom) -> uni.YieldExpr:
        """Process python node."""
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.YieldExpr(expr=value, with_from=True, kid=[value])
        else:
            raise self.ice()

    def proc_alias(self, node: py_ast.alias) -> uni.ExprAsItem:
        """Process python node.

        class alias(AST):
            name: _Identifier
            asname: _Identifier | None
        """
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=node.name,
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.name),
            pos_start=0,
            pos_end=0,
        )
        asname = (
            uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value=node.asname,
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + len(node.asname),
                pos_start=0,
                pos_end=0,
            )
            if node.asname
            else None
        )
        return uni.ExprAsItem(
            expr=name, alias=asname, kid=[name, asname] if asname else [name]
        )

    def proc_arg(self, node: py_ast.arg) -> uni.ParamVar:
        """Process python node.

        class arg(AST):
            arg: _Identifier
            annotation: expr | None
        """
        from jaclang.compiler import TOKEN_MAP

        reserved_keywords = [
            v
            for _, v in TOKEN_MAP.items()
            if v not in ["float", "int", "str", "bool", "self"]
        ]

        value = node.arg if node.arg not in reserved_keywords else f"<>{node.arg}"
        name = uni.Name(
            orig_src=self.orig_src,
            name=Tok.NAME,
            value=value,
            line=node.lineno,
            end_line=node.end_lineno if node.end_lineno else node.lineno,
            col_start=node.col_offset,
            col_end=node.col_offset + len(node.arg),
            pos_start=0,
            pos_end=0,
        )
        ann_expr = (
            self.convert(node.annotation)
            if node.annotation
            else uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value="Any",
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + 3,
                pos_start=0,
                pos_end=0,
            )
        )
        if not isinstance(ann_expr, uni.Expr):
            raise self.ice("Expected annotation to be an expression")
        annot = uni.SubTag[uni.Expr](tag=ann_expr, kid=[ann_expr])
        paramvar = uni.ParamVar(
            name=name, type_tag=annot, unpack=None, value=None, kid=[name, annot]
        )
        return paramvar

    def proc_arguments(self, node: py_ast.arguments) -> uni.FuncSignature:
        """Process python node.

        class arguments(AST):
            args: list[arg]
            vararg: arg | None
            kwonlyargs: list[arg]
            kw_defaults: list[expr | None]
            kwarg: arg | None
            defaults: list[expr]
        """
        args = [self.convert(arg) for arg in node.args]
        vararg = self.convert(node.vararg) if node.vararg else None
        if vararg and isinstance(vararg, uni.ParamVar):
            vararg.unpack = uni.Token(
                orig_src=self.orig_src,
                name=Tok.STAR_MUL,
                value="*",
                line=vararg.loc.first_line,
                end_line=vararg.loc.last_line,
                col_start=vararg.loc.col_start,
                col_end=vararg.loc.col_end,
                pos_start=0,
                pos_end=0,
            )
            vararg.add_kids_left([vararg.unpack])
        kwonlyargs = [self.convert(arg) for arg in node.kwonlyargs]
        for i in range(len(kwonlyargs)):
            kwa = kwonlyargs[i]
            kwd = node.kw_defaults[i]
            kwdefault = self.convert(kwd) if kwd else None
            if (
                kwdefault
                and isinstance(kwa, uni.ParamVar)
                and isinstance(kwdefault, uni.Expr)
            ):
                kwa.value = kwdefault
                kwa.add_kids_right([kwa.value])
        kwarg = self.convert(node.kwarg) if node.kwarg else None
        if kwarg and isinstance(kwarg, uni.ParamVar):
            kwarg.unpack = uni.Token(
                orig_src=self.orig_src,
                name=Tok.STAR_POW,
                value="**",
                line=kwarg.loc.first_line,
                end_line=kwarg.loc.last_line,
                col_start=kwarg.loc.col_start,
                col_end=kwarg.loc.col_end,
                pos_start=0,
                pos_end=0,
            )
            kwarg.add_kids_left([kwarg.unpack])
        defaults = [self.convert(expr) for expr in node.defaults]
        params = [*args]
        for param, default in zip(params[::-1], defaults[::-1]):
            if isinstance(default, uni.Expr) and isinstance(param, uni.ParamVar):
                param.value = default
                param.add_kids_right([default])
        if vararg:
            params.append(vararg)
        params += kwonlyargs
        if kwarg:
            params.append(kwarg)
        params += defaults

        valid_params = [param for param in params if isinstance(param, uni.ParamVar)]
        if valid_params:
            fs_params = valid_params
            return uni.FuncSignature(
                params=fs_params,
                return_type=None,
                kid=fs_params,
            )
        else:
            return uni.FuncSignature(
                params=[],
                return_type=None,
                kid=[self.operator(Tok.LPAREN, "("), self.operator(Tok.RPAREN, ")")],
            )

    def operator(self, tok: Tok, value: str) -> uni.Token:
        """Create an operator token."""
        return uni.Token(
            orig_src=self.orig_src,
            name=tok,
            value=value,
            line=0,
            end_line=0,
            col_start=0,
            col_end=0,
            pos_start=0,
            pos_end=0,
        )

    def proc_and(self, node: py_ast.And) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_AND, "and")

    def proc_or(self, node: py_ast.Or) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_OR, "or")

    def proc_add(self, node: py_ast.Add) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.PLUS, "+")

    def proc_bit_and(self, node: py_ast.BitAnd) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.BW_AND, "&")

    def proc_bit_or(self, node: py_ast.BitOr) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.BW_OR, "|")

    def proc_bit_xor(self, node: py_ast.BitXor) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.BW_XOR, "^")

    def proc_div(self, node: py_ast.Div) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.DIV, "/")

    def proc_floor_div(self, node: py_ast.FloorDiv) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.FLOOR_DIV, "//")

    def proc_l_shift(self, node: py_ast.LShift) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.LSHIFT, "<<")

    def proc_mod(self, node: py_ast.Mod) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.MOD, "%")

    def proc_mult(self, node: py_ast.Mult) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.STAR_MUL, "*")

    def proc_mat_mult(self, node: py_ast.MatMult) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.DECOR_OP, "@")

    def proc_pow(self, node: py_ast.Pow) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.STAR_POW, "**")

    def proc_r_shift(self, node: py_ast.RShift) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.RSHIFT, ">>")

    def proc_sub(self, node: py_ast.Sub) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.MINUS, "-")

    def proc_invert(self, node: py_ast.Invert) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.BW_NOT, "~")

    def proc_not(self, node: py_ast.Not) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.NOT, "not")

    def proc_u_add(self, node: py_ast.UAdd) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.PLUS, "+")

    def proc_u_sub(self, node: py_ast.USub) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.MINUS, "-")

    def proc_eq(self, node: py_ast.Eq) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.EE, "==")

    def proc_gt(self, node: py_ast.Gt) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.GT, ">")

    def proc_gt_e(self, node: py_ast.GtE) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.GTE, ">=")

    def proc_in(self, node: py_ast.In) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_IN, "in")

    def proc_is(self, node: py_ast.Is) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_IS, "is")

    def proc_is_not(self, node: py_ast.IsNot) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_ISN, "is not")

    def proc_lt(self, node: py_ast.Lt) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.LT, "<")

    def proc_lt_e(self, node: py_ast.LtE) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.LTE, "<=")

    def proc_not_eq(self, node: py_ast.NotEq) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.NE, "!=")

    def proc_not_in(self, node: py_ast.NotIn) -> uni.Token:
        """Process python node."""
        return self.operator(Tok.KW_NIN, "not in")

    def proc_comprehension(self, node: py_ast.comprehension) -> uni.InnerCompr:
        """Process python node.

        class comprehension(AST):
            target: expr
            iter: expr
            ifs: list[expr]
            is_async: int
        """
        target = self.convert(node.target)
        iter = self.convert(node.iter)
        if len(node.ifs) != 0:
            ifs_list = [self.convert(ifs) for ifs in node.ifs]
            valid = [ifs for ifs in ifs_list if isinstance(ifs, uni.Expr)]
        else:
            valid = None
        is_async = node.is_async > 0
        if isinstance(target, uni.Expr) and isinstance(iter, uni.Expr):
            return uni.InnerCompr(
                is_async=is_async,
                target=target,
                collection=iter,
                conditional=valid,
                kid=[target, iter, *valid] if valid else [target, iter],
            )
        else:
            raise self.ice()

    def proc_keyword(self, node: py_ast.keyword) -> uni.KWPair:
        """Process python node.

        class keyword(AST):
        if sys.version_info >= (3, 10):
            __match_args__ = ("arg", "value")
        arg: _Identifier | None
        value: expr
        """
        arg = None
        if node.arg:
            from jaclang.compiler import TOKEN_MAP

            reserved_keywords = [v for _, v in TOKEN_MAP.items()]
            arg_value = (
                node.arg if node.arg not in reserved_keywords else f"<>{node.arg}"
            )
            arg = uni.Name(
                orig_src=self.orig_src,
                name=Tok.NAME,
                value=arg_value,
                line=node.lineno,
                end_line=node.end_lineno if node.end_lineno else node.lineno,
                col_start=node.col_offset,
                col_end=node.col_offset + len(node.arg if node.arg else "_"),
                pos_start=0,
                pos_end=0,
            )
        value = self.convert(node.value)
        if isinstance(value, uni.Expr):
            return uni.KWPair(
                key=arg, value=value, kid=[arg, value] if arg else [value]
            )
        else:
            raise self.ice()

    def proc_match_case(self, node: py_ast.match_case) -> uni.MatchCase:
        """Process python node.

        class match_case(AST):
            pattern: _Pattern
            guard: expr | None
            body: list[stmt]
        """
        pattern = self.convert(node.pattern)
        guard = self.convert(node.guard) if node.guard else None
        body = [self.convert(i) for i in node.body]
        valid = [i for i in body if isinstance(i, uni.CodeBlockStmt)]
        if isinstance(pattern, uni.MatchPattern) and (
            isinstance(guard, uni.Expr) or guard is None
        ):
            return uni.MatchCase(
                pattern=pattern,
                guard=guard,
                body=valid,
                kid=([pattern, guard, *valid] if guard else [pattern, *valid]),
            )
        else:
            raise self.ice()

    def proc_withitem(self, node: py_ast.withitem) -> uni.ExprAsItem:
        """Process python node.

        class withitem(AST):
            context_expr: expr
            optional_vars: expr | None
        """
        context_expr = self.convert(node.context_expr)
        optional_vars = self.convert(node.optional_vars) if node.optional_vars else None
        if isinstance(context_expr, uni.Expr) and (
            isinstance(optional_vars, uni.Expr) or optional_vars is None
        ):
            return uni.ExprAsItem(
                expr=context_expr,
                alias=optional_vars if optional_vars else None,
                kid=[context_expr, optional_vars] if optional_vars else [context_expr],
            )
        else:
            raise self.ice()

    def proc_param_spec(self, node: py_ast.ParamSpec) -> None:
        """Process python node."""

    def proc_type_alias(self, node: py_ast.TypeAlias) -> None:
        """Process python node."""

    def proc_type_var(self, node: py_ast.TypeVar) -> None:
        """Process python node."""

    def proc_type_var_tuple(self, node: py_ast.TypeVarTuple) -> None:
        """Process python node."""

    def convert_to_doc(self, string: uni.String) -> None:
        """Convert a string to a docstring."""
        string.value = f'"""{string.value[1:-1]}"""'

    def aug_op_map(self, tok_dict: dict, op: uni.Token) -> str:
        """aug_mapper."""
        op.value += "="
        for _key, value in tok_dict.items():
            if value == op.value:
                break
        return _key
