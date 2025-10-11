"""Comprehensive control flow tests."""

# If-else
def test_if_else(x: int) -> str {
    if x > 10 {
        return "large";
    } else {
        return "small";
    }
}

# If-elif-else chain
def test_elif(score: int) -> str {
    if score >= 90 {
        return "A";
    } elif score >= 80 {
        return "B";
    } elif score >= 70 {
        return "C";
    } elif score >= 60 {
        return "D";
    } else {
        return "F";
    }
}

# Nested if statements
def test_nested_if(x: int, y: int) -> str {
    if x > 0 {
        if y > 0 {
            return "both positive";
        } else {
            return "x positive, y not";
        }
    } else {
        if y > 0 {
            return "y positive, x not";
        } else {
            return "both not positive";
        }
    }
}

# While loop
def test_while() -> int {
    count = 0;
    while count < 5 {
        count += 1;
    }
    return count;
}

# While with break
def test_while_break() -> int {
    i = 0;
    while True {
        i += 1;
        if i > 10 {
            break;
        }
    }
    return i;
}

# While with continue
def test_while_continue() -> int {
    i = 0;
    count = 0;
    while i < 10 {
        i += 1;
        if i % 2 == 0 {
            continue;
        }
        count += 1;
    }
    return count;
}

# For loop with range
def test_for_range() -> int {
    sum = 0;
    for i in range(10) {
        sum += i;
    }
    return sum;
}

# For loop with range and step
def test_for_range_step() -> int {
    sum = 0;
    for i in range(0, 10, 2) {
        sum += i;
    }
    return sum;
}

# For loop with list
def test_for_list() -> int {
    numbers = [1, 2, 3, 4, 5];
    total = 0;
    for num in numbers {
        total += num;
    }
    return total;
}

# For loop with enumerate (using range for index)
def test_for_enumerate() -> int {
    items = ["a", "b", "c"];
    total = 0;
    for i in range(len(items)) {
        total += i;
    }
    return total;
}

# For loop with zip (manual iteration)
def test_for_zip() -> int {
    a = [1, 2, 3];
    b = [4, 5, 6];
    total = 0;
    for i in range(len(a)) {
        total += a[i] + b[i];
    }
    return total;
}

# Nested loops
def test_nested_loops() -> int {
    result = 0;
    for i in range(3) {
        for j in range(3) {
            result += i * j;
        }
    }
    return result;
}

# Triple nested loops
def test_triple_nested() -> int {
    count = 0;
    for i in range(2) {
        for j in range(2) {
            for k in range(2) {
                count += 1;
            }
        }
    }
    return count;
}

# Break statement
def test_break() -> int {
    for i in range(100) {
        if i > 5 {
            break;
        }
    }
    return i;
}

# Continue statement
def test_continue() -> int {
    count = 0;
    for i in range(10) {
        if i % 2 == 0 {
            continue;
        }
        count += 1;
    }
    return count;
}

# Break in nested loop
def test_nested_break() -> int {
    found = 0;
    for i in range(10) {
        for j in range(10) {
            if i * j > 20 {
                found = i * j;
                break;
            }
        }
        if found > 0 {
            break;
        }
    }
    return found;
}

# Continue in nested loop
def test_nested_continue() -> int {
    count = 0;
    for i in range(5) {
        for j in range(5) {
            if j % 2 == 0 {
                continue;
            }
            count += 1;
        }
    }
    return count;
}

# Match statement (pattern matching)
def test_match(x: int) -> str {
    match x {
        case 0:
            return "zero";
        case 1:
            return "one";
        case 2:
            return "two";
        case _:
            return "other";
    }
}

# Match with guard
def test_match_guard(x: int) -> str {
    match x {
        case n if n < 0:
            return "negative";
        case n if n == 0:
            return "zero";
        case n if n > 0:
            return "positive";
        case _:
            return "unknown";
    }
}

# Match with or pattern
def test_match_or(code: int) -> str {
    match code {
        case 200 | 201 | 204:
            return "success";
        case 400 | 401 | 403 | 404:
            return "client error";
        case 500 | 502 | 503:
            return "server error";
        case _:
            return "unknown";
    }
}

# Ternary expression (conditional expression)
def test_ternary(x: int) -> str {
    result = "positive" if x > 0 else "non-positive";
    return result;
}

# Nested ternary
def test_nested_ternary(x: int) -> str {
    return "positive" if x > 0 else "zero" if x == 0 else "negative";
}

# With statement (context manager)
def test_with_statement() {
    with open("test.txt", "w") as f {
        f.write("hello");
    }
}

# Assert statement
def test_assert(x: int) {
    assert x > 0;
    assert x < 100;
}

# Delete statement
def test_delete() {
    items = [1, 2, 3];
    del items[0];
    return len(items);
}
