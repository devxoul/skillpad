import { FolderOpen } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CommandPalette } from '@/components/command-palette'
import { useAppUpdateContext } from '@/contexts/app-update-context'
import { useProjects } from '@/contexts/projects-context'
import { useFolderDrop } from '@/hooks/use-folder-drop'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

import { MainContent } from './main-content'
import { PreferencesDialog } from './preferences-dialog'
import { Sidebar } from './sidebar'

export function Layout() {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { projects } = useProjects()
  const { checkForUpdate } = useAppUpdateContext()
  const { isDragging, lastAddedProjectId, clearLastAdded } = useFolderDrop()
  const navigate = useNavigate()

  useEffect(() => {
    if (lastAddedProjectId) {
      navigate(`/project/${lastAddedProjectId}`)
      clearLastAdded()
    }
  }, [lastAddedProjectId, navigate, clearLastAdded])

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
    <div className="relative flex h-screen text-foreground">
      <Sidebar onOpenPreferences={() => setPreferencesOpen(true)} />
      <MainContent />
      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenPreferences={() => setPreferencesOpen(true)}
        checkForUpdate={checkForUpdate}
      />
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] dark:bg-black/20">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-overlay-12 px-10 py-8 shadow-lg">
            <FolderOpen size={40} weight="duotone" className="text-foreground/60" />
            <span className="text-sm font-medium text-foreground/70">Drop folder to add project</span>
          </div>
        </div>
      )}
    </div>
  )
}
