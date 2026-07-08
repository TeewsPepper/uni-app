import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Asegura que los assets se generen correctamente
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
  },
});