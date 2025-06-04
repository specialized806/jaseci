node MyNode {
    has val:int;
}

edge MyEdge  {
    has value:int;
}

async def fun{
    print("Async function");
}

walker MyWalker {
    has name:str;

    can do_print with MyNode entry {
        print("I am here man", here);
        visit [-->];
        # await fun();
    }
}

with entry {
    root ++> (node1:= MyNode(5));
    node1 +>:MyEdge(100):+> [MyNode(i) for i in range(1,10,5)];
    walker1 = MyWalker("Mylife");
    walker1 spawn node1;
}