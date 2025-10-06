from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _jl
print('=== 1. Basic While Loop ===')
x = 0
while x < 5:
    print(f'  x = {x}')
    x += 1
print('\n=== 2. While with Counter ===')
count = 0
while count < 3:
    print(f'  Count: {count}')
    count += 1
print(f'  Final count: {count}')
print('\n=== 3. While with Break ===')
i = 0
while i < 10:
    if i == 5:
        print(f'  Breaking at {i}')
        break
    print(f'  i = {i}')
    i += 1
print('\n=== 4. While with Continue ===')
num = 0
while num < 10:
    num += 1
    if num % 2 == 0:
        continue
    print(f'  odd: {num}')
print('\n=== 5. While with Else Clause ===')
count = 0
while count < 3:
    print(f'  count = {count}')
    count += 1
else:
    print('  Loop completed normally')
i = 0
while i < 10:
    if i == 3:
        print('  Breaking at 3')
        break
    print(f'  i = {i}')
    i += 1
else:
    print("  This won't print due to break")
print('\n=== 6. Infinite Loop with Break ===')
counter = 0
while True:
    print(f'  Iteration {counter}')
    counter += 1
    if counter >= 5:
        print('  Exiting infinite loop')
        break
print('\n=== 7. While with Complex Conditions ===')
x = 0
y = 10
while x < 5 and y > 5:
    print(f'  x={x}, y={y}')
    x += 1
    y -= 1
a = 0
b = 0
while a < 3 or b < 3:
    print(f'  a={a}, b={b}')
    a += 1
    b += 2

def countdown(start: int) -> None:
    while start > 0:
        print(f'  {start}...')
        start -= 1
    print('  Blast off!')

def find_first_divisor(num: int, threshold: int) -> int:
    divisor = 2
    while divisor < threshold:
        if num % divisor == 0:
            return divisor
        divisor += 1
    return -1
print('\n=== 8. While in Functions ===')
countdown(5)
result = find_first_divisor(15, 10)
print(f'  First divisor of 15: {result}')
print('\n=== 9. While with List Processing ===')
items = [10, 20, 30, 40, 50]
idx = 0
while idx < len(items):
    print(f'  Item {idx}: {items[idx]}')
    idx += 1
stack = [1, 2, 3, 4, 5]
print('  Popping from stack:')
while len(stack) > 0:
    item = stack.pop()
    print(f'    Popped: {item}')
print('\n=== 10. While vs For Comparison ===')
print('  While loop:')
i = 0
while i < 5:
    print(f'    {i}')
    i += 1
print('  For loop (equivalent):')
for j in range(5):
    print(f'    {j}')
print('\n=== 11. Nested While Loops ===')
outer = 0
while outer < 3:
    inner = 0
    while inner < 2:
        print(f'  outer={outer}, inner={inner}')
        inner += 1
    outer += 1

class Counter(_jl.Node):
    value: int = 0
    max_value: int = 10

class Incrementer(_jl.Walker):
    iterations: int = 0

    @_jl.entry
    def increment(self, here: Counter) -> None:
        print('\n=== 12. While in Walker Abilities (OSP) ===')
        while here.value < here.max_value:
            here.value += 1
            self.iterations += 1
            print(f'  Incremented to {here.value}')
            if here.value >= 5:
                print('  Reached threshold, stopping')
                break
        print(f'  Total iterations: {self.iterations}')
        _jl.disengage(self)
        return
counter = Counter(value=0, max_value=10)
_jl.connect(left=_jl.root(), right=counter)
_jl.spawn(counter, Incrementer())
print('\n=== 13. While with Sentinel Value ===')
values = [5, 10, 15, -1, 20, 25]
idx = 0
while idx < len(values):
    value = values[idx]
    if value == -1:
        print('  Found sentinel, stopping')
        break
    print(f'  Processing: {value}')
    idx += 1
print('\n=== 14. While with Flag Pattern ===')
found = False
targets = [10, 20, 30, 40, 50]
search_value = 30
idx = 0
while idx < len(targets) and (not found):
    if targets[idx] == search_value:
        print(f'  Found {search_value} at index {idx}')
        found = True
    else:
        print(f'  Checking index {idx}: {targets[idx]}')
    idx += 1
if not found:
    print(f'  {search_value} not found')
print('\n=== 15. While with State Machine Pattern ===')
state = 'start'
count = 0
while state != 'end' and count < 10:
    print(f'  State: {state}, count: {count}')
    if state == 'start':
        state = 'processing'
    elif state == 'processing':
        count += 1
        if count >= 3:
            state = 'finishing'
    elif state == 'finishing':
        state = 'end'
print(f'  Final state: {state}')
print('\n=== 16. Do-While Simulation ===')
x = 10
executed = False
print(f'  x = {x}')
x += 1
executed = True
while x < 5:
    print(f'  x = {x}')
    x += 1
print('  Executed at least once, even though condition was false')
print('\n=== 17. While with Multiple Exit Conditions ===')
value = 1
iterations = 0
max_iterations = 100
while True:
    value *= 2
    iterations += 1
    if value > 100:
        print(f'  Exited: value={value} exceeded 100')
        break
    if iterations >= max_iterations:
        print('  Exited: reached max iterations')
        break
    print(f'  Iteration {iterations}: value={value}')
print('\n=== 18. While with Conditional Updates ===')
num = 1
while num < 50:
    print(f'  num = {num}')
    if num % 2 == 0:
        num += 3
    else:
        num += 1
print(f'  Final num: {num}')

def get_valid_number(min_val: int, max_val: int) -> int:
    test_inputs = [5, 150, 200, 50]
    idx = 0
    value = test_inputs[idx]
    while value < min_val or value > max_val:
        print(f'    Invalid: {value} (must be {min_val}-{max_val})')
        idx += 1
        if idx >= len(test_inputs):
            value = min_val
            break
        value = test_inputs[idx]
    print(f'    Valid value: {value}')
    return value
print('\n=== 19. While for Input Validation Pattern ===')
valid_num = get_valid_number(10, 100)
print('\n=== 20. Performance Considerations ===')
items = [10, 20, 30, 40, 50]
length = len(items)
idx = 0
print('  Efficient pattern (cached length):')
while idx < length:
    print(f'    Item {idx}: {items[idx]}')
    idx += 1
print('  Better: use for loop')
for item in items:
    print(f'    {item}')
print('\n✓ While statements demonstrated!')
