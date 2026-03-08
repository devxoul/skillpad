import { GithubLogo, Plus } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddSkillDialog } from '@/components/add-skill-dialog'
import { usePreferences } from '@/hooks/use-preferences'
import type { Skill } from '@/types/skill'
import { Checkbox } from '@/ui/checkbox'

interface SkillCardProps {
  skill: Skill
  onAdd?: (skill: Skill) => void
  isSelectionMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (skillId: string) => void
}

function formatInstalls(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return count.toString()
}

function getSourceOrg(source: string | undefined): string {
  if (!source) return 'unknown'
  return source.split('/')[0] || source
}

export function SkillCard({ skill, onAdd, isSelectionMode, isSelected, onToggleSelect }: SkillCardProps) {
  const { preferences } = usePreferences()
  const [showDialog, setShowDialog] = useState(false)

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAdd) {
      onAdd(skill)
    } else {
      setShowDialog(true)
    }
  }

  const sourceOrg = getSourceOrg(skill.topSource)

  const cardContent = (
    <>
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
          <span className="text-foreground/30">by {sourceOrg}</span>
        </div>
      </div>
      {!isSelectionMode && (
        <button
          type="button"
          onClick={handleOpenDialog}
          className="shrink-0 rounded-md p-1.5 text-foreground/40 opacity-0 group-hover:opacity-100 hover:bg-overlay-10 hover:text-foreground/70"
          aria-label="Add skill"
        >
          <Plus size={16} weight="bold" />
        </button>
      )}
    </>
  )

  if (isSelectionMode) {
    return (
      <div
        className={clsx(
          'group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
          'hover:bg-overlay-6',
          isSelected && 'bg-overlay-6',
        )}
        onClick={() => onToggleSelect?.(skill.id)}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect?.(skill.id)}
          className="shrink-0"
          aria-label={`Select ${skill.name}`}
        />
        {cardContent}
      </div>
    )
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-overlay-6">
        {onToggleSelect && (
          <Checkbox
            checked={false}
            onCheckedChange={() => onToggleSelect(skill.id)}
            className="shrink-0 opacity-0 group-hover:opacity-100"
            aria-label={`Select ${skill.name}`}
          />
        )}
        <Link to={`/skill/${skill.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          {cardContent}
        </Link>
      </div>

      <AddSkillDialog
        skill={skill}
        skillNames={[skill.name]}
        open={showDialog}
        onOpenChange={setShowDialog}
        defaultAgents={preferences.defaultAgents}
      />
    </>
  )
}
