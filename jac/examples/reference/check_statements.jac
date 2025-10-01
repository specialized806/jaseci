glob a = 5, b = 2;

test test1 {
    assert almostEqual(a, 6);
}

test test2 {
    assert a != b;
}

test test3 {
    assert "d" in "abc";
}

test test4 {
    assert a - b == 3;
}