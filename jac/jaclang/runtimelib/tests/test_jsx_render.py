"""Unit tests for JSX rendering and hydration helpers."""

from __future__ import annotations

from pathlib import Path
from tempfile import mkdtemp

import shutil

from jaclang.runtimelib.client_bundle import ClientBundleBuilder
from jaclang.runtimelib.machine import JacMachine
from jaclang.utils.test import TestCase


class RenderJsxTreeTests(TestCase):
    """Validate JacMachine.render_jsx_tree."""

    def test_text_and_attribute_escaping(self) -> None:
        payload = {
            "tag": "div",
            "props": {"class": "<script>", "title": '"double"'},
            "children": ["<hello>", {"tag": "span", "props": {}, "children": ["&"]}],
        }
        html = JacMachine.render_jsx_tree(payload)
        self.assertIn("&lt;hello&gt;", html)
        self.assertIn('class="&lt;script&gt;"', html)
        self.assertIn('title="&quot;double&quot;"', html)
        self.assertIn("&amp;", html)

    def test_function_component(self) -> None:
        def badge(props: dict) -> dict:
            return {
                "tag": "span",
                "props": {"class": f"badge-{props.get('variant', 'default')}"},
                "children": [props.get("label", "")],
            }

        payload = {
            "tag": badge,
            "props": {"variant": "info", "label": "Jac"},
            "children": [],
        }
        html = JacMachine.render_jsx_tree(payload)
        self.assertEqual('<span class="badge-info">Jac</span>', html)

    def test_fragment_children(self) -> None:
        payload = {
            "tag": None,
            "props": {},
            "children": [
                {"tag": "h1", "props": {}, "children": ["Title"]},
                {"tag": "p", "props": {}, "children": ["Description"]},
            ],
        }
        html = JacMachine.render_jsx_tree(payload)
        self.assertEqual("<h1>Title</h1><p>Description</p>", html)


class ClientBundleBuilderHashTests(TestCase):
    """Ensure bundle hashing is stable and reacts to changes."""

    def setUp(self) -> None:
        super().setUp()
        self.tempdir = Path(mkdtemp(prefix="jac_bundle_test_"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tempdir, ignore_errors=True)
        super().tearDown()

    def _write_module(self, contents: str) -> Path:
        path = self.tempdir / "mod.jac"
        path.write_text(contents, encoding="utf-8")
        return path

    def test_bundle_hash_changes_on_source_update(self) -> None:
        initial_src = """
cl def hello() {
    return <div>Hello</div>;
}
"""
        updated_src = """
cl def hello() {
    return <div>Hello Jac</div>;
}
"""
        module_path = self._write_module(initial_src)

        from jaclang.runtimelib.machine import JacMachine as Jac

        # First build
        Jac.reset_machine()
        Jac.jac_import("mod", str(self.tempdir))
        module = Jac.loaded_modules["mod"]
        bundle_builder = ClientBundleBuilder()
        bundle1 = bundle_builder.build(module)

        # Second build without changes should reuse cache/hash
        bundle2 = bundle_builder.build(module)
        self.assertEqual(bundle1.hash, bundle2.hash)

        # Update source, recompile and rebuild bundle (hash should change)
        module_path.write_text(updated_src, encoding="utf-8")
        Jac.reset_machine()
        Jac.jac_import("mod", str(self.tempdir), reload_module=True)
        updated_module = Jac.loaded_modules["mod"]
        bundle3 = bundle_builder.build(updated_module, force=True)
        self.assertNotEqual(bundle1.hash, bundle3.hash)
