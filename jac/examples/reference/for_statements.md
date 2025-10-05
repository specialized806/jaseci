For statements in Jac provide multiple iteration patterns, including Python-style `for-in` loops, Jac-specific `for-to-by` loops (C-style), and comprehensions. For loops work with all iterable types and integrate with Object-Spatial Programming (OSP) for graph traversal.

**Basic For-In Loop (Python-style)**

Lines 7-15 demonstrate the most common for loop: `for char in "Jac"`. The loop variable (`char`) takes each value from the iterable in sequence. Any iterable works: strings, lists, tuples, sets, dictionaries, ranges, etc.

**For-In with Range**

Lines 23-35 show `range()` usage:
- `range(3, 7)` - Start at 3, stop before 7 (yields 3, 4, 5, 6)
- `range(0, 10, 2)` - Start, stop, step (yields 0, 2, 4, 6, 8)
- `range(5)` - Stop only (yields 0, 1, 2, 3, 4, starts at 0 by default)

Range objects are lazy: they don't create the full list in memory, generating values on demand.

**For-To-By Loop (Jac-specific C-style)**

Lines 43-55 demonstrate Jac's unique C-style for loop:

```jac
for i=0 to i<5 by i+=1 {
    print(f"  i = {i}");
}
```

Syntax has three parts:
1. **Initialization**: `i=0` - Sets the starting value
2. **Condition**: `to i<5` - Loop continues while this is true
3. **Increment**: `by i+=1` - Executed after each iteration

**Counting down** (line 48): `for j=10 to j>5 by j-=1` - Start at 10, continue while > 5, decrement by 1.

**Step by N** (line 53): `for k=0 to k<10 by k+=2` - Skip-count by 2s.

This form provides explicit control over initialization, condition, and update, similar to C's `for(int i=0; i<5; i++)` but with more readable Jac syntax.

**For with Break**

Lines 62-68 show `break` exiting the loop immediately:
```jac
for num in range(10) {
    if num == 5 {
        print(f"  Breaking at {num}");
        break;  // Exit loop
    }
    print(f"  num = {num}");
}
```

When `break` executes, the loop terminates and any `else` clause is skipped.

**For with Continue**

Lines 75-80 show `continue` skipping to the next iteration:
```jac
for num in range(10) {
    if num % 2 == 0 {
        continue;  // Skip even numbers
    }
    print(f"  odd: {num}");
}
```

When `continue` executes, the remaining loop body is skipped and the next iteration begins.

**For with Else Clause**

Lines 88-103 demonstrate the `else` clause (Python-style):
```jac
for x in [1, 2, 3] {
    print(f"  x = {x}");
} else {
    print("  Loop completed normally");
}
```

The `else` block executes **only if the loop completes without encountering `break`**. This is useful for search patterns: if you break when finding an item, the else clause indicates "not found."

**Nested For Loops**

Lines 111-122 show nested loops:
```jac
for i in range(3) {
    for j in range(2) {
        print(f"  i={i}, j={j}");
    }
}
```

All for loop types can be nested and mixed: for-in, for-to-by, and comprehensions.

**For with Tuple Access**

Lines 131-145 show iterating over tuples and accessing elements by index:
```jac
pairs = [(1, "one"), (2, "two"), (3, "three")];
for pair in pairs {
    num = pair[0];
    word = pair[1];
    print(f"  {num}: {word}");
}
```

**Note**: Jac doesn't support tuple unpacking directly in for loops like `for num, word in pairs`. Instead, access elements by index.

**For with Enumerate**

Lines 153-164 show `enumerate()` for index-value pairs:
```jac
items = ["apple", "banana", "cherry"];
for enum_pair in enumerate(items) {
    idx = enum_pair[0];
    item = enum_pair[1];
    print(f"  {idx}: {item}");
}
```

`enumerate()` returns (index, value) tuples. Use `enumerate(items, start=1)` to start indexing at 1 instead of 0.

**For with Zip**

