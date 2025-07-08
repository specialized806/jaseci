import M1;
# import M1PY;
# import M2 as m2alias;
# import M3, M4;
# import M5 as m5alias, M6 as m6alias;
# import from M7 {M7S1}
# import from M8 {M8S1 as m8s1alias, M8S2 as m8s2alias}
# include M9;
# glob a = 5, k = 9;
# glob aa = 9;
# with entry{
#     Y: int; 
#     Y = 0; 
#     # b.Person.ss = 9;  
#     n = 0; 
#     z = Y;
#     aa = 9;
# }  
# with entry {  
#     Y = 99;
    
# }
def ccc() { 
    # aa = 99; #Error:name 'aa' is assigned to before global declaration
    if (1) {
        # :global:aa; 
        # :global:bb;
        # aa = 88;
        # bb = 0;
        # p = 90;
        M1.k = 0; #TODO: AtomTrailer isn't supported
        # M1.Person.Inner= 9;
        # M1.Person.name= 9;
        # M1PY.Apple= M1.Person();
        # M1.M1func();
        # M1.M1func2();
    } 
    # aa = 99;
    # print(aa);
}
# with entry {
#     ccc();
#     print(aa);
# }