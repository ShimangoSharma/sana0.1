import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Artifact/preview build: one self-contained HTML file, no PWA/service worker
// (a strict CSP sandbox can't register SW or fetch external chunks).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    chunkSizeWarningLimit: 5000,
  },
})
