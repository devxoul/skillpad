import { listen } from '@tauri-apps/api/event'
import { getCurrent, onOpenUrl } from '@tauri-apps/plugin-deep-link'
import { useEffect } from 'react'
import { type NavigateFunction, useNavigate } from 'react-router-dom'

function handleDeepLink(url: string, navigate: NavigateFunction): void {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'skillpad:') return

    const host = parsed.hostname
    const pathParts = parsed.pathname.replace(/^\//, '')

    if (host === 'skill' && pathParts) {
      navigate(`/skill/${pathParts}`)
      return
    }

    if (!host || (host === 'skill' && !pathParts)) {
      navigate('/')
    }
  } catch {
    // Malformed URL — silently ignore
  }
}

export function useDeepLink(): void {
  const navigate = useNavigate()

  useEffect(() => {
    getCurrent().then((urls) => {
      const url = urls?.[0]
      if (url) handleDeepLink(url, navigate)
    })

    const unlistenDeepLink = onOpenUrl((urls) => {
      const url = urls[0]
      if (url) handleDeepLink(url, navigate)
    })

    const unlistenEvent = listen<string>('deep-link-open', (event) => {
      handleDeepLink(event.payload, navigate)
    })

    return () => {
      unlistenDeepLink.then((fn) => fn())
      unlistenEvent.then((fn) => fn())
    }
  }, [navigate])
}
