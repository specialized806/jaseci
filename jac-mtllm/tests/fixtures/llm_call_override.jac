import from mtllm.llms { FakeLLM }

glob llm = FakeLLM(
    print_prompt=True,
    default='[Output] Hey there Alex!',
);

"Greet the user with the given name."
def greet(name: str) -> str {
  return "Howdy " + name;
}


with entry {
  print(greet("Alex") by llm());
}
