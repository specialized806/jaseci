"""Low Priority: Do-while loops (DoWhileStatement tests)."""

# Note: Jac doesn't have native do-while syntax
# These tests simulate do-while behavior using while loops
# A true do-while would execute body at least once before checking condition

# Simulated do-while - basic
def test_do_while_basic() -> int {
    i = 0;
    result = 0;
    # do { result += i; i++; } while (i < 5);
    # Simulate by executing once, then while
    while True {
        result += i;
        i += 1;
        if not (i < 5) {
            break;
        }
    }
    return result;
}

# Simulated do-while - executes at least once even if condition false
def test_do_while_once() -> int {
    count = 0;
    condition = False;
    # Should execute once even though condition is False
    while True {
        count += 1;
        if not condition {
            break;
        }
    }
    return count;  # Should be 1
}

# Simulated do-while with break
def test_do_while_break() -> int {
    i = 0;
    total = 0;
    while True {
        total += i;
        if i == 3 {
            break;
        }
        i += 1;
        if not (i < 10) {
            break;
        }
    }
    return total;
}

# Simulated do-while with continue
def test_do_while_continue() -> int {
    i = 0;
    count = 0;
    while True {
        i += 1;
        if i % 2 == 0 {
            if i < 10 {
                continue;
            } else {
                break;
            }
        }
        count += 1;
        if not (i < 10) {
            break;
        }
    }
    return count;
}

# Simulated do-while with complex condition
def test_do_while_complex() -> int {
    x = 0;
    sum = 0;
    while True {
        sum += x;
        x += 1;
        if not (x < 5 and sum < 20) {
            break;
        }
    }
    return sum;
}

# Regular while vs do-while behavior
def test_while_comparison() -> dict {
    # Regular while - might not execute at all
    i = 10;
    while_result = 0;
    while i < 5 {
        while_result += i;
        i += 1;
    }

    # Do-while simulation - always executes once
    j = 10;
    do_while_result = 0;
    while True {
        do_while_result += j;
        j += 1;
        if not (j < 5) {
            break;
        }
    }

    return {
        "while": while_result,      # 0 (never executed)
        "do_while": do_while_result  # 10 (executed once)
    };
}

# Nested do-while simulation
def test_nested_do_while() -> int {
    i = 0;
    result = 0;
    while True {
        j = 0;
        while True {
            result += i * j;
            j += 1;
            if not (j < 2) {
                break;
            }
        }
        i += 1;
        if not (i < 3) {
            break;
        }
    }
    return result;
}

# Do-while with accumulation
def test_do_while_accumulation() -> list {
    results = [];
    i = 0;
    while True {
        results.append(i * 2);
        i += 1;
        if not (i < 5) {
            break;
        }
    }
    return results;
}

# Do-while pattern for input validation simulation
def test_do_while_validation() -> int {
    attempts = 0;
    valid = False;
    value = 3;  # Simulated input

    while True {
        attempts += 1;
        if value > 5 {
            valid = True;
        } else {
            value += 2;  # Adjust value
        }
        if valid or attempts >= 3 {
            break;
        }
    }
    return attempts;
}

# Do-while with function call
def should_continue(x: int) -> bool {
    return x < 10;
}

def test_do_while_function() -> int {
    i = 0;
    while True {
        i += 1;
        if not should_continue(i) {
            break;
        }
    }
    return i;
}
