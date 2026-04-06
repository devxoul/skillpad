import { invoke } from '@tauri-apps/api/core'
import { homeDir } from '@tauri-apps/api/path'
import { exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs'

import { resolveInstallSource } from '@/lib/api'

import { getAgentSkillsDir, getCanonicalSkillsDir, needsSymlink } from './agents'
import { fetchSkillFiles, fetchTreeSha, listRepoSkills } from './github'
import { addToLockFile } from './lock-file'
import { parseSource } from './source'
import type { AddSkillOptions } from './types'
import { fetchUrlSkillFiles, listUrlSkills } from './url'

export async function addSkill(source: string, options: AddSkillOptions = {}): Promise<void> {
  const { global: isGlobal = false, agents: selectedAgents = [], skills: skillFilter, cwd } = options

  try {
    const parsed = parseSource(source)

    const home = await homeDir()
    const canonicalDir = getCanonicalSkillsDir(isGlobal, home, cwd)

    const skillsToInstall: string[] = skillFilter?.length
      ? skillFilter
      : 'skillFilter' in parsed && parsed.skillFilter
        ? [parsed.skillFilter]
        : parsed.type === 'github'
          ? await listRepoSkills(parsed.owner, parsed.repo)
          : await listUrlSkills(parsed.url)

    if (skillsToInstall.length === 0) {
      if (parsed.type === 'github') {
        skillsToInstall.push(parsed.repo)
      } else {
        throw new Error(`Could not determine skill name for ${source}`)
      }
    }

    const installGroups = new Map<string, string[]>()
    for (const skillName of skillsToInstall) {
      const resolvedSource = await resolveInstallSource(source, skillName)
      const existing = installGroups.get(resolvedSource) ?? []
      existing.push(skillName)
      installGroups.set(resolvedSource, existing)
    }

    for (const [resolvedSource, resolvedSkillNames] of installGroups) {
      const resolved = parseSource(resolvedSource)

      for (const skillName of resolvedSkillNames) {
        const skillDir = `${canonicalDir}/${skillName}`

        const files =
          resolved.type === 'github'
            ? await fetchSkillFiles(resolved.owner, resolved.repo, skillName, resolved.ref)
            : await fetchUrlSkillFiles(resolved.url, skillName, source)
        const treeSha =
          resolved.type === 'github' ? await fetchTreeSha(resolved.owner, resolved.repo, skillName, resolved.ref) : ''

        await mkdir(skillDir, { recursive: true })
        for (const file of files) {
          await writeSkillFile(skillDir, file.path, file.content)
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
                await writeSkillFile(linkPath, file.path, file.content)
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
          source: resolvedSource,
          sourceType: resolved.type,
          sourceUrl:
            resolved.type === 'github' ? `https://github.com/${resolved.owner}/${resolved.repo}.git` : resolved.url,
          skillPath: resolved.type === 'github' ? `skills/${skillName}` : undefined,
          skillFolderHash: treeSha,
          installedAt: existing.installedAt,
          updatedAt: now,
        })
      }
    }
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error(typeof err === 'string' ? err : 'Unknown error during skill installation')
  }
}

async function writeSkillFile(baseDir: string, relativePath: string, content: string): Promise<void> {
  const normalizedPath = normalizeRelativeSkillPath(relativePath)
  const parentPath = normalizedPath.split('/').slice(0, -1).join('/')

  if (parentPath) {
    await mkdir(`${baseDir}/${parentPath}`, { recursive: true })
  }

  await writeTextFile(`${baseDir}/${normalizedPath}`, content)
}

function normalizeRelativeSkillPath(relativePath: string): string {
  const normalizedPath = relativePath.replace(/^\//, '')
  const segments = normalizedPath.split('/').filter(Boolean)

  if (segments.length === 0 || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Invalid skill file path: ${relativePath}`)
  }

  return segments.join('/')
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
