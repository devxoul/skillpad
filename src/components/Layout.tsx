import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { PreferencesDialog } from './PreferencesDialog'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useProjects } from '@/hooks/useProjects'

export function Layout() {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const { projects } = useProjects()

  useKeyboardShortcuts({
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
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <MainContent />
      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </div>
  )
}
