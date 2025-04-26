import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('--- Loading vite.config.ts ---');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] Request proxied: ${req.method} ${req.url} -> ${options.target}${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Proxy] Error:', err);
          });
        }
      }
    }
  }
})
