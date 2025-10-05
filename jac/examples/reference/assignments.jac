# Assignments - Variable binding and value assignment patterns

# ===== Part 1: Basic Assignment =====
with entry {
    print("=== 1. Basic Assignment ===");
    x = 10;
    print(f"x = {x}");

    # Chain assignment (right-to-left evaluation)
    a = b = c = 20;
    print(f"Chain: a={a}, b={b}, c={c}");
}

# ===== Part 2: Let Assignment =====
with entry {
    print("\n=== 2. Let Assignment ===");
    let value = 100;
    print(f"let value = {value}");

    # Let with type annotation
    let count: int = 5;
    print(f"let count: int = {count}");
}

# ===== Part 3: Type Annotations =====
with entry {
    print("\n=== 3. Type Annotations ===");

    # Type annotation with value
    age: int = 25;
    name: str = "Alice";
    price: float = 19.99;
    active: bool = True;

    print(f"age: int = {age}");
    print(f"name: str = {name}");
    print(f"price: float = {price}");
    print(f"active: bool = {active}");

    # Type annotation without immediate value
    result: str;
    result = "computed";
    print(f"result (declared then assigned) = {result}");
}

# ===== Part 4: Augmented Assignments =====
with entry {
    print("\n=== 4. Augmented Assignments ===");

    # Arithmetic augmented assignments
    num = 10;
    print(f"Initial: num = {num}");

    num += 5;   # Add assign: num = num + 5
    print(f"After num += 5: {num}");

    num -= 3;   # Subtract assign
    print(f"After num -= 3: {num}");

    num *= 2;   # Multiply assign
    print(f"After num *= 2: {num}");

    num /= 4;   # Division assign
    print(f"After num /= 4: {num}");

    num = 17;
    num %= 5;   # Modulo assign
    print(f"After 17 %= 5: {num}");

    num **= 3;  # Power assign
    print(f"After num **= 3: {num}");

    num = 20;
    num //= 3;  # Floor division assign
    print(f"After 20 //= 3: {num}");
}

# ===== Part 5: Bitwise Augmented Assignments =====
with entry {
    print("\n=== 5. Bitwise Augmented Assignments ===");

    bits = 12;  # Binary: 1100
    print(f"Initial: bits = {bits} (binary: {bin(bits)})");

    bits &= 7;  # Bitwise AND assign (1100 & 0111 = 0100)
    print(f"After bits &= 7: {bits} (binary: {bin(bits)})");

    bits |= 3;  # Bitwise OR assign (0100 | 0011 = 0111)
    print(f"After bits |= 3: {bits} (binary: {bin(bits)})");

    bits ^= 5;  # Bitwise XOR assign (0111 ^ 0101 = 0010)
    print(f"After bits ^= 5: {bits} (binary: {bin(bits)})");

    bits <<= 2; # Left shift assign (0010 << 2 = 1000)
    print(f"After bits <<= 2: {bits} (binary: {bin(bits)})");

    bits >>= 1; # Right shift assign (1000 >> 1 = 0100)
    print(f"After bits >>= 1: {bits} (binary: {bin(bits)})");
}

# ===== Part 6: Tuple/List Unpacking =====
with entry {
    print("\n=== 6. Tuple/List Unpacking ===");

    # Basic tuple unpacking
    x, y = 10, 20;
    print(f"x, y = 10, 20 → x={x}, y={y}");

    # Swap using unpacking
    x, y = y, x;
    print(f"After swap: x={x}, y={y}");

    # List unpacking
    [a, b, c] = [1, 2, 3];
    print(f"[a, b, c] = [1, 2, 3] → a={a}, b={b}, c={c}");

    # Nested unpacking
    (p, (q, r)) = (5, (6, 7));
    print(f"(p, (q, r)) = (5, (6, 7)) → p={p}, q={q}, r={r}");
}

# ===== Part 7: Extended Unpacking (Starred) =====
with entry {
    print("\n=== 7. Extended Unpacking with * ===");

    # Star expression to capture rest
    first, *rest = [1, 2, 3, 4, 5];
    print(f"first, *rest = [1,2,3,4,5] → first={first}, rest={rest}");

    # Star in middle
    head, *middle, tail = [10, 20, 30, 40, 50];
    print(f"head, *middle, tail → head={head}, middle={middle}, tail={tail}");

    # Star at end
    *beginning, last = [100, 200, 300];
    print(f"*beginning, last → beginning={beginning}, last={last}");
}

