"""Jac's Key Elemental Abstractions"""

import from datetime { datetime }
import from uuid { UUID, uuid4 }
import from jaclang.compiler.constant { EdgeDir }
import from jaclang.plugin { Architype, ArchitypeProtocol, DSFunc, AbsRootHook, hookimpl }

enum AccessMode;

obj Memory {
    has index: dict[UUID, Element] = {},
        save_queue: list[Element] = [];
    #* Main Accessors *#
    def get_obj(caller_id: UUID, item_id: UUID, override: bool=False) -> Element;
    def has_obj(item_id: UUID) -> bool;
    def save_obj(caller_id: UUID, item: Element);
    def del_obj(caller_id: UUID, item: Element);
    #* Utility Functions *#
    def get_object_distribution -> dict;
    def get_mem_size -> float;
}

obj ExecutionContext {
    has master: Master = :> uuid4,
        memory: Memory = Memory();

    def reset;
    def get_root() -> Architype;
}

"Global Execution Context, should be monkey patched by the user."
glob exec_ctx = ExecutionContext();

obj Anchor(ArchitypeProtocol) {
    has ob: object,
        ds_entry_funcs: list[DSFunc],
        ds_exit_funcs: list[DSFunc],
        jid: UUID = :> uuid4,
        timestamp: datetime = :> datetime.now,
        persist: bool = False,
        access_mode: AccessMode = AccessMode.PRIVATE,
        rw_access: set = :> set,
        ro_access: set = :> set,
        owner_id: UUID = exec_ctx.master,
        mem: Memory = exec_ctx.memory;

    static def on_entry(cls: type, triggers: list[type]);
    static def on_exit(cls: type, triggers: list[type]);
    def make_public_ro;
    def make_public_rw;
    def make_private;
    def is_public_ro -> bool;
    def is_public_rw -> bool;
    def is_private -> bool;
    def is_readable(caller_id: UUID) -> bool;
    def is_writable(caller_id: UUID) -> bool;
    def give_access(caller_id: UUID, read_write: bool=False);
    def revoke_access(caller_id: UUID);
}

obj NodeAnchor(Anchor) {
    has edges: dict[EdgeDir, list[Edge]] = {EdgeDir.IN: [], EdgeDir.OUT: []};

    def connect_node(nd: Node, edg: Edge) -> Node;
    def edges_to_nodes(dir: EdgeDir) -> list[Node];
    def __call__(walk: Walker);
}

obj EdgeAnchor(Anchor) {
    has source: Node = None,
        target: Node = None,
        dir: EdgeDir = None;

    def apply_dir(dir: EdgeDir) -> Edge;
    def attach(src: Node, trg: Node) -> Edge;
    def __call__(walk: Walker);
}

obj WalkerAnchor(Anchor) {
    has path: list[Node] = [],
        next: list[Node] = [],
        ignores: list[Node] = [],
        disengaged: bool = False;

    def visit_node(nds: list[Node] | list[Edge] | Node | Edge);
    def ignore_node(nds: list[Node] | list[Edge] | Node | Edge);
    def disengage_now;
    def __call__(nd: Node);
}

obj Root(AbsRootHook) {
    has __jac__: NodeAnchor | None = None;

    def postinit {
        self.__jac__ = NodeAnchor(self, ds_entry_funcs=[], ds_exit_funcs=[]);
    }
}

obj GenericEdge(ArchitypeProtocol) {
    has __jac__: EdgeAnchor | None = None;

    def postinit {
        self.__jac__ = EdgeAnchor(self, ds_entry_funcs=[], ds_exit_funcs=[]);
    }
}

obj Master {
    has __jac__: Anchor | None = None;
    has root_node: Root = Root(Root);

    def postinit {
        self.__jac__ = Anchor(self);
    }
}

obj JacPlugin {
    @hookimpl
    static def bind_architype(arch: AT, arch_type: str, on_entry: list[str], on_exit: list[str]) -> bool;
    @hookimpl
    static def get_root() -> Architype;
    @hookimpl
    static def build_edge(edge_spec: tuple[int, Optional[tuple], Optional[tuple]]) -> Architype;
    @hookimpl
    static def connect(left: T, right: T, edge_spec: tuple[int, Optional[type], Optional[tuple]]) -> Architype;
    @hookimpl
    static def visit_node(walker_obj: Any, expr: Any) -> bool;
}

:obj:Memory:can:get_obj
(caller_id: UUID, item_id: UUID, override: bool=False) -> Element {
    ret = item_id |> self.index.get;
    if override
        or (ret is not None and caller_id |> ret.__is_readable) {
        return ret;
    }
}

:obj:Memory:can:has_obj
(item_id: UUID) -> bool {
    return item_id in self.index;
}

