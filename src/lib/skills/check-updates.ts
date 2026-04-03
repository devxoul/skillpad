import { fetch } from '@tauri-apps/plugin-http'

import { readLockFile } from './lock-file'
import type { CheckUpdatesApiResult } from './types'

export async function checkUpdatesApi(): Promise<CheckUpdatesApiResult> {
  const lockFile = await readLockFile()

  const skillsToCheck = Object.entries(lockFile.skills).map(([name, skill]) => ({
    name,
    source: skill.source,
    path: skill.skillPath,
    skillFolderHash: skill.skillFolderHash,
  }))

  if (skillsToCheck.length === 0) {
    return { totalChecked: 0, updatesAvailable: [], errors: [] }
  }

  const response = await fetch('https://add-skill.vercel.sh/check-updates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills: skillsToCheck }),
  })

  if (!response.ok) {
    throw new Error(`Failed to check updates via API: API request failed with status ${response.status}`)
  }

  const data = (await response.json()) as {
    updates?: Array<{ name: string; source: string; currentHash: string; latestHash: string }>
    errors?: Array<{ name: string; source: string; error: string }>
  }

  return {
    totalChecked: skillsToCheck.length,
    updatesAvailable: data.updates ?? [],
    errors: data.errors ?? [],
  }
}
