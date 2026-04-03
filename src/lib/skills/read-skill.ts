import { invoke } from '@tauri-apps/api/core'

import { readLockFile } from './lock-file'

export async function readLocalSkillMd(skillPath: string): Promise<string> {
  const resolvedPath = skillPath.startsWith('~')
    ? skillPath.replace('~', await invoke<string>('home_dir'))
    : skillPath

  const paths = [`${resolvedPath}/SKILL.md`, resolvedPath]

  for (const path of paths) {
    try {
      const content = await invoke<string>('read_text_file', { path })
      if (content.trim()) return content
    } catch {}
  }

  throw new Error(`No local SKILL.md found at ${skillPath}`)
}

export async function readSkillSources(): Promise<Record<string, string>> {
  try {
    const lockFile = await readLockFile()
    const sources: Record<string, string> = {}
    for (const [name, skill] of Object.entries(lockFile.skills)) {
      sources[name] = skill.source
    }
    return sources
  } catch {
    return {}
  }
}
