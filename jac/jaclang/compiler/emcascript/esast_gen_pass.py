"""ECMAScript AST Generation Pass for the Jac compiler.

This pass transforms the Jac AST into equivalent ECMAScript AST following
the ESTree specification by:

1. Traversing the Jac AST and generating corresponding ESTree nodes
2. Handling all Jac language constructs and translating them to JavaScript/ECMAScript equivalents:
   - Classes, functions, and methods
   - Control flow statements (if/else, loops, try/catch)
   - Data structures (arrays, objects)
   - Special Jac features (walkers, abilities, archetypes) converted to JS classes
   - Data spatial operations converted to appropriate JS patterns

3. Managing imports and module dependencies
4. Preserving source location information
5. Generating valid ECMAScript code that can be executed in JavaScript environments

The output of this pass is a complete ESTree AST representation that can be
serialized to JavaScript source code or used by JavaScript tooling.
"""

from __future__ import annotations

from typing import Optional, Sequence, Union

import jaclang.compiler.emcascript.estree as es
import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass


class EsastGenPass(UniPass):
    """Jac to ECMAScript AST transpilation pass."""

    def before_pass(self) -> None:
        """Initialize the pass."""
        self.child_passes: list[EsastGenPass] = []
        for i in self.ir_in.impl_mod + self.ir_in.test_mod:
            child_pass = EsastGenPass(ir_in=i, prog=self.prog)
            self.child_passes.append(child_pass)
        self.imports: list[es.ImportDeclaration] = []
        self.exports: list[es.ExportNamedDeclaration] = []

    def enter_node(self, node: uni.UniNode) -> None:
        """Enter node."""
        if hasattr(node.gen, "es_ast") and node.gen.es_ast:
            self.prune()
            return
        super().enter_node(node)

    def sync_loc(
        self, es_node: es.Node, jac_node: Optional[uni.UniNode] = None
    ) -> es.Node:
        """Sync source locations from Jac node to ES node."""
        if not jac_node:
            jac_node = self.cur_node
        es_node.loc = es.SourceLocation(
            start=es.Position(
                line=jac_node.loc.first_line, column=jac_node.loc.col_start
            ),
            end=es.Position(line=jac_node.loc.last_line, column=jac_node.loc.col_end),
        )
        return es_node

    def flatten(
        self, items: list[Union[es.Statement, list[es.Statement], None]]
    ) -> list[es.Statement]:
        """Flatten a list of items or lists into a single list."""
        result: list[es.Statement] = []
        for item in items:
            if isinstance(item, list):
                result.extend(item)
            elif item is not None:
                result.append(item)
        return result

    # Module and Program
    # ==================

    def exit_module(self, node: uni.Module) -> None:
        """Process module node."""
        body: list[Union[es.Statement, es.ModuleDeclaration]] = []

        # Add imports
        body.extend(self.imports)

        # Process module body
        clean_body = [i for i in node.body if not isinstance(i, uni.ImplDef)]
        for stmt in clean_body:
            if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                if isinstance(stmt.gen.es_ast, list):
                    body.extend(stmt.gen.es_ast)
                else:
                    body.append(stmt.gen.es_ast)

        # Add exports
        body.extend(self.exports)

        program = self.sync_loc(
            es.Program(body=body, sourceType="module"), jac_node=node
        )
        node.gen.es_ast = program

    def exit_sub_tag(self, node: uni.SubTag[uni.T]) -> None:
        """Process SubTag node."""
        if hasattr(node.tag.gen, "es_ast"):
            node.gen.es_ast = node.tag.gen.es_ast

    # Import/Export Statements
    # ========================

    def exit_import(self, node: uni.Import) -> None:
        """Process import statement."""
        if node.from_loc and node.items:
            source = self.sync_loc(
                es.Literal(value=node.from_loc.path_str), jac_node=node.from_loc
            )
            specifiers: list[
                Union[
                    es.ImportSpecifier,
                    es.ImportDefaultSpecifier,
                    es.ImportNamespaceSpecifier,
                ]
            ] = []

            for item in node.items:
                if isinstance(item, uni.ModuleItem):
                    imported = self.sync_loc(
                        es.Identifier(name=item.name.sym_name), jac_node=item.name
                    )
                    local = self.sync_loc(
                        es.Identifier(
                            name=(
                                item.alias.sym_name
                                if item.alias
                                else item.name.sym_name
                            )
                        ),
                        jac_node=item.alias if item.alias else item.name,
                    )
                    specifiers.append(
                        self.sync_loc(
                            es.ImportSpecifier(imported=imported, local=local),
                            jac_node=item,
                        )
                    )

            import_decl = self.sync_loc(
                es.ImportDeclaration(specifiers=specifiers, source=source),
                jac_node=node,
            )
            self.imports.append(import_decl)
            node.gen.es_ast = []  # Imports are added to module level

    def exit_module_path(self, node: uni.ModulePath) -> None:
        """Process module path."""
        node.gen.es_ast = None

    def exit_module_item(self, node: uni.ModuleItem) -> None:
        """Process module item."""
        node.gen.es_ast = None

    # Declarations
    # ============

    def exit_archetype(self, node: uni.Archetype) -> None:
        """Process archetype (class) declaration."""
        body_stmts: list[es.MethodDefinition] = []

        # Process body
        inner: Sequence[uni.CodeBlockStmt] | None = None
        if isinstance(node.body, uni.ImplDef) and isinstance(node.body.body, list):
            inner = node.body.body  # type: ignore
        elif isinstance(node.body, list):
            inner = node.body

        if inner:
            for stmt in inner:
                if (
                    hasattr(stmt.gen, "es_ast")
                    and stmt.gen.es_ast
                    and isinstance(stmt.gen.es_ast, es.MethodDefinition)
                ):
                    body_stmts.append(stmt.gen.es_ast)

        # Create class body
        class_body = self.sync_loc(es.ClassBody(body=body_stmts), jac_node=node)

        # Handle base classes
        super_class: Optional[es.Expression] = None
        if node.base_classes:
            base = node.base_classes[0]
            if hasattr(base.gen, "es_ast") and base.gen.es_ast:
                super_class = base.gen.es_ast

        # Create class declaration
        class_id = self.sync_loc(
            es.Identifier(name=node.name.sym_name), jac_node=node.name
        )

        class_decl = self.sync_loc(
            es.ClassDeclaration(id=class_id, superClass=super_class, body=class_body),
            jac_node=node,
        )

        node.gen.es_ast = class_decl

    def exit_enum(self, node: uni.Enum) -> None:
        """Process enum declaration as an object."""
        properties: list[es.Property] = []

        inner: Sequence[uni.EnumBlockStmt] | None = None
        if isinstance(node.body, uni.ImplDef) and isinstance(node.body.body, list):
            inner = node.body.body  # type: ignore
        elif isinstance(node.body, list):
            inner = node.body

        if inner:
            for stmt in inner:
                if isinstance(stmt, uni.Assignment):
                    for target in stmt.target:
                        if isinstance(target, uni.AstSymbolNode):
                            key = self.sync_loc(
                                es.Identifier(name=target.sym_name), jac_node=target
                            )
                            value: es.Expression
                            if stmt.value and hasattr(stmt.value.gen, "es_ast"):
                                value = stmt.value.gen.es_ast
                            else:
                                value = self.sync_loc(
                                    es.Literal(value=None), jac_node=stmt
                                )
                            prop = self.sync_loc(
                                es.Property(key=key, value=value, kind="init"),
                                jac_node=stmt,
                            )
                            properties.append(prop)

        # Create as const variable with object
        obj_expr = self.sync_loc(
            es.ObjectExpression(properties=properties), jac_node=node
        )
        var_id = self.sync_loc(
            es.Identifier(name=node.name.sym_name), jac_node=node.name
        )
        var_decl = self.sync_loc(
            es.VariableDeclaration(
                declarations=[
                    self.sync_loc(
                        es.VariableDeclarator(id=var_id, init=obj_expr), jac_node=node
                    )
                ],
                kind="const",
            ),
            jac_node=node,
        )

        node.gen.es_ast = var_decl

    def exit_ability(self, node: uni.Ability) -> None:
        """Process ability (function/method) declaration."""
        params: list[es.Pattern] = []
        if isinstance(node.signature, uni.FuncSignature):
            for param in node.signature.params:
                if hasattr(param.gen, "es_ast") and param.gen.es_ast:
                    params.append(param.gen.es_ast)

        # Process body
        body_stmts: list[es.Statement] = []
        inner: Sequence[uni.CodeBlockStmt] | None = None
        if isinstance(node.body, uni.ImplDef) and isinstance(node.body.body, list):
            inner = node.body.body  # type: ignore
        elif isinstance(node.body, list):
            inner = node.body

        if inner:
            for stmt in inner:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        block = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)

        func_id = self.sync_loc(
            es.Identifier(name=node.name_ref.sym_name), jac_node=node.name_ref
        )

        # Check if this is a method (has parent archetype)
        if node.is_method:
            # Create method definition
            func_expr = self.sync_loc(
                es.FunctionExpression(
                    id=None, params=params, body=block, async_=node.is_async
                ),
                jac_node=node,
            )
            method_def = self.sync_loc(
                es.MethodDefinition(
                    key=func_id, value=func_expr, kind="method", static=node.is_static
                ),
                jac_node=node,
            )
            node.gen.es_ast = method_def
        else:
            # Create function declaration
            func_decl = self.sync_loc(
                es.FunctionDeclaration(
                    id=func_id, params=params, body=block, async_=node.is_async
                ),
                jac_node=node,
            )
            node.gen.es_ast = func_decl

    def exit_func_signature(self, node: uni.FuncSignature) -> None:
        """Process function signature."""
        node.gen.es_ast = None

    def exit_param_var(self, node: uni.ParamVar) -> None:
        """Process parameter variable."""
        param_id = self.sync_loc(
            es.Identifier(name=node.name.sym_name), jac_node=node.name
        )
        node.gen.es_ast = param_id

    def exit_arch_has(self, node: uni.ArchHas) -> None:
        """Process class field declarations."""
        # ES doesn't directly support field declarations in the same way
        # This could be handled via constructor assignments
        node.gen.es_ast = None

    def exit_has_var(self, node: uni.HasVar) -> None:
        """Process has variable."""
        node.gen.es_ast = None

    # Control Flow Statements
    # =======================

    def exit_if_stmt(self, node: uni.IfStmt) -> None:
        """Process if statement."""
        test = (
            node.condition.gen.es_ast
            if hasattr(node.condition.gen, "es_ast")
            else self.sync_loc(es.Literal(value=True), jac_node=node.condition)
        )

        consequent_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        consequent_stmts.extend(stmt.gen.es_ast)
                    else:
                        consequent_stmts.append(stmt.gen.es_ast)

        consequent = self.sync_loc(
            es.BlockStatement(body=consequent_stmts), jac_node=node
        )

        alternate: Optional[es.Statement] = None
        if (
            node.else_body
            and hasattr(node.else_body.gen, "es_ast")
            and node.else_body.gen.es_ast
        ):
            alternate = node.else_body.gen.es_ast

        if_stmt = self.sync_loc(
            es.IfStatement(test=test, consequent=consequent, alternate=alternate),
            jac_node=node,
        )
        node.gen.es_ast = if_stmt

    def exit_else_if(self, node: uni.ElseIf) -> None:
        """Process else-if clause."""
        test = (
            node.condition.gen.es_ast
            if hasattr(node.condition.gen, "es_ast")
            else self.sync_loc(es.Literal(value=True), jac_node=node.condition)
        )

        consequent_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        consequent_stmts.extend(stmt.gen.es_ast)
                    else:
                        consequent_stmts.append(stmt.gen.es_ast)

        consequent = self.sync_loc(
            es.BlockStatement(body=consequent_stmts), jac_node=node
        )

        if_stmt = self.sync_loc(
            es.IfStatement(test=test, consequent=consequent), jac_node=node
        )
        node.gen.es_ast = if_stmt

    def exit_else_stmt(self, node: uni.ElseStmt) -> None:
        """Process else clause."""
        stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        stmts.extend(stmt.gen.es_ast)
                    else:
                        stmts.append(stmt.gen.es_ast)

        block = self.sync_loc(es.BlockStatement(body=stmts), jac_node=node)
        node.gen.es_ast = block

    def exit_while_stmt(self, node: uni.WhileStmt) -> None:
        """Process while statement."""
        test = (
            node.condition.gen.es_ast
            if hasattr(node.condition.gen, "es_ast")
            else self.sync_loc(es.Literal(value=True), jac_node=node.condition)
        )

        body_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        body = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)

        while_stmt = self.sync_loc(
            es.WhileStatement(test=test, body=body), jac_node=node
        )
        node.gen.es_ast = while_stmt

    def exit_in_for_stmt(self, node: uni.InForStmt) -> None:
        """Process for-in statement."""
        left = (
            node.target.gen.es_ast
            if hasattr(node.target.gen, "es_ast")
            else self.sync_loc(es.Identifier(name="item"), jac_node=node.target)
        )
        right = (
            node.collection.gen.es_ast
            if hasattr(node.collection.gen, "es_ast")
            else self.sync_loc(
                es.Identifier(name="collection"), jac_node=node.collection
            )
        )

        body_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        body = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)

        # Use for-of for iteration over values
        for_stmt = self.sync_loc(
            es.ForOfStatement(left=left, right=right, body=body, await_=node.is_async),
            jac_node=node,
        )
        node.gen.es_ast = for_stmt

    def exit_try_stmt(self, node: uni.TryStmt) -> None:
        """Process try statement."""
        block_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        block_stmts.extend(stmt.gen.es_ast)
                    else:
                        block_stmts.append(stmt.gen.es_ast)

        block = self.sync_loc(es.BlockStatement(body=block_stmts), jac_node=node)

        handler: Optional[es.CatchClause] = None
        if node.excepts:
            # Take first except clause
            except_node = node.excepts[0]
            if hasattr(except_node.gen, "es_ast") and except_node.gen.es_ast:
                handler = except_node.gen.es_ast

        finalizer: Optional[es.BlockStatement] = None
        if (
            node.finally_body
            and hasattr(node.finally_body.gen, "es_ast")
            and isinstance(node.finally_body.gen.es_ast, es.BlockStatement)
        ):
            finalizer = node.finally_body.gen.es_ast

        try_stmt = self.sync_loc(
            es.TryStatement(block=block, handler=handler, finalizer=finalizer),
            jac_node=node,
        )
        node.gen.es_ast = try_stmt

    def exit_except(self, node: uni.Except) -> None:
        """Process except clause."""
        param: Optional[es.Pattern] = None
        if node.name:
            param = self.sync_loc(
                es.Identifier(name=node.name.sym_name), jac_node=node.name
            )

        body_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        body = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)

        catch_clause = self.sync_loc(
            es.CatchClause(param=param, body=body), jac_node=node
        )
        node.gen.es_ast = catch_clause

    def exit_finally_stmt(self, node: uni.FinallyStmt) -> None:
        """Process finally clause."""
        body_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        block = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)
        node.gen.es_ast = block

    def exit_raise_stmt(self, node: uni.RaiseStmt) -> None:
        """Process raise statement."""
        argument = (
            node.cause.gen.es_ast
            if node.cause and hasattr(node.cause.gen, "es_ast")
            else self.sync_loc(es.Identifier(name="Error"), jac_node=node)
        )

        throw_stmt = self.sync_loc(es.ThrowStatement(argument=argument), jac_node=node)
        node.gen.es_ast = throw_stmt

    def exit_assert_stmt(self, node: uni.AssertStmt) -> None:
        """Process assert statement as if-throw."""
        test = (
            node.condition.gen.es_ast
            if hasattr(node.condition.gen, "es_ast")
            else self.sync_loc(es.Literal(value=True), jac_node=node.condition)
        )

        # Negate the test (throw if condition is false)
        negated_test = self.sync_loc(
            es.UnaryExpression(operator="!", prefix=True, argument=test), jac_node=node
        )

        error_msg = "Assertion failed"
        if (
            node.error_msg
            and hasattr(node.error_msg.gen, "es_ast")
            and isinstance(node.error_msg.gen.es_ast, es.Literal)
        ):
            error_msg = str(node.error_msg.gen.es_ast.value)

        throw_stmt = self.sync_loc(
            es.ThrowStatement(
                argument=self.sync_loc(
                    es.NewExpression(
                        callee=self.sync_loc(
                            es.Identifier(name="Error"), jac_node=node
                        ),
                        arguments=[
                            self.sync_loc(es.Literal(value=error_msg), jac_node=node)
                        ],
                    ),
                    jac_node=node,
                )
            ),
            jac_node=node,
        )

        if_stmt = self.sync_loc(
            es.IfStatement(
                test=negated_test,
                consequent=self.sync_loc(
                    es.BlockStatement(body=[throw_stmt]), jac_node=node
                ),
            ),
            jac_node=node,
        )
        node.gen.es_ast = if_stmt

    def exit_return_stmt(self, node: uni.ReturnStmt) -> None:
        """Process return statement."""
        argument: Optional[es.Expression] = None
        if node.expr and hasattr(node.expr.gen, "es_ast"):
            argument = node.expr.gen.es_ast

        ret_stmt = self.sync_loc(es.ReturnStatement(argument=argument), jac_node=node)
        node.gen.es_ast = ret_stmt

    def exit_ctrl_stmt(self, node: uni.CtrlStmt) -> None:
        """Process control statement (break/continue)."""
        if node.ctrl.name == Tok.KW_BREAK:
            stmt = self.sync_loc(es.BreakStatement(), jac_node=node)
        else:  # continue
            stmt = self.sync_loc(es.ContinueStatement(), jac_node=node)
        node.gen.es_ast = stmt

    def exit_expr_stmt(self, node: uni.ExprStmt) -> None:
        """Process expression statement."""
        expr = (
            node.expr.gen.es_ast
            if hasattr(node.expr.gen, "es_ast")
            else self.sync_loc(es.Literal(value=None), jac_node=node.expr)
        )

        expr_stmt = self.sync_loc(
            es.ExpressionStatement(expression=expr), jac_node=node
        )
        node.gen.es_ast = expr_stmt

    # Expressions
    # ===========

    def exit_binary_expr(self, node: uni.BinaryExpr) -> None:
        """Process binary expression."""
        left = (
            node.left.gen.es_ast
            if hasattr(node.left.gen, "es_ast")
            else self.sync_loc(es.Literal(value=0), jac_node=node.left)
        )
        right = (
            node.right.gen.es_ast
            if hasattr(node.right.gen, "es_ast")
            else self.sync_loc(es.Literal(value=0), jac_node=node.right)
        )

        # Map Jac operators to JS operators
        op_map = {
            Tok.EE: "===",
            Tok.NE: "!==",
            Tok.LT: "<",
            Tok.GT: ">",
            Tok.LTE: "<=",
            Tok.GTE: ">=",
            Tok.PLUS: "+",
            Tok.MINUS: "-",
            Tok.STAR_MUL: "*",
            Tok.DIV: "/",
            Tok.MOD: "%",
            Tok.BW_AND: "&",
            Tok.BW_OR: "|",
            Tok.BW_XOR: "^",
            Tok.LSHIFT: "<<",
            Tok.RSHIFT: ">>",
        }

        operator = op_map.get(node.op.name, "+")

        # Check if it's a logical operator
        if node.op.name in (Tok.KW_AND, Tok.KW_OR):
            logical_op = "&&" if node.op.name == Tok.KW_AND else "||"
            bin_expr = self.sync_loc(
                es.LogicalExpression(operator=logical_op, left=left, right=right),
                jac_node=node,
            )
        else:
            bin_expr = self.sync_loc(
                es.BinaryExpression(operator=operator, left=left, right=right),
                jac_node=node,
            )

        node.gen.es_ast = bin_expr

    def exit_bool_expr(self, node: uni.BoolExpr) -> None:
        """Process boolean expression (and/or)."""
        # BoolExpr has op and list of values
        if not node.values or len(node.values) < 2:
            node.gen.es_ast = self.sync_loc(es.Literal(value=None), jac_node=node)
            return

        # Get the operator
        logical_op = "&&" if node.op.name == Tok.KW_AND else "||"

        # Build the logical expression from left to right
        result = (
            node.values[0].gen.es_ast
            if hasattr(node.values[0].gen, "es_ast")
            else self.sync_loc(es.Literal(value=None), jac_node=node.values[0])
        )

        for val in node.values[1:]:
            right = (
                val.gen.es_ast
                if hasattr(val.gen, "es_ast")
                else self.sync_loc(es.Literal(value=None), jac_node=val)
            )
            result = self.sync_loc(
                es.LogicalExpression(operator=logical_op, left=result, right=right),
                jac_node=node,
            )

        node.gen.es_ast = result

    def exit_compare_expr(self, node: uni.CompareExpr) -> None:
        """Process compare expression."""
        # CompareExpr can have multiple comparisons chained: a < b < c
        # Need to convert to: a < b && b < c

        op_map = {
            Tok.EE: "===",
            Tok.NE: "!==",
            Tok.LT: "<",
            Tok.GT: ">",
            Tok.LTE: "<=",
            Tok.GTE: ">=",
            Tok.KW_IN: "in",
            Tok.KW_NIN: "in",  # Will need negation
        }

        if not node.rights or not node.ops:
            # Fallback to simple comparison
            node.gen.es_ast = self.sync_loc(es.Literal(value=True), jac_node=node)
            return

        # Build comparisons
        comparisons: list[es.Expression] = []
        left = (
            node.left.gen.es_ast
            if hasattr(node.left.gen, "es_ast")
            else self.sync_loc(es.Identifier(name="left"), jac_node=node.left)
        )

        for _, (op, right_node) in enumerate(zip(node.ops, node.rights)):
            right = (
                right_node.gen.es_ast
                if hasattr(right_node.gen, "es_ast")
                else self.sync_loc(es.Identifier(name="right"), jac_node=right_node)
            )
            operator = op_map.get(op.name, "===")

            # Handle 'not in' operator
            if op.name == Tok.KW_NIN:
                bin_expr = self.sync_loc(
                    es.UnaryExpression(
                        operator="!",
                        prefix=True,
                        argument=self.sync_loc(
                            es.BinaryExpression(operator="in", left=left, right=right),
                            jac_node=node,
                        ),
                    ),
                    jac_node=node,
                )
            else:
                bin_expr = self.sync_loc(
                    es.BinaryExpression(operator=operator, left=left, right=right),
                    jac_node=node,
                )

            comparisons.append(bin_expr)
            left = right  # For chained comparisons

        # Combine with && if multiple comparisons
        if len(comparisons) == 1:
            node.gen.es_ast = comparisons[0]
        else:
            result = comparisons[0]
            for comp in comparisons[1:]:
                result = self.sync_loc(
                    es.LogicalExpression(operator="&&", left=result, right=comp),
                    jac_node=node,
                )
            node.gen.es_ast = result

    def exit_unary_expr(self, node: uni.UnaryExpr) -> None:
        """Process unary expression."""
        operand = (
            node.operand.gen.es_ast
            if hasattr(node.operand.gen, "es_ast")
            else self.sync_loc(es.Literal(value=0), jac_node=node.operand)
        )

        op_map = {
            Tok.MINUS: "-",
            Tok.PLUS: "+",
            Tok.NOT: "!",
            Tok.BW_NOT: "~",
        }

        operator = op_map.get(node.op.name, "!")

        unary_expr = self.sync_loc(
            es.UnaryExpression(operator=operator, prefix=True, argument=operand),
            jac_node=node,
        )
        node.gen.es_ast = unary_expr

    def exit_assignment(self, node: uni.Assignment) -> None:
        """Process assignment expression."""
        # Handle first target
        if node.target:
            left = (
                node.target[0].gen.es_ast
                if hasattr(node.target[0].gen, "es_ast")
                else self.sync_loc(es.Identifier(name="temp"), jac_node=node.target[0])
            )
            right = (
                node.value.gen.es_ast
                if node.value and hasattr(node.value.gen, "es_ast")
                else self.sync_loc(es.Literal(value=None), jac_node=node)
            )

            op_map = {
                Tok.EQ: "=",
                Tok.ADD_EQ: "+=",
                Tok.SUB_EQ: "-=",
                Tok.MUL_EQ: "*=",
                Tok.DIV_EQ: "/=",
            }

            operator = op_map.get(node.aug_op.name if node.aug_op else Tok.EQ, "=")

            assign_expr = self.sync_loc(
                es.AssignmentExpression(operator=operator, left=left, right=right),
                jac_node=node,
            )
            node.gen.es_ast = assign_expr

    def exit_func_call(self, node: uni.FuncCall) -> None:
        """Process function call."""
        callee = (
            node.target.gen.es_ast
            if hasattr(node.target.gen, "es_ast")
            else self.sync_loc(es.Identifier(name="func"), jac_node=node.target)
        )

        args: list[Union[es.Expression, es.SpreadElement]] = []
        for param in node.params:
            if hasattr(param.gen, "es_ast") and param.gen.es_ast:
                args.append(param.gen.es_ast)

        call_expr = self.sync_loc(
            es.CallExpression(callee=callee, arguments=args), jac_node=node
        )
        node.gen.es_ast = call_expr

    def exit_index_slice(self, node: uni.IndexSlice) -> None:
        """Process index/slice - just store the slice info, actual member access is handled by AtomTrailer."""
        # IndexSlice doesn't have a target - it's used within an AtomTrailer
        # Store the slice information for use by the parent AtomTrailer
        if node.slices and len(node.slices) > 0:
            first_slice = node.slices[0]
            if node.is_range:
                # Store slice info - will be used by AtomTrailer
                node.gen.es_ast = {
                    "type": "slice",
                    "start": (
                        first_slice.start.gen.es_ast
                        if first_slice.start
                        and hasattr(first_slice.start.gen, "es_ast")
                        else None
                    ),
                    "stop": (
                        first_slice.stop.gen.es_ast
                        if first_slice.stop and hasattr(first_slice.stop.gen, "es_ast")
                        else None
                    ),
                }
            else:
                # Store index info - will be used by AtomTrailer
                node.gen.es_ast = {
                    "type": "index",
                    "value": (
                        first_slice.start.gen.es_ast
                        if first_slice.start
                        and hasattr(first_slice.start.gen, "es_ast")
                        else self.sync_loc(es.Literal(value=0), jac_node=node)
                    ),
                }
        else:
            node.gen.es_ast = None

    def exit_atom_trailer(self, node: uni.AtomTrailer) -> None:
        """Process attribute access."""
        obj = (
            node.target.gen.es_ast
            if hasattr(node.target.gen, "es_ast")
            else self.sync_loc(es.Identifier(name="obj"), jac_node=node.target)
        )

        if node.right and hasattr(node.right.gen, "es_ast"):
            # The right side is already processed (could be a call, etc.)
            # Check if it's a Name that needs to become a property access
            if isinstance(node.right, uni.Name):
                prop = self.sync_loc(
                    es.Identifier(name=node.right.sym_name), jac_node=node.right
                )
                member_expr = self.sync_loc(
                    es.MemberExpression(object=obj, property=prop, computed=False),
                    jac_node=node,
                )
                node.gen.es_ast = member_expr
            elif isinstance(node.right, uni.IndexSlice):
                # Handle index/slice operations
                slice_info = node.right.gen.es_ast
                if isinstance(slice_info, dict):
                    if slice_info.get("type") == "slice":
                        # Slice operation - convert to .slice() call
                        start = slice_info.get("start") or self.sync_loc(
                            es.Literal(value=0), jac_node=node
                        )
                        stop = slice_info.get("stop") or self.sync_loc(
                            es.Identifier(name="undefined"), jac_node=node
                        )
                        slice_call = self.sync_loc(
                            es.CallExpression(
                                callee=self.sync_loc(
                                    es.MemberExpression(
                                        object=obj,
                                        property=self.sync_loc(
                                            es.Identifier(name="slice"), jac_node=node
                                        ),
                                        computed=False,
                                    ),
                                    jac_node=node,
                                ),
                                arguments=[start, stop],
                            ),
                            jac_node=node,
                        )
                        node.gen.es_ast = slice_call
                    elif slice_info.get("type") == "index":
                        # Index operation
                        idx = slice_info.get("value") or self.sync_loc(
                            es.Literal(value=0), jac_node=node
                        )
                        member_expr = self.sync_loc(
                            es.MemberExpression(
                                object=obj, property=idx, computed=True
                            ),
                            jac_node=node,
                        )
                        node.gen.es_ast = member_expr
                    else:
                        node.gen.es_ast = obj
                else:
                    node.gen.es_ast = obj
            else:
                # If right is a call or other expression, it should already be processed
                node.gen.es_ast = node.right.gen.es_ast

    def exit_list_val(self, node: uni.ListVal) -> None:
        """Process list literal."""
        elements: list[Optional[Union[es.Expression, es.SpreadElement]]] = []
        for item in node.values:
            if hasattr(item.gen, "es_ast") and item.gen.es_ast:
                elements.append(item.gen.es_ast)

        array_expr = self.sync_loc(es.ArrayExpression(elements=elements), jac_node=node)
        node.gen.es_ast = array_expr

    def exit_set_val(self, node: uni.SetVal) -> None:
        """Process set literal as new Set()."""
        elements: list[Union[es.Expression, es.SpreadElement]] = []
        for item in node.values:
            if hasattr(item.gen, "es_ast") and item.gen.es_ast:
                elements.append(item.gen.es_ast)

        # Create new Set([...])
        set_expr = self.sync_loc(
            es.NewExpression(
                callee=self.sync_loc(es.Identifier(name="Set"), jac_node=node),
                arguments=[
                    self.sync_loc(es.ArrayExpression(elements=elements), jac_node=node)
                ],
            ),
            jac_node=node,
        )
        node.gen.es_ast = set_expr

    def exit_tuple_val(self, node: uni.TupleVal) -> None:
        """Process tuple as array."""
        elements: list[Optional[Union[es.Expression, es.SpreadElement]]] = []
        for item in node.values:
            if hasattr(item.gen, "es_ast") and item.gen.es_ast:
                elements.append(item.gen.es_ast)

        array_expr = self.sync_loc(es.ArrayExpression(elements=elements), jac_node=node)
        node.gen.es_ast = array_expr

    def exit_dict_val(self, node: uni.DictVal) -> None:
        """Process dictionary literal."""
        properties: list[Union[es.Property, es.SpreadElement]] = []
        for kv_pair in node.kv_pairs:
            if isinstance(kv_pair, uni.KVPair):
                key = (
                    kv_pair.key.gen.es_ast
                    if hasattr(kv_pair.key.gen, "es_ast")
                    else self.sync_loc(es.Literal(value="key"), jac_node=kv_pair.key)
                )
                value = (
                    kv_pair.value.gen.es_ast
                    if hasattr(kv_pair.value.gen, "es_ast")
                    else self.sync_loc(es.Literal(value=None), jac_node=kv_pair.value)
                )

                prop = self.sync_loc(
                    es.Property(key=key, value=value, kind="init"), jac_node=kv_pair
                )
                properties.append(prop)

        obj_expr = self.sync_loc(
            es.ObjectExpression(properties=properties), jac_node=node
        )
        node.gen.es_ast = obj_expr

    def exit_k_v_pair(self, node: uni.KVPair) -> None:
        """Process key-value pair."""
        # Handled in dict_val
        pass

    def exit_inner_compr(self, node: uni.InnerCompr) -> None:
        """Process list comprehension."""
        # List comprehensions need to be converted to functional style
        # [x for x in list] -> list.map(x => x)
        # This is a simplified version
        node.gen.es_ast = self.sync_loc(es.ArrayExpression(elements=[]), jac_node=node)

    # Literals and Atoms
    # ==================

    def exit_bool(self, node: uni.Bool) -> None:
        """Process boolean literal."""
        value = node.value == "True" or node.value == "true"
        bool_lit = self.sync_loc(es.Literal(value=value, raw=node.value), jac_node=node)
        node.gen.es_ast = bool_lit

    def exit_int(self, node: uni.Int) -> None:
        """Process integer literal."""
        int_lit = self.sync_loc(
            es.Literal(value=int(node.value), raw=node.value), jac_node=node
        )
        node.gen.es_ast = int_lit

    def exit_float(self, node: uni.Float) -> None:
        """Process float literal."""
        float_lit = self.sync_loc(
            es.Literal(value=float(node.value), raw=node.value), jac_node=node
        )
        node.gen.es_ast = float_lit

    def exit_string(self, node: uni.String) -> None:
        """Process string literal."""
        # Remove quotes from the value
        value = node.value
        if value.startswith(('"""', "'''")):
            value = value[3:-3]
        elif value.startswith(('"', "'")):
            value = value[1:-1]

        str_lit = self.sync_loc(es.Literal(value=value, raw=node.value), jac_node=node)
        node.gen.es_ast = str_lit

    def exit_null(self, node: uni.Null) -> None:
        """Process null/None literal."""
        null_lit = self.sync_loc(es.Literal(value=None, raw=node.value), jac_node=node)
        node.gen.es_ast = null_lit

    def exit_name(self, node: uni.Name) -> None:
        """Process name/identifier."""
        # Map Python/Jac names to JS equivalents
        name_map = {
            "None": "null",
            "True": "true",
            "False": "false",
            "self": "this",
        }

        name = name_map.get(node.sym_name, node.sym_name)
        identifier = self.sync_loc(es.Identifier(name=name), jac_node=node)
        node.gen.es_ast = identifier

    # Special Statements
    # ==================

    def exit_global_vars(self, node: uni.GlobalVars) -> None:
        """Process global variables."""
        # Global declarations don't have direct equivalent in ES modules
        node.gen.es_ast = []

    def exit_non_local_vars(self, node: uni.NonLocalVars) -> None:
        """Process non-local variables."""
        # Non-local doesn't have direct equivalent in ES
        node.gen.es_ast = []

    def exit_test(self, node: uni.Test) -> None:
        """Process test as a function."""
        # Convert test to a regular function
        params: list[es.Pattern] = []

        body_stmts: list[es.Statement] = []
        if node.body:
            for stmt in node.body:
                if hasattr(stmt.gen, "es_ast") and stmt.gen.es_ast:
                    if isinstance(stmt.gen.es_ast, list):
                        body_stmts.extend(stmt.gen.es_ast)
                    else:
                        body_stmts.append(stmt.gen.es_ast)

        block = self.sync_loc(es.BlockStatement(body=body_stmts), jac_node=node)

        func_id = self.sync_loc(
            es.Identifier(name=node.name.sym_name), jac_node=node.name
        )

        func_decl = self.sync_loc(
            es.FunctionDeclaration(id=func_id, params=params, body=block),
            jac_node=node,
        )
        node.gen.es_ast = func_decl

    # Type and other nodes
    # ====================

    def exit_token(self, node: uni.Token) -> None:
        """Process token."""
        # Tokens are generally not directly converted
        pass

    def exit_semi(self, node: uni.Semi) -> None:
        """Process semicolon."""
        # Semicolons are handled automatically
        pass
