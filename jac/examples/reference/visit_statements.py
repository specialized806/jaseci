from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl

class Friend(_jl.Edge):
    pass

class Family(_jl.Edge):
    pass

class Colleague(_jl.Edge):
    relationship_strength: int

class Person(_jl.Node):
    name: str

class BasicVisitor(_jl.Walker):

    @_jl.entry
    def travel(self, here: _jl.Root) -> None:
        print('BasicVisitor at root: visiting outgoing edges')
        if not _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit())):
            print('  No outgoing edges - dead end!')

    @_jl.entry
    def travel_person(self, here: Person) -> None:
        print(f'  BasicVisitor reached: {here.name}')

class SimpleVisitor(_jl.Walker):

    @_jl.entry
    def go(self, here: _jl.Root) -> None:
        print('SimpleVisitor at root: visiting all outgoing without else clause')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def go_person(self, here: Person) -> None:
        print(f'  SimpleVisitor at: {here.name}')

class DirectionalDemo(_jl.Walker):

    @_jl.entry
    def demo(self, here: _jl.Root) -> None:
        print('DirectionalDemo: outgoing edges [-->]')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def demo_person(self, here: Person) -> None:
        print(f'  At {here.name}')

class TypedEdgeWalker(_jl.Walker):

    @_jl.entry
    def find_friends(self, here: Person) -> None:
        print(f'TypedEdgeWalker at {here.name}: visiting only Friend edges [->:Friend:->]')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out(edge=lambda i: isinstance(i, Friend)).visit()))

class FilteredWalker(_jl.Walker):

    @_jl.entry
    def find_strong(self, here: Person) -> None:
        print(f'FilteredWalker at {here.name}: visiting where relationship_strength > 5')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out(edge=lambda i: isinstance(i, Colleague) and i.relationship_strength > 5).visit()))

class TargetedVisitor(_jl.Walker):
    target: Person

    @_jl.entry
    def jump(self, here: _jl.Root) -> None:
        print('TargetedVisitor: jumping directly to target node (not via edge)')
        _jl.visit(self, self.target)

    @_jl.entry
    def at_target(self, here: Person) -> None:
        print(f'  Arrived at target: {here.name}')
        _jl.disengage(self)
        return

class ConditionalVisitor(_jl.Walker):
    depth: int = 0
    max_depth: int = 2

    @_jl.entry
    def traverse(self, here: _jl.Root) -> None:
        print(f'ConditionalVisitor: depth={self.depth}, max={self.max_depth}')
        if self.depth < self.max_depth:
            self.depth += 1
            print(f'  Visiting (incrementing depth to {self.depth})')
            _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))
        else:
            print('  Max depth reached - stopping')

    @_jl.entry
    def traverse_person(self, here: Person) -> None:
        print(f'  At {here.name}, depth={self.depth}')
        if self.depth < self.max_depth:
            self.depth += 1
            _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

class MultiStageVisitor(_jl.Walker):

    @_jl.entry
    def multi_stage(self, here: _jl.Root) -> None:
        print('MultiStageVisitor: visiting Friends then Family sequentially')
        print('  Stage 1: Friends')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out(edge=lambda i: isinstance(i, Friend)).visit()))
        print('  Stage 2: Family')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out(edge=lambda i: isinstance(i, Family)).visit()))

    @_jl.entry
    def at_person(self, here: Person) -> None:
        print(f'    Reached: {here.name}')

class IncomingEdgeDemo(_jl.Walker):

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print('IncomingEdgeDemo: visiting outgoing first')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def at_person(self, here: Person) -> None:
        print(f'  At {here.name} - demonstrating edge variations:')
        print('    [<-:Family:<-] would visit incoming Family edges')
        print('    [<-:Friend:->] would visit bidirectional Friend edges')
print('=== Building Social Network ===')
alice = Person(name='Alice')
bob = Person(name='Bob')
charlie = Person(name='Charlie')
diana = Person(name='Diana')
_jl.connect(left=_jl.root(), right=alice)
_jl.connect(left=alice, right=bob, edge=Friend)
_jl.connect(left=alice, right=charlie, edge=Friend)
_jl.connect(left=alice, right=diana, edge=Family)
_jl.connect(left=alice, right=bob, edge=Colleague(relationship_strength=3))
_jl.connect(left=alice, right=charlie, edge=Colleague(relationship_strength=8))
print('\n=== Test 1: Basic Visitor with else clause ===')
_jl.spawn(_jl.root(), BasicVisitor())
print('\n=== Test 2: Simple Visitor (no else) ===')
_jl.spawn(_jl.root(), SimpleVisitor())
print('\n=== Test 3: Directional edges demo ===')
_jl.spawn(_jl.root(), DirectionalDemo())
print('\n=== Test 4: Typed Edge Walker (Friends only) ===')
_jl.spawn(alice, TypedEdgeWalker())
print('\n=== Test 5: Filtered Walker (Strong colleagues) ===')
_jl.spawn(alice, FilteredWalker())
print('\n=== Test 6: Targeted Visitor (Direct node visit) ===')
_jl.spawn(_jl.root(), TargetedVisitor(target=charlie))
print('\n=== Test 7: Conditional Visitor (Depth limited) ===')
_jl.spawn(_jl.root(), ConditionalVisitor())
print('\n=== Test 8: Multi-Stage Visitor ===')
_jl.spawn(_jl.root(), MultiStageVisitor())
print('\n=== Test 9: Incoming edge demonstrations ===')
_jl.spawn(_jl.root(), IncomingEdgeDemo())
print('\n✓ All visit statement variations demonstrated!')
