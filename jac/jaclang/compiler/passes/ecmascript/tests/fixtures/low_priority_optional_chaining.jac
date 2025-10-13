"""Low Priority: Optional chaining and other advanced features (ChainExpression tests)."""

# Note: Jac may not have native optional chaining (?.)
# These tests show where it would be useful and simulate the behavior
 # Safe property access
 def test_safe_property_access()  -> int {
    myobj = {"name" : "test" , "value" : 42 };
    # Instead of: myobj?.value
     # Use conditional check:
     if myobj is not None and "value" in myobj {
        return myobj["value"];
    }
    return 0;
}


# Nested safe access
def test_nested_safe_access()  -> str {
    data = {"user" : {"profile" : {"name" : "Alice" } } };
    # Instead of: data?.user?.profile?.name
     if data is not None and "user" in data {
        if data["user"] is not None and "profile" in data["user"] {
            if data["user"]["profile"] is not None {
                return data["user"]["profile"]["name"];
            }
        }
    }
    return "unknown";
}


# Safe method call
def test_safe_method_call()  -> int {
    text = "hello";
    # Instead of: text?.upper?.()
     if text is not None {
        if hasattr(text, 'upper') {
            result = text.upper();
            return len(result);
        }
    }
    return 0;
}


# Optional chaining with None
def test_optional_with_none()  -> int {
    value = None;
    # Instead of: value?.property
     if value is not None {
        return value.property;
    }
    return -1;
}


# Array safe access
def test_array_safe_access()  -> int {
    arr = [1, 2, 3];
    index = 5;
    # Instead of: arr?.[index]
     if arr is not None and index < len(arr) {
        return arr[index];
    }
    return 0;
}


# Function safe call
def get_processor() {
    def process(x: int) -> int {
        return x * 2;
    }
    return process;
}


def test_function_safe_call()  -> int {
    processor = get_processor();
    # Instead of: processor?.(5)
     if processor is not None {
        return processor(5);
    }
    return 0;
}


# Complex optional chain
def test_complex_optional_chain()  -> int {
    data = {"items" : [{"id" : 1 , "value" : 10 }, {"id" : 2 , "value" : 20 }] };
    # Instead of: data?.items?.[0]?.value
     if data is not None and "items" in data {
        items = data["items"];
        if items is not None and len(items) > 0 {
            first = items[0];
            if first is not None and "value" in first {
                return first["value"];
            }
        }
    }
    return 0;
}


# Optional with default value
def test_optional_with_default()  -> str {
    config = {"name" : "app" };
    # Instead of: config?.theme ?? "default"
    result = "default";
    if config is not None and "theme" in config {
        result = config["theme"];
    }
    return result;
}


# Multiple optional accesses
def test_multiple_optional()  -> dict {
    obj1 = {"a" : 1 };
    obj2 = None;
    results = {};
    # obj1?.a
     if obj1 is not None and "a" in obj1 {
        results["first"] = obj1["a"];
    }
    # obj2?.b
     if obj2 is not None and "b" in obj2 {
        results["second"] = obj2["b"];
    }
    return results;
}


# Optional in loop
def test_optional_in_loop()  -> list {
    items = [{"value" : 10 }, None, {"value" : 20 }, {}];
    results = [];
    for item in items {
        # item?.value
         if item is not None and "value" in item {
            results.append(item["value"]);
        }
    }
    return results;
}


# Nullish coalescing operator simulation
def test_nullish_coalescing()  -> int {
    value1 = None;
    value2 = 0;
    value3 = 42;
    # value1 ?? value2 ?? value3
    result = (
        value1 if value1 is not None else (value2 if value2 is not None else value3)
    );
    return (result if result is not None else 0);
}


# Optional chaining in assignment
def test_optional_assignment()  -> dict {
    source = {"data" : {"count" : 5 } };
    target = {};
    # target.count = source?.data?.count
     if source is not None and "data" in source {
        if source["data"] is not None and "count" in source["data"] {
            target["count"] = source["data"]["count"];
        }
    }
    return target;
}


# Safe navigation with functions
def get_data()  -> dict {
    return {"value" : 100 };
}


def test_safe_navigation_function()  -> int {
    # get_data()?.value
    result = get_data();
    if result is not None and "value" in result {
        return result["value"];
    }
    return 0;
}


# Optional chaining with array methods
def test_optional_array_methods()  -> int {
    arr = [1, 2, 3, 4, 5];
    # arr?.filter(...)?.length
     if arr is not None {
        filtered = [
            x
            for x in arr
            if x > 2
        ];
        if filtered is not None {
            return len(filtered);
        }
    }
    return 0;
}


# Nested optional with computation
def test_nested_optional_computation()  -> int {
    myobj = {"compute" : {"factor" : 3 } };
    # myobj?.compute?.factor * 2
    result = 1;
    if myobj is not None and "compute" in myobj {
        compute = myobj["compute"];
        if compute is not None and "factor" in compute {
            result = compute["factor"] * 2;
        }
    }
    return result;
}
