walker Visitor {
    can travel with `root entry {
        ignore [-->][0] ;
        visit [-->] else {
            visit root;
        }
    }
}


node item {
    can speak with Visitor entry {
        print("Hey There!!!");
    }
}


with entry {
    for i = 0 to i < 5 by i += 1 { root ++> item(); }
    root spawn Visitor();
}
