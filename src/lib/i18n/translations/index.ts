import type { Locale } from '../locale'
import type { TranslationMap } from '../translations'
import { buildTranslations } from '../translations'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { ja } from './ja'
import { ko } from './ko'
import { zhCN } from './zh-cn'
import { zhTW } from './zh-tw'

const translations = {
  en,
  ko,
  ja,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  fr,
  de,
} satisfies TranslationMap<Locale, typeof en>

export const { getTranslations } = buildTranslations<Locale, typeof en>({ translations })
