import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
  define: {
    'import.meta.env.VITE_GSC_VERIFICATION': JSON.stringify(process.env.VITE_GSC_VERIFICATION || ''),
    'import.meta.env.VITE_BING_VERIFICATION': JSON.stringify(process.env.VITE_BING_VERIFICATION || ''),
  },
})
