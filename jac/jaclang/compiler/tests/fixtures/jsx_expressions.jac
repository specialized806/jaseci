""" JSX with expressions test fixture """

with entry {
    let name = "World";
    let count = 42;

    # JSX with embedded expressions
    let greeting = <h1>{"Hello " + name + "!"}</h1>;

    # Expression in attribute
    let button = <button id={name} count={count}>{"Click"}</button>;

    # Complex expressions
    let computed = <div>{count + 10}</div>;
}
