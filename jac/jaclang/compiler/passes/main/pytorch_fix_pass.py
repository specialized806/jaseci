"""Pytorch Fix Pass."""

import ast as ast3
from typing import Optional, TypeVar, cast

import jaclang.compiler.unitree as uni
from jaclang.compiler import TOKEN_MAP
from jaclang.compiler.constant import DELIM_MAP
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass
from jaclang.compiler.unitree import Token


T = TypeVar("T", bound=ast3.AST)


class PytorchFixPass(UniPass):
    """Fix PyTorch specific issues in the AST."""

    def enter_node(self, node: uni.UniNode) -> None:
        """Enter node."""
        super().enter_node(node)

    def exit_node(self, node: uni.UniNode) -> None:
        """Exit node."""
        super().exit_node(node)

    def gen_token(
        self, node: uni.UniNode, name: Tok, value: Optional[str] = None
    ) -> Token:
        """Generate token."""
        value = (
            value
            if value
            else (
                DELIM_MAP[name]
                if name in DELIM_MAP
                else TOKEN_MAP[name.value] if name.value in TOKEN_MAP else name.value
            )
        )
        return Token(
            name=name,
            value=value,
            orig_src=node.loc.orig_src,
            col_start=node.loc.col_start,
            col_end=0,
            line=node.loc.first_line,
            end_line=node.loc.last_line,
            pos_start=0,
            pos_end=0,
        )

    def check_same_lhs(
        self, assign_a: uni.UniNode, assign_b: uni.UniNode
    ) -> Optional[uni.Name]:
        """Return the common LHS target if both are simple assignment with same target."""
        if not (
            isinstance(assign_a, uni.Assignment)
            and isinstance(assign_b, uni.Assignment)
        ):
            return None
        ta, tb = assign_a.target[0], assign_b.target[0]
        if not (isinstance(ta, uni.Name) and isinstance(tb, uni.Name)):
            return None
        if ta.value != tb.value:
            return None
        return ta  # common target

    def exit_if_stmt(self, node: uni.IfStmt) -> None:
        """Exit if statement."""
        a0 = node.body[0]
        b0 = node.else_body.body[0]

        if isinstance(a0, uni.Assignment) and isinstance(b0, uni.Assignment):
            lhs = self.check_same_lhs(a0, b0)
            func_name = uni.Name(
                orig_src=node.loc.orig_src,
                name=Tok.NAME,
                value="torch",
                line=0,
                end_line=0,
                col_start=0,
                col_end=0,
                pos_start=0,
                pos_end=0,
            )
            attr_name = uni.Name(
                orig_src=node.loc.orig_src,
                name=Tok.NAME,
                value="where",
                line=0,
                end_line=0,
                col_start=0,
                col_end=0,
                pos_start=0,
                pos_end=0,
            )
            target = uni.AtomTrailer(
                target=func_name,
                right=attr_name,
                is_attr=True,
                is_null_ok=False,
                kid=[func_name, attr_name],
            )
            call = uni.FuncCall(
                target=target,
                params=[
                    node.condition,
                    cast(uni.Expr, a0.value),
                    cast(uni.Expr, b0.value),
                ],
                genai_call=None,
                kid=[target, node.condition, a0, b0],
            )
            new_node = uni.Assignment(
                target=[lhs], value=call, type_tag=None, kid=[lhs, call]
            )
            node.parent.kid[node.parent.kid.index(node)] = new_node
            new_node.parent = node.parent

        elif isinstance(a0, uni.ReturnStmt) and isinstance(b0, uni.ReturnStmt):
            aexpr, bexpr = a0.expr, b0.expr
            if aexpr is None or bexpr is None:
                return
            func_name = uni.Name(
                orig_src=node.loc.orig_src,
                name=Tok.NAME,
                value="torch",
                line=0,
                end_line=0,
                col_start=0,
                col_end=0,
                pos_start=0,
                pos_end=0,
            )
            attr_name = uni.Name(
                orig_src=node.loc.orig_src,
                name=Tok.NAME,
                value="where",
                line=0,
                end_line=0,
                col_start=0,
                col_end=0,
                pos_start=0,
                pos_end=0,
            )
            target = uni.AtomTrailer(
                target=func_name,
                right=attr_name,
                is_attr=True,
                is_null_ok=False,
                kid=[func_name, attr_name],
            )
            call = uni.FuncCall(
                target=target,
                params=[node.condition, cast(uni.Expr, aexpr), cast(uni.Expr, bexpr)],
                genai_call=None,
                kid=[target, node.condition, a0, b0],
            )
            new_node = uni.ReturnStmt(expr=call, kid=[call])
            node.parent.kid[node.parent.kid.index(node)] = new_node
            new_node.parent = node.parent
