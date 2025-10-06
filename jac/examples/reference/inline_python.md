**Inline Python in Jac**

Jac supports embedding Python code blocks using the `::py::` delimiter syntax, enabling seamless integration with Python libraries and existing Python code.

**Basic Python Block**

Lines 4-10 demonstrate the simplest Python embedding:

```
::py::
def python_hello():
    return "Hello from Python!"

def python_add(a, b):
    return a + b
::py::
```

Python code is delimited by `::py::` markers at the beginning and end. Functions defined in Python blocks are directly callable from Jac code (lines 14-15).

**Python Block Syntax**

The `::py::` delimiter:
- Opens a Python code block (line 4)
- Closes the block with a matching `::py::` (line 10)
- Contains valid Python code using Python syntax (indentation-based, no semicolons)
- Can appear at module level or within archetype bodies

**Python Methods in Objects**

Lines 19-41 show Python methods within a Jac object:

```
obj DataProcessor {
    has data: list = [];

    ::py::
    def process(self):
        """Process data using Python libraries."""
        if not self.data:
            return []
        return [x * 2 for x in self.data if x > 0]

    def analyze(self):
        # Python statistical analysis
        return {
            "mean": sum(self.data) / len(self.data),
            "sum": sum(self.data)
        }
    ::py::
}
```

Python methods:
- Use `self` to access Jac member variables (line 25: `self.data`)
- Follow Python syntax and conventions
- Can use Python built-ins and comprehensions
- Are called like normal methods from Jac (lines 46, 49)

**Data Interoperability**

Lines 55-76 demonstrate Jac-Python data exchange:

```
::py::
def python_process_list(jac_list):
    return [x ** 2 for x in jac_list]

def python_process_dict(jac_dict):
    return {k: v * 2 for k, v in jac_dict.items()}
::py::
```

Data structures seamlessly pass between Jac and Python:
- Jac lists work as Python lists (line 70)
- Jac dicts work as Python dicts (line 74)
- Return values integrate naturally into Jac code

**Python Libraries Integration**

Lines 79-106 show importing and using Python libraries:

```
::py::
import json
import math

def format_json(data):
    return json.dumps(data, indent=2)

def math_operations(x):
    return {
        "sqrt": math.sqrt(x),
        "log": math.log(x),
        "sin": math.sin(x)
    }
::py::
```

Standard Python libraries and third-party packages are fully available within `::py::` blocks. Import statements work normally (lines 80-81).

**Python in Nodes**

Lines 109-135 demonstrate Python methods in node definitions:

```
node MathNode {
    has value: float = 0.0;
    has computed: dict = {};

    ::py::
    def compute_all(self):
        import math
        v = self.value
        self.computed = {
            "square": v ** 2,
            "cube": v ** 3,
            "sqrt": math.sqrt(abs(v))
        }
        return self.computed
    ::py::
}
```

Python methods in nodes can:
- Access node state via `self.value` (line 117)
- Modify node attributes (line 118)
- Import libraries locally (line 116)
- Return computed results (line 124)

**Mixed Jac and Python Methods**

Lines 166-205 show combining Jac and Python methods in the same object:

```
obj Calculator {
    has history: list = [];

    # Jac method
    def add_jac(value: int) {
        self.history.append(value);
        return sum(self.history);
    }

    ::py::
    # Python method
    def add_python(self, value):
        self.history.append(value)
        return sum(self.history)

    def get_stats(self):
        if not self.history:
            return {"avg": 0, "total": 0}
        return {
            "avg": sum(self.history) / len(self.history),
            "total": sum(self.history)
        }
    ::py::
}
```

Objects can have both Jac methods (lines 170-173) and Python methods (lines 177-191). Both types:
- Access the same `self.history` attribute
- Are called the same way from Jac code (lines 198-200)
- Can modify shared state

**Usage Contexts for Python Blocks**

| Context | Example Line | Purpose |
|---------|--------------|---------|
| Global scope | 4-10 | Define utility functions |
| Object body | 22-40 | Add Python methods to objects |
| Node body | 113-125 | Add Python methods to nodes |
| Mixed with Jac | 169-191 | Combine Jac and Python methods |

**When to Use Inline Python**

**Use Python for:**
- Computationally intensive operations
- Leveraging existing Python libraries
- Complex numerical/statistical operations
- String processing with Python's rich ecosystem
- Integration with Python-only APIs

**Use Jac for:**
- Object-Spatial Programming features
- Graph operations and traversal
- Walker-node interactions
- OSP-specific patterns

**Data Flow Diagram**

```mermaid
flowchart LR
    JacCode[Jac Code] -->|Call| PyFunc[Python Function]
    PyFunc -->|Access| JacData[Jac Data Structures]
    JacData -->|Lists, Dicts| PyProcess[Python Processing]
    PyProcess -->|Return| PyResult[Python Result]
    PyResult -->|Use| JacCode

    PyBlock[::py:: Block] -->|Import| PyLibs[Python Libraries]
    PyLibs -->|Use| PyFunc
```

**Method Access Patterns**

```mermaid
flowchart TD
    Object[Jac Object/Node] --> JacMethod[Jac Methods<br/>def name { }]
    Object --> PyMethods[Python Methods<br/>::py:: def name]
    JacMethod -->|Access| State[Shared State<br/>self.attributes]
    PyMethods -->|Access| State
    State -->|Available| Both[Both Method Types]
```

**Best Practices**

**Organize imports at the top of Python blocks:**
```
::py::
import json
import math
from collections import defaultdict

def process():
    # Use imports
::py::
```

**Use Python for library integration:**
```
::py::
import pandas as pd

def analyze_dataframe(data):
    df = pd.DataFrame(data)
    return df.describe().to_dict()
::py::
```

**Mix Python and Jac strategically:**
```
obj Processor {
    # Jac for OSP operations
    def traverse(node: Node) {
        visit [-->];
    }

    ::py::
    # Python for computation
    def compute_stats(self, values):
        return {
            "mean": sum(values) / len(values),
            "std": statistics.stdev(values)
        }
    ::py::
}
```

**Common Patterns**

**State modification from Python:**
```
obj Counter {
    has count: int = 0;

    ::py::
    def increment(self, by=1):
        self.count += by
        return self.count
    ::py::
}
```

**Using Python libraries:**
```
::py::
import json

def load_config(path):
    with open(path) as f:
        return json.load(f)
::py::
```

**Python comprehensions:**
```
::py::
def filter_and_transform(data):
    return [x * 2 for x in data if x > 0]
::py::
```

**Key Points**

1. `::py::` delimiters mark Python code blocks
2. Python blocks can appear at global scope or in archetypes
3. Python code follows Python syntax (indentation, no semicolons)
4. Jac data structures (lists, dicts) work seamlessly in Python
5. Python methods access Jac state via `self`
6. Standard and third-party Python libraries are fully available
7. Objects can mix Jac and Python methods
8. Return values from Python integrate naturally into Jac
9. Use Python for computation, Jac for OSP features
