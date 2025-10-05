# Archetypes - Core Jac archetype declarations (class, obj, node, edge, walker)

# ===== Part 1: Basic Class Archetype =====
class Animal {
    has species: str = "Unknown";
    has age: int = 0;

    def make_sound {
        print(f"{self.species} makes a sound");
    }
}

# ===== Part 2: Object Archetype (obj) =====
obj Domesticated {
    has owner: str = "None";
    has trained: bool = False;

    def train {
        self.trained = True;
        print(f"Training {self.owner}'s pet");
    }
}

# ===== Part 3: Multiple Inheritance =====
# Nodes can inherit from multiple base types
obj Mammal {
    has warm_blooded: bool = True;
}

node Pet(Animal, Domesticated, Mammal) {
    has name: str = "Unnamed";
    has favorite_toy: str = "ball";

    def play {
        print(f"{self.name} plays with {self.favorite_toy}");
    }
}

# ===== Part 4: Edge Archetypes =====
# Basic edge
edge Connection {
    has established: str = "2024";
}

# Edge with attributes and access modifier
edge :pub Relationship {
    has strength: int = 5;
    has since: int = 2020;

    def strengthen {
        self.strength += 1;
        print(f"Relationship strengthened to {self.strength}");
    }
}

# Edge with abilities (responds to walker visits)
edge Ownership {
    has duration_years: int = 0;

    can track with OwnershipWalker entry {
        print(f"  Edge: Ownership duration = {self.duration_years} years");
        self.duration_years += 1;
    }
}

# ===== Part 5: Walker Archetypes =====
# Basic walker
walker Person(Animal) {
    has name: str = "Person";
    has visited_count: int = 0;

    can greet with `root entry {
        print(f"{self.name}: Starting walk from root");
        visit [-->];
    }

    can visit_pet with Pet entry {
        self.visited_count += 1;
        print(f"{self.name} visits {here.name}");
        visit [-->];
    }
}

# Walker with inheritance chain
walker Caretaker(Person) {
    has care_quality: int = 10;

    can care_for with Pet entry {
        print(f"{self.name} cares for {here.name} (quality: {self.care_quality})");
        visit [-->];
    }
}

walker Veterinarian(Caretaker) {
    has specialty: str = "general";

    can examine with Pet entry {
        print(f"Dr. {self.name} ({self.specialty}) examines {here.name}");
        visit [-->];
    }
}

# ===== Part 6: Async Walker =====
async walker AsyncInspector {
    has inspected: list = [];

    async can inspect with `root entry {
        print("AsyncInspector: starting");
        visit [-->];
    }

    async can check with Pet entry {
        self.inspected.append(here.name);
        print(f"  Async checking: {here.name}");
        visit [-->];
    }
}

# ===== Part 7: Access Modifiers =====
obj :priv PrivateConfig {
    has secret_key: str = "hidden";
}

obj :pub PublicAPI {
    has version: str = "1.0";
    has endpoint: str = "/api";
}

obj :protect ProtectedResource {
    has resource_id: int = 0;
}

# ===== Part 8: Forward Declarations =====
# Declare interface/structure without implementation
node AnimalNode;
walker SpecializedWalker;
edge SpecialEdge;

# ===== Part 9: Implementation Blocks =====
# Implement forward-declared archetypes
impl AnimalNode {
    has animal_type: str = "wild";
    has habitat: str = "forest";

    def describe {
        print(f"AnimalNode: {self.animal_type} in {self.habitat}");
    }
}

impl SpecializedWalker {
    has specialization: str = "research";
    has processed_count: int = 0;

    can process with AnimalNode entry {
        self.processed_count += 1;
        print(f"SpecializedWalker ({self.specialization}): Processed {self.processed_count} nodes");
        disengage;
    }
}

impl SpecialEdge {
    has edge_weight: float = 1.0;

    def get_weight -> float {
        return self.edge_weight;
    }
}

# ===== Part 10: Decorators on Archetypes =====
def print_bases(cls: type) -> type {
    print(f"Archetype {cls.__name__} bases: {[c.__name__ for c in cls.__bases__]}");
    return cls;
}

def track_creation(cls: type) -> type {
    print(f"Created archetype: {cls.__name__}");
    return cls;
}

@print_bases
@track_creation
node DecoratedNode(Pet) {
    has special_attr: str = "decorated";
}

