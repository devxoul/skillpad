import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { fetchSkills, searchSkills as searchSkillsApi } from '@/lib/api'
import {
  addSkill,
  checkUpdatesApi,
  listSkills,
  type RemoveSkillOptions,
  removeSkill,
  type SkillInfo,
} from '@/lib/skills'
import type { Skill } from '@/types/skill'
import type { UpdateStatusMap } from '@/types/update-status'

interface GalleryState {
  skills: Skill[]
  loading: boolean
  error: string | null
  lastFetched: number | null
}

interface ScopeCacheEntry {
  skills: SkillInfo[]
  lastFetched: number
  error: string | null
}

interface UpdateStatusCache {
  statuses: UpdateStatusMap
  errors: Array<{ name: string; error: string }>
  lastChecked: number
}

interface InstalledState {
  cache: Record<string, ScopeCacheEntry>
  loadingScopes: Set<string>
}

interface FetchInstalledOptions {
  global?: boolean
  projectPath?: string
  force?: boolean
}

interface CheckUpdatesOptions {
  scope: string
  skills: SkillInfo[]
  force?: boolean
}

interface SkillsContextValue {
  gallery: GalleryState
  installed: InstalledState
  searchCache: Record<string, Skill[]>
  updateStatusCache: Record<string, UpdateStatusCache>
  checkingUpdatesScope: string | null
  updatingAll: boolean
  fetchGallerySkills: (force?: boolean) => Promise<void>
  fetchInstalledSkills: (options?: FetchInstalledOptions) => Promise<void>
  removeInstalledSkill: (name: string, options?: RemoveSkillOptions) => Promise<void>
  invalidateInstalledCache: (scopes?: string[]) => void
  setSearchCache: (query: string, results: Skill[]) => void
  checkForUpdates: (options: CheckUpdatesOptions) => Promise<void>
  handleUpdateAll: (scope: string) => Promise<void>
  handleUpdateOne: (name: string, source: string, scope: string) => Promise<void>
}

const SkillsContext = createContext<SkillsContextValue | null>(null)

