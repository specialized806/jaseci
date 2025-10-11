"""ESTree AST Node Definitions for ECMAScript.

This module provides a complete implementation of the ESTree specification,
which defines the standard AST format for JavaScript and ECMAScript.

The ESTree specification represents ECMAScript programs as abstract syntax trees
that are language-agnostic and can be used for various tools like parsers,
transpilers, and code analysis tools.

Reference: https://github.com/estree/estree
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal, Optional, Sequence, Union


# Base Node Types
# ================


@dataclass
class SourceLocation:
    """Source location information for a node."""

    source: Optional[str] = None
    start: Optional["Position"] = None
    end: Optional["Position"] = None


@dataclass
class Position:
    """Position in source code."""

    line: int = 0
    column: int = 0


@dataclass
class Node:
    """Base class for all ESTree nodes."""

    type: str
    loc: Optional[SourceLocation] = field(default=None)


# Identifier and Literals
# =======================


@dataclass
class Identifier(Node):
    """Identifier node."""

    name: str = ""
    type: Literal["Identifier"] = field(default="Identifier", init=False)


@dataclass
class Literal(Node):
    """Literal value node."""

    value: Union[str, bool, None, int, float] = None
    raw: Optional[str] = None
    type: Literal["Literal"] = field(default="Literal", init=False)


@dataclass
class RegExpLiteral(Literal):
    """Regular expression literal."""

    regex: dict[str, str] = field(default_factory=dict)  # {pattern: str, flags: str}
    type: Literal["Literal"] = field(default="Literal", init=False)


# Program and Statements
# ======================


@dataclass
class Program(Node):
    """Root node of an ESTree."""

    body: list[Union["Statement", "ModuleDeclaration"]] = field(default_factory=list)
    sourceType: Literal["script", "module"] = "script"
    type: Literal["Program"] = field(default="Program", init=False)


@dataclass
class ExpressionStatement(Node):
    """Expression statement."""

    expression: Optional["Expression"] = None
    type: Literal["ExpressionStatement"] = field(
        default="ExpressionStatement", init=False
    )


@dataclass
class BlockStatement(Node):
    """Block statement."""

    body: list["Statement"] = field(default_factory=list)
    type: Literal["BlockStatement"] = field(default="BlockStatement", init=False)


@dataclass
class EmptyStatement(Node):
    """Empty statement (;)."""

    type: Literal["EmptyStatement"] = field(default="EmptyStatement", init=False)


@dataclass
class DebuggerStatement(Node):
    """Debugger statement."""

    type: Literal["DebuggerStatement"] = field(default="DebuggerStatement", init=False)


@dataclass
class WithStatement(Node):
    """With statement."""

    object: Optional["Expression"] = None
    body: Optional["Statement"] = None
    type: Literal["WithStatement"] = field(default="WithStatement", init=False)


@dataclass
class ReturnStatement(Node):
    """Return statement."""

    argument: Optional["Expression"] = None
    type: Literal["ReturnStatement"] = field(default="ReturnStatement", init=False)


@dataclass
class LabeledStatement(Node):
    """Labeled statement."""

    label: Optional[Identifier] = None
    body: Optional["Statement"] = None
    type: Literal["LabeledStatement"] = field(default="LabeledStatement", init=False)


@dataclass
class BreakStatement(Node):
    """Break statement."""

    label: Optional[Identifier] = None
    type: Literal["BreakStatement"] = field(default="BreakStatement", init=False)


@dataclass
class ContinueStatement(Node):
    """Continue statement."""

    label: Optional[Identifier] = None
    type: Literal["ContinueStatement"] = field(default="ContinueStatement", init=False)


@dataclass
class IfStatement(Node):
    """If statement."""

    test: Optional["Expression"] = None
    consequent: Optional["Statement"] = None
    alternate: Optional["Statement"] = None
    type: Literal["IfStatement"] = field(default="IfStatement", init=False)


@dataclass
class SwitchStatement(Node):
    """Switch statement."""

    discriminant: Optional["Expression"] = None
    cases: list["SwitchCase"] = field(default_factory=list)
    type: Literal["SwitchStatement"] = field(default="SwitchStatement", init=False)


@dataclass
class SwitchCase(Node):
    """Switch case clause."""

    test: Optional["Expression"] = None  # null for default case
    consequent: list["Statement"] = field(default_factory=list)
    type: Literal["SwitchCase"] = field(default="SwitchCase", init=False)


@dataclass
class ThrowStatement(Node):
    """Throw statement."""

    argument: Optional["Expression"] = None
    type: Literal["ThrowStatement"] = field(default="ThrowStatement", init=False)


@dataclass
class TryStatement(Node):
    """Try statement."""

    block: Optional[BlockStatement] = None
    handler: Optional["CatchClause"] = None
    finalizer: Optional[BlockStatement] = None
    type: Literal["TryStatement"] = field(default="TryStatement", init=False)


@dataclass
class CatchClause(Node):
    """Catch clause."""

    param: Optional["Pattern"] = None
    body: Optional[BlockStatement] = None
    type: Literal["CatchClause"] = field(default="CatchClause", init=False)


@dataclass
class WhileStatement(Node):
    """While statement."""

    test: Optional["Expression"] = None
    body: Optional["Statement"] = None
    type: Literal["WhileStatement"] = field(default="WhileStatement", init=False)


@dataclass
class DoWhileStatement(Node):
    """Do-while statement."""

    body: Optional["Statement"] = None
    test: Optional["Expression"] = None
    type: Literal["DoWhileStatement"] = field(default="DoWhileStatement", init=False)


@dataclass
class ForStatement(Node):
    """For statement."""

    init: Optional[Union["VariableDeclaration", "Expression"]] = None
    test: Optional["Expression"] = None
    update: Optional["Expression"] = None
    body: Optional["Statement"] = None
    type: Literal["ForStatement"] = field(default="ForStatement", init=False)


@dataclass
class ForInStatement(Node):
    """For-in statement."""

    left: Optional[Union["VariableDeclaration", "Pattern"]] = None
    right: Optional["Expression"] = None
    body: Optional["Statement"] = None
    type: Literal["ForInStatement"] = field(default="ForInStatement", init=False)


@dataclass
class ForOfStatement(Node):
    """For-of statement (ES6)."""

    left: Optional[Union["VariableDeclaration", "Pattern"]] = None
    right: Optional["Expression"] = None
    body: Optional["Statement"] = None
    await_: bool = False
    type: Literal["ForOfStatement"] = field(default="ForOfStatement", init=False)


# Declarations
# ============


@dataclass
class FunctionDeclaration(Node):
    """Function declaration."""

    id: Optional[Identifier] = None
    params: list["Pattern"] = field(default_factory=list)
    body: Optional[BlockStatement] = None
    generator: bool = False
    async_: bool = False
    type: Literal["FunctionDeclaration"] = field(
        default="FunctionDeclaration", init=False
    )


@dataclass
class VariableDeclaration(Node):
    """Variable declaration."""

    declarations: list["VariableDeclarator"] = field(default_factory=list)
    kind: Literal["var", "let", "const"] = "var"
    type: Literal["VariableDeclaration"] = field(
        default="VariableDeclaration", init=False
    )


@dataclass
class VariableDeclarator(Node):
    """Variable declarator."""

    id: Optional["Pattern"] = None
    init: Optional["Expression"] = None
    type: Literal["VariableDeclarator"] = field(
        default="VariableDeclarator", init=False
    )


# Expressions
# ===========


@dataclass
class ThisExpression(Node):
    """This expression."""

    type: Literal["ThisExpression"] = field(default="ThisExpression", init=False)


@dataclass
class ArrayExpression(Node):
    """Array expression."""

    elements: list[Optional[Union["Expression", "SpreadElement"]]] = field(
        default_factory=list
    )
    type: Literal["ArrayExpression"] = field(default="ArrayExpression", init=False)


@dataclass
class ObjectExpression(Node):
    """Object expression."""

    properties: list[Union["Property", "SpreadElement"]] = field(default_factory=list)
    type: Literal["ObjectExpression"] = field(default="ObjectExpression", init=False)


@dataclass
class Property(Node):
    """Object property."""

    key: Optional[Union["Expression", Identifier, Literal]] = None
    value: Optional["Expression"] = None
    kind: Literal["init", "get", "set"] = "init"
    method: bool = False
    shorthand: bool = False
    computed: bool = False
    type: Literal["Property"] = field(default="Property", init=False)


@dataclass
class FunctionExpression(Node):
    """Function expression."""

    id: Optional[Identifier] = None
    params: list["Pattern"] = field(default_factory=list)
    body: Optional[BlockStatement] = None
    generator: bool = False
    async_: bool = False
    type: Literal["FunctionExpression"] = field(
        default="FunctionExpression", init=False
    )


@dataclass
class ArrowFunctionExpression(Node):
    """Arrow function expression (ES6)."""

    params: list["Pattern"] = field(default_factory=list)
    body: Optional[Union[BlockStatement, "Expression"]] = None
    expression: bool = False
    async_: bool = False
    type: Literal["ArrowFunctionExpression"] = field(
        default="ArrowFunctionExpression", init=False
    )


@dataclass
class UnaryExpression(Node):
    """Unary expression."""

    operator: str = ""  # "-", "+", "!", "~", "typeof", "void", "delete"
    prefix: bool = True
    argument: Optional["Expression"] = None
    type: Literal["UnaryExpression"] = field(default="UnaryExpression", init=False)


@dataclass
class UpdateExpression(Node):
    """Update expression."""

    operator: Literal["++", "--"] = "++"
    argument: Optional["Expression"] = None
    prefix: bool = True
    type: Literal["UpdateExpression"] = field(default="UpdateExpression", init=False)


@dataclass
class BinaryExpression(Node):
    """Binary expression."""

    operator: str = (
        ""  # "==", "!=", "===", "!==", "<", "<=", ">", ">=", "<<", ">>", ">>>", "+", "-", "*", "/", "%", "|", "^", "&", "in", "instanceof"
    )
    left: Optional["Expression"] = None
    right: Optional["Expression"] = None
    type: Literal["BinaryExpression"] = field(default="BinaryExpression", init=False)


@dataclass
class AssignmentExpression(Node):
    """Assignment expression."""

    operator: str = (
        "="  # "=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "|=", "^=", "&="
    )
    left: Optional[Union["Pattern", "Expression"]] = None
    right: Optional["Expression"] = None
    type: Literal["AssignmentExpression"] = field(
        default="AssignmentExpression", init=False
    )


@dataclass
class LogicalExpression(Node):
    """Logical expression."""

    operator: Literal["||", "&&", "??"] = "&&"
    left: Optional["Expression"] = None
    right: Optional["Expression"] = None
    type: Literal["LogicalExpression"] = field(default="LogicalExpression", init=False)


@dataclass
class MemberExpression(Node):
    """Member expression."""

    object: Optional[Union["Expression", "Super"]] = None
    property: Optional["Expression"] = None
    computed: bool = False
    optional: bool = False
    type: Literal["MemberExpression"] = field(default="MemberExpression", init=False)


@dataclass
class ConditionalExpression(Node):
    """Conditional (ternary) expression."""

    test: Optional["Expression"] = None
    consequent: Optional["Expression"] = None
    alternate: Optional["Expression"] = None
    type: Literal["ConditionalExpression"] = field(
        default="ConditionalExpression", init=False
    )


@dataclass
class CallExpression(Node):
    """Call expression."""

    callee: Optional[Union["Expression", "Super"]] = None
    arguments: list[Union["Expression", "SpreadElement"]] = field(default_factory=list)
    optional: bool = False
    type: Literal["CallExpression"] = field(default="CallExpression", init=False)


@dataclass
class NewExpression(Node):
    """New expression."""

    callee: Optional["Expression"] = None
    arguments: list[Union["Expression", "SpreadElement"]] = field(default_factory=list)
    type: Literal["NewExpression"] = field(default="NewExpression", init=False)


@dataclass
class SequenceExpression(Node):
    """Sequence expression."""

    expressions: list["Expression"] = field(default_factory=list)
    type: Literal["SequenceExpression"] = field(
        default="SequenceExpression", init=False
    )


@dataclass
class YieldExpression(Node):
    """Yield expression."""

    argument: Optional["Expression"] = None
    delegate: bool = False
    type: Literal["YieldExpression"] = field(default="YieldExpression", init=False)


@dataclass
class AwaitExpression(Node):
    """Await expression (ES2017)."""

    argument: Optional["Expression"] = None
    type: Literal["AwaitExpression"] = field(default="AwaitExpression", init=False)


@dataclass
class TemplateLiteral(Node):
    """Template literal (ES6)."""

    quasis: list["TemplateElement"] = field(default_factory=list)
    expressions: list["Expression"] = field(default_factory=list)
    type: Literal["TemplateLiteral"] = field(default="TemplateLiteral", init=False)


@dataclass
class TemplateElement(Node):
    """Template element."""

    tail: bool = False
    value: dict[str, str] = field(default_factory=dict)  # {cooked: str, raw: str}
    type: Literal["TemplateElement"] = field(default="TemplateElement", init=False)


@dataclass
class TaggedTemplateExpression(Node):
    """Tagged template expression (ES6)."""

    tag: Optional["Expression"] = None
    quasi: Optional[TemplateLiteral] = None
    type: Literal["TaggedTemplateExpression"] = field(
        default="TaggedTemplateExpression", init=False
    )


@dataclass
class SpreadElement(Node):
    """Spread element (ES6)."""

    argument: Optional["Expression"] = None
    type: Literal["SpreadElement"] = field(default="SpreadElement", init=False)


@dataclass
class Super(Node):
    """Super keyword."""

    type: Literal["Super"] = field(default="Super", init=False)


@dataclass
class MetaProperty(Node):
    """Meta property (e.g., new.target)."""

    meta: Optional[Identifier] = None
    property: Optional[Identifier] = None
    type: Literal["MetaProperty"] = field(default="MetaProperty", init=False)


# Patterns (ES6)
# ==============


@dataclass
class AssignmentPattern(Node):
    """Assignment pattern (default parameters)."""

    left: Optional["Pattern"] = None
    right: Optional["Expression"] = None
    type: Literal["AssignmentPattern"] = field(default="AssignmentPattern", init=False)


@dataclass
class ArrayPattern(Node):
    """Array destructuring pattern."""

    elements: list[Optional["Pattern"]] = field(default_factory=list)
    type: Literal["ArrayPattern"] = field(default="ArrayPattern", init=False)


@dataclass
class ObjectPattern(Node):
    """Object destructuring pattern."""

    properties: list[Union["AssignmentProperty", "RestElement"]] = field(
        default_factory=list
    )
    type: Literal["ObjectPattern"] = field(default="ObjectPattern", init=False)


@dataclass
class AssignmentProperty(Property):
    """Assignment property in object pattern."""

    value: Optional["Pattern"] = None
    type: Literal["Property"] = field(default="Property", init=False)


@dataclass
class RestElement(Node):
    """Rest element."""

    argument: Optional["Pattern"] = None
    type: Literal["RestElement"] = field(default="RestElement", init=False)


# Classes (ES6)
# =============


@dataclass
class ClassDeclaration(Node):
    """Class declaration."""

    id: Optional[Identifier] = None
    superClass: Optional["Expression"] = None
    body: Optional["ClassBody"] = None
    type: Literal["ClassDeclaration"] = field(default="ClassDeclaration", init=False)


@dataclass
class ClassExpression(Node):
    """Class expression."""

    id: Optional[Identifier] = None
    superClass: Optional["Expression"] = None
    body: Optional["ClassBody"] = None
    type: Literal["ClassExpression"] = field(default="ClassExpression", init=False)


@dataclass
class ClassBody(Node):
    """Class body."""

    body: list["MethodDefinition"] = field(default_factory=list)
    type: Literal["ClassBody"] = field(default="ClassBody", init=False)


@dataclass
class MethodDefinition(Node):
    """Method definition."""

    key: Optional[Union["Expression", Identifier]] = None
    value: Optional[FunctionExpression] = None
    kind: Literal["constructor", "method", "get", "set"] = "method"
    computed: bool = False
    static: bool = False
    type: Literal["MethodDefinition"] = field(default="MethodDefinition", init=False)


# Modules (ES6)
# =============


@dataclass
class ImportDeclaration(Node):
    """Import declaration."""

    specifiers: list[
        Union["ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"]
    ] = field(default_factory=list)
    source: Optional[Literal] = None
    type: Literal["ImportDeclaration"] = field(default="ImportDeclaration", init=False)


@dataclass
class ImportSpecifier(Node):
    """Import specifier."""

    imported: Optional[Identifier] = None
    local: Optional[Identifier] = None
    type: Literal["ImportSpecifier"] = field(default="ImportSpecifier", init=False)


@dataclass
class ImportDefaultSpecifier(Node):
    """Import default specifier."""

    local: Optional[Identifier] = None
    type: Literal["ImportDefaultSpecifier"] = field(
        default="ImportDefaultSpecifier", init=False
    )


@dataclass
class ImportNamespaceSpecifier(Node):
    """Import namespace specifier."""

    local: Optional[Identifier] = None
    type: Literal["ImportNamespaceSpecifier"] = field(
        default="ImportNamespaceSpecifier", init=False
    )


@dataclass
class ExportNamedDeclaration(Node):
    """Export named declaration."""

    declaration: Optional[Union["Declaration", "Expression"]] = None
    specifiers: list["ExportSpecifier"] = field(default_factory=list)
    source: Optional[Literal] = None
    type: Literal["ExportNamedDeclaration"] = field(
        default="ExportNamedDeclaration", init=False
    )


@dataclass
class ExportSpecifier(Node):
    """Export specifier."""

    exported: Optional[Identifier] = None
    local: Optional[Identifier] = None
    type: Literal["ExportSpecifier"] = field(default="ExportSpecifier", init=False)


@dataclass
class ExportDefaultDeclaration(Node):
    """Export default declaration."""

    declaration: Optional[Union["Declaration", "Expression"]] = None
    type: Literal["ExportDefaultDeclaration"] = field(
        default="ExportDefaultDeclaration", init=False
    )


@dataclass
class ExportAllDeclaration(Node):
    """Export all declaration."""

    source: Optional[Literal] = None
    exported: Optional[Identifier] = None
    type: Literal["ExportAllDeclaration"] = field(
        default="ExportAllDeclaration", init=False
    )


# Type Aliases for Union Types
# ============================

Statement = Union[
    ExpressionStatement,
    BlockStatement,
    EmptyStatement,
    DebuggerStatement,
    WithStatement,
    ReturnStatement,
    LabeledStatement,
    BreakStatement,
    ContinueStatement,
    IfStatement,
    SwitchStatement,
    ThrowStatement,
    TryStatement,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    ForInStatement,
    ForOfStatement,
    FunctionDeclaration,
    VariableDeclaration,
    ClassDeclaration,
]

Expression = Union[
    Identifier,
    Literal,
    ThisExpression,
    ArrayExpression,
    ObjectExpression,
    FunctionExpression,
    ArrowFunctionExpression,
    UnaryExpression,
    UpdateExpression,
    BinaryExpression,
    AssignmentExpression,
    LogicalExpression,
    MemberExpression,
    ConditionalExpression,
    CallExpression,
    NewExpression,
    SequenceExpression,
    YieldExpression,
    AwaitExpression,
    TemplateLiteral,
    TaggedTemplateExpression,
    ClassExpression,
]

Pattern = Union[
    Identifier,
    ArrayPattern,
    ObjectPattern,
    AssignmentPattern,
    RestElement,
]

Declaration = Union[
    FunctionDeclaration,
    VariableDeclaration,
    ClassDeclaration,
]

ModuleDeclaration = Union[
    ImportDeclaration,
    ExportNamedDeclaration,
    ExportDefaultDeclaration,
    ExportAllDeclaration,
]


# Utility Functions
# =================


def es_node_to_dict(node: Node) -> dict[str, Any]:
    """Convert an ESTree node to a dictionary representation."""
    result: dict[str, Any] = {"type": node.type}

    for key, value in node.__dict__.items():
        if key in ("type", "loc") or value is None:
            continue
        if isinstance(value, Node):
            result[key] = es_node_to_dict(value)
        elif isinstance(value, list):
            result[key] = [
                es_node_to_dict(item) if isinstance(item, Node) else item
                for item in value
            ]
        else:
            result[key] = value

    if node.loc:
        result["loc"] = {
            "source": node.loc.source,
            "start": (
                {"line": node.loc.start.line, "column": node.loc.start.column}
                if node.loc.start
                else None
            ),
            "end": (
                {"line": node.loc.end.line, "column": node.loc.end.column}
                if node.loc.end
                else None
            ),
        }

    return result
