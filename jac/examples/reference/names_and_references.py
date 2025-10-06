from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl

class Counter(_jl.Obj):
    count: int = 0

    def increment(self) -> None:
        self.count += 1
        print(f'Counter at {self.count}')

    def reset(self) -> None:
        self.count = 0
        self.increment()

class Animal(_jl.Obj):
    species: str = 'Unknown'

    def __init__(self, species: str) -> None:
        self.species = species
        print(f'Animal init: {species}')

    def speak(self) -> None:
        print(f'{self.species} makes a sound')

class Dog(Animal, _jl.Obj):
    breed: str = 'Mixed'

    def __init__(self, breed: str) -> None:
        super().__init__(species='Dog')
        self.breed = breed
        print(f'Dog init: {breed}')

    def speak(self) -> None:
        super().speak()
        print('Dog says: Woof!')

class Task(_jl.Node):
    title: str = 'Unnamed'
    priority: int = 0
    completed: bool = False

class TaskProcessor(_jl.Walker):
    processed_count: int = 0

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print(f'TaskProcessor: Starting at {here}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def process(self, here: Task) -> None:
        print(f'  Processing: {here.title} (priority {here.priority})')
        here.completed = True
        self.processed_count += 1
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

class InteractiveTask(_jl.Node):
    title: str = 'Interactive'
    last_visitor: str = 'None'

    @_jl.entry
    def track(self, visitor: TaskProcessor) -> None:
        self.last_visitor = f'TaskProcessor #{visitor.processed_count}'
        print(f'    {self.title} visited by walker (processed {visitor.processed_count} so far)')

class RootExplorer(_jl.Walker):
    start_node: object = None

    @_jl.entry
    def init_walker(self, here: _jl.Root) -> None:
        self.start_node = _jl.root()
        print(f'RootExplorer: Started at root {_jl.root()}')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def process_task(self, here: Task) -> None:
        print(f'  At {here.title}, root is {_jl.root()}')
        _jl.disengage(self)
        return

class ConfiguredObject(_jl.Obj):
    name: str = 'default'
    value: int = 0
    computed: int = 0

    def __init__(self, name: str, value: int) -> None:
        self.name = name
        self.value = value
        print(f'init: {name} = {value}')
        self.__post_init__()

    def __post_init__(self) -> None:
        self.computed = self.value * 2
        print(f'postinit: computed = {self.computed}')

class DataNode(_jl.Node):
    data: str = 'data'
    access_count: int = 0

    @_jl.entry
    def log_access(self, visitor: RootExplorer) -> None:
        self.access_count += 1
        print(f"    DataNode '{self.data}' accessed by {visitor.__class__.__name__}")
        print(f'      self == here: {self is here}')

class ReferenceDemo(_jl.Walker):
    walker_id: str = 'demo'

    @_jl.entry
    def demonstrate(self, here: _jl.Root) -> None:
        print(f'Walker {self.walker_id}:')
        print(f'  self = {self}')
        print(f'  here = {here}')
        print(f'  root = {_jl.root()}')
        print(f'  here is root: {here is _jl.root()}')

class PersistentData(_jl.Node):
    value: str = 'data'
    connected_to_root: bool = False

class PersistenceDemo(_jl.Walker):

    @_jl.entry
    def explain(self, here: _jl.Root) -> None:
        print('\n=== root Persistence Model ===')
        print('The root node is the persistence anchor:')
        print('  - Anything connected to root persists')
        print('  - Each user has their own root')
        print("  - root is globally accessible via 'root' keyword")
        data1 = PersistentData(value='persisted')
        data2 = PersistentData(value='temporary')
        _jl.connect(left=_jl.root(), right=data1)
        data1.connected_to_root = True
        print(f'  data1 connected to root: {data1.connected_to_root}')
        print(f'  data2 connected to root: {data2.connected_to_root}')

class WorkItem(_jl.Node):
    name: str = 'item'
    processed_by: list = _jl.field(factory=lambda: [])

    @_jl.entry
    def track_processing(self, visitor: TaskProcessor) -> None:
        self.processed_by.append(visitor.walker_id if hasattr(visitor, 'walker_id') else 'TaskProcessor')
        print(f'    {self.name} processed by {visitor.__class__.__name__}')
        print(f'      (root is always accessible: {_jl.root()})')
print('=== 1. self - Instance Reference ===')
counter = Counter()
counter.increment()
counter.increment()
counter.reset()
print('\n=== 2. super - Parent Reference ===')
dog = Dog(breed='Labrador')
dog.speak()
print('\n=== 3. here - Current Node ===')
task1 = Task(title='Write Code', priority=10)
task2 = Task(title='Write Tests', priority=8)
_jl.connect(left=_jl.root(), right=task1)
_jl.connect(left=task1, right=task2)
proc = TaskProcessor()
_jl.spawn(_jl.root(), proc)
print(f'Completed: task1={task1.completed}, task2={task2.completed}')
print('\n=== 4. visitor - Current Walker ===')
interactive1 = InteractiveTask(title='Interactive 1')
interactive2 = InteractiveTask(title='Interactive 2')
_jl.connect(left=_jl.root(), right=interactive1)
_jl.connect(left=interactive1, right=interactive2)
_jl.spawn(_jl.root(), TaskProcessor())
print(f'Last visitor to interactive1: {interactive1.last_visitor}')
print('\n=== 5. root - Root Node Reference ===')
explorer = RootExplorer()
_jl.spawn(_jl.root(), explorer)
print(f'Walker stored root: {explorer.start_node is _jl.root()}')
print('\n=== 6. init and postinit ===')
config = ConfiguredObject(name='test', value=5)
print(f'Configured: name={config.name}, value={config.value}, computed={config.computed}')
print('\n=== 7. Special References in Node Abilities ===')
data_node = DataNode(data='test_data')
_jl.connect(left=_jl.root(), right=data_node)
_jl.spawn(_jl.root(), RootExplorer())
print('\n=== 8. Special References in Walker Abilities ===')
_jl.spawn(_jl.root(), ReferenceDemo(walker_id='ref_demo'))
print('\n=== 9. root Persistence Model ===')
_jl.spawn(_jl.root(), PersistenceDemo())
print('\n=== 10. Combining References ===')
work1 = WorkItem(name='Work Item 1')
work2 = WorkItem(name='Work Item 2')
_jl.connect(left=_jl.root(), right=work1)
_jl.connect(left=work1, right=work2)
_jl.spawn(_jl.root(), TaskProcessor())
print(f'work1 processed by: {work1.processed_by}')
print('\n✓ Names and references demonstrated!')
