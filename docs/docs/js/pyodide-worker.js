let pyodide = null;

// Functions to load Pyodide and its jaclang
async function readFileAsBytes(fileName) {
  const response = await fetch(fileName);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

async function loadPythonResources(pyodide) {
  try {
    const data = await readFileAsBytes("../playground/jaclang.zip");
    await pyodide.FS.writeFile("/jaclang.zip", data);
    await pyodide.runPythonAsync(`
import zipfile
import os

try:
    with zipfile.ZipFile("/jaclang.zip", "r") as zip_ref:
        zip_ref.extractall("/jaclang")
    os.sys.path.append("/jaclang")
    print("JacLang files loaded!")
except Exception as e:
    print("Failed to extract JacLang files:", e)
    raise
`);
  } catch (err) {
    console.error("Error loading Python resources:", err);
    throw err;
  }
}

// Worker code
self.onmessage = async (event) => {
    const { type, code, value } = event.data;

    if (type === "init") {
        importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js");
        pyodide = await loadPyodide();
        await loadPythonResources(pyodide);
        await pyodide.runPythonAsync(`
from jaclang.cli.cli import run
from js import postMessage
import time
import builtins

def pyodide_input(prompt=""):
    prompt_str = str(prompt)

    import json
    message = json.dumps({"type": "input_request", "prompt": prompt_str})
    postMessage(message)

    while not hasattr(builtins, "input_value"):
        time.sleep(0.05)
    val = builtins.input_value
    del builtins.input_value
    return val

builtins.input = pyodide_input
        `);
        self.postMessage({ type: "ready" });
        return;
    }
    if (type === "input_response") {
    console.log("Input received:", value);
    pyodide.runPython(`import builtins; builtins.input_value = ${JSON.stringify(value)}`);
    return;
}


    if (!pyodide) {
        return;
    }

    try {
        const jacCode = JSON.stringify(code);
        const output = await pyodide.runPythonAsync(`
from jaclang.cli.cli import run
import sys
from io import StringIO

captured_output = StringIO()
sys.stdout = captured_output
sys.stderr = captured_output

jac_code = ${jacCode}
with open("/tmp/temp.jac", "w") as f:
    f.write(jac_code)
run("/tmp/temp.jac")

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
captured_output.getvalue()
        `);
        self.postMessage({ type: "result", output });
    } catch (error) {
        self.postMessage({ type: "error", error: error.toString() });
    }
};
