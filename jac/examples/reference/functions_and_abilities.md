Functions and abilities define callable units of code in Jac with rich type annotations, access control, abstract declarations, variadic parameters, async support, and Object-Spatial Programming (OSP) walker-node interaction capabilities.

**Grammar Rules**

```
ability: decorators? KW_ASYNC? (ability_decl | function_decl)
function_decl: KW_OVERRIDE? KW_STATIC? KW_DEF access_tag? named_ref func_decl? (block_tail | KW_ABSTRACT? SEMI)
ability_decl: KW_OVERRIDE? KW_STATIC? KW_CAN access_tag? named_ref event_clause (block_tail | KW_ABSTRACT? SEMI)
func_decl: (LPAREN func_decl_params? RPAREN) (RETURN_HINT expression)?
func_decl_params: (param_var COMMA)* param_var COMMA?
event_clause: KW_WITH expression (KW_ENTRY | KW_EXIT)?
```

**Basic Functions**

Lines 6-8 demonstrate a function with typed parameters and return type: `def add(x: int, y: int) -> int`. The function signature specifies two integer parameters and returns an integer. Lines 11-13 show a function with only a return type annotation (no parameters): `def get_default -> int`.

Lines 16-18 demonstrate using the generic `object` type for parameters when flexible typing is needed. While Jac requires type annotations, `object` allows any type to be passed.

**Static Functions and Access Modifiers**

Lines 26-28 show a static function: `static def square(x: int) -> int`. Static functions belong to the class itself rather than instances, allowing calls like `Calculator.square(5)` (line 307) without creating an instance.

Lines 31-33 combine static with access modifiers: `static def:priv internal_helper(x: int) -> int`. The `:priv` tag marks the function as private. Lines 36-38 show `:pub` (public) and lines 41-43 show `:protect` (protected) access tags.

Access tags control visibility across module boundaries:
- `:pub` - Public, accessible anywhere
- `:priv` - Private, accessible only within defining module
- `:protect` - Protected, accessible to subclasses

**Abstract Methods**

Line 49 demonstrates abstract method declaration: `def compute(x: int, y: int) -> int abs`. The `abs` keyword marks it as abstract - subclasses must provide implementations. Lines 63-65 show `ConcreteCalculator` implementing the abstract method.

Abstract methods enable interface-style programming where base classes define method signatures that subclasses must implement.

**Forward Declarations**

Lines 52, 55, and 58 show forward declarations - method signatures without bodies, terminated with semicolons:
- Line 52: `def process(value: float) -> float;` - declares signature
- Line 55: `def aggregate(*numbers: tuple) -> float;` - with variadic parameters
- Line 58: `def configure(**options: dict) -> dict;` - with keyword parameters

Forward declarations allow separating interface from implementation, useful for circular dependencies and organizing code.

**Implementation Blocks**

Lines 70-72 show implementing a forward-declared method using `impl`:

```
impl AbstractCalculator.process(value: float) -> float {
    return value * 1.5;
}
```

The `impl` keyword introduces the implementation block. The syntax is `impl ClassName.method_name` followed by the full function signature and body. Lines 74-76 and 78-81 provide implementations for the other forward-declared methods.

This pattern enables separation of declaration and implementation, similar to header/source file separation in C++.

**Variadic Parameters**

Lines 86-88 demonstrate positional variadic parameters: `def sum_all(*values: tuple) -> int`. The `*values` syntax collects all positional arguments into a tuple. When called on line 320 with `sum_all(1, 2, 3, 4, 5)`, the values become `(1, 2, 3, 4, 5)`.

Lines 91-93 show keyword variadic parameters: `def collect_options(**opts: dict) -> dict`. The `**opts` syntax collects keyword arguments into a dictionary. When called on line 321 with `collect_options(a=1, b=2)`, opts becomes `{'a': 1, 'b': 2}`.

Lines 96-102 demonstrate combining regular parameters, *args, and **kwargs in a single function:

```
def combined(base: int, *extras: tuple, **options: dict) -> dict
```

Parameter order must be: regular parameters, *args, **kwargs. The call on line 322 `combined(10, 20, 30, x=1, y=2)` results in `base=10`, `extras=(20, 30)`, `options={'x': 1, 'y': 2}`.

**Async Functions**

