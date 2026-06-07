import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  esbuild: {
    drop: ['console', 'debugger'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Allows connections from outside the container
    port: 5173, // Port we are forwarding
    watch: {
      usePolling: true, // Enables polling mode so Hot Reload works in Docker
    },
    proxy: {
      "/api": {
        target: "http://backend:5001",
        changeOrigin: true,
      },
    },
  }
})
