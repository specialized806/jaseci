Edge reference expressions are the fundamental mechanism for querying and traversing graph structures in Jac's Object-Spatial Programming model. Unlike connect operators that CREATE edges, edge references QUERY existing edges to retrieve connected nodes or edge objects.

**Grammar Rule**

```
edge_ref_chain: LSQUARE KW_ASYNC? (KW_NODE | KW_EDGE)? expression? (edge_op_ref (filter_compr | expression)?)+ RSQUARE

edge_op_ref: edge_any | edge_from | edge_to
edge_to: ARROW_R | ARROW_R_P1 typed_filter_compare_list ARROW_R_P2
edge_from: ARROW_L | ARROW_L_P1 typed_filter_compare_list ARROW_L_P2
edge_any: ARROW_BI | ARROW_L_P1 typed_filter_compare_list ARROW_R_P2

typed_filter_compare_list: expression (COLON filter_compare_list)?
```

Edge references are enclosed in square brackets `[...]` and return collections of nodes (or edges when using the `edge` keyword).

**Basic Edge References**

Lines 33-44 demonstrate the three fundamental directional forms:

```
outgoing = [-->];        // Line 33
incoming = [<--];        // Line 37
bidirectional = [<-->];  // Line 41
```

**Outgoing edges** `[-->]` (line 33):
- Returns all nodes reachable via outgoing edges from current context
- Corresponds to `ARROW_R` in grammar
- Most common form for graph traversal

**Incoming edges** `[<--]` (line 37):
- Returns all nodes that have edges pointing TO the current node
- Corresponds to `ARROW_L` in grammar
- Useful for finding "who references me"

**Bidirectional edges** `[<-->]` (line 41):
- Returns nodes connected in EITHER direction
- Corresponds to `ARROW_BI` in grammar
- Gets nodes from both outgoing and incoming edges

The output shows Alice has 2 outgoing (Bob, Charlie), 1 incoming (root), and 3 bidirectional (all three).

**Typed Edge References**

Lines 64-74 demonstrate type-specific traversal:

```
friends = [->:Friend:->];       // Line 64
colleagues = [->:Colleague:->]; // Line 70
```

**Typed outgoing** `[->:EdgeType:->]` (line 64):
- Only traverses edges of the specified type
- Pattern: `ARROW_R_P1 expression ARROW_R_P2`
- The expression between colons is the edge type name
- Returns nodes connected via that specific edge type only

Line 64 finds only Friend connections (Bob), while line 70 finds only Colleague connections (Charlie). Without type specification, both would be returned.

**Other typed directional forms**:
- `[<-:Type:<-]` - Incoming typed edges
- `[<-:Type:->]` - Bidirectional typed edges

The asymmetric syntax `[<-:Type:->]` means "edges of this type in either direction."

**Filtered Edge References**

Lines 79-87 show filtering on edge attributes:

```
old_friends = [->:Friend:since < 2018:->];                    // Line 79
experienced = [->:Colleague:years > 2:->];                    // Line 82
specific = [->:Colleague:years >= 1, years <= 5:->];          // Line 86
```

**Filter syntax**: `[->:EdgeType:filter_conditions:->]`

Line 79 filters Friend edges where the `since` attribute is less than 2018. The filter is evaluated against the EDGE's attributes, not the target node's attributes.

Line 86 shows multiple filter conditions (line 86): `years >= 1, years <= 5`. These are combined with AND logic - both conditions must be true.

**Important distinction**:
- Edge filters: `[->:Type:edge_attr > val:->]` - Filter on edge attributes
- Node filters: `[->:Type:->](?node_attr > val)` - Filter on node attributes (uses comprehensions)

Edge references can only filter on edge attributes directly. To filter on target node attributes, retrieve nodes first, then use filter comprehensions.

**Edge and Node Keywords**

Lines 92-97 demonstrate explicit object type retrieval:

```
all_edges = [edge -->];  // Line 92
all_nodes = [node -->];  // Line 96
```

