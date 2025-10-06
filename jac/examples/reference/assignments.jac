# Assignments - Variable binding and value assignment patterns

# ===== Part 1: Basic Assignments =====
with entry {
    print("=== 1. Basic Assignments ===");

    # Simple assignment
    x = 10;
    print(f"x = 10 → {x}");

    # Chain assignment
    a = b = c = 20;
    print(f"a = b = c = 20 → a={a}, b={b}, c={c}");

    # Let keyword (explicit declaration)
    let value = 100;
    print(f"let value = 100 → {value}");
}

# ===== Part 2: Type Annotations =====
with entry {
    print("\n=== 2. Type Annotations ===");

    # With immediate value
    age: int = 25;
    name: str = "Alice";
    price: float = 19.99;
    active: bool = True;
    print(f"age: int = {age}, name: str = {name}");

    # Declaration without value
    result: str;
    result = "computed";
    print(f"result (declared then assigned) = {result}");

    # Let with type
    let count: int = 5;
    print(f"let count: int = {count}");
}

# ===== Part 3: Augmented Assignments =====
with entry {
    print("\n=== 3. Augmented Assignments ===");

    # Arithmetic
    num = 10;
    num += 5;   # Addition
    num -= 3;   # Subtraction
    num *= 2;   # Multiplication
    num /= 4;   # Division
    print(f"Arithmetic chain result: {num}");

    num = 17;
    num %= 5;   # Modulo
    print(f"17 %= 5 → {num}");

    num **= 3;  # Power
    print(f"2 **= 3 → {num}");

    num = 20;
    num //= 3;  # Floor division
    print(f"20 //= 3 → {num}");

    # Bitwise
    bits = 12;  # 0b1100
    bits &= 7;  # AND: 0b1100 & 0b0111 = 0b0100
    bits |= 3;  # OR: 0b0100 | 0b0011 = 0b0111
    bits ^= 5;  # XOR: 0b0111 ^ 0b0101 = 0b0010
    bits <<= 2; # Left shift: 0b0010 << 2 = 0b1000
    bits >>= 1; # Right shift: 0b1000 >> 1 = 0b0100
    print(f"Bitwise chain result: {bits} (0b{bin(bits)[2:]})");
}

# ===== Part 4: Unpacking Assignments =====
with entry {
    print("\n=== 4. Unpacking Assignments ===");

    # Tuple unpacking
    (x, y) = (10, 20);
    print(f"(x, y) = (10, 20) → x={x}, y={y}");

    # Swap
    (x, y) = (y, x);
    print(f"After swap: x={x}, y={y}");

    # List unpacking
    [a, b, c] = [1, 2, 3];
    print(f"[a, b, c] = [1, 2, 3] → a={a}, b={b}, c={c}");

    # Nested unpacking
    (p, (q, r)) = (5, (6, 7));
    print(f"Nested: p={p}, q={q}, r={r}");

    # Extended unpacking with *
    (first, *rest) = [1, 2, 3, 4, 5];
    print(f"(first, *rest) → first={first}, rest={rest}");

    (head, *middle, tail) = [10, 20, 30, 40, 50];
    print(f"(head, *middle, tail) → head={head}, middle={middle}, tail={tail}");

    (*beginning, last) = [100, 200, 300];
    print(f"(*beginning, last) → beginning={beginning}, last={last}");
}

# ===== Part 5: Walrus Operator (Assignment Expression) =====
node DataNode {
    has value: int = 0;
}

with entry {
    print("\n=== 5. Walrus Operator := ===");

    # Walrus in conditional
    n = 15;
    if n > 10 {
        print(f"n={n} is > 10");
    }

    # Walrus in loop context
    data = [1, 2, 3, 4, 5];
    for value in data {
        if (doubled := value * 2) > 5 {
            print(f"  {value} * 2 = {doubled} (> 5)");
        }
    }

    # Walrus in OSP: connect-and-assign
    root ++> (node1 := DataNode(value=10));
    node1 ++> (node2 := DataNode(value=20));
    print(f"OSP walrus: node1.value={node1.value}, node2.value={node2.value}");
}

# ===== Part 6: Assignments in Archetypes =====
obj Calculator {
    has total: int = 0;

    def add(value: int) {
        self.total += value;
        return self.total;
    }
}

walker Accumulator {
    has sum: int = 0;

    can process with DataNode entry {
        self.sum += here.value;
        visit [-->];
    }
}

with entry {
    print("\n=== 6. Assignments in Methods & Abilities ===");

    calc = Calculator();
    calc.add(5);
    calc.add(10);
    print(f"Calculator total: {calc.total}");

    acc = root spawn Accumulator();
    print(f"Accumulator sum: {acc.sum}");
}

# ===== Part 7: Complex Assignment Contexts =====
glob global_var = 100;

def outer() {
    outer_var = 50;

    def inner() {
        result = global_var + outer_var;
        return result;
    }

    return inner();
}

with entry {
    print("\n=== 7. Complex Contexts ===");

    # Function result
    def compute(a: int, b: int) -> int { return a * b + 10; }
    result = compute(5, 3);
    print(f"Function result: {result}");

    # Conditional expression
    status = "active" if True else "inactive";
    print(f"Ternary: {status}");

    # Comprehension
    squares = [x**2 for x in range(1, 6)];
    print(f"Comprehension: {squares}");

    # Multiple return values
    def get_coords() -> tuple { return (10, 20, 30); }
    (px, py, pz) = get_coords();
    print(f"Multiple returns: px={px}, py={py}, pz={pz}");

    # Scope access
    print(f"Nested scopes: {outer()}");
}

with entry {
    print("\n✓ Assignments complete!");
}