Lines 174-187 show `zip()` for iterating multiple lists in parallel:
```jac
names = ["Alice", "Bob", "Charlie"];
ages = [25, 30, 35];

for zipped in zip(names, ages) {
    name = zipped[0];
    age = zipped[1];
    print(f"  {name} is {age} years old");
}
```

`zip()` returns tuples pairing elements from each iterable. It stops at the shortest iterable's length.

**List Comprehensions**

Lines 180-193 show list comprehensions - concise syntax for creating lists:

```jac
// Basic comprehension
squares = [x**2 for x in range(5)];  // [0, 1, 4, 9, 16]

// With condition
evens = [x for x in range(10) if x % 2 == 0];  // [0, 2, 4, 6, 8]

// With transformation
upper = [s.upper() for s in ["hello", "world"]];  // ["HELLO", "WORLD"]

// Nested (cartesian product)
pairs = [(x, y) for x in range(3) for y in range(2)];
// [(0,0), (0,1), (1,0), (1,1), (2,0), (2,1)]
```

Syntax: `[expression for variable in iterable if condition]` where `if condition` is optional.

**Dictionary Comprehensions**

Lines 201-211 show dict comprehensions:
```jac
// Basic
squares_dict = {x: x**2 for x in range(5)};  // {0:0, 1:1, 2:4, 3:9, 4:16}

// From pairs
pairs = [("a", 1), ("b", 2)];
mapping = {pair[0]: pair[1] for pair in pairs};  // {"a":1, "b":2}

// With condition
even_squares = {x: x**2 for x in range(10) if x % 2 == 0};
```

Syntax: `{key_expr: value_expr for variable in iterable if condition}`.

**Set Comprehensions**

Lines 219-224 show set comprehensions:
```jac
unique_lengths = {len(word) for word in ["apple", "pie", "banana"]};
// {3, 5, 6} - sets automatically remove duplicates

mods = {x % 3 for x in range(10)};  // {0, 1, 2}
```

Syntax: `{expression for variable in iterable if condition}`. Like list comprehensions but produce sets (unique, unordered).

**For in Walker Abilities (OSP)**

Lines 238-260 demonstrate for loops in spatial contexts:
```jac
walker TaskProcessor {
    can process_all with `root entry {
        tasks = [-->];  // Get connected nodes
        for task_node in tasks {
            print(f"  Processing: {task_node.title}");
            self.processed.append(task_node.title);
            self.total_priority += task_node.priority;
        }
    }
}
```

The edge reference `[-->]` returns a list of connected nodes. For loops iterate over these nodes to process or collect data.

**For with Edge Iteration (OSP)**

Lines 283-303 show iterating over graph connections:
```jac
walker NetworkAnalyzer {
    can analyze with Person entry {
        friends = [-->];
        for friend in friends {
            self.friend_count += 1;
            print(f"    Friend: {friend.name}, age: {friend.age}");
        }
    }
}
```

This pattern enables graph traversal and analysis by iterating over a node's neighbors.

**For in Functions**

Lines 307-333 show for loops in function bodies:
```jac
def sum_list(numbers: list) -> int {
    total = 0;
    for num in numbers {
        total += num;
    }
    return total;
}
```

Functions use for loops for aggregation, searching, filtering, and transformation operations.

**For with Dictionary Iteration**

Lines 344-375 show iterating dictionaries:
```jac
config = {"host": "localhost", "port": 8080};

// Iterate keys (default)
for key in config {
    print(f"    {key}");
}

// Iterate values
for value in config.values() {
    print(f"    {value}");
}

// Iterate key-value pairs
for item in config.items() {
    key = item[0];
    value = item[1];
    print(f"    {key}: {value}");
}
```

- `config` alone iterates keys
- `config.values()` iterates values
- `config.items()` returns (key, value) tuples

**For with Conditional Logic**

Lines 387-395 show filtering during iteration:
```jac
numbers = [5, 12, 8, 20, 3, 15];
filtered = [];

