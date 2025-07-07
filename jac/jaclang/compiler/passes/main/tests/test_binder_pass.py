"""Test Binder pass."""

from jaclang.compiler.program import JacProgram
from jaclang.compiler.passes.main import BinderPass
from jaclang.utils.test import TestCase


class BinderPassTests(TestCase):
    """Test pass module."""

    def setUp(self) -> None:
        """Set up test."""
        return super().setUp()

    def test_glob_sym_build(self) -> None:
        """Basic test for pass."""
        mod_targ = JacProgram().build(
            self.fixture_abs_path("app.jac")
        )
        print(mod_targ.sym_pp())
        # self.assertGreater(len(state.warnings_had), 0)
        # self.assertIn("MyObject", str(state.warnings_had[0]))
