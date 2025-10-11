"""ECMAScript/JavaScript code generation from ESTree AST.

This module provides functionality to convert ESTree AST nodes back to
JavaScript source code (unparsing).
"""

from __future__ import annotations

from typing import Union

from jaclang.compiler.emcascript import estree as es


class JSCodeGenerator:
    """Generate JavaScript code from ESTree AST."""

    def __init__(self, indent: str = "  ") -> None:
        """Initialize the code generator."""
        self.indent_str = indent
        self.indent_level = 0

    def indent(self) -> str:
        """Get current indentation."""
        return self.indent_str * self.indent_level

    def generate(self, node: es.Node) -> str:
        """Generate JavaScript code for a node."""
        method_name = f"gen_{node.type}"
        method = getattr(self, method_name, None)
        if method:
            return method(node)
        else:
            return f"/* Unsupported node type: {node.type} */"

    # Program and Statements
    # ======================

    def gen_Program(self, node: es.Program) -> str:
        """Generate program."""
        return "\n".join(self.generate(stmt) for stmt in node.body)

    def gen_ExpressionStatement(self, node: es.ExpressionStatement) -> str:
        """Generate expression statement."""
        return f"{self.indent()}{self.generate(node.expression)};"

    def gen_BlockStatement(self, node: es.BlockStatement) -> str:
        """Generate block statement."""
        if not node.body:
            return "{}"
        self.indent_level += 1
        body = "\n".join(self.generate(stmt) for stmt in node.body)
        self.indent_level -= 1
        return f"{{\n{body}\n{self.indent()}}}"

    def gen_EmptyStatement(self, node: es.EmptyStatement) -> str:
        """Generate empty statement."""
        return f"{self.indent()};"

    def gen_ReturnStatement(self, node: es.ReturnStatement) -> str:
        """Generate return statement."""
        if node.argument:
            return f"{self.indent()}return {self.generate(node.argument)};"
        return f"{self.indent()}return;"

    def gen_IfStatement(self, node: es.IfStatement) -> str:
        """Generate if statement."""
        test = self.generate(node.test)
        consequent = self.generate(node.consequent)
        result = f"{self.indent()}if ({test}) {consequent}"
        if node.alternate:
            if isinstance(node.alternate, es.IfStatement):
                # else if
                result += f" else {self.generate(node.alternate).lstrip()}"
            else:
                result += f" else {self.generate(node.alternate)}"
        return result

    def gen_WhileStatement(self, node: es.WhileStatement) -> str:
        """Generate while statement."""
        test = self.generate(node.test)
        body = self.generate(node.body)
        return f"{self.indent()}while ({test}) {body}"

    def gen_DoWhileStatement(self, node: es.DoWhileStatement) -> str:
        """Generate do-while statement."""
        body = self.generate(node.body)
        test = self.generate(node.test)
        return f"{self.indent()}do {body} while ({test});"

    def gen_ForStatement(self, node: es.ForStatement) -> str:
        """Generate for statement."""
        init = self.generate(node.init) if node.init else ""
        test = self.generate(node.test) if node.test else ""
        update = self.generate(node.update) if node.update else ""
        body = self.generate(node.body)
        return f"{self.indent()}for ({init}; {test}; {update}) {body}"

    def gen_ForInStatement(self, node: es.ForInStatement) -> str:
        """Generate for-in statement."""
        left = self.generate(node.left)
        right = self.generate(node.right)
        body = self.generate(node.body)
        return f"{self.indent()}for ({left} in {right}) {body}"

    def gen_ForOfStatement(self, node: es.ForOfStatement) -> str:
        """Generate for-of statement."""
        await_str = "await " if node.await_ else ""
        left = self.generate(node.left)
        right = self.generate(node.right)
        body = self.generate(node.body)
        return f"{self.indent()}for {await_str}({left} of {right}) {body}"

    def gen_BreakStatement(self, node: es.BreakStatement) -> str:
        """Generate break statement."""
        if node.label:
            return f"{self.indent()}break {self.generate(node.label)};"
        return f"{self.indent()}break;"

    def gen_ContinueStatement(self, node: es.ContinueStatement) -> str:
        """Generate continue statement."""
        if node.label:
            return f"{self.indent()}continue {self.generate(node.label)};"
        return f"{self.indent()}continue;"

    def gen_ThrowStatement(self, node: es.ThrowStatement) -> str:
        """Generate throw statement."""
        return f"{self.indent()}throw {self.generate(node.argument)};"

    def gen_TryStatement(self, node: es.TryStatement) -> str:
        """Generate try statement."""
        result = f"{self.indent()}try {self.generate(node.block)}"
        if node.handler:
            result += f" {self.generate(node.handler)}"
        if node.finalizer:
            result += f" finally {self.generate(node.finalizer)}"
        return result

    def gen_CatchClause(self, node: es.CatchClause) -> str:
        """Generate catch clause."""
        if node.param:
            return f"catch ({self.generate(node.param)}) {self.generate(node.body)}"
        return f"catch {self.generate(node.body)}"

    def gen_SwitchStatement(self, node: es.SwitchStatement) -> str:
        """Generate switch statement."""
        discriminant = self.generate(node.discriminant)
        self.indent_level += 1
        cases = "\n".join(self.generate(case) for case in node.cases)
        self.indent_level -= 1
        return f"{self.indent()}switch ({discriminant}) {{\n{cases}\n{self.indent()}}}"

    def gen_SwitchCase(self, node: es.SwitchCase) -> str:
        """Generate switch case."""
        if node.test:
            result = f"{self.indent()}case {self.generate(node.test)}:\n"
        else:
            result = f"{self.indent()}default:\n"
        self.indent_level += 1
        for stmt in node.consequent:
            result += f"{self.generate(stmt)}\n"
        self.indent_level -= 1
        return result.rstrip()

    # Declarations
    # ============

    def gen_FunctionDeclaration(self, node: es.FunctionDeclaration) -> str:
        """Generate function declaration."""
        async_str = "async " if node.async_ else ""
        generator_str = "*" if node.generator else ""
        name = self.generate(node.id) if node.id else ""
        params = ", ".join(self.generate(p) for p in node.params)
        body = self.generate(node.body)
        return f"{self.indent()}{async_str}function{generator_str} {name}({params}) {body}"

    def gen_VariableDeclaration(self, node: es.VariableDeclaration) -> str:
        """Generate variable declaration."""
        declarators = ", ".join(self.generate(d) for d in node.declarations)
        return f"{self.indent()}{node.kind} {declarators};"

    def gen_VariableDeclarator(self, node: es.VariableDeclarator) -> str:
        """Generate variable declarator."""
        id_str = self.generate(node.id)
        if node.init:
            return f"{id_str} = {self.generate(node.init)}"
        return id_str

    def gen_ClassDeclaration(self, node: es.ClassDeclaration) -> str:
        """Generate class declaration."""
        name = self.generate(node.id) if node.id else ""
        extends = f" extends {self.generate(node.superClass)}" if node.superClass else ""
        body = self.generate(node.body)
        return f"{self.indent()}class {name}{extends} {body}"

    def gen_ClassExpression(self, node: es.ClassExpression) -> str:
        """Generate class expression."""
        name = self.generate(node.id) if node.id else ""
        extends = f" extends {self.generate(node.superClass)}" if node.superClass else ""
        body = self.generate(node.body)
        return f"class {name}{extends} {body}"

    def gen_ClassBody(self, node: es.ClassBody) -> str:
        """Generate class body."""
        if not node.body:
            return "{}"
        self.indent_level += 1
        methods = "\n".join(self.generate(m) for m in node.body)
        self.indent_level -= 1
        return f"{{\n{methods}\n{self.indent()}}}"

    def gen_MethodDefinition(self, node: es.MethodDefinition) -> str:
        """Generate method definition."""
        static_str = "static " if node.static else ""
        key = self.generate(node.key)
        value = self.generate(node.value)

        # Extract function parts
        if isinstance(node.value, es.FunctionExpression):
            async_str = "async " if node.value.async_ else ""
            params = ", ".join(self.generate(p) for p in node.value.params)
            body = self.generate(node.value.body)

            if node.kind == "constructor":
                return f"{self.indent()}constructor({params}) {body}"
            elif node.kind == "get":
                return f"{self.indent()}{static_str}get {key}() {body}"
            elif node.kind == "set":
                return f"{self.indent()}{static_str}set {key}({params}) {body}"
            else:
                return f"{self.indent()}{static_str}{async_str}{key}({params}) {body}"

        return f"{self.indent()}{static_str}{key}{value}"

    # Expressions
    # ===========

    def gen_Identifier(self, node: es.Identifier) -> str:
        """Generate identifier."""
        return node.name

    def gen_Literal(self, node: es.Literal) -> str:
        """Generate literal."""
        if node.raw:
            return node.raw
        if isinstance(node.value, str):
            return f'"{node.value}"'
        elif node.value is None:
            return "null"
        elif isinstance(node.value, bool):
            return "true" if node.value else "false"
        else:
            return str(node.value)

    def gen_ThisExpression(self, node: es.ThisExpression) -> str:
        """Generate this expression."""
        return "this"

    def gen_ArrayExpression(self, node: es.ArrayExpression) -> str:
        """Generate array expression."""
        elements = ", ".join(
            self.generate(e) if e else "" for e in node.elements
        )
        return f"[{elements}]"

    def gen_ObjectExpression(self, node: es.ObjectExpression) -> str:
        """Generate object expression."""
        if not node.properties:
            return "{}"
        props = ", ".join(self.generate(p) for p in node.properties)
        return f"{{{props}}}"

    def gen_Property(self, node: es.Property) -> str:
        """Generate property."""
        key = self.generate(node.key)
        value = self.generate(node.value)

        if node.shorthand:
            return key
        elif node.computed:
            return f"[{key}]: {value}"
        elif node.kind == "get":
            return f"get {key}() {value}"
        elif node.kind == "set":
            return f"set {key}({value})"
        else:
            return f"{key}: {value}"

    def gen_FunctionExpression(self, node: es.FunctionExpression) -> str:
        """Generate function expression."""
        async_str = "async " if node.async_ else ""
        generator_str = "*" if node.generator else ""
        name = self.generate(node.id) if node.id else ""
        params = ", ".join(self.generate(p) for p in node.params)
        body = self.generate(node.body)
        return f"{async_str}function{generator_str} {name}({params}) {body}".strip()

    def gen_ArrowFunctionExpression(self, node: es.ArrowFunctionExpression) -> str:
        """Generate arrow function expression."""
        async_str = "async " if node.async_ else ""
        params = ", ".join(self.generate(p) for p in node.params)
        if len(node.params) == 1:
            params = self.generate(node.params[0])
        else:
            params = f"({params})"

        if node.expression:
            body = self.generate(node.body)
            return f"{async_str}{params} => {body}"
        else:
            body = self.generate(node.body)
            return f"{async_str}{params} => {body}"

    def gen_UnaryExpression(self, node: es.UnaryExpression) -> str:
        """Generate unary expression."""
        arg = self.generate(node.argument)
        if node.prefix:
            if node.operator in ("typeof", "void", "delete"):
                return f"{node.operator} {arg}"
            return f"{node.operator}{arg}"
        else:
            return f"{arg}{node.operator}"

    def gen_UpdateExpression(self, node: es.UpdateExpression) -> str:
        """Generate update expression."""
        arg = self.generate(node.argument)
        if node.prefix:
            return f"{node.operator}{arg}"
        else:
            return f"{arg}{node.operator}"

    def gen_BinaryExpression(self, node: es.BinaryExpression) -> str:
        """Generate binary expression."""
        left = self.generate(node.left)
        right = self.generate(node.right)
        return f"{left} {node.operator} {right}"

    def gen_LogicalExpression(self, node: es.LogicalExpression) -> str:
        """Generate logical expression."""
        left = self.generate(node.left)
        right = self.generate(node.right)
        return f"{left} {node.operator} {right}"

    def gen_AssignmentExpression(self, node: es.AssignmentExpression) -> str:
        """Generate assignment expression."""
        left = self.generate(node.left)
        right = self.generate(node.right)
        return f"{left} {node.operator} {right}"

    def gen_MemberExpression(self, node: es.MemberExpression) -> str:
        """Generate member expression."""
        obj = self.generate(node.object)
        optional = "?." if node.optional else ""
        if node.computed:
            prop = self.generate(node.property)
            return f"{obj}{optional}[{prop}]"
        else:
            prop = self.generate(node.property)
            if optional:
                return f"{obj}{optional}{prop}"
            return f"{obj}.{prop}"

    def gen_ConditionalExpression(self, node: es.ConditionalExpression) -> str:
        """Generate conditional expression."""
        test = self.generate(node.test)
        consequent = self.generate(node.consequent)
        alternate = self.generate(node.alternate)
        return f"{test} ? {consequent} : {alternate}"

    def gen_CallExpression(self, node: es.CallExpression) -> str:
        """Generate call expression."""
        callee = self.generate(node.callee)
        optional = "?." if node.optional else ""
        args = ", ".join(self.generate(arg) for arg in node.arguments)
        return f"{callee}{optional}({args})"

    def gen_NewExpression(self, node: es.NewExpression) -> str:
        """Generate new expression."""
        callee = self.generate(node.callee)
        args = ", ".join(self.generate(arg) for arg in node.arguments)
        return f"new {callee}({args})"

    def gen_SequenceExpression(self, node: es.SequenceExpression) -> str:
        """Generate sequence expression."""
        exprs = ", ".join(self.generate(e) for e in node.expressions)
        return f"({exprs})"

    def gen_YieldExpression(self, node: es.YieldExpression) -> str:
        """Generate yield expression."""
        delegate = "*" if node.delegate else ""
        if node.argument:
            return f"yield{delegate} {self.generate(node.argument)}"
        return f"yield{delegate}"

    def gen_AwaitExpression(self, node: es.AwaitExpression) -> str:
        """Generate await expression."""
        return f"await {self.generate(node.argument)}"

    def gen_SpreadElement(self, node: es.SpreadElement) -> str:
        """Generate spread element."""
        return f"...{self.generate(node.argument)}"

    def gen_Super(self, node: es.Super) -> str:
        """Generate super."""
        return "super"

    # Patterns
    # ========

    def gen_ArrayPattern(self, node: es.ArrayPattern) -> str:
        """Generate array pattern."""
        elements = ", ".join(
            self.generate(e) if e else "" for e in node.elements
        )
        return f"[{elements}]"

    def gen_ObjectPattern(self, node: es.ObjectPattern) -> str:
        """Generate object pattern."""
        props = ", ".join(self.generate(p) for p in node.properties)
        return f"{{{props}}}"

    def gen_AssignmentPattern(self, node: es.AssignmentPattern) -> str:
        """Generate assignment pattern."""
        left = self.generate(node.left)
        right = self.generate(node.right)
        return f"{left} = {right}"

    def gen_RestElement(self, node: es.RestElement) -> str:
        """Generate rest element."""
        return f"...{self.generate(node.argument)}"

    # Modules
    # =======

    def gen_ImportDeclaration(self, node: es.ImportDeclaration) -> str:
        """Generate import declaration."""
        specs = ", ".join(self.generate(s) for s in node.specifiers)
        source = self.generate(node.source)
        return f"{self.indent()}import {specs} from {source};"

    def gen_ImportSpecifier(self, node: es.ImportSpecifier) -> str:
        """Generate import specifier."""
        imported = self.generate(node.imported)
        local = self.generate(node.local)
        if imported != local:
            return f"{imported} as {local}"
        return imported

    def gen_ImportDefaultSpecifier(self, node: es.ImportDefaultSpecifier) -> str:
        """Generate import default specifier."""
        return self.generate(node.local)

    def gen_ImportNamespaceSpecifier(self, node: es.ImportNamespaceSpecifier) -> str:
        """Generate import namespace specifier."""
        return f"* as {self.generate(node.local)}"

    def gen_ExportNamedDeclaration(self, node: es.ExportNamedDeclaration) -> str:
        """Generate export named declaration."""
        if node.declaration:
            return f"{self.indent()}export {self.generate(node.declaration).lstrip()}"
        specs = ", ".join(self.generate(s) for s in node.specifiers)
        if node.source:
            source = self.generate(node.source)
            return f"{self.indent()}export {{{specs}}} from {source};"
        return f"{self.indent()}export {{{specs}}};"

    def gen_ExportSpecifier(self, node: es.ExportSpecifier) -> str:
        """Generate export specifier."""
        local = self.generate(node.local)
        exported = self.generate(node.exported)
        if local != exported:
            return f"{local} as {exported}"
        return local

    def gen_ExportDefaultDeclaration(self, node: es.ExportDefaultDeclaration) -> str:
        """Generate export default declaration."""
        return f"{self.indent()}export default {self.generate(node.declaration)};"

    def gen_ExportAllDeclaration(self, node: es.ExportAllDeclaration) -> str:
        """Generate export all declaration."""
        source = self.generate(node.source)
        if node.exported:
            exported = self.generate(node.exported)
            return f"{self.indent()}export * as {exported} from {source};"
        return f"{self.indent()}export * from {source};"


def es_to_js(node: es.Node, indent: str = "  ") -> str:
    """Convert an ESTree node to JavaScript code."""
    generator = JSCodeGenerator(indent=indent)
    return generator.generate(node)
