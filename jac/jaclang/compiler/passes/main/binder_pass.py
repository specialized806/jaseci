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

    def is_global(self, node: uni.Symbol) -> bool:
        for symbol in self.cur_globals:
            if symbol.sym_name == node.sym_name:
                return True
        return False

    @property
    def cur_module_scope(self) -> UniScopeNode:
        """Return the current module."""
        return self.scope_stack[0]

    @property
    def cur_imports(self) -> list[uni.Symbol]:
        pass

    ###############################################
    ## Handling for nodes that creates new scope ##
    ###############################################
    # TODO: Remove this and depend on the fact that all of them are UniScopeNode
    # Q: Does there any node exist that inherit from UniScopeNode and shouldn't be there?
    SCOPE_NODES = (
        uni.MatchCase,
        uni.DictCompr,
        uni.InnerCompr,
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
    )

    def enter_node(self, node) -> None:
        if isinstance(node, self.SCOPE_NODES):
            self.push_scope_and_link(node)
        super().enter_node(node)

    def exit_node(self, node):
        if isinstance(node, self.SCOPE_NODES):
            self.pop_scope()
        super().exit_node(node)

    #####################################
    ## Main logic for symbols creation ##
    #####################################
    def enter_assignment(self, node: uni.Assignment) -> None:
        """Enter assignment node."""
        for i in node.target:
            if isinstance(i, uni.AtomTrailer):
                # Need to get the correct symbol of the first item in the atom trailer
                # We need to check cur_globals first to get the correct symbol
                # TODO: check if this is an imported symbol and if yes then resolve this import
                i.sym_tab.chain_def_insert(i.as_attr_list)
            elif isinstance(i, uni.AstSymbolNode):
                if self.is_global(i):
                    return
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
            node.sym_tab.def_insert(uni.Name.gen_stub_from_node(node, "self"))
            node.sym_tab.def_insert(
                uni.Name.gen_stub_from_node(
                    node, "super", set_name_of=node.method_owner
                )
            )
        self.globals_stack.append([])

    def exit_ability(self, node: uni.Ability) -> None:
        self.globals_stack.pop()

    def enter_global_stmt(self, node: uni.GlobalStmt) -> None:
        for name in node.target:
            sym = self.cur_scope.lookup(name.sym_name)
            if not sym:
                sym = self.cur_module_scope.def_insert(name, single_decl="assignment")
            self.globals_stack[-1].append(sym)

    def enter_import(self, node: uni.Import) -> None:
        if node.is_absorb:
            print("Need to resolve", node.unparse())
            return
        for item in node.items:
            if item.alias:
                self.cur_scope.def_insert(
                    item.alias, imported=True, single_decl="import"
                )
            else:
                self.cur_scope.def_insert(item, imported=True)

    # def enter_import(self, node: uni.Import) -> None:
    #     """Enter import node."""
    #     # 1. import math
    #     if node.items and not node.from_loc:
    #         # print('node.items.unparsed:', node.items[0].unparse())
    #         self.cur_scope.def_insert(node.items[0], single_decl="import",imported=True)

    #     # 2. import math as m

    #     # 3. import math, random

    #     # 4. import math as m, random as r

    #     # 5. import from math {sqrt}
    #     if node.from_loc and node.items:
    #         print('import from:', node.from_loc.unparse())
    #         self.cur_scope.def_insert(
    #             node.items[0], single_decl="import", imported=True
    #         )
    #     #     path = node.from_loc
    #     #     with open(
    #     #         path.resolve_relative_path(), "r"
    #     #     ) as f:
    #     #         source_str = f.read()
    #     #         new_mod = self.prog.parse_str(
    #     #             source_str,
    #     #             file_path=path.resolve_relative_path()
    #     #         )

    #     #         # print('parsing done:', new_mod.name)
    #     #         from jaclang.compiler.passes.main import BinderPass
    #     #         BinderPass(ir_in=new_mod, prog=self.prog)
    #     #         new_mod.parent_scope = self.cur_scope
    #     #         node.parent.kid_scope.append(new_mod)
    #     #     self.cur_scope.def_insert(node.items[0], single_decl="import", imported=True)
    #         # print(f'---------new modd - ------------------')
    #         # print('-------',new_mod.loc.mod_path,'-------')
    #         # print(new_mod.sym_pp())
    #         # print('-----------------------')
    #         # exit()

    #     # 6. import from math {sqrt as s, pi as p}
    #     # 7. include math                     <---- equivalent to import all
    #     # 1. import math
    #     # 2. import math as m
    #     # 3. import math, random
    #     # 4. import math as m, random as r
    #     # 5. import from math {sqrt}
    #     # 6. import from math {sqrt as s, pi as p}
    #     # 7. include math                     <---- equivalent to import all

    # def enter_atom_trailer(self, node: uni.AtomTrailer) -> None:
    #     """Enter atom trailer node."""
    #     from icecream import ic
    #     ic('enter_atom_trailer', node.target.unparse())
    #     attr_list = node.as_attr_list
    #     while attr_list:
    #         attr = attr_list.pop(0)
    #         if isinstance(attr, uni.AstSymbolNode):
    #             print('attr:', attr.unparse())
    #             p = self.cur_sym_tab[-1].lookup(attr.sym_name)
    #             if p and p.imported:
    #                 # p.add_use(attr)
    #                 # check binderrequired and bind if required
    #                 if p.binder_required(attr_list[-1]):
    #                     print('binding:', p.decl.loc.mod_path)
    #                     print(p.decl.name_of)
    #                     print(p.decl.name_of.parent.unparse())
    #                     print('fom loc :',p.decl.name_of.parent.from_loc)
    #                     if isinstance(p.decl.name_of,uni.ModuleItem) and p.decl.name_of.parent.from_loc:
    #                             q = self.prog.bind(
    #                                 p.decl.name_of.parent.from_loc.resolve_relative_path(),
    #                             )
    #                             print('binding done:', q.name)
    #                             pass
    #                     else:
    #                         pass
    #                     # exit()
    #                     # self.prog.bind(

    #                     # )
    #                 print('found attr:', p)
    #             elif p :
    #                 print('found attr:', p)
    #                 p.add_use(attr)
    #             else:
    #                 self.ice(
    #                     f"Symbol '{attr.sym_name}' not found in current scope: {self.cur_scope.scope_name}"
    #                 )
    #         else:
    #             self.ice(f"Expected AstSymbolNode, got {type(attr)}")

    # def exit_global_vars(self, node: uni.GlobalVars) -> None:
    #     for i in self.get_all_sub_nodes(node, uni.Assignment):
    #         for j in i.target:
    #             if isinstance(j, uni.AstSymbolNode):
    #                 j.sym_tab.def_insert(j, access_spec=node, single_decl="global var")
    #             else:
    #                 self.ice("Expected name type for global vars")

    # def enter_test(self, node: uni.Test) -> None:
    #     self.push_scope_and_link(node)
    #     import unittest

    #     for i in [j for j in dir(unittest.TestCase()) if j.startswith("assert")]:
    #         node.sym_tab.def_insert(
    #             uni.Name.gen_stub_from_node(node, i, set_name_of=node)
    #         )

    # def exit_test(self, node: uni.Test) -> None:
    #     self.pop_scope()

    # def enter_archetype(self, node: uni.Archetype) -> None:
    #     self.push_scope_and_link(node)
    #     assert node.parent_scope is not None
    #     node.parent_scope.def_insert(node, access_spec=node, single_decl="archetype")

    # def exit_archetype(self, node: uni.Archetype) -> None:
    #     self.pop_scope()

    # def enter_impl_def(self, node: uni.ImplDef) -> None:
    #     self.push_scope_and_link(node)
    #     assert node.parent_scope is not None
    #     node.parent_scope.def_insert(node, single_decl="impl")

    # def exit_impl_def(self, node: uni.ImplDef) -> None:
    #     self.pop_scope()

    # def enter_sem_def(self, node: uni.SemDef) -> None:
    #     self.push_scope_and_link(node)
    #     assert node.parent_scope is not None
    #     node.parent_scope.def_insert(node, single_decl="sem")

    # def exit_sem_def(self, node: uni.SemDef) -> None:
    #     self.pop_scope()

    # def enter_enum(self, node: uni.Enum) -> None:
    #     self.push_scope_and_link(node)
    #     assert node.parent_scope is not None
    #     node.parent_scope.def_insert(node, access_spec=node, single_decl="enum")

    # def exit_enum(self, node: uni.Enum) -> None:
    # self.pop_scope()