# ===== Part 8: Walrus Operator := (Assignment Expression) =====
# Note: Walrus operator := allows assignment within expressions
# Syntax: (variable := value) assigns AND returns the value
with entry {
    print("\n=== 8. Walrus Operator (in compatible contexts) ===");

    # Walrus in simple assignment context
    n = 15;
    if n > 10 {
        print(f"Value n={n} is > 10");
    }

    # Demonstrate walrus-style pattern with regular assignment
    data = [1, 2, 3, 4, 5];
    for value in data {
        doubled = value * 2;
        if doubled > 5 {
            print(f"  {value} * 2 = {doubled} (> 5)");
        }
    }
}

# ===== Part 9: Walrus in Spatial Contexts (OSP) =====
node DataNode {
    has value: int = 0;
    has label: str = "data";
}

with entry {
    print("\n=== 9. Walrus in Spatial Contexts (OSP) ===");

    # Connect-and-assign pattern: Create node and assign in one expression
    root ++> (node1 := DataNode(value=10, label="first"));
    print(f"Connected and assigned: node1.value={node1.value}, node1.label={node1.label}");

    # Chain connect-and-assign
    node1 ++> (node2 := DataNode(value=20, label="second"));
    node2 ++> (node3 := DataNode(value=30, label="third"));

    print(f"Chained: node2.value={node2.value}, node3.value={node3.value}");

    # Using walrus with nodes
    all_nodes = [node1, node2, node3];
    for n in all_nodes {
        if (val := n.value) > 15 {
            print(f"  Node with value {val} > 15");
        }
    }
}

# ===== Part 10: Assignments in Different Contexts =====
obj Calculator {
    has total: int = 0;

    def add(value: int) {
        # Assignment in method
        self.total += value;
        return self.total;
    }
}

walker Accumulator {
    has sum: int = 0;

    can process with DataNode entry {
        # Assignment in walker ability
        self.sum += here.value;
        print(f"  Accumulator: sum={self.sum} after adding {here.value}");
        visit [-->];
    }
}

with entry {
    print("\n=== 10. Assignments in Methods and Abilities ===");

    calc = Calculator();
    result = calc.add(5);
    result = calc.add(10);
    print(f"Calculator total: {calc.total}");

    print("Walker accumulator:");
    root spawn Accumulator();
}

# ===== Part 11: Assignment with Complex Expressions =====
with entry {
    print("\n=== 11. Assignment with Complex Expressions ===");

    # Function call result
    def compute(a: int, b: int) -> int {
        return a * b + 10;
    }
    result = compute(5, 3);
    print(f"Function result assignment: {result}");

    # Conditional expression (ternary)
    status = "active" if True else "inactive";
    print(f"Conditional expression: {status}");

    # List comprehension
    squares = [x**2 for x in range(1, 6)];
    print(f"List comprehension: {squares}");

    # Dictionary
    mapping = {"a": 1, "b": 2, "c": 3};
    print(f"Dict assignment: {mapping}");
}

# ===== Part 12: Global and Nonlocal Context =====
global_var = 100;

def outer() {
    outer_var = 50;

    def inner() {
        # Access global (would need global keyword in Python, Jac may differ)
        local_val = global_var + 10;
        # Access outer scope
        result = outer_var + 5;
        return result;
    }

    return inner();
}

with entry {
    print("\n=== 12. Scope Assignments ===");
    print(f"Global var: {global_var}");
    inner_result = outer();
    print(f"Inner function result: {inner_result}");
}

# ===== Part 13: Multiple Assignment Patterns =====
with entry {
    print("\n=== 13. Multiple Assignment Patterns ===");

    # Parallel assignment
    x, y, z = 1, 2, 3;
    print(f"Parallel: x={x}, y={y}, z={z}");

    # From function returning tuple
    def get_coords() -> tuple {
        return (10, 20, 30);
    }
    px, py, pz = get_coords();
    print(f"From function: px={px}, py={py}, pz={pz}");

    # Mixed types
    name, age, score = "Bob", 25, 95.5;
    print(f"Mixed types: name={name}, age={age}, score={score}");
}

with entry {
    print("\n✓ Assignments demonstrated!");
}