**Edge keyword** `[edge -->]` (line 92):
- Returns EDGE OBJECTS, not target nodes
- Allows accessing edge attributes directly
- Use when you need to examine or modify edge properties
- Corresponds to `KW_EDGE` in grammar

**Node keyword** `[node -->]` (line 96):
- Explicitly returns node objects (default behavior)
- Usually optional since nodes are default
- Corresponds to `KW_NODE` in grammar
- Useful for clarity or when combined with other keywords

**Chained Edge References**

Lines 114-120 demonstrate multi-hop traversal:

```
two_hop = [here ->:Friend:-> ->:Friend:->];           // Line 114
mixed = [here ->:Friend:-> ->:Colleague:->];          // Line 119
```

**Chaining syntax**: `[start ->:Type1:-> ->:Type2:->]`

Line 114 performs a two-hop traversal:
1. Start at `here` (Alice)
2. Follow Friend edges to reach Bob
3. From Bob, follow Friend edges to reach David
4. Returns David (2 hops away via Friend edges)

Line 119 shows mixed-type chaining:
1. Start at Alice
2. Follow Friend edges to Bob
3. From Bob, follow Colleague edges
4. Returns nodes connected via that path

**Key insight**: Multiple edge operations are chained WITHIN the brackets, not by concatenating separate bracket expressions. The grammar's `(edge_op_ref ...)+` allows multiple edge operations in sequence.

You can chain as many hops as needed: `[node ->:T1:-> ->:T2:-> ->:T3:-> ->:T4:->]`

**Edge References in Different Contexts**

Lines 107-124 show edge references used in various expressions:

**Assignment** (line 108):
```
targets = [-->];
```
Store the result in a variable for later use.

**Conditional** (line 112):
```
if [-->] {
    print("Outgoing edges exist!");
}
```
Check if any edges match the expression. Non-empty collections are truthy.

**For loops** (line 118):
```
for person in [-->] {
    print(f"  Iterating: {person.name}");
}
```
Iterate over all nodes returned by the edge reference. This is very common for processing graph neighbors.

**Visit statements** (line 123):
```
visit [->:Friend:->];
```
The most common use case - walker traversal. Edge references in visit statements direct the walker to specific nodes. This was covered extensively in visit_statements.jac.

**Edge Reference Evaluation Context**

Edge references are evaluated relative to a spatial context:

**Implicit context** (most common):
- Inside walker abilities: relative to `here` (current node)
- Line 47: `outgoing = [-->];` evaluates from Alice's position

**Explicit context**:
- Specify starting node: `[alice ->:Friend:->]`
- Lines 114, 119 use `[here ->:Type:->]` explicitly
- Can use any node variable: `[root -->]`, `[some_node -->]`

When no starting node is specified in walker abilities, `here` is implicit.

**Return Values**

Edge references return lists/collections:

- `[-->]` returns a list of nodes
- `[edge -->]` returns a list of edge objects
- Empty list `[]` if no matching edges found
- Can be used anywhere collections are expected

The length can be checked: `len([-->])` or boolean tested: `if [-->]`.

**Comparison with Connect Operators**

Edge references vs connect operators serve different purposes:

| Feature | Edge Reference | Connect Operator |
|---------|---------------|------------------|
| Purpose | Query/traverse | Create |
| Syntax | `[-->]` | `++>` |
| Returns | Nodes/edges | Target node |
| Mutates graph | No | Yes |
| Usage context | Read queries | Graph construction |

Example workflow:
```
alice +>:Friend:+> bob;      // Connect: create edge
friends = [->:Friend:->];    // Reference: query edge
```

Connect creates the relationship, reference queries it.

**Integration with Comprehensions**

Edge references combine powerfully with filter/assign comprehensions (from special_comprehensions.jac):

```
// Get nodes via edges, filter by node attributes
high_earners = [-->](?salary > 75000);

// Get nodes, modify them
[-->](?active == True)(=processed=True);

// Chain: traverse, filter, assign
[->:Employee:->](?department == "Sales")(=bonus=1000);
```

