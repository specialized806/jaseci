**If Statements in Jac**

If statements provide conditional control flow through `if`, `elif`, and `else` keywords. They allow code to execute different paths based on boolean conditions.

**Basic If Statement**

Lines 4-8 demonstrate the simplest conditional:

```
x = 10;
if x > 5 {
    print("x is greater than 5");
}
```

When the condition `x > 5` evaluates to true, the block executes.

**If-Else Statement**

Lines 11-16 show binary choice logic:

```
age = 18;
if age >= 18 {
    print("adult");
} else {
    print("minor");
}
```

Exactly one block executes: the `if` block when true, otherwise the `else` block.

**If-Elif-Else Chain**

Lines 19-28 demonstrate multiple exclusive conditions:

```
score = 85;
if score >= 90 {
    print("A");
} elif score >= 80 {
    print("B");
} elif score >= 70 {
    print("C");
} else {
    print("F");
}
```

Evaluation is top-down. The first true condition executes, then the entire chain terminates.

**Multiple Elif Branches**

Lines 31-42 show extended conditional chains with many branches. Each `elif` provides an additional condition to check if previous conditions were false.

**Nested If Statements**

Lines 45-55 demonstrate if statements within if statements:

```
a = 15;
b = 20;
if a > 10 {
    print("a > 10");
    if b > 15 {
        print("b > 15");
        if a + b > 30 {
            print("a + b > 30");
        }
    }
}
```

Inner conditions only evaluate if outer conditions are true.

**Complex Boolean Expressions**

Lines 58-72 show combining conditions with logical operators:

**AND operator** (line 58-60):
```
if a > 5 and b > 10 {
    print("both conditions true");
}
```

Both conditions must be true.

**OR operator** (line 62-64):
```
if a > 100 or b > 15 {
    print("at least one true");
}
```

At least one condition must be true.

**NOT operator** (line 66-68):
```
if not (a > 50) {
    print("negation true");
}
```

Negates the condition.

**Combined operators** (line 70-72):
```
if (a > 5 and b > 10) or (a < 20) {
    print("complex expression true");
}
```

Parentheses control precedence.

**Chained Comparisons**

Lines 75-78 demonstrate Python-style chained comparisons:

```
temp = 25;
if 20 <= temp <= 30 {
    print("comfortable temperature");
}
```

Equivalent to `20 <= temp and temp <= 30`, but evaluates `temp` only once.

**Membership Tests**

Lines 81-88 show `in` and `not in` operators:

```
fruits = ["apple", "banana"];
if "apple" in fruits {
    print("apple found");
}

if "grape" not in fruits {
    print("grape not found");
}
```

Works with any iterable: lists, tuples, sets, dictionaries (checks keys), strings.

**Identity Tests**

Lines 91-100 demonstrate `is` and `is not` for identity checking:

```
val = None;
if val is None {
    print("val is None");
}

if val is not None {
    print("val is not None");
} else {
    print("val is None");
}
```

Use `is` for None checks, not `==`.

**Comparison Operators**

| Operator | Meaning | Example Line |
|----------|---------|--------------|
| `==` | Equal | Throughout |
| `!=` | Not equal | Implicit |
| `<` | Less than | 32 |
| `<=` | Less than or equal | 76 |
| `>` | Greater than | 6 |
| `>=` | Greater than or equal | 12, 20 |
| `is` | Identity | 92 |
| `is not` | Not identity | 96 |
| `in` | Membership | 82 |
| `not in` | Non-membership | 86 |

**Logical Operators**

| Operator | Meaning | Precedence |
|----------|---------|------------|
| `not` | Negation | Highest |
| `and` | Both must be true | Medium |
| `or` | At least one must be true | Lowest |

**Control Flow Diagram**

```mermaid
flowchart TD
    Start([If Statement]) --> Cond1{If Condition<br/>True?}
    Cond1 -->|Yes| IfBlock[Execute If Block]
    Cond1 -->|No| Elif{Elif<br/>Present?}
    IfBlock --> Done([Continue])
    Elif -->|Yes| ElifCond{Elif Condition<br/>True?}
    Elif -->|No| Else{Else<br/>Present?}
    ElifCond -->|Yes| ElifBlock[Execute Elif Block]
    ElifCond -->|No| NextElif{More<br/>Elif?}
    ElifBlock --> Done
    NextElif -->|Yes| ElifCond
    NextElif -->|No| Else
    Else -->|Yes| ElseBlock[Execute Else Block]
    Else -->|No| Done
    ElseBlock --> Done
```

**Truthy and Falsy Values**

Jac follows Python's truthiness rules:

**Falsy values:**
- `False`
- `None`
- `0` (numeric zero)
- `""` (empty string)
- `[]` (empty list)
- `{}` (empty dict)

**Truthy values:**
- Everything else

Example:
```
empty_list = [];
if empty_list {
    print("not reached");
} else {
    print("list is empty");
}
```

**Common Patterns**

**Guard pattern (early return):**
```
def process(val: int) {
    if val < 0 {
        return;
    }
    # Process positive values
}
```

**Range checking:**
```
if 0 <= index < len(items) {
    item = items[index];
}
```

**None checking:**
```
if result is not None {
    process(result);
}
```

**Membership filtering:**
```
if item not in processed {
    process(item);
    processed.append(item);
}
```

**Multi-condition validation:**
```
if user and user.is_active and user.has_permission {
    allow_access();
}
```

**Short-Circuit Evaluation**

`and` and `or` use short-circuit evaluation:

```
if x != 0 and y / x > 5 {
    # Safe: if x == 0, y/x never evaluates
}
```

If `x != 0` is false, `y / x` doesn't execute (preventing division by zero).

**If Expression (Ternary)**

Jac supports if expressions for value selection:

```
status = "adult" if age >= 18 else "minor"
grade = "A" if score >= 90 else ("B" if score >= 80 else "C")
```

**If expressions must have an else clause** and return a value.

**Block Syntax Rules**

1. **Braces required**: `{ }` delimit blocks, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **Single-line allowed**: `if x > 5 { print("yes"); }` is valid
4. **Multi-line preferred**: For readability

**If Statement vs If Expression**

| Feature | If Statement | If Expression |
|---------|--------------|---------------|
| Syntax | `if cond { ... } else { ... }` | `val1 if cond else val2` |
| Returns value | No | Yes |
| Multiple statements | Yes | No (expressions only) |
| Else required | No | Yes |
| Use case | Control flow | Value selection |

**Key Differences from Python**

1. **Braces required**: Jac uses `{ }`, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **Same truthiness**: Empty collections are falsy
4. **Same operators**: `and`, `or`, `not`, `in`, `is`
5. **Same chaining**: `a <= b <= c` works identically
