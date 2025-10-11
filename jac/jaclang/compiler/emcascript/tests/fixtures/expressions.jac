"""Expression test."""

def test_arithmetic() {
    a = 10 + 5;
    b = 20 - 3;
    c = 4 * 6;
    d = 15 / 3;
    e = 17 % 5;
}

def test_comparison() {
    result1 = 5 < 10;
    result2 = 15 > 10;
    result3 = 5 <= 5;
    result4 = 10 >= 5;
    result5 = 5 == 5;
    result6 = 5 != 10;
}

def test_logical() {
    result1 = True and False;
    result2 = True or False;
    result3 = not True;
}
