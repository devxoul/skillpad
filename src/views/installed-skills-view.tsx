import {
  ArrowClockwise,
  ArrowsClockwise,
  CheckCircle,
  CheckSquare,
  FolderOpen,
  Globe,
  Package,
  SpinnerGap,
  Warning,
} from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { InlineError } from '@/components/inline-error'
import { InstalledSkillItemSkeleton } from '@/components/installed-skill-item-skeleton'
import { SearchInput } from '@/components/search-input'
import { SelectionActionBar } from '@/components/selection-action-bar'
import { SkillCard } from '@/components/skill-card'
import { useInstalledSkills } from '@/contexts/skills-context'
import { usePersistedSearch } from '@/hooks/use-persisted-search'
import { useScrollRestoration } from '@/hooks/use-scroll-restoration'
import { useSkillSelection } from '@/hooks/use-skill-selection'
import { useTranslations } from '@/lib/i18n'
import { readSkillSources } from '@/lib/skills'
import * as Popover from '@/ui/popover'
import { Skeleton } from '@/ui/skeleton'

interface InstalledSkillsViewProps {
  scope?: 'global' | 'project'
  projectPath?: string
}

export default function InstalledSkillsView({ scope = 'global', projectPath }: InstalledSkillsViewProps) {
  const {
    skills,
    loading,
    refetching,
    error,
    updateStatuses,
    checkErrors,
    isCheckingUpdates,
    isUpdatingAll,
    refresh,
    fetch,
    remove,
    checkUpdates,
    updateAll,
    updateOne,
  } = useInstalledSkills(scope, projectPath)
  const [sourceMap, setSourceMap] = useState<Record<string, string>>({})
  const scrollRef = useScrollRestoration<HTMLDivElement>()
  const [actionError, setActionError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [batchRemoving, setBatchRemoving] = useState(false)
  const [searchQuery, setSearchQuery] = usePersistedSearch()
  const { selectedIds, isSelected, toggle, selectAll, deselectAll, count, hasSelection } = useSkillSelection()
  const [selectMode, setSelectMode] = useState(false)
  const lastSelectedRef = useRef<string | null>(null)
  const inSelectionMode = selectMode || hasSelection
  const t = useTranslations()

  const toggleSelectMode = () => {
    if (inSelectionMode) {
      deselectAll()
      lastSelectedRef.current = null
      setSelectMode(false)
    } else {
      setSelectMode(true)
    }
  }

  async function handleBatchRemove() {
    setBatchRemoving(true)
    setActionError(null)

    const failed: string[] = []
    for (const name of selectedIds) {
      try {
        await remove(name, {
          global: scope === 'global',
          cwd: scope === 'project' ? projectPath : undefined,
        })
        toggle(name)
      } catch {
        failed.push(name)
      }
    }

    if (failed.length > 0) {
      setActionError(t.installed_failed_to_remove({ names: failed.join(', ') }))
    } else {
      deselectAll()
    }
    setBatchRemoving(false)
  }

  const skillNames = useMemo(() => skills.map((s) => s.name).join(','), [skills])

  useEffect(() => {
    fetch()
  }, [fetch])

  const loadSources = useCallback(() => {
    readSkillSources().then(setSourceMap)
  }, [])

  useEffect(() => {
    if (skillNames) {
      loadSources()
      checkUpdates()
    }
  }, [checkUpdates, skillNames, loadSources])

  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return skills
    }
    const query = searchQuery.toLowerCase()
    return skills.filter(
      (skill) => skill.name.toLowerCase().includes(query) || sourceMap[skill.name]?.toLowerCase().includes(query),
    )
  }, [skills, searchQuery, sourceMap])

  const handleShiftSelect = useCallback(
    (name: string) => {
      if (!lastSelectedRef.current) {
        toggle(name)
        lastSelectedRef.current = name
        return
      }

      const lastIndex = filteredSkills.findIndex((s) => s.name === lastSelectedRef.current)
      const currentIndex = filteredSkills.findIndex((s) => s.name === name)

      if (lastIndex === -1 || currentIndex === -1) {
        toggle(name)
        lastSelectedRef.current = name
        return
      }

      const start = Math.min(lastIndex, currentIndex)
      const end = Math.max(lastIndex, currentIndex)
      const rangeNames = filteredSkills.slice(start, end + 1).map((s) => s.name)

      selectAll(rangeNames)
      lastSelectedRef.current = name
    },
    [filteredSkills, toggle, selectAll],
  )

  const handleToggle = useCallback(
    (name: string) => {
      toggle(name)
      lastSelectedRef.current = name
    },
    [toggle],
  )

  async function handleRemove(skillName: string) {
    setRemoving(skillName)
    setActionError(null)

    try {
      await remove(skillName, {
        global: scope === 'global',
        cwd: scope === 'project' ? projectPath : undefined,
      })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t.installed_failed_to_remove_skill)
    } finally {
      setRemoving(null)
    }
  }

  function handleUpdate(skillName: string) {
    const status = updateStatuses[skillName]
    if (status?.status === 'update-available') {
      updateOne(skillName, status.source)
    }
  }

  const hasUpdates = Object.values(updateStatuses).some((s) => s.status === 'update-available')
  const updateCount = Object.values(updateStatuses).filter((s) => s.status === 'update-available').length
  const isAllUpToDate =
    skills.length > 0 &&
    !isCheckingUpdates &&
    Object.keys(updateStatuses).length > 0 &&
    Object.values(updateStatuses).every((s) => s.status === 'up-to-date')

  const renderContent = () => {
    if (loading && skills.length === 0) {
      return (
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          <InstalledSkillItemSkeleton />
          <InstalledSkillItemSkeleton />
          <InstalledSkillItemSkeleton />
          <InstalledSkillItemSkeleton />
        </div>
      )
    }

    if (error && skills.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <InlineError message={error} onRetry={refresh} />
          </div>
        </div>
      )
    }

    if (skills.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Package size={32} weight="duotone" className="mx-auto text-foreground/20" />
            <p className="mt-2 text-[13px] text-foreground/40">{t.installed_no_skills}</p>
            {scope === 'project' && (
              <p className="mt-1 text-[12px] text-foreground/30">{t.installed_add_from_directory}</p>
            )}
          </div>
        </div>
      )
    }

    return (
      <>
        <div
          className={clsx(
            'grid shrink-0 transition-[grid-template-rows] duration-200 ease-out',
            actionError ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-3">
              <InlineError message={actionError ?? ''} onRetry={() => setActionError(null)} />
            </div>
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[13px] text-foreground/40">{t.installed_no_skills_match}</p>
          </div>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-3 pb-4">
              {filteredSkills.map((skill) => (
                <SkillCard
                  variant="installed"
                  key={skill.name}
                  skill={skill}
                  source={sourceMap[skill.name]}
                  onRemove={handleRemove}
                  removing={removing === skill.name}
                  updateStatus={updateStatuses[skill.name]}
                  onUpdate={handleUpdate}
                  isSelectionMode={inSelectionMode}
                  isSelected={isSelected(skill.name)}
                  onToggleSelect={handleToggle}
                  onShiftSelect={handleShiftSelect}
                />
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-overlay-border-muted px-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            {scope === 'global' ? (
              <Globe size={18} weight="duotone" className="text-foreground/50" />
            ) : (
              <FolderOpen size={18} weight="duotone" className="text-foreground/50" />
            )}
            <h1 className="text-[15px] font-semibold text-foreground">
              {scope === 'global' ? t.installed_title : t.installed_project_skills}
            </h1>
          </div>
          <div className="mt-0.5 flex h-[18px] items-center text-[12px] text-foreground/40">
            {loading && skills.length === 0 ? (
              <Skeleton className="h-2.5 w-24" />
            ) : scope === 'project' && projectPath ? (
              <span className="flex items-center gap-3">
                <span>{projectPath}</span>
                {skills.length > 0 && (
                  <>
                    <span className="text-foreground/20">·</span>
                    <span>{t.installed_skill_count_label({ count: String(skills.length) })}</span>
                  </>
                )}
              </span>
            ) : skills.length > 0 ? (
              <>{t.installed_skill_count({ count: String(skills.length) })}</>
            ) : (
              <span className="text-foreground/30">{t.installed_no_skills}</span>
            )}

            {isAllUpToDate && (
              <>
                <span className="mx-2 text-foreground/20">|</span>
                <span className="flex items-center gap-1 text-emerald-500/80">
                  <CheckCircle size={12} weight="fill" />
                  {t.installed_all_up_to_date}
                </span>
              </>
            )}

            {checkErrors.length > 0 && (
              <>
                <span className="mx-2 text-foreground/20">|</span>
                <Popover.Root>
                  <Popover.Trigger className="flex items-center gap-1 text-amber-500/80 hover:text-amber-500">
                    <Warning size={12} weight="fill" />
                    {t.installed_check_errors_count({ count: String(checkErrors.length) })}
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner side="bottom" align="start" sideOffset={8}>
                      <Popover.Content className="max-h-[200px] w-72 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="text-[12px] font-medium text-amber-500">{t.installed_check_errors_title}</div>
                          {checkErrors.map((error) => (
                            <div key={error.name} className="flex flex-col gap-0.5">
                              <span className="text-[12px] font-medium text-foreground/80">{error.name}</span>
                              <span className="text-[11px] text-foreground/50">{error.error}</span>
                            </div>
                          ))}
                        </div>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              'grid transition-[grid-template-rows] duration-200 ease-out',
              hasUpdates ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={updateAll}
                disabled={isUpdatingAll}
                className="mr-2 flex items-center gap-3 rounded-md bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-500 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingAll ? (
                  <SpinnerGap size={12} className="animate-spin" />
                ) : (
                  <ArrowsClockwise size={12} weight="bold" />
                )}
                {t.installed_update_all({ count: String(updateCount) })}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSelectMode}
            className={clsx(
              'rounded-md p-1.5 transition-colors',
              inSelectionMode
                ? 'bg-overlay-8 text-foreground/70'
                : 'text-foreground/40 hover:bg-overlay-6 hover:text-foreground/70',
            )}
            aria-label={inSelectionMode ? t.installed_select_mode_exit : t.installed_select_mode_start}
          >
            <CheckSquare size={16} weight={inSelectionMode ? 'fill' : 'bold'} />
          </button>
          <button
            type="button"
            onClick={() => checkUpdates(true)}
            disabled={isCheckingUpdates}
            className="rounded-md p-1.5 text-foreground/40 hover:bg-overlay-6 hover:text-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.installed_check_for_updates}
          >
            <ArrowsClockwise size={16} weight="bold" className={isCheckingUpdates ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={loading || refetching}
            className="rounded-md p-1.5 text-foreground/40 hover:bg-overlay-6 hover:text-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.installed_refresh}
          >
            <ArrowClockwise size={16} weight="bold" className={loading || refetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {(loading || skills.length > 0) && (
        <div className="shrink-0 px-4 py-3">
          <SearchInput
            autoFocus
            onSearch={setSearchQuery}
            defaultValue={searchQuery}
            placeholder={t.installed_search_placeholder}
          />
        </div>
      )}

      {renderContent()}

      {count > 0 && (
        <SelectionActionBar
          count={count}
          totalCount={filteredSkills.length}
          actionLabel={t.installed_remove_selected}
          onAction={handleBatchRemove}
          onSelectAll={() => selectAll(filteredSkills.map((s) => s.name))}
          onClear={deselectAll}
          actionDisabled={batchRemoving}
        />
      )}
    </div>
  )
}