Lines 106-108 show async function declaration: `async def fetch_remote(url: str) -> dict`. The `async` keyword marks the function as asynchronous, enabling use of `await` within the function and requiring `await` when calling it.

Lines 111-113 demonstrate another async function. Async functions are essential for I/O-bound operations, network requests, and concurrent processing.

**Decorators**

Lines 117-125 define decorator functions. Decorators are functions that take a function and return a modified version. Lines 128-130 show single decorator application:

```
@logger
def logged_func(x: int) -> int
```

The `@logger` syntax is equivalent to `logged_func = logger(logged_func)`. The decorator executes at definition time (see output before main execution).

Lines 134-137 demonstrate multiple decorators:

```
@logger
@tracer
def double_decorated(x: int) -> int
```

Multiple decorators are applied bottom-up: `double_decorated = logger(tracer(double_decorated))`. The output shows "Tracer applied" then "Decorator applied", confirming bottom-up execution.

**Walker Abilities - Basic Events**

Lines 141-154 introduce walker abilities using the `can` keyword. Abilities define behavior triggered at specific events during walker execution.

Line 145: `can initialize with entry` - The `entry` event triggers when a walker is spawned (line 325). This is the walker's entry point.

Line 151: `can finalize with exit` - The `exit` event triggers when the walker completes execution (after all visits finish). Line 152 prints the final counter value.

Abilities use `can` instead of `def`, and specify an event clause with `with entry` or `with exit`.

**Walker Abilities with Typed Node Context**

Lines 157-195 demonstrate the core of OSP walker-node interaction. Unlike basic `entry`/`exit` events, abilities can trigger on specific node types.

Lines 172-175 show root entry ability: `can start with \`root entry`. The backtick-root (`\`root`) syntax specifies this ability triggers when the walker starts at the root node specifically.

Lines 178-182 show typed node ability: `can handle_person with Person entry`. This ability triggers **only when visiting Person nodes**. The `here` reference (line 180) accesses the current Person node being visited.

Lines 185-189 show another typed ability for City nodes: `can handle_city with City entry`. Different node types trigger different abilities.

The execution flow on line 338 `root spawn TypedWalker()`:
1. Walker spawns at root → `start` ability executes (line 173)
2. `visit [-->]` queues Alice and Bob (both Person nodes)
3. Walker visits Alice → `handle_person` executes (line 180 prints "Visiting person: Alice")
4. `visit [-->]` in line 181 queues NYC (City node)
5. Walker visits Bob → `handle_person` executes again
6. Walker visits NYC → `handle_city` executes (line 187)
7. No more visits → `report` exit ability executes (line 193)

This typed dispatch is OSP's fundamental pattern: computation (walker) flows to data (nodes), with different behaviors for different data types.

**Multiple Abilities on Same Node Type**

Lines 197-217 demonstrate multiple abilities triggered by the same node type. When `MultiAbilityWalker` visits a Person node, **both** `first_pass` and `second_pass` execute.

Line 201: `can first_pass with Person entry` - Executes first (definition order)
Line 208: `can second_pass with Person entry` - Executes second

The output shows for Alice: "First pass: Alice" then "Second pass: Alice". Both abilities execute sequentially in definition order. The walker state (`self.stage`) persists across both abilities, allowing the second to check what the first did.

Use cases:
- Multi-stage processing of same node
- Separating concerns (validation, then transformation)
- Conditional execution based on walker state

**Node Abilities**

Lines 219-234 demonstrate that **nodes can also have abilities**, triggered when specific walkers visit them.

Lines 225-228: `can greet_typed with TypedWalker entry` - This ability is **on the node**, triggered when a TypedWalker visits. The `self` reference (line 226) is the node, not the walker.

Lines 231-233: Another node ability for MultiAbilityWalker.

When line 351 executes `root spawn TypedWalker()` and the walker reaches charlie (InteractivePerson):
1. Walker's `handle_person` ability executes (from TypedWalker)
2. Node's `greet_typed` ability executes (from InteractivePerson)
3. Line 352 confirms: `charlie.greeted` is True (set by node ability line 227)

This bidirectional interaction is powerful: walkers can have node-specific behavior, and nodes can have walker-specific behavior. The `visitor` reference (available in node abilities) would provide access to the visiting walker.

