Object spatial calls are the mechanisms for spawning and executing walkers on graph nodes. The primary operator is `spawn`, with additional operators `:>` and `|>` providing syntactic variations for walker invocation.

**Grammar Rules**

```
atomic_pipe: (atomic_pipe A_PIPE_FWD)? atomic_pipe_back
atomic_pipe_back: (atomic_pipe_back A_PIPE_BKWD)? os_spawn
os_spawn: (os_spawn KW_SPAWN)? unpack
pipe_call: (PIPE_FWD | A_PIPE_FWD | KW_SPAWN | KW_AWAIT)? atomic_chain

A_PIPE_FWD: ":>"
A_PIPE_BKWD: "<:"
KW_SPAWN: "spawn"
```

**Basic spawn Keyword**

Lines 204 and 325 demonstrate the most common spawn syntax: `root spawn BasicSpawn()`. This creates a walker instance and launches it at the specified node (`root`).

The syntax is `node spawn Walker()` where:
- `node` is the starting node (often `root`)
- `Walker()` constructs a new walker instance
- The walker's matching entry ability executes immediately

Line 204 output shows "BasicSpawn: started at root" from the `\`root entry` ability (line 27), then the walker visits outgoing nodes via `visit [-->]` (line 28), triggering the Task entry ability (lines 31-34) for each Task node.

**Walker Traversal Order**

When multiple nodes are queued via `visit` statements, **walkers process nodes in FIFO (first-in-first-out) order**. The visit queue acts like a standard queue data structure.

Lines 17-21 demonstrate this. When the walker is at a node and executes `visit [-->]`, all outgoing nodes are added to the visit queue. The walker then processes queued nodes in the order they were added - first queued, first visited.

The output for section 2 shows visits happening in graph order:
```
BasicSpawn: started at root
  BasicSpawn at: Task1
  BasicSpawn at: Task2
  BasicSpawn at: Task3
  BasicSpawn at: Task4
```

Since Task1 was connected first (line 194), it's visited first. Then Task2 and Task3 (children of Task1) are visited in connection order.

**Controlling Traversal Order with Visit Statements**

Traversal order is NOT controlled by spawn operators (`:>` or `|>`), but by **how you structure your visit statements**. The `visit` statement has an optional queue index parameter that determines where in the queue nodes are placed.

**Visit statement syntax with queue index**:
```
visit_stmt: KW_VISIT (COLON expression COLON)? expression
```

- `visit [-->];` - Default: adds nodes to end of queue (FIFO behavior)
- `visit :0: [-->];` - Adds nodes to beginning of queue (index 0)
- `visit :-1: [-->];` - Explicitly adds to end of queue (index -1, same as default)
- `visit :index: [-->];` - Adds nodes at specific queue position

The queue index expression between colons specifies where to insert visited nodes:
- **Index 0** = front of queue (visited next, creates depth-first-like behavior)
- **Index -1** = end of queue (visited last, creates breadth-first-like behavior)
- **Other indices** = specific positions for fine-grained control

**Examples controlling traversal order**:

```
# Depth-first style: visit children before siblings
can explore with Node entry {
    visit :0: [-->];  // Add children to front of queue
}

# Breadth-first style: visit children after siblings
can explore with Node entry {
    visit :-1: [-->];  // Add children to end of queue (default)
}

# Priority-based: high priority to front, low priority to back
can process with Node entry {
    visit :0: [->:HighPriority:->];   // High priority to front
    visit :-1: [->:LowPriority:->];   // Low priority to back
}
```

The key insight: **walkers always process their queue FIFO**, but you control queue insertion position with the visit statement's index parameter.

**Spatial Call Operators :> and |>**

Lines 209 demonstrates `:>` operator: `root spawn :> DepthFirst;`
Line 214 demonstrates `|>` operator: `root spawn |> BreadthFirst;`

**Critical syntax note**: These operators take the **walker type**, not a constructed instance. The correct syntax is `root spawn :> Walker` (line 209), **not** `root spawn :> Walker()`.

These operators are syntactic variations for spawning walkers. They do NOT change how the visit queue is processed (which is always FIFO). Their semantics may relate to other aspects of walker execution (such as async processing or spawn context), but the fundamental visit queue remains FIFO.

**Walker Return Values**

Lines 219-221 demonstrate accessing walker state after execution:

```
collector = root spawn DataCollector();
print(f"  Collected: {collector.collected}");
print(f"  Sum of priorities: {collector.sum}");
```

When `spawn` executes:
1. Walker is created (if using `Walker()` syntax) or instantiated (if using walker type)
2. Walker traverses the graph according to its abilities and visit statements
3. Walker processes its visit queue in FIFO order
4. `spawn` returns the walker instance
5. Walker attributes (`collected`, `sum`) are accessible

