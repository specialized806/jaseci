from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl
print('=== 1. Basic Assignments ===')
x = 10
print(f'x = 10 → {x}')
a = b = c = 20
print(f'a = b = c = 20 → a={a}, b={b}, c={c}')
value = 100
print(f'let value = 100 → {value}')
print('\n=== 2. Type Annotations ===')
age: int = 25
name: str = 'Alice'
price: float = 19.99
active: bool = True
print(f'age: int = {age}, name: str = {name}')
result: str
result = 'computed'
print(f'result (declared then assigned) = {result}')
count: int = 5
print(f'let count: int = {count}')
print('\n=== 3. Augmented Assignments ===')
num = 10
num += 5
num -= 3
num *= 2
num /= 4
print(f'Arithmetic chain result: {num}')
num = 17
num %= 5
print(f'17 %= 5 → {num}')
num **= 3
print(f'2 **= 3 → {num}')
num = 20
num //= 3
print(f'20 //= 3 → {num}')
bits = 12
bits &= 7
bits |= 3
bits ^= 5
bits <<= 2
bits >>= 1
print(f'Bitwise chain result: {bits} (0b{bin(bits)[2:]})')
print('\n=== 4. Unpacking Assignments ===')
x, y = (10, 20)
print(f'(x, y) = (10, 20) → x={x}, y={y}')
x, y = (y, x)
print(f'After swap: x={x}, y={y}')
[a, b, c] = [1, 2, 3]
print(f'[a, b, c] = [1, 2, 3] → a={a}, b={b}, c={c}')
p, (q, r) = (5, (6, 7))
print(f'Nested: p={p}, q={q}, r={r}')
first, *rest = [1, 2, 3, 4, 5]
print(f'(first, *rest) → first={first}, rest={rest}')
head, *middle, tail = [10, 20, 30, 40, 50]
print(f'(head, *middle, tail) → head={head}, middle={middle}, tail={tail}')
*beginning, last = [100, 200, 300]
print(f'(*beginning, last) → beginning={beginning}, last={last}')

class DataNode(_jl.Node):
    value: int = 0
print('\n=== 5. Walrus Operator := ===')
n = 15
if n > 10:
    print(f'n={n} is > 10')
data = [1, 2, 3, 4, 5]
for value in data:
    if (doubled := (value * 2)) > 5:
        print(f'  {value} * 2 = {doubled} (> 5)')
_jl.connect(left=_jl.root(), right=(node1 := DataNode(value=10)))
_jl.connect(left=node1, right=(node2 := DataNode(value=20)))
print(f'OSP walrus: node1.value={node1.value}, node2.value={node2.value}')

class Calculator(_jl.Obj):
    total: int = 0

    def add(self, value: int) -> None:
        self.total += value
        return self.total

class Accumulator(_jl.Walker):
    sum: int = 0

    @_jl.entry
    def process(self, here: DataNode) -> None:
        self.sum += here.value
        _jl.visit(self, _jl.refs(_jl.Path(here)._out().visit()))
print('\n=== 6. Assignments in Methods & Abilities ===')
calc = Calculator()
calc.add(5)
calc.add(10)
print(f'Calculator total: {calc.total}')
acc = _jl.spawn(_jl.root(), Accumulator())
print(f'Accumulator sum: {acc.sum}')
global_var = 100

def outer() -> None:
    outer_var = 50

    def inner() -> None:
        result = global_var + outer_var
        return result
    return inner()
print('\n=== 7. Complex Contexts ===')

def compute(a: int, b: int) -> int:
    return a * b + 10
result = compute(5, 3)
print(f'Function result: {result}')
status = 'active' if True else 'inactive'
print(f'Ternary: {status}')
squares = [x ** 2 for x in range(1, 6)]
print(f'Comprehension: {squares}')

def get_coords() -> tuple:
    return (10, 20, 30)
px, py, pz = get_coords()
print(f'Multiple returns: px={px}, py={py}, pz={pz}')
print(f'Nested scopes: {outer()}')
print('\n✓ Assignments complete!')
