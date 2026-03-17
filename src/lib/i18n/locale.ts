import { createContext, useContext } from 'react'

export type Locale = (typeof supportedLocales)[number]
export const supportedLocales = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de'] as const
export const defaultLocale: Locale = 'en'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
})

export function useLocale() {
  return useContext(LocaleContext)
}
