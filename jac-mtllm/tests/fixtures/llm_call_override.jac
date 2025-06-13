import from mtllm.llms { FakeLLM }

glob llm = FakeLLM(
    print_prompt=True,
    responses={
      '\n[System Prompt]\nThis is an operation you must perform and return the output values. Neither, the methodology, extra sentences nor the code are not needed.\nInput/Type formatting: Explanation of the Input (variable_name) (type) = value\n\n[Inputs_Information]\n(name) (str) = "Alex"\n\n[Output_Information]\n(str)\n\n[Action]\nGreet the user with the given name. (greet)\nGenerate and return the output result(s) only, adhering to the provided Type in the following format\n\n[Output] <result>\n':
      '[Output] Hello there, Alex!',

      '\n[System Prompt]\nThis is an operation you must perform and return the output values. Neither, the methodology, extra sentences nor the code are not needed.\nInput/Type formatting: Explanation of the Input (variable_name) (type) = value\n\n[Inputs_Information]\n(text) (str) = "I love this product!"\n\n[Output_Information]\n(str)\n\n[Action]\nAnalyze the sentiment of the given text. (analyze_sentiment)\nGenerate and return the output result(s) only, adhering to the provided Type in the following format\n\n[Output] <result>\n':
      '[Output] Strongly Positive',

      '\n[System Prompt]\nThis is an operation you must perform and return the output values. Neither, the methodology, extra sentences nor the code are not needed.\nInput/Type formatting: Explanation of the Input (variable_name) (type) = value\n\n[Inputs_Information]\n(text) (str) = "Hello world"\n(target_lang) (str) = "French"\n\n[Output_Information]\n(str)\n\n[Action]\nTranslate text to another language. (translate_text)\nGenerate and return the output result(s) only, adhering to the provided Type in the following format\n\n[Output] <result>\n':
       '[Output] Bonjour le monde!',
    }
);

"Greet the user with the given name."
def greet(name: str) -> str {
  return "Howdy " + name;
}

"Analyze the sentiment of the given text."
def analyze_sentiment(text: str) -> str {
  return "Neutral";
}

"Translate text to another language."
def translate_text(text: str, target_lang: str) -> str {
  return "Translation not available";
}


with entry {
  print("Normal function call:", greet("Alex"));
  print("LLM override call:", greet("Alex") by llm());

  print("Normal sentiment:", analyze_sentiment("I love this product!"));
  print("LLM sentiment:", analyze_sentiment("I love this product!") by llm());

  print("Normal translation:", translate_text("Hello world", "French"));
  print("LLM translation:", translate_text("Hello world", "French") by llm());
}
