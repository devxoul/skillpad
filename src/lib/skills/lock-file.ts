import { homeDir } from '@tauri-apps/api/path'
import { exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

import type { SkillLockFile } from './types'

async function getLockFilePath(): Promise<string> {
  const home = await homeDir()
  return `${home}/.agents/.skill-lock.json`
}

export async function readLockFile(): Promise<SkillLockFile> {
  const path = await getLockFilePath()
  try {
    const content = await readTextFile(path)
    return JSON.parse(content) as SkillLockFile
  } catch {
    return { version: 3, skills: {} }
  }
}

export async function writeLockFile(lock: SkillLockFile): Promise<void> {
  const path = await getLockFilePath()
  const dir = path.substring(0, path.lastIndexOf('/'))
  if (!(await exists(dir))) {
    await mkdir(dir, { recursive: true })
  }
  await writeTextFile(path, JSON.stringify(lock, null, 2))
}

export async function addToLockFile(name: string, entry: SkillLockFile['skills'][string]): Promise<void> {
  const lock = await readLockFile()
  lock.skills[name] = entry
  await writeLockFile(lock)
}

export async function removeFromLockFile(name: string): Promise<void> {
  const lock = await readLockFile()
  delete lock.skills[name]
  await writeLockFile(lock)
}
