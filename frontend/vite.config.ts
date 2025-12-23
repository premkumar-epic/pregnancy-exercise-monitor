import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for mobile access
    port: 5173,
    strictPort: false,
    open: false,
    allowedHosts: [
      'localhost',
      '.ngrok-free.dev', // Allow all ngrok domains
      '.ngrok.io',
    ],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'mediapipe': ['@mediapipe/tasks-vision'],
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor': ['react', 'react-dom', 'axios'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@mediapipe/tasks-vision']
  }
})
