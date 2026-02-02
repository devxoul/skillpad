import { fetchSkills } from '@/lib/api'
import { type RemoveSkillOptions, type SkillInfo, listSkills, removeSkill } from '@/lib/cli'
import type { Skill } from '@/types/skill'
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'

interface GalleryState {
  skills: Skill[]
  loading: boolean
  error: string | null
  hasMore: boolean
  lastFetched: number | null
}

interface InstalledState {
  skills: SkillInfo[]
  loading: boolean
  error: string | null
  lastFetched: number | null
  lastScope: 'global' | 'project' | null
}

interface SkillsContextValue {
  gallery: GalleryState
  installed: InstalledState
  fetchGallerySkills: (force?: boolean) => Promise<void>
  loadMoreGallerySkills: () => Promise<void>
  fetchInstalledSkills: (global?: boolean, force?: boolean) => Promise<void>
  removeInstalledSkill: (name: string, options?: RemoveSkillOptions) => Promise<void>
}

const SkillsContext = createContext<SkillsContextValue | null>(null)

const CACHE_DURATION = 5 * 60 * 1000

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState<GalleryState>({
    skills: [],
    loading: false,
    error: null,
    hasMore: false,
    lastFetched: null,
  })

  const [installed, setInstalled] = useState<InstalledState>({
    skills: [],
    loading: false,
    error: null,
    lastFetched: null,
    lastScope: null,
  })

  const [galleryPage, setGalleryPage] = useState(1)

  const fetchGallerySkills = useCallback(
    async (force = false) => {
      const now = Date.now()
      const isCacheValid = gallery.lastFetched && now - gallery.lastFetched < CACHE_DURATION

      if (!force && isCacheValid && gallery.skills.length > 0) {
        return
      }

      setGallery((prev) => ({ ...prev, loading: true, error: null }))
      setGalleryPage(1)

      try {
        const response = await fetchSkills(1)
        setGallery({
          skills: response.skills,
          loading: false,
          error: null,
          hasMore: response.hasMore,
          lastFetched: Date.now(),
        })
      } catch (err) {
        setGallery((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load skills',
        }))
      }
    },
    [gallery.lastFetched, gallery.skills.length],
  )

  const loadMoreGallerySkills = useCallback(async () => {
    if (gallery.loading || !gallery.hasMore) return

    const nextPage = galleryPage + 1
    setGallery((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetchSkills(nextPage)
      setGalleryPage(nextPage)
      setGallery((prev) => ({
        ...prev,
        skills: [...prev.skills, ...response.skills],
        loading: false,
        hasMore: response.hasMore,
        lastFetched: Date.now(),
      }))
    } catch (err) {
      setGallery((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load more skills',
      }))
    }
  }, [gallery.loading, gallery.hasMore, galleryPage])

  const fetchInstalledSkills = useCallback(
    async (global = true, force = false) => {
      const scope = global ? 'global' : 'project'
      const now = Date.now()
      const scopeChanged = installed.lastScope !== scope
      const isCacheValid =
        installed.lastFetched && now - installed.lastFetched < CACHE_DURATION && !scopeChanged

      if (!force && isCacheValid && installed.skills.length > 0) {
        return
      }

      if (!force && !scopeChanged && installed.lastFetched && installed.skills.length === 0) {
        const timeSinceLastFetch = now - installed.lastFetched
        if (timeSinceLastFetch < CACHE_DURATION) {
          return
        }
      }

      setInstalled((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const skills = await listSkills(global)
        setInstalled({
          skills,
          loading: false,
          error: null,
          lastFetched: Date.now(),
          lastScope: scope,
        })
      } catch (err) {
        setInstalled((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load skills',
        }))
      }
    },
    [installed.lastFetched, installed.skills.length, installed.lastScope],
  )

  const removeInstalledSkill = useCallback(
    async (name: string, options?: RemoveSkillOptions) => {
      await removeSkill(name, options)
      await fetchInstalledSkills(true)
    },
    [fetchInstalledSkills],
  )

  const value = useMemo(
    () => ({
      gallery,
      installed,
      fetchGallerySkills,
      loadMoreGallerySkills,
      fetchInstalledSkills,
      removeInstalledSkill,
    }),
    [
      gallery,
      installed,
      fetchGallerySkills,
      loadMoreGallerySkills,
      fetchInstalledSkills,
      removeInstalledSkill,
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
  const { gallery, fetchGallerySkills, loadMoreGallerySkills } = useSkills()
  return {
    ...gallery,
    refresh: () => fetchGallerySkills(true),
    loadMore: loadMoreGallerySkills,
    fetch: fetchGallerySkills,
  }
}

export function useInstalledSkills(scope: 'global' | 'project' = 'global') {
  const { installed, fetchInstalledSkills, removeInstalledSkill } = useSkills()
  const isGlobal = scope === 'global'

  const refresh = useCallback(
    () => fetchInstalledSkills(isGlobal, true),
    [fetchInstalledSkills, isGlobal],
  )
  const fetch = useCallback(() => fetchInstalledSkills(isGlobal), [fetchInstalledSkills, isGlobal])

  return {
    ...installed,
    refresh,
    fetch,
    remove: removeInstalledSkill,
  }
}
