import { FolderOpen, Globe } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { AgentCheckboxList } from '@/components/agent-checkbox-list'
import { useProjects } from '@/contexts/projects-context'
import { useSkills } from '@/contexts/skills-context'
import { addSkill } from '@/lib/skills'
import { useTranslations } from '@/lib/i18n'
import type { Project } from '@/types/project'
import type { Skill } from '@/types/skill'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { DialogBackdrop, DialogContent, DialogPortal, DialogRoot, DialogTitle } from '@/ui/dialog'

export interface BatchAddSkillDialogProps {
  skills: Skill[]
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultAgents?: string[]
  hiddenAgents?: string[]
  onSuccess?: () => void
}

export function BatchAddSkillDialog({
  skills,
  open,
  onOpenChange,
  defaultAgents = [],
  hiddenAgents = [],
  onSuccess,
}: BatchAddSkillDialogProps) {
  const { projects, loading: projectsLoading } = useProjects()
  const { invalidateInstalledCache } = useSkills()
  const [includeGlobal, setIncludeGlobal] = useState(true)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(defaultAgents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [snapshotSkills, setSnapshotSkills] = useState<Skill[]>(skills)
  const prevOpenRef = useRef(open)
  const t = useTranslations()

  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = open

    if (open && !wasOpen) {
      setSnapshotSkills(skills)
      setSelectedAgents(defaultAgents)
      setSelectedProjects([])
      setIncludeGlobal(true)
      setError(null)
      setSuccess(false)
      setProgress(null)
    }
  }, [open, defaultAgents, skills])

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((project) => project !== projectId) : [...prev, projectId],
    )
  }

  const handleToggleAgent = (agent: string) => {
    setSelectedAgents((prev) => (prev.includes(agent) ? prev.filter((value) => value !== agent) : [...prev, agent]))
  }

  const handleAdd = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const sourceGroups = groupBySource(snapshotSkills)
    const totalSkills = snapshotSkills.length
    const targetCount = (includeGlobal ? 1 : 0) + selectedProjects.length
    let completedSkills = 0
    const errors: string[] = []
    let successCount = 0

    setProgress(`0/${totalSkills * targetCount}`)

    try {
      if (includeGlobal) {
        for (const [source, skillNames] of sourceGroups) {
          try {
            await addSkill(source, {
              global: true,
              agents: selectedAgents,
              skills: skillNames,
              yes: true,
            })
            successCount++
          } catch (err) {
            errors.push(
              t.batch_add_error_global({
                source,
                message: err instanceof Error ? err.message : t.batch_add_error_fallback,
              }),
            )
          }

          completedSkills += skillNames.length
          setProgress(`${completedSkills}/${totalSkills * targetCount}`)
        }
      }

      for (const projectId of selectedProjects) {
        const project = projects.find((value: Project) => value.id === projectId)
        if (!project) continue

        for (const [source, skillNames] of sourceGroups) {
          try {
            await addSkill(source, {
              agents: selectedAgents,
              skills: skillNames,
              yes: true,
              cwd: project.path,
            })
            successCount++
          } catch (err) {
            errors.push(
              t.batch_add_error_project({
                project: project.name,
                source,
                message: err instanceof Error ? err.message : t.batch_add_error_fallback,
              }),
            )
          }

          completedSkills += skillNames.length
          setProgress(`${completedSkills}/${totalSkills * targetCount}`)
        }
      }

      const scopesToInvalidate: string[] = []
      if (includeGlobal) scopesToInvalidate.push('global')
      for (const projectId of selectedProjects) {
        const project = projects.find((value: Project) => value.id === projectId)
        if (project) scopesToInvalidate.push(project.path)
      }
      if (scopesToInvalidate.length > 0) {
        invalidateInstalledCache(scopesToInvalidate)
      }

      if (errors.length > 0) {
        if (successCount > 0) {
          setError(
            t.batch_add_error_partial({
              successCount: String(successCount),
              errorCount: String(errors.length),
              errors: errors.join('; '),
            }),
          )
        } else {
          setError(errors.join('; '))
        }
      } else {
        setSuccess(true)
        onSuccess?.()
        setTimeout(() => onOpenChange(false), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.batch_add_error_fallback)
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }

  const hasTargetSelected = includeGlobal || selectedProjects.length > 0
  const isAddDisabled = loading || selectedAgents.length === 0 || !hasTargetSelected
  const targetCount = (includeGlobal ? 1 : 0) + selectedProjects.length

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent className="w-[480px]">
          <DialogTitle>
            {snapshotSkills.length === 1
              ? t.batch_add_title_one({ count: String(snapshotSkills.length) })
              : t.batch_add_title_other({ count: String(snapshotSkills.length) })}
          </DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[13px] font-medium text-foreground">{t.batch_add_install_to}</label>
                <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-2">
                  <label className="flex items-center gap-2 rounded-md p-1.5 text-[13px] hover:bg-foreground/[0.06]">
                    <Checkbox checked={includeGlobal} onCheckedChange={setIncludeGlobal} />
                    <Globe size={16} weight="duotone" className="text-foreground/50" />
                    <span>{t.batch_add_global}</span>
                  </label>

                  {projects.length > 0 && <div className="mx-1 my-1.5 h-px bg-foreground/[0.06]" />}

                  {projectsLoading ? (
                    <div className="px-2 py-1.5 text-[12px] text-foreground/40">{t.batch_add_loading_projects}</div>
                  ) : (
                    projects.map((project: Project) => (
                      <label
                        key={project.id}
                        className="flex items-center gap-2 rounded-md p-1.5 text-[13px] hover:bg-foreground/[0.06]"
                      >
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => handleToggleProject(project.id)}
                        />
                        <FolderOpen size={16} weight="duotone" className="text-foreground/50" />
                        <span className="truncate">{project.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[13px] font-medium text-foreground">{t.batch_agents}</label>
                <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-2">
                  <AgentCheckboxList
                    selectedAgents={selectedAgents}
                    hiddenAgents={hiddenAgents}
                    onToggleAgent={handleToggleAgent}
                  />
                </div>
              </div>
            </div>

            <div className="min-h-[20px]">
              {error && <div className="text-[13px] text-red-400">{error}</div>}
              {success && (
                <div className="text-[13px] text-emerald-500">
                  {t.batch_add_success({ skillCount: String(snapshotSkills.length), targetCount: String(targetCount) })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" disabled={loading} onClick={() => onOpenChange(false)}>
                {t.batch_add_cancel}
              </Button>
              <Button onClick={handleAdd} disabled={isAddDisabled}>
                {loading ? t.batch_add_button_loading({ progress: progress ?? '' }) : t.batch_add_button}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}

function groupBySource(skills: Skill[]): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  for (const skill of skills) {
    const source = skill.installSource ?? skill.topSource
    const existing = groups.get(source) ?? []
    existing.push(skill.name)
    groups.set(source, existing)
  }
  return groups
}
