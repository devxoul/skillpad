import { describe, expect, it, mock } from 'bun:test'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'

// Must mock before importing the module that uses it
mock.module('@/hooks/use-app-update', () => ({
  useAppUpdate: mock(() => ({
    state: { status: 'idle' as const },
    checkForUpdate: mock(() => Promise.resolve(false)),
    downloadUpdate: mock(() => Promise.resolve()),
    restartToUpdate: mock(() => Promise.resolve()),
  })),
}))

import { AppUpdateProvider, useAppUpdateContext } from './app-update-context'

function wrapper({ children }: { children: ReactNode }) {
  return <AppUpdateProvider autoCheckUpdates={false}>{children}</AppUpdateProvider>
}

describe('AppUpdateProvider', () => {
  it('provides update state and actions via context', () => {
    const { result } = renderHook(() => useAppUpdateContext(), { wrapper })

    expect(result.current.state).toEqual({ status: 'idle' })
    expect(typeof result.current.checkForUpdate).toBe('function')
    expect(typeof result.current.downloadUpdate).toBe('function')
    expect(typeof result.current.restartToUpdate).toBe('function')
  })

  it('throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAppUpdateContext())
    }).toThrow('useAppUpdateContext must be used within AppUpdateProvider')
  })
})
