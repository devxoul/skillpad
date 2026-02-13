import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(process.env.VITE_E2E
        ? {
            '@tauri-apps/plugin-http': path.resolve(__dirname, './e2e/shims/plugin-http.ts'),
            '@tauri-apps/plugin-shell': path.resolve(__dirname, './e2e/shims/plugin-shell.ts'),
            '@tauri-apps/plugin-store': path.resolve(__dirname, './e2e/shims/plugin-store.ts'),
            '@tauri-apps/plugin-dialog': path.resolve(__dirname, './e2e/shims/plugin-dialog.ts'),
            '@tauri-apps/api/window': path.resolve(__dirname, './e2e/shims/api-window.ts'),
            '@tauri-apps/plugin-window-state': path.resolve(__dirname, './e2e/shims/plugin-window-state.ts'),
            '@tauri-apps/api/core': path.resolve(__dirname, './e2e/shims/api-core.ts'),
            '@tauri-apps/api/path': path.resolve(__dirname, './e2e/shims/api-path.ts'),
          }
        : {}),
    },
  },
})
