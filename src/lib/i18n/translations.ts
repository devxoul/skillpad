import type { ReactNode } from 'react'

export type TranslationMap<Locale extends string, Translations extends Record<string, string>> = Record<
  Locale,
  Record<keyof Translations, string>
>

type TranslationProxy<Translations extends Record<string, string>> = {
  [K in keyof Translations]: ExtractPlaceholders<Translations[K]> extends never
    ? string
    : TranslationFn<ExtractPlaceholders<Translations[K]>>
}

type TranslationFn<Placeholders extends string> = {
  (params: Record<Placeholders, string>): string
  (params: Record<Placeholders, ReactNode>): ReactNode[]
}

type ExtractPlaceholders<T extends string> = T extends `${string}{${infer Placeholder}}${infer Rest}`
  ? Placeholder | ExtractPlaceholders<Rest>
  : never

type BuildOptions<Locale extends string, Translations extends Record<string, string>> = {
  translations: TranslationMap<Locale, Translations>
}

export function buildTranslations<Locale extends string, Translations extends Record<string, string>>({
  translations,
}: BuildOptions<Locale, Translations>) {
  const cache = new Map<string, string | ((record: Record<string, string | ReactNode>) => string | ReactNode[])>()

  const getTranslations = (locale: Locale) => {
    return new Proxy(
      {},
      {
        get(_target, key: keyof Translations | symbol) {
          if (typeof key === 'symbol') return undefined
          const cacheKey = `${locale}:${key.toString()}`
          if (cache.has(cacheKey)) {
            return cache.get(cacheKey)
          }

          const template = translations[locale]?.[key as keyof Translations]
          if (template === undefined) return key.toString()

          const hasParams = /{\w+}/.test(template)
          if (!hasParams) {
            cache.set(cacheKey, template)
            return template
          }

          const fn = (record: Record<string, string | ReactNode>) => {
            const allStrings = Object.values(record).every((v) => typeof v === 'string')
            if (allStrings) {
              return template.replace(/{(\w+)}/g, (match, name) => (record[name] as string) ?? match)
            }
            return template
              .split(/{(\w+)}/)
              .map((part, i) => (i % 2 === 1 ? (record[part] ?? `{${part}}`) : part))
              .filter((part) => part !== '')
          }
          cache.set(cacheKey, fn)
          return fn
        },
      },
    ) as TranslationProxy<Translations>
  }

  return { getTranslations }
}
