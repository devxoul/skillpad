import { invoke } from '@tauri-apps/api/core'

import type { PackageManager } from '@/types/preferences'

let cachedResult: PackageManager | null = null

export async function detectPackageManager(): Promise<PackageManager> {
  if (cachedResult) return cachedResult
  try {
    const candidates: PackageManager[] = ['bunx', 'pnpx', 'npx']
    const results = await invoke<boolean[]>('check_commands_on_path', { commands: candidates })
    const found = candidates.find((_, i) => results[i]) ?? 'npx'
    cachedResult = found
    return found
  } catch {
    return 'npx'
  }
}

export async function isPackageManagerAvailable(pm: PackageManager): Promise<boolean> {
  try {
    const results = await invoke<boolean[]>('check_commands_on_path', { commands: [pm] })
    return results[0] ?? false
  } catch {
    return false
  }
}

export function resetDetectionCache(): void {
  cachedResult = null
}
