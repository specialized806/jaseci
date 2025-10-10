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
    print(f"repr: {value!r}");
    print(f"str: {value!s}");
    print(f"ascii: {value!a}");
    print(f"name is {name} {f'inner: {name}'}");

}