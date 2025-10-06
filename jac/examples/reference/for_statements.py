from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl
print('=== 1. Basic For-In Loop ===')
for char in 'Jac':
    print(f'  char: {char}')
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(f'  fruit: {fruit}')
print('\n=== 2. For-In with Range ===')
for i in range(3, 7):
    print(f'  i = {i}')
for j in range(0, 10, 2):
    print(f'  j = {j}')
for k in range(5):
    print(f'  k = {k}')
print('\n=== 3. For-To-By Loop (Jac-specific) ===')
i = 0
while i < 5:
    print(f'  i = {i}')
    i += 1
j = 10
while j > 5:
    print(f'  j = {j}')
    j -= 1
k = 0
while k < 10:
    print(f'  k = {k}')
    k += 2
print('\n=== 4. For with Break ===')
for num in range(10):
    if num == 5:
        print(f'  Breaking at {num}')
        break
    print(f'  num = {num}')
print('\n=== 5. For with Continue ===')
for num in range(10):
    if num % 2 == 0:
        continue
    print(f'  odd: {num}')
print('\n=== 6. For with Else Clause ===')
for x in [1, 2, 3]:
    print(f'  x = {x}')
else:
    print('  Loop completed normally')
for num in range(10):
    if num == 3:
        print('  Breaking at 3')
        break
    print(f'  num = {num}')
else:
    print("  This won't print due to break")
print('\n=== 7. Nested For Loops ===')
for i in range(3):
    for j in range(2):
        print(f'  i={i}, j={j}')
for i in ['a', 'b']:
    j = 0
    while j < 2:
        print(f'  {i}{j}')
        j += 1
print('\n=== 8. For with Tuple Access ===')
pairs = [(1, 'one'), (2, 'two'), (3, 'three')]
for pair in pairs:
    num = pair[0]
    word = pair[1]
    print(f'  {num}: {word}')
data = [(1, (10, 20)), (2, (30, 40))]
for item in data:
    idx = item[0]
    inner = item[1]
    a = inner[0]
    b = inner[1]
    print(f'  idx={idx}, a={a}, b={b}')
print('\n=== 9. For with Enumerate ===')
items = ['apple', 'banana', 'cherry']
for enum_pair in enumerate(items):
    idx = enum_pair[0]
    item = enum_pair[1]
    print(f'  {idx}: {item}')
for enum_pair in enumerate(items, start=1):
    idx = enum_pair[0]
    item = enum_pair[1]
    print(f'  #{idx}: {item}')
print('\n=== 10. For with Zip ===')
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
for zipped in zip(names, ages):
    name = zipped[0]
    age = zipped[1]
    print(f'  {name} is {age} years old')
scores = [90, 85, 95]
for zipped in zip(names, ages, scores):
    name = zipped[0]
    age = zipped[1]
    score = zipped[2]
    print(f'  {name}: age={age}, score={score}')
print('\n=== 11. List Comprehensions ===')
squares = [x ** 2 for x in range(5)]
print(f'  Squares: {squares}')
evens = [x for x in range(10) if x % 2 == 0]
print(f'  Evens: {evens}')
upper = [s.upper() for s in ['hello', 'world']]
print(f'  Upper: {upper}')
pairs = [(x, y) for x in range(3) for y in range(2)]
print(f'  Pairs: {pairs}')
print('\n=== 12. Dictionary Comprehensions ===')
squares_dict = {x: x ** 2 for x in range(5)}
print(f'  Squares dict: {squares_dict}')
pairs = [('a', 1), ('b', 2), ('c', 3)]
mapping = {pair[0]: pair[1] for pair in pairs}
print(f'  Mapping: {mapping}')
even_squares = {x: x ** 2 for x in range(10) if x % 2 == 0}
print(f'  Even squares: {even_squares}')
print('\n=== 13. Set Comprehensions ===')
unique_lengths = {len(word) for word in ['apple', 'pie', 'banana']}
print(f'  Unique lengths: {unique_lengths}')
mods = {x % 3 for x in range(10)}
print(f'  Modulos: {mods}')

class Task(_jl.Node):
    title: str = 'Task'
    priority: int = 1
    completed: bool = False

