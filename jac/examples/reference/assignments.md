# Assignments

Assignment statements bind values to variables using various patterns and operators.

## Basic Assignment

The `=` operator assigns values to variables. Assignments can be chained (`a = b = c = value`) where evaluation proceeds right-to-left.

The `let` keyword provides explicit declaration, emphasizing the creation of a new binding.

## Type Annotations

Variables can be annotated with types using the `:` syntax:
- With immediate assignment: `name: type = value`
- Declaration without value: `name: type` (assigned later)
- Combined with `let`: `let name: type = value`

Type annotations serve as documentation and enable type checking but don't enforce runtime constraints.

## Augmented Assignment Operators

Augmented assignments combine an operation with assignment (`var op= value` ≡ `var = var op value`):

**Arithmetic:** `+=`, `-=`, `*=`, `/=`, `//=` (floor division), `%=` (modulo), `**=` (power)

**Bitwise:** `&=` (AND), `|=` (OR), `^=` (XOR), `<<=` (left shift), `>>=` (right shift)

**Matrix:** `@=` (matrix multiplication, for compatible types)

## Unpacking Assignments

Sequences can be unpacked into multiple variables:
- Tuple unpacking: `(x, y) = (1, 2)`
- List unpacking: `[a, b, c] = [1, 2, 3]`
- Nested unpacking: `(a, (b, c)) = (1, (2, 3))`

**Extended Unpacking** with `*` captures remaining elements:
- `(first, *rest) = [1, 2, 3, 4]` → `rest = [2, 3, 4]`
- `(head, *middle, tail) = [1, 2, 3, 4]` → `middle = [2, 3]`
- `(*beginning, last) = [1, 2, 3]` → `beginning = [1, 2]`

## Walrus Operator (Assignment Expression)

The walrus operator `:=` assigns and returns a value within expressions, enabling inline assignments in:
- Conditionals: `if (n := compute()) > 10`
- Loops: `while (line := read_line())`
- Comprehensions: `[y for x in data if (y := transform(x)) > 0]`

**OSP Context:** Walrus enables connect-and-assign patterns:
```
root ++> (node := DataNode())
```

## Assignments in Archetypes

Assignments occur in various archetype contexts:
- **Object methods:** Modify instance state via `self.attribute`
- **Walker abilities:** Update walker state, access nodes via `here`
- **Has statements:** Initialize member variables with default values

## Complex Assignment Contexts

Assignments can appear with:
- **Function results:** Capture return values
- **Conditional expressions:** Ternary operator results
- **Comprehensions:** List/dict/set comprehensions
- **Multiple returns:** Unpack tuple returns from functions
- **Nested scopes:** Access global and outer scope variables (requires `global`/`nonlocal` statements for modification)

## See Also

- [Walrus Assignments](walrus_assignments.md) - Detailed `:=` operator usage
- [Unpack Expressions](unpack_expressions.md) - Extended unpacking with `*`
- [Global and Nonlocal Statements](global_and_nonlocal_statements.md) - Scope modification
- [Type Tags](archetype_bodies.md) - Type annotation syntax in has statements
