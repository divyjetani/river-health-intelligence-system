import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['kellee-barest-sirena.ngrok-free.dev'], // Add this line
    // Proxy `/api` requests to the backend dev server running on port 8000
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        base: '/river-health-intelligence-system/', 
      }
    }
  },
})
