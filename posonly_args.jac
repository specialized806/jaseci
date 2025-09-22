def foo1(){
    print("foo1");
}

def foo2(a:int){
    print("foo2:", a);
}
def foo3(a:int,){
    print("foo2:", a);
}
with entry{
    foo1();
    foo2(2);
    foo3(3);
}


def foo2(a:int){
    print("foo2:", a);
}

with entry{

foo2(10);
}

def foo5(**kwargs:int){
    print("foo5:", kwargs);
}
with entry{
    foo5(a=2,c=90);
}
def foo6(a:int, **kwargs:int){
    print("foo6:", kwargs);
}
with entry{
    foo6(1, b=2,c=90);
}
def foo7(a:int, **kwargs:int){
    print("foo7:", kwargs);
}
with entry{
    foo7(a=1, b=2,c=90);
}


def foo44(a:int, /, b:int=90, *, c:int=90, **kwargs:int){
        print("foo44:", 'a:',a, 'b:',b, 'c:',c, kwargs);
}

with entry{
    foo44(1, b=2,c=96, d=100);
    foo44(1, 2,c=96, d=100);
    foo44(1, 2, d=100);
    foo44(1, 2);
}

# Test basic positional-only arguments
def simple_posonly(a: int, /,a1:int) -> int {
    return a;
}

with entry {
    print("Simple posonly:", simple_posonly(42,89));
}

# Test mixed positional-only and regular arguments
def mixed_params(x: int, /,c:int,*, y: int) -> int {
    return x + y;
}

with entry {
    print("Mixed params:", mixed_params(10, 20, y=30));
}

# Positional-only with default values
def posonly_with_defaults(a: int = 1, b: int = 2, /) -> int {
    return a + b;
}

with entry {
    print("Posonly with defaults (no args):", posonly_with_defaults());
    print("Posonly with defaults (one arg):", posonly_with_defaults(10));
    print("Posonly with defaults (two args):", posonly_with_defaults(10, 20));
}


# Test more advanced positional-only arguments
def test_posonly(a: int, b: str, /, c: float = 3.14) -> str {
    return f"a={a}, b={b}, c={c}";
}

def test_mixed(x: int, /, y: int, z: int = 10) -> int {
    return x + y + z;
}

with entry {
    print("Test 1:",test_posonly(1, "hello"));
    print("Test 2:", test_posonly(2, "world", 2.71));
    print("Test 3:", test_mixed(5, 15));
    print("Test 4:", test_mixed(5, 15, 25));
}

def simple_doubler(x: int) -> int {
    print(f"Doubling {x}");
    return x * 2;
}

def string_processor(s: str) -> str {
    print(f"Processing string: {s}");
    return s.upper();
}

def number_multiplier(num: int) -> int {
    print(f"Multiplying {num} by 3");
    return num * 3;
}

def text_formatter(text: str) -> str {
    print(f"Formatting text: {text}");
    return f"[FORMATTED] {text}";
}

def f(x: int, y: int, /,
      p: int, s: int=90, * ,z: int= 90, **kwargs:int){
        print(f"x={x}, y={y}, p={p}, s={s}, z={z}, kwargs={kwargs}");
        return x + y + p + s + z + sum(kwargs.values());
}

with entry{
    print(f(1,2,3,s=4,q=23,z=5,extra=100) ); # should work

    # Test simple functions instead of any complex expressions
    print("Testing simple functions:");
    print("Doubled value:", simple_doubler(21));
    print("Processed string:", string_processor("hello world"));
    print("Multiplied number:", number_multiplier(7));
    print("Formatted text:", text_formatter("sample text"));
}






# The most comprehensive function signature possible
def ultimate_signature(
    pos_only1: int,
    pos_only2: str = "default_pos",
    /,
    regular1: float= 3.14,
    regular2: bool = True,
    *args: any,
    kw_only1: dict,
    kw_only2: list = [],
    **kwargs: str
) -> dict {
    return {
        "positional_only": {"pos_only1": pos_only1,"pos_only2": pos_only2        },
        "regular": {"regular1": regular1,"regular2": regular2        },
        "varargs": { "args": list(args),"args_count": len(args)        },
        "keyword_only": {"kw_only1": kw_only1, "kw_only2": kw_only2     },
        "varkwargs": {"kwargs": kwargs,"kwargs_count": len(kwargs)   }
    };
}