const CACHE_DURATION = 5 * 60 * 1000

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState<GalleryState>({
    skills: [],
    loading: false,
    error: null,
    lastFetched: null,
  })

  const [installed, setInstalled] = useState<InstalledState>({
    cache: {},
    loadingScopes: new Set(),
  })

  const [searchCache, setSearchCacheState] = useState<Record<string, Skill[]>>({})
  const [updateStatusCache, setUpdateStatusCache] = useState<Record<string, UpdateStatusCache>>({})
  const [checkingUpdatesScope, setCheckingUpdatesScope] = useState<string | null>(null)
  const [updatingAll, setUpdatingAll] = useState(false)

  const galleryRef = useRef(gallery)
  useEffect(() => {
    galleryRef.current = gallery
  })

  const installedCacheRef = useRef(installed.cache)
  installedCacheRef.current = installed.cache

  const updateStatusCacheRef = useRef(updateStatusCache)
  updateStatusCacheRef.current = updateStatusCache

  const setSearchCache = useCallback((query: string, results: Skill[]) => {
    setSearchCacheState((prev) => ({ ...prev, [query]: results }))
  }, [])

  const fetchGallerySkills = useCallback(async (force = false) => {
    const now = Date.now()
    const { lastFetched, skills } = galleryRef.current
    const isCacheValid = lastFetched && now - lastFetched < CACHE_DURATION

    if (!force && isCacheValid && skills.length > 0) {
      return
    }

    setGallery((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const fetched = await fetchSkills()
      setGallery({
        skills: fetched,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      })
    } catch (err) {
      setGallery((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load skills',
      }))
    }
  }, [])

  const fetchInstalledSkills = useCallback(async (options: FetchInstalledOptions = {}) => {
    const { global = true, projectPath, force = false } = options
    const scope = global ? 'global' : projectPath || 'project'
    const now = Date.now()
    const cached = installedCacheRef.current[scope]
    const isCacheValid = cached?.lastFetched && now - cached.lastFetched < CACHE_DURATION

    if (!force && isCacheValid) {
      return
    }

    setInstalled((prev) => {
      const next = new Set(prev.loadingScopes)
      next.add(scope)
      return { ...prev, loadingScopes: next }
    })

    try {
      const skills = await listSkills({ global, cwd: projectPath })
      setInstalled((prev) => {
        const next = new Set(prev.loadingScopes)
        next.delete(scope)
        return {
          ...prev,
          loadingScopes: next,
          cache: {
            ...prev.cache,
            [scope]: { skills, lastFetched: Date.now(), error: null },
          },
        }
      })
    } catch (err) {
      setInstalled((prev) => {
        const next = new Set(prev.loadingScopes)
        next.delete(scope)
        return {
          ...prev,
          loadingScopes: next,
          cache: {
            ...prev.cache,
            [scope]: {
              skills: prev.cache[scope]?.skills ?? [],
              lastFetched: Date.now(),
              error: err instanceof Error ? err.message : 'Failed to load skills',
            },
          },
        }
      })
    }
  }, [])

  const removeInstalledSkill = useCallback(
    async (name: string, options?: RemoveSkillOptions) => {
      await removeSkill(name, options)
      await fetchInstalledSkills({
        global: options?.global ?? true,
        projectPath: options?.cwd,
        force: true,
      })
    },
    [fetchInstalledSkills],
  )

  const invalidateInstalledCache = useCallback((scopes?: string[]) => {
    setInstalled((prev) => {
      if (!scopes) {
        return { ...prev, cache: {} }
      }
      const newCache = { ...prev.cache }
      for (const scope of scopes) {
        delete newCache[scope]
      }
      return { ...prev, cache: newCache }
    })
  }, [])

  const checkForUpdates = useCallback(async ({ scope, skills, force = false }: CheckUpdatesOptions) => {
    const now = Date.now()
    const cached = updateStatusCacheRef.current[scope]
    const isCacheValid = cached?.lastChecked && now - cached.lastChecked < CACHE_DURATION

    if (!force && isCacheValid) {
      return
    }

    if (skills.length === 0) return

    setCheckingUpdatesScope(scope)

    try {
      const result = await checkUpdatesApi()

      const newStatuses: UpdateStatusMap = {}
      const newErrors: Array<{ name: string; error: string }> = []

      for (const skill of skills) {
        newStatuses[skill.name] = { status: 'up-to-date' }
      }

      for (const update of result.updatesAvailable) {
        newStatuses[update.name] = {
          status: 'update-available',
          source: update.source,
        }
      }

      for (const err of result.errors || []) {
        newStatuses[err.name] = {
          status: 'error',
          message: err.error,
        }
        newErrors.push({ name: err.name, error: err.error })
      }

      setUpdateStatusCache((prev) => ({
        ...prev,
        [scope]: {
          statuses: newStatuses,
          errors: newErrors,
          lastChecked: Date.now(),
        },
      }))
    } catch (err) {
      console.error('Failed to check updates:', err)
    } finally {
      setCheckingUpdatesScope(null)
    }
  }, [])

  const handleUpdateAll = useCallback(
    async (scope: string) => {
      setUpdatingAll(true)

      const cached = updateStatusCacheRef.current[scope]
      if (!cached) {
        setUpdatingAll(false)
        return
      }

      const skillsToUpdate: Array<{ name: string; source: string }> = []
      const updatingStatuses: UpdateStatusMap = { ...cached.statuses }
      for (const [name, status] of Object.entries(updatingStatuses)) {
        if (status?.status === 'update-available') {
          updatingStatuses[name] = { status: 'updating' }
          skillsToUpdate.push({ name, source: status.source })
        }
      }
      setUpdateStatusCache((prev) => ({
        ...prev,
        [scope]: { ...prev[scope]!, statuses: updatingStatuses },
      }))

      const isGlobal = scope === 'global'

      try {
        const bySource = new Map<string, string[]>()
        for (const { name, source } of skillsToUpdate) {
          const existing = bySource.get(source) ?? []
          existing.push(name)
          bySource.set(source, existing)
        }

        for (const [source, skillNames] of bySource) {
          await addSkill(source, {
            global: isGlobal,
            skills: skillNames,
            yes: true,
          })
        }

        await fetchInstalledSkills({
          global: isGlobal,
          projectPath: isGlobal ? undefined : scope,
          force: true,
        })
      } catch (err) {
        console.error('Failed to update skills:', err)
      }

      try {
        const isGlobalScope = scope === 'global'
        const freshSkills = await listSkills({
          global: isGlobalScope,
          cwd: isGlobalScope ? undefined : scope,
        })
        await checkForUpdates({ scope, skills: freshSkills, force: true })
      } catch (err) {
        console.error('Failed to check updates after update:', err)
      } finally {
        setUpdatingAll(false)
      }
    },
    [fetchInstalledSkills, checkForUpdates],
  )

  const handleUpdateOne = useCallback(
    async (name: string, source: string, scope: string) => {
      setUpdateStatusCache((prev) => {
        const cached = prev[scope]
        if (!cached) return prev
        return {
          ...prev,
          [scope]: {
            ...cached,
            statuses: { ...cached.statuses, [name]: { status: 'updating' } },
          },
        }
      })

      const isGlobal = scope === 'global'

      try {
        await addSkill(source, {
          global: isGlobal,
          skills: [name],
          yes: true,
        })

        await fetchInstalledSkills({
          global: isGlobal,
          projectPath: isGlobal ? undefined : scope,
          force: true,
        })
      } catch (err) {
        console.error(`Failed to update skill ${name}:`, err)
        setUpdateStatusCache((prev) => {
          const cached = prev[scope]
          if (!cached) return prev
          return {
            ...prev,
            [scope]: {
              ...cached,
              statuses: {
                ...cached.statuses,
                [name]: { status: 'error', message: err instanceof Error ? err.message : 'Update failed' },
              },
            },
          }
        })
        return
      }

      try {
        const freshSkills = await listSkills({
          global: isGlobal,
          cwd: isGlobal ? undefined : scope,
        })
        await checkForUpdates({ scope, skills: freshSkills, force: true })
      } catch (err) {
        console.error('Failed to check updates after update:', err)
      }
    },
    [fetchInstalledSkills, checkForUpdates],
  )

  const value = useMemo(
    () => ({
      gallery,
      installed,
      searchCache,
      updateStatusCache,
      checkingUpdatesScope,
      updatingAll,
      fetchGallerySkills,
      fetchInstalledSkills,
      removeInstalledSkill,
      invalidateInstalledCache,
      setSearchCache,
      checkForUpdates,
      handleUpdateAll,
      handleUpdateOne,
    }),
    [
      gallery,
      installed,
      searchCache,
      updateStatusCache,
      checkingUpdatesScope,
      updatingAll,
      fetchGallerySkills,
      fetchInstalledSkills,
      removeInstalledSkill,
      invalidateInstalledCache,
      setSearchCache,
      checkForUpdates,
      handleUpdateAll,
      handleUpdateOne,
    ],
  )

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>
}

