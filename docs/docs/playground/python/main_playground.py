import io
import re
import json
import contextlib

from collections.abc import Iterable

# If these variables are not set by the pyodide this will raise an exception.
SAFE_CODE = globals()["SAFE_CODE"]
JAC_PATH  = globals()["JAC_PATH"]
CB_STDOUT = globals()["CB_STDOUT"]
CB_STDERR = globals()["CB_STDERR"]

debugger  = globals()["debugger"]

# Redirect stdout and stderr to javascript callback.
class JsIO(io.StringIO):
    def __init__(self, callback, *args, **kwargs):
        self.callback = callback
        super().__init__(*args, **kwargs)

    def write(self, s: str, /) -> int:
        self.callback(s)
        super().write(s)

    def writelines(self, lines, /) -> None:
        for line in lines:
            self.callback(line)
        super().writelines(lines)


with open(JAC_PATH, "w") as f:
    SAFE_CODE += "\n" + \
        """
        # <START PRINT GRAPH>
        with entry {
            final_graph = printgraph(format="json");
            print(final_graph);
        }
        # <END PRINT GRAPH>
        """
    f.write(SAFE_CODE)


import json

def deduplicate_graph_json(graph_json_str):
    graph = json.loads(graph_json_str)

    # Deduplicate nodes by 'id'
    seen_node_ids = set()
    unique_nodes = []
    for node in graph.get("nodes", []):
        if node["id"] not in seen_node_ids:
            seen_node_ids.add(node["id"])
            unique_nodes.append(node)
    graph["nodes"] = unique_nodes

    # Deduplicate edges by (from, to) tuple
    seen_edges = set()
    unique_edges = []
    for edge in graph.get("edges", []):
        edge_key = (edge["from"], edge["to"])
        if edge_key not in seen_edges:
            seen_edges.add(edge_key)
            unique_edges.append(edge)
    graph["edges"] = unique_edges

    return json.dumps(graph)


with contextlib.redirect_stdout(stdout_buf := JsIO(CB_STDOUT)), \
        contextlib.redirect_stderr(JsIO(CB_STDERR)):

    try:
        code = \
        "from jaclang.cli.cli import run\n" \
        f"run('{JAC_PATH}')\n"
        debugger.set_code(code=code, filepath=JAC_PATH)
        debugger.do_run()
        full_output = stdout_buf.getvalue()
        matches = re.findall(
            r'(\{[^{}]*"version"\s*:\s*"[^"]+",.*?"nodes"\s*:\s*\[.*?\],.*?"edges"\s*:\s*\[.*?\].*?\})',
            full_output,
            re.DOTALL,
        )
        graph_json = matches[-1] if matches else "{}"
        debugger.cb_graph(deduplicate_graph_json(graph_json))
        stdout_buf = re.sub(matches, full_output)

    except Exception:
        import traceback
        traceback.print_exc()
