<h1 style="color: orange; font-weight: bold; text-align: center;">Tour of Jac</h1>

## Python Superset Philosophy: All of Python Plus More

Jac is a drop-in replacement for Python and supersets Python, much like Typescript supersets Javascript or C++ supersets C. It extends Python's semantics while maintaining full interoperability with the Python ecosystem, introducing cutting-edge abstractions designed to minimize complexity and embrace AI-forward development.

<div class="code-block">
```jac
import math;
import from random { uniform }

def calc_distance(x1: float, y1: float, x2: float, y2: float) -> float {
return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

with entry { # Generate random points
(x1, y1) = (uniform(0, 10), uniform(0, 10));
(x2, y2) = (uniform(0, 10), uniform(0, 10));

    distance = calc_distance(x1, y1, x2, y2);
    area = math.pi * (distance / 2) ** 2;

    print("Distance:", round(distance, 2), ", Circle area:", round(area, 2));

}

```
</div>

This snippet natively imports Python packages `math` and `random` and runs identically to its Python counterpart. Jac targets Python bytecode, so all Python libraries work with Jac.

## Four Types of Classes to Go Beyond OOP

In addtion to traditional python classes (`class` or the dataclass-like `obj`), Jac programmers can also use node classes (`node`), edge classes (`edge`), and walker classes (`walker`) for a new type of problem solving and agentic programming.

Instances of node and edge classes allow for assembling objects in a graph structure to express semantic relationships between objects. This goes beyond only modeling objects in memory as a disconnected soup of instances.

Walker classes inverts the traditional relationship between data and computation. Rather than moving data to computation with parameter passing, walkers enable moving computation to data as they represent computational units that moves through the topology of node and edge objects.

These new constructs gives rise to a new paradigm for problem solving and implementation we call Object-Spatial Programming (OSP).

### Traditional OOP vs Object-Spatial Programming

| **Traditional OOP**                                       | **Object-Spatial Programming**                                |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| • **Centralized Control**: Logic pulls data to itself     | • **Distributed Execution**: Logic travels to data            |
| • **Global Loops**: `for stage in stages: compute(stage)` | • **Spatial Awareness**: Walker visits GameStage nodes        |
| • **Data Movement**: Objects moved to processing units    | • **Data Locality**: Computation happens where data lives     |
| • **Rigid Structure**: Hard-coded execution patterns      | • **Composable Flows**: Stages as nodes, transitions as edges |
| • **Single Machine**: Difficult to distribute             | • **Scale-Ready**: Walkers can traverse across devices        |


## Programming Abstractions for AI

Jac provides novel constructs for integrating LLMs into code. A function body can simply be replaced with a call to an LLM, removing the need for prompt engineering or extensive use of new libraries.

```jac
import from mtllm.llms { Gemini }
glob llm = Gemini(model_name="gemini-2.0-flash");

enum Personality {
    INTROVERT = "Introvert",
    EXTROVERT = "Extrovert",
    AMBIVERT = "Ambivert"
}

def get_personality(name: str) -> Personality by llm();

with entry {
    name = "Albert Einstein";
    result = get_personality(name);
    print(f"{result.value} personality detected for {name}");
}
```

!!! info "How To Run"
    1. Install the MTLLM plugin by `pip install mtllm[google]`
    2. Get a free Gemini API key: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
    3. Save your Gemini API as an environment variable (`export GEMINI_API_KEY="xxxxxxxx"`).
    > **Note:** > > You can use OpenAI, Anthropic or other API services as well as host your own LLM using Ollama or Huggingface.
    4. Copy this code into `example.jac` file and run with `jac run example.jac`

??? example "Output"
    `   Introvert personality detected for Albert Einstein
    `

`by llm()` delegates execution to an LLM without any extra library code.


### Agentic AI with Meaning-Typed Programming (MTP) Example

This example demonstrates Meaning-Typed Programming (MTP) in the Jaseci Stack, where Jac code seamlessly integrates LLMs and external APIs to create an intelligent, agentic workflow:

**Your Intelligent Travel Planner with just 50 lines of code !!**

```jac
import os;
import requests;
import from mtllm.llm {Model}
import from httpx  {get}

glob llm = Model(model_name="gpt-4o");

obj WebSearch {
    has api_key: str = os.getenv("SERPER_API_KEY");
    has base_url: str = "https://google.serper.dev/search";

    def search(query: str) {
        headers = {"X-API-KEY": self.api_key, "Content-Type": "application/json"};
        payload = {"q": query};
        resp = requests.post(self.base_url, headers=headers, json=payload);
        if resp.status_code == 200 {
            data = resp.json();
            summary = "";
            results = data.get("organic", []) if isinstance(data, dict) else [];
            for r in results[:3] {
                summary += f"{r.get('title', '')}: {r.get('link', '')}\n";
                if r.get('snippet') {
                    summary += f"{r['snippet']}\n";
                }
            }
            return summary;
        }
        return f"Serper request failed: {resp.status_code}";
    }
}

def search_web(query: str) -> str { return WebSearch().search(query=query); }

"""You are a cheerful travel buddy.
TASK:
1. Find next Saturday (YYYY-MM-DD).
2. Get weather: search_web("weather Saturday {location} {date}").
   - GOOD = no 'rain'/'storm' & precip<30%.
3. If GOOD:
    a) search_web("outdoor events {location} {date}").
    b) Pick 1 event → {name, time, venue, 1 fun fact}.
    c) Add 1 nearby outdoor bonus spot (with why it’s cool).
4. If BAD:
    a) search_web("indoor things to do {location} {date}").
    b) Pick 1 activity → {name, hours, location, approx cost}.
5. Reply as 1 friendly paragraph:
    [Greet + Weather] → [Main rec] → [Bonus/cosy alt + cost] → [Enthusiastic closing]."""
def weekend_plan(location:str)->str by llm(method="ReAct",tools=[search_web]);

with entry {print(weekend_plan("Michigan, USA"));}
```

