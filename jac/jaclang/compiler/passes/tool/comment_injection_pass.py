"""Pass to inject comments into annotated DocIR with inline detection."""

from typing import Optional, Sequence, Set

import jaclang.compiler.passes.tool.doc_ir as doc
import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass


class CommentInjectionPass(UniPass):
    """
    Injects comments into DocIR using AST annotations and token-level inline detection.

    This pass uses src_terminals to precisely detect which comments are inline
    (have code on the same line before them), then injects them at the correct
    positions using AST node annotations.
    """

    def before_pass(self) -> None:
        """Initialize pass with comment tracking and inline detection."""
        self.comment_map: dict[int, list[tuple[int, uni.CommentToken]]] = {}
        self.used_comments: Set[int] = set()
        self.inline_comment_ids: Set[int] = set()

        if isinstance(self.ir_out, uni.Module):
            # Build comment map
            for idx, comment in enumerate(self.ir_out.source.comments):
                line = comment.loc.first_line
                if line not in self.comment_map:
                    self.comment_map[line] = []
                self.comment_map[line].append((idx, comment))

            # Use src_terminals to detect inline comments
            self._detect_inline_comments()

        return super().before_pass()

    def _detect_inline_comments(self) -> None:
        """
        Use src_terminals to precisely detect which comments are inline.

        A comment is inline if there's a code token on the same line before it.
        This leverages the linear token sequence to get perfect detection.
        """
        if not isinstance(self.ir_out, uni.Module):
            return

        # Merge tokens and comments in source order
        all_items = []
        for token in self.ir_out.src_terminals:
            if not isinstance(token, uni.CommentToken):
                all_items.append(("token", token))

        for idx, comment in enumerate(self.ir_out.source.comments):
            all_items.append(("comment", idx, comment))

        all_items.sort(key=lambda x: (x[-1].loc.first_line, x[-1].loc.col_start))

        # Mark inline comments
        for i, item in enumerate(all_items):
            if item[0] == "comment":
                comment_idx, comment = item[1], item[2]
                # Check if previous item is a token on the same line
                if i > 0 and all_items[i - 1][0] == "token":
                    prev_token = all_items[i - 1][1]
                    if prev_token.loc.last_line == comment.loc.first_line:
                        self.inline_comment_ids.add(comment_idx)

    def after_pass(self) -> None:
        """Inject comments into the module's DocIR."""
        if not self.comment_map or not isinstance(self.ir_out, uni.Module):
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
            # For regular Concats (not module), just recurse
            new_parts = [self._inject_comments(node_context, p) for p in doc_node.parts]
            return doc.Concat(new_parts, ast_node=node_context)
        elif isinstance(doc_node, doc.Group):
            node_context = (
                doc_node.ast_node if hasattr(doc_node, "ast_node") else ast_context
            )
            # Process contents first
            new_contents = self._inject_comments(node_context, doc_node.contents)

            # For annotated Groups (statements, declarations), check for inline comments
            if doc_node.ast_node and hasattr(node_context, "loc"):
                # Extract last token from the group to check for inline comments
                tokens = self._extract_tokens_from_part(new_contents)
                if tokens:
                    last_token = max(
                        tokens, key=lambda t: (t.loc.last_line, t.loc.col_end)
                    )
                    # Check for inline comments on the last token's line
                    inline_comments_to_add = []
                    for comment_id, comment in list(
                        self.comment_map.get(last_token.loc.last_line, [])
                    ):
                        if comment_id in self.used_comments:
                            continue
                        if comment_id in self.inline_comment_ids:
                            if comment.loc.first_line == last_token.loc.last_line:
                                inline_comments_to_add.append((comment_id, comment))

                    # If we have inline comments, wrap the contents with them
                    if inline_comments_to_add:
                        parts_with_comments = [new_contents]
                        for comment_id, comment in inline_comments_to_add:
                            parts_with_comments.append(
                                self._create_inline_comment(comment)
                            )
                            self.used_comments.add(comment_id)
                        new_contents = doc.Concat(parts_with_comments)

            return doc.Group(
                new_contents,
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

    def _inject_into_concat_with_tokens(
        self, parts: list[doc.DocType], ast_context: uni.UniNode
    ) -> list[doc.DocType]:
        """
        Inject comments into Concat parts using token-level precision.

        This only injects inline comments after Line nodes (statement boundaries),
        not mid-expression, to maintain readability.
        """
        new_parts: list[doc.DocType] = []

        for i, part in enumerate(parts):
            # Recursively process the part
            processed_part = self._inject_comments(ast_context, part)
            new_parts.append(processed_part)

            # Only inject inline comments after hard Line nodes (statement/declaration boundaries)
            # This prevents injecting mid-expression
            if isinstance(part, doc.Line) and part.hard and i > 0:
                # Check the previous part for its last token
                prev_part = new_parts[i]  # The part we just added before the Line
                tokens_in_prev = self._extract_tokens_from_part(prev_part)
                if tokens_in_prev:
                    # Get the last token from the previous part
                    last_token = max(
                        tokens_in_prev, key=lambda t: (t.loc.last_line, t.loc.col_end)
                    )

                    # Find all unused inline comments on that line
                    for comment_id, comment in list(
                        self.comment_map.get(last_token.loc.last_line, [])
                    ):
                        if comment_id in self.used_comments:
                            continue
                        if comment_id in self.inline_comment_ids:
                            if comment.loc.first_line == last_token.loc.last_line:
                                # Insert BEFORE the Line node
                                new_parts.insert(
                                    i, self._create_inline_comment(comment)
                                )
                                self.used_comments.add(comment_id)

        return new_parts

    def _extract_tokens_from_part(self, part: doc.DocType) -> list[uni.Token]:
        """Extract all source tokens from a DocIR part."""
        tokens = []
        if isinstance(part, doc.Text) and part.source_token:
            tokens.append(part.source_token)
        elif isinstance(part, doc.Concat):
            for p in part.parts:
                tokens.extend(self._extract_tokens_from_part(p))
        elif isinstance(part, doc.Group):
            tokens.extend(self._extract_tokens_from_part(part.contents))
        elif isinstance(part, doc.Indent):
            tokens.extend(self._extract_tokens_from_part(part.contents))
        elif isinstance(part, doc.IfBreak):
            tokens.extend(self._extract_tokens_from_part(part.break_contents))
            tokens.extend(self._extract_tokens_from_part(part.flat_contents))
        elif isinstance(part, doc.Align):
            tokens.extend(self._extract_tokens_from_part(part.contents))
        return tokens

    def _inject_module_comments(
        self, module: uni.Module, concat_node: doc.Concat
    ) -> doc.Concat:
        """Inject comments between module-level declarations."""
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

                # Add inline comments after this child
                if hasattr(child, "loc") and child.loc:
                    inline_comments = self._get_comments_on_line(child.loc.last_line)
                    for comment_id, comment in inline_comments:
                        if comment_id in self.inline_comment_ids:
                            new_parts.append(self._create_inline_comment(comment))
                            self.used_comments.add(comment_id)

                    current_line = child.loc.last_line + 1

                child_idx += 1
            else:
                new_parts.append(self._inject_comments(module, part))

        # Add remaining comments
        remaining = self._get_comments_in_range(current_line, module_end)
        for comment_id, comment in remaining:
            new_parts.append(self._create_standalone_comment(comment))
            self.used_comments.add(comment_id)

        # Safety net: Add ANY unused comments at the end (preserves all comments)
        for line in sorted(self.comment_map.keys()):
            for comment_id, comment in self.comment_map[line]:
                if comment_id not in self.used_comments:
                    # Preserve with proper indentation based on inline status
                    if comment_id in self.inline_comment_ids:
                        new_parts.append(self._create_inline_comment(comment))
                    else:
                        new_parts.append(self._create_standalone_comment(comment))
                    self.used_comments.add(comment_id)

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
                processed_item = self._inject_comments(body_item, part)
                new_parts.append(processed_item)

                # Add inline comments using token-level precision
                if hasattr(body_item, "loc") and body_item.loc:
                    # Extract all tokens from this body item's DocIR
                    tokens = self._extract_tokens_from_part(processed_item)
                    if tokens:
                        # Find the last token
                        last_token = max(
                            tokens, key=lambda t: (t.loc.last_line, t.loc.col_end)
                        )
                        # Check for inline comments on the last token's line
                        for comment_id, comment in list(
                            self.comment_map.get(last_token.loc.last_line, [])
                        ):
                            if comment_id in self.used_comments:
                                continue
                            if comment_id in self.inline_comment_ids:
                                if comment.loc.first_line == last_token.loc.last_line:
                                    new_parts.append(
                                        self._create_inline_comment(comment)
                                    )
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
                        new_parts.append(self._create_standalone_comment(comment))
                        self.used_comments.add(comment_id)
                    break

        return doc.Indent(doc.Concat(new_parts), ast_node=ast_node)

    def _get_comments_in_range(
        self, start_line: int, end_line: int
    ) -> list[tuple[int, uni.CommentToken]]:
        """Get all unused comments in line range."""
        result = []
        for line in range(start_line, end_line + 1):
            if line in self.comment_map:
                for comment_id, comment in self.comment_map[line]:
                    if comment_id not in self.used_comments:
                        result.append((comment_id, comment))
        return result

    def _get_comments_on_line(self, line: int) -> list[tuple[int, uni.CommentToken]]:
        """Get all unused comments on a specific line."""
        result = []
        if line in self.comment_map:
            for comment_id, comment in self.comment_map[line]:
                if comment_id not in self.used_comments:
                    result.append((comment_id, comment))
        return result

    def _create_standalone_comment(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for standalone comment."""
        return doc.Concat([doc.Text(comment.value), doc.Line(hard=True)])

    def _create_inline_comment(self, comment: uni.CommentToken) -> doc.DocType:
        """Create DocIR for inline comment."""
        return doc.Concat(
            [doc.Text("  "), doc.Text(comment.value), doc.Line(hard=True)]
        )
