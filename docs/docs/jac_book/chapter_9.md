# Chapter 9: Nodes and Edges
---
**Nodes** and **Edges** are the fundamental building blocks of Object-Spatial Programming. Nodes represent data locations in your graph, while edges represent the relationships between them.


## Node Abilities
---
In Object-Spatial Programming, walkers often carry the intelligence—they traverse the graph, maintain state, and make decisions. But in Jac, nodes are not just passive data containers. They can have their own abilities—functions that trigger when a specific kind of walker arrives. This two-way dynamic enables powerful, flexible interactions between walkers and the graph they explore.

### Usecase: Uninformed State Agent
Imagine a generic agent called StateAgent. It’s been sent into a graph, tasked with collecting environmental information. However, this agent knows nothing in advance about the nodes it will visit. It doesn’t know what data to look for, or how to interpret it. In traditional programming, this would be a problem—how can an agent act on things it doesn’t understand?

But in Jac, the nodes themselves are intelligent. They can recognize the type of walker arriving and decide how to interact with it. In this case, when the StateAgent visits, the nodes will update the agent’s internal state with their own properties—effectively teaching the agent as it moves.

First, let's define our StateAgent walker:
```jac
walker StateAgent {
    has state: dict = {};

    can start with `root entry {
        visit [-->];
    }
}
```
The `StateAgent` walker carries a dictionary called `state` to store data it collects as it walks the graph. It starts at the root node and visits all directly connected nodes.

```jac
node Weather {
    has temp: int = 80;

    can get with StateAgent entry {
        visitor.state["temperature"] = self.temp;
    }
}
```
The `Weather` node knows what to do when a `StateAgent` visits. It sets the "temperature" key in the agent's state to its local `temp` value. In a production system, this could be a call to an API to get real-time weather data.

```jac
node Time {
    has hour: int = 12;

    can get with StateAgent entry {
        visitor.state["time"] = f"{self.hour}:00 PM";
    }
}
```
Similarly, the `Time` node updates the agent's state with the current hour.

```jac
with entry {
    root ++> Weather();
    root ++> Time();

    agent = StateAgent() spawn root;
    print(agent.state);
}
```
Finally, we build the graph: the `root` node connects to both `Weather` and `Time`. We spawn the `StateAgent`, and when the traversal completes, the agent’s internal state reflects the data it collected from each node.

```jac
# node_abilities.jac
walker StateAgent{
    has state: dict = {};

    can start with `root entry {
        visit [-->];
    }
}

node Weather {
    has temp: int = 80;

    can get with StateAgent entry {
        visitor.state["temperature"] = self.temp;
    }
}

node Time {
    has hour: int = 12;

    can get with StateAgent entry {
        visitor.state["time"] = f"{self.hour}:00 PM";
    }
}

with entry {
    root ++> Weather();
    root ++> Time();

    agent = StateAgent() spawn root;
    print(agent.state);
}
```


```terminal
$ jac run node_abilities.jac

{"temperature": 80, "time": "12:00 PM"}
```

## Node Inheritance
---
In Jac, nodes are more than just data—they can encapsulate behavior and interact with walkers. When building modular systems, it’s often useful to group nodes by type or functionality. This is where node inheritance comes in.

Let’s revisit the `Weather` and `Time` nodes from the previous example. While they each provide different types of information, they serve a common purpose: delivering contextual data to an agent. In Jac, we can express this shared role using inheritance, just like in traditional object-oriented programming.

We define a base node archetype called `Service`. This acts as a common interface for all context-providing nodes. Any node that inherits from `Service` is guaranteed to support certain interactions—either by shared methods or simply by tagging it with a common type.

```jac
node Service {}
```

Then we define both `Weather` and `Time` as subtypes of `Service`:
```jac
node Weather(Service) {
    has temp: int = 80;

    can get with StateAgent entry {
        visitor.state["temperature"] = self.temp;
    }
}

node Time(Service) {
    has hour: int = 12;

    can get with StateAgent entry {
        visitor.state["time"] = f"{self.hour}:00 PM";
    }
}
```
<br />
Now, a walker doesn’t need to know what specific service it’s interacting with. It can simply filter by the base type:

```jac
walker StateAgent {
    has state: dict = {};

    can start with `root entry {
        visit [-->(`?Service)];  # Visit any node that is a subtype of Service
    }
}
```
<br />
This allows `StateAgent` to be generic and extensible. If we later add new service nodes like `Location`, `Date`, or `WeatherForecast`, we don’t need to modify the walker—so long as those nodes inherit from `Service`, the walker will visit them automatically.

The ```-->(`?[Node])``` syntax is a powerful feature of Jac that allows you to filter nodes by type. It tells the walker to visit any node that matches the `[Node]` type, regardless of its specific implementation.

### Usecase: A Smarter NPC
Imagine we want to create an NPC (non-player character) that adjusts its behavior based on the environment. It could change its mood depending on the **weather** or **time of day**—perhaps it's cheerful in the morning, grumpy when it's hot, or sleepy at night.

To enable this, we've already built the necessary groundwork:
- A `Weather` node and a `Time` node, both of which inherit from a common base `Service`.
- A `StateAgent` walker that visits all `Service` nodes and collects their data into its internal state dictionary.

#### The Mood Function
Now we want to generate a mood string based on that state. Instead of hardcoding dozens of conditionals, we’ll use a language model to synthesize a response.

For this, we rely on the MTLLM plugin, introduced earlier in the book. It lets us define functions that delegate logic to an external language model—like OpenAI’s GPT—while keeping the interface clean and declarative.

Here’s the code for our mood function:
```jac
import from mtllm { Model }

# Configure the LLM model to use
glob npc_model = Model(model_name="gpt-4.1-mini");

"""Adjusts the tone or personality of the shop keeper npc depending on weather/time."""
def get_ambient_mood(state: dict) -> str by npc_model(incl_info=(state));
```
This function, `get_ambient_mood`, takes a dictionary (the walker’s state) and sends it to the model. The model interprets the contents—like `temperature` and `time`—and returns a textual mood that fits the situation.

#### The NPC Node
The `NPC` node uses the LLM to personalize its mood based on the current state. It expects the agent to have already visited relevant `Service` nodes and stored that information in its `state` field:

```jac
node NPC {
    can get with StateAgent entry {
        visitor.state["npc_mood"] = get_ambient_mood(visitor.state);
    }
}
```
This is where the NPC’s personality is generated—based entirely on the graph-derived context.

#### Walker Composition
We extend our `StateAgent` to create a specialized walker that visits the `NPC` node after gathering environmental data:
```jac
walker NPCWalker(StateAgent) {
    can visit_npc with `root entry {
        visit [-->(`?NPC)];
    }
}
```
The `NPCWalker` first inherits the behavior of `StateAgent` (which collects context), and then adds a second phase to interact with the NPC after that context is built.


#### Putting It All Together
Finally, we can compose everything in a single entry point:
```jac
import from mtllm { Model }

