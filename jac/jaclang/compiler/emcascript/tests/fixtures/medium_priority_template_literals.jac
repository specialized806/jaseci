"""Medium Priority: Template literals for f-strings (TemplateLiteral tests)."""

# Simple f-string
def test_simple_fstring() -> str {
    name = "World";
    return f"Hello {name}";
}

# F-string with multiple variables
def test_fstring_multiple_vars() -> str {
    first = "John";
    last = "Doe";
    return f"Name: {first} {last}";
}

# F-string with expressions
def test_fstring_expressions() -> str {
    x = 10;
    y = 20;
    return f"Sum: {x + y}, Product: {x * y}";
}

# F-string with function calls
def test_fstring_function_calls() -> str {
    def get_value() -> int {
        return 42;
    }
    return f"The answer is {get_value()}";
}

# F-string with method calls
def test_fstring_method_calls() -> str {
    text = "hello";
    return f"Upper: {text.upper()}";
}

# F-string with complex expressions
def test_fstring_complex() -> str {
    items = [1, 2, 3];
    return f"Count: {len(items)}, Sum: {sum(items)}";
}

# Nested f-strings
def test_nested_fstring() -> str {
    name = "Alice";
    age = 30;
    return f"Person: {f'{name} ({age})'}";
}

# F-string with conditional
def test_fstring_conditional() -> str {
    score = 85;
    return f"Grade: {'A' if score >= 90 else 'B' if score >= 80 else 'C'}";
}

# F-string with formatting
def test_fstring_formatting() -> str {
    pi = 3.14159;
    return f"Pi: {pi:.2f}";
}

# Multiple f-strings concatenated
def test_multiple_fstrings() -> str {
    x = 5;
    y = 10;
    part1 = f"x = {x}";
    part2 = f"y = {y}";
    return f"{part1}, {part2}";
}

# F-string in list
def test_fstring_in_list() -> list {
    names = ["Alice", "Bob", "Charlie"];
    return [f"Hello {name}" for name in names];
}

# F-string with dictionary access
def test_fstring_dict_access() -> str {
    data = {"name": "Test", "value": 100};
    return f"Name: {data['name']}, Value: {data['value']}";
}

# F-string with list access
def test_fstring_list_access() -> str {
    items = [10, 20, 30];
    return f"First: {items[0]}, Last: {items[-1]}";
}

# F-string with arithmetic
def test_fstring_arithmetic() -> str {
    a = 15;
    b = 3;
    return f"{a} + {b} = {a + b}, {a} * {b} = {a * b}";
}

# F-string with boolean
def test_fstring_boolean() -> str {
    flag = True;
    return f"Status: {flag}";
}

# F-string with None
def test_fstring_none() -> str {
    value = None;
    return f"Value is {value}";
}

# F-string in function return
def test_fstring_return(name: str, age: int) -> str {
    return f"{name} is {age} years old";
}

# F-string with string methods
def test_fstring_string_methods() -> str {
    text = "  hello  ";
    return f"Stripped: '{text.strip()}'";
}

# F-string with comparison
def test_fstring_comparison() -> str {
    x = 10;
    y = 20;
    return f"{x} < {y}: {x < y}";
}

# Long f-string
def test_long_fstring() -> str {
    a = 1;
    b = 2;
    c = 3;
    d = 4;
    return f"Values: a={a}, b={b}, c={c}, d={d}, sum={a+b+c+d}";
}
