import { homeDir } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/core'
import { exists, remove } from '@tauri-apps/plugin-fs'

import { AGENTS, getAgentSkillsDir, getCanonicalSkillsDir } from './agents'
import { removeFromLockFile } from './lock-file'
import type { RemoveSkillOptions } from './types'

export async function removeSkill(name: string, options: RemoveSkillOptions = {}): Promise<void> {
  const { global: isGlobal = false, agents: agentFilter, cwd } = options

  const home = await homeDir()
  const canonicalDir = getCanonicalSkillsDir(isGlobal, home, cwd)
  const skillDir = `${canonicalDir}/${name}`

  const agentsToClean = agentFilter ? AGENTS.filter((a) => agentFilter.includes(a.id)) : AGENTS

  const cleanupErrors: Array<{ agentId: string; error: unknown }> = []
  for (const agent of agentsToClean) {
    const agentSkillsDir = getAgentSkillsDir(agent.id, isGlobal, home, cwd)
    if (!agentSkillsDir) continue

    const agentSkillPath = `${agentSkillsDir}/${name}`
    try {
      if (await exists(agentSkillPath)) {
        const isLink = await invoke<boolean>('is_symlink', { path: agentSkillPath })
        if (isLink) {
          await remove(agentSkillPath)
        } else {
          await remove(agentSkillPath, { recursive: true })
        }
      }
    } catch (err) {
      cleanupErrors.push({ agentId: agent.id, error: err })
    }
  }

  if (cleanupErrors.length > 0) {
    const names = cleanupErrors.map((e) => e.agentId).join(', ')
    console.error(`Failed to clean up agent skill paths for: ${names}`, cleanupErrors)
  }

  try {
    if (await exists(skillDir)) {
      await remove(skillDir, { recursive: true })
    }
  } catch (err) {
    throw new Error(`Failed to remove skill "${name}": ${err instanceof Error ? err.message : String(err)}`)
  }

  await removeFromLockFile(name)
}