# Another complex signature
def complex_business_logic(
    user_id: int,
    /,
    action: str,
    timestamp: float = 0.0,
    *additional_data: dict,
    required_permission: str,
    debug_mode: bool = False,
    **metadata: any
) -> dict {


    return {
        "user_id": user_id,
        "action": action,
        "timestamp": 0.0,
        "additional_data": list(additional_data),
        "required_permission": required_permission,
        "debug_mode": debug_mode,
        "metadata": metadata,
        "processed_at": 78
    };
}

# Edge case: Only separators
def only_separators(/, *, x: int) -> int {
    return x;
}

# Edge case: Empty varargs/kwargs
def empty_vars(*args: str, **kwargs: int) -> dict {
    return {"args": list(args), "kwargs": kwargs};
}

with entry {
    print("=== Comprehensive Signature Tests ===");

    # Test ultimate signature with minimal args
    print("Ultimate minimal:", ultimate_signature(
        1,                    # pos_only1
        regular1=3.14,       # regular1 (required)
        kw_only1={"key": "value"}  # kw_only1 (required)
    ));

    # Test ultimate signature with all parameters
    print("Ultimate full:", ultimate_signature(
        42,                   # pos_only1
        "custom_pos",        # pos_only2
        2.71,                # regular1
        False,               # regular2
        "extra1", "extra2",  # *args
        kw_only1={"data": "test"},  # kw_only1
        kw_only2=[1, 2, 3],        # kw_only2
        meta1="value1",            # **kwargs
        meta2="value2"
    ));

    # Test business logic function
    print("Business logic:", complex_business_logic(
        123,                         # user_id (pos-only)
        "login",                     # action
        1234567890.0,               # timestamp
        {"ip": "127.0.0.1"},        # *additional_data
        required_permission="read",  # keyword-only required
        debug_mode=True,            # keyword-only optional
        session_id="abc123",        # **metadata
        client="web"
    ));

    # Test edge cases
    print("Only separators:", only_separators(x=999));
    print("Empty vars (empty):", empty_vars());
    print("Empty vars (with data):", empty_vars("a", "b", x=1, y=2));
}



def ultimate_signature(
    pos_only1: int,
    pos_only2: str = "default_pos",
    /,
    regular1: float= 3.14,
    regular2: bool = True,
    *args: any,
    kw_only1: dict,
    kw_only2: list = [],
    **kwargs: str
) -> dict {
    return {
        "positional_only": {
            "pos_only1": pos_only1,
            "pos_only2": pos_only2
        },
        "regular": {
            "regular1": regular1,
            "regular2": regular2
        },
        "varargs": {
            "args": list(args),
            "args_count": len(args)
        },
        "keyword_only": {
            "kw_only1": kw_only1,
            "kw_only2": kw_only2
        },
        "varkwargs": {
            "kwargs": kwargs,
            "kwargs_count": len(kwargs)
        }
    };
}

with entry{

# Test ultimate signature with minimal args
    print("Ultimate minimal:", ultimate_signature(
        1,                    # pos_only1
        regular1=3.14,       # regular1 (required)
        kw_only1={"key": "value"},  # kw_only1 (required)
        ui = ['frontend'],
        power = 'high'
    ));

    # Test ultimate signature with all parameters
    print("Ultimate full:", ultimate_signature(
        42,                   # pos_only1
        "custom_pos",        # pos_only2
        2.71,                # regular1
        False,               # regular2
        "extra1", "extra2",  # *args
        kw_only1={"data": "test"},  # kw_only1
        kw_only2=[1, 2, 3],        # kw_only2
        meta1="value1",            # **kwargs
        meta2="value2",
        fb = 'social',
    ));
}


# Basic function signatures - no parameters
def no_params() -> str {
    return "no parameters";
}

# Single parameter functions
def single_int(x: int) -> int {
    return x * 2;
}

def single_str(name: str) -> str {
    return f"Hello {name}";
}

def single_float(value: float) -> float {
    return value + 1.0;
}

# Multiple parameters
def two_params(a: int, b: str) -> str {
    return f"{a}: {b}";
}

def three_params(x: int, y: float, z: str) -> str {
    return f"x={x}, y={y}, z={z}";
}

def many_params(a: int, b: str, c: float, d: bool, e: list) -> dict {
    return {"a": a, "b": b, "c": c, "d": d, "e": e};
}

with entry {
    print("=== Basic Signatures Tests ===");
    print(no_params());
    print(single_int(42));
    print(single_str("World"));
    print(single_float(3.14));
    print(two_params(1, "test"));
    print(three_params(1, 2.5, "hello"));
    print(many_params(10, "text", 3.14, True, [1, 2, 3]));
}


# Functions with default parameters
def single_default(x: int = 10) -> int {
    return x * 2;
}

