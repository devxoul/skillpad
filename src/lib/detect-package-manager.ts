import { Command } from '@tauri-apps/plugin-shell'
import type { PackageManager } from '@/types/preferences'

const DETECTION_ORDER: PackageManager[] = ['bunx', 'pnpx', 'npx']

let cached: PackageManager | null = null

export async function isPackageManagerAvailable(pm: PackageManager): Promise<boolean> {
  try {
    const result = await Command.create(pm, ['--version']).execute()
    return result.code === 0
  } catch {
    return false
  }
}

export async function detectPackageManager(): Promise<PackageManager> {
  if (cached) return cached

  const results = await Promise.all(
    DETECTION_ORDER.map(async (pm) => ({ pm, available: await isPackageManagerAvailable(pm) })),
  )

  const found = results.find((r) => r.available)
  cached = found?.pm ?? 'npx'
  return cached
}

export async function resolvePackageManager(preferred: PackageManager): Promise<PackageManager> {
  if (await isPackageManagerAvailable(preferred)) return preferred
  return detectPackageManager()
}

export function resetDetectionCache(): void {
  cached = null
}
