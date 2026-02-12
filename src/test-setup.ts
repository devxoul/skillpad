import { afterEach, expect, mock } from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

mock.module('@lobehub/icons', () => ({
  Claude: () => null,
  Cursor: () => null,
  Cline: () => null,
  Windsurf: () => null,
  GithubCopilot: () => null,
  Gemini: () => null,
  OpenAI: () => null,
  DeepSeek: () => null,
  CodeGeeX: () => null,
  Replit: () => null,
  Aws: () => null,
}))

mock.module('@tauri-apps/api/core', () => ({
  invoke: mock(() => {}),
}))

mock.module('@tauri-apps/plugin-dialog', () => ({
  open: mock(() => {}),
}))

mock.module('@tauri-apps/plugin-store', () => ({
  Store: {
    load: mock(async () => ({
      get: mock(async () => null),
      set: mock(async () => undefined),
      save: mock(async () => undefined),
    })),
  },
}))

mock.module('@tauri-apps/api/window', () => ({
  getCurrentWindow: mock(() => ({
    theme: mock(async () => 'light'),
    onThemeChanged: mock(async () => () => {}),
    onMoved: mock(async () => () => {}),
    onResized: mock(async () => () => {}),
  })),
}))

mock.module('@tauri-apps/plugin-window-state', () => ({
  restoreStateCurrent: mock(async () => undefined),
  saveWindowState: mock(async () => undefined),
}))