def multiple_defaults(a: int = 1, b: str = "default", c: float = 0.0) -> str {
    return f"a={a}, b={b}, c={c}";
}

def mixed_required_default(req: str, opt: int = 100) -> str {
    return f"Required: {req}, Optional: {opt}";
}

def all_defaults(x: int = 1, y: str = "hello", z: bool = False) -> dict {
    return {"x": x, "y": y, "z": z};
}

# Complex default values
def complex_defaults(
    name: str = "Anonymous",
    items: list = [],
    config: dict = {"debug": False},
    multiplier: float = 1.5
) -> dict {
    return {
        "name": name,
        "item_count": len(items),
        "config": config,
        "result": len(name) * multiplier
    };
}

with entry {
    print("=== Default Parameters Tests ===");

    # Test with no arguments
    print("No args:", single_default());
    print("No args:", multiple_defaults());
    print("No args:", all_defaults());

    # Test with some arguments
    print("One arg:", single_default(20));
    print("One arg:", multiple_defaults(5));
    print("Two args:", multiple_defaults(5, "custom"));

    # Test mixed required/optional
    print("Required only:", mixed_required_default("test"));
    print("Both args:", mixed_required_default("test", 200));

    # Test complex defaults
    print("Complex defaults:", complex_defaults());
    print("With name:", complex_defaults("John"));
    print("With items:", complex_defaults("Jane", [1, 2, 3, 4]));
}


# Edge case: Function with only positional-only separator
def only_pos_sep(/) -> str {
    return "only separator";
}

# Edge case: Function with only keyword-only separator
def only_kw_sep(*, x: int) -> int {
    return x;
}

# Edge case: Both separators, no regular params
def both_seps_no_regular(a: int, /, *, b: str) -> str {
    return f"{a}: {b}";
}

# Edge case: Single parameter of each type
def one_of_each(
    pos: int,
    /,
    reg: str,
    *args: float,
    kw: bool,
    **kwargs: any
) -> dict {
    return {
        "pos": pos,
        "reg": reg,
        "args": list(args),
        "kw": kw,
        "kwargs": kwargs
    };
}

# Edge case: Multiple positional-only with complex defaults
def complex_pos_defaults(
    a: int,
    b: list = [1, 2, 3],
    c: dict = {"key": "value"},
    d: str = "default_string",
    /
) -> dict {
    return {"a": a, "b": b, "c": c, "d": d};
}

# Edge case: Many keyword-only parameters
def many_keyword_only(
    *,
    param1: int,
    param2: str = "default1",
    param3: float = 0.0,
    param4: bool = True,
    param5: list = [],
    param6: dict = {},
    param7: str = "default2"
) -> dict {
    return {
        "param1": param1,
        "param2": param2,
        "param3": param3,
        "param4": param4,
        "param5": param5,
        "param6": param6,
        "param7": param7
    };
}

# Edge case: Nested function with different signature
def outer_function(x: int) -> callable {
    def inner_function(y: str, /, z: float = 1.0, *, w: bool) -> dict {
        return {"outer_x": x, "inner_y": y, "inner_z": z, "inner_w": w};
    }
    return inner_function;
}

# Edge case: Function returning function with complex signature
def function_factory(operation: str) -> callable {
    if operation == "add" {
        def add_function(a: float, b: float, /) -> float {
            return a + b;
        }
        return add_function;
    } elif operation == "complex" {
        def complex_function(
            base: int,
            /,
            modifier: str = "none",
            *extras: any,
            required_flag: bool,
            **options: str
        ) -> dict {
            return {
                "base": base,
                "modifier": modifier,
                "extras": list(extras),
                "required_flag": required_flag,
                "options": options
            };
        }
        return complex_function;
    }
    def empty_function() -> None {
        print("Empty function called");
        return None;
    }
    return empty_function;
}

# Simple doubler function to replace lambda
def simple_doubler(x: any) -> any {
    print(f"Doubling value: {x}");
    return x * 2;
}

# Edge case: Recursive function with complex signature
def recursive_processor(
    data: list,
    /,
    depth: int = 0,
    *,
    max_depth: int = 10,
    process_func: callable = None,
    **context: any
) -> dict {
    if depth >= max_depth or not data {
        return {"depth": depth, "data": data, "context": context};
    }

    processed_data = [];
    for item in data {
        if isinstance(item, list) {
            result = recursive_processor(
                item,
                depth + 1,
                max_depth=max_depth,
                process_func=process_func,
                **context
            );
            processed_data.append(result);
        } else {
            if process_func {
                processed_data.append(process_func(item));
            } else {
                processed_data.append(item);
            }
        }
    }

    return {
        "depth": depth,
        "original_length": len(data),
        "processed_data": processed_data,
        "context": context
    };
}

