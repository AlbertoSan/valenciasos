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
    hmr: {
      host: '0.0.0.0',
      port: 5001,
      protocol: 'ws'
    }
  }
})