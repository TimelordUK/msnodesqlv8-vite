import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev mode, Vite is used as middleware by Express
    // so this config is mainly for the build step
  },
  build: {
    outDir: 'dist',
  },
})
