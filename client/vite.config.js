import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows connections from outside the container
    port: 5173, // Port we are forwarding
    watch: {
      usePolling: true, // Enables polling mode so Hot Reload works in Docker
    },
  }
})
