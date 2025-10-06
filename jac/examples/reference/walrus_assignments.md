**Walrus Assignments**

The walrus operator `:=` enables assignment within expressions, allowing you to assign values and use them in the same statement. This operator is also known as the "assignment expression" operator.

**Walrus in If Conditions**

Lines 5-7 demonstrate using walrus in an if statement:

```
if (x := 10) > 5 {
    print(f"x = {x}");
}
```

Execution flow:
1. Assign 10 to `x`
2. Evaluate `x > 5` (true, since 10 > 5)
3. Enter the if block
4. `x` is available both in the condition and the block

Without walrus, you'd need: `x = 10; if x > 5 { ... }`. The walrus combines assignment and testing in one expression.

**Walrus in While Loops**

Lines 10-15 demonstrate walrus in a while condition:

```
i = 0;
data = [1, 2, 3, 4, 5];
while (item := data[i] if i < len(data) else None) and i < 3 {
    print(f"item: {item}");
    i += 1;
}
```

Line 12 assigns and tests in one expression:
1. Evaluate ternary: `data[i] if i < len(data) else None`
2. Assign result to `item`
3. Test `item and i < 3` (None is falsy, ending loop)
4. `item` is available in the loop body

This pattern processes items until a sentinel value (None) or condition limit.

**Walrus in Expressions**

Lines 18-19 demonstrate walrus in a regular expression:

```
result = (y := 20) + 10;
print(f"y = {y}, result = {result}");
```

Execution:
1. Assign 20 to `y`
2. Walrus evaluates to 20
3. Add 10 to get 30
4. Assign 30 to `result`

After this, `y` equals 20 and `result` equals 30. The walrus returns the assigned value, allowing it to participate in further calculations.

**Multiple Walrus Assignments**

Lines 22-24 show multiple walrus operators:

```
if (a := 5) and (b := 10) {
    print(f"a = {a}, b = {b}");
}
```

Execution:
1. Assign 5 to `a` (evaluates to 5, which is truthy)
2. Assign 10 to `b` (evaluates to 10, which is truthy)
3. Test `5 and 10` (true)
4. Both `a` and `b` available in block and beyond

**Walrus in Function Calls**

Lines 27-33 demonstrate walrus with function calls:

```
def process(value: int) -> int {
    return value * 2;
}

if (z := process(7)) > 10 {
    print(f"z = {z}");
}
```

Line 31 assigns the function result and tests it:
1. Call `process(7)` which returns 14
2. Assign 14 to `z`
3. Test if `z > 10` (true)
4. `z` is available for use

This avoids calling the function twice or storing in a temporary variable.

**Walrus with Complex Expressions**

Lines 36-39 show walrus with built-in functions:

```
numbers = [1, 2, 3, 4, 5];
if (total := sum(numbers)) > 10 {
    print(f"total = {total}");
}
```

Line 37 computes sum and assigns in one step:
1. Calculate `sum(numbers)` which returns 15
2. Assign 15 to `total`
3. Test if `total > 10` (true)
4. Use `total` in the block

**Walrus in Nested Context**

Lines 42-46 demonstrate nesting:

```
if (m := 5) {
    if (n := m * 2) > 8 {
        print(f"m = {m}, n = {n}");
    }
}
```

Nested walrus assignments:
1. Outer: assign 5 to `m`, test truthiness (true)
2. Inner: assign `m * 2` (10) to `n`, test if `n > 8` (true)
3. Both `m` and `n` available in innermost block

**Walrus Operator Behavior**

| Aspect | Behavior |
|--------|----------|
| Returns | The assigned value |
| Scope | Enclosing function or module |
| Usage context | Expressions (if, while, etc.) |
| Parentheses | Typically required to avoid ambiguity |

**Parentheses Requirement**

The walrus operator typically needs parentheses:
- `if (x := 5) > 3:` - Correct
- `if x := 5 > 3:` - Ambiguous/incorrect

Parentheses clarify: assign 5 to x, then compare x to 3, rather than assigning `5 > 3` to x.

**Scope Rules**

Variables assigned with walrus are scoped to the enclosing function or module, not just the expression or block:
- `x` from line 5 accessible after the if statement
- `item` from line 12 accessible after the while loop
- All walrus variables persist in their scope

**Use Cases**

The walrus operator excels at:

| Use Case | Example | Benefit |
|----------|---------|---------|
| Avoid duplication | `if (x := compute()) > threshold` | Compute once, use twice |
| Loop conditions | `while (line := file.readline())` | Assign and test |
| Complex conditions | `if (result := calc()) and result > 0` | Use result multiple times |
| Readability | Single expression vs multiple statements | More concise |

**Comparison to Regular Assignment**

Unlike regular assignment `=`, the walrus operator `:=`:
- Can be used within expressions
- Returns the assigned value
- Works in conditions, comprehensions, and other expression contexts
- Is an expression itself, not a statement

**Common Patterns**

Avoiding duplicate calls:
```
# Without walrus (calls twice or needs temp variable)
if expensive_function() > 10 {
    use(expensive_function());
}

# With walrus (calls once)
if (result := expensive_function()) > 10 {
    use(result);
}
```

Loop with sentinel:
```
while (line := file.readline()) {
    process(line);
}
```

Test and use:
```
if (match := regex.search(text)) {
    print(match.group(0));
}
```

The walrus operator makes code more concise by combining assignment and usage in a single expression, particularly valuable in conditional contexts where you need to both compute and test a value.
