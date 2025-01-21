
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443
    }
  },
  plugins: [vue()]
})
