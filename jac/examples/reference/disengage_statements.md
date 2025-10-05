The `disengage` statement is a walker-specific control flow mechanism that immediately terminates walker execution and returns control to the spawn point. It is one of several control flow statements in Jac, each serving distinct purposes in different contexts.

**Grammar Rule**

```
spatial_stmt: visit_stmt | disenage_stmt
disenage_stmt: KW_DISENGAGE SEMI

ctrl_stmt: KW_SKIP | KW_BREAK | KW_CONTINUE
```

Note: `disengage` is categorized as a spatial statement (walker-specific), while `skip`, `break`, and `continue` are general control statements. The grammar shows "disenage_stmt" (typo in grammar) but the keyword is correctly `disengage`.

**Basic Disengage Semantics**

Lines 18-20 demonstrate the fundamental usage:
```
if here.name == "Bob" {
    print(f"  Found Bob - disengaging!");
    disengage;
}
```

When `disengage` executes:
1. Walker execution stops immediately
2. Control returns to the code that spawned the walker
3. No further nodes are visited
4. Any code after `disengage` in the current ability does not execute

Line 22 (`visit [-->];`) will not execute if disengage was triggered on line 20.

**Disengage in Walker Entry Abilities**

Lines 11-13 show disengage in a walker's root entry ability:
```
can start with `root entry {
    print("BasicDisengage: Starting at root");
    visit [-->];
}
```

The walker begins at root, prints a message, and queues visits to outgoing nodes. When those nodes are visited (lines 16-23), the walker's Person entry ability executes. If that ability calls `disengage` (line 20), the walker stops immediately.

**Walker Execution Model**

When a walker is spawned (line 150: `root spawn BasicDisengage();`):
1. Walker is created at the spawn point (root)
2. Entry ability matching the spawn node type executes (`\`root entry`)
3. Walker processes queued visits (from `visit` statements)
4. For each visited node, matching entry abilities execute
5. Process continues until: no more visits queued, `disengage` called, or exception occurs

The output (lines 152-155) shows: walker starts at root, visits Alice, then Bob, disengages at Bob, never visits Diana or Charlie.

**Skip Statement**

Lines 34-36 demonstrate `skip`:
```
if here.name == "Charlie" {
    print(f"  Skipping {here.name}");
    skip;  # Skip stops current node, continues traversal
}
```

**Skip semantics**:
- Stops processing the current node immediately
- Walker continues to next queued node
- Code after `skip` in current ability does not execute
- Walker does NOT terminate (contrast with `disengage`)

Lines 38-39 will NOT execute for Charlie (because of `skip` on line 36), but WILL execute for other nodes.

Output (lines 158-162) shows: Alice processed, Bob processed, Charlie skipped (not processed), Diana processed. The walker continued after skipping Charlie.

**Disengage vs Skip Comparison**

Lines 56-58 show disengage in action:
```
if self.mode == "disengage" and here.name == "Bob" {
    print("    Using disengage - walker stops completely");
    disengage;
}
```

Lines 61-63 show skip:
```
if self.mode == "skip" and here.name == "Bob" {
    print("    Using skip - skips this node, continues");
    skip;
}
```

Comparing outputs:

**Disengage mode** (lines 179-181):
- Visits Alice, processes it
- Visits Bob, disengages
- Diana and Charlie never visited