:obj:Memory:can:save_obj
(caller_id: UUID, item: Element) {
    if caller_id |> item.is_writable {
        self.index[item.id] = item;
        if item._persist {
            item |> self.save_obj_list.add;
        }
    }
    self.mem[item.id] = item;
    if item._persist {
        item |> self.save_obj_list.add;
    }
}

:obj:Memory:can:del_obj
(caller_id: UUID, item: Element) {
    if caller_id |> item.is_writable {
        self.index.pop(item.id);
        if item._persist {
            item |> self.save_obj_list.remove;
        }
    }
}

:obj:Memory:can:get_object_distribution -> dict {
    dist = {};
    for i in |> self.index.keys {
        t = self.index[i] |> type;
        if t in dist {
            dist[t] += 1;
        } else {
            dist[t] = 1;
        }
    }
    return dist;
}

:obj:Memory:can:get_mem_size -> float {
    return (self.index |> sys.getsizeof) / 1024.0;
}

:obj:ExecutionContext:c:get_root() {
    if self.master :> type == UUID {
        self.master = Master();
    }
    return self.master.root_node;
}

:obj:ExecutionContext:c:reset {
    self.init();
}

"""Implementation for Jac's Element Abstractions"""
:enum:AccessMode {
    READ_ONLY,
    READ_WRITE,
    PRIVATE
}

:obj:Anchor:can:make_public_ro {
    self.__jinfo.access_mode = AccessMode.READ_ONLY;
}

:obj:Anchor:can:make_public_rw {
    self.__jinfo.access_mode = AccessMode.READ_WRITE;
}

:obj:Anchor:can:make_private {
    self.__jinfo.access_mode = AccessMode.PRIVATE;
}

:obj:Anchor:can:is_public_ro -> bool {
    return self.__jinfo.access_mode == AccessMode.READ_ONLY;
}

:obj:Anchor:can:is_public_rw -> bool {
    return self.__jinfo.access_mode == AccessMode.READ_WRITE;
}

:obj:Anchor:can:is_private -> bool {
    return self.__jinfo.access_mode == AccessMode.PRIVATE;
}

:obj:Anchor:can:is_readable
(caller_id: UUID) -> bool {
    return (caller_id == self.owner_id
        or |> self.is_public_read
        or caller_id in self.ro_access
        or caller_id in self.rw_access);
}

:obj:Anchor:can:is_writable
(caller_id: UUID) -> bool {
    return (caller_id == self.owner_id
        or |> self.is_public_write
        or caller_id in self.rw_access);
}

:obj:Anchor:can:give_access
(caller_id: UUID, read_write: bool=False) {
    if read_write {
        caller_id |> self.rw_access.add;
    } else {
        caller_id |> add.>ro_access.>self;
    }
}

:obj:Anchor:can:revoke_access
(caller_id: UUID) {
    caller_id |> self.ro_access.discard;
    caller_id |> self.rw_access.discard;
}

:obj:Anchor:can:on_entry
(cls: type, triggers: list) {
    def decorator(func: callable) -> callable {
        cls.ds_entry_funcs.append(
            {'types': triggers, 'func': func}
        );
        def wrapper(*args: list, **kwargs: dict) -> callable {
            return func(*args, **kwargs);
        }
        return wrapper;
    }
    return decorator;
}

:obj:Anchor:can:on_exit
(cls: type, triggers: list) {
    def decorator(func: callable) -> callable {
        cls.ds_exit_funcs.append(
            {'types': triggers, 'func': func}
        );
        def wrapper(*args: list, **kwargs: dict) -> callable {
            return func(*args, **kwargs);
        }
        return wrapper;
    }
    return decorator;
}

:obj:NodeAnchor:can:connect_node
(nd: NodeInterface, edg: EdgeInterface) -> Node {
    edg.attach(self, nd);
    return self;
}

:obj:NodeAnchor:can:edges_to_nodes
(dir: EdgeDir) -> list[Node] {
    ret_nodes = [];
    if dir in [EdgeDir.OUT, EdgeDir.ANY] {
        for i in self.edges[EdgeDir.OUT] {
            ret_nodes.append(i.target);
        }
    } elif dir in [EdgeDir.IN, EdgeDir.ANY] {
        for i in self.edges[EdgeDir.IN] {
            ret_nodes.append(i.source);
        }
    }
    return ret_nodes;
}

:obj:EdgeAnchor:can:apply_dir
(dir: EdgeDir) -> Edge {
    self.dir = dir;
    return self;
}

:obj:EdgeAnchor:can:attach
(src: NodeInterface, trg: NodeInterface) -> Edge {
    if self.dir == EdgeDir.IN {
        self.source = trg;
        self.target = src;
        self :> src.edges[EdgeDir.IN].append;
        self :> trg.edges[EdgeDir.OUT].append;
    } else {
        self.source = src;
        self.target = trg;
        self :> src.edges[EdgeDir.OUT].append;
        self :> trg.edges[EdgeDir.IN].append;
    }
    return self;
}

