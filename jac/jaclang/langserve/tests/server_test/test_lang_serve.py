"""Test suite for Jac language server features with improved structure and maintainability."""

import os
from typing import Optional
from dataclasses import dataclass
import pytest

from lsprotocol.types import (
    DidOpenTextDocumentParams,
    TextDocumentItem,
    DidSaveTextDocumentParams,
    DidChangeTextDocumentParams,
    DocumentFormattingParams,
    TextEdit,
    VersionedTextDocumentIdentifier,
    TextDocumentIdentifier,
)
from jaclang.langserve.tests.server_test.utils import (
    create_temp_jac_file,
    load_jac_template,
    create_ls_with_workspace,
)
from jaclang.vendor.pygls.uris import from_fs_path
from jaclang.langserve.engine import JacLangServer
from jaclang.langserve.server import did_open, did_save, did_change, formatting


@dataclass
class TestFile:
    """Encapsulates test file information and operations."""
    
    path: str
    uri: str
    code: str
    version: int = 1
    
    @classmethod
    def from_template(cls, template_name: str, content: str = "") -> "TestFile":
        """Create a test file from a template."""
        code = load_jac_template(cls._get_template_path(template_name), content)
        temp_path = create_temp_jac_file(code)
        return cls(
            path=temp_path,
            uri=from_fs_path(temp_path),
            code=code,
        )
    
    @staticmethod
    def _get_template_path(file_name: str) -> str:
        """Get absolute path to test template file."""
        return os.path.abspath(
            os.path.join(os.path.dirname(__file__), file_name)
        )
    
    def cleanup(self):
        """Remove temporary test file."""
        if os.path.exists(self.path):
            os.remove(self.path)
    
    def increment_version(self) -> int:
        """Increment and return the version number."""
        self.version += 1
        return self.version


class LanguageServerTestHelper:
    """Helper class for language server testing operations."""
    
    def __init__(self, ls: JacLangServer, test_file: TestFile):
        self.ls = ls
        self.test_file = test_file
    
    async def open_document(self) -> None:
        """Open a document in the language server."""
        # content = code if code is not None else self.test_file.code

        params = DidOpenTextDocumentParams(
            text_document=TextDocumentItem(
                uri=self.test_file.uri,
                language_id="jac",
                version=self.test_file.version,
                text=self.test_file.code,
            )
        )
        await did_open(self.ls, params)
    
    async def save_document(self, code: Optional[str] = None) -> None:
        """Save a document in the language server."""
        content = code if code is not None else self.test_file.code
        version = self.test_file.increment_version()
        
        if code:
            self._update_workspace(code, version)
        
        params = DidSaveTextDocumentParams(
            text_document=TextDocumentItem(
                uri=self.test_file.uri,
                language_id="jac",
                version=version,
                text=content,
            )
        )
        await did_save(self.ls, params)
    
    async def change_document(self, code: str) -> None:
        """Change document content in the language server."""
        version = self.test_file.increment_version()
        self._update_workspace(code, version)
        
        params = DidChangeTextDocumentParams(
            text_document=VersionedTextDocumentIdentifier(
                uri=self.test_file.uri,
                version=version
            ),
            content_changes=[{"text": code}],
        )
        await did_change(self.ls, params)
    
    def _update_workspace(self, code: str, version: int) -> None:
        """Update workspace with new document content."""
        self.ls.workspace.put_text_document(
            TextDocumentItem(
                uri=self.test_file.uri,
                language_id="jac",
                version=version,
                text=code,
            )
        )
    
    def get_diagnostics(self) -> list:
        """Get diagnostics for the current document."""
        return self.ls.diagnostics.get(self.test_file.uri, [])
    
    def get_semantic_tokens(self):
        """Get semantic tokens for the current document."""
        return self.ls.get_semantic_tokens(self.test_file.uri)
    
    def assert_no_diagnostics(self) -> None:
        """Assert that there are no diagnostics."""
        diagnostics = self.get_diagnostics()
        assert isinstance(diagnostics, list)
        assert len(diagnostics) == 0, f"Expected no diagnostics, found {len(diagnostics)}"
    
    def assert_has_diagnostics(self, count: int = 1, message_contains: Optional[str] = None) -> None:
        """Assert that diagnostics exist with optional message validation."""
        diagnostics = self.get_diagnostics()
        assert isinstance(diagnostics, list)
        assert len(diagnostics) == count, f"Expected {count} diagnostic(s), found {len(diagnostics)}"
        
        if message_contains:
            assert message_contains in diagnostics[0].message, \
                f"Expected '{message_contains}' in diagnostic message"
    
    def assert_semantic_tokens_count(self, expected_count: int) -> None:
        """Assert semantic tokens data has expected count."""
        tokens = self.get_semantic_tokens()
        assert hasattr(tokens, "data")
        assert isinstance(tokens.data, list)
        assert len(tokens.data) == expected_count, \
            f"Expected {expected_count} tokens, found {len(tokens.data)}"


