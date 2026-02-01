import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'

export function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <MainContent />
    </div>
  )
}