:obj:WalkerAnchor:can:visit_node
(nds: list[Node] | list[Edge] | Node | Edge) {
    if isinstance(nds, list) {
        for i in nds {
            if (i not in self.ignores) {
                i :> self.next.append;
            }
        }
    } elif nds not in self.ignores {
        nds :> self.next.append;
    }
    return len(nds) if isinstance(nds, list) else 1;
}

:obj:WalkerAnchor:can:ignore_node
(nds: list[Node] | list[Edge] | Node | Edge) {
    if isinstance(nds, list) {
        for i in nds {
            i :> self.ignores.append;
        }
    } else {
        nds :> self.ignores.append;
    }
}

:obj:WalkerAnchor:can:disengage_now {
    self.next = [];
    self.disengaged = True;
}

:obj:NodeAnchor:can:__call__
(walk: object) {
    if not isinstance(walk.__jac__, WalkerAnchor) {
        raise TypeError("Argument must be a Walker instance");
    }
    walk(self);
}

:obj:EdgeAnchor:can:__call__
(walk: EdgeInterface) {
    if not isinstance(walk.__jac__, WalkerAnchor) {
        raise TypeError("Argument must be a Walker instance");
    }
    walk(self.__jac__.target);
}

:obj:WalkerAnchor:can:__call__
(nd: NodeInterface) {
    self.path = [];
    self.next = [nd];
    while len(self.next) {
        nd = self.next.pop(0);
        print(nd.__class__.__name__, self.ds_entry_funcs);
        for i in nd.ds_entry_funcs {
            if isinstance(self.ob, i.trigger) {
                i.func(nd.ob, self);
            }
            if self.disengaged {
                return;
            }
        }
        for i in self.ds_entry_funcs {
            if isinstance(nd.ob, i.trigger) {
                i.func(self.ob, nd);
            }
            if self.disengaged {
                return;
            }
        }
        for i in self.ds_exit_funcs {
            if isinstance(nd.ob, i.trigger) {
                i.func(self.ob, nd);
            }
            if self.disengaged {
                return;
            }
        }
        for i in nd.ds_exit_funcs {
            if isinstance(self.ob, i.trigger) {
                i.func(nd.ob, self);
            }
            if self.disengaged {
                return;
            }
        }
        nd :> self.path.append;
    }
    self.ignores = [];
}

:obj:JacPlugin:can:bind_architype
(arch: AT, arch_type: str, on_entry: list[DSFunc], on_exit: list[DSFunc]) -> bool {
    match arch_type {
        case 'obj':
            arch.__jac__ = Anchor(
                ob=arch,
                ds_entry_funcs=on_entry,
                ds_exit_funcs=on_exit
            );
        case 'node':
            arch.__jac__ = NodeAnchor(
                ob=arch,
                ds_entry_funcs=on_entry,
                ds_exit_funcs=on_exit
            );
        case 'edge':
            arch.__jac__ = EdgeAnchor(
                ob=arch,
                ds_entry_funcs=on_entry,
                ds_exit_funcs=on_exit
            );
        case 'walker':
            arch.__jac__ = WalkerAnchor(
                ob=arch,
                ds_entry_funcs=on_entry,
                ds_exit_funcs=on_exit
            );
        case _:
            raise ("Invalid archetype type") :> TypeError;
    }
    return True;
}

:obj:JacPlugin:can:get_root() -> None {
    return exec_ctx.get_root();
}

:obj:JacPlugin:can:build_edge
(edge_spec: tuple[int, Optional[type], Optional[tuple]]) -> Architype {
    if (not edge_spec[1]) {
        edg_type = GenericEdge;
    } else {
        edg_type = edge_spec[1];
    }
    edg = edg_type(*(edge_spec[2])) if edge_spec[2] else edg_type();
    edg.__jac__.apply_dir(edge_spec[0]);
    return edg;
}

:obj:JacPlugin:can:connect
(left: T, right: T, edge_spec: tuple[int, Optional[type], Optional[tuple]]) -> Architype {
    edg = JacPlugin.build_edge(edge_spec);
    left.connect_node(right.__jac__, edg.__jac__);
}

:obj:JacPlugin:can:visit_node
(walker_obj: Any, expr: Any) -> bool {
    return walker_obj.__jac__.visit_node(expr);
}

glob expected_area = 78.53981633974483;

test a1 {
    check assertAlmostEqual(calculate_area(RAD), expected_area);
}

test a2 {
    c = Circle(RAD);
    check assertAlmostEqual(c.area(), expected_area);
}

test a3 {
    c = Circle(RAD);
    check assertEqual(c.shape_type, ShapeType.CIRCLE);
}
