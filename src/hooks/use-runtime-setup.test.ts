import { beforeEach, describe, expect, test } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useRuntimeSetup } from '@/hooks/use-runtime-setup'
import { mockCheckRuntime, mockDownloadRuntime, mockEventListen, mockSetupRuntimePath } from '@/test-mocks'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('useRuntimeSetup', () => {
  beforeEach(() => {
    mockCheckRuntime.mockReset()
    mockDownloadRuntime.mockReset()
    mockSetupRuntimePath.mockReset()
    mockEventListen.mockReset()

    mockCheckRuntime.mockResolvedValue({
      available: false,
      found_pm: null,
      downloaded_bun_exists: false,
    })
    mockDownloadRuntime.mockResolvedValue({ success: true })
    mockSetupRuntimePath.mockResolvedValue(undefined)
    mockEventListen.mockResolvedValue(async () => undefined)
  })

  test('goes to idle when runtime is available', async () => {
    mockCheckRuntime.mockResolvedValue({
      available: true,
      found_pm: 'bun',
      downloaded_bun_exists: false,
    })

    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(20)
    })

    expect(result.current.state).toEqual({ status: 'idle' })
    expect(mockDownloadRuntime).not.toHaveBeenCalled()
    expect(mockSetupRuntimePath).not.toHaveBeenCalled()
  })

  test('goes to idle when downloaded bun exists and calls setup_runtime_path', async () => {
    mockCheckRuntime.mockResolvedValue({
      available: false,
      found_pm: null,
      downloaded_bun_exists: true,
    })

    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(20)
    })

    expect(mockSetupRuntimePath).toHaveBeenCalledTimes(1)
    expect(result.current.state).toEqual({ status: 'idle' })
  })

  test('downloads when no runtime found', async () => {
    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(20)
    })

    expect(mockDownloadRuntime).toHaveBeenCalledTimes(1)
    expect(mockSetupRuntimePath).toHaveBeenCalledTimes(1)
    expect(result.current.state).toEqual({ status: 'ready' })
  })

  test('updates progress during download', async () => {
    let resolveDownload: ((value?: unknown) => void) | null = null
    mockDownloadRuntime.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDownload = resolve
        }),
    )

    let progressHandler: ((event: { payload: { progress: number; total: number } }) => void) | null = null
    mockEventListen.mockImplementation(async (_event: string, handler: any) => {
      progressHandler = handler
      return async () => undefined
    })

    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(10)
    })

    await act(async () => {
      progressHandler?.({ payload: { progress: 25, total: 100 } })
    })

    expect(result.current.state).toEqual({ status: 'downloading', progress: 25 })

    await act(async () => {
      resolveDownload?.()
      await sleep(20)
    })
  })

  test('goes to error state when download fails', async () => {
    mockDownloadRuntime.mockRejectedValue(new Error('Download failed'))

    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(20)
    })

    expect(result.current.state.status).toBe('error')
    if (result.current.state.status === 'error') {
      expect(result.current.state.message).toBe('Download failed')
    }
  })

  test('retry triggers download again after error', async () => {
    mockDownloadRuntime.mockRejectedValueOnce(new Error('Download failed')).mockResolvedValue({ success: true })

    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(20)
    })

    expect(result.current.state.status).toBe('error')

    await act(async () => {
      result.current.retry()
      await sleep(20)
    })

    expect(mockDownloadRuntime).toHaveBeenCalledTimes(2)
    expect(result.current.state).toEqual({ status: 'ready' })
  })

  test('auto-dismisses ready state to idle after timeout', async () => {
    const { result } = renderHook(() => useRuntimeSetup())

    await act(async () => {
      await sleep(40)
    })
    expect(result.current.state).toEqual({ status: 'ready' })

    await act(async () => {
      await sleep(3100)
    })

    expect(result.current.state).toEqual({ status: 'idle' })
  })
})