with entry {
    print("=== Edge Cases Tests ===");

    # Test separator-only functions
    try {
        print("Only pos sep:", only_pos_sep());
    } except Exception as e {
        print(f"Error with only_pos_sep: {e}");
    }

    print("Only kw sep:", only_kw_sep(x=42));
    print("Both seps:", both_seps_no_regular(1, b="test"));

    # Test one of each type
    print("One of each:", one_of_each(
        1,                  # pos
        "regular",          # reg
        1.1, 2.2,          # *args
        kw=True,           # kw
        extra="data"       # **kwargs
    ));

    # Test complex defaults
    print("Complex pos defaults (min):", complex_pos_defaults(42));
    print("Complex pos defaults (partial):", complex_pos_defaults(42, [4, 5, 6]));
    print("Complex pos defaults (all):", complex_pos_defaults(42, [7, 8], {"new": "dict"}, "custom"));

    # Test many keyword-only
    print("Many kw-only (min):", many_keyword_only(param1=100));
    print("Many kw-only (some):", many_keyword_only(
        param1=200,
        param2="custom",
        param4=False,
        param6={"test": "data"}
    ));
    print("Many kw-only (all):", many_keyword_only(
        param1=300,
        param2="all_custom",
        param3=99.9,
        param4=False,
        param5=[10, 20, 30],
        param6={"all": "custom"},
        param7="final"
    ));

    # Test nested and factory functions
    inner_func = outer_function(999);
    print("Nested function result:", inner_func("nested_test", w=False));
    print("Nested with z:", inner_func("nested_test", 5.5, w=True));

    add_func = function_factory("add");
    print("Factory add function:", add_func(10.5, 20.3));

    complex_func = function_factory("complex");
    print("Factory complex function:", complex_func(
        42,
        "test_modifier",
        "extra1", "extra2",
        required_flag=True,
        option1="value1",
        option2="value2"
    ));

    # Test recursive function with simple doubler instead of lambda
    test_data = [1, [2, 3], [4, [5, 6]], 7];
    print("Recursive processor:", recursive_processor(
        test_data,
        max_depth=3,
        process_func=simple_doubler,
        context_var="test_context"
    ));
}


# Functions designed to test error handling and edge cases

# This should work - minimal valid signatures
def valid_minimal() -> str {
    return "valid";
}

def valid_single_param(x: int) -> int {
    return x;
}

# Test calling functions with wrong argument types/counts
def test_param_validation(required: int, optional: str = "default") -> dict {
    return {"required": required, "optional": optional};
}

with entry{
    print("=== Testing Valid Calls ===");

    # Valid calls
    print("Valid minimal:", valid_minimal());
    print("Valid single param:", valid_single_param(42));
    print("Valid param validation:", test_param_validation(10));
    print("Valid param validation (both):", test_param_validation(10, "custom"));
}





def test_positional_only_errors(a: int, b: str, /) -> str {
    return f"{a}: {b}";
}

def test_keyword_only_errors(*, x: int, y: str = "default") -> str {
    return f"{x}: {y}";
}

def foo909(**kwargs: int) {
    print("foo:", kwargs);
}

def test_mixed_errors(
    pos: int,
    /,
    reg: str,
    *args: float,
    kw: bool,
    **kwargs: any
) -> dict {
    return {
        "pos": pos,
        "reg": reg,
        "args": list(args),
        "kw": kw,
        "kwargs": kwargs
    };
}

