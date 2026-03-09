import { useSyncExternalStore } from 'react'

let metaPressed = false
const listeners = new Set<() => void>()

function notify() {
  for (const cb of listeners) cb()
}

function handleKey(e: KeyboardEvent) {
  const next = e.metaKey || e.ctrlKey
  if (next !== metaPressed) {
    metaPressed = next
    notify()
  }
}

function handleBlur() {
  if (metaPressed) {
    metaPressed = false
    notify()
  }
}

let listenersBound = false

function ensureGlobalListeners() {
  if (listenersBound) return
  listenersBound = true
  window.addEventListener('keydown', handleKey)
  window.addEventListener('keyup', handleKey)
  window.addEventListener('blur', handleBlur)
}

function subscribe(callback: () => void) {
  ensureGlobalListeners()
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot() {
  return metaPressed
}

export function useMetaKey() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
