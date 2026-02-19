import type { Metadata } from 'next'
import { HomePage } from './home-page'

export const metadata: Metadata = {
  title: 'SkillPad — Browse, Install, and Manage AI Agent Skills',
  description:
    'SkillPad is a free, open-source desktop GUI for skills.sh. Browse skills from the gallery, install to any agent in one click, and manage global plus project-scoped skills. Available for macOS and Windows.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SkillPad — Browse, Install, and Manage AI Agent Skills',
    description: 'A free, open-source desktop GUI for skills.sh. Browse, install, and manage AI agent skills visually.',
    url: '/',
  },
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
