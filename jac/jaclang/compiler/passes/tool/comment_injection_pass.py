"""Pass to inject comments using token-level precision."""

from typing import Sequence, Set

import jaclang.compiler.passes.tool.doc_ir as doc
import jaclang.compiler.unitree as uni
from jaclang.compiler.constant import Tokens as Tok
from jaclang.compiler.passes import UniPass


class CommentInjectionPass(UniPass):
    """
    Injects comments using token sequence analysis for perfect precision.

    Uses src_terminals to detect inline vs standalone comments, then
    injects them using source_token annotations with automatic duplicate
    Line collapsing.
    """

    def before_pass(self) -> None:
        """Initialize with token analysis."""
        self.inline_comment_ids: Set[int] = set()
        self.used_comments: Set[int] = set()
        self.token_to_comment: dict[int, list[tuple[int, uni.CommentToken]]] = {}

        if isinstance(self.ir_out, uni.Module):
            self._analyze_comments()

        return super().before_pass()

    def _analyze_comments(self) -> None:
        """Analyze token sequence to detect inline comments and build lookup map."""
        # Merge tokens + comments in source order
        items: list[tuple[str, int, uni.Token | uni.CommentToken]] = []

        for token in self.ir_out.src_terminals:
            if not isinstance(token, uni.CommentToken):
                items.append(("token", id(token), token))

        for idx, comment in enumerate(self.ir_out.source.comments):
            items.append(("comment", idx, comment))

        items.sort(key=lambda x: (x[2].loc.first_line, x[2].loc.col_start))

        # Analyze each comment
        for i, item in enumerate(items):
            if item[0] != "comment":
                continue

            comment_idx, comment = item[1], item[2]

            # Find left neighbor token
            left_token = None
            for j in range(i - 1, -1, -1):
                if items[j][0] == "token":
                    left_token = items[j][2]
                    break

            # Detect inline (comment on same line as left token)
            if left_token and left_token.loc.last_line == comment.loc.first_line:
                self.inline_comment_ids.add(comment_idx)
                # Map left_token -> comment for injection
                token_id = id(left_token)
                if token_id not in self.token_to_comment:
                    self.token_to_comment[token_id] = []
                self.token_to_comment[token_id].append((comment_idx, comment))

    def after_pass(self) -> None:
        """Inject comments."""
        if not isinstance(self.ir_out, uni.Module):
            return

        if hasattr(self.ir_out.gen, "doc_ir"):
            self.ir_out.gen.doc_ir = self._process(self.ir_out, self.ir_out.gen.doc_ir)

    def _process(self, ctx: uni.UniNode, node: doc.DocType) -> doc.DocType:
        """Main recursive processor with type-specific handling."""
        if isinstance(node, doc.Concat):
            ctx = node.ast_node if hasattr(node, "ast_node") else ctx
            if isinstance(ctx, uni.Module):
                return self._handle_module(ctx, node)
            return doc.Concat(self._inject_into_parts(node.parts, ctx), ast_node=ctx)
        elif isinstance(node, doc.Group):
            ctx = node.ast_node if hasattr(node, "ast_node") else ctx
            return doc.Group(
                self._process(ctx, node.contents),
                node.break_contiguous,
                node.id,
                ast_node=ctx,
            )
        elif isinstance(node, doc.Indent):
            ctx = node.ast_node if hasattr(node, "ast_node") else ctx
            if node.ast_node and hasattr(ctx, "body"):
                return self._handle_body(ctx, node)
            return doc.Indent(self._process(ctx, node.contents), ast_node=ctx)
        elif isinstance(node, doc.IfBreak):
            return doc.IfBreak(
                self._process(ctx, node.break_contents),
                self._process(ctx, node.flat_contents),
            )
        elif isinstance(node, doc.Align):
            return doc.Align(self._process(ctx, node.contents), node.n)
        return node

    def _inject_into_parts(
        self, parts: list[doc.DocType], ctx: uni.UniNode
    ) -> list[doc.DocType]:
        """Inject comments into a parts list using token detection."""
        result = []

        for i, part in enumerate(parts):
            processed = self._process(ctx, part)
            result.append(processed)

            # Find tokens in this part and inject their inline comments
            tokens = self._get_tokens(processed)
            if tokens:
                last_token = max(tokens, key=lambda t: (t.loc.last_line, t.loc.col_end))
                token_id = id(last_token)

                if token_id in self.token_to_comment:
                    for comment_idx, comment in self.token_to_comment[token_id]:
                        if comment_idx not in self.used_comments:
                            add_line = True
                            if i + 1 < len(parts) and self._starts_with_line(
                                parts[i + 1]
                            ):
                                add_line = False

                            result.append(
                                self._make_inline_comment(comment, add_line=add_line)
                            )

                            self.used_comments.add(comment_idx)

        return result

    def _get_tokens(self, node: doc.DocType) -> list[uni.Token]:
        """Extract source tokens (visitor pattern for type safety)."""
        if isinstance(node, doc.Text):
            return [node.source_token] if node.source_token else []
        elif isinstance(node, (doc.Concat, doc.Group, doc.Indent, doc.Align)):
            tokens = []
            children = node.parts if isinstance(node, doc.Concat) else [node.contents]
            for child in children:
                tokens.extend(self._get_tokens(child))
            return tokens
        elif isinstance(node, doc.IfBreak):
            return self._get_tokens(node.break_contents) + self._get_tokens(
                node.flat_contents
            )
        return []

    def _get_ast_node(self, node: doc.DocType) -> uni.UniNode | None:
        """Extract the ast_node from a DocType node."""
        if hasattr(node, "ast_node"):
            return node.ast_node
        return None

    def _handle_module(self, module: uni.Module, concat: doc.Concat) -> doc.Concat:
        """Handle module-level comment injection."""
        result = []
        current_line = 1
        child_idx = 0

        for part in concat.parts:
            if isinstance(part, doc.Line):
                result.append(part)
                continue

            if child_idx < len(module.kid):
                child = module.kid[child_idx]

                # Add standalone comments before child
                if hasattr(child, "loc") and child.loc:
                    for idx, comment in enumerate(self.ir_out.source.comments):
                        if (
                            idx not in self.used_comments
                            and idx not in self.inline_comment_ids
                            and current_line
                            <= comment.loc.first_line
                            < child.loc.first_line
                        ):
                            result.append(self._make_standalone_comment(comment))
                            self.used_comments.add(idx)

                    current_line = child.loc.last_line + 1

                result.append(self._process(child, part))
                child_idx += 1
            else:
                result.append(self._process(module, part))

        # Safety net: Add unused comments
        for idx, comment in enumerate(self.ir_out.source.comments):
            if idx not in self.used_comments:
                result.append(
                    self._make_inline_comment(comment)
                    if idx in self.inline_comment_ids
                    else self._make_standalone_comment(comment)
                )

        return doc.Concat(result, ast_node=module)

    def _handle_body(self, node: uni.UniNode, indent: doc.Indent) -> doc.Indent:
        """Handle body comment injection."""
        if not isinstance(node.body, Sequence) or not isinstance(
            indent.contents, doc.Concat
        ):
            return indent

        # Find body start
        body_start = next(
            (
                k.loc.last_line + 1
                for k in node.kid
                if isinstance(k, uni.Token) and k.name == Tok.LBRACE and k.loc
            ),
            None,
        )
        if not body_start:
            return indent

        result = []
        current_line = body_start
        body_idx = 0

        for part in indent.contents.parts:
            if isinstance(part, doc.Line):
                result.append(part)
                continue

            # Check if this part corresponds to a body item
            part_ast_node = self._get_ast_node(part)
            is_body_item = (
                body_idx < len(node.body) and part_ast_node is node.body[body_idx]
            )

            if is_body_item:
                body_item = node.body[body_idx]

                # Add standalone comments before
                if hasattr(body_item, "loc") and body_item.loc:
                    for idx, comment in enumerate(self.ir_out.source.comments):
                        if (
                            idx not in self.used_comments
                            and idx not in self.inline_comment_ids
                            and current_line
                            <= comment.loc.first_line
                            < body_item.loc.first_line
                        ):
                            result.append(self._make_standalone_comment(comment))
                            self.used_comments.add(idx)

                    current_line = body_item.loc.last_line + 1

                result.append(self._process(body_item, part))
                body_idx += 1
            else:
                # For non-body items (like comma tokens), still check for inline comments
                processed_part = self._process(node, part)
                result.append(processed_part)

                # Inject inline comments for tokens in this part
                tokens = self._get_tokens(processed_part)
                if tokens:
                    last_token = max(
                        tokens, key=lambda t: (t.loc.last_line, t.loc.col_end)
                    )
                    token_id = id(last_token)

                    if token_id in self.token_to_comment:
                        for comment_idx, comment in self.token_to_comment[token_id]:
                            if comment_idx not in self.used_comments:
                                result.append(
                                    self._make_inline_comment(comment, add_line=False)
                                )
                                self.used_comments.add(comment_idx)

        # Find closing brace and add any remaining standalone comments
        body_end = next(
            (
                k.loc.first_line
                for k in node.kid
                if isinstance(k, uni.Token) and k.name == Tok.RBRACE and k.loc
            ),
            None,
        )
        if body_end:
            for idx, comment in enumerate(self.ir_out.source.comments):
                if (
                    idx not in self.used_comments
                    and idx not in self.inline_comment_ids
                    and current_line <= comment.loc.first_line < body_end
                ):
                    result.append(self._make_standalone_comment(comment))
                    self.used_comments.add(idx)

        return doc.Indent(doc.Concat(result), ast_node=node)

    def _make_standalone_comment(self, comment: uni.CommentToken) -> doc.DocType:
        """Create standalone comment DocIR."""
        return doc.Concat([doc.Text(comment.value), doc.Line(hard=True)])

    def _make_inline_comment(
        self, comment: uni.CommentToken, add_line: bool = True
    ) -> doc.DocType:
        """Create inline comment DocIR."""
        parts: list[doc.DocType] = [doc.Text("  "), doc.Text(comment.value)]
        if add_line:
            parts.append(doc.Line(hard=True))
        return doc.Concat(parts)

    def _starts_with_line(self, part: doc.DocType) -> bool:
        """Check whether the given doc part begins with a line break."""
        if isinstance(part, doc.Line):
            return True
        if isinstance(part, doc.Concat):
            for child in part.parts:
                if isinstance(child, doc.Text) and not child.text.strip():
                    continue
                return self._starts_with_line(child)
            return False
        if isinstance(part, doc.Group):
            return self._starts_with_line(part.contents)
        if isinstance(part, doc.Indent):
            return self._starts_with_line(part.contents)
        if isinstance(part, doc.Align):
            return self._starts_with_line(part.contents)
        if isinstance(part, doc.IfBreak):
            return self._starts_with_line(part.break_contents)
        return False
