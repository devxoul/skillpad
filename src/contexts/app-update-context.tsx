import { createContext, type ReactNode, useContext } from 'react'
import { useAppUpdate } from '@/hooks/use-app-update'
import type { AppUpdateState } from '@/types/app-update'

interface AppUpdateContextValue {
  state: AppUpdateState
  checkForUpdate: (options?: { silent?: boolean }) => Promise<boolean>
  downloadUpdate: () => Promise<void>
  restartToUpdate: () => Promise<void>
}

const AppUpdateContext = createContext<AppUpdateContextValue | null>(null)

interface AppUpdateProviderProps {
  children: ReactNode
  autoCheckUpdates: boolean
}

export function AppUpdateProvider({ children, autoCheckUpdates }: AppUpdateProviderProps) {
  const value = useAppUpdate({ autoCheckUpdates })
  return <AppUpdateContext.Provider value={value}>{children}</AppUpdateContext.Provider>
}

export function useAppUpdateContext() {
  const context = useContext(AppUpdateContext)
  if (!context) {
    throw new Error('useAppUpdateContext must be used within AppUpdateProvider')
  }
  return context
}
