import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false, // Explicitly disable source maps
    minify: 'esbuild',
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove all console logs and leftover debuggers
  },
});
