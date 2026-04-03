export interface ParsedSource {
  type: 'github'
  owner: string
  repo: string
  ref: string
  skillFilter?: string
}

export function parseSource(input: string): ParsedSource {
  let normalized = input.trim()

  if (normalized.startsWith('https://github.com/')) {
    normalized = normalized.replace('https://github.com/', '')
  } else if (normalized.startsWith('github:')) {
    normalized = normalized.replace('github:', '')
  }

  const parts = normalized.split('/')
  const owner = parts[0] ?? ''
  const repo = parts[1] ?? ''
  const skillFilter = parts[2]

  if (!owner || !repo) {
    throw new Error(`Invalid skill source: ${input}`)
  }

  return {
    type: 'github',
    owner,
    repo,
    ref: 'main',
    skillFilter,
  }
}

export function sourceToString(owner: string, repo: string): string {
  return `${owner}/${repo}`
}
