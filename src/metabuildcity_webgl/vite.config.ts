import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const gzipHeaderPlugin = (): Plugin => ({
  name: 'custom-gzip-headers',
  configureServer(server) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url?.endsWith('.data.gz')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/octet-stream');
      } else if (req.url?.endsWith('.wasm.gz')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/wasm');
      } else if (req.url?.endsWith('.framework.js.gz')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/javascript');
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), gzipHeaderPlugin()],
  server: {
    port: 5173,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
