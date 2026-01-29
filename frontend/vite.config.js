import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Minification helps reduce file size for faster First Contentful Paint
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true, // Removes console.logs for production (cleans up main thread)
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // 2. Manual Chunking: This is the "Magic" for performance.
        // It splits big libraries into separate files so the browser can 
        // download them in parallel and cache them separately.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split Recharts into its own chunk
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Split Lucide Icons into its own chunk
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Standard React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
            return 'vendor-others';
          }
        },
      },
    },
    // 3. Increases the warning limit, but helps optimize for large chart libraries
    chunkSizeWarningLimit: 1000,
  },
})