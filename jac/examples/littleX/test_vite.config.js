import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: './static/client/js',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './test_entry.js'),
      },
      output: {
        entryFileNames: 'client.[hash].js',
        format: 'iife',
        name: 'JacClient',
      },
    },
    minify: false, // Configurable minification
  },
});
