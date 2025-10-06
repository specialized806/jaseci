# Inline Python

Jac supports embedding Python code blocks using the `::py::` delimiter syntax, enabling seamless integration with Python libraries and code.

## Syntax

Python code blocks are delimited by `::py::` markers:
```
::py::
# Python code here
def my_function():
    return "Hello from Python"
::py::
```

## Usage Contexts

Python blocks can appear in:
- **Global scope:** Define functions and variables accessible throughout the module
- **Archetype bodies:** Add Python methods to objects, nodes, edges, and walkers
- **Mixed with Jac methods:** Combine Python and Jac methods in the same archetype

## Data Interoperability

Jac and Python share data structures seamlessly:
- **Jac → Python:** Lists, dicts, sets, tuples, and basic types are directly accessible
- **Python → Jac:** Python return values integrate naturally into Jac code
- **State access:** Python methods can access and modify Jac archetype state via `self`

## Python Libraries

Standard Python libraries and third-party packages are fully available:
- **Standard library:** `json`, `math`, `datetime`, `collections`, etc.
- **Import statements:** Use standard Python `import` within `::py::` blocks
- **Package ecosystem:** Any installed Python package can be used

## Method Integration

Python methods integrate with Jac archetypes:
- **Access members:** Python methods use `self.attribute` to access Jac member variables
- **Modify state:** Python can update Jac object state directly
- **Return values:** Python return values are usable in Jac expressions
- **Call from Jac:** Python-defined methods are called like native Jac methods

## Best Practices

- Use Python for computationally intensive operations or when leveraging existing Python libraries
- Use Jac for object-spatial programming features and graph operations
- Mix Python and Jac methods based on the strength of each language
- Python methods in archetypes should follow Python conventions (snake_case, etc.)

## Limitations

- Python code must be valid Python (follows Python syntax rules)
- Python code blocks cannot contain Jac syntax (use separate methods)
- Async Python requires appropriate async/await handling

## See Also

- [Archetypes](archetypes.md) - Defining objects, nodes, edges, walkers
- [Functions and Abilities](functions_and_abilities.md) - Jac method syntax
- [Implementations](implementations.md) - Forward declarations and impl blocks
