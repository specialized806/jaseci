"""A bit more chill approach."""

obj rson {
    has age: int,
        name: str;

    def init(name: str, age: int) -> None {
        here.name = name;
        here.age = age;
    }

    def greet() -> None {
        print("Hello, my name is ", here.name, " and I'm ", here.age, " years old.");
    }
}

with entry {
    Person("John", 42).greet();
}
