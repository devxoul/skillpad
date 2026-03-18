import { Eye, EyeSlash, Faders, GithubLogo, Robot } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

import { AgentIcon } from '@/components/agent-icon'
import { AGENTS } from '@/data/agents'
import { usePreferences } from '@/hooks/use-preferences'
import { computeHiddenAgents, detectInstalledAgents } from '@/lib/detect-agents'
import { supportedLocales, useLocale, useTranslations } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { PackageManager } from '@/types/preferences'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { DialogBackdrop, DialogContent, DialogPortal, DialogRoot, DialogTitle } from '@/ui/dialog'
import { SegmentedControl } from '@/ui/segmented-control'
import { Select } from '@/ui/select'

const PACKAGE_MANAGER_OPTIONS = [
  { value: 'npx', label: 'npx' },
  { value: 'pnpx', label: 'pnpx' },
  { value: 'bunx', label: 'bunx' },
]

type PreferencesSection = 'general' | 'agents'

interface PreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreferencesDialog({ open, onOpenChange }: PreferencesDialogProps) {
  const { preferences, savePreferences } = usePreferences()
  const t = useTranslations()
  const [activeSection, setActiveSection] = useState<PreferencesSection>('general')
  const [selectedAgents, setSelectedAgents] = useState<string[]>(preferences.defaultAgents)
  const [hiddenAgents, setHiddenAgents] = useState<string[]>(preferences.hiddenAgents)
  const [packageManager, setPackageManager] = useState<PackageManager>(preferences.packageManager)
  const [autoCheckUpdates, setAutoCheckUpdates] = useState(preferences.autoCheckUpdates)
  const [locale, setLocale] = useState<Locale>(preferences.locale)

  useEffect(() => {
    if (open) {
      setActiveSection('general')
      setSelectedAgents(preferences.defaultAgents)
      setHiddenAgents(preferences.hiddenAgents)
      setPackageManager(preferences.packageManager)
      setAutoCheckUpdates(preferences.autoCheckUpdates)
      setLocale(preferences.locale)
    }
  }, [
    open,
    preferences.defaultAgents,
    preferences.hiddenAgents,
    preferences.packageManager,
    preferences.autoCheckUpdates,
    preferences.locale,
  ])