# Function to test various calling patterns
def call_tester() -> None {
    print("Valid pos-only:", test_positional_only_errors(1, "test"));
    print("Valid kw-only:", test_keyword_only_errors(x=42));
    print("Valid kw-only (both):", test_keyword_only_errors(x=42, y="custom"));
    print("Valid kw-only (y only):", test_keyword_only_errors(y="custom", x=100));
    print("Valid kw-only (with args):", test_keyword_only_errors(x=7, y="with args"));

    print("Valid mixed:", test_mixed_errors(
        1,              # pos
        "regular",      # reg
        1.1, 2.2,      # *args
        kw=True,       # kw
        extra="data"   # **kwargs
    ));

    print("\n=== Testing Error Cases ===");


    # Too many positional arguments
    try {
        test_param_validation(1, "optional", "extra");
        print("ERROR: Should have failed - too many args");
    } except Exception as e {
        print(f"Caught expected error - too many args: {type(e).__name__}");
    }

    # Missing required argument
    try {
        test_param_validation();
        print("ERROR: Should have failed - missing required arg");
    } except Exception as e {
        print(f"Caught expected error - missing required: {type(e).__name__}");
    }

    test_param_validation("not_an_int");

    # Positional-only called with keywords
    try {
        test_positional_only_errors(a=1, b="test");
        print("ERROR: Should have failed - pos-only with keywords");
    } except Exception as e {
        print(f"Caught expected error - pos-only with keywords: {type(e).__name__}");
    }

    # Keyword-only called positionally
    try {
        test_keyword_only_errors(42, "test");
        print("ERROR: Should have failed - kw-only with positional");
    } except Exception as e {
        print(f"Caught expected error - kw-only with positional: {type(e).__name__}");
    }

    try {
        print("Valid kw-only (with args):", test_keyword_only_errors(7, y="with args"));
    } except Exception as e {
        print(f"Caught expected error - kw-only with positional: {type(e).__name__}");
    }

    # Missing required keyword-only argument
    try {
        test_keyword_only_errors(y="test");  # missing required x
        print("ERROR: Should have failed - missing required kw-only");
    } except Exception as e {
        print(f"Caught expected error - missing required kw-only: {type(e).__name__}");
    }

    # Test mixed function errors
    try {
        test_mixed_errors(1, "reg");  # missing required kw
        print("ERROR: Should have failed - missing kw in mixed");
    } except Exception as e {
        print(f"Caught expected error - missing kw in mixed: {type(e).__name__}");
    }

    try {
        test_mixed_errors(pos=1, reg="reg", kw=True);  # pos as keyword
        print("ERROR: Should have failed - pos-only as keyword");
    } except Exception as e {
        print(f"Caught expected error - pos-only as keyword: {type(e).__name__}");
    }
}


# Test very long parameter lists
def long_param_list(
    p1: int, p2: int, p3: int, p4: int, p5: int,
    p6: int = 6, p7: int = 7, p8: int = 8, p9: int = 9, p10: int = 10,
    /,
    r2: str = "r2", r3: str = "r3", r4: str = "r4", r5: str = "r5",
    *args: float,
    kw1: bool, kw2: bool = False, kw3: bool = True,
    kw4: str = "kw4", kw5: str = "kw5",
    **kwargs: any
) -> dict {
    return {
        "positional_only": [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10],
        "regular": [r1, r2, r3, r4, r5],
        "args": list(args),
        "keyword_only": [kw1, kw2, kw3, kw4, kw5],
        "kwargs": kwargs,
        "total_params": 10 + 5 + len(args) + 5 + len(kwargs)
    };
}

with entry {
    call_tester();

    print("\n=== Testing Long Parameter List ===");
    # Function signature reminder:
    # long_param_list(p1, p2, p3, p4, p5, p6=6, p7=7, p8=8, p9=9, p10=10, /,
    #                 r1, r2="r2", r3="r3", r4="r4", r5="r5", *args,
    #                 kw1, kw2=False, kw3=True, kw4="kw4", kw5="kw5", **kwargs)

    result = long_param_list(
        # Positional-only parameters (before /)
        1, 2, 3, 4, 5,              # p1-p5 (required)
        6, 7,                       # p6, p7 (optional, overriding defaults)
        # p8, p9, p10 use defaults (8, 9, 10)

        # Regular parameters (can be positional or keyword)
        "r1_value",                 # r1 (required)
        "r2_custom", "r3_custom",   # r2, r3 (overriding defaults)
        # r4, r5 use defaults ("r4", "r5")

        # Variable positional arguments (*args)
        10.1, 20.2, 30.3,          # These go into *args as floats

        # Keyword-only parameters (after *args)
        kw1=True,                   # kw1 (required keyword-only)
        kw2=True,                   # kw2 (overriding default False)
        # kw3 uses default (True)
        kw4="custom_kw4",           # kw4 (overriding default)
        # kw5 uses default ("kw5")

        # Variable keyword arguments (**kwargs)
        extra1="value1",            # These go into **kwargs
        extra2="value2",
        extra3=100
    );

    print("Long param result keys:", list(result.keys()));
    print("Total params:", result["total_params"]);
    print("Positional only:", result["positional_only"]);
    print("Regular:", result["regular"]);
    print("Args:", result["args"]);
    print("Keyword only:", result["keyword_only"]);
    print("Kwargs:", result["kwargs"]);

}


# Keyword-only parameters
def basic_kwonly(*, x: int) -> int {
    return x * 2;
}

def multi_kwonly(*, a: int, b: str, c: float) -> str {
    return f"a={a}, b={b}, c={c}";
}

