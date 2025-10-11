"""Comprehensive exception handling tests."""

# Try-except
def test_try_except() -> str {
    try {
        x = 10 / 0;
        return "no error";
    } except Exception as e {
        return "caught exception";
    }
}

# Try-except-finally
def test_try_except_finally() -> str {
    result = "";
    try {
        value = 5 + 5;
        result = "success";
    } except Exception as e {
        result = "error";
    } finally {
        result += " cleaned";
    }
    return result;
}

# Multiple except clauses
def test_multiple_except(code: int) -> str {
    try {
        if code == 1 {
            x = 10 / 0;
        } elif code == 2 {
            y = int("abc");
        } else {
            z = [1, 2][10];
        }
        return "ok";
    } except ZeroDivisionError as e {
        return "division error";
    } except ValueError as e {
        return "value error";
    } except Exception as e {
        return "other error";
    }
}

# Try without except (just finally)
def test_try_finally() -> int {
    count = 0;
    try {
        count = 10;
    } finally {
        count += 5;
    }
    return count;
}

# Nested try-except
def test_nested_try() -> str {
    try {
        try {
            x = 1 / 0;
        } except ValueError {
            return "inner value error";
        }
        return "no inner error";
    } except Exception {
        return "outer caught";
    }
}

# Raise statement
def test_raise() {
    raise Exception("Custom error");
}

# Re-raise
def test_reraise() {
    try {
        x = 1 / 0;
    } except Exception as e {
        raise;
    }
}
