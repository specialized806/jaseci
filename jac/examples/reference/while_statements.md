While statements in Jac provide condition-based iteration, continuing execution as long as the specified condition remains true. While loops are ideal when the number of iterations is unknown in advance and depends on runtime conditions.

**Basic While Loop**

Lines 7-10 demonstrate the fundamental while loop syntax:
```jac
x = 0;
while x < 5 {
    print(f"  x = {x}");
    x += 1;
}
```

The loop evaluates the condition before each iteration. If true, the body executes. The loop variable (`x`) must be manually updated within the loop body to eventually make the condition false, otherwise creating an infinite loop.

**While with Counter**

Lines 17-21 show a counter pattern with final value access:
```jac
count = 0;
while count < 3 {
    print(f"  Count: {count}");
    count += 1;
}
print(f"  Final count: {count}");  // Prints 3
```

After the loop, `count` equals 3 (the value that made the condition false).

**While with Break**

Lines 28-35 show `break` exiting the loop immediately:
```jac
while i < 10 {
    if i == 5 {
        print(f"  Breaking at {i}");
        break;  // Exit loop
    }
    print(f"  i = {i}");
    i += 1;
}
```

When `break` executes, the loop terminates and any `else` clause is skipped.

**While with Continue**

Lines 42-48 show `continue` skipping to the next iteration:
```jac
num = 0;
while num < 10 {
    num += 1;
    if num % 2 == 0 {
        continue;  // Skip even numbers
    }
    print(f"  odd: {num}");
}
```

**Important**: The counter (`num`) is incremented **before** the `continue` check. If incremented after, the loop would be infinite when hitting even numbers.

**While with Else Clause**

Lines 58-75 demonstrate the `else` clause (Python-style):
```jac
while count < 3 {
    print(f"  count = {count}");
    count += 1;
} else {
    print("  Loop completed normally");
}
```

The `else` block executes **only if the loop completes without encountering `break`**. This is useful for search patterns: if you break when finding an item, the else clause indicates "not found."

**Infinite Loop with Break**

Lines 83-90 show the common pattern of `while True` with conditional `break`:
```jac
counter = 0;
while True {
    print(f"  Iteration {counter}");
    counter += 1;
    if counter >= 5 {
        print("  Exiting infinite loop");
        break;
    }
}
```

This pattern is clearer than complex loop conditions when you have multiple exit criteria checked within the body.

**While with Complex Conditions**

Lines 99-112 show combining conditions with logical operators:
```jac
// AND condition: both must be true
while x < 5 and y > 5 {
    print(f"  x={x}, y={y}");
    x += 1;
    y -= 1;
}

// OR condition: at least one must be true
while a < 3 or b < 3 {
    print(f"  a={a}, b={b}");
    a += 1;
    b += 2;
}
```

Complex conditions use short-circuit evaluation: `and` stops at first false, `or` stops at first true.

**While in Functions**

Lines 116-140 show while loops in function bodies:
```jac
def countdown(start: int) {
    while start > 0 {
        print(f"  {start}...");
        start -= 1;
    }
    print("  Blast off!");
}

def find_first_divisor(num: int, threshold: int) -> int {
    divisor = 2;
    while divisor < threshold {
        if num % divisor == 0 {
            return divisor;  // Early exit
        }
        divisor += 1;
    }
    return -1;  // Not found
}
```

Functions use while loops for countdown timers, searches, and condition-based processing.

**While with List Processing**

Lines 148-160 show list iteration and modification:
```jac
// Iterate with index
items = [10, 20, 30, 40, 50];
idx = 0;
while idx < len(items) {
    print(f"  Item {idx}: {items[idx]}");
    idx += 1;
}

// Process and remove items
stack = [1, 2, 3, 4, 5];
while len(stack) > 0 {
    item = stack.pop();
    print(f"    Popped: {item}");
}
```

The second pattern shows while loops are ideal when the collection size changes during iteration (`.pop()` removes items).

**While vs For Comparison**

Lines 169-179 demonstrate equivalent while and for loops:
```jac
// While loop
i = 0;
while i < 5 {
    print(f"    {i}");
    i += 1;
}

// For loop (equivalent, but cleaner)
for j in range(5) {
    print(f"    {j}");
}
```

**Guideline**: Prefer `for` loops when iterating a known number of times. Use `while` when the continuation depends on computed conditions.

**Nested While Loops**

Lines 186-194 show nested while loops:
```jac
outer = 0;
while outer < 3 {
    inner = 0;
    while inner < 2 {
        print(f"  outer={outer}, inner={inner}");
        inner += 1;
    }
    outer += 1;
}
```

Each loop level requires its own counter and update logic.

**While in Walker Abilities (OSP)**

Lines 206-226 demonstrate while loops in spatial contexts:
```jac
walker Incrementer {
    can increment with Counter entry {
        while here.value < here.max_value {
            here.value += 1;
            self.iterations += 1;
            print(f"  Incremented to {here.value}");

            if here.value >= 5 {
                print("  Reached threshold, stopping");
                break;
            }
        }
    }
}
```

In walker abilities, `here` refers to the current node. While loops enable processing node state until a condition is met.

**While with Sentinel Value**

Lines 236-244 show the sentinel pattern - loop until a special value is found:
```jac
values = [5, 10, 15, -1, 20, 25];  // -1 is sentinel
idx = 0;
while idx < len(values) {
    value = values[idx];
    if value == -1 {
        print("  Found sentinel, stopping");
        break;
    }
    print(f"  Processing: {value}");
    idx += 1;
}
```

Sentinel values mark the end of data without needing to know the exact count in advance.

**While with Flag Pattern**