def kwonly_with_defaults(*, x: int = 10, y: str = "default") -> str {
    return f"x={x}, y={y}";
}

def mixed_kwonly_defaults(*, req: str, opt: int = 100) -> str {
    return f"req={req}, opt={opt}";
}

# Regular parameters + keyword-only
def regular_plus_kwonly(normal: int, *, kw: str) -> str {
    return f"normal={normal}, kw={kw}";
}

def regular_defaults_plus_kwonly(
    normal: int = 5,
    *,
    kw_req: str,
    kw_opt: bool = True
) -> dict {
    return {"normal": normal, "kw_req": kw_req, "kw_opt": kw_opt};
}

# Complex combinations
def complex_kwonly_mix(
    pos: int,
    reg: str = "default",
    *,
    kw1: float,
    kw2: bool = False,
    kw3: list = []
) -> dict {
    return {
        "pos": pos,
        "reg": reg,
        "kw1": kw1,
        "kw2": kw2,
        "kw3": kw3
    };
}

with entry {
    print("=== Keyword-Only Parameters Tests ===");

    # Basic keyword-only
    print("Basic kwonly:", basic_kwonly(x=42));
    print("Multi kwonly:", multi_kwonly(a=1, b="test", c=3.14));

    # With defaults
    print("Kwonly defaults (none):", kwonly_with_defaults());
    print("Kwonly defaults (one):", kwonly_with_defaults(x=20));
    print("Kwonly defaults (both):", kwonly_with_defaults(x=20, y="custom"));

    # Mixed required/optional keyword-only
    print("Mixed kwonly:", mixed_kwonly_defaults(req="required"));
    print("Mixed kwonly (both):", mixed_kwonly_defaults(req="required", opt=200));

    # Regular + keyword-only
    print("Reg+kwonly:", regular_plus_kwonly(10, kw="keyword"));
    print("Reg def+kwonly:", regular_defaults_plus_kwonly(kw_req="test"));
    print("Reg def+kwonly (all):", regular_defaults_plus_kwonly(15, kw_req="test", kw_opt=False));

    # Complex combinations
    print("Complex mix:", complex_kwonly_mix(1, kw1=2.5));
    print("Complex mix (more):", complex_kwonly_mix(1, "custom", kw1=2.5, kw2=True, kw3=[1, 2, 3]));
}

# Test method signatures in objects
obj Calculator {
    has value: float = 0.0;

    # Simple method
    def get_value() -> float {
        return self.value;
    }

    # Method with parameters
    def add(amount: float) -> float {
        self.value += amount;
        return self.value;
    }

    # Method with defaults
    def multiply(factor: float = 2.0) -> float {
        self.value *= factor;
        return self.value;
    }

    # Method with positional-only
    def set_value(new_value: float, /) -> None {
        print("Setting value to", new_value);
        print('self.value before:', self.value);
        self.value = new_value;
    }

    # Method with keyword-only
    def complex_operation(*, operation: str, multiplier: float = 1.0) -> float {
        if operation == "square" {
            self.value = self.value * self.value * multiplier;
        } elif operation == "sqrt" {
            self.value = (self.value ** 0.5) * multiplier;
        }
        return self.value;
    }

    # Method with varargs
    def batch_add(*values: float) -> float {
        for val in values {
            self.value += val;
        }
        return self.value;
    }

    # Method with kwargs
    def configure(**settings: any) -> dict {
        return {
            "current_value": self.value,
            "settings": settings
        };
    }

    # Static method
    static def utility_function(x: int, y: int = 10) -> int {
        return x + y;
    }

    # Complex method signature
    def advanced_calc(
        base: float,
        /,
        operation: str = "add",
        *modifiers: float,
        precision: int = 2,
        **options: bool
    ) -> dict {
        result = self.value;

        if operation == "add" {
            result += base;
        } elif operation == "multiply" {
            result *= base;
        }

        for modifier in modifiers {
            result += modifier;
        }

        return {
            "result": round(result, precision),
            "base": base,
            "operation": operation,
            "modifiers": list(modifiers),
            "precision": precision,
            "options": options
        };
    }
}

# Test walker methods
walker FunctionTester {
    has test_count: int = 0;

    # Walker method with various signatures
    def test_simple() -> None {
        self.test_count += 1;
        print(f"Test {self.test_count}: Simple method");
    }

    def test_with_params(name: str, value: int = 0) -> str {
        self.test_count += 1;
        return f"Test {self.test_count}: {name} = {value}";
    }

    def test_comprehensive(
        required: str,
        /,
        optional: int = 10,
        *args: float,
        kw_required: bool,
        kw_optional: str = "default",
        **kwargs: any
    ) -> dict {
        self.test_count += 1;
        return {
            "test_number": self.test_count,
            "required": required,
            "optional": optional,
            "args": list(args),
            "kw_required": kw_required,
            "kw_optional": kw_optional,
            "kwargs": kwargs
        };
    }

    # Ability with parameters
    can process_data with entry {
        print(f"Processing with {self.test_count} tests completed");
    }
}

