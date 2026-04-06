import { FolderOpen, Globe } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { AgentCheckboxList } from '@/components/agent-checkbox-list'
import { useProjects } from '@/contexts/projects-context'
import { useSkills } from '@/contexts/skills-context'
import { useTranslations } from '@/lib/i18n'
import { addSkill } from '@/lib/skills'
import type { Skill } from '@/types/skill'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { DialogBackdrop, DialogContent, DialogPortal, DialogRoot, DialogTitle } from '@/ui/dialog'

interface AddSkillDialogProps {
  skill: Skill
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultAgents?: string[]
  hiddenAgents?: string[]
  skillNames?: string[]
  installSource?: string
}

export function AddSkillDialog({
  skill,
  open,
  onOpenChange,
  defaultAgents = [],
  hiddenAgents = [],
  skillNames,
  installSource,
}: AddSkillDialogProps) {
  const { projects, loading: projectsLoading } = useProjects()
  const { invalidateInstalledCache } = useSkills()
  const [includeGlobal, setIncludeGlobal] = useState(true)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(defaultAgents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    if (open) {
      setSelectedAgents(defaultAgents)
      setSelectedProjects([])
      setIncludeGlobal(true)
      setError(null)
      setSuccess(false)
    }
  }, [open, defaultAgents])

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectId)) return prev.filter((p) => p !== projectId)
      setIncludeGlobal(false)
      return [...prev, projectId]
    })
  }

  const handleToggleAgent = (agent: string) => {
    setSelectedAgents((prev) => (prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]))
  }

  const handleAdd = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const errors: string[] = []
    let successCount = 0
    const source = installSource ?? skill.topSource

    try {
      if (includeGlobal) {
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
            t.add_skill_error_global({ message: err instanceof Error ? err.message : t.add_skill_error_fallback }),
          )
        }
      }

      for (const projectId of selectedProjects) {
        const project = projects.find((p) => p.id === projectId)
        if (!project) continue

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
            t.add_skill_error_project({
              project: project.name,
              message: err instanceof Error ? err.message : t.add_skill_error_fallback,
            }),
          )
        }
      }

      const scopesToInvalidate: string[] = []
      if (includeGlobal) scopesToInvalidate.push('global')
      for (const projectId of selectedProjects) {
        const project = projects.find((p) => p.id === projectId)
        if (project) scopesToInvalidate.push(project.path)
      }
      if (scopesToInvalidate.length > 0) {
        invalidateInstalledCache(scopesToInvalidate)
      }

      if (errors.length > 0) {
        if (successCount > 0) {
          setError(t.add_skill_error_partial({ successCount: String(successCount), errors: errors.join('; ') }))
        } else {
          setError(errors.join('; '))
        }
      } else {
        setSuccess(true)
        setTimeout(() => onOpenChange(false), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.add_skill_error_fallback)
    } finally {
      setLoading(false)
    }
  }

  const hasTargetSelected = includeGlobal || selectedProjects.length > 0
  const isAddDisabled = loading || selectedAgents.length === 0 || !hasTargetSelected

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent className="w-[480px]">
          <DialogTitle>{t.add_skill_title({ name: skill.name })}</DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[13px] font-medium text-foreground">{t.add_skill_install_to}</label>
                <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-2">
                  <label className="flex items-center gap-2 rounded-md p-1.5 text-[13px] hover:bg-foreground/[0.06]">
                    <Checkbox checked={includeGlobal} onCheckedChange={setIncludeGlobal} />
                    <Globe size={16} weight="duotone" className="text-foreground/50" />
                    <span>{t.add_skill_global}</span>
                  </label>

                  {projects.length > 0 && <div className="mx-1 my-1.5 h-px bg-foreground/[0.06]" />}

                  {projectsLoading ? (
                    <div className="px-2 py-1.5 text-[12px] text-foreground/40">{t.add_skill_loading_projects}</div>
                  ) : (
                    projects.map((project) => (
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
                <label className="text-[13px] font-medium text-foreground">{t.add_skill_agents}</label>
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
                  {t.add_skill_success({ count: String((includeGlobal ? 1 : 0) + selectedProjects.length) })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" disabled={loading} onClick={() => onOpenChange(false)}>
                {t.add_skill_cancel}
              </Button>
              <Button onClick={handleAdd} disabled={isAddDisabled}>
                {loading ? t.add_skill_button_loading : t.add_skill_button}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
