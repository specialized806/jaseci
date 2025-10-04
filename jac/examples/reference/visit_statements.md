Visit statements are the fundamental mechanism for walker traversal in Jac's Object-Spatial Programming model. They control how walkers move through graph structures by specifying which nodes to visit next, embodying the paradigm shift from "data flows to computation" to "computation flows to data."

**Grammar Rule**

```
visit_stmt: KW_VISIT (COLON expression COLON)? expression (else_stmt | SEMI)
```

The visit statement consists of:
- The `visit` keyword
- An optional typed expression enclosed in colons (`:expression:`)
- A target expression (either an edge expression or direct node reference)
- An optional `else` clause or semicolon terminator

**Basic Syntax Forms**

Lines 22, 37, and 49 demonstrate the three fundamental forms of visit statements:

1. **With else clause**: `visit [-->] else { ... }` - The else block executes when the edge expression matches no edges (lines 22-24)
2. **Without else clause**: `visit [-->];` - Terminates with semicolon, no fallback behavior (line 37)
3. **Direct node visit**: `visit self.target;` - Visits a specific node rather than using an edge expression (line 92)

**Edge Expressions**

Edge expressions (enclosed in square brackets) specify which edges to follow during traversal. The grammar for edge references is:

```
edge_ref_chain: LSQUARE (edge_op_ref ...)+ RSQUARE
edge_op_ref: edge_any | edge_from | edge_to
```

**Directional Edge Operators** (lines 47-57)

| Expression | Operator | Description |
|------------|----------|-------------|
| `[-->]` | `ARROW_R` (-->) | All outgoing edges from current node |
| `[<--]` | `ARROW_L` (<--) | All incoming edges to current node |
| `[<-->]` | `ARROW_BI` (<-->) | All edges in both directions |

Line 49 shows the most common pattern: `visit [-->];` which visits all nodes reachable via outgoing edges.

**Typed Edge Traversal** (lines 59-66)

Typed edge expressions filter traversal to specific edge types using the pattern `[->:EdgeType:->]`:

- Lines 62-64: `visit [->:Friend:->];` - Only traverses Friend-typed edges
- The pattern is `ARROW_R_P1 expression ARROW_R_P2` where the expression is the edge type

Variations for different directions:
- `[->:EdgeType:->]` - Outgoing typed edges
- `[<-:EdgeType:<-]` - Incoming typed edges (line 150)
- `[<-:EdgeType:->]` - Bidirectional typed edges (line 151)

**Filtered Edge Traversal** (lines 68-75)

Edge filters add conditions on edge attributes using the pattern `[->:EdgeType:condition:->]`:

Line 73 demonstrates: `visit [->:Colleague:relationship_strength > 5:->];`

This visits through Colleague edges where the `relationship_strength` attribute is greater than 5. The filter is part of the `typed_filter_compare_list` production in the grammar:

```
typed_filter_compare_list: expression (COLON filter_compare_list)?
filter_compare_item: named_ref cmp_op expression
```

Multiple filter conditions can be combined: `[->:EdgeType:attr1 > 5, attr2 < 10:->]`

**Direct Node Visits** (lines 77-99)

Instead of edge expressions, visit can target specific nodes directly:

- Line 92: `visit self.target;` - Visits the node stored in walker's `target` attribute
- Direct node references bypass edge traversal
- Useful for implementing jumps, returns to known locations, or custom navigation patterns

The `root` special reference is commonly used: `visit root;` returns the walker to the root node (demonstrated in various walkers).

**Else Clause Semantics** (lines 17-30)

Lines 22-24 show the else clause pattern:
```
visit [-->] else {
    print("  No outgoing edges - dead end!");
}
```

The else clause executes when the edge expression matches zero edges. This is useful for:
- Detecting terminal/leaf nodes
- Implementing backtracking behavior
- Handling dead ends in graph traversal
- Providing fallback navigation logic

**Conditional Visiting** (lines 101-124)

Visit statements can be wrapped in conditional logic to control traversal based on walker state:

Lines 108-111 demonstrate depth-limited traversal:
```
if self.depth < self.max_depth {
    self.depth += 1;
    visit [-->];
}
```

This pattern enables:
- Depth-first search with maximum depth
- Breadth-limited exploration
- State-dependent navigation
- Search algorithms with termination conditions

