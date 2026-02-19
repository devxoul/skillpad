'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

const GITHUB_API = 'https://api.github.com/repos/devxoul/skillpad/releases/latest'
const GITHUB_RELEASES = 'https://github.com/devxoul/skillpad/releases'
const GITHUB_URL = 'https://github.com/devxoul/skillpad'

type Platform = 'macos' | 'windows' | 'unknown'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('win')) return 'windows'
  return 'unknown'
}

interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface Release {
  tag_name: string
  published_at: string
  html_url: string
  assets: ReleaseAsset[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function findAsset(assets: ReleaseAsset[], pattern: string): ReleaseAsset | undefined {
  return assets.find((a) => a.name.includes(pattern))
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>Light mode</title>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>Dark mode</title>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className={className}>
      <title>macOS</title>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={className}>
      <title>Windows</title>
      <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
    </svg>
  )
}

interface DownloadButtonProps {
  asset?: ReleaseAsset
  label: string
}

function DownloadButton({ asset, label }: DownloadButtonProps) {
  if (!asset) return null
  return (
    <a
      href={asset.browser_download_url}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </a>
  )
}

interface DownloadCardProps {
  platform: string
  icon: React.ReactNode
  requirement: string
  buttons: DownloadButtonProps[]
  recommended?: boolean
}

function DownloadCard({ platform, icon, requirement, buttons, recommended }: DownloadCardProps) {
  const availableButtons = buttons.filter((b) => b.asset)
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border p-8 text-center transition-all hover:shadow-md ${
        recommended
          ? 'border-zinc-900 bg-white shadow-lg dark:border-zinc-100 dark:bg-zinc-900/80'
          : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700'
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          Recommended
        </span>
      )}
      <div className="mb-4 flex h-20 w-20 items-center justify-center text-zinc-700 dark:text-zinc-300">{icon}</div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{platform}</h2>
      <p className="mt-2 mb-6 text-sm text-zinc-500 dark:text-zinc-400">{requirement}</p>
      <div className="flex w-full gap-3">
        {availableButtons.length > 0 ? (
          availableButtons.map((b) => <DownloadButton key={b.label} asset={b.asset} label={b.label} />)
        ) : (
          <span className="flex-1 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            Not available
          </span>
        )}
      </div>
    </div>
  )
}

export default function DownloadPage() {
  const [release, setRelease] = useState<Release | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const platform = useMemo(() => detectPlatform(), [])

  useEffect(() => {
    fetch(GITHUB_API)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data: Release) => setRelease(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const macDmg = release ? findAsset(release.assets, '-universal.dmg') : undefined
  const winExe = release ? findAsset(release.assets, '-x64-setup.exe') : undefined
  const winMsi = release ? findAsset(release.assets, '-x64-en-US.msi') : undefined

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            SkillPad
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/download"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Download
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
              Download SkillPad
            </h1>
            <p className="mt-4 text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
              Available for macOS and Windows. Free and open source.
            </p>
            {release && (
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
                Version {release.tag_name} &middot; Released {formatDate(release.published_at)}
              </p>
            )}
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-3xl">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Could not load release information.</p>
                <a
                  href={GITHUB_RELEASES}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                >
                  View releases on GitHub
                </a>
              </div>
            )}

            {release && (
              <div className="grid gap-6 sm:grid-cols-2">
                <DownloadCard
                  platform="macOS"
                  icon={<AppleIcon className="h-16 w-16" />}
                  requirement="macOS 10.15 or later"
                  buttons={[{ asset: macDmg, label: 'Universal' }]}
                  recommended={platform === 'macos' || platform === 'unknown'}
                />
                <DownloadCard
                  platform="Windows"
                  icon={<WindowsIcon className="h-16 w-16" />}
                  requirement="Windows 10 or later (64-bit)"
                  buttons={[
                    { asset: winExe, label: '.exe' },
                    { asset: winMsi, label: '.msi' },
                  ]}
                  recommended={platform === 'windows'}
                />
              </div>
            )}
          </div>
        </section>

        {release && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <a
                href={GITHUB_RELEASES}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                View all releases on GitHub &rarr;
              </a>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-zinc-500 sm:flex-row dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} SkillPad. All rights reserved.</p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
