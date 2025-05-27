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
        if here.val == 20{
            visit :0:[-->];
        }
        elif here.val == 30 {
            visit :-1:[-->];
        }
        else {
            visit [-->];
        }
        
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
    n7 = MyNode(70);
    root ++> n0 ++> n1;
    n1 ++> n2;
    n1 ++> n3;
    n1 ++> n4;
    n2 ++> n5;
    n2 ++> n6;
    n3 ++> n7;
    MyWalker() spawn n0;
}