for num in numbers {
    if num > 10 {
        filtered.append(num);
    }
}
```

Combine for loops with if statements to selectively process items. Alternatively, use comprehensions: `filtered = [num for num in numbers if num > 10]`.

**For with String Methods**

Lines 405-420 show string iteration patterns:
```jac
text = "Hello World";

// Iterate characters
for char in text {
    print(f"    '{char}'");
}

// Iterate words (after split)
for word in text.split() {
    print(f"    {word}");
}

// Iterate lines
for line in multiline.split("\n") {
    print(f"    {line}");
}
```

Strings are iterable (character-by-character). Use `.split()` to iterate by words or lines.

**Performance Patterns**

Lines 432-440 demonstrate best practices:
```jac
items = [10, 20, 30, 40, 50];

// Manual indexing (less idiomatic)
for i in range(len(items)) {
    print(f"    Item {i}: {items[i]}");
}

// Better: Use enumerate
for enum_pair in enumerate(items) {
    idx = enum_pair[0];
    item = enum_pair[1];
    print(f"    Item {idx}: {item}");
}
```

Prefer `enumerate()` over manual range-based indexing when you need both index and value.

**Loop Control Flow Summary**

| Statement | Effect | Else clause |
|-----------|--------|-------------|
| `break` | Exit loop immediately | Skipped |
| `continue` | Skip to next iteration | Not affected |
| Normal completion | Loop finishes naturally | Executes (if present) |

**For Loop Forms Comparison**

| Form | Syntax | Use Case | Example |
|------|--------|----------|---------|
| for-in | `for var in iterable` | Iterate collections | `for x in [1,2,3]` |
| for-to-by | `for i=start to cond by step` | Explicit counter control | `for i=0 to i<10 by i+=1` |
| for-else | `for ... { } else { }` | Detect uninterrupted completion | Search loops |
| List comprehension | `[expr for var in iter]` | Create lists concisely | `[x**2 for x in range(5)]` |
| Dict comprehension | `{k:v for var in iter}` | Create dicts concisely | `{x:x**2 for x in range(5)}` |
| Set comprehension | `{expr for var in iter}` | Create sets concisely | `{x%3 for x in range(10)}` |

**Common Patterns**

**Filtering with comprehensions**:
```jac
evens = [x for x in range(20) if x % 2 == 0];
```

**Transforming data**:
```jac
upper_names = [name.upper() for name in names];
```

**Building dictionaries from pairs**:
```jac
mapping = {pair[0]: pair[1] for pair in pairs};
```

**Aggregating values**:
```jac
total = 0;
for num in numbers {
    total += num;
}
```

**Finding an item (with for-else)**:
```jac
for item in items {
    if item.id == target_id {
        found = item;
        break;
    }
} else {
    found = None;  // Not found
}
```

**Graph traversal (OSP)**:
```jac
can process with `root entry {
    neighbors = [-->];
    for neighbor in neighbors {
        process(neighbor);
    }
}
```

**Key Differences from Python**

1. **Braces required**: Jac uses `{ }`, not indentation
2. **Semicolons required**: Each statement ends with `;`
3. **For-to-by syntax**: Unique to Jac, provides C-style explicit control
4. **No tuple unpacking**: Can't do `for k, v in items`, must access by index
5. **Same comprehensions**: List, dict, set comprehensions work as in Python
6. **Same else clause**: for-else works identically to Python

**Relationship to Other Features**

For loops interact with:
- **If statements** (if_statements.jac): `if` conditions filter iteration, `break`/`continue` control flow
- **While loops** (while_statements.jac): Alternative iteration when condition-based
- **Functions** (functions_and_abilities.jac): For loops in function bodies for processing
- **Walker abilities** (functions_and_abilities.jac): Iterate over `[-->]` edge references in spatial contexts
- **Edge references** (object_spatial_references.jac): `for node in [-->]` iterates graph neighbors
- **Comprehensions** (special_comprehensions.jac): Concise for loop syntax for creating collections

For loops are fundamental to iteration in Jac, from simple list processing to complex graph traversal in OSP contexts.
