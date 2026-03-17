import { Store } from '@tauri-apps/plugin-store'
import { useCallback, useEffect, useState } from 'react'

import { computeHiddenAgents, detectInstalledAgents } from '@/lib/detect-agents'
import { detectPackageManager, isPackageManagerAvailable } from '@/lib/detect-package-manager'
import type { PackageManager, Preferences } from '@/types/preferences'

const STORE_KEY = 'preferences'
let store: Store | null = null

const DEFAULT_PREFERENCES: Preferences = {
  defaultAgents: [],
  hiddenAgents: [],
  packageManager: 'npx',
  autoCheckUpdates: true,
}

async function getStore() {
  if (!store) {
    store = await Store.load('skillpad.json')
  }
  return store
}

export interface FallbackNotice {
  from: PackageManager
  to: PackageManager
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [fallbackNotice, setFallbackNotice] = useState<FallbackNotice | null>(null)

  const loadPreferences = useCallback(async () => {
    setLoading(true)
    const s = await getStore()
    const data = await s.get<Partial<Preferences>>(STORE_KEY)
    let resolved = { ...DEFAULT_PREFERENCES, ...data }
    let dirty = false

    if (data?.hiddenAgents === undefined) {
      try {
        const installed = await detectInstalledAgents()
        resolved = { ...resolved, hiddenAgents: computeHiddenAgents(installed) }
        dirty = true
      } catch {}
    }

    if (data?.packageManager) {
      const available = await isPackageManagerAvailable(data.packageManager)
      if (!available) {
        const fallback = await detectPackageManager()
        if (fallback !== data.packageManager) {
          setFallbackNotice({ from: data.packageManager, to: fallback })
          resolved = { ...resolved, packageManager: fallback }
          dirty = true
        }
      }
    } else {
      const detected = await detectPackageManager()
      resolved = { ...resolved, packageManager: detected }
      dirty = true
    }

    if (dirty) {
      await s.set(STORE_KEY, resolved)
      await s.save()
    }

    setPreferences(resolved)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  const dismissFallbackNotice = useCallback(() => {
    setFallbackNotice(null)
  }, [])

  async function savePreferences(newPrefs: Preferences) {
    const s = await getStore()
    await s.set(STORE_KEY, newPrefs)
    await s.save()
    setPreferences(newPrefs)
  }

  return {
    preferences,
    loading,
    savePreferences,
    fallbackNotice,
    dismissFallbackNotice,
  }
}
