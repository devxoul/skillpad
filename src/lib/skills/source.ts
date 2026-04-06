export interface GitHubSource {
  type: 'github'
  owner: string
  repo: string
  ref: string
  skillFilter?: string
}

export interface UrlSource {
  type: 'url'
  url: string
}

export type ParsedSource = GitHubSource | UrlSource

export function parseSource(input: string): ParsedSource {
  let normalized = input.trim()

  if (normalized.startsWith('https://github.com/')) {
    normalized = normalized.replace('https://github.com/', '')
  } else if (normalized.startsWith('github:')) {
    normalized = normalized.replace('github:', '')
  }

  if (looksLikeUrlSource(normalized)) {
    const url = new URL(withUrlProtocol(normalized))

    return {
      type: 'url',
      url: url.toString().replace(/\/$/, ''),
    }
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

function looksLikeUrlSource(value: string): boolean {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return true
  }

  const firstSegment = value.split('/')[0] ?? ''
  return firstSegment.includes('.')
}

function withUrlProtocol(value: string): string {
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
}
