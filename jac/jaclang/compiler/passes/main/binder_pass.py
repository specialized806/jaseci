"""Symbol Table Construction + Binding Pass for the Jac compiler.

This pass builds the hierarchical symbol table structure for the entire program by:

1. Creating symbol tables for each scope in the program (modules, archetypes, abilities, blocks)
2. Establishing parent-child relationships between nested scopes
3. Registering symbols for various language constructs:
   - Global variables and imports
   - Archetypes (objects, nodes, edges, walkers) and their members
   - Abilities (methods and functions) and their parameters
   - Enums and their values
   - Local variables in various block scopes

4. Adding special symbols like 'self' and 'super' in appropriate contexts
5. Maintaining scope boundaries for proper symbol resolution

The symbol table is a fundamental data structure that enables name resolution,
type checking, and semantic analysis throughout the compilation process.
"""

from typing import Optional

import jaclang.compiler.unitree as uni
from jaclang.compiler.passes import UniPass
from jaclang.compiler.unitree import UniScopeNode


class BinderPass(UniPass):
    """Jac Binder pass."""

    def before_pass(self) -> None:
        """Before pass."""
        self.scope_stack: list[UniScopeNode] = []
        self.globals_stack: list[list[uni.Symbol]] = []

    ###########################################################
    ## Helper functions for symbol table stack manipulations ##
    ###########################################################
    def push_scope_and_link(self, key_node: uni.UniScopeNode) -> None:
        """Add scope into scope stack."""
        if not len(self.scope_stack):
            self.scope_stack.append(key_node)
        else:
            self.scope_stack.append(self.cur_scope.link_kid_scope(key_node=key_node))
        print(
            f"Enter a new scope for {key_node.__class__.__name__}::{key_node.scope_name}, current stack {len(self.scope_stack)}"
        )

    def pop_scope(self) -> UniScopeNode:
        """Remove current scope from scope stack."""
        key_node = self.scope_stack.pop()
        print(
            f"Exiting scope {key_node.__class__.__name__}::{key_node.scope_name}, current stack {len(self.scope_stack)}"
        )
        return key_node

    @property
    def cur_scope(self) -> UniScopeNode:
        """Return current scope."""
        return self.scope_stack[-1]

    @property
    def cur_globals(self) -> list[uni.Symbol]:
        if len(self.globals_stack):
            return self.globals_stack[-1]
        else:
            return []

    # TODO: Every call for this function should be moved to symbol table it self
    def check_global(self, node_name: str) -> Optional[uni.Symbol]:
        for symbol in self.cur_globals:
            if symbol.sym_name == node_name:
                return symbol
        return None

    @property
    def cur_module_scope(self) -> UniScopeNode:
        """Return the current module."""
        return self.scope_stack[0]

    ###############################################
    ## Handling for nodes that creates new scope ##
    ###############################################
    # TODO: Remove this and depend on the fact that all of them are UniScopeNode
    # Q: Does there any node exist that inherit from UniScopeNode and shouldn't be there?
    SCOPE_NODES = (
        uni.MatchCase,
        uni.DictCompr,
        uni.ListCompr,
        uni.GenCompr,
        uni.SetCompr,
        uni.LambdaExpr,
        uni.WithStmt,
        uni.WhileStmt,
        uni.InForStmt,
        uni.IterForStmt,
        uni.TryStmt,
        uni.Except,
        uni.FinallyStmt,
        uni.IfStmt,
        uni.ElseIf,
        uni.ElseStmt,
        uni.TypedCtxBlock,
        uni.Module,
        uni.Ability,
        uni.Test,
        uni.Archetype,
        uni.ImplDef,
        uni.SemDef,
        uni.Enum,
    )

    # All nodes that creates new global stack
    GLOBAL_STACK_NODES = (uni.Ability, uni.Archetype)

    def enter_node(self, node) -> None:
        if isinstance(node, self.SCOPE_NODES):
            self.push_scope_and_link(node)
        if isinstance(node, self.GLOBAL_STACK_NODES):
            self.globals_stack.append([])
        super().enter_node(node)

    def exit_node(self, node):
        if isinstance(node, self.SCOPE_NODES):
            self.pop_scope()
        if isinstance(node, self.GLOBAL_STACK_NODES):
            self.globals_stack.pop()
        super().exit_node(node)

    #####################################
    ## Main logic for symbols creation ##
    #####################################
    def enter_assignment(self, node: uni.Assignment) -> None:
        """Enter assignment node."""
        for i in node.target:
            if isinstance(i, uni.AtomTrailer):
                first_obj = i.as_attr_list[0]
                first_obj_sym = self.cur_scope.lookup(
                    first_obj.sym_name
                )  # Need to perform lookup as the symbol is not bound yet
                if first_obj_sym.imported:
                    self.resolve_import(node)

            elif isinstance(i, uni.AstSymbolNode):
                #  TODO: Move this into symbol table
                if glob_sym := self.check_global(i.sym_name):
                    i.name_spec._sym = glob_sym
                    glob_sym.add_defn(i)
                else:
                    self.cur_scope.def_insert(i, single_decl="assignment")

            else:
                self.log_error("Assignment target not valid")

    def enter_ability(self, node: uni.Ability) -> None:
        assert node.parent_scope is not None
        symbol = node.parent_scope.def_insert(
            node, access_spec=node, single_decl="ability"
        )
        symbol.symbol_table = self.cur_scope
        if node.is_method:
            self.cur_scope.def_insert(uni.Name.gen_stub_from_node(node, "self"))
            self.cur_scope.def_insert(
                uni.Name.gen_stub_from_node(
                    node, "super", set_name_of=node.method_owner
                )
            )

    def enter_global_stmt(self, node: uni.GlobalStmt) -> None:
        for name in node.target:
            sym = self.cur_module_scope.lookup(name.sym_name)
            if not sym:
                sym = self.cur_module_scope.def_insert(name, single_decl="assignment")
            self.globals_stack[-1].append(sym)

    def enter_import(self, node: uni.Import) -> None:
        if node.is_absorb:
            self.resolve_import(node)
            return
        for item in node.items:
            if item.alias:
                self.cur_scope.def_insert(
                    item.alias, imported=True, single_decl="import"
                )
            else:
                self.cur_scope.def_insert(item, imported=True)

    def enter_test(self, node: uni.Test) -> None:
        import unittest

        for i in [j for j in dir(unittest.TestCase()) if j.startswith("assert")]:
            self.cur_scope.def_insert(
                uni.Name.gen_stub_from_node(node, i, set_name_of=node)
            )

    def enter_archetype(self, node: uni.Archetype) -> None:
        assert node.parent_scope is not None
        node.parent_scope.def_insert(node, access_spec=node, single_decl="archetype")

    def enter_impl_def(self, node: uni.ImplDef) -> None:
        assert node.parent_scope is not None
        node.parent_scope.def_insert(node, single_decl="impl")

    def enter_sem_def(self, node: uni.SemDef) -> None:
        assert node.parent_scope is not None
        node.parent_scope.def_insert(node, single_decl="sem")

    def enter_enum(self, node: uni.Enum) -> None:
        assert node.parent_scope is not None
        node.parent_scope.def_insert(node, access_spec=node, single_decl="enum")

    def enter_param_var(self, node: uni.ParamVar) -> None:
        self.cur_scope.def_insert(node)

    def enter_has_var(self, node: uni.HasVar) -> None:
        if isinstance(node.parent, uni.ArchHas):
            self.cur_scope.def_insert(
                node, single_decl="has var", access_spec=node.parent
            )
        else:
            self.ice("Inconsistency in AST, has var should be under arch has")

    def enter_in_for_stmt(self, node: uni.InForStmt) -> None:
        if isinstance(node.target, uni.AtomTrailer):
            if isinstance(node.target, uni.AtomTrailer):
                first_obj = node.target.as_attr_list[0]
                first_obj_sym = self.cur_scope.lookup(
                    first_obj.sym_name
                )  # Need to perform lookup as the symbol is not bound yet
                if first_obj_sym.imported:
                    self.resolve_import(node)
            # node.target.sym_tab.chain_def_insert(node.target.as_attr_list)
        elif isinstance(node.target, uni.AstSymbolNode):
            #  TODO: Move this into symbol table
            if glob_sym := self.check_global(node.target.sym_name):
                node.target.name_spec._sym = glob_sym
                glob_sym.add_defn(node.target)
            else:
                self.cur_scope.def_insert(node.target)
        else:
            self.log_error("For loop assignment target not valid")

    ##################################
    ##    Creating symbols from     ##
    ##    Comprehensions support    ##
    ##################################

    # In compr we use the symbol before it's being declared [print(x) for x in [1, 2, 3]]
    # so to fix this we need to change the traversal here to start with the inner compr first
    # then traverse the expr

    def enter_list_compr(self, node: uni.ListCompr) -> None:
        self.prune()
        for compr in node.compr:
            self.traverse(compr)
        self.traverse(node.out_expr)

    def enter_gen_compr(self, node: uni.GenCompr) -> None:
        self.enter_list_compr(node)

    def enter_set_compr(self, node: uni.SetCompr) -> None:
        self.enter_list_compr(node)

    def enter_dict_compr(self, node: uni.DictCompr) -> None:
        self.prune()
        for compr in node.compr:
            self.traverse(compr)
        self.traverse(node.kv_pair)

    def enter_inner_compr(self, node: uni.InnerCompr) -> None:
        if isinstance(node.target, uni.AtomTrailer):
            self.cur_scope.chain_def_insert(node.target.as_attr_list)

        elif isinstance(node.target, uni.AstSymbolNode):
            self.cur_scope.def_insert(node.target)

        else:
            self.log_error("Named target not valid")

    #####################
    ## Collecting uses ##
    #####################
    def exit_name(self, node: uni.Name) -> None:

        if isinstance(node.parent, uni.AtomTrailer):
            return

        # assert node.sym is not None, f"{node.loc}"

        #  TODO: Move this into symbol table
        if glob_sym := self.check_global(node.value):
            if not node.sym:
                glob_sym.add_use(node)
        else:
            # assert node.sym is not None, f"{node.loc}"
            print(node.loc, self.cur_scope.scope_name, node.sym)
            self.cur_scope.use_lookup(node, sym_table=self.cur_scope)

    # def enter_archetype(self, node: uni.Archetype) -> None:
    #     node.sym_tab.inherit_baseclasses_sym(node)

    #     def inform_from_walker(node: uni.UniNode) -> None:
    #         for i in (
    #             node.get_all_sub_nodes(uni.VisitStmt)
    #             + node.get_all_sub_nodes(uni.DisengageStmt)
    #             + node.get_all_sub_nodes(uni.EdgeOpRef)
    #             + node.get_all_sub_nodes(uni.EventSignature)
    #         ):
    #             i.from_walker = True

    #     if node.arch_type.name == Tok.KW_WALKER:
    #         inform_from_walker(node)
    #         for i in self.get_all_sub_nodes(node, uni.Ability):
    #             if isinstance(i.body, uni.ImplDef):
    #                 inform_from_walker(i.body)

    # def enter_enum(self, node: uni.Enum) -> None:
    #     node.sym_tab.inherit_baseclasses_sym(node)

    # def enter_type_ref(self, node: uni.TypeRef) -> None:
    #     self.cur_scope.use_lookup(node)

    # def enter_atom_trailer(self, node: uni.AtomTrailer) -> None:
    #     chain = node.as_attr_list
    #     node.sym_tab.chain_use_lookup(chain)

    # def enter_special_var_ref(self, node: uni.SpecialVarRef) -> None:
    #     node.sym_tab.use_lookup(node)

    # def enter_float(self, node: uni.Float) -> None:
    #     node.sym_tab.use_lookup(node)

    # def enter_int(self, node: uni.Int) -> None:
    #     node.sym_tab.use_lookup(node)

    # def enter_string(self, node: uni.String) -> None:
    #     node.sym_tab.use_lookup(node)

    # def enter_bool(self, node: uni.Bool) -> None:
    #     node.sym_tab.use_lookup(node)

    # def enter_builtin_type(self, node: uni.BuiltinType) -> None:
    #     node.sym_tab.use_lookup(node)

    def enter_expr_as_item(self, node: uni.ExprAsItem) -> None:
        if node.alias:
            if isinstance(node.alias, uni.AtomTrailer):
                self.cur_scope.chain_def_insert(node.alias.as_attr_list)
            elif isinstance(node.alias, uni.AstSymbolNode):
                if glob_sym := self.check_global(node.alias.sym_name):
                    node.alias.name_spec._sym = glob_sym
                    glob_sym.add_defn(node.alias)
                else:
                    self.cur_scope.def_insert(node.alias)
            else:
                self.log_error("For expr as target not valid")

    def resolve_import(self, node: uni.UniNode):
        print("Need to resolve import for", node.unparse())
