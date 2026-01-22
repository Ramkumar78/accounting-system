import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Also proxy /login and /logout for auth to work if not under /api
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080'
    }
  }
})
