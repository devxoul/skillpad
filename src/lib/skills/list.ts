import { invoke } from '@tauri-apps/api/core'

import type { ListSkillsOptions, SkillInfo } from './types'

interface RustSkillEntry {
  name: string
  path: string
  agents: string[]
}

export async function listSkills(options: ListSkillsOptions = {}): Promise<SkillInfo[]> {
  const { global: isGlobal = false, cwd } = options

  try {
    const entries = await invoke<RustSkillEntry[]>('list_skills', {
      global: isGlobal,
      cwd: cwd ?? null,
    })
    return entries.map((e) => ({ name: e.name, path: e.path, agents: e.agents }))
  } catch {
    return []
  }
}
