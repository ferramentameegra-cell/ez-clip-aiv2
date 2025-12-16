import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: './client',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './client/src') },
      { find: /^shared\/(.*)/, replacement: path.resolve(__dirname, './shared/$1') },
    ],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Permitir acesso de qualquer IP (incluindo localhost)
    open: true,
    strictPort: false,
  },
  optimizeDeps: {
    exclude: [],
  },
});

