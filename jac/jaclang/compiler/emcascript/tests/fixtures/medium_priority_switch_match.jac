"""Medium Priority: Switch statements for simple match cases (SwitchStatement tests)."""

# Basic match with integers
def test_match_integers(code: int) -> str {
    match code {
        case 200:
            return "OK";
        case 404:
            return "Not Found";
        case 500:
            return "Server Error";
        case _:
            return "Unknown";
    }
}

# Match with strings
def test_match_strings(command: str) -> str {
    match command {
        case "start":
            return "Starting";
        case "stop":
            return "Stopping";
        case "pause":
            return "Pausing";
        case _:
            return "Unknown command";
    }
}

# Match with booleans
def test_match_boolean(flag: bool) -> str {
    match flag {
        case True:
            return "True case";
        case False:
            return "False case";
    }
}

# Match with multiple values (OR pattern)
def test_match_or_pattern(code: int) -> str {
    match code {
        case 200 | 201 | 204:
            return "Success";
        case 400 | 401 | 403 | 404:
            return "Client Error";
        case 500 | 502 | 503:
            return "Server Error";
        case _:
            return "Other";
    }
}

# Match with None
def test_match_none(value: any) -> str {
    match value {
        case None:
            return "No value";
        case _:
            return "Has value";
    }
}

# Match with guard clauses
def test_match_with_guard(age: int) -> str {
    match age {
        case x if x < 18:
            return "Minor";
        case x if x < 65:
            return "Adult";
        case x:
            return "Senior";
    }
}

# Match with float literals
def test_match_floats(pi: float) -> str {
    match pi {
        case 3.14:
            return "Pi";
        case 2.71:
            return "e";
        case _:
            return "Other number";
    }
}

# Match with variable binding
def test_match_capture(value: int) -> int {
    match value {
        case x if x > 100:
            return x * 2;
        case x:
            return x;
    }
}

# Match with multiple statements in case
def test_match_multiple_statements(status: str) -> int {
    result = 0;
    match status {
        case "success":
            result = 200;
            result += 10;
        case "error":
            result = 500;
            result += 5;
        case _:
            result = 0;
    }
    return result;
}

# Nested match statements
def test_nested_match(outer: int, inner: int) -> str {
    match outer {
        case 1:
            match inner {
                case 1:
                    return "1-1";
                case 2:
                    return "1-2";
                case _:
                    return "1-other";
            }
        case 2:
            return "2";
        case _:
            return "other";
    }
}

# Match in function
def classify(score: int) -> str {
    match score {
        case s if s >= 90:
            return "A";
        case s if s >= 80:
            return "B";
        case s if s >= 70:
            return "C";
        case s if s >= 60:
            return "D";
        case _:
            return "F";
    }
}

def test_match_in_function() -> str {
    return classify(85);
}

# Match with return in each case
def test_match_direct_return(day: int) -> str {
    match day {
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 7:
            return "Sunday";
        case _:
            return "Invalid";
    }
}

# Match with expression
def test_match_expression(value: int) -> int {
    result = match value {
        case 1:
            10;
        case 2:
            20;
        case _:
            0;
    };
    return result;
}

# Match with complex guards
def test_match_complex_guard(x: int, y: int) -> str {
    match x {
        case val if val > 0 and y > 0:
            return "both positive";
        case val if val < 0 and y < 0:
            return "both negative";
        case _:
            return "mixed";
    }
}

# Match with sequential processing
def test_match_sequential(items: list) -> int {
    total = 0;
    for item in items {
        match item {
            case x if x > 0:
                total += x;
            case _:
                pass;
        }
    }
    return total;
}
