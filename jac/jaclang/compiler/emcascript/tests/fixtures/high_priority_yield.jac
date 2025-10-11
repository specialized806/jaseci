"""High Priority: Yield expressions (YieldExpression tests)."""

# Simple generator
def simple_generator() {
    yield 1;
    yield 2;
    yield 3;
}

# Generator with return values
def yield_values() {
    yield "hello";
    yield 42;
    yield [1, 2, 3];
}

# Yield None
def yield_none() {
    yield;
    yield;
}

# Yield in loop
def yield_in_loop(n: int) {
    for i in range(n) {
        yield i;
    }
}

# Yield with expression
def yield_expression(start: int, end: int) {
    current = start;
    while current < end {
        yield current;
        current += 1;
    }
}

# Yield from generator (delegating generator)
def yield_from_list() {
    yield from [1, 2, 3];
    yield from range(4, 7);
}

# Conditional yield
def conditional_yield(items: list) {
    for item in items {
        if item % 2 == 0 {
            yield item;
        }
    }
}

# Yield with transformation
def yield_transformed(values: list) {
    for val in values {
        yield val * 2;
    }
}

# Multiple yields in sequence
def multiple_yields() {
    x = 10;
    yield x;
    yield x * 2;
    yield x * 3;
}

# Yield in nested loops
def nested_yield() {
    for i in range(3) {
        for j in range(2) {
            yield (i, j);
        }
    }
}

# Generator with state
def stateful_generator() {
    count = 0;
    while count < 5 {
        count += 1;
        yield count;
    }
}

# Yield with complex expression
def complex_yield_expr() {
    for i in range(5) {
        yield i ** 2 + i + 1;
    }
}

# Generator that yields dictionaries
def yield_dicts() {
    yield {"id": 1, "value": 10};
    yield {"id": 2, "value": 20};
    yield {"id": 3, "value": 30};
}

# Fibonacci generator
def fibonacci(n: int) {
    a = 0;
    b = 1;
    count = 0;
    while count < n {
        yield a;
        temp = a;
        a = b;
        b = temp + b;
        count += 1;
    }
}

# Yield with try-except
def safe_yield(values: list) {
    for val in values {
        try {
            yield val / 2;
        } except Exception as e {
            yield 0;
        }
    }
}

# Yield from nested generator
def outer_generator() {
    yield from inner_generator();
}

def inner_generator() {
    yield 100;
    yield 200;
    yield 300;
}

# Generator with parameters
def parametric_generator(start: int, step: int, count: int) {
    current = start;
    for i in range(count) {
        yield current;
        current += step;
    }
}

# Infinite generator (be careful with this!)
def infinite_counter() {
    n = 0;
    while True {
        yield n;
        n += 1;
    }
}

# Yield with filter
def filtered_yield(limit: int) {
    for i in range(limit) {
        if i % 3 == 0 {
            yield i;
        }
    }
}

# Generator chaining
def chain_generators() {
    yield from [1, 2];
    yield from [3, 4];
    yield from [5, 6];
}