# ===== Part 11: Walker for Testing Edge Abilities =====
walker OwnershipWalker {
    can start with `root entry {
        print("OwnershipWalker: tracking ownership edges");
        visit [-->];
    }

    can visit_node with Pet entry {
        print(f"  At pet: {here.name}");
        visit [edge -->];  # Visit edges explicitly
    }
}

# ===== Part 12: Node with Walker-Specific Abilities =====
node InteractivePet {
    has name: str = "InteractivePet";
    has happiness: int = 50;

    # Different responses to different walker types
    can greet_person with Person entry {
        print(f"  {self.name} wags tail at {visitor.name}");
        self.happiness += 5;
    }

    can greet_vet with Veterinarian entry {
        print(f"  {self.name} is nervous around Dr. {visitor.name}");
        self.happiness -= 3;
    }
}

# ===== Execution and Tests =====
with entry {
    print("=== 1. Basic Archetypes ===");
    animal = Animal();
    animal.species = "Dog";
    animal.age = 5;
    animal.make_sound();

    obj_dom = Domesticated(owner="Alice", trained=True);
    print(f"Owner: {obj_dom.owner}, Trained: {obj_dom.trained}");

    print("\n=== 2. Multiple Inheritance (Node) ===");
    pet1 = Pet(name="Buddy", owner="Bob");
    pet1.species = "Dog";
    pet1.age = 3;
    pet1.play();
    pet1.train();
    print(f"Warm blooded: {pet1.warm_blooded}");  # From Mammal

    print("\n=== 3. Edge Archetypes ===");
    rel = Relationship(strength=8, since=2018);
    rel.strengthen();
    print(f"Relationship: strength={rel.strength}, since={rel.since}");

    print("\n=== 4. Walker Archetypes and Inheritance ===");
    # Build graph: root -> pet1 -> pet2
    pet2 = Pet(name="Max", owner="Charlie");
    pet2.species = "Cat";
    pet2.age = 2;
    root ++> pet1;
    pet1 ++> pet2;

    # Test walker inheritance chain
    person = Person(name="Alice");
    person.species = "Human";
    person.age = 30;
    root spawn person;
    print(f"Alice visited {person.visited_count} pets");

    print("\n=== 5. Walker Inheritance (Caretaker) ===");
    caretaker = Caretaker(name="Bob");
    caretaker.species = "Human";
    caretaker.age = 35;
    root spawn caretaker;

    print("\n=== 6. Walker Inheritance (Veterinarian) ===");
    vet = Veterinarian(name="Smith", specialty="canine");
    vet.species = "Human";
    vet.age = 45;
    root spawn vet;

    print("\n=== 7. Edge with Abilities ===");
    # Create nodes and edge with ability
    owner = Pet(name="Owner", owner="Self");
    owner.species = "Human";
    owner.age = 40;
    owned = Pet(name="Owned", owner="Owner");
    owned.species = "Dog";
    owned.age = 2;

    root ++> owner;
    owner +>: Ownership(duration_years=3) :+> owned;

    root spawn OwnershipWalker();

    print("\n=== 8. Access Modifiers ===");
    priv = PrivateConfig();
    pub = PublicAPI();
    prot = ProtectedResource();
    print(f"Private: {priv.secret_key}");
    print(f"Public: {pub.version}, {pub.endpoint}");
    print(f"Protected: {prot.resource_id}");

    print("\n=== 9. Forward Declarations and Impl ===");
    animal_node = AnimalNode(animal_type="lion", habitat="savanna");
    animal_node.describe();

    edge_obj = SpecialEdge(edge_weight=2.5);
    print(f"Edge weight: {edge_obj.get_weight()}");

    print("\n=== 10. Specialized Walker from Forward Declaration ===");
    root ++> animal_node;
    animal_node spawn SpecializedWalker(specialization="wildlife");

    print("\n=== 11. Decorated Archetypes ===");
    # Decorators execute at definition time (output already shown above)
    decorated = DecoratedNode(name="Deco", owner="DecOwner");
    decorated.species = "Special";
    decorated.age = 1;
    print(f"Decorated node: {decorated.special_attr}");

    print("\n=== 12. Node Abilities with Visitor ===");
    interactive1 = InteractivePet(name="Fluffy");
    interactive2 = InteractivePet(name="Spot");

    root ++> interactive1;
    interactive1 ++> interactive2;

    # Person walker visiting
    person2 = Person(name="Dana");
    person2.species = "Human";
    person2.age = 28;
    root spawn person2;
    print(f"Fluffy happiness: {interactive1.happiness}");

    # Vet walker visiting
    vet2 = Veterinarian(name="Jones");
    vet2.species = "Human";
    vet2.age = 50;
    root spawn vet2;
    print(f"Fluffy happiness: {interactive1.happiness}");

    print("\n✓ Archetypes demonstrated!");
}
