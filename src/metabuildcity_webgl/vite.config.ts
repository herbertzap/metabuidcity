import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
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
    }
  }
});