Lines 70-83 define `DataCollector` which accumulates data during traversal (lines 79-80). After the walker completes (line 219), its state persists and can be queried. The output shows: `Collected: ['Task1', 'Task2', 'Task3', 'Task4']` and `Sum of priorities: 26`.

This pattern enables walkers as data collectors, analyzers, or state machines that traverse graphs and return aggregated results.

**Walker Spawned from Nodes**

Lines 85-112 demonstrate walkers spawning other walkers mid-traversal. Line 96 shows: `here spawn SubWalker();`.

The `NodeSpawner` walker (lines 86-100) traverses the graph and conditionally spawns a `SubWalker` when it reaches "Task2" (lines 93-96). The `here` reference is the current node (Task2), becoming the spawn point for the new walker.

The output shows:
```
At Task2
  Spawning SubWalker from Task2
  SubWalker started at: Task2
    SubWalker processing: Task2
```

The SubWalker (lines 102-112) starts at Task2 (its spawn point) and continues visiting from there. This enables hierarchical walker patterns where parent walkers spawn child walkers at interesting nodes.

**Walker Construction with Arguments**

Lines 114-136 demonstrate parameterized walker creation. Line 229 shows: `root spawn ConstructedWalker(label="Alpha", max_visits=2);`.

The walker is constructed with initial state (`label="Alpha"`, `max_visits=2`). These values initialize the walker's attributes (lines 116-117) before traversal begins. This enables configurable walker behavior without subclassing.

Lines 125-135 show the walker using its configuration to control traversal (stopping after `max_visits` reached via `disengage`). The output confirms: "Walker visited 2 tasks" (line 230).

**Multiple Walkers on Same Graph**

Lines 232-238 demonstrate running different walkers on the same graph structure:

```
counter = root spawn Counter();
analyzer = root spawn Analyzer();
```

Each walker traverses the same nodes but performs different analysis:
- `Counter` (lines 139-150) counts total tasks
- `Analyzer` (lines 152-168) categorizes by priority

The output shows both results: "Counter: 4 tasks" and "Analyzer: 2 high, 2 low priority". This demonstrates graph-as-data / walker-as-computation separation: the graph structure is traversed multiple times by different computational agents, each extracting different information.

**Spawn Syntax Variations**

Lines 240-255 demonstrate all valid spawn syntaxes:

**Variation 1** (line 242): `root spawn SyntaxDemo();` - Most common form. Node (root) spawns constructed walker instance.

**Variation 2** (line 245): `root spawn :> SyntaxDemo;` - Spawn with `:>` operator using walker type (not instance).

**Variation 3** (line 248): `root spawn |> SyntaxDemo;` - Spawn with `|>` operator using walker type.

**Variation 4** (line 251): `SyntaxDemo() spawn root;` - Walker-first syntax. Less common but valid. Constructed walker is spawned at node.

**Variation 5** (lines 254-255): Construct walker first, then spawn separately:
```
demo = SyntaxDemo();
root spawn demo;
```

This allows walker manipulation before spawning.

All five variations execute, as shown in the output (5 instances of "SyntaxDemo: Demonstrating all spawn syntaxes").

**Operator Syntax Summary**

| Operator | Syntax | Walker Argument | Example |
|----------|--------|-----------------|---------|
| `spawn` | `node spawn Walker()` | Constructed instance | `root spawn Task()` |
| `spawn` | `node spawn Walker` | Walker type or instance | `root spawn Task` |
| `:>` | `node spawn :> Walker` | Walker type | `root spawn :> Task` |
| `|>` | `node spawn |> Walker` | Walker type | `root spawn |> Task` |

**Key distinction**: Plain `spawn` accepts either a constructed walker (`Walker()`) or walker type/instance, while `:>` and `|>` typically take the walker type. Attempting `root spawn :> Walker()` may produce errors depending on context.

**Walker Execution Model**

When a walker is spawned:
1. **Initialization**: Walker instance is created (if not pre-constructed)
2. **Entry ability**: Matching entry ability for the spawn node's type executes
3. **Visit queue initialization**: Empty FIFO queue is created
4. **Visit statements**: Any `visit` statements in the ability add nodes to the queue
5. **Queue processing**: Walker processes queued nodes in FIFO order
6. **Node abilities**: For each visited node:
   - Walker's matching entry abilities execute
   - Any `visit` statements add more nodes to the queue
   - Process continues until queue is empty or walker disengages
7. **Exit ability**: When queue is empty, exit abilities execute
8. **Return**: Walker instance is returned to spawn caller

The FIFO queue processing means the first node added is the first node visited, regardless of spawn operator used.

**Controlling Traversal Patterns**

Since the queue is always FIFO, you control traversal patterns through visit logic:

**Sequential processing** (visit one at a time):
```
can process with Node entry {
    # Process current node
    if some_condition {
        visit [-->];  // Queue all children
    }
}
```

