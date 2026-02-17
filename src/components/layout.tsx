import { useState } from 'react'
import { CommandPalette } from '@/components/command-palette'
import { useAppUpdateContext } from '@/contexts/app-update-context'
import { useProjects } from '@/contexts/projects-context'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { MainContent } from './main-content'
import { PreferencesDialog } from './preferences-dialog'
import { Sidebar } from './sidebar'

export function Layout() {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { projects } = useProjects()
  const { checkForUpdate } = useAppUpdateContext()

  useKeyboardShortcuts({
    onOpenCommandPalette: () => {
      setCommandPaletteOpen(true)
    },
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
      searchInput?.focus()
    },
    onOpenPreferences: () => {
      setPreferencesOpen(true)
    },
    projects,
  })

  return (
    <div className="flex h-screen text-foreground">
      <Sidebar onOpenPreferences={() => setPreferencesOpen(true)} />
      <MainContent />
      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenPreferences={() => setPreferencesOpen(true)}
        checkForUpdate={checkForUpdate}
      />
    </div>
  )
}
