# Names and References - Special reference keywords in Jac

# ===== Part 1: self - Instance Reference =====
obj Counter {
    has count: int = 0;

    def increment {
        self.count += 1;  # self refers to current instance
        print(f"Counter at {self.count}");
    }

    def reset {
        self.count = 0;
        self.increment();  # Call other method on self
    }
}

# ===== Part 2: super - Parent Class Reference =====
obj Animal {
    has species: str = "Unknown";

    def init(species: str) {
        self.species = species;
        print(f"Animal init: {species}");
    }

    def speak {
        print(f"{self.species} makes a sound");
    }
}

obj Dog(Animal) {
    has breed: str = "Mixed";

    def init(breed: str) {
        super.init(species="Dog");  # Call parent init
        self.breed = breed;
        print(f"Dog init: {breed}");
    }

    def speak {
        super.speak();  # Call parent method
        print("Dog says: Woof!");
    }
}

# ===== Part 3: here - Current Node Reference =====
node Task {
    has title: str = "Unnamed";
    has priority: int = 0;
    has completed: bool = False;
}

walker TaskProcessor {
    has processed_count: int = 0;

    can start with `root entry {
        print(f"TaskProcessor: Starting at {here}");  # here = root node
        visit [-->];
    }

    can process with Task entry {
        # here refers to current Task node being visited
        print(f"  Processing: {here.title} (priority {here.priority})");
        here.completed = True;  # Modify current node
        self.processed_count += 1;
        visit [-->];
    }
}

# ===== Part 4: visitor - Current Walker Reference =====
node InteractiveTask {
    has title: str = "Interactive";
    has last_visitor: str = "None";

    can track with TaskProcessor entry {
        # visitor refers to the walker currently visiting
        self.last_visitor = f"TaskProcessor #{visitor.processed_count}";
        print(f"    {self.title} visited by walker (processed {visitor.processed_count} so far)");
    }
}

# ===== Part 5: root - Root Node Reference =====
walker RootExplorer {
    has start_node: object = None;

    can init_walker with `root entry {
        # root is available in spatial contexts
        self.start_node = root;  # Store reference to root
        print(f"RootExplorer: Started at root {root}");
        visit [-->];
    }

    can process_task with Task entry {
        print(f"  At {here.title}, root is {root}");
        # Can always access root from anywhere
        disengage;
    }
}

# ===== Part 6: init and postinit Special Methods =====
obj ConfiguredObject {
    has name: str = "default";
    has value: int = 0;
    has computed: int = 0;

    def init(name: str, value: int) {
        # init called when object is constructed
        self.name = name;
        self.value = value;
        print(f"init: {name} = {value}");
        # Manually call postinit
        self.postinit();
    }

    def postinit {
        # postinit can be called explicitly
        self.computed = self.value * 2;
        print(f"postinit: computed = {self.computed}");
    }
}

# ===== Part 7: Special References in Node Abilities =====
node DataNode {
    has data: str = "data";
    has access_count: int = 0;

    can log_access with RootExplorer entry {
        # In node abilities:
        # - self = this node
        # - visitor = the walker visiting
        # - here = also this node (self and here are same in node abilities)
        # - root = root node
        self.access_count += 1;
        print(f"    DataNode '{self.data}' accessed by {visitor.__class__.__name__}");
        print(f"      self == here: {self is here}");
    }
}

# ===== Part 8: Special References in Walker Abilities =====
walker ReferenceDemo {
    has walker_id: str = "demo";

    can demonstrate with `root entry {
        # In walker abilities:
        # - self = this walker
        # - here = current node (root in this case)
        # - root = root node
        # - visitor not available (walker is the visitor)
        print(f"Walker {self.walker_id}:");
        print(f"  self = {self}");
        print(f"  here = {here}");
        print(f"  root = {root}");
        print(f"  here is root: {here is root}");
    }
}

# ===== Part 9: root Persistence Model =====
node PersistentData {
    has value: str = "data";
    has connected_to_root: bool = False;
}

walker PersistenceDemo {
    can explain with `root entry {
        print("\n=== root Persistence Model ===");
        print("The root node is the persistence anchor:");
        print("  - Anything connected to root persists");
        print("  - Each user has their own root");
        print("  - root is globally accessible via 'root' keyword");

        # Create some data
        data1 = PersistentData(value="persisted");
        data2 = PersistentData(value="temporary");

        # Connect to root = persistent
        root ++> data1;
        data1.connected_to_root = True;

        # Not connected to root = garbage collected eventually
        # data2 remains unconnected

        print(f"  data1 connected to root: {data1.connected_to_root}");
        print(f"  data2 connected to root: {data2.connected_to_root}");
    }
}

# ===== Part 10: Combining References =====
node WorkItem {
    has name: str = "item";
    has processed_by: list = [];

    can track_processing with TaskProcessor entry {
        # Use multiple references together
        self.processed_by.append(visitor.walker_id if hasattr(visitor, 'walker_id') else "TaskProcessor");
        print(f"    {self.name} processed by {visitor.__class__.__name__}");

        # Access root from node ability
        print(f"      (root is always accessible: {root})");
    }
}

# ===== Execution and Tests =====
with entry {
    print("=== 1. self - Instance Reference ===");
    counter = Counter();
    counter.increment();
    counter.increment();
    counter.reset();

    print("\n=== 2. super - Parent Reference ===");
    dog = Dog(breed="Labrador");
    dog.speak();

    print("\n=== 3. here - Current Node ===");
    task1 = Task(title="Write Code", priority=10);
    task2 = Task(title="Write Tests", priority=8);
    root ++> task1;
    task1 ++> task2;

    proc = TaskProcessor();
    root spawn proc;
    print(f"Completed: task1={task1.completed}, task2={task2.completed}");

    print("\n=== 4. visitor - Current Walker ===");
    interactive1 = InteractiveTask(title="Interactive 1");
    interactive2 = InteractiveTask(title="Interactive 2");
    root ++> interactive1;
    interactive1 ++> interactive2;

    root spawn TaskProcessor();
    print(f"Last visitor to interactive1: {interactive1.last_visitor}");

    print("\n=== 5. root - Root Node Reference ===");
    explorer = RootExplorer();
    root spawn explorer;
    print(f"Walker stored root: {explorer.start_node is root}");

    print("\n=== 6. init and postinit ===");
    config = ConfiguredObject(name="test", value=5);
    print(f"Configured: name={config.name}, value={config.value}, computed={config.computed}");

    print("\n=== 7. Special References in Node Abilities ===");
    data_node = DataNode(data="test_data");
    root ++> data_node;
    root spawn RootExplorer();

    print("\n=== 8. Special References in Walker Abilities ===");
    root spawn ReferenceDemo(walker_id="ref_demo");

    print("\n=== 9. root Persistence Model ===");
    root spawn PersistenceDemo();

    print("\n=== 10. Combining References ===");
    work1 = WorkItem(name="Work Item 1");
    work2 = WorkItem(name="Work Item 2");
    root ++> work1;
    work1 ++> work2;

    root spawn TaskProcessor();
    print(f"work1 processed by: {work1.processed_by}");

    print("\n✓ Names and references demonstrated!");
}
