
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: true,
        // 🚨 REMOVED: The 'lib' configuration is gone. 
        // Vite will now look for index.html as the entry.
        rollupOptions: {
            input: 'index.html', // Point Vite to the HTML shell
        }
    },
});