Edge references return collections that comprehensions can process. This is the core pattern for spatial queries.

**Grammar Details**

The full grammar shows additional features:

```
edge_ref_chain: LSQUARE KW_ASYNC? (KW_NODE | KW_EDGE)? expression? (edge_op_ref ...)+ RSQUARE
```

**KW_ASYNC**: Enables async edge traversal (advanced)
- Syntax: `[async edge -->]` or `[async node -->]`
- For concurrent graph operations
- Not demonstrated in this example

**Optional expression**: Starting node context
- `expression` can be a node variable
- `[alice -->]` starts from alice
- `[root -->]` starts from root
- Omit for implicit `here` context

**Multiple edge_op_ref**: Enables chaining (lines 114, 119)

**Edge Reference Patterns**

Common patterns from the example:

**Neighbor query**:
```
neighbors = [-->];  // All adjacent nodes
```

**Typed relationship query**:
```
friends = [->:Friend:->];  // Only via Friend edges
```

**Filtered relationship query**:
```
close_friends = [->:Friend:since < 2020:->];  // Long-time friends
```

**Multi-hop query**:
```
friends_of_friends = [here ->:Friend:-> ->:Friend:->];
```

**Existence check**:
```
if [->:Manager:->] {  // Has manager?
    // ...
}
```

**Edge inspection**:
```
for edge in [edge ->:Collaborates:->] {
    print(edge.project);  // Access edge attributes
}
```

**Bidirectional search**:
```
all_connected = [<-->];  // Anyone connected to me
```

**Practical Applications**

Edge references enable:

1. **Graph queries**: "Find all nodes of type X connected via relationship Y"
2. **Path exploration**: "What's 3 hops away via Friend edges?"
3. **Relationship inspection**: "What edges exist from this node?"
4. **Filtered traversal**: "Only follow edges where attribute > threshold"
5. **Reverse lookup**: "Who points to me?" (incoming edges)
6. **Pattern matching**: "Find nodes matching this graph pattern"

**Performance Considerations**

- Edge references are efficient - runtime indexes edges by type and direction
- Filtered edge references evaluate filters early (edge-level filtering)
- Chained references may traverse many nodes - use filters to narrow early
- `[edge -->]` returns edge objects (lighter than full node retrieval in some cases)

**Common Mistakes**

1. **Filtering on wrong attributes**:
   - Wrong: `[->:Friend:->](?since < 2020)` - comprehension on edge ref
   - Right: `[->:Friend:since < 2020:->]` - filter in edge ref

2. **Incorrect chaining syntax**:
   - Wrong: `[-->][-->]` - can't concatenate brackets
   - Right: `[here --> -->]` or `[here ->:T1:-> ->:T2:->]` - chain within brackets

3. **Context confusion**:
   - Edge reference `[-->]` in walker evaluates from `here`, not from spawn point
   - Use explicit node: `[root -->]` if you need specific starting point

**Summary of Forms**

All edge reference variations:

**Basic directional**:
- `[-->]` - Outgoing
- `[<--]` - Incoming
- `[<-->]` - Bidirectional

**Typed directional**:
- `[->:Type:->]` - Outgoing typed
- `[<-:Type:<-]` - Incoming typed
- `[<-:Type:->]` - Bidirectional typed

**Filtered**:
- `[->:Type:attr > val:->]` - Single condition
- `[->:Type:a > x, b < y:->]` - Multiple conditions

**Special**:
- `[edge -->]` - Get edge objects
- `[node -->]` - Get nodes explicitly
- `[async edge -->]` - Async traversal (advanced)

**Chained**:
- `[node ->:T1:-> ->:T2:->]` - Two-hop
- `[node ->:T1:-> ->:T2:-> ->:T3:->]` - Multi-hop

**With explicit start**:
- `[node -->]` - From specific node
- `[root ->:Type:->]` - From root with type

Edge references are the query language for Jac's graph model, providing declarative, concise syntax for navigating spatial structures. Combined with visit statements and comprehensions, they form the foundation of Object-Spatial Programming's data-to-computation paradigm.