# Configure different models
glob npc_model = Model(model_name="gpt-4.1-mini");

node Service{}

walker StateAgent{
    has state: dict = {};

    can start with `root entry {
        visit [-->(`?Service)];
    }
}

node Weather(Service) {
    has temp: int = 80;

    can get with StateAgent entry {
        visitor.state["temperature"] = self.temp;
    }
}

node Time(Service) {
    has hour: int = 12;

    can get with StateAgent entry {
        visitor.state["time"] = f"{self.hour}:00 PM";
    }
}

"""Adjusts the tone or personality of the shop keeper npc depending on weather/time."""
def get_ambient_mood(state: dict) -> str by npc_model(incl_info=(state));

node NPC {
    can get with StateAgent entry {
        visitor.state["npc_mood"] = get_ambient_mood(visitor.state);
    }
}

walker NPCWalker(StateAgent) {
    can visit_npc with `root entry{
        visit [-->(`?NPC)];
    }
}


with entry {
    root ++> Weather();
    root ++> Time();
    root ++> NPC();

    agent = NPCWalker() spawn root;
    print(agent.state['npc_mood']);
}
```
<br />

```terminal
$ jac run npc_mood.jac

"The shopkeeper greets you warmly with a bright smile, saying, "What a hot day we’re having!
Perfect time to stock up on some refreshing potions or cool drinks. Let me know if you need
anything to beat the heat!"
```
<br />


## Edge Types and Relationships
---
Edges in Jac represent relationships between nodes. They are first-class objects with their own properties and behaviors, allowing you to model complex interactions like enrollment, teaching, and friendships. Edges can be created using the `edge` keyword, and they connect nodes in meaningful ways.


Edges in Jac are not just connections - they're full objects with their own properties and behaviors. This makes relationships as important as the data they connect.

### Basic Edge Declaration

```jac
# Basic node for representing teachers
node Teacher {
    has name: str;
    has subject: str;
    has years_experience: int;
    has email: str;
}

