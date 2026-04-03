import { homeDir } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/core'
import { exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs'

import { getAgentSkillsDir, getCanonicalSkillsDir, needsSymlink } from './agents'
import { fetchSkillFiles, fetchTreeSha, listRepoSkills } from './github'
import { addToLockFile } from './lock-file'
import { parseSource } from './source'
import type { AddSkillOptions } from './types'

export async function addSkill(source: string, options: AddSkillOptions = {}): Promise<void> {
  const { global: isGlobal = false, agents: selectedAgents = [], skills: skillFilter, cwd } = options

  try {
    const parsed = parseSource(source)
    const { owner, repo, ref } = parsed

    const home = await homeDir()
    const canonicalDir = getCanonicalSkillsDir(isGlobal, home, cwd)

    const skillsToInstall: string[] = skillFilter?.length
      ? skillFilter
      : parsed.skillFilter
        ? [parsed.skillFilter]
        : await listRepoSkills(owner, repo)

    if (skillsToInstall.length === 0) {
      skillsToInstall.push(repo)
    }

    for (const skillName of skillsToInstall) {
      const skillDir = `${canonicalDir}/${skillName}`

      const files = await fetchSkillFiles(owner, repo, skillName, ref)
      const treeSha = await fetchTreeSha(owner, repo, skillName, ref)

      await mkdir(skillDir, { recursive: true })
      for (const file of files) {
        await writeTextFile(`${skillDir}/${file.name}`, file.content)
      }

      const agentErrors: Array<{ agentId: string; error: unknown }> = []
      for (const agentId of selectedAgents) {
        if (!needsSymlink(agentId, isGlobal)) continue

        const agentSkillsDir = getAgentSkillsDir(agentId, isGlobal, home, cwd)
        if (!agentSkillsDir) continue

        const linkPath = `${agentSkillsDir}/${skillName}`

        try {
          await invoke('create_symlink', { target: skillDir, linkPath })
        } catch {
          try {
            if (!(await exists(agentSkillsDir))) {
              await mkdir(agentSkillsDir, { recursive: true })
            }
            for (const file of files) {
              await writeTextFile(`${linkPath}/${file.name}`, file.content)
            }
          } catch (copyErr) {
            agentErrors.push({ agentId, error: copyErr })
          }
        }
      }

      if (agentErrors.length > 0) {
        const names = agentErrors.map((e) => e.agentId).join(', ')
        throw new Error(`Failed to install skill "${skillName}" for agents: ${names}`)
      }

      const now = new Date().toISOString()
      const existing = (await readLockFileEntry(skillName)) ?? { installedAt: now }

      await addToLockFile(skillName, {
        source: `${owner}/${repo}`,
        sourceType: 'github',
        sourceUrl: `https://github.com/${owner}/${repo}.git`,
        skillPath: `skills/${skillName}`,
        skillFolderHash: treeSha,
        installedAt: existing.installedAt,
        updatedAt: now,
      })
    }
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error(typeof err === 'string' ? err : 'Unknown error during skill installation')
  }
}

async function readLockFileEntry(name: string): Promise<{ installedAt: string } | null> {
  try {
    const { readLockFile } = await import('./lock-file')
    const lock = await readLockFile()
    const entry = lock.skills[name]
    return entry ? { installedAt: entry.installedAt } : null
  } catch {
    return null
  }
}
