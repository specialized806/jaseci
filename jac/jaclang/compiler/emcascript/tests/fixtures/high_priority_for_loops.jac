"""High Priority: Traditional for loops (ForStatement tests)."""

# Traditional for loop: for-to-by
def test_basic_for_to_by() -> int {
    total = 0;
    for i=0 to i<5 by i+=1 {
        total += i;
    }
    return total;
}

# For loop counting down
def test_for_countdown() -> int {
    result = 0;
    for i=10 to i>0 by i-=1 {
        result += i;
    }
    return result;
}

# For loop with step of 2
def test_for_step_two() -> list {
    evens = [];
    for i=0 to i<10 by i+=2 {
        evens.append(i);
    }
    return evens;
}

# For loop with larger step
def test_for_large_step() -> list {
    values = [];
    for i=0 to i<20 by i+=5 {
        values.append(i);
    }
    return values;
}

# Nested for-to-by loops
def test_nested_for_loops() -> list {
    result = [];
    for i=0 to i<3 by i+=1 {
        for j=0 to j<2 by j+=1 {
            result.append((i, j));
        }
    }
    return result;
}

# For loop with break
def test_for_with_break() -> int {
    for i=0 to i<100 by i+=1 {
        if i == 10 {
            return i;
        }
    }
    return -1;
}

# For loop with continue
def test_for_with_continue() -> int {
    count = 0;
    for i=0 to i<10 by i+=1 {
        if i % 2 == 0 {
            continue;
        }
        count += 1;
    }
    return count;
}

# For loop building string
def test_for_string_build() -> str {
    result = "";
    for i=0 to i<5 by i+=1 {
        result += str(i);
    }
    return result;
}

# For loop with multiplication step
def test_for_multiply_step() -> list {
    powers = [];
    for i=1 to i<=16 by i*=2 {
        powers.append(i);
    }
    return powers;
}

# For loop with complex condition
def test_for_complex_condition() -> int {
    total = 0;
    for i=1 to i<=20 by i+=1 {
        if i % 3 == 0 and i % 5 == 0 {
            total += i;
        }
    }
    return total;
}

# For loop with variable increment
def test_for_variable_increment() -> list {
    result = [];
    step = 3;
    for i=0 to i<15 by i+=step {
        result.append(i);
    }
    return result;
}

# For loop backwards with step
def test_for_backwards_step() -> list {
    values = [];
    for i=20 to i>=0 by i-=5 {
        values.append(i);
    }
    return values;
}

# Multiple operations in loop body
def test_for_multiple_ops() -> dict {
    squares = {};
    for i=1 to i<=5 by i+=1 {
        squares[i] = i * i;
    }
    return squares;
}

# For loop with else clause (executes when loop completes normally)
def test_for_with_else() -> str {
    result = "";
    for i=0 to i<3 by i+=1 {
        result += str(i);
    } else {
        result += "done";
    }
    return result;
}

# For loop where else is skipped (due to break)
def test_for_else_skipped() -> str {
    result = "";
    for i=0 to i<10 by i+=1 {
        if i == 3 {
            result += "broke";
            break;
        }
    } else {
        result += "completed";
    }
    return result;
}

# Mix for-in and for-to-by
def test_mixed_for_loops() -> list {
    result = [];
    for i=0 to i<2 by i+=1 {
        for item in ["a", "b"] {
            result.append((i, item));
        }
    }
    return result;
}

# For loop with function call in step
def test_for_with_function_step() -> int {
    def get_step() -> int {
        return 2;
    }

    total = 0;
    step = get_step();
    for i=0 to i<10 by i+=step {
        total += i;
    }
    return total;
}

# Complex nested scenario
def test_complex_nested() -> int {
    result = 0;
    for i=0 to i<5 by i+=1 {
        for j=0 to j<i by j+=1 {
            result += i * j;
        }
    }
    return result;
}

# For loop with accumulation
def test_for_accumulation() -> int {
    product = 1;
    for i=1 to i<=5 by i+=1 {
        product *= i;
    }
    return product;
}

# For loop with index and value
def test_for_indexed() -> dict {
    items = ["a", "b", "c"];
    indexed = {};
    idx = 0;
    for i=0 to i<len(items) by i+=1 {
        indexed[i] = items[i];
    }
    return indexed;
}
