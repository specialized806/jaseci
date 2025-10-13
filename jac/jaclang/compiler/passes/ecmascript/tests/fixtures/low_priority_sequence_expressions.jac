"""Low Priority: Sequence expressions and comma operator (SequenceExpression tests)."""

# Walrus operator - assignment expression
def test_walrus_basic() -> int {
    if (x := 10) > 5 {
        return x;
    }
    return 0;
}

# Walrus in while condition
def test_walrus_while() -> list {
    results = [];
    i = 0;
    while (n := i * 2) < 10 {
        results.append(n);
        i += 1;
    }
    return results;
}

# Walrus with function call
def compute(x: int) -> int {
    return x * 3;
}

def test_walrus_function() -> int {
    if (result := compute(5)) > 10 {
        return result;
    }
    return 0;
}

# Multiple walrus operators
def test_multiple_walrus() -> int {
    if (a := 5) and (b := 10) {
        return a + b;
    }
    return 0;
}

# Walrus in list comprehension
def test_walrus_comprehension() -> list {
    values = [1, 2, 3, 4, 5];
    # [y for x in values if (y := x * 2) > 4]
    results = [];
    for x in values {
        y = x * 2;
        if y > 4 {
            results.append(y);
        }
    }
    return results;
}

# Walrus nested in expression
def test_walrus_nested() -> int {
    x = 5;
    result = (y := x * 2) + (z := x * 3);
    return result;
}

# Walrus in ternary
def test_walrus_ternary() -> int {
    x = 5;
    return (n := x * 2) if x > 3 else 0;
}

# Sequence of assignments
def test_sequence_assignments() -> int {
    # In JS: x = 1, y = 2, z = 3
    x = 1;
    y = 2;
    z = 3;
    return x + y + z;
}

# Multiple operations in one expression
def test_multiple_operations() -> int {
    x = 0;
    # Simulating: (x = 5, x * 2)
    x = 5;
    result = x * 2;
    return result;
}

# Comma operator in for loop (simulated)
def test_comma_in_for() -> list {
    results = [];
    i = 0;
    j = 10;
    while i < 5 {
        results.append(i + j);
        i += 1;
        j -= 1;
    }
    return results;
}

# Complex walrus scenario
def test_complex_walrus() -> dict {
    data = [1, 2, 3, 4, 5];
    results = {};

    if (total := sum(data)) > 10 {
        if (avg := total / len(data)) > 2 {
            results["total"] = total;
            results["avg"] = avg;
        }
    }
    return results;
}

# Walrus with method call
def test_walrus_method() -> int {
    text = "hello world";
    if (length := len(text)) > 5 {
        return length;
    }
    return 0;
}

# Sequential evaluations
def test_sequential_eval() -> int {
    # Multiple statements evaluated in sequence
    a = 10;
    b = a + 5;
    c = b * 2;
    return c;
}

# Walrus in match guard
def test_walrus_in_match() -> str {
    value = 42;
    match value {
        case x if (doubled := x * 2) > 50:
            return "large";
        case _:
            return "small";
    }
}

# Walrus with unpacking
def test_walrus_unpack() -> int {
    data = [1, 2, 3];
    if (first := data[0]) > 0 {
        return first;
    }
    return 0;
}
