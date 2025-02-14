import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'edb4-103-160-26-71.ngrok-free.app', // Add your ngrok host here
      '8400-103-160-26-71.ngrok-free.app',
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
