import { GithubLogo } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { AgentIcon } from '@/components/agent-icon'
import { AGENTS } from '@/data/agents'
import { usePreferences } from '@/hooks/use-preferences'
import type { PackageManager } from '@/types/preferences'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { DialogBackdrop, DialogContent, DialogPortal, DialogRoot, DialogTitle } from '@/ui/dialog'
import { SegmentedControl } from '@/ui/segmented-control'

const PACKAGE_MANAGER_OPTIONS = [
  { value: 'npx', label: 'npx' },
  { value: 'pnpx', label: 'pnpx' },
  { value: 'bunx', label: 'bunx' },
]

interface PreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreferencesDialog({ open, onOpenChange }: PreferencesDialogProps) {
  const { preferences, savePreferences } = usePreferences()
  const [selectedAgents, setSelectedAgents] = useState<string[]>(preferences.defaultAgents)
  const [packageManager, setPackageManager] = useState<PackageManager>(preferences.packageManager)
  const [autoCheckUpdates, setAutoCheckUpdates] = useState(preferences.autoCheckUpdates)

  useEffect(() => {
    if (open) {
      setSelectedAgents(preferences.defaultAgents)
      setPackageManager(preferences.packageManager)
      setAutoCheckUpdates(preferences.autoCheckUpdates)
    }
  }, [open, preferences.defaultAgents, preferences.packageManager, preferences.autoCheckUpdates])

  const handleToggleAgent = (agent: string) => {
    setSelectedAgents((prev) => (prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]))
  }

  const handleSave = async () => {
    await savePreferences({ defaultAgents: selectedAgents, packageManager, autoCheckUpdates })
    onOpenChange(false)
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent className="w-[560px]">
          <DialogTitle className="text-[15px]">Preferences</DialogTitle>

          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">
                  Package Manager
                </span>
                <p className="mt-1 text-[12px] text-foreground/40">Package runner used when adding skills</p>
                <div className="mt-3">
                  <SegmentedControl
                    options={PACKAGE_MANAGER_OPTIONS}
                    value={packageManager}
                    onValueChange={(value) => setPackageManager(value as PackageManager)}
                    aria-label="Package manager"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">Auto-update</span>
                <p className="mt-1 text-[12px] text-foreground/40">Check for new versions on launch</p>
                <div className="mt-3">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-overlay-6">
                    <Checkbox
                      checked={autoCheckUpdates}
                      onCheckedChange={(checked) => setAutoCheckUpdates(checked as boolean)}
                    />
                    <span className="text-foreground">Enable auto-update checks</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-medium tracking-wide text-foreground/40 uppercase">Default Agents</span>
              <p className="mt-1 text-[12px] text-foreground/40">Pre-selected when adding skills</p>
              <div className="mt-3 max-h-52 space-y-0.5 overflow-y-auto rounded-lg border border-overlay-border-muted bg-overlay-4 p-2">
                {AGENTS.map((agent) => (
                  <label
                    key={agent.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-overlay-6"
                  >
                    <Checkbox
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => handleToggleAgent(agent.id)}
                    />
                    <AgentIcon agent={agent.id} size={16} className="shrink-0 text-foreground/60" />
                    <span className="truncate text-foreground">{agent.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <a
              href="https://github.com/devxoul/skillpad"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-foreground/40 transition-colors hover:text-foreground/70"
            >
              <GithubLogo size={14} weight="fill" />
              GitHub
            </a>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
