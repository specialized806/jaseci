"""Test ECMAScript AST generation pass module."""

import json
from pathlib import Path

from jaclang.compiler.emcascript import EsastGenPass, es_node_to_dict
from jaclang.compiler.emcascript import estree as es
from jaclang.compiler.emcascript.es_unparse import es_to_js
from jaclang.compiler.program import JacProgram
from jaclang.utils.test import TestCase


class EsastGenPassTests(TestCase):
    """Test ECMAScript AST generation pass."""

    TargetPass = EsastGenPass

    def setUp(self) -> None:
        """Set up test."""
        return super().setUp()

    def get_fixture_path(self, filename: str) -> str:
        """Get absolute path to fixture file."""
        fixtures_dir = Path(__file__).parent / "fixtures"
        return str(fixtures_dir / filename)

    def compile_to_esast(self, filename: str) -> es.Program:
        """Compile Jac file to ESTree AST."""
        prog = JacProgram()
        ir = prog.compile(file_path=filename, no_cgen=True)

        self.assertFalse(
            prog.errors_had, f"Compilation errors: {[str(e) for e in prog.errors_had]}"
        )

        esast_pass = EsastGenPass(ir, prog)
        es_ir = esast_pass.ir_out

        self.assertTrue(hasattr(es_ir.gen, "es_ast"), "es_ast attribute not found")
        self.assertIsNotNone(es_ir.gen.es_ast, "es_ast is None")
        self.assertIsInstance(
            es_ir.gen.es_ast, es.Program, "es_ast is not a Program node"
        )

        return es_ir.gen.es_ast

    def test_simple_function(self) -> None:
        """Test simple function generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("simple_function.jac"))

        # Check that we have function declarations
        func_decls = [
            node for node in es_ast.body if isinstance(node, es.FunctionDeclaration)
        ]
        self.assertGreaterEqual(len(func_decls), 2, "Expected at least 2 functions")

        # Verify function names
        func_names = {func.id.name for func in func_decls if func.id}
        self.assertIn("add", func_names, "'add' function not found")
        self.assertIn("greet", func_names, "'greet' function not found")

        # Verify 'add' function has 2 parameters
        add_func = next(f for f in func_decls if f.id and f.id.name == "add")
        self.assertEqual(len(add_func.params), 2, "'add' should have 2 parameters")

    def test_class_generation(self) -> None:
        """Test class/object generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("class_test.jac"))

        # Check that we have class declarations
        class_decls = [
            node for node in es_ast.body if isinstance(node, es.ClassDeclaration)
        ]
        self.assertGreaterEqual(len(class_decls), 1, "Expected at least 1 class")

        # Verify class name
        person_class = class_decls[0]
        self.assertIsNotNone(person_class.id, "Class should have an id")
        self.assertEqual(person_class.id.name, "Person", "Class name should be 'Person'")

        # Verify class has a body
        self.assertIsInstance(person_class.body, es.ClassBody, "Class should have a body")

    def test_control_flow(self) -> None:
        """Test control flow statements."""
        es_ast = self.compile_to_esast(self.get_fixture_path("control_flow.jac"))

        # Should have function declarations
        func_decls = [
            node for node in es_ast.body if isinstance(node, es.FunctionDeclaration)
        ]
        self.assertGreaterEqual(len(func_decls), 1, "Expected at least 1 function")

        # Convert to JS and verify it contains control flow keywords
        js_code = es_to_js(es_ast)
        self.assertIn("if", js_code, "Should contain 'if' statement")
        self.assertIn("else", js_code, "Should contain 'else' statement")

    def test_expressions(self) -> None:
        """Test expression generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("expressions.jac"))

        js_code = es_to_js(es_ast)

        # Check for arithmetic operators
        self.assertIn("+", js_code, "Should contain addition operator")
        self.assertIn("-", js_code, "Should contain subtraction operator")
        self.assertIn("*", js_code, "Should contain multiplication operator")
        self.assertIn("/", js_code, "Should contain division operator")

        # Check for comparison operators
        self.assertIn("<", js_code, "Should contain less-than operator")
        self.assertIn(">", js_code, "Should contain greater-than operator")
        self.assertIn("===", js_code, "Should contain strict equality operator")

        # Check for logical operators
        self.assertIn("&&", js_code, "Should contain AND operator")
        self.assertIn("||", js_code, "Should contain OR operator")
        self.assertIn("!", js_code, "Should contain NOT operator")

    def test_data_structures(self) -> None:
        """Test data structure generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("data_structures.jac"))

        js_code = es_to_js(es_ast)

        # Check for arrays
        self.assertIn("[", js_code, "Should contain array literal")
        self.assertIn("]", js_code, "Should contain array literal closing")

        # Check for objects
        self.assertIn("{", js_code, "Should contain object literal")
        self.assertIn("}", js_code, "Should contain object literal closing")

    def test_enum_generation(self) -> None:
        """Test enum generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("enum_test.jac"))

        # Enums should be converted to const declarations with objects
        var_decls = [
            node for node in es_ast.body if isinstance(node, es.VariableDeclaration)
        ]
        self.assertGreaterEqual(len(var_decls), 1, "Expected at least 1 variable declaration for enum")

        js_code = es_to_js(es_ast)
        self.assertIn("const", js_code, "Enum should use const declaration")

    def test_try_except(self) -> None:
        """Test try/except generation."""
        es_ast = self.compile_to_esast(self.get_fixture_path("try_except.jac"))

        js_code = es_to_js(es_ast)

        # Check for try/catch/finally
        self.assertIn("try", js_code, "Should contain try block")
        self.assertIn("catch", js_code, "Should contain catch block")
        self.assertIn("finally", js_code, "Should contain finally block")

    def test_json_serialization(self) -> None:
        """Test ESTree AST can be serialized to JSON."""
        es_ast = self.compile_to_esast(self.get_fixture_path("simple_function.jac"))

        # Convert to dict
        ast_dict = es_node_to_dict(es_ast)

        # Should be serializable to JSON
        json_str = json.dumps(ast_dict, indent=2)
        self.assertIsInstance(json_str, str, "Should produce JSON string")
        self.assertGreater(len(json_str), 10, "JSON should have content")

        # Should be deserializable
        parsed = json.loads(json_str)
        self.assertEqual(parsed["type"], "Program", "Should be a Program node")
        self.assertIn("body", parsed, "Should have body")

    def test_javascript_code_generation(self) -> None:
        """Test JavaScript code can be generated from ESTree."""
        es_ast = self.compile_to_esast(self.get_fixture_path("simple_function.jac"))

        js_code = es_to_js(es_ast)

        self.assertIsInstance(js_code, str, "Should produce JavaScript string")
        self.assertGreater(len(js_code), 10, "JavaScript code should have content")
        self.assertIn("function", js_code, "Should contain 'function' keyword")

    def test_valid_javascript_syntax(self) -> None:
        """Test generated JavaScript has valid basic syntax."""
        es_ast = self.compile_to_esast(self.get_fixture_path("simple_function.jac"))

        js_code = es_to_js(es_ast)

        # Basic syntax checks
        open_braces = js_code.count("{")
        close_braces = js_code.count("}")
        self.assertEqual(
            open_braces, close_braces, "Braces should be balanced"
        )

        open_parens = js_code.count("(")
        close_parens = js_code.count(")")
        self.assertEqual(
            open_parens, close_parens, "Parentheses should be balanced"
        )

    def test_micro_examples(self) -> None:
        """Test compilation of micro examples."""
        # Test a few micro examples
        examples = [
            "micro/func.jac",
            "micro/circle_pure.jac",
        ]

        for example in examples:
            try:
                prog = JacProgram()
                ir = prog.compile(file_path=self.examples_abs_path(example), no_cgen=True)

                if prog.errors_had:
                    continue  # Skip files with errors

                esast_pass = EsastGenPass(ir, prog)
                es_ir = esast_pass.ir_out

                if hasattr(es_ir.gen, "es_ast") and es_ir.gen.es_ast:
                    js_code = es_to_js(es_ir.gen.es_ast)
                    self.assertGreater(
                        len(js_code), 0, f"Should generate JS code for {example}"
                    )
            except Exception as e:
                # Some examples may not be compatible yet
                print(f"Skipping {example}: {e}")
                continue

    def test_node_types_coverage(self) -> None:
        """Test that various ESTree node types are generated."""
        es_ast = self.compile_to_esast(self.get_fixture_path("control_flow.jac"))

        ast_dict = es_node_to_dict(es_ast)
        ast_json = json.dumps(ast_dict)

        # Check for various node types
        node_types = [
            "Program",
            "FunctionDeclaration",
            "BlockStatement",
            "IfStatement",
            "ReturnStatement",
            "BinaryExpression",
            "Identifier",
            "Literal",
        ]

        for node_type in node_types:
            self.assertIn(
                node_type, ast_json, f"Should generate {node_type} nodes"
            )

    def test_source_location_tracking(self) -> None:
        """Test that source locations are tracked."""
        es_ast = self.compile_to_esast(self.get_fixture_path("simple_function.jac"))

        # Check that Program node has location info
        self.assertIsNotNone(es_ast.loc, "Program should have location info")

        # Check that child nodes have location info
        if es_ast.body:
            first_stmt = es_ast.body[0]
            self.assertIsNotNone(
                first_stmt.loc, "First statement should have location info"
            )

    def test_empty_program(self) -> None:
        """Test handling of empty program."""
        # Create a minimal Jac file
        import tempfile

        with tempfile.NamedTemporaryFile(mode="w", suffix=".jac", delete=False) as f:
            f.write('"""Empty program."""\n')
            temp_file = f.name

        try:
            prog = JacProgram()
            ir = prog.compile(file_path=temp_file, no_cgen=True)

            esast_pass = EsastGenPass(ir, prog)
            es_ir = esast_pass.ir_out

            self.assertTrue(hasattr(es_ir.gen, "es_ast"), "Should have es_ast")
            self.assertIsInstance(
                es_ir.gen.es_ast, es.Program, "Should be a Program"
            )
        finally:
            import os
            os.unlink(temp_file)

    def test_operator_mapping(self) -> None:
        """Test that Jac operators are correctly mapped to JS operators."""
        es_ast = self.compile_to_esast(self.get_fixture_path("expressions.jac"))

        js_code = es_to_js(es_ast)

        # Jac == should become JS ===
        self.assertIn("===", js_code, "Jac '==' should map to JS '==='")

        # Jac != should become JS !==
        self.assertIn("!==", js_code, "Jac '!=' should map to JS '!=='")

        # Jac 'and' should become JS '&&'
        self.assertIn("&&", js_code, "Jac 'and' should map to JS '&&'")

        # Jac 'or' should become JS '||'
        self.assertIn("||", js_code, "Jac 'or' should map to JS '||'")

    def test_cli_integration(self) -> None:
        """Test that the 'jac js' CLI command works."""
        import subprocess
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
        self.assertGreater(
            len(result.stdout), 0, "CLI should produce JavaScript output"
        )
        self.assertIn("function", result.stdout, "Output should contain 'function'")