Lines 256-268 show using a boolean flag to control the loop:
```jac
found = False;
targets = [10, 20, 30, 40, 50];
search_value = 30;
idx = 0;

while idx < len(targets) and not found {
    if targets[idx] == search_value {
        print(f"  Found {search_value} at index {idx}");
        found = True;
    } else {
        print(f"  Checking index {idx}: {targets[idx]}");
    }
    idx += 1;
}

if not found {
    print(f"  {search_value} not found");
}
```

The flag (`found`) is incorporated into the loop condition, allowing early termination when the item is found.

**While with State Machine Pattern**

Lines 278-293 show state machine implementation:
```jac
state = "start";
count = 0;

while state != "end" and count < 10 {
    print(f"  State: {state}, count: {count}");

    if state == "start" {
        state = "processing";
    } elif state == "processing" {
        count += 1;
        if count >= 3 {
            state = "finishing";
        }
    } elif state == "finishing" {
        state = "end";
    }
}
```

State machines use while loops to transition between states until reaching a terminal state.

**Do-While Simulation**

Lines 302-316 show simulating do-while (execute-then-check) behavior:
```jac
x = 10;

// First execution (do)
print(f"  x = {x}");
x += 1;

// Subsequent executions (while)
while x < 5 {
    print(f"  x = {x}");
    x += 1;
}

print("  Executed at least once, even though condition was false");
```

Jac doesn't have native do-while syntax. Simulate it by executing the body once before the while loop.

**While with Multiple Exit Conditions**

Lines 327-342 show using `while True` with multiple `break` conditions:
```jac
value = 1;
iterations = 0;
max_iterations = 100;

while True {
    value *= 2;
    iterations += 1;

    if value > 100 {
        print(f"  Exited: value={value} exceeded 100");
        break;
    }

    if iterations >= max_iterations {
        print(f"  Exited: reached max iterations");
        break;
    }

    print(f"  Iteration {iterations}: value={value}");
}
```

This pattern is clearer than combining all exit conditions into the while condition with `and`/`or`.

**While with Conditional Updates**

Lines 350-360 show different increment strategies based on current value:
```jac
num = 1;
while num < 50 {
    print(f"  num = {num}");

    if num % 2 == 0 {
        num += 3;  // Even: add 3
    } else {
        num += 1;  // Odd: add 1
    }
}
```

The loop variable can be updated differently on each iteration based on runtime conditions.

**While for Input Validation Pattern**

Lines 364-386 show validating input until acceptable:
```jac
def get_valid_number(min_val: int, max_val: int) -> int {
    test_inputs = [5, 150, 200, 50];  // Simulated inputs
    idx = 0;

    value = test_inputs[idx];
    while value < min_val or value > max_val {
        print(f"    Invalid: {value} (must be {min_val}-{max_val})");
        idx += 1;
        if idx >= len(test_inputs) {
            value = min_val;  // Default to valid
            break;
        }
        value = test_inputs[idx];
    }

    return value;
}
```

This pattern repeatedly prompts (or in this case, checks simulated inputs) until a valid value is provided.

**Performance Considerations**

Lines 394-408 demonstrate performance best practices:
```jac
// Cache length calculation
items = [10, 20, 30, 40, 50];
length = len(items);  // Calculate once
idx = 0;

while idx < length {
    print(f"    Item {idx}: {items[idx]}");
    idx += 1;
}

// Better: use for loop
for item in items {
    print(f"    {item}");
}
```

**Best practices**:
1. Cache expensive calculations (like `len()`) outside the loop condition
2. Prefer `for` loops over `while` with manual indexing when iterating collections
3. Use `while` when the collection changes size during iteration or when condition-based

**Loop Control Flow Summary**

| Statement | Effect | Else clause |
|-----------|--------|-------------|
| `break` | Exit loop immediately | Skipped |
| `continue` | Skip to next iteration | Not affected |
| Normal completion | Condition becomes false | Executes (if present) |

**While vs For Comparison**

| Feature | While Loop | For Loop |
|---------|------------|----------|
| Condition | Explicit boolean expression | Implicit iteration over iterable |
| Counter management | Manual | Automatic |
| Use case | Condition-based | Collection/range iteration |
| Known iterations | No (condition-dependent) | Yes (based on iterable size) |
| Else clause | Executes on normal completion | Executes on normal completion |

**Common Patterns**

**Countdown/timer**:
```jac
while time_remaining > 0 {
    process();
    time_remaining -= 1;
}
```

**Search with early exit**:
```jac
while idx < len(items) {
    if items[idx] == target {
        found_idx = idx;
        break;
    }
    idx += 1;
} else {
    found_idx = -1;  // Not found
}
```

**Process until sentinel**:
```jac
while True {
    item = get_next();
    if item == SENTINEL {
        break;
    }
    process(item);
}
```

**Polling/waiting**:
```jac
while not condition_met() {
    wait_some_time();
    check_again();
}
```

**Consume collection**:
```jac
while len(queue) > 0 {
    item = queue.pop(0);
    process(item);
}
```

**Key Differences from Python**

1. **Braces required**: Jac uses `{ }`, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **Same else clause**: while-else works identically to Python
4. **Same break/continue**: Control flow identical to Python
5. **OSP integration**: `here`, `visitor` references available in walker abilities

**Relationship to Other Features**

While loops interact with:
- **If statements** (if_statements.jac): `if` conditions control break/continue
- **For loops** (for_statements.jac): Alternative iteration pattern, often clearer for known iterations
- **Functions** (functions_and_abilities.jac): While loops in function bodies for algorithms
- **Walker abilities** (functions_and_abilities.jac): Process node state with `here` reference
- **Break/continue**: Control loop flow based on conditions

While loops are essential for condition-dependent iteration in Jac, from simple counters to complex state machines and graph processing.
