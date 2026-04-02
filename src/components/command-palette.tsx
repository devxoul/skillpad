import { Command } from 'cmdk'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProjects } from '@/contexts/projects-context'
import { useGallerySkills, useInstalledSkills } from '@/contexts/skills-context'
import { useTranslations } from '@/lib/i18n'
import { DialogBackdrop, DialogContent, DialogPortal, DialogRoot } from '@/ui/dialog'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenPreferences: () => void
  checkForUpdate: () => void
}

interface SkillItem {
  name: string
  navigateTo: string
}

export function CommandPalette({ open, onOpenChange, onOpenPreferences, checkForUpdate }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { skills: gallerySkills } = useGallerySkills()
  const { skills: installedSkills } = useInstalledSkills()
  const [resetKey, setResetKey] = useState(0)
  const t = useTranslations()

  useEffect(() => {
    if (open) {
      setResetKey((k) => k + 1)
    }
  }, [open])

  const skillItems = useMemo<SkillItem[]>(() => {
    const galleryNames = new Set(gallerySkills.map((s) => s.name))

    const items: SkillItem[] = gallerySkills.map((skill) => ({
      name: skill.name,
      navigateTo: `/skill/${skill.id}`,
    }))

    for (const skill of installedSkills) {
      if (!galleryNames.has(skill.name)) {
        items.push({
          name: skill.name,
          navigateTo: `/skill/${skill.name}`,
        })
      }
    }

    return items
  }, [gallerySkills, installedSkills])

  const runAction = (action: () => void) => {
    action()
    onOpenChange(false)
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent className="w-[520px] overflow-hidden p-0">
          <Command key={resetKey}>
            <Command.Input autoFocus placeholder={t.command_palette_placeholder} />
            <Command.List>
              <Command.Empty>{t.command_palette_empty}</Command.Empty>

              <Command.Group heading={t.command_palette_navigation}>
                <Command.Item onSelect={() => runAction(() => navigate('/'))}>{t.gallery_title}</Command.Item>
                <Command.Item onSelect={() => runAction(() => navigate('/global'))}>
                  {t.sidebar_global_skills}
                </Command.Item>
                {projects.map((project) => (
                  <Command.Item key={project.id} onSelect={() => runAction(() => navigate(`/project/${project.id}`))}>
                    {project.name}
                  </Command.Item>
                ))}
              </Command.Group>

              {skillItems.length > 0 && (
                <Command.Group heading={t.command_palette_skills}>
                  {skillItems.map((skill) => (
                    <Command.Item key={skill.navigateTo} onSelect={() => runAction(() => navigate(skill.navigateTo))}>
                      {skill.name}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading={t.command_palette_actions}>
                <Command.Item keywords={['settings', 'config']} onSelect={() => runAction(onOpenPreferences)}>
                  {t.command_palette_preferences}
                </Command.Item>
                <Command.Item keywords={['version', 'upgrade']} onSelect={() => runAction(checkForUpdate)}>
                  {t.command_palette_check_for_update}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
