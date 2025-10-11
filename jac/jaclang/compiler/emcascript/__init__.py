"""ECMAScript/JavaScript AST generation for Jac.

This package provides ECMAScript AST generation capabilities following the ESTree
specification, allowing Jac code to be transpiled to JavaScript/ECMAScript.
"""

from jaclang.compiler.emcascript.esast_gen_pass import EsastGenPass
from jaclang.compiler.emcascript.estree import (
    Program,
    Statement,
    Expression,
    Declaration,
    Pattern,
    es_node_to_dict,
)

__all__ = [
    "EsastGenPass",
    "Program",
    "Statement",
    "Expression",
    "Declaration",
    "Pattern",
    "es_node_to_dict",
]
