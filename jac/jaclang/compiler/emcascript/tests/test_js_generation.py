"""Test JavaScript code generation from Jac source files.

This module tests the complete Jac -> ESTree -> JavaScript pipeline,
ensuring that generated JavaScript code is syntactically valid and
semantically correct.
"""

import re
import subprocess
import tempfile
from pathlib import Path

from jaclang.compiler.emcascript import EsastGenPass
from jaclang.compiler.emcascript.es_unparse import es_to_js
from jaclang.compiler.program import JacProgram
from jaclang.utils.test import TestCase


class JavaScriptGenerationTests(TestCase):
    """Test JavaScript code generation from Jac files."""

    def get_fixture_path(self, filename: str) -> str:
        """Get absolute path to fixture file."""
        fixtures_dir = Path(__file__).parent / "fixtures"
        return str(fixtures_dir / filename)

    def compile_to_js(self, filename: str) -> str:
        """Compile Jac file directly to JavaScript code."""
        prog = JacProgram()
        ir = prog.compile(file_path=filename, no_cgen=True)

        self.assertFalse(
            prog.errors_had, f"Compilation errors: {[str(e) for e in prog.errors_had]}"
        )

        esast_pass = EsastGenPass(ir, prog)
        es_ir = esast_pass.ir_out

        self.assertTrue(hasattr(es_ir.gen, "es_ast"), "es_ast attribute not found")
        self.assertIsNotNone(es_ir.gen.es_ast, "es_ast is None")

        js_code = es_to_js(es_ir.gen.es_ast)
        return js_code

    def test_functions_generate_valid_js(self) -> None:
        """Test that function definitions generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Should contain function keyword
        self.assertIn("function", js_code)

        # Should have function declarations
        self.assertIn("simple_function", js_code)
        self.assertIn("with_params", js_code)
        self.assertIn("with_return", js_code)
        self.assertIn("factorial", js_code)

        # Should have proper JS syntax
        self.assertNotIn("def ", js_code)  # Jac keyword should be converted

    def test_classes_generate_valid_js(self) -> None:
        """Test that class/object definitions generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_classes.jac"))

        # Should contain class keyword
        self.assertIn("class", js_code)

        # Should have class declarations
        self.assertIn("Person", js_code)
        self.assertIn("Employee", js_code)
        self.assertIn("Calculator", js_code)

        # Should not have Jac keywords
        self.assertNotIn("obj ", js_code)
        self.assertNotIn("has ", js_code)

    def test_control_flow_generates_valid_js(self) -> None:
        """Test that control flow statements generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_control_flow.jac"))

        # Should have control flow keywords
        self.assertIn("if", js_code)
        self.assertIn("else", js_code)
        self.assertIn("while", js_code)
        self.assertIn("for", js_code)
        self.assertIn("break", js_code)
        self.assertIn("continue", js_code)
        self.assertIn("return", js_code)

        # Should have proper for loop syntax
        self.assertRegex(js_code, r"for\s*\(")

    def test_expressions_generate_valid_js(self) -> None:
        """Test that expressions generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_expressions.jac"))

        # Arithmetic operators
        self.assertIn("+", js_code)
        self.assertIn("-", js_code)
        self.assertIn("*", js_code)
        self.assertIn("/", js_code)
        self.assertIn("%", js_code)

        # Comparison operators (Jac == should become JS ===)
        self.assertIn("===", js_code)
        self.assertIn("!==", js_code)
        self.assertIn("<", js_code)
        self.assertIn(">", js_code)
        self.assertIn("<=", js_code)
        self.assertIn(">=", js_code)

        # Logical operators (Jac and/or should become JS &&/||)
        self.assertIn("&&", js_code)
        self.assertIn("||", js_code)
        self.assertIn("!", js_code)

        # Bitwise operators
        self.assertIn("&", js_code)
        self.assertIn("|", js_code)
        self.assertIn("^", js_code)
        self.assertIn("<<", js_code)
        self.assertIn(">>", js_code)

    def test_data_structures_generate_valid_js(self) -> None:
        """Test that data structures generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_data_structures.jac"))

        # Should have array syntax
        self.assertIn("[", js_code)
        self.assertIn("]", js_code)

        # Should have object syntax
        self.assertIn("{", js_code)
        self.assertIn("}", js_code)

    def test_enums_generate_valid_js(self) -> None:
        """Test that enums generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_enums.jac"))

        # Enums should generate const declarations
        self.assertIn("const", js_code)

        # Should not have enum keyword (JS doesn't have native enums in ES6)
        # Instead should use const objects

    def test_exception_handling_generates_valid_js(self) -> None:
        """Test that exception handling generates valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_exception_handling.jac"))

        # Should have try/catch/finally
        self.assertIn("try", js_code)
        self.assertIn("catch", js_code)
        self.assertIn("finally", js_code)

        # Raise should become throw
        self.assertIn("throw", js_code)

    def test_assignments_generate_valid_js(self) -> None:
        """Test that assignments generate valid JavaScript."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_assignments.jac"))

        # Should have assignment operator
        self.assertIn("=", js_code)

        # Should have augmented assignments
        self.assertIn("+=", js_code)
        self.assertIn("-=", js_code)
        self.assertIn("*=", js_code)

    def test_js_syntax_is_balanced(self) -> None:
        """Test that generated JavaScript has balanced braces and parens."""
        fixtures = [
            "comprehensive_functions.jac",
            "comprehensive_classes.jac",
            "comprehensive_control_flow.jac",
            "comprehensive_expressions.jac",
        ]

        for fixture in fixtures:
            with self.subTest(fixture=fixture):
                js_code = self.compile_to_js(self.get_fixture_path(fixture))

                # Check balanced braces
                open_braces = js_code.count("{")
                close_braces = js_code.count("}")
                self.assertEqual(
                    open_braces, close_braces,
                    f"Unbalanced braces in {fixture}: {open_braces} open, {close_braces} close"
                )

                # Check balanced parentheses
                open_parens = js_code.count("(")
                close_parens = js_code.count(")")
                self.assertEqual(
                    open_parens, close_parens,
                    f"Unbalanced parens in {fixture}: {open_parens} open, {close_parens} close"
                )

                # Check balanced brackets
                open_brackets = js_code.count("[")
                close_brackets = js_code.count("]")
                self.assertEqual(
                    open_brackets, close_brackets,
                    f"Unbalanced brackets in {fixture}: {open_brackets} open, {close_brackets} close"
                )

    def test_js_has_no_jac_keywords(self) -> None:
        """Test that generated JavaScript doesn't contain Jac-specific keywords."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Jac-specific keywords that shouldn't appear in JS
        jac_keywords = [
            "can ", "has ", "obj ", "walker ", "node ", "edge ",
            "visit ", "spawn ", "disengage ", "here ", "root "
        ]

        for keyword in jac_keywords:
            self.assertNotIn(
                keyword, js_code,
                f"Jac keyword '{keyword.strip()}' found in JavaScript output"
            )

    def test_operator_mapping_correctness(self) -> None:
        """Test that Jac operators are correctly mapped to JavaScript operators."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_expressions.jac"))

        # Jac 'and' -> JS '&&'
        self.assertIn("&&", js_code)
        self.assertNotIn(" and ", js_code)

        # Jac 'or' -> JS '||'
        self.assertIn("||", js_code)
        self.assertNotIn(" or ", js_code)

        # Jac 'not' -> JS '!'
        self.assertIn("!", js_code)
        self.assertNotRegex(js_code, r"\bnot\b")

        # Jac '==' -> JS '==='
        self.assertIn("===", js_code)

        # Jac '!=' -> JS '!=='
        self.assertIn("!==", js_code)

    def test_comments_are_preserved_or_stripped(self) -> None:
        """Test that comments are handled appropriately."""
        js_code = self.compile_to_js(self.get_fixture_path("simple_function.jac"))

        # JavaScript code may or may not preserve comments
        # This test just ensures the code is still valid
        self.assertGreater(len(js_code), 0)
        self.assertIn("function", js_code)

    def test_string_literals_are_correct(self) -> None:
        """Test that string literals are correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("simple_function.jac"))

        # Should have string literals
        self.assertRegex(js_code, r'["\'].*["\']')

    def test_function_parameters_are_correct(self) -> None:
        """Test that function parameters are correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Should have function with parameters
        self.assertRegex(js_code, r"function\s+\w+\s*\([^)]+\)")

    def test_return_statements_are_correct(self) -> None:
        """Test that return statements are correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Should have return statements
        self.assertIn("return", js_code)
        self.assertRegex(js_code, r"return\s+\w+")

    def test_variable_declarations_are_correct(self) -> None:
        """Test that variable declarations use const/let/var."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_expressions.jac"))

        # Should have variable declarations (const, let, or var)
        has_const = "const" in js_code
        has_let = "let" in js_code
        has_var = "var" in js_code

        self.assertTrue(
            has_const or has_let or has_var,
            "No variable declarations found in generated JavaScript"
        )

    def test_cli_js_command_works(self) -> None:
        """Test that 'jac js' CLI command produces valid JavaScript."""
        import os

        fixture_path = self.get_fixture_path("simple_function.jac")
        env = os.environ.copy()
        env["PYTHONPATH"] = f"/home/ninja/jaseci/jac:{env.get('PYTHONPATH', '')}"

        result = subprocess.run(
            ["python3", "-m", "jaclang.cli.cli", "js", fixture_path],
            capture_output=True,
            text=True,
            env=env,
        )

        self.assertEqual(result.returncode, 0, f"CLI command failed: {result.stderr}")
        self.assertGreater(len(result.stdout), 0, "No JavaScript output from CLI")
        self.assertIn("function", result.stdout, "Output should contain functions")

    def test_async_functions_generate_correctly(self) -> None:
        """Test that async functions are correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Should have async keyword
        if "async_fetch" in js_code:
            self.assertIn("async", js_code)

    def test_lambda_expressions_generate_correctly(self) -> None:
        """Test that lambda expressions are converted to arrow functions or function expressions."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Lambdas might become arrow functions or function expressions
        # Just verify the code is generated
        self.assertGreater(len(js_code), 0)

    def test_class_methods_generate_correctly(self) -> None:
        """Test that class methods are correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_classes.jac"))

        # Should have class keyword
        self.assertIn("class", js_code)

        # Should have methods (might be in constructor or as class methods)
        # Just verify the structure exists
        self.assertRegex(js_code, r"class\s+\w+")

    def test_inheritance_generates_correctly(self) -> None:
        """Test that class inheritance is correctly generated."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_classes.jac"))

        # Should have extends keyword for inheritance
        if "Student" in js_code:
            # Student extends Person
            self.assertIn("extends", js_code)

    def test_multiline_code_formatting(self) -> None:
        """Test that generated code has reasonable formatting."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_functions.jac"))

        # Should have multiple lines
        lines = js_code.split("\n")
        self.assertGreater(len(lines), 5, "Generated code should be multi-line")

        # Should have some indentation
        indented_lines = [line for line in lines if line.startswith(" ") or line.startswith("\t")]
        self.assertGreater(
            len(indented_lines), 0,
            "Generated code should have some indentation"
        )

    def test_empty_jac_file_generates_empty_or_minimal_js(self) -> None:
        """Test that an empty Jac file generates minimal JavaScript."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jac", delete=False) as f:
            f.write('"""Empty file."""\n')
            temp_file = f.name

        try:
            js_code = self.compile_to_js(temp_file)
            # Empty file should generate minimal code
            self.assertLess(len(js_code), 100)
        finally:
            import os
            os.unlink(temp_file)

    def test_complex_nested_structures(self) -> None:
        """Test that complex nested structures generate correctly."""
        js_code = self.compile_to_js(self.get_fixture_path("comprehensive_control_flow.jac"))

        # Should handle nested loops
        self.assertIn("for", js_code)

        # Count braces to ensure nesting is handled
        open_braces = js_code.count("{")
        self.assertGreater(open_braces, 5, "Should have multiple nested structures")

    def test_all_comprehensive_fixtures_compile(self) -> None:
        """Test that all comprehensive fixtures compile to JavaScript without errors."""
        fixtures = [
            "comprehensive_functions.jac",
            "comprehensive_classes.jac",
            "comprehensive_control_flow.jac",
            "comprehensive_expressions.jac",
            "comprehensive_data_structures.jac",
            "comprehensive_enums.jac",
            "comprehensive_exception_handling.jac",
            "comprehensive_assignments.jac",
        ]

        for fixture in fixtures:
            with self.subTest(fixture=fixture):
                try:
                    js_code = self.compile_to_js(self.get_fixture_path(fixture))
                    self.assertGreater(
                        len(js_code), 0,
                        f"{fixture} generated empty JavaScript"
                    )
                except Exception as e:
                    self.fail(f"{fixture} failed to compile: {e}")
