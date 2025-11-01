"""Pass to inject comments using token-level precision with forced line breaks."""

from typing import Optional, Sequence, Set

import jaclang.compiler.passes.tool.doc_ir as doc
import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass


class CommentInjectionPass(UniPass):
    """
    Injects comments using token neighbors to determine exact placement.

    Uses src_terminals to analyze token sequence and find each comment's
    left/right neighbors, then injects comments and forces line breaks
    to preserve original structure.
    """

    def before_pass(self) -> None:
        """Initialize with token neighbor analysis."""
        self.comment_placements: list[
            tuple[int, uni.CommentToken, Optional[uni.Token], Optional[uni.Token], bool]
        ] = []
        self.used_comments: Set[int] = set()
        self.inline_comment_ids: Set[int] = set()
        self.token_to_comment_after: dict[
            int, list[tuple[int, uni.CommentToken, bool]]
        ] = {}

        if isinstance(self.ir_out, uni.Module):
            self._analyze_token_neighbors()

        return super().before_pass()

    def _analyze_token_neighbors(self) -> None:
        """
        Analyze token sequence to find comment neighbors and build injection map.

        For each comment, determines:
        - left_token: Token immediately before comment
        - right_token: Token immediately after comment
        - is_inline: Whether comment shares line with left_token
        - should_break_after: Whether right_token should be on new line
        """
        if not isinstance(self.ir_out, uni.Module):
            return

        # Merge tokens and comments in source order
        all_items: list[tuple[str, int, object]] = []

        for token in self.ir_out.src_terminals:
            if not isinstance(token, uni.CommentToken):
                all_items.append(("token", id(token), token))

        for idx, comment in enumerate(self.ir_out.source.comments):
            all_items.append(("comment", idx, comment))

        all_items.sort(key=lambda x: (x[2].loc.first_line, x[2].loc.col_start))

        # Analyze each comment
        for i, item in enumerate(all_items):
            if item[0] == "comment":
                comment_idx = item[1]
                comment = item[2]

                # Find left neighbor
                left_token = None
                for j in range(i - 1, -1, -1):
                    if all_items[j][0] == "token":
                        left_token = all_items[j][2]
                        break

                # Find right neighbor
                right_token = None
                for j in range(i + 1, len(all_items)):
                    if all_items[j][0] == "token":
                        right_token = all_items[j][2]
                        break

                # Determine if inline (shares line with left token)
                is_inline = (
                    left_token and left_token.loc.last_line == comment.loc.first_line
                )

                # Determine if right token should be on new line
                # (in original source, if right_token is on different line than comment)
                should_break_before_right = (
                    right_token and comment.loc.first_line < right_token.loc.first_line
                )

                self.comment_placements.append(
                    (comment_idx, comment, left_token, right_token, is_inline)
                )

                # Build a map: left_token_id -> [(comment, is_inline, break_after)]
                # This allows quick lookup when we encounter tokens in DocIR
                if left_token:
                    token_id = id(left_token)
                    if token_id not in self.token_to_comment_after:
                        self.token_to_comment_after[token_id] = []
                    self.token_to_comment_after[token_id].append(
                        (comment_idx, comment, is_inline)
                    )

    def after_pass(self) -> None:
        """Inject comments into the module's DocIR."""
        if not self.comment_placements or not isinstance(self.ir_out, uni.Module):
            return

        if hasattr(self.ir_out.gen, "doc_ir") and self.ir_out.gen.doc_ir:
            self.ir_out.gen.doc_ir = self._inject_comments(
                self.ir_out, self.ir_out.gen.doc_ir
            )

    def _inject_comments(
        self, ast_context: uni.UniNode, doc_node: doc.DocType
    ) -> doc.DocType:
        """Recursively inject comments into DocIR tree."""
        if isinstance(doc_node, doc.Concat):
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )
            if isinstance(node_context, uni.Module):
                return self._inject_module_comments(node_context, doc_node)
            # Use token-aware injection for all Concats
            new_parts = self._inject_into_concat(doc_node.parts, node_context)
            return doc.Concat(new_parts, ast_node=node_context)
        elif isinstance(doc_node, doc.Group):
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )
            return doc.Group(
                self._inject_comments(node_context, doc_node.contents),
                doc_node.break_contiguous,
                doc_node.id,
                ast_node=node_context,
            )
        elif isinstance(doc_node, doc.Indent):
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )
            if doc_node.ast_node and hasattr(node_context, "body"):
                return self._inject_body_comments(node_context, doc_node)
            return doc.Indent(
                self._inject_comments(node_context, doc_node.contents),
                ast_node=node_context,
            )
        elif isinstance(doc_node, doc.IfBreak):
            return doc.IfBreak(
                self._inject_comments(ast_context, doc_node.break_contents),
                self._inject_comments(ast_context, doc_node.flat_contents),
            )
        elif isinstance(doc_node, doc.Align):
            return doc.Align(
                self._inject_comments(ast_context, doc_node.contents), doc_node.n
            )
        else:
            return doc_node

    def _inject_into_concat(
        self, parts: list[doc.DocType], ast_context: uni.UniNode
    ) -> list[doc.DocType]:
        """
        Inject comments into Concat parts using token-level precision.

        Scans each part for Text nodes with source_tokens, and injects
        comments that follow those tokens.
        """
        new_parts: list[doc.DocType] = []

        for part in parts:
            # Recursively process the part first
            processed_part = self._inject_comments(ast_context, part)
            new_parts.append(processed_part)

            # Check all tokens in this part for following comments
            tokens = self._extract_all_tokens(processed_part)
            for token in tokens:
                token_id = id(token)
                if token_id in self.token_to_comment_after:
                    for comment_idx, comment, is_inline in self.token_to_comment_after[
                        token_id
                    ]:
                        if comment_idx not in self.used_comments:
                            if is_inline:
                                new_parts.append(self._create_inline_comment(comment))
                            else:
                                new_parts.append(
                                    self._create_standalone_comment(comment)
                                )
                            self.used_comments.add(comment_idx)

        return new_parts

    def _extract_all_tokens(self, part: doc.DocType) -> list[uni.Token]:
        """Extract all source tokens from a DocIR part."""
        tokens = []
        if isinstance(part, doc.Text) and part.source_token:
            tokens.append(part.source_token)
        elif isinstance(part, doc.Concat):
            for p in part.parts:
                tokens.extend(self._extract_all_tokens(p))
        elif isinstance(part, doc.Group):
            tokens.extend(self._extract_all_tokens(part.contents))
        elif isinstance(part, doc.Indent):
            tokens.extend(self._extract_all_tokens(part.contents))
        elif isinstance(part, doc.IfBreak):
            tokens.extend(self._extract_all_tokens(part.break_contents))
            tokens.extend(self._extract_all_tokens(part.flat_contents))
        elif isinstance(part, doc.Align):
            tokens.extend(self._extract_all_tokens(part.contents))
        return tokens

    def _inject_module_comments(
        self, module: uni.Module, concat_node: doc.Concat
    ) -> doc.Concat:
        """Inject comments at module level with fallback."""
        new_parts: list[doc.DocType] = []
        current_line = 1
        module_end = module.loc.last_line if module.loc else 99999
        child_idx = 0

        for part in concat_node.parts:
            if isinstance(part, doc.Line):
                new_parts.append(part)
                continue

            if child_idx < len(module.kid):
                child = module.kid[child_idx]

                # Add standalone comments before this child
                if hasattr(child, "loc") and child.loc:
                    comments_before = self._get_comments_in_range(
                        current_line, child.loc.first_line - 1
                    )
                    for comment_id, comment in comments_before:
                        if comment_id not in self.inline_comment_ids:
                            new_parts.append(self._create_standalone_comment(comment))
                            self.used_comments.add(comment_id)

                # Recursively process child
                new_parts.append(self._inject_comments(child, part))

                # Inline comments are injected via token-level detection in _inject_into_concat

                if hasattr(child, "loc") and child.loc:
                    current_line = child.loc.last_line + 1

                child_idx += 1
            else:
                new_parts.append(self._inject_comments(module, part))

        # Safety net: Ensure ALL comments are preserved
        for idx, comment in enumerate(self.ir_out.source.comments):
            if idx not in self.used_comments:
                if idx in self.inline_comment_ids:
                    new_parts.append(self._create_inline_comment(comment))
                else:
                    new_parts.append(self._create_standalone_comment(comment))
                self.used_comments.add(idx)

        return doc.Concat(new_parts, ast_node=module)

    def _inject_body_comments(
        self, ast_node: uni.UniNode, indent_node: doc.Indent
    ) -> doc.Indent:
        """Inject comments into body."""
        if not isinstance(ast_node.body, Sequence):
            return indent_node

        indent_contents = indent_node.contents
        if not isinstance(indent_contents, doc.Concat):
            return indent_node

        # Find body start
        body_start_line = None
        for kid in ast_node.kid:
            if isinstance(kid, uni.Token) and kid.name == Tok.LBRACE and kid.loc:
                body_start_line = kid.loc.last_line + 1
                break

        if not body_start_line:
            return indent_node

        new_parts: list[doc.DocType] = []
        current_line = body_start_line
        body_idx = 0

        for part in indent_contents.parts:
            if isinstance(part, doc.Line):
                new_parts.append(part)
                continue

            if body_idx < len(ast_node.body):
                body_item = ast_node.body[body_idx]

                # Add standalone comments before
                if hasattr(body_item, "loc") and body_item.loc:
                    comments_before = self._get_comments_in_range(
                        current_line, body_item.loc.first_line - 1
                    )
                    for comment_id, comment in comments_before:
                        if comment_id not in self.inline_comment_ids:
                            new_parts.append(self._create_standalone_comment(comment))
                            self.used_comments.add(comment_id)

                # Recursively process body item
                new_parts.append(self._inject_comments(body_item, part))

                # Note: Inline comments injected via token-level detection

                if hasattr(body_item, "loc") and body_item.loc:
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
                        new_parts.append(self._create_standalone_comment(comment))
                        self.used_comments.add(comment_id)
                    break

        return doc.Indent(doc.Concat(new_parts), ast_node=ast_node)

    def _get_comments_in_range(
        self, start_line: int, end_line: int
    ) -> list[tuple[int, uni.CommentToken]]:
        """Get all unused comments in line range."""
        result = []
        for idx, comment in enumerate(self.ir_out.source.comments):
            if (
                idx not in self.used_comments
                and start_line <= comment.loc.first_line <= end_line
            ):
                result.append((idx, comment))
        return result

    def _create_standalone_comment(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for standalone comment."""
        return doc.Concat([doc.Text(comment.value), doc.Line(hard=True)])

    def _create_inline_comment(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for inline comment (appears after code on same line)."""
        return doc.Concat(
            [doc.Text("  "), doc.Text(comment.value), doc.Line(hard=True)]
        )
