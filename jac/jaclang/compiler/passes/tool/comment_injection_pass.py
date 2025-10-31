"""Pass to inject comments into annotated DocIR."""

from typing import Sequence, Set

import jaclang.compiler.passes.tool.doc_ir as doc
import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass


class CommentInjectionPass(UniPass):
    """
    Injects comments into DocIR using AST node annotations.

    This pass runs after DocIRGenPass and modifies the DocIR tree to include
    comments in their correct positions. It leverages ast_node annotations
    on Group, Indent, and Concat nodes to know which AST context it's in.
    """

    def before_pass(self) -> None:
        """Initialize pass with comment tracking."""
        self.comment_map: dict[int, list[tuple[int, uni.CommentToken]]] = {}
        self.used_comments: Set[int] = set()
        self.inline_comments: Set[int] = set()  # Track which comments are inline

        if isinstance(self.ir_out, uni.Module):
            # Build a map of line number -> comments on that line
            for idx, comment in enumerate(self.ir_out.source.comments):
                line = comment.loc.first_line
                if line not in self.comment_map:
                    self.comment_map[line] = []
                self.comment_map[line].append((idx, comment))

            # Use src_terminals to detect inline comments
            self._detect_inline_comments()

        return super().before_pass()

    def _detect_inline_comments(self) -> None:
        """Detect which comments are inline (same line as code before them)."""
        if not isinstance(self.ir_out, uni.Module):
            return

        # Build a linear list of all tokens and comments in order
        all_items = []

        # Add all non-comment tokens from src_terminals
        for token in self.ir_out.src_terminals:
            if not isinstance(token, uni.CommentToken):
                all_items.append(("token", token))

        # Add all comments
        for idx, comment in enumerate(self.ir_out.source.comments):
            all_items.append(("comment", idx, comment))

        # Sort by position
        all_items.sort(key=lambda x: (x[-1].loc.first_line, x[-1].loc.col_start))

        # Mark comments that have code before them on the same line
        for i, item in enumerate(all_items):
            if item[0] == "comment":
                comment_idx = item[1]
                comment = item[2]

                # Check if there's a code token before this comment on the same line
                if i > 0:
                    prev_item = all_items[i - 1]
                    if prev_item[0] == "token":
                        prev_token = prev_item[1]
                        if prev_token.loc.last_line == comment.loc.first_line:
                            # This is an inline comment!
                            self.inline_comments.add(comment_idx)

    def after_pass(self) -> None:
        """Inject comments into the module's DocIR."""
        if not self.comment_map or not isinstance(self.ir_out, uni.Module):
            return

        # Transform the DocIR tree to include comments
        if hasattr(self.ir_out.gen, "doc_ir") and self.ir_out.gen.doc_ir:
            self.ir_out.gen.doc_ir = self._inject_comments(
                self.ir_out, self.ir_out.gen.doc_ir
            )

    def _inject_comments(
        self, ast_context: uni.UniNode, doc_node: doc.DocType
    ) -> doc.DocType:
        """
        Recursively traverse DocIR and inject comments.

        Args:
            ast_context: The AST node this DocIR corresponds to
            doc_node: The DocIR node to process

        Returns:
            New DocIR with comments injected
        """
        if isinstance(doc_node, doc.Concat):
            # Check if this Concat is annotated with an AST node
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )

            # If this is a module-level Concat, inject comments between children
            if isinstance(node_context, uni.Module):
                return self._inject_module_comments(node_context, doc_node)

            # Otherwise, recursively process parts
            new_parts = [self._inject_comments(node_context, p) for p in doc_node.parts]
            return doc.Concat(new_parts, ast_node=node_context)

        elif isinstance(doc_node, doc.Group):
            # Check if this Group is annotated
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )
            new_contents = self._inject_comments(node_context, doc_node.contents)
            return doc.Group(
                new_contents,
                doc_node.break_contiguous,
                doc_node.id,
                ast_node=node_context,
            )

        elif isinstance(doc_node, doc.Indent):
            # Check if this Indent is annotated (indicates a body)
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )

            # If annotated and node has a body, inject body comments
            if doc_node.ast_node and hasattr(node_context, "body"):
                return self._inject_body_comments(node_context, doc_node)

            # Otherwise, recursively process contents
            new_contents = self._inject_comments(node_context, doc_node.contents)
            return doc.Indent(new_contents, ast_node=node_context)

        elif isinstance(doc_node, doc.IfBreak):
            new_break = self._inject_comments(ast_context, doc_node.break_contents)
            new_flat = self._inject_comments(ast_context, doc_node.flat_contents)
            return doc.IfBreak(new_break, new_flat)

        elif isinstance(doc_node, doc.Align):
            new_contents = self._inject_comments(ast_context, doc_node.contents)
            return doc.Align(new_contents, doc_node.n)

        else:
            # Leaf nodes (Text, Line) - return as is
            return doc_node

    def _inject_module_comments(
        self, module: uni.Module, concat_node: doc.Concat
    ) -> doc.Concat:
        """Inject comments between module-level declarations."""
        new_parts: list[doc.DocType] = []
        current_line = 1
        module_end = module.loc.last_line if module.loc else 99999
        child_idx = 0

        for part in concat_node.parts:
            # Skip Line nodes
            if isinstance(part, doc.Line):
                new_parts.append(part)
                continue

            # This should correspond to a module child
            if child_idx < len(module.kid):
                child = module.kid[child_idx]

                # Add standalone comments BEFORE this child (on previous lines only)
                if hasattr(child, "loc") and child.loc:
                    standalone_before = self._get_comments_in_range(
                        current_line, child.loc.first_line - 1
                    )
                    for comment_id, comment in standalone_before:
                        if comment_id not in self.inline_comments:  # Only standalone
                            new_parts.append(
                                self._create_standalone_comment_doc(comment)
                            )
                            self.used_comments.add(comment_id)

                # Recursively process this child's DocIR
                new_parts.append(self._inject_comments(child, part))

                # Add inline comments AFTER (on child's last line)
                if hasattr(child, "loc") and child.loc:
                    inline_after = self._get_comments_on_line(child.loc.last_line)
                    for comment_id, comment in inline_after:
                        if comment_id in self.inline_comments:  # Only inline
                            new_parts.append(self._create_inline_comment_doc(comment))
                            self.used_comments.add(comment_id)

                    current_line = child.loc.last_line + 1

                child_idx += 1
            else:
                new_parts.append(self._inject_comments(module, part))

        # Add any remaining comments at the end
        remaining_comments = self._get_comments_in_range(current_line, module_end)
        for comment_id, comment in remaining_comments:
            new_parts.append(self._create_standalone_comment_doc(comment))
            self.used_comments.add(comment_id)

        return doc.Concat(new_parts, ast_node=module)

    def _inject_body_comments(
        self, ast_node: uni.UniNode, indent_node: doc.Indent
    ) -> doc.Indent:
        """Inject comments into an indented body."""
        if not hasattr(ast_node, "body") or not isinstance(ast_node.body, Sequence):
            return indent_node

        indent_contents = indent_node.contents
        if not isinstance(indent_contents, doc.Concat):
            return indent_node

        # Find body start line (after opening brace)
        body_start_line = None
        for kid in ast_node.kid:
            if isinstance(kid, uni.Token) and kid.name == Tok.LBRACE and kid.loc:
                body_start_line = kid.loc.last_line + 1
                break

        if not body_start_line:
            return indent_node

        # Build new parts with comments
        new_parts: list[doc.DocType] = []
        current_line = body_start_line
        body_idx = 0

        for part in indent_contents.parts:
            # Skip Line nodes
            if isinstance(part, doc.Line):
                new_parts.append(part)
                continue

            # This should be a body statement's DocIR
            if body_idx < len(ast_node.body):
                body_item = ast_node.body[body_idx]

                # Add standalone comments BEFORE this body item (on previous lines only)
                if hasattr(body_item, "loc") and body_item.loc:
                    standalone_before = self._get_comments_in_range(
                        current_line, body_item.loc.first_line - 1
                    )
                    for comment_id, comment in standalone_before:
                        if comment_id not in self.inline_comments:  # Only standalone
                            new_parts.append(
                                self._create_standalone_comment_doc(comment)
                            )
                            self.used_comments.add(comment_id)

                # Recursively process this body item's DocIR
                new_parts.append(self._inject_comments(body_item, part))

                # Add inline comments AFTER (on body item's last line)
                if hasattr(body_item, "loc") and body_item.loc:
                    inline_after = self._get_comments_on_line(body_item.loc.last_line)
                    for comment_id, comment in inline_after:
                        if comment_id in self.inline_comments:  # Only inline
                            new_parts.append(self._create_inline_comment_doc(comment))
                            self.used_comments.add(comment_id)

                    current_line = body_item.loc.last_line + 1

                body_idx += 1
            else:
                new_parts.append(self._inject_comments(ast_node, part))

        # Add remaining comments before closing brace
        if hasattr(ast_node, "loc") and ast_node.loc:
            for kid in reversed(ast_node.kid):
                if isinstance(kid, uni.Token) and kid.name == Tok.RBRACE and kid.loc:
                    remaining = self._get_comments_in_range(
                        current_line, kid.loc.first_line - 1
                    )
                    for comment_id, comment in remaining:
                        new_parts.append(self._create_standalone_comment_doc(comment))
                        self.used_comments.add(comment_id)
                    break

        return doc.Indent(doc.Concat(new_parts), ast_node=ast_node)

    def _get_comments_in_range(
        self, start_line: int, end_line: int
    ) -> list[tuple[int, uni.CommentToken]]:
        """Get all unused comments in the line range."""
        result: list[tuple[int, uni.CommentToken]] = []

        for line in range(start_line, end_line + 1):
            if line in self.comment_map:
                for comment_id, comment in self.comment_map[line]:
                    if comment_id not in self.used_comments:
                        result.append((comment_id, comment))

        return result

    def _get_comments_on_line(self, line: int) -> list[tuple[int, uni.CommentToken]]:
        """Get all unused comments on a specific line (for inline comments)."""
        result: list[tuple[int, uni.CommentToken]] = []

        if line in self.comment_map:
            for comment_id, comment in self.comment_map[line]:
                if comment_id not in self.used_comments:
                    result.append((comment_id, comment))

        return result

    def _create_standalone_comment_doc(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for a standalone comment."""
        return doc.Concat([doc.Text(comment.value), doc.Line(hard=True)])

    def _create_inline_comment_doc(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for an inline comment (appears at end of line)."""
        # Inline comments: two spaces before comment, then hard line
        return doc.Concat(
            [doc.Text("  "), doc.Text(comment.value), doc.Line(hard=True)]
        )
