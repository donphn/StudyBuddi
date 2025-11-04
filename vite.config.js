import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow access from other devices on network
    port: 3000,
    open: false,  // Don't auto-open browser
    strictPort: true,  // Fail if port 3000 is in use
    https: process.env.VITE_USE_HTTPS === 'true' ? {
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key'))
    } : false
  }
})
