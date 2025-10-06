from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl
print('=== 1. Basic If Statement ===')
x = 10
if x > 5:
    print(f'x ({x}) is greater than 5')
if x < 5:
    print("This won't print")
print('\n=== 2. If-Else Statement ===')
age = 18
if age >= 18:
    print(f'Age {age}: Adult')
else:
    print(f'Age {age}: Minor')
print('\n=== 3. If-Elif-Else Chain ===')
score = 85
if score >= 90:
    print(f'Score {score}: Grade A')
elif score >= 80:
    print(f'Score {score}: Grade B')
elif score >= 70:
    print(f'Score {score}: Grade C')
elif score >= 60:
    print(f'Score {score}: Grade D')
else:
    print(f'Score {score}: Grade F')
print('\n=== 4. Multiple Elif Chains ===')
value = 15
if value < 5:
    print('Very low')
elif value < 10:
    print('Low')
elif value < 15:
    print('Medium')
elif value < 20:
    print('High')
else:
    print('Very high')
print('\n=== 5. Nested If Statements ===')
x = 15
y = 20
if x > 10:
    print(f'x ({x}) > 10')
    if y > 15:
        print(f'  and y ({y}) > 15')
        if x + y > 30:
            print(f'    and x + y ({x + y}) > 30')
print('\n=== 6. Chained Comparisons ===')
temp = 25
if 20 <= temp <= 30:
    print(f'Temperature {temp} is comfortable (20-30)')
if 0 < temp < 100:
    print(f'Temperature {temp} is in valid range (0-100)')
print('\n=== 7. Complex Boolean Expressions ===')
a = 10
b = 20
c = 30
if a > 5 and b > 15:
    print(f'Both conditions true: a={a}>5 AND b={b}>15')
if a > 100 or b > 15:
    print(f'At least one true: a={a}>100 OR b={b}>15')
if not a > 50:
    print(f'Negation: NOT (a={a}>50) is true')
if a > 5 and b > 10 or c < 20:
    print('Complex: (a>5 AND b>10) OR (c<20) is true')
print('\n=== 8. If Expression (Ternary) ===')
age = 20
status = 'adult' if age >= 18 else 'minor'
print(f'Age {age}: status = {status}')
score = 85
grade = 'A' if score >= 90 else 'B' if score >= 80 else 'C'
print(f'Score {score}: grade = {grade}')
x = 10
max_val = x if x > 5 else 5
print(f'max(x={x}, 5) = {max_val}')
print('\n=== 9. If with Different Data Types ===')
name = 'Alice'
if name == 'Alice':
    print(f'Hello, {name}!')
items = [1, 2, 3]
if len(items) > 0:
    print(f'List has {len(items)} items')
value = None
if value is None:
    print('value is None')
flag = True
if flag:
    print('flag is True')

def check_positive(n: int) -> str:
    if n > 0:
        return 'positive'
    elif n < 0:
        return 'negative'
    else:
        return 'zero'
print('\n=== 10. If in Functions ===')
print(f'check_positive(10) = {check_positive(10)}')
print(f'check_positive(-5) = {check_positive(-5)}')
print(f'check_positive(0) = {check_positive(0)}')

class DataNode(_jl.Node):
    value: int = 0
    active: bool = True

class Validator(_jl.Walker):
    valid_count: int = 0
    invalid_count: int = 0

    @_jl.entry
    def start(self, here: _jl.Root) -> None:
        print('\n=== 11. If in Walker Abilities ===')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.entry
    def validate(self, here: DataNode) -> None:
        if here.active:
            if here.value > 10:
                self.valid_count += 1
                print(f'  Valid: value={here.value}')
            else:
                self.invalid_count += 1
                print(f'  Invalid: value={here.value} (too low)')
        else:
            print('  Skipped: inactive node')
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))

    @_jl.exit
    def report(self, here) -> None:
        print(f'Validation complete: {self.valid_count} valid, {self.invalid_count} invalid')
node1 = DataNode(value=15, active=True)
node2 = DataNode(value=5, active=True)
node3 = DataNode(value=20, active=False)
_jl.connect(left=_jl.root(), right=node1)
_jl.connect(left=node1, right=node2)
_jl.connect(left=node2, right=node3)
_jl.spawn(_jl.root(), Validator())

class PathChecker(_jl.Walker):
    has_path: bool = False

    @_jl.entry
    def check(self, here: _jl.Root) -> None:
        print('\n=== 12. If with Edge References ===')
        outgoing = _jl.refs(_jl.Path(here)._out())
        if len(outgoing) > 0:
            print(f'Root has {len(outgoing)} outgoing edges')
            self.has_path = True
            _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))
        else:
            print('Root has no outgoing edges')

    @_jl.entry
    def check_node(self, here: DataNode) -> None:
        children = _jl.refs(_jl.Path(here)._out())
        if len(children) > 0:
            print(f'  Node value={here.value} has {len(children)} children')
            _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))
        else:
            print(f'  Node value={here.value} is a leaf (no children)')
_jl.spawn(_jl.root(), PathChecker())
print('\n=== 13. If with Membership Tests ===')
fruits = ['apple', 'banana', 'orange']
if 'apple' in fruits:
    print('apple is in the list')
if 'grape' not in fruits:
    print('grape is NOT in the list')
config = {'debug': True, 'port': 8080}
if 'debug' in config:
    print(f'debug setting: {config['debug']}')

def process_value(val: int) -> None:
    if val < 0:
        print(f'  Skipping negative value: {val}')
        return
    if val > 100:
        print(f'  Capping value at 100 (was {val})')
        val = 100
    print(f'  Processing value: {val}')
print('\n=== 14. Guard Pattern (If Without Else) ===')
process_value(-5)
process_value(50)
process_value(150)
print('\n=== 15. Conditional Execution Patterns ===')
x = 0
y = 10
if x != 0 and y / x > 5:
    print("This won't execute (short-circuit prevents division by zero)")
else:
    print('x is 0, division skipped due to short-circuit')
empty_list = []
if empty_list:
    print('List has items')
else:
    print('List is empty (falsy)')
non_empty = [1, 2, 3]
if non_empty:
    print(f'List has {len(non_empty)} items (truthy)')
print('\n✓ If statements demonstrated!')
