"""A Number Guessing Game"""

import random;
import from mtllm.llms {OpenAI}

glob llm = OpenAI(model_name="gpt-4o",verbose=True );

"""Analyze the player's guess and provide a helpful, encouraging hint about whether they should guess higher or lower. The hint should be creative and fun, without revealing the exact number. Consider how close or far the guess is from the target number and tailor the hint accordingly."""
def give_hint(guess: int, correct_number: int) -> str by llm();

walker GuessGame {
    has guess: int;

    can start with `root entry;

    can process_guess with turn entry;
}

node turn {
    has correct_number: int = random.randint(1, 10);    
}


# # If you want to manually see without cloud
# with entry {
#     root spawn GuessGame(3);
#     root spawn GuessGame(3);
#     root spawn GuessGame(3);
#     root spawn GuessGame(3);
# }

