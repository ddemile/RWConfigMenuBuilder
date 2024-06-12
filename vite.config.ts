import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/remix-menu-editor",
  build: {
    chunkSizeWarningLimit: 1000
  }
})
