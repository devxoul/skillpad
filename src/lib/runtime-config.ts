export const PINNED_BUN_VERSION = '1.2.10'

export function getBunDownloadUrl(version: string, os: string, arch: string): string {
  const platformMap: Record<string, Record<string, string>> = {
    darwin: {
      arm64: 'darwin-aarch64',
      x86_64: 'darwin-x64',
    },
    win32: {
      x86_64: 'windows-x64',
    },
  }

  const platform = platformMap[os]?.[arch]
  if (!platform) {
    throw new Error(`Unsupported platform: os=${os}, arch=${arch}`)
  }

  return `https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-${platform}.zip`
}

export function getBunSha256Url(version: string): string {
  return `https://github.com/oven-sh/bun/releases/download/bun-v${version}/SHASUMS256.txt`
}
