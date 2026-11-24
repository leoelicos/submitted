import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    // PGlite ships its own WASM + data bundle; let Node load it as-is.
    exclude: ['@electric-sql/pglite'],
  },
  ssr: {
    external: ['@electric-sql/pglite', 'pg'],
  },
});
