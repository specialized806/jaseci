import * as JacRuntime from "@client_runtime.js";
function Post() {
  return __jacJsx("div", {}, [__jacJsx("h1", {}, ["Post"])]);
}

            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['Post'];
            const globalFunctionMap = {
    "Post": Post
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        
JacRuntime.__jacRegisterClientModule("post", ["Post"], {});
export { Post };
