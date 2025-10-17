with entry{
    Num =2;
    match Num{
        case 2:
        case 10:
            print("Matched case for value: 2");
            print("Matched case for value: 10");
        case _:
            print("No match found for value: " + Num);
    }

    age = 25;
    match age {
        case x if x > 18:
        case x if x < 65:
            print("Adult");
        case x:
            print("Senior");
    }
}