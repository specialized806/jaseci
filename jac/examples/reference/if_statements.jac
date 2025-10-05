# If Statements - Conditional control flow

# ===== Part 1: Basic If Statement =====
with entry {
    print("=== 1. Basic If Statement ===");
    x = 10;

    if x > 5 {
        print(f"x ({x}) is greater than 5");
    }

    if x < 5 {
        print("This won't print");
    }
}

# ===== Part 2: If-Else Statement =====
with entry {
    print("\n=== 2. If-Else Statement ===");
    age = 18;

    if age >= 18 {
        print(f"Age {age}: Adult");
    } else {
        print(f"Age {age}: Minor");
    }
}

# ===== Part 3: If-Elif-Else Chain =====
with entry {
    print("\n=== 3. If-Elif-Else Chain ===");
    score = 85;

    if score >= 90 {
        print(f"Score {score}: Grade A");
    } elif score >= 80 {
        print(f"Score {score}: Grade B");
    } elif score >= 70 {
        print(f"Score {score}: Grade C");
    } elif score >= 60 {
        print(f"Score {score}: Grade D");
    } else {
        print(f"Score {score}: Grade F");
    }
}

# ===== Part 4: Multiple Elif Chains =====
with entry {
    print("\n=== 4. Multiple Elif Chains ===");
    value = 15;

    if value < 5 {
        print("Very low");
    } elif value < 10 {
        print("Low");
    } elif value < 15 {
        print("Medium");
    } elif value < 20 {
        print("High");
    } else {
        print("Very high");
    }
}

# ===== Part 5: Nested If Statements =====
with entry {
    print("\n=== 5. Nested If Statements ===");
    x = 15;
    y = 20;

    if x > 10 {
        print(f"x ({x}) > 10");
        if y > 15 {
            print(f"  and y ({y}) > 15");
            if x + y > 30 {
                print(f"    and x + y ({x + y}) > 30");
            }
        }
    }
}

# ===== Part 6: Chained Comparisons =====
with entry {
    print("\n=== 6. Chained Comparisons ===");
    temp = 25;

    # Python-style chained comparison
    if 20 <= temp <= 30 {
        print(f"Temperature {temp} is comfortable (20-30)");
    }

    # Multiple chained comparisons
    if 0 < temp < 100 {
        print(f"Temperature {temp} is in valid range (0-100)");
    }
}

# ===== Part 7: Complex Boolean Expressions =====
with entry {
    print("\n=== 7. Complex Boolean Expressions ===");
    a = 10;
    b = 20;
    c = 30;

    # AND operator
    if a > 5 and b > 15 {
        print(f"Both conditions true: a={a}>5 AND b={b}>15");
    }

    # OR operator
    if a > 100 or b > 15 {
        print(f"At least one true: a={a}>100 OR b={b}>15");
    }

    # NOT operator
    if not (a > 50) {
        print(f"Negation: NOT (a={a}>50) is true");
    }

    # Combined operators with parentheses
    if (a > 5 and b > 10) or (c < 20) {
        print("Complex: (a>5 AND b>10) OR (c<20) is true");
    }
}

# ===== Part 8: If Expression (Ternary) =====
with entry {
    print("\n=== 8. If Expression (Ternary) ===");

    age = 20;
    status = "adult" if age >= 18 else "minor";
    print(f"Age {age}: status = {status}");

    # Nested if expression
    score = 85;
    grade = "A" if score >= 90 else ("B" if score >= 80 else "C");
    print(f"Score {score}: grade = {grade}");

    # In assignment
    x = 10;
    max_val = x if x > 5 else 5;
    print(f"max(x={x}, 5) = {max_val}");
}

# ===== Part 9: If with Different Data Types =====
with entry {
    print("\n=== 9. If with Different Data Types ===");

    # String
    name = "Alice";
    if name == "Alice" {
        print(f"Hello, {name}!");
    }

    # List
    items = [1, 2, 3];
    if len(items) > 0 {
        print(f"List has {len(items)} items");
    }

    # None/null checking
    value = None;
    if value is None {
        print("value is None");
    }

    # Boolean
    flag = True;
    if flag {
        print("flag is True");
    }
}

