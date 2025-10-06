from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl

class Person(_jl.Node):
    name: str
    processed: bool = False

class BasicDisengage(_jl.Walker):

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print('BasicDisengage: Starting at root')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def check(self, here: Person) -> None:
        print(f'  Visiting: {here.name}')
        if here.name == 'Bob':
            print('  Found Bob - disengaging!')
            _jl.disengage(self)
            return
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

class SkipWalker(_jl.Walker):

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print('\nSkipWalker: Demonstrating skip')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def process(self, here: Person) -> None:
        if here.name == 'Charlie':
            print(f'  Skipping {here.name}')
            return
        print(f'  Processing {here.name}')
        here.processed = True
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

class ComparisonWalker(_jl.Walker):
    mode: str = 'normal'

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print(f'\\nComparisonWalker: mode={self.mode}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def handle(self, here: Person) -> None:
        print(f'  At {here.name}')
        if self.mode == 'disengage' and here.name == 'Bob':
            print('    Using disengage - walker stops completely')
            _jl.disengage(self)
            return
        if self.mode == 'skip' and here.name == 'Bob':
            print('    Using skip - skips this node, continues')
            return
        print(f'    Processed {here.name}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

class LoopControl(_jl.Walker):

    @_jl.entry
    def demonstrate(self, here: _jl.Root) -> None:
        print('\nLoopControl: Break and Continue')
        print('  Break example:')
        for i in range(5):
            if i == 3:
                print(f'    Breaking at {i}')
                break
            print(f'    i={i}')
        print('  Continue example:')
        for i in range(5):
            if i == 2:
                continue
            print(f'    i={i}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def show(self, here: Person) -> None:
        print(f'  At {here.name} - disengage would stop walker here')
        _jl.disengage(self)
        return

class DepthLimited(_jl.Walker):
    depth: int = 0
    max_depth: int = 2

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print(f'\\nDepthLimited: max_depth={self.max_depth}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def traverse(self, here: Person) -> None:
        self.depth += 1
        print(f'  Depth {self.depth}: {here.name}')
        if self.depth >= self.max_depth:
            print('  Max depth reached - disengaging')
            _jl.disengage(self)
            return
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))
print('=== Building Graph ===\n')
alice = Person(name='Alice')
bob = Person(name='Bob')
charlie = Person(name='Charlie')
diana = Person(name='Diana')
_jl.connect(left=_jl.root(), right=alice)
_jl.connect(left=alice, right=bob)
_jl.connect(left=alice, right=charlie)
_jl.connect(left=bob, right=diana)
print('Graph: root -> Alice -> Bob -> Diana')
print('                    \\-> Charlie\n')
print('=== Test 1: Basic Disengage ===')
_jl.spawn(_jl.root(), BasicDisengage())
print('\n=== Test 2: Skip Statement ===')
_jl.spawn(_jl.root(), SkipWalker())
print(f'  Charlie processed: {charlie.processed}')
print(f'  Bob processed: {bob.processed}')
print('\n=== Test 3a: Normal Mode ===')
_jl.spawn(_jl.root(), ComparisonWalker(mode='normal'))
print('\n=== Test 3b: Disengage Mode ===')
_jl.spawn(_jl.root(), ComparisonWalker(mode='disengage'))
print('\n=== Test 3c: Skip Mode ===')
_jl.spawn(_jl.root(), ComparisonWalker(mode='skip'))
print('\n=== Test 4: Loop Control ===')
_jl.spawn(_jl.root(), LoopControl())
print('\n=== Test 5: Depth-Limited Walker ===')
_jl.spawn(_jl.root(), DepthLimited())
print('\n=== Control Flow Summary ===')
print('  • disengage - Stops entire walker execution immediately')
print('  • skip - Skips current node processing, walker continues')
print('  • break - Exits innermost loop')
print('  • continue - Skips to next loop iteration')
print('  • return - Exits function/method')
print('\n✓ Disengage statements demonstrated!')
