class SemTokManager {
    """Initialize semantic token manager."""
    def init(self: SemTokManager, ir: uni.Module) -> None {
        self.aaaaastatic_sem_tokens: List[Tuple[
            lspt.Position,
            int,
            int,
            uni.AstSymbolNode
        ]] = self.gen_sem_tok_node(ir);
    }
}


with entry {
    c = (
        a()
        if 1 and isinstance(a, int)
        and isinstance(a, int)
        and isinstance(a, int)
        and isinstance(a, int)
        and isinstance(a, int)
        else (
            999
            if isinstance(a, int)
            and isinstance(a, int)
            and isinstance(a, int)
            and isinstance(4, bool)
            else 7
            )
        );
}
