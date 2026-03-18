import type { Metadata } from 'next'

import type { Locale } from '@/lib/i18n/locale'
import { getTranslations } from '@/lib/i18n/translations/index'

import { HomePage } from './home-page'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params
  const t = getTranslations(lang as Locale)

  return {
    title: `SkillPad — ${t.home_hero_title}`,
    description: t.home_hero_description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `SkillPad — ${t.home_hero_title}`,
      description: t.home_hero_description,
      url: '/',
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SkillPad',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows',
  description: 'A free, open-source desktop GUI for browsing, installing, and managing AI agent skills from skills.sh.',
  url: 'https://skillpad.dev',
  downloadUrl: 'https://skillpad.dev/download',
  softwareHelp: {
    '@type': 'WebPage',
    url: 'https://skillpad.dev/docs',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'devxoul',
    url: 'https://github.com/devxoul',
  },
  isAccessibleForFree: true,
  license: 'https://opensource.org/licenses/MIT',
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  )
}
