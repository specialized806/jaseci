"""Test ast build pass module."""

import ast as ast3
import io
import os
import sys

from jaclang.cli import cli
from jaclang.compiler.program import JacProgram
from jaclang.utils.test import TestCase
from jaclang.settings import settings
from jaclang.compiler.passes.main import PreDynamoPass

class PreDynamoPassTests(TestCase):
    """Test pass module."""

    TargetPass = PreDynamoPass

    def setUp(self) -> None:
        """Set up test."""
        return super().setUp()
    
    def test_torch_where(self) -> None:
        """Test torch.where transformation."""
        captured_output = io.StringIO()
        sys.stdout = captured_output
        os.environ["JAC_PREDYNAMO_PASS"] = "True"
        settings.load_env_vars()
        code_gen = (JacProgram()).compile(
            self.fixture_abs_path("predynamo_torch_where.jac"),
        )
        os.environ["JAC_PREDYNAMO_PASS"] = "false"
        settings.load_env_vars()
        