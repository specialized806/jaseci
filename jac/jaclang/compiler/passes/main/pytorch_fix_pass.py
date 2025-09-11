"""Pytorch Fix Pass."""

import ast as ast3
from typing import TypeVar, Optional

import jaclang.compiler.unitree as uni
from jaclang.compiler.passes import UniPass


T = TypeVar("T", bound=ast3.AST)


class PytorchFixPass(UniPass):
    """Fix PyTorch specific issues in the AST."""

    def enter_node(self, node: uni.UniNode) -> None:
        """Enter node."""
        # print("Entering node:", type(node).__name__)
        super().enter_node(node)

    def exit_node(self, node: uni.UniNode) -> None:
        """Exit node."""
        # print("Exiting node:", type(node).__name__)
        super().exit_node(node)

    def check_same_lhs(self, stmt_a: ast3.stmt, stmt_b: ast3.stmt) -> Optional[ast3.AST]:
        """Return the common LHS target if both are simple `x = <expr>` with same target."""
        if not (isinstance(stmt_a, ast3.Assign) and isinstance(stmt_b, ast3.Assign)):
            return None
        if len(stmt_a.targets) != 1 or len(stmt_b.targets) != 1:
            return None
        ta, tb = stmt_a.targets[0], stmt_b.targets[0]
        if ast3.dump(ta) != ast3.dump(tb):
            return None
        return ta  # common target

    def exit_if_stmt(self, node: uni.IfStmt) -> None:
        """Exit if statement."""
        print("Exiting IfStmt:\n", ast3.unparse(node.gen.py_ast[0]))
        if len(node.body) != 1  or (not isinstance(node.else_body, uni.ElseStmt)):
            return None
        b0, e0 = node.body[0].gen.py_ast[0], node.else_body.gen.py_ast[0]
        cond = node.condition

        # Case A: assignment to same LHS
        lhs = self.check_same_lhs(b0, e0)
        if lhs and isinstance(b0.value, ast3.AST) and isinstance(e0.value, ast3.AST):
            aexpr, bexpr = b0.value, e0.value
            call = ast3.Call(func=ast3.Attribute(value=ast3.Name(id="torch", ctx=ast3.Load()),
                                                attr="where", ctx=ast3.Load()),
                            args=[cond, aexpr, bexpr],
                            keywords=[])
            node.gen.py_ast = [ast3.Assign(targets=[lhs], value=call)]
            print("Transformed If to torch.where assignment", ast3.unparse(node.gen.py_ast[0]))

        # Case B: if/else both return
        if isinstance(b0, ast3.Return) and isinstance(e0, ast3.Return):
            aexpr, bexpr = b0.value, e0.value
            if aexpr is None or bexpr is None:
                return None
            call = ast3.Call(func=ast3.Attribute(value=ast3.Name(id="torch", ctx=ast3.Load()),
                                                attr="where", ctx=ast3.Load()),
                            args=[cond, aexpr, bexpr],
                            keywords=[])
            node.gen.py_ast = [ast3.Return(value=call)]
            # print("Transformed If to torch.where return", node.gen.py_ast)
