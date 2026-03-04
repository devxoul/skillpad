import { createContext, type ReactNode, useContext } from 'react'
import { useRuntimeSetup } from '@/hooks/use-runtime-setup'
import type { RuntimeSetupState } from '@/types/runtime-setup'

interface RuntimeSetupContextValue {
  state: RuntimeSetupState
  retry: () => void
}

const RuntimeSetupContext = createContext<RuntimeSetupContextValue | null>(null)

interface RuntimeSetupProviderProps {
  children: ReactNode
}

export function RuntimeSetupProvider({ children }: RuntimeSetupProviderProps) {
  const value = useRuntimeSetup()
  return <RuntimeSetupContext.Provider value={value}>{children}</RuntimeSetupContext.Provider>
}

export function useRuntimeSetupContext() {
  const context = useContext(RuntimeSetupContext)
  if (!context) {
    throw new Error('useRuntimeSetupContext must be used within RuntimeSetupProvider')
  }
  return context
}
