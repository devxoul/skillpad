import { useContext, useMemo } from 'react'

import { LocaleContext } from './locale'
import { getTranslations } from './translations/index'

export { LocaleContext, defaultLocale, supportedLocales, useLocale } from './locale'
export type { Locale } from './locale'
export { getTranslations } from './translations/index'

export function useTranslations() {
  const { locale } = useContext(LocaleContext)
  return useMemo(() => getTranslations(locale), [locale])
}
