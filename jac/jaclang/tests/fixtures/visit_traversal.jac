node MyNode{
    has val:int;

    can do with MyWalker entry {
        print( visitor,"from node", self);
    }
}

edge MyEdge {
    has path:int;

    can do with MyWalker entry {
        print(visitor,"from edge",self);
    }
}

walker MyWalker {
    can does with MyNode entry {
        visit :0:[-->];
    }
}

with entry {
    n0 = MyNode(0);
    n1 = MyNode(10);
    n2 = MyNode(20);
    n3 = MyNode(30);
    n4 = MyNode(40);
    n5 = MyNode(50);
    n6 = MyNode(60);
    root ++> n0 ++> n1;
    n1 ++> n2;
    n1 ++> n3;
    n1 ++> n4;
    n2 ++> n5;
    n2 ++> n6;
    MyWalker() spawn n0;
}