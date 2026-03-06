import type { PackageManager } from '@/types/preferences'
import { createCommand } from './command-queue'

const DETECTION_ORDER: PackageManager[] = ['bunx', 'pnpx', 'npx']
const DETECTION_TIMEOUT = 5_000

let cached: PackageManager | null = null

export async function isPackageManagerAvailable(pm: PackageManager): Promise<boolean> {
  try {
    const result = await Promise.race([
      createCommand(pm, ['--version']).execute(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${pm} detection timed out`)), DETECTION_TIMEOUT),
      ),
    ])
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
