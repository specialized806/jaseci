import from mtllm { Model }

glob llm = Model(model_name="gpt-4o-mini", verbose=True);

def translate(input: str, lang: str="French") -> str by llm();

with entry {
    print(translate("I am a student", "French"));
    print(translate("I am a student", "Spanish"));
}
