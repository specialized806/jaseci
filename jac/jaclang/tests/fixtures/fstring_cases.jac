with entry {
    # name = "Thami";
    # print(f"Hello {name}");
    # print(F'Hello {name}');
    # print(f"{{It is myname}}, name is: {name}");
    # x= 10;
    # y = 20;
    # z = 65;
    # b = "b";
    # print(f"Sum of {x} and {y} is {x + y}");
    # print(f"Debug: {b!a}");
    # print(f"Hex: {y:x}");
    # print(f"Binary: {x:b}");
    # print(f"Value: {z:.2f}");
    # print(f"Hex: {z:10}");
    # name = "José";
    # print(f"Default: {name}");
    # print(f"ASCII: {name!a}");
    # value = "Hello\nWorld";
    # print(f"repr: {value!r}");
    # print(f"str: {value!s}");
    # print(f"ascii: {value!a}");
    # print(f"name is {name} {f'inner: {name}'}");

    name = "Thami";
    x= 10;
    y = 20;
    z = 65;
    value = "Hello\nWorld";
    # Triple double quote f-strings
    multiline_msg = f"""Hello {name},
    This is a multiline f-string.
    Your value is: {value}
    Sum of {x} + {y} = {x + y}""";
    print(multiline_msg);

    # Triple single quote f-strings
    another_multiline = f'''Welcome {name}!
    Here's your data:
    - X: {x}
    - Y: {y}
    - Z: {z}
    Binary of {x}: {x:b}''';
    print(another_multiline);

    # # Nested f-strings with triple quotes
    nested_triple = f"""Outer: {name} {f'''Inner triple: {value}'''}""";
    print(nested_triple);

    # # # Complex formatting with triple quotes
    complex_format = f"""
    Debug Report for {name}:
    {{
        "x": {x},
        "y": {y},
        "hex_y": "{y:x}",
        "repr_value": {value!r}
    }}
    """;
    print(complex_format);

}