  const handleToggleAgent = (agent: string) => {
    setSelectedAgents((prev) => (prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]))
  }

  const handleToggleHidden = (agentId: string) => {
    setHiddenAgents((prev) => (prev.includes(agentId) ? prev.filter((a) => a !== agentId) : [...prev, agentId]))
  }

  const handleAutoHide = async () => {
    const installed = await detectInstalledAgents()
    setHiddenAgents(computeHiddenAgents(installed))
  }

  const { setLocale: applyLocale } = useLocale()

  const handleSave = async () => {
    await savePreferences({ defaultAgents: selectedAgents, hiddenAgents, packageManager, autoCheckUpdates, locale })
    applyLocale(locale)
    onOpenChange(false)
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent className="w-[640px]">
          <DialogTitle className="text-[15px]">{t.preferences_title}</DialogTitle>

          <div className="flex">
            <nav className="w-[160px] shrink-0 space-y-0.5 border-r border-overlay-border-muted pr-4">
              <button
                type="button"
                onClick={() => setActiveSection('general')}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150',
                  activeSection === 'general'
                    ? 'bg-overlay-12 font-medium text-foreground'
                    : 'text-foreground/70 hover:bg-overlay-6 hover:text-foreground',
                )}
              >
                <Faders size={16} weight="duotone" className="text-foreground/60" />
                <span>{t.preferences_section_general}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('agents')}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150',
                  activeSection === 'agents'
                    ? 'bg-overlay-12 font-medium text-foreground'
                    : 'text-foreground/70 hover:bg-overlay-6 hover:text-foreground',
                )}
              >
                <Robot size={16} weight="duotone" className="text-foreground/60" />
                <span>{t.preferences_section_agents}</span>
              </button>
            </nav>

            <div className="min-h-[280px] flex-1 pl-6">
              {activeSection === 'general' && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
                      {t.preferences_package_manager_title}
                    </span>
                    <p className="mt-1 text-[12px] text-foreground/40">{t.preferences_package_manager_description}</p>
                    <div className="mt-3">
                      <SegmentedControl
                        options={PACKAGE_MANAGER_OPTIONS}
                        value={packageManager}
                        onValueChange={(value) => setPackageManager(value as PackageManager)}
                        aria-label={t.preferences_package_manager_label}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
                      {t.preferences_auto_update_title}
                    </span>
                    <p className="mt-1 text-[12px] text-foreground/40">{t.preferences_auto_update_description}</p>
                    <div className="mt-3">
                      <label className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] hover:bg-overlay-6">
                        <Checkbox
                          checked={autoCheckUpdates}
                          onCheckedChange={(checked) => setAutoCheckUpdates(checked as boolean)}
                        />
                        <span className="text-foreground">{t.preferences_auto_update_check}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
                      {t.preferences_language_title}
                    </span>
                    <div className="mt-3">
                      <Select
                        options={supportedLocales.map((l) => ({
                          value: l,
                          label: {
                            en: t.preferences_language_en,
                            ko: t.preferences_language_ko,
                            ja: t.preferences_language_ja,
                            'zh-CN': t.preferences_language_zh_cn,
                            'zh-TW': t.preferences_language_zh_tw,
                            es: t.preferences_language_es,
                            fr: t.preferences_language_fr,
                            de: t.preferences_language_de,
                          }[l],
                        }))}
                        value={locale}
                        onValueChange={(value) => setLocale(value as Locale)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'agents' && (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
                      {t.preferences_agents_title}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutoHide}
                        className="text-[11px] text-foreground/40 hover:text-foreground/70"
                      >
                        {t.preferences_agents_auto_hide}
                      </button>
                      <span className="text-[11px] text-foreground/20">&middot;</span>
                      <button
                        type="button"
                        onClick={() =>
                          setHiddenAgents((prev) =>
                            AGENTS.every(({ id }) => prev.includes(id)) ? [] : AGENTS.map((a) => a.id),
                          )
                        }
                        className="text-[11px] text-foreground/40 hover:text-foreground/70"
                      >
                        {AGENTS.every(({ id }) => hiddenAgents.includes(id))
                          ? t.preferences_agents_show_all
                          : t.preferences_agents_hide_all}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-[12px] text-foreground/40">{t.preferences_agents_description}</p>
                  <div className="mt-3 max-h-[280px] space-y-0.5 overflow-y-auto rounded-lg border border-overlay-border-muted bg-overlay-4 p-2">
                    {AGENTS.map((agent) => {
                      const isHidden = hiddenAgents.includes(agent.id)
                      return (
                        <div
                          key={agent.id}
                          className={clsx(
                            'group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] hover:bg-overlay-6',
                            isHidden && 'opacity-40',
                          )}
                        >
                          <label className="flex min-w-0 flex-1 items-center gap-2.5">
                            <Checkbox
                              checked={selectedAgents.includes(agent.id)}
                              onCheckedChange={() => handleToggleAgent(agent.id)}
                            />
                            <AgentIcon agent={agent.id} size={16} className="shrink-0 text-foreground/60" />
                            <span className="truncate text-foreground">{agent.name}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleToggleHidden(agent.id)}
                            className={clsx(
                              'shrink-0 rounded p-0.5 transition-colors',
                              isHidden
                                ? 'text-foreground/40 hover:text-foreground/70'
                                : 'text-foreground/20 opacity-0 group-hover:opacity-100 hover:text-foreground/50',
                            )}
                            aria-label={
                              isHidden
                                ? t.preferences_agents_show({ name: agent.name })
                                : t.preferences_agents_hide({ name: agent.name })
                            }
                          >
                            {isHidden ? <EyeSlash size={14} weight="bold" /> : <Eye size={14} />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <a
              href="https://github.com/devxoul/skillpad"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-foreground/40 hover:text-foreground/70"
            >
              <GithubLogo size={14} weight="fill" />
              {t.preferences_github}
            </a>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                {t.preferences_cancel}
              </Button>
              <Button onClick={handleSave}>{t.preferences_save}</Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
