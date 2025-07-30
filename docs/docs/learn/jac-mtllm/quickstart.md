# Quick Start Guide

## Installation

To get started with MTLLM, install the base package:

```bash
pip install mtllm
```

## AI-Integrated Function Example

This example demonstrates how MTLLM enables LLM integration into functions using the `by` keyword.

### Standard Implementation

Traditional translation implementation with manual API integration:

```jac linenums="1"
def translate(eng_sentence: str, target_lang: str) -> str {
    # Traditional approach: manual API calls, prompt engineering, response parsing
    # Lots of boilerplate code would go here...

    return "Hola Mundo";  # Hardcoded for demo
}

with entry {
    print(translate("Hello World", "es"));
}
```

**Limitations**: This approach is restricted to language codes (`es`, `fr`, etc.) and requires extensive prompt engineering to handle natural language inputs like "Language spoken in Somalia" or "The language of Shakespeare."

### MTLLM Implementation

The `by` keyword abstraction enables functions to process natural language inputs and generate contextually appropriate outputs:

#### Step 1: Configure LLM Model

```jac linenums="1"
import from mtllm {Model}

glob llm = Model(model_name="gpt-4o");
```

#### Step 2: Implement LLM-Integrated Function

Add `by llm` to enable LLM integration:

```jac linenums="1"
import from mtllm {Model}

glob llm = Model(model_name="gpt-4o");

def translate(eng_sentence: str, target_lang: str) -> str by llm();

with entry {
    print(translate("Hello World", "Language spoken in Somalia"));
    print(translate("Good morning", "The language of Cervantes"));
    print(translate("Thank you", "What people speak in Tokyo"));
}
```

The function now processes natural language descriptions and performs contextual translation.

#### Step 3: Execute the Application

Set your API key and run:

```bash
export OPENAI_API_KEY="your-api-key-here"
jac run translator.jac
```

For advanced usage of the `by` abstraction, refer to the [Usage Guide](./usage.md) for documentation on object methods, function overriding, and multi-agent workflows.
