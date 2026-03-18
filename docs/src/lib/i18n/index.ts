'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import type { Locale } from './locale'
import { getTranslations } from './translations/index'

export { i18n } from './config'
export type { Locale } from './locale'
export { defaultLocale, supportedLocales } from './locale'
export { getTranslations } from './translations/index'

export function useTranslations() {
  const { lang } = useParams<{ lang: string }>()
  return useMemo(() => getTranslations((lang ?? 'en') as Locale), [lang])
}
