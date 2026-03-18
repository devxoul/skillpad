import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import { docs, meta } from 'fumadocs-mdx:collections/server'
import { icons } from 'lucide-react'
import { createElement } from 'react'

import { i18n } from '@/lib/i18n/config'

export const source = loader({
  i18n,
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta),
  icon(icon) {
    if (icon && icon in icons) {
      return createElement(icons[icon as keyof typeof icons])
    }
  },
})
