import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: 'renderer',
  build: {
    outDir: '../dist/renderer',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
      '@ui': path.resolve(__dirname, '../ui'),
      '@storage': path.resolve(__dirname, '../storage'),
      '@security': path.resolve(__dirname, '../security')
    }
  },
  server: {
    port: 5173
  }
});
