import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/error-boundary'
import { Layout } from './components/layout'
import { AppUpdateProvider } from './contexts/app-update-context'
import { ProjectsProvider } from './contexts/projects-context'
import { ScrollRestorationProvider } from './contexts/scroll-context'
import { SearchPersistenceProvider } from './contexts/search-context'
import { SkillsProvider } from './contexts/skills-context'
import { useDeepLink } from './hooks/use-deep-link'
import { usePreferences } from './hooks/use-preferences'

function DeepLinkHandler() {
  useDeepLink()
  return null
}

function AppContent() {
  const { preferences } = usePreferences()

  return (
    <AppUpdateProvider autoCheckUpdates={preferences.autoCheckUpdates}>
      <ProjectsProvider>
        <SkillsProvider>
          <BrowserRouter>
            <DeepLinkHandler />
            <SearchPersistenceProvider>
              <ScrollRestorationProvider>
                <Layout />
              </ScrollRestorationProvider>
            </SearchPersistenceProvider>
          </BrowserRouter>
        </SkillsProvider>
      </ProjectsProvider>
    </AppUpdateProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}
