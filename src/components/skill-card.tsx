import { ArrowUp, Folder, GithubLogo, Plus, SpinnerGap, Trash, Warning } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AddSkillDialog } from '@/components/add-skill-dialog'
import { usePreferences } from '@/hooks/use-preferences'
import type { SkillInfo } from '@/lib/skills'
import { useTranslations } from '@/lib/i18n'
import type { Skill } from '@/types/skill'
import type { SkillUpdateStatus } from '@/types/update-status'
import { Checkbox } from '@/ui/checkbox'

export interface GallerySkillCardProps {
  variant: 'gallery'
  skill: Skill
  onAdd?: (skill: Skill) => void
  isSelectionMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (skillId: string) => void
  onShiftSelect?: (skillId: string) => void
}

export interface InstalledSkillCardProps {
  variant: 'installed'
  skill: SkillInfo
  source?: string
  onRemove: (name: string) => void
  removing: boolean
  updateStatus?: SkillUpdateStatus
  onUpdate?: (name: string) => void
  isSelectionMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (skillName: string) => void
  onShiftSelect?: (skillName: string) => void
}

export type SkillCardProps = GallerySkillCardProps | InstalledSkillCardProps

const cardBase = 'group rounded-lg border px-3 py-2.5 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]'
const cardDefault = 'border-overlay-border-muted bg-overlay-3 hover:bg-overlay-6'

function formatInstalls(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return count.toString()
}

export function SkillCard(props: SkillCardProps) {
  if (props.variant === 'installed') {
    return <InstalledCard {...props} />
  }
  return <GalleryCard {...props} />
}

function GalleryCard({
  skill,
  onAdd,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onShiftSelect,
}: GallerySkillCardProps) {
  const { preferences } = usePreferences()
  const [showDialog, setShowDialog] = useState(false)
  const t = useTranslations()

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAdd) {
      onAdd(skill)
    } else {
      setShowDialog(true)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      if (e.shiftKey) {
        e.preventDefault()
        onShiftSelect?.(skill.id)
      } else {
        onToggleSelect?.(skill.id)
      }
    }
  }

  const skillInfo = (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="truncate text-[13px] font-medium text-foreground">{skill.name}</span>
        <span className="shrink-0 rounded-full bg-overlay-8 px-1.5 py-0.5 text-[11px] font-medium text-foreground/50">
          {formatInstalls(skill.installs)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[12px] text-foreground/40">
        <GithubLogo size={12} weight="fill" />
        <span className="truncate">{skill.topSource}</span>
      </div>
    </div>
  )

  if (isSelectionMode) {
    return (
      <div
        className={clsx(
          cardBase,
          'flex cursor-pointer items-center gap-3',
          isSelected ? 'border-brand-400/30 bg-brand-500/[0.06]' : cardDefault,
        )}
        onClick={handleCardClick}
      >
        {skillInfo}
        <span onClick={(e) => e.stopPropagation()} className="flex w-7 shrink-0 items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect?.(skill.id)}
            aria-label={t.skill_card_select({ name: skill.name })}
          />
        </span>
      </div>
    )
  }

  return (
    <>
      <div className={clsx(cardBase, cardDefault, 'group flex items-center')}>
        <Link to={`/skill/${skill.id}`} className="min-w-0 flex-1" onClick={handleCardClick}>
          {skillInfo}
        </Link>
        <div className="flex w-7 shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={handleOpenDialog}
            className="rounded-md p-1.5 text-foreground/40 opacity-0 group-hover:opacity-100 hover:bg-overlay-10 hover:text-foreground/70"
            aria-label={t.skill_card_add}
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>
      </div>

      <AddSkillDialog
        skill={skill}
        skillNames={[skill.name]}
        open={showDialog}
        onOpenChange={setShowDialog}
        defaultAgents={preferences.defaultAgents}
        hiddenAgents={preferences.hiddenAgents}
      />
    </>
  )
}

