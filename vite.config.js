import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  base: '/',
  server: {
    open: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['react-leaflet', 'leaflet'],
  }
});