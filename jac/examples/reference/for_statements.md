**For Statements in Jac**

For loops provide iteration over collections and sequences. Jac offers two distinct loop styles: the `for-in` pattern for iterating collections, and the `for-to-by` pattern for explicit counter control.

**Basic For-In Loop**

The simplest iteration pattern uses `for-in` to loop through collections (lines 5-7):

```
for x in [1, 2, 3] {
    print(x);
}
```

The loop variable `x` takes each value from the list in sequence. This works with any iterable: lists, tuples, sets, dictionaries, strings, and ranges.

**For-In with Range**

Lines 10-12 demonstrate using `range()` to generate numeric sequences:

```
for i in range(5) {
    print(i);
}
```

This produces values 0 through 4. The `range()` function is lazy, generating values on demand rather than creating a full list in memory.

**For-To-By Loop (Jac's C-Style Loop)**

Lines 15-17 show Jac's unique three-part loop syntax:

```
for i=0 to i<5 by i+=1 {
    print(i);
}
```

This loop has three components:
- **Initialization** (`i=0`): Sets the starting value
- **Condition** (`to i<5`): Loop continues while true
- **Increment** (`by i+=1`): Executed after each iteration

This provides explicit control similar to C's `for(int i=0; i<5; i++)` but with more readable syntax.

**Counting Down**

Line 20-22 shows decrementing with `for-to-by`:

```
for i=10 to i>0 by i-=1 {
    print(i);
}
```

The loop starts at 10, continues while `i>0`, and decrements by 1 each iteration.

**Custom Step Values**

Lines 25-27 demonstrate non-unit steps:

```
for i=0 to i<10 by i+=2 {
    print(i);
}
```

This produces even numbers: 0, 2, 4, 6, 8.

**For-Else Clause**

Lines 30-34 introduce the `else` clause, which executes only if the loop completes normally (without `break`):

```
for x in [1, 2, 3] {
    print(x);
} else {
    print("completed");
}
```

This pattern is useful for search operations: if you break when finding an item, the else clause indicates "not found."

**Breaking Out of Loops**

Lines 37-44 show how `break` exits the loop immediately and skips the else clause:

```
for x in range(10) {
    if x == 3 {
        break;
    }
    print(x);
} else {
    print("not reached");
}
```

Output: 0, 1, 2 (the else block doesn't execute).

**Continue Statement**

Lines 47-52 demonstrate `continue`, which skips to the next iteration:

```
for x in range(5) {
    if x % 2 == 0 {
        continue;
    }
    print(x);
}
```

This prints only odd numbers: 1, 3.

**Nested Loops**

Lines 55-59 show loops within loops:

```
for i in range(3) {
    for j in range(2) {
        print(f"{i},{j}");
    }
}
```

Both `for-in` and `for-to-by` loops can be nested and mixed freely.

**Iterating Strings**

Lines 62-64 demonstrate character iteration:

```
for char in "abc" {
    print(char);
}
```

Strings are iterable sequences of characters.

**Dictionary Iteration**

Lines 67-70 show that iterating a dictionary yields its keys:

```
d = {"a": 1, "b": 2};
for key in d {
    print(key);
}
```

Use `.values()` for values or `.items()` for key-value pairs.

**Mixed Loop Types**

Lines 73-77 demonstrate combining different loop styles:

```
for i in ["a", "b"] {
    for j=0 to j<2 by j+=1 {
        print(f"{i}{j}");
    }
}
```

The outer loop uses `for-in` while the inner uses `for-to-by`.

**Loop Control Flow Summary**

| Statement | Effect | Else Clause Behavior |
|-----------|--------|---------------------|
| `break` | Exit loop immediately | Skipped |
| `continue` | Skip to next iteration | Not affected |
| Normal completion | Loop finishes naturally | Executes (if present) |

**For Loop Variations**

| Form | Syntax | Use Case |
|------|--------|----------|
| for-in | `for var in iterable` | Iterate collections |
| for-to-by | `for i=start to cond by step` | Explicit counter control |
| for-else | `for ... { } else { }` | Detect uninterrupted completion |

**Loop Flow Visualization**

```mermaid
flowchart TD
    Start([Start For Loop]) --> Check{Condition<br/>True?}
    Check -->|Yes| Body[Execute Body]
    Body --> Continue{Continue<br/>Statement?}
    Continue -->|Yes| Update
    Continue -->|No| Break{Break<br/>Statement?}
    Break -->|Yes| End([Exit Loop])
    Break -->|No| Update[Update/Next Item]
    Update --> Check
    Check -->|No| Else{Else<br/>Clause?}
    Else -->|Yes, No Break| ElseBody[Execute Else]
    Else -->|No| End
    ElseBody --> End
```

**Common Patterns**

Filtering during iteration:
```
for num in numbers {
    if num > 10 {
        filtered.append(num);
    }
}
```

Aggregating values:
```
total = 0;
for num in numbers {
    total += num;
}
```

Finding with for-else:
```
for item in items {
    if item.id == target_id {
        found = item;
        break;
    }
} else {
    found = None;
}
```

**Key Differences from Python**

1. **Braces required**: Jac uses `{ }` for loop bodies, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **For-to-by syntax**: Unique to Jac, provides C-style explicit control
4. **Same else clause**: Works identically to Python