**Async Abilities**

Lines 236-246 show async walker and async abilities. Line 237 declares an async walker: `async walker AsyncWalker`. Lines 238-240 show async ability: `async can process with entry`.

Async abilities enable:
- Concurrent graph traversal
- Awaiting I/O operations during traversal
- Parallel processing of multiple nodes

**Abstract Abilities**

Lines 248-259 demonstrate abstract walker abilities. Line 251 declares: `can must_override with entry abs`. The `abs` keyword marks the ability as abstract.

Lines 254-259 show `ConcreteWalker` inheriting from `AbstractWalker` and implementing the abstract ability. This enables interface-style walker definitions where base walkers define required behaviors.

**Static Abilities**

Lines 261-274 show static abilities. Line 266: `static can class_level with entry`. Static abilities are rare but allowed, belonging to the walker class rather than instances.

Line 270 shows a normal instance ability for comparison. Static abilities cannot access `self` since they're not bound to instances.

**Ability Execution and Control Flow**

Lines 276-296 demonstrate control flow within abilities. Lines 284-287 show conditional `disengage`:

```
if self.current_depth >= self.max_depth {
    print("  Max depth reached - stopping");
    disengage;
}
```

The `disengage` statement (covered in disengage_statements.jac) immediately terminates walker execution. This enables depth-limited traversal, search termination on goal, or resource-limited algorithms.

Line 366 spawns the walker on a chain of Person nodes. The output shows it visits depths 0, 1, 2, then disengages before depth 3.

**Ability Event Clause Variations**

The `event_clause` grammar allows:
- `with entry` - Walker spawn or any node visit
- `with exit` - Walker completion
- `with \`root entry` - Specific to root node
- `with NodeType entry` - Specific to NodeType nodes
- `with WalkerType entry` - Node ability for specific walker (lines 225, 231)

The `entry`/`exit` keywords are optional in some contexts but clarify intent.

**Execution Order Summary**

When a walker visits a node:
1. All matching walker abilities execute (in definition order)
2. All matching node abilities execute (in definition order)
3. Walker processes any `visit` statements to queue next nodes
4. Walker moves to next queued node or triggers `exit` abilities

**Function vs Ability Comparison**

| Feature | Function (`def`) | Ability (`can`) |
|---------|-----------------|-----------------|
| Keyword | `def` | `can` |
| Context | Objects, classes, walkers | Walkers, nodes |
| Trigger | Explicit call | Event-driven (node visits) |
| Event clause | No | Yes (`with entry`, etc.) |
| OSP role | Traditional computation | Spatial computation |
| `here` reference | Not available | Available in spatial context |
| `visitor` reference | Not available | Available in node abilities |

**Practical Patterns**

**Search pattern**:
```
walker Searcher {
    has found: Node? = None;
    can search with TargetType entry {
        self.found = here;
        disengage;
    }
}
```

**Multi-stage processing**:
```
walker Processor {
    can validate with Data entry { /* validate */ }
    can transform with Data entry { /* transform */ }
    can persist with Data entry { /* save */ }
}
```

**Node-walker interaction**:
```
node Document {
    can log_access with Auditor entry {
        self.access_log.append(visitor.timestamp);
    }
}
```

**Polymorphic traversal**:
```
walker Printer {
    can print_person with Person entry {
        print(f"Person: {here.name}");
        visit [-->];
    }
    can print_city with City entry {
        print(f"City: {here.name}");
        visit [-->];
    }
}
```

**Key Insights**

1. **Type-driven dispatch**: Walker abilities are selected based on node types, enabling polymorphic behavior without explicit type checking
2. **Separation of concerns**: Multiple abilities on the same node type allow separating processing stages
3. **Bidirectional interaction**: Walkers can have node-specific behavior (walker abilities) and nodes can have walker-specific behavior (node abilities)
4. **Event-driven execution**: Abilities trigger automatically based on graph traversal events, not explicit calls
5. **State preservation**: Walker attributes persist across all ability executions, enabling stateful graph algorithms

Functions and abilities provide the computational mechanisms for both traditional OOP (functions) and Object-Spatial Programming (abilities), with abilities enabling the unique "computation flows to data" paradigm through event-driven, type-specific dispatch during graph traversal.