class TaskProcessor(_jl.Walker):
    processed: list = _jl.field(factory=lambda: [])
    total_priority: int = 0

    @_jl.entry
    def process_all(self, here: _jl.Root) -> None:
        print('\n=== 14. For in Walker Abilities (OSP) ===')
        tasks = _jl.refs(_jl.Path(here)._out())
        for task_node in tasks:
            print(f'  Processing: {task_node.title}')
            self.processed.append(task_node.title)
            self.total_priority += task_node.priority
        print(f'  Total tasks: {len(self.processed)}')
        print(f'  Total priority: {self.total_priority}')
task1 = Task(title='Write code', priority=3)
task2 = Task(title='Review PR', priority=2)
task3 = Task(title='Deploy', priority=5)
_jl.connect(left=_jl.root(), right=task1)
_jl.connect(left=_jl.root(), right=task2)
_jl.connect(left=_jl.root(), right=task3)
_jl.spawn(_jl.root(), TaskProcessor())

class Person(_jl.Node):
    name: str = 'Person'
    age: int = 0

class Friendship(_jl.Edge):
    strength: int = 5
    years: int = 1

class NetworkAnalyzer(_jl.Walker):
    friend_count: int = 0
    total_strength: int = 0

    @_jl.entry
    def analyze(self, here: Person) -> None:
        print('\\n=== 15. For with Edge Iteration (OSP) ===')
        print(f"  Analyzing {here.name}'s network:")
        friends = _jl.refs(_jl.Path(here)._out())
        for friend in friends:
            self.friend_count += 1
            print(f'    Friend: {friend.name}, age: {friend.age}')
        print(f'  Total friends: {self.friend_count}')
        _jl.disengage(self)
        return
alice = Person(name='Alice', age=30)
bob = Person(name='Bob', age=35)
charlie = Person(name='Charlie', age=28)
_jl.connect(left=_jl.root(), right=alice)
_jl.connect(left=alice, right=bob)
_jl.connect(left=alice, right=charlie)
_jl.spawn(alice, NetworkAnalyzer())

def sum_list(numbers: list) -> int:
    total = 0
    for num in numbers:
        total += num
    return total

def find_max(values: list) -> int:
    if len(values) == 0:
        return 0
    max_val = values[0]
    for val in values:
        if val > max_val:
            max_val = val
    return max_val
print('\n=== 16. For in Functions ===')
nums = [5, 10, 15, 20, 25]
print(f'  Sum: {sum_list(nums)}')
print(f'  Max: {find_max(nums)}')
print('\n=== 17. For with Dictionary Iteration ===')
config = {'host': 'localhost', 'port': 8080, 'debug': True}
print('  Keys:')
for key in config:
    print(f'    {key}')
print('  Values:')
for value in config.values():
    print(f'    {value}')
print('  Items:')
for item in config.items():
    key = item[0]
    value = item[1]
    print(f'    {key}: {value}')
print('\n=== 18. For with Conditional Logic ===')
numbers = [5, 12, 8, 20, 3, 15]
filtered = []
for num in numbers:
    if num > 10:
        print(f'  Including: {num}')
        filtered.append(num)
    else:
        print(f'  Skipping: {num}')
print(f'  Filtered {len(filtered)} numbers: {filtered}')
print('\n=== 19. For with String Methods ===')
text = 'Hello World'
print('  Characters:')
for char in text:
    print(f"    '{char}'")
print('  Words:')
for word in text.split():
    print(f'    {word}')
multiline = 'Line 1\nLine 2\nLine 3'
print('  Lines:')
for line in multiline.split('\n'):
    print(f'    {line}')
print('\n=== 20. Performance Patterns ===')
items = [10, 20, 30, 40, 50]
item_count = len(items)
print(f'  Processing {item_count} items:')
for i in range(item_count):
    print(f'    Item {i}: {items[i]}')
print('  Better pattern with enumerate:')
for enum_pair in enumerate(items):
    idx = enum_pair[0]
    item = enum_pair[1]
    print(f'    Item {idx}: {item}')
print('\n✓ For statements demonstrated!')