**Skip mode** (lines 184-188):
- Visits Alice, processes it
- Visits Bob, skips processing
- Continues to Charlie, processes it
- Diana not visited (because Bob didn't queue more visits before skipping)

Key difference: **disengage stops walker entirely**, **skip stops current node only**.

**Break Statement**

Lines 78-83 demonstrate `break` in loops:
```
for i in range(5) {
    if i == 3 {
        print(f"    Breaking at {i}");
        break;
    }
    print(f"    i={i}");
}
```

**Break semantics**:
- Exits the innermost enclosing loop
- Execution continues after the loop
- Only works in loop contexts (for, while)
- Does NOT affect walker execution

Output shows: i=0, 1, 2, then breaks at 3. The loop exits and execution continues to the next statement (line 87).

**Continue Statement**

Lines 88-92 demonstrate `continue`:
```
for i in range(5) {
    if i == 2 {
        continue;
    }
    print(f"    i={i}");
}
```

**Continue semantics**:
- Skips remaining code in current loop iteration
- Jumps to next iteration of the loop
- Does NOT exit the loop
- Only works in loop contexts

Output shows: i=0, 1, (2 skipped), 3, 4. When i=2, `continue` skips the print statement but the loop continues.

**Control Statement Comparison Table**

| Statement | Context | Scope | Effect |
|-----------|---------|-------|--------|
| `disengage` | Walker abilities | Walker | Stops entire walker immediately |
| `skip` | Walker abilities | Current node | Skips current node, walker continues |
| `break` | Loops (for/while) | Innermost loop | Exits loop, continues after loop |
| `continue` | Loops (for/while) | Current iteration | Skips to next iteration |
| `return` | Functions/methods | Function | Exits function, returns value |

**Depth-Limited Traversal with Disengage**

Lines 115-122 show a common pattern - using walker state to control termination:
```
can traverse with Person entry {
    self.depth += 1;
    print(f"  Depth {self.depth}: {here.name}");

    if self.depth >= self.max_depth {
        print(f"  Max depth reached - disengaging");
        disengage;
    }

    visit [-->];
}
```

The walker:
1. Increments depth counter on each node visit
2. Checks if maximum depth reached
3. If so, disengages (stops walker)
4. Otherwise, continues visiting (line 124)

Output (lines 197-199): Depth 1 (Alice), Depth 2 (Bob), max reached, disengage. Diana is never visited despite being connected to Bob.

This pattern enables:
- Bounded graph exploration
- Search with depth limits
- Preventing infinite traversal in cyclic graphs
- Resource-limited algorithms

**Disengage Use Cases**

**Early termination on goal**:
```
if found_target {
    disengage;  // Stop searching
}
```

**Error handling**:
```
if invalid_state {
    disengage;  // Abort walker
}
```

**Resource limits**:
```
if self.nodes_visited > limit {
    disengage;  // Stop to preserve resources
}
```

**Conditional exploration**:
```
if not should_continue(here) {
    disengage;  // End traversal
}
```

**Skip Use Cases**

**Filtering during traversal**:
```
if not matches_criteria(here) {
    skip;  // Ignore this node, check others
}
```

**Avoiding duplicate processing**:
```
if here.already_processed {
    skip;  // Don't reprocess
}
```

**Type-based selective processing**:
```
if not isinstance(here, TargetType) {
    skip;  // Only process certain node types
}
```

**Conditional node operations**:
```
if here.locked {
    skip;  // Can't process locked nodes
}
```

**Interaction with Visit Statements**

Lines 12-13 and 22:
```
can start with `root entry {
    visit [-->];  // Queues visits
}

can check with Person entry {
    // ...
    visit [-->];  // Queues more visits
}
```

The `visit` statements queue nodes to visit. The `disengage` statement clears the queue and stops processing:

- **Before disengage**: Visit statements add nodes to queue
- **After disengage**: Queue is cleared, no more visits
- **Skip**: Doesn't affect queue, next queued node is visited

**Loop Control Within Walker Abilities**

Lines 73-96 show that standard loop control (`break`, `continue`) works normally inside walker abilities:

```
can demonstrate with `root entry {
    for i in range(5) {
        if i == 3 { break; }
        // ...
    }
    visit [-->];  // Executes after loop
}
```

Important: `break` and `continue` only affect loops, NOT walker traversal. Line 96 shows `visit [-->]` executes after the loops complete. If you want to stop the walker, use `disengage` (line 101).

**Multiple Disengage Paths**

A single walker can have multiple conditional disengage points:

```
can explore with Person entry {
    if condition1 {
        disengage;  // Path 1
    }
    if condition2 {
        disengage;  // Path 2
    }
    visit [-->];  // Only if neither condition
}
```

The walker stops at the first matching condition. This enables complex decision logic for when to terminate traversal.

**Disengage and Walker Return Values**

Line 150: `root spawn BasicDisengage();`

The spawn expression returns the walker instance. When `disengage` executes, the walker's final state (all `has` attributes) is accessible:

```
walker DataCollector {
    has results: list = [];
    // ... collect data, then disengage
}

collector = DataCollector() spawn root;
print(collector.results);  // Access collected data
```

The walker state is preserved when it disengages, allowing data to be retrieved.

**Execution Flow Examples**

**Example 1: Disengage stops everything**
```
Graph: A -> B -> C -> D
Walker visits A, then B, disengages at B
Result: A and B processed, C and D never visited
```

**Example 2: Skip continues traversal**
```
Graph: A -> B -> C -> D
Walker visits A, then B (skips), then C, then D
Result: A processed, B skipped, C and D processed
```

**Example 3: Break exits loop only**
```
Walker at A:
  for item in [1,2,3,4,5]:
    if item == 3: break
  visit [-->]  // This executes!
Result: Loop ends early, walker continues to B
```

**Nested Walker Abilities**

If a walker has multiple abilities that could execute on the same node, `disengage` in any of them stops the entire walker:

```
walker Multi {
    can first with Person entry {
        // ... could disengage here
    }
    can second with Person entry {
        // ... or here
    }
}
```

Abilities execute in definition order. If `first` disengages, `second` never executes.

**Best Practices**

1. **Use `disengage` for**: Search termination, error conditions, resource limits, goal achievement
2. **Use `skip` for**: Filtering nodes, avoiding duplicates, selective processing
3. **Use `break` for**: Exiting loops within walker logic
4. **Use `continue` for**: Skipping loop iterations within walker logic
5. **Clear termination logic**: Make disengage conditions explicit and well-documented
6. **State preservation**: Use walker attributes to track why disengage was called

**Grammar Coverage Summary**

This example demonstrates:
- ✅ `disengage` statement (spatial_stmt)
- ✅ `skip` statement (ctrl_stmt)
- ✅ `break` statement (ctrl_stmt)
- ✅ `continue` statement (ctrl_stmt)
- ✅ Disengage in walker root entry abilities
- ✅ Disengage in walker node entry abilities
- ✅ Skip in walker node entry abilities
- ✅ Conditional disengage based on walker state
- ✅ Comparison of all control flow mechanisms
- ✅ Loop control within walker abilities

**Common Patterns**

**Search pattern**:
```
can search with Node entry {
    if is_target(here) {
        self.found = here;
        disengage;
    }
    visit [-->];
}
```

**Filter pattern**:
```
can filter with Node entry {
    if not should_process(here) {
        skip;
    }
    process(here);
    visit [-->];
}
```

**Depth-limit pattern**:
```
can traverse with Node entry {
    if self.depth >= MAX {
        disengage;
    }
    self.depth += 1;
    visit [-->];
}
```

**Cycle detection pattern**:
```
can avoid_cycles with Node entry {
    if here in self.visited {
        skip;
    }
    self.visited.add(here);
    visit [-->];
}
```

The `disengage` statement is essential for controlled graph traversal in Jac's Object-Spatial Programming model, providing fine-grained control over when and how walkers terminate their execution.