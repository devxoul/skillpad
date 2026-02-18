// Must be loaded BEFORE test-setup.ts (via bunfig preload order).
// Patches globals that would otherwise keep bun's event loop alive:
// 1. setImmediate — React scheduler's first choice; native version never drains
// 2. MessageChannel — scheduler's fallback; native port handles persist
// 3. requestAnimationFrame — Base UI transitions use this; no native impl in happy-dom
import { Window } from 'happy-dom'

// React scheduler prefers setImmediate over MessageChannel (see scheduler.development.js:551).
// Bun's native setImmediate (libuv) keeps the event loop alive indefinitely, preventing
// test process exit. Replace with setTimeout(0) which drains cleanly.
globalThis.setImmediate = ((fn: (...args: unknown[]) => void, ...args: unknown[]) =>
  setTimeout(fn, 0, ...args)) as unknown as typeof setImmediate

const happyDomWindow = new Window()
globalThis.document = happyDomWindow.document as any
globalThis.window = happyDomWindow as any
globalThis.navigator = happyDomWindow.navigator as any
globalThis.Element = happyDomWindow.Element as any
globalThis.HTMLElement = happyDomWindow.HTMLElement as any
globalThis.Node = happyDomWindow.Node as any
globalThis.getComputedStyle = happyDomWindow.getComputedStyle as any

globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number
}
globalThis.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

globalThis.open = (() => null) as typeof globalThis.open

globalThis.MessageChannel = class {
  port1: { onmessage: ((ev: { data: unknown }) => void) | null } = { onmessage: null }
  port2: { postMessage: (data?: unknown) => void; close: () => void }
  constructor() {
    this.port2 = {
      postMessage: (data?: unknown) => {
        setTimeout(() => this.port1.onmessage?.({ data }), 0)
      },
      close: () => {},
    }
  }
} as unknown as typeof MessageChannel
