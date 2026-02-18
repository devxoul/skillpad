import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { ThemeProvider } from './contexts/theme-context'
import './index.css'

// Initialize window state plugin
import { getCurrentWindow } from '@tauri-apps/api/window'
import { restoreStateCurrent, saveWindowState } from '@tauri-apps/plugin-window-state'

async function initWindowState() {
  const appWindow = getCurrentWindow()

  // Restore saved state
  await restoreStateCurrent()

  // Save state on window events (debounced to avoid flooding IPC + disk I/O during resize)
  let saveTimer: ReturnType<typeof setTimeout>
  const debouncedSave = () => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => saveWindowState(), 300)
  }
  appWindow.onMoved(() => debouncedSave())
  appWindow.onResized(() => debouncedSave())
}

initWindowState().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
