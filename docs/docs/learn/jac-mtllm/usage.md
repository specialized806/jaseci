# Usage in code constructs

<!-- - Functions/ Aboilities
- Object Methods
- Object Initialization -->

## Functions and Methods

Functions and methods play a crucial role in implementing various functionalities in a traditional GenAI application. In jaclang, we have designed these functions and methods to be highly flexible and powerful. Surprisingly, they don't even require a function or method body thanks to the MTP `by <your_llm>` syntax. This section will guide you on how to effectively utilize functions and methods in jaclang using MTLLM plugin.

### Functions

In a traditional GenAI application, you would make API calls inside the function body to perform the desired action. However, in jaclang, you can define the function using the `by <your_llm>` syntax. This way, you can define the function without a body and let the MTLLM model handle the implementation. Here is an example:

```jac
def greet(name: str) -> str by <your_llm>();
```

In the above example, the `greet` function takes a `name` parameter of type `str` and returns a `str`. The function is defined using the `by <your_llm>` syntax, which means the implementation of the function is handled by the MTLLM.

Below is an example where we define a function `get_expert` that takes a question as input and returns the best expert to answer the question in string format using mtllm with openai model with the method `Reason`. `get_answer` function takes a question and an expert as input and returns the answer to the question using mtllm with openai model without any method. and we can call these function as normal functions.

```jac
import from mtllm.llms {OpenAI}

glob llm = OpenAI(model_name="gpt-4o");

def get_expert(question: str) -> str by llm(method='Reason');
def get_answer(question: str, expert: str) -> str by llm();

with entry {
    question = "What are Large Language Models?";
    expert = get_expert(question);
    answer = get_answer(question, expert);
    print(f"{expert} says: '{answer}' ");
}
```

Here's another example,

```jac
import from mtllm.llms {OpenAI}

glob llm = OpenAI(model_name="gpt-4o");

def get_joke_with_punchline() -> tuple[str, str] by llm();

with entry {
    (joke, punchline) = get_joke_with_punchline();
    print(f"{joke}: {punchline}");
}
```

In the above example, the `joke_punchline` function returns a tuple of two strings, which are the joke and its punchline. The function is defined using the `by <your_llm>` syntax, which means the implementation is handled by the MTLLM. You can add semstr to the function to make it more specific.


### Methods

In a traditional GenAI application, you would make API calls inside the method body to perform the desired action. However, in jaclang, you can define the method using the `by <your_llm>` syntax. This way, you can define the method without a body and let the MTLLM model handle the implementation. Here is an example:

```jac
obj Person {
    has name: str;
    def greet() -> str by <your_llm>(incl_info=(self));
}
```

In the above example, the `greet` method returns a `str`. The method is defined using the `by <your_llm>` syntax, which means the implementation of the method is handled by the MTLLM. The `incl_info=(self.name)` parameter is used to include the `name` attribute of the `Person` object as an information source for the MTLLM.

In the below example, we define a class `Essay` with a method `get_essay_judgement` that takes a criteria as input and returns the judgement for the essay based on the criteria using mtllm with openai model after a step of `Reasoning`. `get_reviewer_summary` method takes a dictionary of judgements as input and returns the summary of the reviewer based on the judgements using mtllm with openai model. `give_grade` method takes the summary as input and returns the grade for the essay using mtllm with openai model. and we can call these methods as normal methods.

```jac
import from mtllm.llms {OpenAI}

glob llm = OpenAI(model_name="gpt-4o");

obj Essay {
    has essay: str;

    def get_essay_judgement(criteria: str) -> str by llm(incl_info=(self.essay));
    def get_reviewer_summary(judgements: dict) -> str by llm(incl_info=(self.essay));
    def give_grade(summary: str) -> 'A to D': str by llm();
}

with entry {
    essay = "With a population of approximately 45 million Spaniards and 3.5 million immigrants,"
        "Spain is a country of contrasts where the richness of its culture blends it up with"
        "the variety of languages and dialects used. Being one of the largest economies worldwide,"
        "and the second largest country in Europe, Spain is a very appealing destination for tourists"
        "as well as for immigrants from around the globe. Almost all Spaniards are used to speaking at"
        "least two different languages, but protecting and preserving that right has not been"
        "easy for them.Spaniards have had to struggle with war, ignorance, criticism and the governments,"
        "in order to preserve and defend what identifies them, and deal with the consequences.";
    essay = Essay(essay);
    criterias = ["Clarity", "Originality", "Evidence"];
    judgements = {};
    for criteria in criterias {
        judgement = essay.get_essay_judgement(criteria);
        judgements[criteria] = judgement;
    }
    summary = essay.get_reviewer_summary(judgements);
    grade = essay.give_grade(summary);
    print("Reviewer Notes: ", summary);
    print("Grade: ", grade);
}
```

<!-- ## Object Initialization

As MTLLM is really great at handling typed outputs, we have added the ability to initialize a new object with only providing few of the required fields. MTLLM will automatically fill the rest of the fields based on the given context.

This behavior is very hard to achieve in other languages, but with MTLLM, it is as simple as providing the required fields and letting the MTLLM do the rest.

In the following example, we are initializing a new object of type `Task` with only providing the `description` field. The `time_in_min` and `priority_out_of_10` fields are automatically filled by the MTLLM based on the given context after a step of reasoning.

```jac
import from mtllm.llms, OpenAI, Ollama;

glob llm = OpenAI(model_name="gpt-4o");

obj Task {
    has description: str;
    has time_in_min: int,
        priority_out_of_10: int;
}

with entry {
    task_contents = [
        "Have some sleep",
        "Enjoy a better weekend with my girlfriend",
        "Work on Jaseci Project",
        "Teach EECS 281 Students",
        "Enjoy family time with my parents"
    ];
    tasks = [];
    for task_content in task_contents {
        task_info = Task(description = task_content by llm(method="Reason"));
        tasks.append(task_info);
    }
    print(tasks);
}
```
```jac
# Output
[
    Task(description='Have some sleep', time_in_min=30, priority_out_of_10=5),
    Task(description='Enjoy a better weekend with my girlfriend', time_in_min=60, priority_out_of_10=7),
    Task(description='Work on Jaseci Project', time_in_min=120, priority_out_of_10=8),
    Task(description='Teach EECS 281 Students', time_in_min=90, priority_out_of_10=9),
    Task(description='Enjoy family time with my parents', time_in_min=60, priority_out_of_10=7)
]
```

Here is another example with nested custom types,

```jac
import from jaclang.core.llms, OpenAI;

glob llm = OpenAI(model_name="gpt-4o");

obj Employer {
    has name: 'Employer Name': str,
        location: str;
}

obj 'Person'
Person {
    has name: str,
        age: int,
        employer: Employer,
        job: str;
}

with entry {
    info: "Person's Information": str = "Alice is a 21 years old and works as an engineer at LMQL Inc in Zurich, Switzerland.";
    person = Person(by llm(incl_info=(info)));
    print(person);
}
```
```jac
# Output
Person(name='Alice', age=21, employer=Employer(name='LMQL Inc', location='Zurich, Switzerland'), job='engineer')
```

In the above example, we have initialized a new object of type `Person` with only providing `info` as additional context. The `name`, `age`, `employer`, and `job` fields are automatically filled by the MTLLM based on the given context. -->