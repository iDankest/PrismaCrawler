import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 2545,      // El puerto que tú quieres
    strictPort: true // Si el 2545 está ocupado, da error en lugar de abrir otro
  }
})
