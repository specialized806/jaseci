import os;
import from pathlib { Path }
import from byllm { Model }

glob llm = Model(model_name="gpt-4o-mini");

# Simple task object with semantic annotations
obj Task {
    has name: str;
    has type: str;
    has details: str;
    has priority: int = 1;
}

sem Task = "A specific development task with clear implementation requirements";
sem Task.name = "Clear, descriptive name for the task";
sem Task.type = "Task category: code, fix, docs, or test";
sem Task.details = "Specific implementation instructions";
sem Task.priority = "Task priority: 1=high, 2=medium, 3=low";

obj CodeResult {
    has task_name: str;
    has code: str;
    has status: str;
    has feedback: str;
}

sem CodeResult = "Result of code generation task";
sem CodeResult.task_name = "Name of the completed task";
sem CodeResult.code = "Generated code solution";
sem CodeResult.status = "Task completion status: success or failed";
sem CodeResult.feedback = "Validation feedback and suggestions";

# Core AI functions using mtllm
"""Analyze user request and create structured tasks"""
def create_plan(request: str) -> list[Task] by llm(method="Reason");

"""Generate code solution for a task"""
def generate_solution(task: Task) -> str by llm(method="Reason");

"""Validate and provide feedback on generated code"""
def validate_code(code: str, task: Task) -> str by llm(method="Reason");

# Simple genius agent
node GeniusAgent {
    has results: list[CodeResult] = [];

    def process_request(request: str) -> str {
        print(f"🤖 Processing: {request}");

        # Create task plan
        tasks = create_plan(request);
        print(f"📋 Created {len(tasks)} tasks");

        self.results = [];

        # Execute each task
        for task in tasks {
            print(f"⚡ Working on: {task.name}");

            try {
                code = generate_solution(task);
                feedback = validate_code(code, task);

                result = CodeResult(
                    task_name=task.name,
                    code=code,
                    status="success",
                    feedback=feedback
                );

                self.results.append(result);
                print(f"✅ Completed: {task.name}");

            } except Exception as e {
                result = CodeResult(
                    task_name=task.name,
                    code="",
                    status="failed",
                    feedback=str(e)
                );
                self.results.append(result);
                print(f"❌ Failed: {task.name}");
            }
        }

        return self.format_summary();
    }

    def format_summary() -> str {
        output = f"🎯 Summary ({len(self.results)} tasks):\n\n";

        for result in self.results {
            status_icon = "✅" if result.status == "success" else "❌";
            output += f"{status_icon} {result.task_name}\n";

            if result.code and len(result.code) > 0 {
                # Show first 150 chars of code
                code_preview = result.code[:150];
                if len(result.code) > 150 {
                    code_preview += "...";
                }
                output += f"   Code: {code_preview}\n";
            }

            if result.feedback {
                output += f"   Feedback: {result.feedback[:100]}...\n";
            }

            output += "\n";
        }

        return output;
    }

    def get_code(task_name: str) -> str {
        for result in self.results {
            if result.task_name == task_name and result.code {
                return f"Full code for '{task_name}':\n\n{result.code}";
            }
        }
        return f"No code found for task: {task_name}";
    }

    def save_code(task_name: str, filename: str) -> bool {
        for result in self.results {
            if result.task_name == task_name and result.code {
                try {
                    Path(filename).write_text(result.code, encoding='utf-8');
                    print(f"💾 Saved '{task_name}' to {filename}");
                    return True;
                } except Exception as e {
                    print(f"❌ Failed to save {filename}: {e}");
                    return False;
                }
            }
        }
        print(f"❌ No code found for task: {task_name}");
        return False;
    }
}

# Demo helper function
def run_demo(agent: GeniusAgent) {
    examples = [
        "Create a Python calculator with basic math operations",
        "Add error handling for invalid input",
        "Write unit tests for the calculator"
    ];

    for i in range(len(examples)) {
        example = examples[i];
        print(f"\n📝 Demo {i+1}: {example}");
        print("-" * 50);

        result = agent.process_request(example);
        print(result);

        # Show full code for first example
        if i == 1 and agent.results {
            print("🔍 Full Solution:");
            print(agent.get_code(agent.results[0].task_name));
        }
    }
}

# Main execution
with entry {
    print("🚀 Genius Lite - AI Coding Assistant");
    print("Simple, structured code generation with validation");
    print("=" * 50);

    agent = GeniusAgent();

    # Run the demo
    run_demo(agent);

    # Example of saving generated code
    if agent.results {
        first_task = agent.results[0].task_name;
        agent.save_code(first_task, "generated_calculator.py");
    }

    print("\n🎉 Genius Lite Demo Complete!");
    print("💡 Features: Task planning, code generation, validation, file operations");
}