class TestLangServe:
    """Test suite for Jac language server features."""
    
    CIRCLE_TEMPLATE = "circle_template.jac"
    GLOB_TEMPLATE = "glob_template.jac"
    EXPECTED_CIRCLE_TOKEN_COUNT = 340
    EXPECTED_GLOB_TOKEN_COUNT = 15
    
    @pytest.mark.asyncio
    async def test_open_valid_file_no_diagnostics(self):
        """Test opening a valid Jac file produces no diagnostics."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE)
        uri, ls = create_ls_with_workspace(test_file.path)
        test_file.uri = uri
        helper = LanguageServerTestHelper(ls, test_file)
        
        await helper.open_document()
        helper.assert_no_diagnostics()
        
        ls.shutdown()
        test_file.cleanup()
    
    @pytest.mark.asyncio
    async def test_open_with_syntax_error(self):
        """Test opening a Jac file with syntax error produces diagnostics."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE, "error")
        uri, ls = create_ls_with_workspace(test_file.path)
        test_file.uri = uri
        helper = LanguageServerTestHelper(ls, test_file)
        
        await helper.open_document()
        helper.assert_has_diagnostics(count=1, message_contains="Unexpected token 'error'")
        
        diagnostics = helper.get_diagnostics()
        assert str(diagnostics[0].range) == "65:0-65:5"
        
        ls.shutdown()
        test_file.cleanup()
    
    @pytest.mark.asyncio
    async def test_did_open_and_simple_syntax_error(self):
        """Test diagnostics evolution from valid to invalid code."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE)
        uri, ls = create_ls_with_workspace(test_file.path)
        test_file.uri = uri
        helper = LanguageServerTestHelper(ls, test_file)
        
        # Open valid file
        print("Opening valid file...")
        await helper.open_document()
        helper.assert_no_diagnostics()
        
        # Introduce syntax error
        broken_code = load_jac_template(
            TestFile._get_template_path(self.CIRCLE_TEMPLATE), 
            "error"
        )
        helper._update_workspace(broken_code, test_file.increment_version())
        await helper.open_document()
        helper.assert_has_diagnostics(count=1)
        helper.assert_semantic_tokens_count(self.EXPECTED_CIRCLE_TOKEN_COUNT)
        
        ls.shutdown()
        test_file.cleanup()
    
    @pytest.mark.asyncio
    async def test_did_save(self):
        """Test saving a Jac file triggers appropriate diagnostics."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE)
        uri, ls = create_ls_with_workspace(test_file.path)
        test_file.uri = uri
        helper = LanguageServerTestHelper(ls, test_file)
        
        await helper.open_document()
        await helper.save_document()
        helper.assert_no_diagnostics()
        
        # Save with syntax error
        broken_code = load_jac_template(
            TestFile._get_template_path(self.CIRCLE_TEMPLATE),
            "error"
        )
        await helper.save_document(broken_code)
        helper.assert_semantic_tokens_count(self.EXPECTED_CIRCLE_TOKEN_COUNT)
        helper.assert_has_diagnostics(count=1, message_contains="Unexpected token 'error'")
        
        ls.shutdown()
        test_file.cleanup()
    
    @pytest.mark.asyncio
    async def test_did_change(self):
        """Test changing a Jac file triggers diagnostics."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE)
        uri, ls = create_ls_with_workspace(test_file.path)
        test_file.uri = uri
        helper = LanguageServerTestHelper(ls, test_file)
        
        await helper.open_document()
        
        # Change without error
        await helper.change_document("\n" + test_file.code)
        helper.assert_no_diagnostics()
        
        # Change with syntax error
        await helper.change_document("\nerror" + test_file.code)
        helper.assert_semantic_tokens_count(self.EXPECTED_CIRCLE_TOKEN_COUNT)
        helper.assert_has_diagnostics(count=1, message_contains="Unexpected token")
        
        ls.shutdown()
        test_file.cleanup()
    
    def test_vsce_formatting(self):
        """Test formatting a Jac file returns valid edits."""
        test_file = TestFile.from_template(self.CIRCLE_TEMPLATE)
        uri, ls = create_ls_with_workspace(test_file.path)
        
        params = DocumentFormattingParams(
            text_document=TextDocumentIdentifier(uri=uri),
            options={"tabSize": 4, "insertSpaces": True},
        )
        edits = formatting(ls, params)
        
        assert isinstance(edits, list)
        assert len(edits) > 0
        assert isinstance(edits[0], TextEdit)
        assert len(edits[0].new_text) > 100
        
        ls.shutdown()
        test_file.cleanup()
    
    @pytest.mark.asyncio
    async def test_multifile_workspace(self):
        """Test opening multiple Jac files in a workspace."""
        file1 = TestFile.from_template(self.GLOB_TEMPLATE)
        file2 = TestFile.from_template(self.GLOB_TEMPLATE, "error")
        
        uri1, ls = create_ls_with_workspace(file1.path)
        file1.uri = uri1
        file2.uri = from_fs_path(file2.path)
        
        helper1 = LanguageServerTestHelper(ls, file1)
        helper2 = LanguageServerTestHelper(ls, file2)
        
        # Open both files
        await helper1.open_document()
        await helper2.open_document()
        
        # Verify initial state
        helper1.assert_no_diagnostics()
        helper2.assert_has_diagnostics(count=1, message_contains="Unexpected token")
        
        # Check semantic tokens before change
        helper1.assert_semantic_tokens_count(self.EXPECTED_GLOB_TOKEN_COUNT)
        helper2.assert_semantic_tokens_count(self.EXPECTED_GLOB_TOKEN_COUNT)
        
        # Change first file
        changed_code = load_jac_template(
            TestFile._get_template_path(self.GLOB_TEMPLATE),
            "glob x = 90;"
        )
        await helper1.change_document(changed_code)
        
        # Verify semantic tokens after change
        helper1.assert_semantic_tokens_count(20)
        helper2.assert_semantic_tokens_count(self.EXPECTED_GLOB_TOKEN_COUNT)
        
        ls.shutdown()
        file1.cleanup()
        file2.cleanup()