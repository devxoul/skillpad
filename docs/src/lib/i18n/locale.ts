export type Locale = (typeof supportedLocales)[number]
export const supportedLocales = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de'] as const
export const defaultLocale: Locale = 'en'
