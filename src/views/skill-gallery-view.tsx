import { ArrowClockwise, Books, CheckSquare } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'

import { BatchAddSkillDialog } from '@/components/batch-add-skill-dialog'
import { InlineError } from '@/components/inline-error'
import { SearchInput } from '@/components/search-input'
import { SelectionActionBar } from '@/components/selection-action-bar'
import { SkillCard } from '@/components/skill-card'
import { SkillCardSkeleton } from '@/components/skill-card-skeleton'
import { useGallerySkills } from '@/contexts/skills-context'
import { usePersistedSearch } from '@/hooks/use-persisted-search'
import { usePreferences } from '@/hooks/use-preferences'
import { useRepoSkills } from '@/hooks/use-repo-skills'
import { useScrollRestoration } from '@/hooks/use-scroll-restoration'
import { useSkillSelection } from '@/hooks/use-skill-selection'
import { isSkillPathQuery, parseSkillPath } from '@/lib/api'
import type { Skill } from '@/types/skill'

export function SkillGalleryView() {
  const { skills, loading, error, refresh, fetch, search, searchCache, setSearchCache } = useGallerySkills()
  const [searchQuery, setSearchQuery] = usePersistedSearch()
  const scrollRef = useScrollRestoration<HTMLDivElement>()
  const [searchResults, setSearchResults] = useState<Skill[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const repoSkills = useRepoSkills(searchQuery)
  const { selectedIds, isSelected, toggle, selectAll, deselectAll, count, hasSelection } = useSkillSelection()
  const { preferences } = usePreferences()
  const [showBatchDialog, setShowBatchDialog] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const lastSelectedRef = useRef<string | null>(null)
  const inSelectionMode = selectMode || hasSelection

  const toggleSelectMode = () => {
    if (inSelectionMode) {
      deselectAll()
      lastSelectedRef.current = null
      setSelectMode(false)
    } else {
      setSelectMode(true)
    }
  }

  const skillsRef = useRef(skills)
  skillsRef.current = skills

  const handleShiftSelect = (id: string) => {
    if (!lastSelectedRef.current) {
      toggle(id)
      lastSelectedRef.current = id
      return
    }

    const lastIndex = allVisibleSkills.findIndex((s) => s.id === lastSelectedRef.current)
    const currentIndex = allVisibleSkills.findIndex((s) => s.id === id)

    if (lastIndex === -1 || currentIndex === -1) {
      toggle(id)
      lastSelectedRef.current = id
      return
    }

    const start = Math.min(lastIndex, currentIndex)
    const end = Math.max(lastIndex, currentIndex)
    const rangeIds = allVisibleSkills.slice(start, end + 1).map((s) => s.id)

    selectAll(rangeIds)
    lastSelectedRef.current = id
  }

  const handleToggle = (id: string) => {
    toggle(id)
    lastSelectedRef.current = id
  }

  useEffect(() => {
    fetch()
  }, [fetch])

  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setSearchResults([])
      setSearching(false)
      setSearchError(null)
      return
    }

    if (trimmed.length < 2) {
      const query = trimmed.toLowerCase()
      setSearchResults(skillsRef.current.filter((s) => s.name.toLowerCase().includes(query)))
      setSearching(false)
      setSearchError(null)
      return
    }

    const cached = searchCache[trimmed]
    if (cached) {
      setSearchResults(cached)
      setSearching(false)
      setSearchError(null)
      return
    }

    let cancelled = false
    setSearching(true)
    setSearchError(null)

    search(searchQuery)
      .then((results: Skill[]) => {
        if (!cancelled) {
          setSearchCache(trimmed, results)
          setSearchResults(results)
          setSearching(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setSearchError(err instanceof Error ? err.message : 'Search failed')
          setSearchResults([])
          setSearching(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [searchQuery, search, searchCache, setSearchCache])

  const directPathSkill = useMemo((): Skill | null => {
    const trimmed = searchQuery.trim()
    if (!isSkillPathQuery(trimmed)) return null
    const parsed = parseSkillPath(trimmed)
    if (!parsed) return null
    return {
      id: trimmed,
      name: parsed.skill,
      installs: 0,
      topSource: `${parsed.owner}/${parsed.repo}`,
    }
  }, [searchQuery])

  const displayedSkills = searchQuery.trim() ? searchResults : skills
  const renderSkills = directPathSkill
    ? [directPathSkill, ...(searching ? [] : displayedSkills.filter((s) => s.id !== directPathSkill.id))]
    : displayedSkills
  const allVisibleSkills = [...repoSkills.skills, ...renderSkills].filter(
    (skill, index, all) => all.findIndex((s) => s.id === skill.id) === index,
  )
  const selectedSkills = allVisibleSkills.filter((skill) => selectedIds.has(skill.id))

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-overlay-border-muted px-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Books size={18} weight="duotone" className="text-foreground/50" />
            <h1 className="text-[15px] font-semibold text-foreground">Skills Directory</h1>
          </div>
          <p className="mt-0.5 text-[12px] text-foreground/40">Browse and discover available skills</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSelectMode}
            className={clsx(
              'rounded-md p-1.5 transition-colors',
              inSelectionMode
                ? 'bg-overlay-8 text-foreground/70'
                : 'text-foreground/40 hover:bg-overlay-6 hover:text-foreground/70',
            )}
            aria-label={inSelectionMode ? 'Exit select mode' : 'Select skills'}
          >
            <CheckSquare size={16} weight={inSelectionMode ? 'fill' : 'bold'} />
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-md p-1.5 text-foreground/40 hover:bg-overlay-6 hover:text-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh"
          >
            <ArrowClockwise size={16} weight="bold" className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <div className="shrink-0 px-4 py-3">
        <SearchInput autoFocus onSearch={setSearchQuery} defaultValue={searchQuery} placeholder="Search skills..." />
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4">
        {repoSkills.repoQuery && (
          <div className="pb-2">
            <h3 className="px-3 pt-3 pb-2 text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
              Skills in {repoSkills.repoQuery}
            </h3>
            {repoSkills.loading ? (
              <div className="grid grid-cols-2 gap-3">
                <SkillCardSkeleton />
                <SkillCardSkeleton />
              </div>
            ) : repoSkills.error ? (
              <div className="px-2 pb-2">
                <InlineError message={repoSkills.error} />
              </div>
            ) : repoSkills.skills.length === 0 ? (
              <p className="px-3 pb-3 text-[13px] text-foreground/40">No skills found in this repository</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {repoSkills.skills.map((skill) => (
                  <SkillCard
                    variant="gallery"
                    key={skill.id}
                    skill={skill}
                    isSelectionMode={inSelectionMode}
                    isSelected={isSelected(skill.id)}
                    onToggleSelect={handleToggle}
                    onShiftSelect={handleShiftSelect}
                  />
                ))}
              </div>
            )}
            <div className="mx-3 my-2 h-px bg-foreground/[0.06]" />
          </div>
        )}
        {error ? (
          <div className="p-4">
            <InlineError message={error} onRetry={refresh} />
          </div>
        ) : searchError && !directPathSkill ? (
          <div className="p-4">
            <InlineError
              message={searchError}
              onRetry={() => {
                setSearchError(null)
                setSearching(true)
                search(searchQuery)
                  .then((results: Skill[]) => {
                    setSearchResults(results)
                    setSearching(false)
                  })
                  .catch((err: unknown) => {
                    setSearchError(err instanceof Error ? err.message : 'Search failed')
                    setSearchResults([])
                    setSearching(false)
                  })
              }}
            />
          </div>
        ) : ((loading && skills.length === 0) || searching) && !directPathSkill ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            <SkillCardSkeleton />
            <SkillCardSkeleton />
            <SkillCardSkeleton />
            <SkillCardSkeleton />
            <SkillCardSkeleton />
            <SkillCardSkeleton />
          </div>
        ) : renderSkills.length === 0 && !repoSkills.repoQuery ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[13px] text-foreground/40">
              {searchQuery ? 'No skills match your search' : 'No skills available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {renderSkills.map((skill) => (
              <SkillCard
                variant="gallery"
                key={skill.id}
                skill={skill}
                isSelectionMode={inSelectionMode}
                isSelected={isSelected(skill.id)}
                onToggleSelect={handleToggle}
                onShiftSelect={handleShiftSelect}
              />
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <SelectionActionBar
          count={count}
          totalCount={allVisibleSkills.length}
          onAction={() => setShowBatchDialog(true)}
          onSelectAll={() => selectAll(allVisibleSkills.map((s) => s.id))}
          onClear={deselectAll}
        />
      )}

      <BatchAddSkillDialog
        skills={selectedSkills}
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        defaultAgents={preferences.defaultAgents}
        hiddenAgents={preferences.hiddenAgents}
        onSuccess={() => {
          deselectAll()
        }}
      />
    </div>
  )
}
