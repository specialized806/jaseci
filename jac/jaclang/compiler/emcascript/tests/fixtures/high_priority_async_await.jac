"""High Priority: Async/Await expressions (AwaitExpression tests)."""

# Simple async function
async def simple_async() -> int {
    return 42;
}

# Async function with await
async def test_basic_await() -> int {
    result = await simple_async();
    return result;
}

# Multiple awaits in sequence
async def test_sequential_awaits() -> int {
    result1 = await simple_async();
    result2 = await simple_async();
    return result1 + result2;
}

# Await in expression
async def test_await_in_expression() -> int {
    x = 10;
    result = x + await simple_async();
    return result;
}

# Await with function call
async def compute_async(a: int, b: int) -> int {
    return a + b;
}

async def test_await_function_call() -> int {
    result = await compute_async(5, 10);
    return result;
}

# Multiple async operations
async def task1() -> int {
    return 1;
}

async def task2() -> int {
    return 2;
}

async def task3() -> int {
    return 3;
}

async def test_multiple_tasks() -> int {
    r1 = await task1();
    r2 = await task2();
    r3 = await task3();
    return r1 + r2 + r3;
}

# Await in conditional
async def test_await_in_conditional() -> str {
    result = await simple_async();
    if result > 40 {
        return "high";
    }
    return "low";
}

# Await in while loop
async def test_await_in_while() -> int {
    count = 0;
    i = 0;
    while i < 3 {
        value = await simple_async();
        count += value;
        i += 1;
    }
    return count;
}

# Await in for loop
async def test_await_in_for() -> list {
    results = [];
    for i in range(3) {
        value = await simple_async();
        results.append(value);
    }
    return results;
}

# Nested async calls
async def nested_outer() -> int {
    return await nested_inner();
}

async def nested_inner() -> int {
    return 100;
}

async def test_nested_async() -> int {
    result = await nested_outer();
    return result;
}

# Await with error handling
async def may_fail() -> int {
    return 42;
}

async def test_await_with_try() -> int {
    try {
        result = await may_fail();
        return result;
    } except Exception as e {
        return 0;
    }
}

# Await in list comprehension (if supported)
async def test_await_comprehension() -> list {
    async def get_value(x: int) -> int {
        return x * 2;
    }
    # This may need special handling
    # results = [await get_value(i) for i in range(5)];
    results = [];
    for i in range(5) {
        results.append(await get_value(i));
    }
    return results;
}

# Return await
async def test_return_await() -> int {
    return await simple_async();
}

# Await with variable assignment
async def test_await_assignment() -> int {
    value = await simple_async();
    doubled = value * 2;
    return doubled;
}

# Complex async scenario
async def process_data(data: list) -> list {
    results = [];
    for item in data {
        async def process_item(x: int) -> int {
            return x * 3;
        }
        result = await process_item(item);
        results.append(result);
    }
    return results;
}

async def test_complex_async() -> list {
    data = [1, 2, 3];
    return await process_data(data);
}