# ===== Part 10: If in Functions =====
def check_positive(n: int) -> str {
    if n > 0 {
        return "positive";
    } elif n < 0 {
        return "negative";
    } else {
        return "zero";
    }
}

with entry {
    print("\n=== 10. If in Functions ===");
    print(f"check_positive(10) = {check_positive(10)}");
    print(f"check_positive(-5) = {check_positive(-5)}");
    print(f"check_positive(0) = {check_positive(0)}");
}

# ===== Part 11: If in Walker Abilities (OSP) =====
node DataNode {
    has value: int = 0;
    has active: bool = True;
}

walker Validator {
    has valid_count: int = 0;
    has invalid_count: int = 0;

    can start with `root entry {
        print("\n=== 11. If in Walker Abilities ===");
        visit [-->];
    }

    can validate with DataNode entry {
        # If statement in walker ability
        if here.active {
            if here.value > 10 {
                self.valid_count += 1;
                print(f"  Valid: value={here.value}");
            } else {
                self.invalid_count += 1;
                print(f"  Invalid: value={here.value} (too low)");
            }
        } else {
            print(f"  Skipped: inactive node");
        }
        visit [-->];
    }

    can report with exit {
        print(f"Validation complete: {self.valid_count} valid, {self.invalid_count} invalid");
    }
}

with entry {
    node1 = DataNode(value=15, active=True);
    node2 = DataNode(value=5, active=True);
    node3 = DataNode(value=20, active=False);

    root ++> node1;
    node1 ++> node2;
    node2 ++> node3;

    root spawn Validator();
}

# ===== Part 12: If with Edge References (OSP) =====
walker PathChecker {
    has has_path: bool = False;

    can check with `root entry {
        print("\n=== 12. If with Edge References ===");

        # Check if node has outgoing edges
        outgoing = [-->];
        if len(outgoing) > 0 {
            print(f"Root has {len(outgoing)} outgoing edges");
            self.has_path = True;
            visit [-->];
        } else {
            print("Root has no outgoing edges");
        }
    }

    can check_node with DataNode entry {
        # Conditional visit based on edge existence
        children = [-->];
        if len(children) > 0 {
            print(f"  Node value={here.value} has {len(children)} children");
            visit [-->];
        } else {
            print(f"  Node value={here.value} is a leaf (no children)");
        }
    }
}

with entry {
    root spawn PathChecker();
}

# ===== Part 13: If with Membership Tests =====
with entry {
    print("\n=== 13. If with Membership Tests ===");

    # In operator
    fruits = ["apple", "banana", "orange"];
    if "apple" in fruits {
        print("apple is in the list");
    }

    if "grape" not in fruits {
        print("grape is NOT in the list");
    }

    # Dictionary membership
    config = {"debug": True, "port": 8080};
    if "debug" in config {
        print(f"debug setting: {config['debug']}");
    }
}

# ===== Part 14: If Without Else (Guard Pattern) =====
def process_value(val: int) {
    # Early return pattern
    if val < 0 {
        print(f"  Skipping negative value: {val}");
        return;
    }

    if val > 100 {
        print(f"  Capping value at 100 (was {val})");
        val = 100;
    }

    print(f"  Processing value: {val}");
}

with entry {
    print("\n=== 14. Guard Pattern (If Without Else) ===");
    process_value(-5);
    process_value(50);
    process_value(150);
}

# ===== Part 15: Conditional Execution Patterns =====
with entry {
    print("\n=== 15. Conditional Execution Patterns ===");

    # Short-circuit evaluation
    x = 0;
    y = 10;
    if x != 0 and y / x > 5 {
        print("This won't execute (short-circuit prevents division by zero)");
    } else {
        print("x is 0, division skipped due to short-circuit");
    }

    # Truthy/Falsy values
    empty_list = [];
    if empty_list {
        print("List has items");
    } else {
        print("List is empty (falsy)");
    }

    non_empty = [1, 2, 3];
    if non_empty {
        print(f"List has {len(non_empty)} items (truthy)");
    }
}

with entry {
    print("\n✓ If statements demonstrated!");
}