**Sequential Multiple Visits** (lines 126-139)

A single walker ability can contain multiple visit statements that execute sequentially:

Lines 130-133:
```
visit [->:Friend:->];
print("  Stage 2: Family");
visit [->:Family:->];
```

When multiple visit statements execute:
1. Each visit queues nodes to be visited
2. Nodes are visited in order determined by the spawn strategy (depth-first `:>` or breadth-first `|>`)
3. The walker's entry abilities execute for each visited node
4. Subsequent visit statements in the ability continue queuing more nodes

This allows complex multi-phase traversal algorithms.

**Walker Entry Abilities and Visit Context**

Lines 19-29 and throughout show the pattern of defining visit logic in walker abilities:

```
walker BasicVisitor {
    can travel with `root entry {
        visit [-->];
    }
    can travel_person with Person entry {
        print(f"  BasicVisitor reached: {here.name}");
    }
}
```

- The backtick syntax `\`root` specifies the root type as the context
- Separate abilities handle different node types
- The `here` special reference accesses the current node (line 28)
- Visit statements determine which nodes the walker moves to next

**Visit Execution Model**

When a visit statement executes:
1. The edge expression (or node expression) is evaluated in the current spatial context
2. For edge expressions, all matching edges are found
3. Target nodes are queued for visiting
4. The walker continues processing queued nodes
5. Entry abilities trigger when the walker enters each node
6. The traversal continues until the queue is empty or `disengage` is called

**Edge Expression Grammar Details**

The complete syntax for edge expressions includes several advanced features:

```
edge_ref_chain: LSQUARE KW_ASYNC? (KW_NODE| KW_EDGE)? expression? (edge_op_ref ...)+ RSQUARE
```

- `KW_ASYNC`: Enables async edge traversal (advanced feature)
- `KW_NODE` / `KW_EDGE`: Restricts to node-only or edge-only references
- `expression`: Optional filter expression
- Multiple edge operations can be chained

**Integration with Graph Construction**

Lines 159-177 show the graph construction that the walkers traverse:

- Line 166: `root ++> alice;` - Connects root to Alice
- Line 169: `alice +>:Friend:+> bob;` - Creates typed Friend edge
- Line 173: `alice +>:Family:+> diana;` - Creates typed Family edge
- Lines 176-177: `alice +>: Colleague(relationship_strength=8) :+> charlie;` - Creates edge with attributes

The visit statements in the walkers then navigate this graph structure using the patterns demonstrated.

**Comparison with Control Flow**

Visit statements differ from traditional control flow:
- Traditional: `for node in nodes: process(node)` - Data comes to function
- Jac visit: `visit [-->]` - Walker goes to data
- Visit statements are declarative (specify what to visit) rather than imperative (specify how to iterate)
- The runtime handles traversal order, queueing, and execution

**Common Patterns**

1. **Breadth-First Search**: Use with `|>` spawn operator, visit `[-->]` without depth limiting
2. **Depth-First Search**: Use with `:>` spawn operator, visit `[-->]` recursively
3. **Type-Filtered Traversal**: `visit [->:SpecificType:->];` to follow only certain edge types
4. **Attribute-Filtered Traversal**: `visit [->:Type:attr > threshold:->];` for conditional edges
5. **Dead-End Detection**: `visit [-->] else { /* handle leaf node */ }`
6. **Targeted Jump**: `visit specific_node;` to move to known location
7. **Return to Root**: `visit root;` to reset walker position
8. **Depth-Limited**: Conditional visit with counter to limit traversal depth

**Walker Lifecycle and Visit Statements**

The walker lifecycle in relation to visit statements:
1. Walker is spawned on a node: `node spawn Walker()`
2. Appropriate entry ability executes based on node type
3. Visit statement(s) in the ability queue target nodes
4. Walker visits queued nodes, triggering their entry abilities
5. Process repeats until no more visits are queued or `disengage` is called

**Termination and Control**

Visit statements work with walker control mechanisms:
- `disengage` (line 97): Immediately stops the walker
- `if` conditionals (lines 108-111): Control whether visit executes
- `else` clause (lines 22-24): Provides fallback when no edges match
- Implicit termination: Walker stops when visit queue is empty

This makes visit statements the primary tool for implementing graph algorithms, spatial queries, and data-driven computation in Jac's Object-Spatial Programming paradigm.