"""High Priority: Spread and Rest operators (SpreadElement, RestElement tests)."""

# List spread - unpacking lists
def test_list_spread()  -> list {
    list1 = [1, 2, 3];
    list2 = [4, 5, 6];
    combined = [*list1, *list2];
    return combined;
}


# List spread with additional elements
def test_list_spread_mixed()  -> list {
    list1 = [1, 2];
    list2 = [5, 6];
    result = [0, *list1, 3, 4, *list2, 7];
    return result;
}


# Dict spread - unpacking dictionaries
def test_dict_spread()  -> dict {
    dict1 = {"a" : 1 , "b" : 2 };
    dict2 = {"c" : 3 , "d" : 4 };
    merged = {** dict1 , ** dict2 };
    return merged;
}


# Dict spread with overrides
def test_dict_spread_override()  -> dict {
    defaults = {"x" : 1 , "y" : 2 , "z" : 3 };
    overrides = {"y" : 20 , "z" : 30 };
    result = {** defaults , ** overrides };
    return result;
}


# Dict spread in function call
def test_dict_spread_in_call()  -> int {
    def compute(a: int, b: int, c: int) -> int {
        return a + b + c;
    }
    params = {"a" : 5 , "b" : 10 , "c" : 15 };
    result = compute(**params);
    return result;
}


# Multiple dict spreads in call
def test_multiple_dict_spreads()  -> int {
    def process(x: int, y: int, z: int) -> int {
        return x * y + z;
    }
    part1 = {"x" : 2 , "y" : 3 };
    part2 = {"z" : 5 };
    return process(**part1, **part2);
}


# Rest in destructuring - basic
def test_rest_destructuring()  -> list {
    (first, *rest) = [1, 2, 3, 4, 5];
    return rest;
}


# Rest in the middle
def test_rest_middle()  -> list {
    (head, *middle, tail) = [10, 20, 30, 40, 50];
    return middle;
}


# Rest at beginning
def test_rest_beginning()  -> list {
    (*beginning, last) = [100, 200, 300];
    return beginning;
}


# Function with *args (rest parameters)
def test_rest_args( *args: tuple)  -> int {
    total = 0;
    for arg in args {
        total += arg;
    }
    return total;
}


# Function with **kwargs (rest keyword parameters)
def test_rest_kwargs( **kwargs: dict)  -> int {
    return len(kwargs);
}


# Function with both *args and **kwargs
def test_rest_both(
    a: int, *args: tuple, **kwargs: dict
) -> int {
    return a + len(args) + len(kwargs);
}


# Spread in function call with positional args
def test_spread_function_call()  -> int {
    def add_three(a: int, b: int, c: int) -> int {
        return a + b + c;
    }
    values = [5, 10, 15];
    return add_three(*values);
}


# Mixed spread and regular args
def test_spread_mixed_args()  -> list {
    def make_list( *items: tuple)  -> list {
        return list(items);
    }
    part = [2, 3, 4];
    result = make_list(1, *part, 5);
    return result;
}


# Nested list spread
def test_nested_list_spread()  -> list {
    inner1 = [1, 2];
    inner2 = [3, 4];
    outer = [*inner1, *inner2];
    more = [0, *outer, 5];
    return more;
}


# Spread with empty collections
def test_spread_empty()  -> list {
    empty = [];
    values = [1, 2, 3];
    result = [*empty, *values, *empty];
    return result;
}


# Rest with single element
def test_rest_single()  -> tuple {
    (first, *rest) = [42];
    return (first, rest);
}


# Rest with empty remainder
def test_rest_empty()  -> list {
    (a, b, *rest) = [1, 2];
    return rest;
}


# Complex spread scenario
def test_complex_spread()  -> dict {
    base = {"name" : "test" , "value" : 10 };
    extra = {"count" : 5 };
    overrided = {"value" : 20 };
    result = {** base , ** extra , ** overrided , "new" : 30 };
    return result;
}
