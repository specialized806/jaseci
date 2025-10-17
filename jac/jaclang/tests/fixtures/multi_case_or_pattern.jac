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
}