function InstalledCard({
  skill,
  source,
  onRemove,
  removing,
  updateStatus,
  onUpdate,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onShiftSelect,
}: InstalledSkillCardProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    if (confirmingRemove) {
      const timer = setTimeout(() => setConfirmingRemove(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [confirmingRemove])

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      if (e.shiftKey) {
        e.preventDefault()
        onShiftSelect?.(skill.name)
      } else {
        onToggleSelect?.(skill.name)
      }
    }
  }

  const cardContent = (
    <>
      <div className="flex items-center gap-2">
        <span className="truncate text-[13px] font-medium text-foreground">{skill.name}</span>
        {updateStatus?.status === 'checking' && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-overlay-6 px-1.5 py-0.5 text-[10px] font-medium text-foreground/40">
            <SpinnerGap size={10} className="animate-spin" />
            {t.skill_card_checking}
          </span>
        )}
        {updateStatus?.status === 'update-available' && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onUpdate?.(skill.name)
            }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-500 transition-colors hover:bg-sky-500/20"
          >
            <ArrowUp size={10} weight="bold" />
            {t.skill_card_update}
          </button>
        )}
        {updateStatus?.status === 'updating' && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-500">
            <SpinnerGap size={10} className="animate-spin" />
            {t.skill_card_updating}
          </span>
        )}
        {updateStatus?.status === 'error' && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
            <Warning size={10} weight="bold" />
            {t.skill_card_error}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[12px] text-foreground/40">
        {source ? (
          <>
            <GithubLogo size={12} weight="fill" />
            <span className="truncate">{source}</span>
          </>
        ) : (
          <>
            <Folder size={12} weight="duotone" className="shrink-0" />
            <span className="truncate">{skill.path}</span>
          </>
        )}
      </div>
    </>
  )

  if (isSelectionMode) {
    return (
      <div
        className={clsx(
          cardBase,
          'flex cursor-pointer items-center gap-3',
          isSelected ? 'border-brand-400/30 bg-brand-500/[0.06]' : cardDefault,
        )}
        onClick={handleCardClick}
      >
        <div className="min-w-0 flex-1">{cardContent}</div>
        <span onClick={(e) => e.stopPropagation()} className="flex w-7 shrink-0 items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect?.(skill.name)}
            aria-label={t.skill_card_select({ name: skill.name })}
          />
        </span>
      </div>
    )
  }

  return (
    <div className={clsx(cardBase, cardDefault, 'group/card flex items-center')}>
      <Link to={`/skill/${skill.name}`} className="min-w-0 flex-1" onClick={handleCardClick}>
        {cardContent}
      </Link>
      <button
        type="button"
        tabIndex={confirmingRemove ? 0 : -1}
        onClick={() => {
          if (confirmingRemove) {
            onRemove(skill.name)
          } else {
            setConfirmingRemove(true)
          }
        }}
        onBlur={() => setConfirmingRemove(false)}
        disabled={removing}
        className={clsx(
          'relative flex h-4 shrink-0 items-center justify-end',
          confirmingRemove ? 'w-11' : 'w-4',
          'transition-[width] duration-200 ease-out',
          'opacity-0 group-hover:opacity-100',
          removing && 'cursor-not-allowed opacity-50',
        )}
        aria-label={confirmingRemove ? t.skill_card_click_to_confirm : t.skill_card_remove_skill}
      >
        {removing ? (
          <SpinnerGap size={14} className="absolute right-0 animate-spin" />
        ) : (
          <>
            <span
              className={clsx(
                'absolute right-0 text-[11px] leading-none transition-all duration-200 ease-out',
                confirmingRemove
                  ? 'translate-x-0 text-foreground/50 opacity-100 hover:text-foreground/70'
                  : 'pointer-events-none translate-x-2 text-foreground/50 opacity-0',
              )}
            >
              {t.skill_card_remove}
            </span>
            <Trash
              size={14}
              className={clsx(
                'absolute right-0 transition-all duration-200 ease-out',
                confirmingRemove
                  ? 'pointer-events-none -translate-x-2 opacity-0'
                  : 'translate-x-0 text-foreground/30 hover:text-foreground/50',
              )}
            />
          </>
        )}
      </button>
    </div>
  )
}
