import type { Locale } from '@/lib/i18n'

export type PackageManager = 'npx' | 'pnpx' | 'bunx'

export interface Preferences {
  defaultAgents: string[]
  hiddenAgents: string[]
  packageManager: PackageManager
  autoCheckUpdates: boolean
  locale: Locale
}
