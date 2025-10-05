If statements in Jac provide conditional control flow through `if`, `elif`, and `else` keywords. Jac supports Python-style if statements with additional Object-Spatial Programming (OSP) features for spatial contexts.

**Basic If Statement**

Lines 8-14 demonstrate the simplest if statement: `if x > 5 { ... }`. When the condition evaluates to true, the block executes. The condition can be any expression that evaluates to a boolean value.

**If-Else Statement**

Lines 22-26 show if-else: `if age >= 18 { ... } else { ... }`. Exactly one block executes - the if block when the condition is true, otherwise the else block.

**If-Elif-Else Chain**

Lines 34-44 demonstrate elif chains for multiple exclusive conditions:
```jac
if score >= 90 {
    print("Grade A");
} elif score >= 80 {
    print("Grade B");
} elif score >= 70 {
    print("Grade C");
} else {
    print("Grade F");
}
```

Evaluation is top-down. The first true condition executes its block, then the entire chain terminates. If no conditions are true, the else block (if present) executes.

**Nested If Statements**

Lines 71-78 show if statements within if statements:
```jac
if x > 10 {
    print(f"x ({x}) > 10");
    if y > 15 {
        print(f"  and y ({y}) > 15");
        if x + y > 30 {
            print(f"    and x + y ({x + y}) > 30");
        }
    }
}
```

Each nested level is indented. Inner conditions only evaluate if outer conditions are true.

**Chained Comparisons**

Lines 88-95 demonstrate Python-style chained comparisons:
- `20 <= temp <= 30` - Checks if temp is between 20 and 30 inclusive
- `0 < temp < 100` - Checks if temp is strictly between 0 and 100

Chained comparisons are syntactic sugar for combined boolean expressions: `20 <= temp <= 30` is equivalent to `20 <= temp and temp <= 30`, but evaluates `temp` only once.

**Complex Boolean Expressions**

Lines 106-123 show combining conditions with logical operators:

| Operator | Meaning | Example (line) |
|----------|---------|----------------|
| `and` | Both conditions must be true | 106 |
| `or` | At least one condition must be true | 111 |
| `not` | Negates the condition | 116 |

Operators follow standard precedence: `not` > `and` > `or`. Use parentheses for clarity: `(a > 5 and b > 10) or (c < 20)`.

**Short-circuit Evaluation**: Lines 325-328 demonstrate that `and` and `or` use short-circuit evaluation. In `x != 0 and y / x > 5`, if `x != 0` is false, `y / x` never evaluates (preventing division by zero).

**If Expression (Ternary)**

Lines 131-142 show if expressions that return values:
- `status = "adult" if age >= 18 else "minor"` - Simple ternary
- `grade = "A" if score >= 90 else ("B" if score >= 80 else "C")` - Nested ternary

If expressions have the form: `<value_if_true> if <condition> else <value_if_false>`. Unlike if statements, if expressions are expressions that evaluate to a value.

**If with Different Data Types**

Lines 150-171 demonstrate if with various data types:
- **String equality** (line 151): `if name == "Alice"`
- **List length** (line 157): `if len(items) > 0`
- **None checking** (line 163): `if value is None` - Use `is` for None, not `==`
- **Boolean values** (line 169): `if flag` - Direct boolean check

**Truthy and Falsy Values** (lines 332-342): Jac follows Python's truthiness rules:
- **Falsy**: `False`, `None`, `0`, `""`, `[]`, `{}`
- **Truthy**: Everything else

Empty collections evaluate to false: `if empty_list` is false when `empty_list = []`.

**If in Functions**

Lines 175-189 show if statements in function bodies:
```jac
def check_positive(n: int) -> str {
    if n > 0 {
        return "positive";
    } elif n < 0 {
        return "negative";
    } else {
        return "zero";
    }
}
```

Early returns are common: the function returns immediately when a condition is met.

**If in Walker Abilities (OSP)**

Lines 207-220 demonstrate if statements in spatial contexts:
```jac
walker Validator {
    can validate with DataNode entry {
        if here.active {
            if here.value > 10 {
                self.valid_count += 1;
            } else {
                self.invalid_count += 1;
            }
        }
        visit [-->];
    }
}
```

In walker abilities, `here` refers to the current node being visited. If statements control walker behavior based on node state.

**If with Edge References (OSP)**

