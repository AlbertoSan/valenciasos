import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5001,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
