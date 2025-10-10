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

   # Raw f-strings (rf or fr prefix)
    path = "home";
    file = "test.txt";
    
    # Raw f-string with double quotes
    raw_path = rf"C:\Users\{name}\{path}\{file}";
    print(raw_path);
    
    # Raw f-string with single quotes  
    raw_path2 = fr'D:\Projects\{name}\{file}';
    print(raw_path2);
    
    # Raw f-string with triple double quotes
    raw_multiline = rf"""Path: C:\Users\{name}\Documents\
    File: {file}
    Full: C:\Users\{name}\Documents\{file}""";
    print(raw_multiline);
    
    # Raw f-string with triple single quotes
    raw_multiline2 = fr'''Regex pattern: \d+\.\d+
    Name: {name}
    Pattern for {name}: \b{name}\b''';
    print(raw_multiline2);
    
    # Raw f-strings with formatting
    regex_pattern = rf"\b{name}\w*\b";
    print(regex_pattern);
    
    # Raw f-string with newline literals (not interpreted as actual newlines)
    raw_with_newline = rf"Line 1\nLine 2 with {name}\tTabbed";
    print(raw_with_newline);
    
    # Raw f-string with backslashes and formatting
    windows_path = rf"\\server\share\{name}\documents\{file}";
    print(windows_path);

}