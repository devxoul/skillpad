export interface SkillInfo {
  name: string
  path: string
  agents: string[]
}

export interface AddSkillOptions {
  global?: boolean
  agents?: string[]
  skills?: string[]
  yes?: boolean
  cwd?: string
}

export interface RemoveSkillOptions {
  global?: boolean
  agents?: string[]
  cwd?: string
}

export interface ListSkillsOptions {
  global?: boolean
  agents?: string[]
  cwd?: string
}

export interface SkillLockFile {
  version: number
  skills: Record<
    string,
    {
      source: string
      sourceType: string
      sourceUrl: string
      skillPath?: string
      skillFolderHash: string
      installedAt: string
      updatedAt: string
    }
  >
}

export interface CheckUpdatesApiResult {
  totalChecked: number
  updatesAvailable: Array<{
    name: string
    source: string
    currentHash: string
    latestHash: string
  }>
  errors: Array<{
    name: string
    source: string
    error: string
  }>
}

export interface UpdateSkillsResult {
  updatedCount: number
  updatedSkills: string[]
}

export interface UpdateCheckResult {
  totalChecked: number
  updatesAvailable: SkillUpdate[]
  couldNotCheck: number
  errors?: Array<{
    name: string
    source: string
    error: string
  }>
}

export interface SkillUpdate {
  name: string
  source: string
}
