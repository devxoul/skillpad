import type { MetadataRoute } from 'next'

import { i18n } from '@/lib/i18n/config'
import { source } from '@/lib/source'

const baseUrl = 'https://skillpad.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const lang of i18n.languages) {
    const prefix = lang === i18n.defaultLanguage ? '' : `/${lang}`

    entries.push({
      url: `${baseUrl}${prefix || '/'}`,
      changeFrequency: 'weekly',
      priority: lang === i18n.defaultLanguage ? 1 : 0.8,
    })

    entries.push({
      url: `${baseUrl}${prefix}/download`,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    const docPages = source.getPages(lang).map((page) => ({
      url: `${baseUrl}${prefix}${page.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    entries.push(...docPages)
  }

  return entries
}
