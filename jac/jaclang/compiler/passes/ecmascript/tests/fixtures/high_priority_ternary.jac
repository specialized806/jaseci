"""High Priority: Conditional/Ternary expressions (ConditionalExpression tests)."""

# Simple ternary
def test_simple_ternary() -> int {
    x = 5;
    result = 1 if x > 3 else 0;
    return result;
}

# Ternary in return
def test_ternary_return(age: int) -> str {
    return "adult" if age >= 18 else "minor";
}

# Nested ternary
def test_nested_ternary(score: int) -> str {
    return "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F";
}

# Ternary with expressions
def test_ternary_expressions() -> int {
    x = 10;
    y = 20;
    max_val = x if x > y else y;
    return max_val;
}

# Multiple ternaries
def test_multiple_ternaries() -> int {
    a = 5;
    b = 10;
    c = 15;
    max_ab = a if a > b else b;
    max_all = max_ab if max_ab > c else c;
    return max_all;
}

# Ternary in lambda
def test_ternary_in_lambda() -> int {
    abs_val = lambda n: int : n if n >= 0 else -n;
    return abs_val(-42);
}

# Ternary with function calls
def test_ternary_function_calls() -> int {
    def double(x: int) -> int { return x * 2; }
    def triple(x: int) -> int { return x * 3; }

    x = 5;
    result = double(x) if x < 10 else triple(x);
    return result;
}

# Ternary in list comprehension
def test_ternary_in_comprehension() -> list {
    nums = [1, 2, 3, 4, 5];
    result = [n * 2 if n % 2 == 0 else n * 3 for n in nums];
    return result;
}

# Ternary with complex conditions
def test_ternary_complex_condition() -> str {
    x = 10;
    y = 20;
    result = "both positive" if x > 0 and y > 0 else "not both positive";
    return result;
}

# Ternary in assignment expression
def test_ternary_in_walrus() -> int {
    x = 5;
    if (result := 10 if x > 3 else 0) > 5 {
        return result;
    }
    return 0;
}

# Chained ternary operators
def test_chained_ternary() -> str {
    temp = 75;
    return "hot" if temp > 80 else "warm" if temp > 60 else "cold" if temp > 40 else "freezing";
}

# Ternary with object access
def test_ternary_with_access() -> int {
    data = {"a": 10, "b": 20};
    key = "a";
    result = data[key] if key in data else 0;
    return result;
}

# Ternary in function argument
def test_ternary_in_arg() -> int {
    def process(x: int) -> int { return x * 2; }

    val = 5;
    return process(val if val > 0 else 0);
}

# Ternary with boolean values
def test_ternary_boolean() -> bool {
    x = 10;
    result = True if x > 5 else False;
    return result;
}

# Ternary with None
def test_ternary_with_none() -> str {
    value = None;
    result = "exists" if value is not None else "none";
    return result;
}
