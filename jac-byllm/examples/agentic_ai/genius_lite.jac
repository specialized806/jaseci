
import from byllm { Model }
import from pathlib { Path }

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
    has task_name: str = "";
    has code: str = "";
    has status: str = "";
    has feedback: str = "";
}
sem CodeResult = "Result of code generation task";
sem CodeResult.task_name = "Name of the completed task";
sem CodeResult.code = "Generated code solution";
sem CodeResult.status = "Task completion status: success or failed";
sem CodeResult.feedback = "Validation feedback and suggestions";

# Core AI functions
def create_plan(request: str) -> list[Task] by llm(method="Reason");
def generate_solution(task: Task) -> str by llm(method="Reason");
def validate_code(code: str, task: Task) -> str by llm(method="Reason");

# Nodes for walker traversal
node TaskNode {
    has task: Task = Task(name="", type="", details="", priority=1);
    has code: str = "";
    has feedback: str = "";
    has status: str = "pending";

    def run() {
        print(f"⚡ Working on: {self.task.name}");
        self.code = generate_solution(self.task);
        self.feedback = validate_code(self.code, self.task);
        self.status = "success" if self.feedback else "failed";
        print(f"✅ Completed: {self.task.name}");
    }
}

node SummaryNode {
    has results: list[CodeResult] = [];
    def show() {
        output = f"🎯 Summary ({len(self.results)} tasks):\n\n";
        for result in self.results {
            status_icon = "✅" if result.status == "success" else "❌";
            output += f"{status_icon} {result.task_name}\n";
            if result.code and len(result.code) > 0 {
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
        print(output);
    }
}

# GeniusAgent as a walker
walker GeniusAgent {
    has request: str;
    has tasks: list[Task] = [];
    has results: list[CodeResult] = [];

    can start with `root entry {
        print("🚀 Genius Lite - AI Coding Assistant");
        print("Simple, structured code generation with validation");
        print("=" * 50);
        self.tasks = create_plan(self.request);
        print(f"📋 Created {len(self.tasks)} tasks");
        for task in self.tasks {
            task_node = TaskNode();
            task_node.task = task;
            task_node.run();
            
            result = CodeResult();
            result.task_name = task_node.task.name;
            result.code = task_node.code;
            result.status = task_node.status;
            result.feedback = task_node.feedback;
            self.results.append(result);
        }
        summary = SummaryNode();
        summary.results = self.results;
        summary.show();
    }
}

# Main execution
with entry {
    examples = [
        "Create a Python calculator with basic math operations",
        "Add error handling for invalid input",
        "Write unit tests for the calculator"
    ];
    for i in range(len(examples)) {
        print(f"\n📝 Demo {i+1}: {examples[i]}");
        print("-" * 50);
        agent = GeniusAgent(request=examples[i]) spawn root;
    }
    print("\n🎉 Genius Lite Demo Complete!");
    print("💡 Features: Task planning, code generation, validation");
}
