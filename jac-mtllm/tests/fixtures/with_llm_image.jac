import from mtllm.llms { FakeLLM }
import from mtllm { Image }
import os;

glob llm = FakeLLM(
    print_prompt=True,
    default="[Output] Something",
);


def solve_math_question(question_img: Image) -> str
    by llm(method="Chain-of-Thoughts");

with entry {
    question_img = Image(
        os.path.join(
            os.path.dirname(__file__),
            'math_question.jpg'
        )
    );
    print(solve_math_question(question_img));
}
