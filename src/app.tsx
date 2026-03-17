import { useCallback, useEffect, useState } from 'react'
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
import { defaultLocale, LocaleContext } from './lib/i18n'
import type { Locale } from './lib/i18n'

function DeepLinkHandler() {
  useDeepLink()
  return null
}

function AppContent({ setLocale }: { setLocale: (locale: Locale) => void }) {
  const { preferences } = usePreferences()

  useEffect(() => {
    setLocale(preferences.locale)
  }, [preferences.locale, setLocale])

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
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ErrorBoundary>
        <AppContent setLocale={setLocale} />
      </ErrorBoundary>
    </LocaleContext.Provider>
  )
}
