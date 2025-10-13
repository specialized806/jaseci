"""Medium Priority: Update expressions (UpdateExpression tests - i++, i--)."""

# Post-increment (i++)
def test_post_increment() -> int {
    i = 5;
    result = i;
    i += 1;  # This would be i++ in the ideal case
    return result;  # Should return 5
}

# Post-decrement (i--)
def test_post_decrement() -> int {
    i = 5;
    result = i;
    i -= 1;  # This would be i-- in the ideal case
    return result;  # Should return 5
}

# Pre-increment (++i)
def test_pre_increment() -> int {
    i = 5;
    i += 1;  # This would be ++i in the ideal case
    return i;  # Should return 6
}

# Pre-decrement (--i)
def test_pre_decrement() -> int {
    i = 5;
    i -= 1;  # This would be --i in the ideal case
    return i;  # Should return 4
}

# Increment in loop
def test_increment_in_loop() -> int {
    sum = 0;
    i = 0;
    while i < 10 {
        sum += i;
        i += 1;  # Would be i++ in ideal case
    }
    return sum;
}

# Decrement in loop
def test_decrement_in_loop() -> int {
    sum = 0;
    i = 10;
    while i > 0 {
        sum += i;
        i -= 1;  # Would be i-- in ideal case
    }
    return sum;
}

# Multiple increments
def test_multiple_increments() -> int {
    a = 0;
    b = 0;
    c = 0;
    a += 1;  # a++
    b += 1;  # b++
    c += 1;  # c++
    return a + b + c;
}

# Increment with return
def test_increment_return() -> int {
    counter = 0;
    counter += 1;  # counter++
    return counter;
}

# Nested increment
def test_nested_increment() -> int {
    count = 0;
    for i in range(5) {
        count += 1;  # count++
    }
    return count;
}

# Decrement with comparison
def test_decrement_comparison() -> bool {
    i = 5;
    i -= 1;  # i--
    return i == 4;
}

# Array index with increment
def test_array_index_increment() -> list {
    arr = [0, 0, 0, 0, 0];
    idx = 0;
    while idx < len(arr) {
        arr[idx] = idx;
        idx += 1;  # idx++
    }
    return arr;
}

# Counter pattern
def test_counter_pattern() -> int {
    counter = 0;
    for i in range(10) {
        if i % 2 == 0 {
            counter += 1;  # counter++
        }
    }
    return counter;
}

# Increment in conditional
def test_increment_conditional() -> int {
    x = 0;
    if True {
        x += 1;  # x++
    }
    return x;
}

# Chained increments
def test_chained_increments() -> list {
    a = 0;
    b = 0;
    a += 1;  # a++
    b = a;
    b += 1;  # b++
    return [a, b];
}

# Increment in list comprehension context
def test_increment_comprehension() -> list {
    counters = [0, 0, 0];
    for i in range(len(counters)) {
        counters[i] += 1;  # counters[i]++
    }
    return counters;
}

# Note: True i++/i-- would return the value and then increment
# These tests show where UpdateExpression would be useful
# but current implementation uses augmented assignment (+=/-=)
