import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: '0.0.0.0', // 允许从局域网访问
    port: 5173, // 可以保持默认或改为其他端口
  },
  plugins: [vue()]
})