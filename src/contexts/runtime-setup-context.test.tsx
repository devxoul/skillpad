import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import * as useRuntimeSetupModule from '@/hooks/use-runtime-setup'

import { RuntimeSetupProvider, useRuntimeSetupContext } from './runtime-setup-context'

let useRuntimeSetupSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  useRuntimeSetupSpy = spyOn(useRuntimeSetupModule, 'useRuntimeSetup').mockReturnValue({
    state: { status: 'idle' },
    retry: mock(() => {}),
  })
})

afterEach(() => {
  useRuntimeSetupSpy.mockRestore()
})

function wrapper({ children }: { children: ReactNode }) {
  return <RuntimeSetupProvider>{children}</RuntimeSetupProvider>
}

describe('RuntimeSetupProvider', () => {
  it('provides runtime setup state and retry via context', () => {
    const { result } = renderHook(() => useRuntimeSetupContext(), { wrapper })

    expect(result.current.state).toEqual({ status: 'idle' })
    expect(typeof result.current.retry).toBe('function')
  })

  it('throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useRuntimeSetupContext())
    }).toThrow('useRuntimeSetupContext must be used within RuntimeSetupProvider')
  })
})
