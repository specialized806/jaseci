import * as JacRuntime from "@client_runtime.js";
import { Post } from "./post";
function Feed() {
  return __jacJsx("div", {}, [__jacJsx("h1", {}, ["Feed"]), __jacJsx(Post, {}, [])]);
}

            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['Feed'];
            const globalFunctionMap = {
    "Feed": Feed
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        
JacRuntime.__jacRegisterClientModule("feed", ["Feed"], {});
export { Feed };
