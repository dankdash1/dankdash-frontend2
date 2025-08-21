import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
    allowedHosts: 'all',
    hmr: {
      port: 5176,
      host: '0.0.0.0'
    },
    cors: true,
    strictPort: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'dankdash-frontend2-production.up.railway.app',
      '.railway.app',
      '.up.railway.app'
    ]
  }
})
