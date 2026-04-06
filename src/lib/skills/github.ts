import { fetch } from '@tauri-apps/plugin-http'

const PROXY_BASE = 'https://api.skillpad.dev'

interface GitHubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
  sha: string
}

interface GitHubTreeEntry {
  path: string
  type: 'blob' | 'tree'
  sha: string
}

interface GitHubTree {
  tree: GitHubTreeEntry[]
}

export interface SkillFileContent {
  path: string
  content: string
}

async function fetchBranch(owner: string, repo: string, branch: string): Promise<boolean> {
  try {
    const url = `${PROXY_BASE}/github/repos/${owner}/${repo}/branches/${branch}`
    const res = await fetch(url)
    return res.ok
  } catch {
    return false
  }
}

async function resolveRef(owner: string, repo: string, preferredRef: string): Promise<string> {
  if (await fetchBranch(owner, repo, preferredRef)) return preferredRef
  if (preferredRef !== 'master' && (await fetchBranch(owner, repo, 'master'))) return 'master'
  return preferredRef
}

export async function fetchSkillFiles(
  owner: string,
  repo: string,
  skillName: string,
  branch = 'main',
): Promise<SkillFileContent[]> {
  const ref = await resolveRef(owner, repo, branch)

  const paths = [`skills/${skillName}`, skillName]

  for (const skillPath of paths) {
    const url = `${PROXY_BASE}/github/repos/${owner}/${repo}/contents/${skillPath}?ref=${ref}`
    try {
      const res = await fetch(url)
      if (!res.ok) continue

      const data = (await res.json()) as GitHubFile[] | GitHubFile

      if (Array.isArray(data)) {
        const files = data.filter((f) => f.type === 'file')
        const contents = await Promise.all(
          files.map(async (file) => {
            const rawUrl = `${PROXY_BASE}/raw/${owner}/${repo}/${ref}/${file.path}`
            const rawRes = await fetch(rawUrl)
            if (!rawRes.ok) throw new Error(`Failed to download ${file.path}`)
            return { path: file.path.replace(`${skillPath}/`, ''), content: await rawRes.text() }
          }),
        )
        return contents
      }
    } catch {}
  }

  const rootSkillMdUrl = `${PROXY_BASE}/raw/${owner}/${repo}/${ref}/SKILL.md`
  try {
    const res = await fetch(rootSkillMdUrl)
    if (res.ok) {
      return [{ path: 'SKILL.md', content: await res.text() }]
    }
  } catch {}

  throw new Error(`Could not find skill "${skillName}" in ${owner}/${repo}`)
}

export async function fetchTreeSha(owner: string, repo: string, skillName: string, branch = 'main'): Promise<string> {
  const ref = await resolveRef(owner, repo, branch)
  const url = `${PROXY_BASE}/github/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`

  try {
    const res = await fetch(url)
    if (!res.ok) return ''

    const data = (await res.json()) as GitHubTree
    const skillPaths = [`skills/${skillName}`, skillName]

    for (const skillPath of skillPaths) {
      const entry = data.tree.find((e) => e.path === skillPath && e.type === 'tree')
      if (entry) return entry.sha
    }

    return ''
  } catch {
    return ''
  }
}

export async function listRepoSkills(owner: string, repo: string): Promise<string[]> {
  const url = `${PROXY_BASE}/github/repos/${owner}/${repo}/contents/skills`
  try {
    const res = await fetch(url)
    if (res.ok) {
      const data = (await res.json()) as GitHubFile[]
      if (Array.isArray(data)) {
        return data.filter((e) => e.type === 'dir').map((e) => e.name)
      }
    }

    const rootSkillMd = `${PROXY_BASE}/github/repos/${owner}/${repo}/contents/SKILL.md`
    const rootRes = await fetch(rootSkillMd)
    if (rootRes.ok) {
      return [repo]
    }

    return []
  } catch {
    return []
  }
}
