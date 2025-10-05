# While Statements - Condition-based iteration

# ===== Part 1: Basic While Loop =====
with entry {
    print("=== 1. Basic While Loop ===");
    x = 0;
    while x < 5 {
        print(f"  x = {x}");
        x += 1;
    }
}

# ===== Part 2: While with Counter =====
with entry {
    print("\n=== 2. While with Counter ===");
    count = 0;
    while count < 3 {
        print(f"  Count: {count}");
        count += 1;
    }
    print(f"  Final count: {count}");
}

# ===== Part 3: While with Break =====
with entry {
    print("\n=== 3. While with Break ===");
    i = 0;
    while i < 10 {
        if i == 5 {
            print(f"  Breaking at {i}");
            break;
        }
        print(f"  i = {i}");
        i += 1;
    }
}

# ===== Part 4: While with Continue =====
with entry {
    print("\n=== 4. While with Continue ===");
    num = 0;
    while num < 10 {
        num += 1;
        if num % 2 == 0 {
            continue;  # Skip even numbers
        }
        print(f"  odd: {num}");
    }
}

# ===== Part 5: While with Else Clause =====
with entry {
    print("\n=== 5. While with Else Clause ===");

    # Else executes when condition becomes false
    count = 0;
    while count < 3 {
        print(f"  count = {count}");
        count += 1;
    } else {
        print("  Loop completed normally");
    }

    # Else doesn't execute when break is used
    i = 0;
    while i < 10 {
        if i == 3 {
            print("  Breaking at 3");
            break;
        }
        print(f"  i = {i}");
        i += 1;
    } else {
        print("  This won't print due to break");
    }
}

# ===== Part 6: Infinite Loop with Break =====
with entry {
    print("\n=== 6. Infinite Loop with Break ===");

    counter = 0;
    while True {
        print(f"  Iteration {counter}");
        counter += 1;
        if counter >= 5 {
            print("  Exiting infinite loop");
            break;
        }
    }
}

# ===== Part 7: While with Complex Conditions =====
with entry {
    print("\n=== 7. While with Complex Conditions ===");

    x = 0;
    y = 10;
    while x < 5 and y > 5 {
        print(f"  x={x}, y={y}");
        x += 1;
        y -= 1;
    }

    # While with OR condition
    a = 0;
    b = 0;
    while a < 3 or b < 3 {
        print(f"  a={a}, b={b}");
        a += 1;
        b += 2;
    }
}

# ===== Part 8: While in Functions =====
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
            return divisor;
        }
        divisor += 1;
    }
    return -1;  # Not found
}

with entry {
    print("\n=== 8. While in Functions ===");
    countdown(5);

    result = find_first_divisor(15, 10);
    print(f"  First divisor of 15: {result}");
}

# ===== Part 9: While with List Processing =====
with entry {
    print("\n=== 9. While with List Processing ===");

    items = [10, 20, 30, 40, 50];
    idx = 0;
    while idx < len(items) {
        print(f"  Item {idx}: {items[idx]}");
        idx += 1;
    }

    # Process and remove items
    stack = [1, 2, 3, 4, 5];
    print("  Popping from stack:");
    while len(stack) > 0 {
        item = stack.pop();
        print(f"    Popped: {item}");
    }
}

# ===== Part 10: While vs For Comparison =====
with entry {
    print("\n=== 10. While vs For Comparison ===");

    # Using while
    print("  While loop:");
    i = 0;
    while i < 5 {
        print(f"    {i}");
        i += 1;
    }

    # Using for (same result)
    print("  For loop (equivalent):");
    for j in range(5) {
        print(f"    {j}");
    }
}

# ===== Part 11: Nested While Loops =====
with entry {
    print("\n=== 11. Nested While Loops ===");

    outer = 0;
    while outer < 3 {
        inner = 0;
        while inner < 2 {
            print(f"  outer={outer}, inner={inner}");
            inner += 1;
        }
        outer += 1;
    }
}

# ===== Part 12: While in Walker Abilities (OSP) =====
node Counter {
    has value: int = 0;
    has max_value: int = 10;
}

walker Incrementer {
    has iterations: int = 0;

    can increment with Counter entry {
        print("\n=== 12. While in Walker Abilities (OSP) ===");
        while here.value < here.max_value {
            here.value += 1;
            self.iterations += 1;
            print(f"  Incremented to {here.value}");

            if here.value >= 5 {
                print("  Reached threshold, stopping");
                break;
            }
        }
        print(f"  Total iterations: {self.iterations}");
        disengage;
    }
}

with entry {
    counter = Counter(value=0, max_value=10);
    root ++> counter;
    counter spawn Incrementer();
}

# ===== Part 13: While with Sentinel Value =====
with entry {
    print("\n=== 13. While with Sentinel Value ===");

    # Process until sentinel value is found
    values = [5, 10, 15, -1, 20, 25];  # -1 is sentinel
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
}

# ===== Part 14: While with Flag Pattern =====
with entry {
    print("\n=== 14. While with Flag Pattern ===");

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
}

# ===== Part 15: While with State Machine Pattern =====
with entry {
    print("\n=== 15. While with State Machine Pattern ===");

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

    print(f"  Final state: {state}");
}

# ===== Part 16: Do-While Simulation =====
# Jac doesn't have do-while, but we can simulate it
with entry {
    print("\n=== 16. Do-While Simulation ===");

    # Guarantee at least one execution
    x = 10;
    executed = False;

    # First execution (do)
    print(f"  x = {x}");
    x += 1;
    executed = True;

    # Subsequent executions (while)
    while x < 5 {
        print(f"  x = {x}");
        x += 1;
    }

    print("  Executed at least once, even though condition was false");
}

# ===== Part 17: While with Multiple Exit Conditions =====
with entry {
    print("\n=== 17. While with Multiple Exit Conditions ===");

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
}

# ===== Part 18: While with Conditional Updates =====
with entry {
    print("\n=== 18. While with Conditional Updates ===");

    num = 1;
    while num < 50 {
        print(f"  num = {num}");

        if num % 2 == 0 {
            num += 3;  # Even: add 3
        } else {
            num += 1;  # Odd: add 1
        }
    }

    print(f"  Final num: {num}");
}

# ===== Part 19: While for Input Validation Pattern =====
def get_valid_number(min_val: int, max_val: int) -> int {
    # Simulated user input
    test_inputs = [5, 150, 200, 50];  # Last valid value
    idx = 0;

    value = test_inputs[idx];
    while value < min_val or value > max_val {
        print(f"    Invalid: {value} (must be {min_val}-{max_val})");
        idx += 1;
        if idx >= len(test_inputs) {
            value = min_val;  # Default to valid
            break;
        }
        value = test_inputs[idx];
    }

    print(f"    Valid value: {value}");
    return value;
}

with entry {
    print("\n=== 19. While for Input Validation Pattern ===");
    valid_num = get_valid_number(10, 100);
}

# ===== Part 20: Performance Considerations =====
with entry {
    print("\n=== 20. Performance Considerations ===");

    # Avoid recalculating length in condition
    items = [10, 20, 30, 40, 50];
    length = len(items);  # Calculate once
    idx = 0;

    print("  Efficient pattern (cached length):");
    while idx < length {
        print(f"    Item {idx}: {items[idx]}");
        idx += 1;
    }

    # Note: For iteration, prefer for loops over while with indices
    print("  Better: use for loop");
    for item in items {
        print(f"    {item}");
    }
}

with entry {
    print("\n✓ While statements demonstrated!");
}
