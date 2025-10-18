with entry{
    Num =20;
    switch Num{
        case 2:
        case 3:
        case 10:
            print("Matched case for value: 2, 3, 10");
        case 15:
        case 20:
            print("Matched case for value: 15, 20");
        case 25:
        default:
            print("No match found for value: " + str(Num));
    }
}