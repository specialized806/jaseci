"""Pytorch Fix Pass."""

import ast as ast3
from typing import TypeVar

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