with entry {
    print("=== Method Signatures Tests ===");

    # Test object methods
    calc = Calculator();
    print("Initial value:", calc.get_value());
    print("After add:", calc.add(5.0));
    print("After multiply:", calc.multiply(3.0));

    calc.set_value(10.0);
    print("After set_value:", calc.get_value());

    print("Complex operation:", calc.complex_operation(operation="square", multiplier=0.5));

    calc.set_value(1.0);
    print("Batch add:", calc.batch_add(1.0, 2.0, 3.0, 4.0));

    print("Configure:", calc.configure(debug=True, precision=3, mode="advanced"));

    print("Static method:", Calculator.utility_function(5));
    print("Static with both args:", Calculator.utility_function(5, 15));

    calc.set_value(100.0);
    print("Advanced calc:", calc.advanced_calc(
        10.0,                    # base (pos-only)
        "multiply",              # operation
        1.0, 2.0, 3.0,          # *modifiers
        precision=3,             # keyword-only
        debug=True,              # **options
        verbose=False
    ));

    # Test walker methods
    tester = FunctionTester();
    tester.test_simple();
    print(tester.test_with_params("example"));
    print(tester.test_with_params("custom", 42));

    print("Comprehensive test:", tester.test_comprehensive(
        "test_data",             # required (pos-only)
        20,                      # optional
        1.1, 2.2, 3.3,          # *args
        kw_required=True,        # keyword-only required
        kw_optional="custom",    # keyword-only optional
        extra="data",            # **kwargs
        flag=False
    ));
}


# Basic positional-only parameters
def basic_posonly(x: int, /) -> int {
    return x * 2;
}

def two_posonly(a: int, b: str, /) -> str {
    return f"{a}: {b}";
}

def three_posonly(x: int, y: float, z: bool, /) -> dict {
    return {"x": x, "y": y, "z": z};
}

# Positional-only with defaults
def posonly_defaults(a: int = 1, /) -> int {
    return a * 10;
}

def posonly_mixed_defaults(x: int, y: str = "default", /) -> str {
    return f"x={x}, y={y}";
}

def all_posonly_defaults(a: int = 1, b: str = "hello", c: float = 3.14, /) -> str {
    return f"a={a}, b={b}, c={c}";
}

# Positional-only mixed with regular parameters
def posonly_plus_regular(pos: int, /, reg: str) -> str {
    return f"pos={pos}, reg={reg}";
}

def posonly_plus_regular_defaults(pos: int, /, reg: str = "default") -> str {
    return f"pos={pos}, reg={reg}";
}

def complex_posonly_mix(
    p1: int,
    p2: str,
    /,
    r1: float,
    r2: bool = True
) -> dict {
    return {"p1": p1, "p2": p2, "r1": r1, "r2": r2};
}

with entry {
    print("=== Positional-Only Parameters Tests ===");

    # Basic positional-only
    print("Basic posonly:", basic_posonly(42));
    print("Two posonly:", two_posonly(1, "test"));
    print("Three posonly:", three_posonly(10, 3.14, True));

    # With defaults
    print("Posonly default (no args):", posonly_defaults());
    print("Posonly default (with arg):", posonly_defaults(5));
    print("Mixed defaults (req only):", posonly_mixed_defaults(100));
    print("Mixed defaults (both):", posonly_mixed_defaults(100, "custom"));
    print("All defaults (none):", all_posonly_defaults());
    print("All defaults (one):", all_posonly_defaults(99));
    print("All defaults (two):", all_posonly_defaults(99, "world"));
    print("All defaults (all):", all_posonly_defaults(99, "world", 2.71));

    # Mixed with regular
    print("Pos+reg:", posonly_plus_regular(1, "normal"));
    print("Pos+reg (default):", posonly_plus_regular_defaults(2));
    print("Pos+reg (both):", posonly_plus_regular_defaults(2, "custom"));
    print("Complex mix:", complex_posonly_mix(1, "hello", 2.5));
    print("Complex mix (default):", complex_posonly_mix(1, "hello", 2.5, False));
}




def run_test_file(filename: str) -> None {
    print(f"\n{'='*60}");
    print(f"RUNNING TESTS FROM: {filename}");
    print(f"{'='*60}");
}

