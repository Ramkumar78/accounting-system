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
      },
      // '/login' removed so it is handled by React Router
      '/logout': 'http://localhost:8080',
      '/users': 'http://localhost:8080'
    }
  }
})
