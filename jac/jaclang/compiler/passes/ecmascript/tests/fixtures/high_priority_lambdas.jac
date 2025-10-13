"""High Priority: Lambda expressions (ArrowFunctionExpression tests)."""

# Simple lambda
def test_simple_lambda() -> int {
    add = lambda x: int, y: int : x + y;
    return add(5, 3);
}

# Lambda without parameters
def test_lambda_no_params() -> int {
    get_value = lambda : 42;
    return get_value();
}

# Lambda with single parameter
def test_lambda_single_param() -> int {
    square = lambda x: int : x * x;
    return square(7);
}

# Lambda with default parameters
def test_lambda_defaults() -> int {
    power = lambda x: int = 2, y: int = 3 : x ** y;
    return power(5, 2);
}

# Lambda as argument to map
def test_lambda_in_map() -> list {
    numbers = [1, 2, 3, 4, 5];
    doubled = list(map(lambda x: int : x * 2, numbers));
    return doubled;
}

# Lambda as argument to filter
def test_lambda_in_filter() -> list {
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    evens = list(filter(lambda x: int : x % 2 == 0, numbers));
    return evens;
}

# Lambda in sort key
def test_lambda_in_sort() -> list {
    words = ["apple", "pie", "a", "cherry"];
    sorted_words = sorted(words, key=lambda s: str : len(s));
    return sorted_words;
}

# Lambda with conditional expression
def test_lambda_with_ternary() -> int {
    max_val = lambda a: int, b: int : a if a > b else b;
    return max_val(10, 20);
}

# Lambda returning lambda (closure)
def test_lambda_closure() -> int {
    make_adder = lambda x: int : (lambda y: int : x + y);
    add_five = make_adder(5);
    return add_five(10);
}

# Multiple lambdas in one function
def test_multiple_lambdas() -> int {
    add = lambda x: int, y: int : x + y;
    multiply = lambda x: int, y: int : x * y;
    return add(3, 4) + multiply(5, 6);
}

# Lambda with complex expression
def test_lambda_complex() -> int {
    compute = lambda x: int, y: int : (x + y) * 2 - (x - y);
    return compute(10, 5);
}

# Lambda assigned to variable then used
def test_lambda_assignment() -> list {
    transform = lambda x: int : x * 3 + 1;
    nums = [1, 2, 3];
    return [transform(n) for n in nums];
}

# Lambda with type annotation
def test_lambda_typed() -> int {
    divide = lambda a: int, b: int -> int : a // b;
    return divide(20, 3);
}

# Nested lambdas
def test_nested_lambdas() -> int {
    outer = lambda x: int : (lambda y: int : (lambda z: int : x + y + z));
    return outer(1)(2)(3);
}

# Lambda in list
def test_lambda_list() -> list {
    ops = [
        lambda x: int : x + 1,
        lambda x: int : x * 2,
        lambda x: int : x ** 2
    ];
    results = [op(5) for op in ops];
    return results;
}