def print_separator() -> None {
    print(f"\n{'-'*40}");
}

def simple_math_function(x: int, y: int) -> int {
    print(f"Adding {x} + {y}");
    return x + y;
}

def greeting_function(name: str = "World") -> str {
    print(f"Creating greeting for {name}");
    return f"Hello, {name}!";
}

def list_processor(items: list) -> int {
    print(f"Processing list with {len(items)} items");
    return len(items);
}

def multiplication_function(a: int, b: int) -> int {
    print(f"Multiplying {a} * {b}");
    return a * b;
}

def string_length_function(text: str) -> int {
    print(f"Getting length of: {text}");
    return len(text);
}

def boolean_checker(value: any) -> bool {
    print(f"Checking if {value} is truthy");
    return bool(value);
}

with entry {
    # Test simple functions instead of any complex expressions
    print("\n=== Testing Simple Functions ===");
    print("Math result:", simple_math_function(10, 20));
    print("Greeting:", greeting_function("JAC"));
    print("List processing:", list_processor([1, 2, 3, 4, 5]));
    print("Multiplication:", multiplication_function(6, 7));
    print("String length:", string_length_function("Hello JAC"));
    print("Boolean check:", boolean_checker(42));
}


# Variable positional arguments (*args)
def simple_varargs(*args: int) -> int {
    return sum(args);
}

def varargs_with_regular(first: str, *args: int) -> str {
    total = sum(args);
    return f"{first}: {total}";
}

def varargs_with_defaults(prefix: str = "Result", *args: float) -> str {
    total = sum(args);
    return f"{prefix}: {total}";
}

# Variable keyword arguments (**kwargs)
def simple_kwargs(**kwargs: int) -> dict {
    return kwargs;
}

def kwargs_with_regular(name: str, **kwargs: any) -> dict {
    result = {"name": name};
    result.update(kwargs);
    return result;
}

def kwargs_with_defaults(prefix: str = "Data", **kwargs: str) -> str {
    items = [f"{k}={v}" for (k, v) in kwargs.items()];
    return f"{prefix}: {', '.join(items)}";
}

# Both *args and **kwargs
def args_and_kwargs(*args: int, **kwargs: str) -> dict {
    return {
        "args_sum": sum(args),
        "kwargs": kwargs,
        "total_params": len(args) + len(kwargs)
    };
}

def full_signature(
    regular: str,
    default: int = 10,
    *args: float,
    **kwargs: bool
) -> dict {
    return {
        "regular": regular,
        "default": default,
        "args": list(args),
        "args_sum": sum(args),
        "kwargs": kwargs,
        "kwargs_count": len(kwargs)
    };
}

# Complex combinations with keyword-only
def complex_varargs(
    pos: int,
    *args: str,
    kw_only: bool,
    **kwargs: float
) -> dict {
    return {
        "pos": pos,
        "args": list(args),
        "kw_only": kw_only,
        "kwargs": kwargs,
        "totals": {
            "args_count": len(args),
            "kwargs_sum": sum(kwargs.values())
        }
    };
}

with entry {
    print("=== Variable Arguments Tests ===");

    # *args tests
    print("Simple varargs (empty):", simple_varargs());
    print("Simple varargs (multiple):", simple_varargs(1, 2, 3, 4, 5));
    print("Varargs with regular:", varargs_with_regular("Sum", 10, 20, 30));
    print(varargs_with_defaults("Sum", 1.5, 2.5, 3.5));
    print(varargs_with_defaults());
    print("Varargs with defaults:", varargs_with_defaults("Total", 1.1, 2.2, 3.3));
    print("Varargs defaults (no prefix):", varargs_with_defaults(4.4, 5.5));

    # **kwargs tests
    print("Simple kwargs (empty):", simple_kwargs());
    print("Simple kwargs:", simple_kwargs(a=1, b=2, c=3));
    print("Kwargs with regular:", kwargs_with_regular("John", age=30, city="NYC"));
    print("Kwargs with defaults:", kwargs_with_defaults("Info", name="Jane", job="Dev"));
    print("Kwargs defaults (no prefix):", kwargs_with_defaults(color="red", size="large"));

    # Both *args and **kwargs
    print("Args and kwargs:", args_and_kwargs(1, 2, 3, name="test", active="true"));
    print("Full signature:", full_signature("test", 20, 1.1, 2.2, debug="true", verbose="false"));

    # Complex combinations
    print("Complex varargs:", complex_varargs(
        100,
        "arg1", "arg2",
        kw_only=True,
        score=95.5,
        rating=4.8
    ));
}
