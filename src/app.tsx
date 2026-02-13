import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/error-boundary'
import { Layout } from './components/layout'
import { ProjectsProvider } from './contexts/projects-context'
import { ScrollRestorationProvider } from './contexts/scroll-context'
import { SearchPersistenceProvider } from './contexts/search-context'
import { SkillsProvider } from './contexts/skills-context'

export default function App() {
  return (
    <ErrorBoundary>
      <ProjectsProvider>
        <SkillsProvider>
          <BrowserRouter>
            <SearchPersistenceProvider>
              <ScrollRestorationProvider>
                <Layout />
              </ScrollRestorationProvider>
            </SearchPersistenceProvider>
          </BrowserRouter>
        </SkillsProvider>
      </ProjectsProvider>
    </ErrorBoundary>
  )
}
