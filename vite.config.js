import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Hapus manualChunks atau gunakan function jika diperlukan (saat ini dihapus untuk kompatibilitas)
  }
})
