import from mtllm { Model }

glob llm = Model(
    # model_name="gpt-4o",
    model_name="gemini/gemini-2.5-flash",
);

obj PunclineJokes {
    has jokes: list[dict] = [
        {
            "joke": "How does a penguin build its house?",
            "punchline": "Igloos it together."
        },
        {
            "joke": "Which knight invented King Arthur's Round Table?",
            "punchline": "Sir Cumference."
        }
    ];

    def generate_joke -> dict[str, str] by llm(incl_info={"jokes_example" : self.jokes}, temperature=0.0);
    def generate {
        joke_punchline = self.generate_joke();
        self.jokes.append(joke_punchline);
    }
}

sem PunclineJokes.joke = 'Jokes with Punchlines';

with entry {
    joke_gen = PunclineJokes();
    for i in range(5) {
        joke_gen.generate();
    }
    print(joke_gen.jokes);
}
