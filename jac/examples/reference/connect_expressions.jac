# Connect expressions - Graph edge creation and connection operators

# ===== Node and Edge Definitions =====
node Person {
    has name: str;
    has age: int = 0;
}

node City {
    has name: str;
}

edge LivesIn {
    has years: int = 0;
}

edge Friend {
    has since: int = 2020;
}

edge Colleague {
    has department: str;
}

# ===== Test Walker =====
walker GraphBuilder {
    can build with `root entry {
        print("=== 1. Basic Untyped Connect (++>) ===");
        # Simple forward connect - creates default edge type
        alice = Person(name="Alice", age=30);
        bob = Person(name="Bob", age=25);

        # Connect alice to bob with default edge
        alice ++> bob;
        print(f"Connected {alice.name} ++> {bob.name}");

        print("\n=== 2. Backward Connect (<++) ===");
        # Backward connect - creates edge from RIGHT to LEFT
        charlie = Person(name="Charlie", age=28);
        diana = Person(name="Diana", age=32);

        # This creates edge from diana TO charlie (reverse of written order)
        charlie <++ diana;
        print(f"Connected {charlie.name} <++ {diana.name} (edge goes from Diana to Charlie)");

        print("\n=== 3. Bidirectional Connect (<++>) ===");
        # Bidirectional - creates edges in BOTH directions
        eve = Person(name="Eve", age=27);
        frank = Person(name="Frank", age=29);

        eve <++> frank;
        print(f"Connected {eve.name} <++> {frank.name} (edges in both directions)");

        print("\n=== 4. Typed Forward Connect (+>:Type:+>) ===");
        # Forward connect with specific edge type
        grace = Person(name="Grace", age=26);
        nyc = City(name="New York");

        grace +>:LivesIn:+> nyc;
        print(f"Connected {grace.name} +>:LivesIn:+> {nyc.name}");

        print("\n=== 5. Typed Backward Connect (<+:Type:<+) ===");
        # Backward connect with specific edge type
        henry = Person(name="Henry", age=31);
        london = City(name="London");

        # Edge goes from london TO henry
        henry <+:LivesIn:<+ london;
        print(f"Connected {henry.name} <+:LivesIn:<+ {london.name} (edge from London to Henry)");

        print("\n=== 6. Typed Bidirectional Connect (<+:Type:+>) ===");
        # Bidirectional with edge type
        iris = Person(name="Iris", age=24);
        jack = Person(name="Jack", age=35);

        iris <+:Friend:+> jack;
        print(f"Connected {iris.name} <+:Friend:+> {jack.name} (Friend edges both ways)");

        print("\n=== 7. Connect with Edge Attributes ===");
        # Typed connect with edge attribute initialization
        kate = Person(name="Kate", age=29);
        liam = Person(name="Liam", age=30);

        # Forward connect with edge attributes
        kate +>: Friend(since=2015) :+> liam;
        print(f"Connected {kate.name} +>: Friend(since=2015) :+> {liam.name}");

        # Backward connect with attributes
        mike = Person(name="Mike", age=33);
        nina = Person(name="Nina", age=28);

        mike <+: Friend(since=2018) :<+ nina;
        print(f"Connected {mike.name} <+: Friend(since=2018) :<+ {nina.name}");

        # Bidirectional with attributes
        oscar = Person(name="Oscar", age=27);
        paula = Person(name="Paula", age=26);

        oscar <+: Colleague(department="Engineering") :+> paula;
        print(f"Connected {oscar.name} <+: Colleague(department='Engineering') :+> {paula.name}");

        print("\n=== 8. Disconnect Operator (del) ===");
        # Note: Disconnect syntax varies - commenting for compatibility
        # Grammar: disconnect_op: KW_DELETE edge_op_ref
        # Example syntax: node1 del [-->] node2
        # This would delete edges from node1 to node2

        print("Disconnect operator syntax: node del [-->] target");

        print("\n=== 9. Chained Connect Operations ===");
        # Multiple connects in one expression (chain)
        t1 = Person(name="Tom", age=25);
        t2 = Person(name="Uma", age=26);
        t3 = Person(name="Vic", age=27);

        # Create a chain: t1 -> t2 -> t3
        t1 ++> t2 ++> t3;
        print(f"Chained: {t1.name} ++> {t2.name} ++> {t3.name}");

        print("\n=== 10. Connect to Multiple Targets ===");
        # Connect one node to multiple targets
        parent = Person(name="Walter", age=50);
        child1 = Person(name="Xavier", age=20);
        child2 = Person(name="Yara", age=18);
        child3 = Person(name="Zoe", age=15);

        # Individual connections
        parent ++> child1;
        parent ++> child2;
        parent ++> child3;
        print(f"Connected {parent.name} to three children");

        print("\n=== 11. Connect with Inline Node Creation ===");
        # Create node inline within connect expression
        start = Person(name="Start", age=40);

        # Connect to newly created node in one expression
        start ++> Person(name="InlineNode", age=35);
        print("Connected to node created inline");

        print("\n=== 12. Connect in Expression ===");
        # Connect can be used in expressions
        base = Person(name="Base", age=45);
        target = Person(name="Target", age=42);
        base ++> target;
        print(f"Connected {base.name} to {target.name} in expression");

        print("\n✓ All connect expression variations demonstrated!");
        disengage;
    }
}

# ===== Edge Traversal Demonstration =====
walker EdgeTraverser {
    can traverse with `root entry {
        print("\n=== Edge Traversal with Visit ===");

        # Build a small graph for traversal
        a = Person(name="A", age=25);
        b = Person(name="B", age=30);
        c = Person(name="C", age=35);

        root ++> a;
        a +>: Friend(since=2010) :+> b;
        a +>: Colleague(department="Sales") :+> c;
        b +>: Friend(since=2015) :+> c;

        print("Built graph: root->A, A-Friend->B, A-Colleague->C, B-Friend->C");

        # Visit all outgoing edges
        print("\nVisiting all outgoing edges from root:");
        visit [-->];
    }

    can traverse with Person entry {
        print(f"  Visited: {here.name}, age={here.age}");
    }
}

# ===== Execution =====
with entry {
    root spawn GraphBuilder();
    root spawn EdgeTraverser();
}
