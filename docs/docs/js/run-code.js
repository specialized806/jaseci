let pyodideWorker = null;
let pyodideReady = false;
let pyodideInitPromise = null;
let monacoLoaded = false;
let monacoLoadPromise = null;
let sab = null;
let sharedInts = null;
const initializedBlocks = new WeakSet();

// Initialize Pyodide Worker
function initPyodideWorker() {
    if (pyodideWorker) return pyodideInitPromise;
    if (pyodideInitPromise) return pyodideInitPromise;
    
    const DATA_CAP = 4096;
    sab = new SharedArrayBuffer(8 + DATA_CAP);
    ctrl = new Int32Array(sab, 0, 2);
    dataBytes = new Uint8Array(sab, 8); 

    pyodideWorker = new Worker("/js/pyodide-worker.js");
    pyodideInitPromise = new Promise((resolve, reject) => {
        pyodideWorker.onmessage = (event) => {
            if (event.data.type === "ready") {
                pyodideReady = true;
                resolve();
            }
        };
        pyodideWorker.onerror = (e) => reject(e);
    });
    pyodideWorker.postMessage({ type: "init", sab });
    return pyodideInitPromise;
}

// Run Jac Code in Worker
function runJacCodeInWorker(code) {
    return new Promise(async (resolve, reject) => {
        await initPyodideWorker();
        const handleMessage = async (event) => {
            let message;
            if (typeof event.data === "string") {
                message = JSON.parse(event.data);
            } else {
                message = event.data;
            }

            if (message.type === "streaming_output") {
                // Handle real-time output streaming
                const event = new CustomEvent('jacOutputUpdate', { 
                    detail: { output: message.output, stream: message.stream } 
                });
                document.dispatchEvent(event);
            } else if (message.type === "execution_complete") {
                pyodideWorker.removeEventListener("message", handleMessage);
                resolve("");
            } else if (message.type === "input_request") {
                console.log("Input requested");
                const s = prompt(message.prompt || "Enter input:") ?? "";
                
                const enc = new TextEncoder();
                const bytes = enc.encode(s);
                const n = Math.min(bytes.length, dataBytes.length);
                dataBytes.set(bytes.subarray(0, n), 0);

                Atomics.store(ctrl, 1, n);
                Atomics.store(ctrl, 0, 1);
                Atomics.notify(ctrl, 0, 1);

            } else if (message.type === "error") {
                pyodideWorker.removeEventListener("message", handleMessage);
                reject(message.error);
            }
        };
        pyodideWorker.addEventListener("message", handleMessage);
        pyodideWorker.postMessage({ type: "run", code });
    });
}

// Load Monaco Editor Globally
function loadMonacoEditor() {
    if (monacoLoaded) return monacoLoadPromise;
    if (monacoLoadPromise) return monacoLoadPromise;

    monacoLoadPromise = new Promise((resolve, reject) => {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            monacoLoaded = true;
            monaco.languages.register({ id: 'jac' });
            monaco.languages.setMonarchTokensProvider('jac', window.jaclangMonarchSyntax);

            fetch('/../playground/language-configuration.json')
                .then(resp => resp.json())
                .then(config => monaco.languages.setLanguageConfiguration('jac', config));
            monaco.editor.defineTheme('jac-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: window.jacThemeRules,
                colors: window.jacThemeColors
            });
            monaco.editor.setTheme('jac-theme');
            resolve();
        }, reject);
    });
    console.log("Loading Monaco Editor...");
    return monacoLoadPromise;
}

// Setup Code Block with Monaco Editor
async function setupCodeBlock(div) {
    if (div._monacoInitialized) return;

    div._monacoInitialized = true;
    const originalCode = div.textContent.trim();

    div.innerHTML = `
        <div class="jac-code-loading" style="padding: 10px; font-style: italic; color: gray;">
            Loading editor...
        </div>
    `;

    await loadMonacoEditor();

    div.innerHTML = `
    <div class="jac-code" style="border: 1px solid #ccc;"></div>
    <button class="md-button md-button--primary run-code-btn">Run</button>
    <pre class="code-output" style="display:none; white-space: pre-wrap; background: #1e1e1e; color: #d4d4d4; padding: 10px;"></pre>
    `;

    const container = div.querySelector(".jac-code");
    const runButton = div.querySelector(".run-code-btn");
    const outputBlock = div.querySelector(".code-output");

    const editor = monaco.editor.create(container, {
        value: originalCode || '# Write your Jac code here',
        language: 'jac',
        theme: 'jac-theme',
        scrollBeyondLastLine: false,
        scrollbar: {
            vertical: 'hidden',
            handleMouseWheel: false,
        },
        minimap: {
            enabled: false
        },
        automaticLayout: true,
        padding: {
            top: 10,
            bottom: 10
        }
    });

    // Update editor height based on content
    function updateEditorHeight() {
        const lineCount = editor.getModel().getLineCount();
        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        const height = lineCount * lineHeight + 20;
        container.style.height = `${height}px`;
        editor.layout();
    }
    updateEditorHeight();
    editor.onDidChangeModelContent(updateEditorHeight);

    runButton.addEventListener("click", async () => {
        outputBlock.style.display = "block";
        outputBlock.textContent = ""; // Clear previous output

        if (!pyodideReady) {
            outputBlock.textContent = "Loading Jac runner...";
            await initPyodideWorker();
            outputBlock.textContent = ""; // Clear loading message
        }

        // Listen for streaming output updates
        const outputHandler = (event) => {
            const { output, stream } = event.detail;
            outputBlock.textContent += output;
            outputBlock.scrollTop = outputBlock.scrollHeight; // Auto-scroll to bottom
        };
        
        document.addEventListener('jacOutputUpdate', outputHandler);

        try {
            const codeToRun = editor.getValue();
            await runJacCodeInWorker(codeToRun);
        } catch (error) {
            outputBlock.textContent += `\nError: ${error}`;
        } finally {
            document.removeEventListener('jacOutputUpdate', outputHandler);
        }
    });
}

// Lazy load code blocks using Intersection Observer
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const div = entry.target;
            if (!initializedBlocks.has(div)) {
                setupCodeBlock(div);
                initializedBlocks.add(div);
                lazyObserver.unobserve(div);
            }
        }
    });
}, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
});

// Observe all uninitialized code blocks
function observeUninitializedCodeBlocks() {
    document.querySelectorAll('.code-block').forEach((block) => {
        if (!initializedBlocks.has(block)) {
            lazyObserver.observe(block);
        }
    });
}

const domObserver = new MutationObserver(() => {
    observeUninitializedCodeBlocks();
});

domObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    observeUninitializedCodeBlocks();
    initPyodideWorker();
});

// Add nav link mutation observer for playground links
document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver(() => {
        const links = document.querySelectorAll("nav a[href='/playground/']");
        links.forEach(link => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