export function useSkills() {
  const context = useContext(SkillsContext)
  if (!context) {
    throw new Error('useSkills must be used within SkillsProvider')
  }
  return context
}

export function useGallerySkills() {
  const { gallery, searchCache, setSearchCache, fetchGallerySkills } = useSkills()
  return {
    ...gallery,
    searchCache,
    setSearchCache,
    refresh: () => fetchGallerySkills(true),
    fetch: fetchGallerySkills,
    search: searchSkillsApi,
  }
}

export function useInstalledSkills(scope: 'global' | 'project' = 'global', projectPath?: string) {
  const {
    installed,
    updateStatusCache,
    checkingUpdatesScope,
    updatingAll,
    fetchInstalledSkills,
    removeInstalledSkill,
    invalidateInstalledCache,
    checkForUpdates,
    handleUpdateAll,
    handleUpdateOne,
  } = useSkills()
  const isGlobal = scope === 'global'
  const expectedScope = isGlobal ? 'global' : projectPath || 'project'
  const cached = installed.cache[expectedScope]
  const updateCached = updateStatusCache[expectedScope]
  const isLoadingThisScope = installed.loadingScopes.has(expectedScope)
  const isCheckingThisScope = checkingUpdatesScope === expectedScope

  const refresh = useCallback(
    () => fetchInstalledSkills({ global: isGlobal, projectPath, force: true }),
    [fetchInstalledSkills, isGlobal, projectPath],
  )
  const fetch = useCallback(
    () => fetchInstalledSkills({ global: isGlobal, projectPath }),
    [fetchInstalledSkills, isGlobal, projectPath],
  )
  const checkUpdates = useCallback(
    (force = false) => checkForUpdates({ scope: expectedScope, skills: cached?.skills ?? [], force }),
    [checkForUpdates, expectedScope, cached?.skills],
  )
  const updateAll = useCallback(() => handleUpdateAll(expectedScope), [handleUpdateAll, expectedScope])
  const updateOne = useCallback(
    (name: string, source: string) => handleUpdateOne(name, source, expectedScope),
    [handleUpdateOne, expectedScope],
  )

  return {
    skills: cached?.skills ?? [],
    loading: isLoadingThisScope && !cached?.skills.length,
    refetching: isLoadingThisScope && (cached?.skills.length ?? 0) > 0,
    error: cached?.error ?? null,
    updateStatuses: updateCached?.statuses ?? {},
    checkErrors: updateCached?.errors ?? [],
    isCheckingUpdates: isCheckingThisScope,
    isUpdatingAll: updatingAll,
    refresh,
    fetch,
    remove: removeInstalledSkill,
    invalidateCache: invalidateInstalledCache,
    checkUpdates,
    updateAll,
    updateOne,
  }
}