Lines 244-272 show conditionals based on graph structure:
```jac
walker PathChecker {
    can check with `root entry {
        outgoing = [-->];
        if len(outgoing) > 0 {
            print(f"Root has {len(outgoing)} outgoing edges");
            visit [-->];
        } else {
            print("Root has no outgoing edges");
        }
    }
}
```

Edge references like `[-->]` return lists of connected nodes. Checking `len(outgoing) > 0` determines if a node has children, enabling conditional traversal.

**Conditional Visit Patterns**: Line 252 shows `visit [-->]` only executes if edges exist, while line 254 handles the case of leaf nodes. This pattern prevents visiting when there are no connected nodes.

**Membership Tests**

Lines 280-292 demonstrate `in` and `not in` operators:
- **List membership** (line 280): `if "apple" in fruits`
- **Negation** (line 284): `if "grape" not in fruits`
- **Dictionary membership** (line 290): `if "debug" in config` - Checks keys, not values

Membership tests work with any iterable: lists, tuples, sets, dictionaries (keys), strings (substrings).

**Guard Pattern (If Without Else)**

Lines 296-315 demonstrate the guard pattern using early returns:
```jac
def process_value(val: int) {
    if val < 0 {
        print(f"  Skipping negative value: {val}");
        return;  # Early return
    }

    if val > 100 {
        print(f"  Capping value at 100 (was {val})");
        val = 100;
    }

    print(f"  Processing value: {val}");
}
```

Guards validate preconditions at the start of a function. If validation fails, return early. This reduces nesting compared to wrapping the entire function body in an if statement.

**Comparison Operators**

All standard comparison operators work in if conditions:

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal | `if x == 10` |
| `!=` | Not equal | `if x != 0` |
| `<` | Less than | `if x < 10` |
| `<=` | Less than or equal | `if x <= 10` |
| `>` | Greater than | `if x > 10` |
| `>=` | Greater than or equal | `if x >= 10` |
| `is` | Identity (same object) | `if value is None` |
| `is not` | Not identity | `if value is not None` |
| `in` | Membership | `if item in list` |
| `not in` | Non-membership | `if item not in list` |

**If Statement vs If Expression**

| Feature | If Statement | If Expression |
|---------|--------------|---------------|
| Syntax | `if cond { ... } else { ... }` | `val1 if cond else val2` |
| Returns value | No | Yes |
| Can contain multiple statements | Yes | No (single expressions only) |
| Must have else | No | Yes |
| Use case | Control flow | Value selection |

**Block Syntax**

Jac uses curly braces `{ ... }` for if blocks, not Python-style indentation:
- **Required**: Opening and closing braces
- **Optional**: Newlines (single-line blocks allowed)
- **Semicolons**: Required at end of each statement within blocks

```jac
// Multi-line (preferred)
if x > 5 {
    print("Greater");
}

// Single-line (allowed)
if x > 5 { print("Greater"); }
```

**Common Patterns**

**Validation and early exit**:
```jac
def process(data: list) {
    if len(data) == 0 {
        return;  // Guard: exit early if invalid
    }
    // Process data...
}
```

**State checking in walker abilities**:
```jac
can process with Node entry {
    if here.should_skip {
        visit [-->];  // Skip processing, continue traversal
        return;
    }
    // Process node...
}
```

**Conditional traversal**:
```jac
can traverse with Node entry {
    if here.has_children {
        visit [-->];  // Only traverse if children exist
    } else {
        disengage;  // Stop at leaf nodes
    }
}
```

**Type-based dispatch**:
```jac
can handle with Node entry {
    if here.node_type == "data" {
        process_data(here);
    } elif here.node_type == "config" {
        process_config(here);
    }
}
```

**Key Differences from Python**

1. **Braces required**: Jac uses `{ }`, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **Same truthiness rules**: Empty collections are falsy
4. **Same operators**: `and`, `or`, `not`, `in`, `is`
5. **OSP integration**: `here`, `visitor` references available in spatial contexts

**Relationship to Other Features**

If statements interact with:
- **For loops** (for_statements.jac): `if` can break/continue within loops
- **While loops** (while_statements.jac): `if` controls loop continuation
- **Functions** (functions_and_abilities.jac): `if` with early returns
- **Walker abilities** (functions_and_abilities.jac): `if` controls traversal and node processing
- **Edge references** (object_spatial_references.jac): `if len([-->]) > 0` checks connectivity

If statements are fundamental to all conditional logic in Jac, from simple value checks to complex spatial graph traversal decisions.