**Selective traversal** (filter which nodes to visit):
```
can process with Node entry {
    visit [->:HighPriority:->];  // Visit high priority first
    # Later visits will happen after high priority exhausted
    visit [->:LowPriority:->];   // Then low priority
}
```

**Conditional branching**:
```
can explore with Node entry {
    if here.go_left {
        visit [->:LeftEdge:->];
    } else {
        visit [->:RightEdge:->];
    }
}
```

**Breadth-first simulation** (visit all at same level):
```
can process with Node entry {
    if self.current_depth == self.target_depth {
        visit [-->];  // Queue all children at this depth
    }
    self.current_depth += 1;
}
```

**Depth-first simulation** (visit children before siblings):
```
can process with Node entry {
    # Visit first child immediately
    first_child = [-->];
    if first_child {
        visit first_child[0];  // Visit first child first
        # Other children queued later
    }
}
```

The key: you build the traversal pattern through your visit logic, not through spawn operators.

**Spawn Context Variations**

Walkers can spawn from different node contexts:

**From root** (line 204): `root spawn Walker()` - Most common, starts at application root

**From specific node** (line 96): `here spawn Walker()` - Spawns from current walker position

**From any node variable**:
```
task1 spawn Analyzer();       // Spawn from task1
some_node spawn Searcher();   // Spawn from arbitrary node
```

The spawn point becomes the initial `here` reference for the walker's entry ability.

**Async Considerations**

While not demonstrated in this example, walkers can be async:
```
async walker AsyncWalker {
    async can process with Node entry {
        await some_async_operation();
        visit [-->];
    }
}

await root spawn AsyncWalker();
```

The `await` keyword works with walker spawning for asynchronous execution.

**Practical Patterns**

**Data collection pattern**:
```
walker Collector {
    has results: list = [];
    can collect with DataNode entry {
        self.results.append(here.value);
        visit [-->];
    }
}
data = root spawn Collector();
process(data.results);
```

**Search pattern**:
```
walker Searcher {
    has target: str;
    has found: Node? = None;
    can search with Node entry {
        if here.id == self.target {
            self.found = here;
            disengage;
        }
        visit [-->];
    }
}
result = root spawn Searcher(target="target_id");
if result.found { /* ... */ }
```

**Multi-walker analysis**:
```
stats = root spawn StatCollector();
issues = root spawn IssueDetector();
summary = root spawn Summarizer();
# Three walkers analyze same graph from different perspectives
```

**Hierarchical processing**:
```
walker ParentTask {
    can process with WorkNode entry {
        if here.needs_detail_scan {
            here spawn DetailScanner();  // Spawn child walker
        }
        visit [-->];
    }
}
```

**Common Mistakes**

1. **Wrong operator syntax**:
   - Wrong: `root spawn :> Walker()` - May error with `:>` operator
   - Right: `root spawn :> Walker` - Pass walker type

2. **Assuming special traversal with :> or |>**:
   - Wrong assumption: `:>` does depth-first, `|>` does breadth-first
   - Reality: Queue is always FIFO; control traversal with visit logic

3. **Forgetting visit statements**:
   - Walker doesn't traverse without `visit [-->]` in abilities
   - No visits = walker executes only on spawn node

4. **Not capturing return value**:
   - `root spawn Collector();` - Loses walker state
   - `result = root spawn Collector();` - Can access collected data

5. **Expecting non-FIFO queue processing**:
   - The visit queue always processes first-in-first-out
   - Structure visit statements to achieve desired traversal order

**Integration with Other OSP Features**

Object spatial calls combine with:
- **Visit statements**: `visit [-->]` determines what nodes get queued
- **Edge references**: `visit [->:Type:->]` filters which edges to follow
- **Disengage**: `disengage` stops walker traversal early (lines 131)
- **Node abilities**: Nodes can respond to walker visits with their own abilities
- **Special references**: `here` (current node), `visitor` (in node abilities), `root` (global anchor)

**The Computation-to-Data Paradigm**

Object spatial calls invert traditional programming:

**Traditional OOP**:
```
for node in graph.get_nodes() {
    process(node);  // Data comes to computation
}
```

**OSP with spatial calls**:
```
walker Processor {
    can process with Node entry {
        // Computation comes to data
        visit [-->];
    }
}
root spawn Processor();
```

This inversion enables:
- **Locality**: Computation executes where data resides
- **Persistence**: Graph structure persists automatically via root connectivity
- **Distribution**: Walkers can traverse distributed graphs transparently
- **Decoupling**: Walker logic is independent of graph structure
- **Reusability**: Same walker works on different graph topologies

Object spatial calls are the fundamental execution primitive of Jac's Object-Spatial Programming model, enabling mobile computation that flows through persistent graph structures with FIFO queue processing and programmatic control over traversal patterns through visit statement logic.
