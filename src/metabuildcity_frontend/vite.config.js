import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from 'path';

// Cargar el .env correctamente
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: true, // Agrega mapas de fuente para depuración
    assetsDir: "webgl/Build", // Asegura que reconozca los archivos en public/webgl/
  },
  server: {
    host: "0.0.0.0",  // Permite acceso en redes locales
    port: 5173, // Puerto por defecto de Vite
    strictPort: true, // Evita cambiar el puerto si está ocupado
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        secure: false, // Si el backend usa HTTPS local, evita errores
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: {
      "declarations": fileURLToPath(new URL("../declarations", import.meta.url)),
    },
    dedupe: ["@dfinity/agent"], // Evita duplicación de dependencias
  },
});
