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
        # print(
        #     f"Enter a new scope for {key_node.__class__.__name__}::{key_node.scope_name}, current stack {len(self.scope_stack)}"
        # )

    def pop_scope(self) -> UniScopeNode:
        """Remove current scope from scope stack."""
        key_node = self.scope_stack.pop()
        # print(
        #     f"Exiting scope {key_node.__class__.__name__}::{key_node.scope_name}, current stack {len(self.scope_stack)}"
        # )
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
            if node.signature and isinstance(node.signature, uni.EventSignature):
                if node.method_owner.arch_type.name == 'KW_WALKER':
                    here_sym = self.cur_scope.def_insert(
                        uni.Name.gen_stub_from_node(
                            node, "here", set_name_of=node.method_owner
                        )
                    )
                    # TODO: Handle atom trailer here
                    # "can ability2 with MyNode.Inner.DeepInner entry"
                    node_name = node.signature.arch_tag_info.unparse()
                    par_tab = self.cur_scope.lookup(node_name).fetch_sym_tab
                    here_sym.symbol_table = par_tab
                    
                if node.method_owner.arch_type.name == 'KW_NODE':
                    visitor_sym = self.cur_scope.def_insert(
                        uni.Name.gen_stub_from_node(
                            node, "visitor", set_name_of=node.method_owner
                        )
                    )
                    # TODO: Handle atom trailer here
                    # "can ability2 with Mywalker.Inner.DeepInner entry"
                    walker_name = node.signature.arch_tag_info.unparse()
                    par_tab = self.cur_scope.lookup(walker_name).fetch_sym_tab
                    visitor_sym.symbol_table = par_tab

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
            # print(node.loc, self.cur_scope.scope_name, node.sym)
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
    #     # print(chain[0].sym_name, chain[0].sym_tab, "chain use lookup")
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
        """Resolve imports for atom trailers like 'apple.color.bla.blah'."""
        print(f"[DEBUG] Resolving import for: {node.unparse()}")
        
        if isinstance(node, uni.Assignment):
            self._resolve_assignment_imports(node)
        elif isinstance(node, uni.InForStmt):
            self._resolve_for_loop_imports(node)
        else:
            self.log_warning(f"Import resolution not implemented for {type(node).__name__}")

    def _resolve_assignment_imports(self, node: uni.Assignment) -> None:
        """Handle import resolution for assignment statements."""
        for target in node.target:
            if isinstance(target, uni.AtomTrailer):
                self._resolve_atom_trailer_import(target)

    def _resolve_for_loop_imports(self, node: uni.InForStmt) -> None:
        """Handle import resolution for for-loop statements."""
        if isinstance(node.target, uni.AtomTrailer):
            self._resolve_atom_trailer_import(node.target)

    def _resolve_atom_trailer_import(self, atom_trailer: uni.AtomTrailer) -> None:
        """
        Resolve imports for atom trailer like 'apple.color.bla.blah'.
        
        This handles cases where:
        - 'apple' is an imported module
        - We need to parse the module and link it properly
        - We need to iterate through the full chain and link each symbol
        """
        attr_list = atom_trailer.as_attr_list
        if not attr_list:
            raise ValueError("Atom trailer must have at least one attribute")
            
        first_obj = attr_list[0]
        print(f"[DEBUG] Processing atom trailer, first object: {first_obj.sym_name}")
        
        # Look up the first symbol in the chain
        first_obj_sym = self.cur_scope.lookup(first_obj.sym_name)
        
        if not first_obj_sym:
            print(f"[DEBUG] Symbol '{first_obj.sym_name}' not found in current scope")
            return
            
        if not first_obj_sym.imported:
            print(f"[DEBUG] Symbol '{first_obj.sym_name}' is not imported, skipping")
            return
            
        print(f"[DEBUG] Found imported symbol: {first_obj_sym.sym_name}")
        
        # Get the module path from the import
        import_node = self._find_import_for_symbol(first_obj_sym)
        if not import_node:
            self.log_error(f"Could not find import statement for symbol '{first_obj_sym.sym_name}'")
            return
        
        # Parse and link the imported module
        module_path = first_obj_sym.decl.find_parent_of_type(uni.ModulePath).resolve_relative_path() 
        
        if module_path:
            linked_module = self._parse_and_link_module(module_path, first_obj_sym)
            if linked_module:
                print(f"[DEBUG] Successfully linked module: {module_path}")
                # Now iterate through the full attribute chain
                self._link_attribute_chain(attr_list, first_obj_sym, linked_module)
            else:
                print(f"[DEBUG] Failed to link module: {module_path}")

    def _find_import_for_symbol(self, symbol: uni.Symbol) -> Optional[uni.Import]:
        """
        Find the import statement that declares the given symbol.
        
        This is used to resolve the module path for imported symbols.
        """
        if not symbol.decl:
            return None
            
        import_node = symbol.decl.find_parent_of_type(uni.Import)
        if import_node:
            return import_node
            
        # If not found, check the symbol's parent scopes
        current_scope = symbol.decl.parent_scope
        while current_scope:
            import_node = current_scope.find_first_of_type(uni.Import)
            if import_node:
                return import_node
            current_scope = current_scope.parent_scope
            
        return None

    def _link_attribute_chain(self, attr_list: list[uni.AstSymbolNode], first_symbol: uni.Symbol, current_module: uni.Module) -> None:
        """
        Link the full attribute chain (e.g., M1.M2.function) by:
        1. Starting with the first symbol (M1) linked to its module
        2. For each subsequent attribute, look it up in the previous symbol's table
        3. Add use references for each symbol in the chain
        4. Ensure that symbols are properly connected through their symbol tables
        """
        current_symbol = first_symbol
        current_sym_table = current_module.sym_tab
        
        print(f"[DEBUG] Starting attribute chain linking with {len(attr_list)} attributes")
        
        # Add use for the first symbol (M1)
        first_obj = attr_list[0]
        current_symbol.add_use(first_obj)
        print('first symbol', first_obj)
        print('current  symbol',current_symbol )
        print(f"[DEBUG] Added use for first symbol: {first_obj.sym_name}")
        print('uses', current_symbol.uses)
        
        # Iterate through remaining attributes in the chain
        for i in range(1, len(attr_list)):
            attr_node = attr_list[i]
            attr_name = attr_node.sym_name
            
            print(f"[DEBUG] Processing attribute {i}: {attr_name}")
            
            # Look up the attribute in the current symbol table
            attr_symbol = current_sym_table.lookup(attr_name)
            
            if not attr_symbol:
                print(f"[DEBUG] Attribute '{attr_name}' not found in symbol table")
                # If it's an imported symbol, we might need to parse its module
                if self._is_potential_import(attr_name, current_sym_table):
                    attr_symbol = self._resolve_nested_import(attr_name, current_sym_table)
                    
                if not attr_symbol:
                    self.log_error(f"Could not resolve attribute '{attr_name}' in chain")
                    break
            
            # Add use reference for this attribute
            attr_symbol.add_use(attr_node)
            print(f"[DEBUG] Added use for attribute: {attr_name}")
            
            # If this symbol has its own symbol table, update current context
            if hasattr(attr_symbol, 'symbol_table') and attr_symbol.symbol_table:
                current_sym_table = attr_symbol.symbol_table
                print(f"[DEBUG] Updated current symbol table to: {current_sym_table.scope_name}")
            elif attr_symbol.imported:
                # Try to resolve the imported symbol's module
                nested_module = self._resolve_imported_symbol_module(attr_symbol)
                if nested_module:
                    current_sym_table = nested_module.sym_tab
                    attr_symbol.symbol_table = current_sym_table
                    print(f"[DEBUG] Resolved imported symbol's module: {nested_module.loc.mod_path}")
                else:
                    print(f"[DEBUG] Could not resolve imported symbol's module for: {attr_name}")
            
            current_symbol = attr_symbol

    def _is_potential_import(self, attr_name: str, sym_table: uni.UniScopeNode) -> bool:
        """Check if an attribute might be an import that needs resolution."""
        # Look for import statements that might contain this attribute
        for import_node in sym_table.get_all_sub_nodes(uni.Import):
            for item in import_node.items:
                if hasattr(item, 'sym_name') and item.sym_name == attr_name:
                    return True
                elif hasattr(item, 'alias') and item.alias and item.alias.sym_name == attr_name:
                    return True
        return False

    def _resolve_nested_import(self, attr_name: str, sym_table: uni.UniScopeNode) -> Optional[uni.Symbol]:
        """Resolve a nested import within a module."""
        # Find the import statement for this attribute
        for import_node in sym_table.get_all_sub_nodes(uni.Import):
            for item in import_node.items:
                target_name = None
                if hasattr(item, 'alias') and item.alias and item.alias.sym_name == attr_name:
                    target_name = item.sym_name if hasattr(item, 'sym_name') else attr_name
                elif hasattr(item, 'sym_name') and item.sym_name == attr_name:
                    target_name = attr_name
                
                if target_name:
                    # Try to parse and link the module
                    try:
                        module_path = item.find_parent_of_type(uni.ModulePath).resolve_relative_path()
                        if module_path:
                            # Create a temporary symbol for this import
                            temp_symbol = uni.Symbol(
                                sym_name=attr_name,
                                decl=item,
                                access_spec=None,
                                imported=True
                            )
                            
                            linked_module = self._parse_and_link_module(module_path, temp_symbol)
                            if linked_module:
                                # Insert the symbol into the current symbol table
                                sym_table.def_insert(item, imported=True)
                                return temp_symbol
                    except Exception as e:
                        print(f"[DEBUG] Failed to resolve nested import for {attr_name}: {e}")
        
        return None

    def _resolve_imported_symbol_module(self, symbol: uni.Symbol) -> Optional[uni.Module]:
        """Resolve the module for an imported symbol."""
        if not symbol.imported or not symbol.decl:
            return None
            
        try:
            # Find the module path from the import declaration
            import_node = symbol.decl.find_parent_of_type(uni.Import)
            if not import_node:
                return None
                
            module_path = symbol.decl.find_parent_of_type(uni.ModulePath).resolve_relative_path()
            if not module_path:
                return None
                
            # Parse and link the module
            linked_module = self._parse_and_link_module(module_path, symbol)
            return linked_module
            
        except Exception as e:
            print(f"[DEBUG] Failed to resolve imported symbol module: {e}")
            return None
    
    def _parse_and_link_module(self, module_path: str, symbol: uni.Symbol) -> Optional[uni.Module]:
        """Parse the module and link it to the symbol."""
        try:
            print(f"[DEBUG] Attempting to parse module: {module_path}")
            existing_module = None
            # Check if module is already loaded
            if module_path in self.prog.mod.hub:
                existing_module = self.prog.mod.hub[module_path]
                print(f"[DEBUG] Module already loaded: {module_path}")
                symbol.symbol_table = existing_module.sym_tab
                return existing_module
            print(f"[DEBUG] Module not found in hub, parsing: {module_path}")
            with open(module_path, "r", encoding="utf-8") as file:
                source_str = file.read()
            # Parse the module using the same logic as JacProgram.build
            parsed_module:uni.Module = self.prog.parse_str(source_str=source_str, file_path=module_path)

            # Run the binder pass
            BinderPass(ir_in=parsed_module, prog=self.prog)
            # Link the symbol to the module's symbol table
            symbol.symbol_table = parsed_module.sym_tab
            print('sym.decl ',symbol.decl)
            print('sym.uses ',symbol.uses)
            
            print(f"[DEBUG] Successfully parsed and ran binder {symbol.symbol_table}")
            
            print(f"[DEBUG] Successfully parsed and linked module: {module_path}")
            print(f"[DEBUG] Module symbol table: {parsed_module.sym_tab.scope_name}")            
            return parsed_module
            
        except Exception as e:
            self.log_error(f"Failed to parse module '{module_path}': {str(e)}")
            print(f"[DEBUG] Exception during module parsing: {e}")
            return None
