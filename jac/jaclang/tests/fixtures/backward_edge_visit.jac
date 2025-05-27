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
        visit [edge <--];
    }
}

with entry {
    n0 = MyNode(0);
    e0 = MyEdge(0);
    n1 = MyNode(10);
    e1 = MyEdge(1);
    n2 = MyNode(20);
    e2 = MyEdge(2);
    n3 = MyNode(30);
    e3 = MyEdge(3);
    n4 = MyNode(40);
    e4 = MyEdge(4);
    root +>:e0:+> n0 <+:e1:<+ n1;
    n1 <+:e2:<+ n2;
    n1 <+:e3:<+ n3;
    n1 <+:e4:<+ n4;
    MyWalker() spawn n0;
}