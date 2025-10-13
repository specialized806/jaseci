"""Comprehensive expression tests."""

# Arithmetic expressions
def test_arithmetic() -> int {
    # Basic operations
    a = 10 + 5;
    b = 20 - 3;
    c = 4 * 6;
    d = 15 / 3;
    e = 17 % 5;

    # Power operation
    f = 2 ** 3;

    # Floor division
    g = 17 // 5;

    # Combined
    result = a + b - c + int(d) + e + f + g;
    return result;
}

# Comparison expressions
def test_comparison() -> bool {
    x = 5;
    y = 10;

    result1 = x < y;
    result2 = x <= 5;
    result3 = y > x;
    result4 = y >= 10;
    result5 = x == 5;
    result6 = x != y;

    return result1 and result2 and result3 and result4 and result5 and result6;
}

# Logical expressions
def test_logical() -> bool {
    a = True;
    b = False;

    result1 = a and b;
    result2 = a or b;
    result3 = not a;
    result4 = a and not b;

    return result2 and result4;
}

# Unary expressions
def test_unary() -> int {
    x = 10;
    y = -x;
    z = +x;
    w = ~5;

    return y + z + w;
}

# Chained comparisons
def test_chained_comparison(x: int) -> bool {
    return 0 < x < 100;
}

# More chained comparisons
def test_chained_multi() -> bool {
    x = 5;
    return 0 < x <= 10;
}

# Augmented assignments
def test_augmented_assignments() -> int {
    x = 10;
    x += 5;
    x -= 3;
    x *= 2;
    x //= 4;
    x %= 7;

    return x;
}

# Bitwise operations
def test_bitwise() -> int {
    a = 12;
    b = a & 7;
    c = b | 3;
    d = c ^ 5;
    e = d << 1;
    f = e >> 2;
    g = ~f;

    return g;
}

# Bitwise augmented assignments
def test_bitwise_augmented() -> int {
    x = 12;
    x &= 7;
    x |= 3;
    x ^= 5;
    x <<= 1;
    x >>= 2;

    return x;
}

# Parenthesized expressions
def test_precedence() -> int {
    result = (2 + 3) * 4;
    result2 = 2 + 3 * 4;

    return result + result2;
}

# Complex precedence
def test_complex_precedence() -> int {
    return 2 + 3 * 4 ** 2 - 5 / (1 + 1);
}

# Conditional expressions (ternary)
def test_conditional() -> int {
    x = 10;
    result = 1 if x > 5 else 0;
    return result;
}

# Nested conditional expressions
def test_nested_conditional(x: int) -> str {
    return "big" if x > 100 else "medium" if x > 10 else "small";
}

# String concatenation
def test_string_concat() -> str {
    a = "hello";
    b = "world";
    c = a + " " + b;
    return c;
}

# String multiplication
def test_string_mult() -> str {
    return "ab" * 3;
}

# List concatenation
def test_list_concat() -> list {
    a = [1, 2];
    b = [3, 4];
    c = a + b;
    return c;
}

# List multiplication
def test_list_mult() -> list {
    return [1, 2] * 3;
}

# Membership testing
def test_membership() -> bool {
    a = 5 in [1, 2, 3, 4, 5];
    b = 10 not in [1, 2, 3, 4, 5];
    c = "x" in "hello";
    d = "z" not in "hello";
    return a and b and not c and d;
}

# Identity testing
def test_identity() -> bool {
    a = None;
    b = a is None;
    c = a is not False;
    return b and c;
}

# Subscript expressions
def test_subscript() -> int {
    items = [10, 20, 30, 40, 50];
    a = items[0];
    b = items[2];
    c = items[-1];
    return a + b + c;
}

# Slice expressions
def test_slice() -> list {
    items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    a = items[2:5];
    b = items[:3];
    c = items[7:];
    d = items[::2];
    e = items[1:8:2];
    return a + b + c + d + e;
}

# Attribute access
def test_attribute() -> int {
    text = "hello";
    return len(text);
}

# Method calls
def test_method_calls() -> str {
    text = "hello";
    upper = text.upper();
    replaced = text.replace("l", "L");
    return upper + replaced;
}

# Chained method calls
def test_chained_methods() -> str {
    return "  hello  ".strip().upper().replace("L", "!");
}

# Function calls with various arguments
def helper(a: int, b: int = 10, *args: tuple, **kwargs: dict) -> int {
    return a + b + len(args) + len(kwargs);
}

def test_function_calls() -> int {
    r1 = helper(5);
    r2 = helper(5, 15);
    r3 = helper(5, 15, 1, 2, 3);
    r4 = helper(5, 15, x=1, y=2);
    return r1 + r2 + r3 + r4;
}

# Lambda expressions
def test_lambda() -> int {
    add = lambda x: int, y: int : x + y;
    result = add(10, 20);
    return result;
}

# Lambda in higher-order functions
def test_lambda_hof() -> list {
    numbers = [1, 2, 3, 4, 5];
    doubled = list(map(lambda x: int : x * 2, numbers));
    evens = list(filter(lambda x: int : x % 2 == 0, numbers));
    return doubled + evens;
}

# Walrus operator (assignment expression)
def test_walrus() -> int {
    if (n := 10 + 5) > 12 {
        return n;
    }
    return 0;
}

# Walrus in while loop
def test_walrus_while() -> list {
    results = [];
    i = 0;
    while (n := i * 2) < 10 {
        results.append(n);
        i += 1;
    }
    return results;
}

# Comprehension expressions
def test_list_comprehension() -> list {
    return [x * 2 for x in range(10)];
}

# List comprehension with condition
def test_list_comp_if() -> list {
    return [x for x in range(20) if x % 2 == 0];
}

# Nested list comprehension
def test_nested_comp() -> list {
    return [x + y for x in range(3) for y in range(3)];
}

# Dict comprehension
def test_dict_comprehension() -> dict {
    return {x: x ** 2 for x in range(5)};
}

# Set comprehension
def test_set_comprehension() -> set {
    return {x % 3 for x in range(10)};
}

# Tuple unpacking in expressions
def test_tuple_unpack() -> int {
    (a, b) = (10, 20);
    return a + b;
}

# Extended unpacking
def test_extended_unpack() -> int {
    (a, *b, c) = [1, 2, 3, 4, 5];
    return a + c + sum(b);
}

# F-string expressions
def test_fstring() -> str {
    name = "World";
    count = 42;
    return f"Hello {name}, count is {count}";
}

# F-string with expressions
def test_fstring_expr() -> str {
    x = 10;
    y = 20;
    return f"Sum: {x + y}, Product: {x * y}";
}

# Type casting expressions
def test_type_casting() -> int {
    a = int(3.14);
    b = int("42");
    c = int(True);
    return a + b + c;
}

# Boolean expressions with short-circuit evaluation
def test_short_circuit() -> bool {
    a = True or (1 / 0);  # Should not raise error
    b = False and (1 / 0);  # Should not raise error
    return True;
}