!!! info "How To Run"
    1. Install the MTLLM plugin by `pip install mtllm`
    2. Get a free Serper API key: Visit [Serper.dev](https://serper.dev/)
    3. Save your OpenAI API as an environment variable (`export OPENAI_API_KEY="xxxxxxxx"`).
    > **Note:** > > You can use Gemini, Anthropic or other API services as well as host your own LLM using Ollama or Huggingface.
    4. Copy this code into `example.jac` file and run with `jac run example.jac`

??? example "Output"
    `   Hey there! It's looking like a fantastic Saturday on July 19, 2025, in Michigan, with clear sunny skies and just a 10% chance of rain. Perfect weather for an outdoor adventure! I recommend checking out the Arenac County Fair, running until the 19th. It's a delightful local event with a variety of activities, from animal shows to fun rides, all happening at the Arenac County Fairgrounds. Here's a fun fact: it's one of the oldest county fairs in Michigan, celebrating local culture and community spirit.

    While you're outdoors, why not visit the Sleeping Bear Dunes National Lakeshore nearby? It's renowned for its stunning landscape and offers breathtaking views of Lake Michigan. It's a cool spot for hiking and just soaking up nature's beauty.

    Enjoy your day out in Michigan, and make the most of the sunshine! 🌞
    `

This MTP example shows how Jac can orchestrate LLMs and external APIs in a single workflow, enabling agentic, tool-using applications with minimal code.


## Zero to Infinite Scale without any Code Changes

### Instantly deploy a Production ready Fast API server with no code changes !!!

### What is Jac Cloud?

Jac Cloud is a cloud-native execution environment designed specifically for Jac programs, allowing developers to build, deploy, and scale applications effortlessly. It integrates essential features like persistence, user management, and distributed execution directly into the language, enabling you to focus on business logic without worrying about infrastructure complexity.

Jac's cloud-native abstractions make persistence and user concepts part of the language so that simple programs can run unchanged locally or in the cloud. Deployments can be scaled by increasing replicas of the `jac-cloud` service when needed.

```jac
node Post {
    has content: str;
    has author: str;
}

walker create_post {
    has content: str, author: str;

    can func_name with `root entry {
        new_post = Post(content=self.content, author=self.author);
        here ++> new_post;
        report {"id": new_post.id, "status": "posted"};
    }
}
```

!!! info "How To Run"
    1. Install the Jac Cloud by `pip install jac-cloud`
    2. Copy this code into `example.jac` file and run with `jac serve example.jac`

??? example "Output"
    `   INFO:     Started server process [26286]
        INFO:     Waiting for application startup.
        INFO - DATABASE_HOST is not available! Using LocalDB...
        INFO - Scheduler started
        INFO:     Application startup complete.
        INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
    `

![Fast API Server](../assets/jac_cloud_example.jpg)

### Key Features of Jac Cloud

#### Scale-Agnostic Programming

- **Write Once, Run Anywhere**: Jac Cloud enables you to write your application code once and run it seamlessly on your local machine or scale it to millions of users in the cloud—without any code changes.
- **Automatic Scaling**: You can increase the number of Jac Cloud service replicas to handle higher loads. The platform manages all the complexities of scaling, so you don't have to.

#### Instant API Generation

- **No Manual Endpoint Definition**: Jac Cloud automatically transforms your Jac walkers into RESTful API endpoints. You don't need to manually define API routes or handlers—your business logic is instantly accessible as web services.
- **Supports REST and WebSockets**: Applications can expose RESTful APIs, WebSocket services, and scheduled tasks with minimal configuration.

#### Integrated Persistence and User Management

- **User Authentication and Authorization**: Jac Cloud includes token-based authentication and role-based access control, making it easy to build secure, multi-user applications.

#### Cloud-Native Abstractions

- **First-Class Support for Modern Patterns**: Concepts like nodes, walkers, and graphs are deeply integrated, making it straightforward to model complex data and workflows that scale

This simple social media post system runs locally or scales infinitely in the cloud with no code changes.

## Better Organized and Well Typed Codebases

Jac focuses on type safety and readability. Type hints are required and the built-in typing system eliminates boilerplate imports. Code structure can be split across multiple files, allowing definitions and implementations to be organized separately while still being checked by Jac's native type system.

=== "tweet.jac"

    ```jac
    obj Tweet {
        has content: str, author: str, timestamp: str, likes: int = 0;

        def like() -> None;
        def unlike() -> None;
        def get_preview(max_length: int) -> str;
        def get_like_count() -> int;
    }
    ```

=== "tweet.impl.jac"

    ```jac
    impl Tweet.like() -> None {
        self.likes += 1;
    }

    impl Tweet.unlike() -> None {
        if self.likes > 0 {
            self.likes -= 1;
        }
    }

    impl Tweet.get_preview(max_length: int) -> str {
        return self.content[:max_length] + "..." if len(self.content) > max_length else self.content;
    }

    impl Tweet.get_like_count() -> int {
        return self.likes;
    }
    ```

    This shows how declarations and implementations can live in separate files for maintainable, typed codebases.

## Next Steps

<div class="grid cards" markdown>

-   __In The Works__

    ---

    *Roadmap Items*

    [In The Roadmap](bigfeatures.md){ .md-button .md-button--primary }

-   __In The Future__

    ---

    *Research in Jac/Jaseci*

    [In Research](research.md){ .md-button }

</div>
