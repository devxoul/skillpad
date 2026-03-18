import { GoogleAnalytics } from '@next/third-parties/google'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { i18n } from '@/lib/i18n/config'
import { i18nUI } from '@/lib/layout.shared'

import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = 'https://skillpad.dev'
const siteName = 'SkillPad'
const siteDescription =
  'A free, open-source desktop app for browsing, installing, and managing AI agent skills from skills.sh. Available for macOS and Windows.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Desktop GUI for AI Agent Skills`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'SkillPad',
    'skills.sh',
    'AI agent skills',
    'agent skills manager',
    'Claude Code skills',
    'Cursor skills',
    'Windsurf skills',
    'desktop app',
    'skill installer',
    'open source',
  ],
  authors: [{ name: 'devxoul', url: 'https://github.com/devxoul' }],
  creator: 'devxoul',
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} — Desktop GUI for AI Agent Skills`,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Desktop GUI for AI Agent Skills`,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ lang: string }>
  children: React.ReactNode
}>) {
  const { lang } = await params

  return (
    <html lang={lang} suppressHydrationWarning>
      <GoogleAnalytics gaId="G-0N1EC0X114" />
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <RootProvider i18n={i18nUI.provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  )
}
