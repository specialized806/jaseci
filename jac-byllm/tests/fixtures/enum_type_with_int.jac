import from byllm {Model}

enum Tell {
    YES, NO
}

glob llm = Model(model_name="mockllm", 
    outputs=[Tell.NO, Tell.YES],
);

"""Yes/No answering Bot"""
def yes_or_no(question:str) -> Tell by llm();

with entry {
    question: str = "Are you a Human?";
    answer: Tell = yes_or_no(question);
    print(f"Question: {question}");
    print(f"The bot answered {answer}");
    print(f"The bot answered {yes_or_no('Are you a bot?')}");
}