import from mtllm { Model }
glob llm = Model(
    model_name="mockllm",
    outputs=["120597", "R8@jL3pQ"],
);


def generate_password() -> str by llm();
sem generate_password = """\
Generates and returns password that:
    - contain at least 8 characters
    - contain at least one uppercase letter
    - contain at least one lowercase letter
    - contain at least one digit
    - contain at least one special character
""";


# This will only retuen 120597 that is defined in the sem string, returning any other number means.
#   1. The semstring is not working correctly.
#   2. The llm is not working correctly.
#       - Should use a better llm that can perform well.
#       - Should use a lower temperature to ensure the output is deterministic.
def generate_specific_number() -> int by llm();

sem generate_specific_number = "Generates a specific number that is 120597 and returns it.";


with entry {
    specific_number = generate_specific_number();
    print('Specific number generated:', specific_number);

    password = generate_password();
    print('Generated password:', password);
}
