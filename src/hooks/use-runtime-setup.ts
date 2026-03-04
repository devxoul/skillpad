import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { Store } from '@tauri-apps/plugin-store'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RuntimeSetupState } from '@/types/runtime-setup'

interface RuntimeCheckResult {
  available: boolean
  found_pm: string | null
  downloaded_bun_exists: boolean
}

interface RuntimeDownloadProgress {
  progress: number
  total: number
}

export function useRuntimeSetup(): { state: RuntimeSetupState; retry: () => void } {
  const [state, setState] = useState<RuntimeSetupState>({ status: 'checking' })
  const [retryCount, setRetryCount] = useState(0)
  const cancelledRef = useRef(false)

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1)
  }, [])

  useEffect(() => {
    void retryCount
    cancelledRef.current = false
    let unlisten: (() => void) | undefined
    let dismissTimer: ReturnType<typeof setTimeout> | undefined

    async function setup() {
      setState({ status: 'checking' })

      try {
        const checkResult = await invoke<RuntimeCheckResult>('check_runtime')
        if (cancelledRef.current) return

        if (checkResult.available) {
          setState({ status: 'idle' })
          return
        }

        if (checkResult.downloaded_bun_exists) {
          await invoke('setup_runtime_path')
          if (cancelledRef.current) return
          setState({ status: 'idle' })
          return
        }

        setState({ status: 'downloading', progress: 0 })

        unlisten = await listen<RuntimeDownloadProgress>('runtime-download-progress', (event) => {
          if (cancelledRef.current) return
          const total = event.payload.total || 1
          const progress = Math.round((event.payload.progress / total) * 100)
          setState({ status: 'downloading', progress })
        })

        await invoke('download_runtime')
        if (cancelledRef.current) return

        await invoke('setup_runtime_path')
        if (cancelledRef.current) return

        // Auto-switch package manager to bunx after fresh download
        const store = await Store.load('skillpad.json')
        const prefs = await store.get<{ packageManager?: string }>('preferences')
        await store.set('preferences', { ...prefs, packageManager: 'bunx' })
        await store.save()

        setState({ status: 'ready' })
        dismissTimer = setTimeout(() => {
          if (!cancelledRef.current) {
            setState({ status: 'idle' })
          }
        }, 3000)
      } catch (error) {
        if (cancelledRef.current) return
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    setup()

    return () => {
      cancelledRef.current = true
      if (unlisten) {
        void unlisten()
      }
      if (dismissTimer) {
        clearTimeout(dismissTimer)
      }
    }
  }, [retryCount])

  return { state, retry }
}
