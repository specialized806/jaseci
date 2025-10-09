with entry {
    name = "Thami";
    print(f"Hello {name}");
    print(F'Hello {name}');
    print(f"{{It is myname}}, name is: {name}");
    x= 10;
    y = 20;
    z = 65;
    b = "b";
    print(f"Sum of {x} and {y} is {x + y}");
    print(f"Debug: {b!a}");
    print(f"Hex: {y:x}");
    print(f"Binary: {x:b}");
    print(f"Value: {z:.2f}");
    print(f"Hex: {z:10}");
    name = "José";
    print(f"Default: {name}");
    print(f"ASCII: {name!a}");
    value = "Hello\nWorld";
    print(f"repr: {value!r}");   # same as repr(value)
    print(f"str: {value!s}");    # same as str(value)
    print(f"ascii: {value!a}");  # same as ascii(value)

}