# Basic node for representing students
node Student {
    has name: str;
    has age: int;
    has grade_level: int;
    has student_id: str;
}

node Classroom {
    has room_number: str;
    has capacity: int;
    has has_projector: bool = True;
}

# Edge for student enrollment
edge EnrolledIn {
    has enrollment_date: str;
    has grade: str = "Not Assigned";
    has attendance_rate: float = 100.0;
}

# Edge for teaching assignments
edge Teaches {
    has start_date: str;
    has schedule: str;  # "MWF 9:00-10:00"
    has is_primary: bool = True;
}

# Edge for friendship between students
edge FriendsWith {
    has since: str;
    has closeness: int = 5;  # 1-10 scale
}

with entry {
    # Create the main classroom
    science_lab = root ++> Classroom(
        room_number="Lab-A",
        capacity=24,
        has_projector=True
    );

    # Create teacher and connect to classroom
    dr_smith = science_lab +>:Teaches(
        start_date="2024-08-01",
        schedule="TR 10:00-11:30"
    ):+> Teacher(
        name="Dr. Smith",
        subject="Chemistry",
        years_experience=12,
        email="smith@school.edu"
    );
}
```


## Graph Navigation and Filtering
---
Jac provides powerful syntax for navigating graphs: `[-->]` gets outgoing connections, `[<--]` gets incoming connections, and filters can be applied to find specific nodes or edges.

### Basic Navigation

```jac
--8<-- "docs/examples/chapter_10_school.jac:1:67"
--8<-- "docs/examples/chapter_10_school.jac:117:166"
```


### Advanced Filtering

```jac
--8<-- "docs/examples/chapter_10_school.jac:1:177"
```



## Best Practices

!!! summary "Design Guidelines"
    - **Nodes for Entities**: Use nodes for things that exist independently (students, teachers, classrooms)
    - **Edges for Relationships**: Use edges for connections between entities (enrollment, teaching, friendship)
    - **Rich Edge Properties**: Store relationship-specific data in edges (grades, dates, status)
    - **Consistent Naming**: Use clear, descriptive names for node and edge types
    - **Connect to Root**: Always connect important nodes to root for persistence

## Key Takeaways

!!! summary "What We've Learned"
    **Node Fundamentals:**

    - **Spatial objects**: Nodes can be connected and automatically persist when linked to root
    - **Property storage**: Nodes hold data using `has` declarations with automatic constructors
    - **Automatic persistence**: Nodes connected to root persist between program runs
    - **Type safety**: All node properties must have explicit types

    **Edge Fundamentals:**

    - **First-class relationships**: Edges are full objects with their own properties and behaviors
    - **Typed connections**: Edges define the nature of relationships between nodes
    - **Bidirectional support**: Edges can be traversed in both directions
    - **Rich metadata**: Store relationship-specific data directly in edge properties

    **Graph Operations:**

    - **Creation syntax**: Use `++>` to create new connections, `-->` to reference existing ones
    - **Navigation patterns**: `[-->]` for outgoing, `[<--]` for incoming connections
    - **Filtering support**: Apply conditions to find specific nodes or edges
    - **Traversal efficiency**: Graph operations are optimized for spatial queries

    **Practical Applications:**

    - **Natural modeling**: Represent real-world entities and relationships directly
    - **Query capabilities**: Find related data through graph traversal
    - **Persistence automation**: No manual database management required
    - **Scalable architecture**: Graph structure supports distributed processing

!!! tip "Try It Yourself"
    Practice with nodes and edges by building:
    - A classroom management system with students, teachers, and courses
    - A family tree with person nodes and relationship edges
    - A social network with users and friendship connections
    - An inventory system with items and location relationships

    Remember: Nodes represent entities, edges represent relationships - think spatially!

---

*Your graph foundation is solid! Now let's add mobile computation with walkers and abilities.*
