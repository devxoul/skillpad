import { beforeEach, describe, expect, test } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useRuntimeSetup } from '@/hooks/use-runtime-setup'
import {
  mockCheckRuntime,
  mockDownloadRuntime,
  mockEventListen,
  mockSetupRuntimePath,
  mockStoreGet,
  mockStoreSave,
  mockStoreSet,
} from '@/test-mocks'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitFor(condition: () => boolean, timeoutMs = 1000) {
  const startedAt = Date.now()
  while (!condition()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error('Timed out waiting for condition')
    }
    await act(async () => {
      await sleep(10)
    })
  }
}

describe('useRuntimeSetup integration', () => {
  beforeEach(() => {
    mockCheckRuntime.mockReset()
    mockDownloadRuntime.mockReset()
    mockSetupRuntimePath.mockReset()
    mockEventListen.mockReset()
    mockStoreGet.mockReset()
    mockStoreSet.mockReset()
    mockStoreSave.mockReset()

    mockCheckRuntime.mockResolvedValue({
      available: false,
      found_pm: null,
      downloaded_bun_exists: false,
    })
    mockDownloadRuntime.mockResolvedValue({ success: true })
    mockSetupRuntimePath.mockResolvedValue(undefined)
    mockEventListen.mockResolvedValue(async () => undefined)
    mockStoreGet.mockResolvedValue({ packageManager: 'npx' })
    mockStoreSet.mockResolvedValue(undefined)
    mockStoreSave.mockResolvedValue(undefined)
  })

  test('full flow transitions from checking to downloading to ready to idle', async () => {
    let emitProgress: ((event: { payload: { progress: number; total: number } }) => void) | undefined
    let resolveDownload: (() => void) | undefined

    mockEventListen.mockImplementation(async (_event: string, handler: any) => {
      emitProgress = handler
      return async () => undefined
    })
    mockDownloadRuntime.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDownload = () => resolve({ success: true })
        }),
    )

    const { result } = renderHook(() => useRuntimeSetup())

    expect(result.current.state).toEqual({ status: 'checking' })

    await waitFor(() => result.current.state.status === 'downloading')
    expect(result.current.state).toEqual({ status: 'downloading', progress: 0 })

    await act(async () => {
      emitProgress?.({ payload: { progress: 25, total: 100 } })
    })
    expect(result.current.state).toEqual({ status: 'downloading', progress: 25 })

    await act(async () => {
      emitProgress?.({ payload: { progress: 90, total: 100 } })
    })
    expect(result.current.state).toEqual({ status: 'downloading', progress: 90 })

    await act(async () => {
      resolveDownload?.()
    })

    await waitFor(() => result.current.state.status === 'ready')
    expect(result.current.state).toEqual({ status: 'ready' })
    expect(mockStoreSet).toHaveBeenCalledWith('preferences', expect.objectContaining({ packageManager: 'bunx' }))

    await act(async () => {
      await sleep(3100)
    })
    expect(result.current.state).toEqual({ status: 'idle' })
  })

  test('uses downloaded bun path and skips fresh download', async () => {
    mockCheckRuntime.mockResolvedValue({
      available: false,
      found_pm: null,
      downloaded_bun_exists: true,
    })

    const { result } = renderHook(() => useRuntimeSetup())

    await waitFor(() => result.current.state.status === 'idle')

    expect(mockSetupRuntimePath).toHaveBeenCalledTimes(1)
    expect(mockDownloadRuntime).not.toHaveBeenCalled()
    expect(mockStoreSet).not.toHaveBeenCalledWith('preferences', expect.objectContaining({ packageManager: 'bunx' }))
    expect(result.current.state).toEqual({ status: 'idle' })
  })

  test('recovers from failed download after retry', async () => {
    mockDownloadRuntime.mockRejectedValueOnce(new Error('Download failed')).mockResolvedValue({ success: true })

    const { result } = renderHook(() => useRuntimeSetup())

    await waitFor(() => result.current.state.status === 'error')
    expect(result.current.state.status).toBe('error')

    await act(async () => {
      result.current.retry()
    })

    await waitFor(() => result.current.state.status === 'ready')
    expect(mockDownloadRuntime).toHaveBeenCalledTimes(2)
    expect(result.current.state).toEqual({ status: 'ready' })
    expect(mockStoreSet).toHaveBeenCalledWith('preferences', expect.objectContaining({ packageManager: 'bunx' }))
  })

  test('goes idle immediately when runtime is already available', async () => {
    mockCheckRuntime.mockResolvedValue({
      available: true,
      found_pm: 'bunx',
      downloaded_bun_exists: false,
    })

    const { result } = renderHook(() => useRuntimeSetup())

    await waitFor(() => result.current.state.status === 'idle')

    expect(result.current.state).toEqual({ status: 'idle' })
    expect(mockDownloadRuntime).not.toHaveBeenCalled()
    expect(mockSetupRuntimePath).not.toHaveBeenCalled()
  })
})
