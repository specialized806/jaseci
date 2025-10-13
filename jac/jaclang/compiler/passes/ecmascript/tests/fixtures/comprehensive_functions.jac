"""Comprehensive function tests covering various patterns."""

# Simple function with return type
def simple_function() -> str {
    return "hello";
}

# Function with typed parameters
def with_params(a: int, b: int) -> int {
    return a + b;
}

# Function with return value
def with_return(x: int) -> int {
    return x * 2;
}

# Function with default parameters
def with_defaults(name: str = "World", count: int = 1) -> str {
    return "Hello " + name + " " + str(count);
}

# Function with multiple return points
def classify_number(x: int) -> str {
    if x < 0 {
        return "negative";
    } elif x == 0 {
        return "zero";
    } else {
        return "positive";
    }
}

# Recursive function
def factorial(n: int) -> int {
    if n <= 1 {
        return 1;
    }
    return n * factorial(n - 1);
}

# Function with multiple parameters and operations
def calculate(a: int, b: int, c: int) -> int {
    result = a + b * c;
    result -= 10;
    result /= 2;
    return int(result);
}

# Function calling another function
def sum_squares(x: int, y: int) -> int {
    return with_params(x * x, y * y);
}

# Function with local variables
def process_data(value: int) -> int {
    temp = value * 2;
    adjusted = temp + 5;
    final = adjusted - 3;
    return final;
}

# Function with no return statement
def side_effect_only(x: int) {
    y = x + 1;
}

# Lambda expressions
def test_lambdas() {
    add = lambda a: int, b: int : a + b;
    result = add(5, 3);

    # Lambda without parameters
    get_value = lambda : 42;
    val = get_value();

    # Lambda with conditional
    max_val = lambda a: int, b: int : a if a > b else b;
    m = max_val(10, 20);
}

# Async function
async def async_fetch(url: str) -> str {
    return "fetched: " + url;
}

# Generator function with yield
def simple_generator(n: int) {
    for i in range(n) {
        yield i;
    }
}

# Yield from
def yield_from_list() {
    yield from [1, 2, 3, 4, 5];
}

# Function with variadic args
def sum_all(*values: tuple) -> int {
    total = 0;
    for v in values {
        total += v;
    }
    return total;
}

# Function with kwargs
def collect_options(**opts: dict) -> dict {
    return opts;
}

# Mixed parameters
def mixed_params(base: int, *extras: tuple, **options: dict) -> dict {
    return {"base": base, "extras": extras, "options": options};
}

# Nested functions
def outer(x: int) -> int {
    def inner(y: int) -> int {
        return x + y;
    }
    return inner(10);
}

# Function with walrus operator
def with_walrus(items: list) -> int {
    if (n := len(items)) > 5 {
        return n;
    }
    return 0;
}

# Function with global statement
let global_counter: int = 0;

def increment_global() {
    global global_counter;
    global_counter += 1;
}

# Function with nonlocal
def with_nonlocal() {
    count = 0;
    def increment() {
        nonlocal count;
        count += 1;
        return count;
    }
    return increment();
}
