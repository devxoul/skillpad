import { defineI18nUI } from 'fumadocs-ui/i18n'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { i18n } from '@/lib/i18n/config'

export const i18nUI = defineI18nUI(i18n, {
  translations: {
    en: { displayName: 'English' },
    ko: { displayName: '한국어' },
    ja: { displayName: '日本語' },
    'zh-CN': { displayName: '中文(简体)' },
    'zh-TW': { displayName: '中文(繁體)' },
    es: { displayName: 'Español' },
    fr: { displayName: 'Français' },
    de: { displayName: 'Deutsch' },
  },
})

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: 'SkillPad',
    },
    i18n,
  }
}
