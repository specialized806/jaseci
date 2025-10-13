"""Control flow test."""

def fibonacci(n: int) -> int {
    if n <= 1 {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

def for_loop_test() {
    for i in range(10) {
        print(i);
    }
}

def while_loop_test() {
    x = 0;
    while x < 10 {
        x += 1;
    }
}
