import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        // ✅ FIXED: Do not rewrite the path
        // rewrite: (path) => path.replace(/^\/api/, '') <-- REMOVED
      }
    },
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          auth: ['@auth0/auth0-react'],
          icons: ['react-icons'],
          charts: ['react-apexcharts'],
          animations: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1600,
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // ✅ FIXED here too
        // rewrite: (path) => path.replace(/^\/api/, '') <-- REMOVED
      }
    }
  }
});
