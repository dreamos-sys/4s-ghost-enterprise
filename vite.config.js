import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // KUNCI UTAMA PENYEMBUH BLANK SCREEN:
  // Mengubah relative path ('./') menjadi absolute path ('/') untuk pemanggilan aset (JS/CSS)
  base: '/', 
  
  plugins: [react()],
  
  build: {
    sourcemap: true, // Mempertahankan kemampuan debugging di Vercel
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand', 'lucide-react'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
