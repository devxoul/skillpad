import { fetch } from '@tauri-apps/plugin-http'

const PROXY_BASE = 'https://api.skillpad.dev'

import type { SkillFileContent } from './github'

interface WellKnownSkillEntry {
  name?: string
  files?: unknown
}

interface WellKnownSkillsResponse {
  skills?: WellKnownSkillEntry[]
}

export async function fetchUrlSkillFiles(
  sourceUrl: string,
  skillName: string,
  fallbackGallerySource?: string,
): Promise<SkillFileContent[]> {
  try {
    const manifest = await fetchManifest(sourceUrl)
    const manifestSkill = manifest.skills?.find((entry) => entry.name === skillName)
    const manifestFiles = Array.isArray(manifestSkill?.files)
      ? manifestSkill.files.filter((file): file is string => typeof file === 'string')
      : []

    if (manifestFiles.length > 0) {
      return Promise.all(
        manifestFiles.map(async (file) => ({
          path: normalizeSkillFilePath(file, skillName),
          content: await fetchText(resolveUrl(sourceUrl, file)),
        })),
      )
    }

    return [
      {
        path: 'SKILL.md',
        content: await fetchText(resolveUrl(sourceUrl, 'SKILL.md')),
      },
    ]
  } catch (error) {
    if (!fallbackGallerySource || looksLikeDirectUrlInput(fallbackGallerySource)) {
      throw error
    }

    return [
      {
        path: 'SKILL.md',
        content: await fetchRenderedSkillPage(fallbackGallerySource, skillName),
      },
    ]
  }
}

export async function listUrlSkills(sourceUrl: string): Promise<string[]> {
  const manifest = await fetchManifest(sourceUrl)

  return Array.isArray(manifest.skills)
    ? manifest.skills.map((entry) => entry.name).filter((name): name is string => Boolean(name))
    : []
}

async function fetchManifest(sourceUrl: string): Promise<WellKnownSkillsResponse> {
  const candidates = ['.well-known/skills', '.well-known/skills/']

  for (const candidate of candidates) {
    const response = await fetch(proxyExternalUrl(resolveUrl(sourceUrl, candidate)))
    if (!response.ok) {
      continue
    }

    return (await response.json()) as WellKnownSkillsResponse
  }

  throw new Error(`Failed to fetch skill manifest from ${sourceUrl}`)
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(proxyExternalUrl(url))
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  return response.text()
}

function resolveUrl(baseUrl: string, file: string): string {
  return new URL(file.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString()
}

function proxyExternalUrl(url: string): string {
  return `${PROXY_BASE}/api/proxy?u=external&p=${encodeURIComponent(url)}`
}

async function fetchRenderedSkillPage(source: string, skillName: string): Promise<string> {
  const response = await fetch(`${PROXY_BASE}/skills/${source}/${skillName}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch rendered skill page for ${source}/${skillName}`)
  }

  const html = await response.text()
  return extractSkillMarkdownFromPage(html, skillName)
}

function extractSkillMarkdownFromPage(html: string, skillName: string): string {
  if (typeof DOMParser === 'undefined') {
    return extractSkillMarkdownFromHtmlFallback(html, skillName)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const sections = Array.from(doc.querySelectorAll('div.prose'))
  const contentRoot = sections[1] ?? sections[0]

  if (!contentRoot) {
    throw new Error(`Failed to parse rendered skill page for ${skillName}`)
  }

  const content = renderNodesToMarkdown(Array.from(contentRoot.childNodes)).trim()
  if (!content) {
    throw new Error(`Rendered skill page was empty for ${skillName}`)
  }

  return content
}

function extractSkillMarkdownFromHtmlFallback(html: string, skillName: string): string {
  const proseSections = Array.from(html.matchAll(/<div[^>]*class="[^"]*prose[^"]*"[^>]*>([\s\S]*?)<\/div>/g))
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const headingIndex = html.search(/<h1[^>]*>/i)
  const section =
    proseSections[1]?.[1] ??
    proseSections[0]?.[1] ??
    bodyMatch?.[1] ??
    (headingIndex >= 0 ? html.slice(headingIndex) : html)

  const content = section
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '### $1\n\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
    .replace(/\n{3,}/g, '\n\n')

  if (!content) {
    throw new Error(`Rendered skill page was empty for ${skillName}`)
  }

  return content
}

function renderNodesToMarkdown(nodes: ChildNode[]): string {
  return nodes
    .map((node) => renderNodeToMarkdown(node))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
}

function renderNodeToMarkdown(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }

  if (!(node instanceof HTMLElement)) {
    return ''
  }

  const children = renderNodesToMarkdown(Array.from(node.childNodes)).trim()

  switch (node.tagName) {
    case 'H1':
      return `# ${children}\n\n`
    case 'H2':
      return `## ${children}\n\n`
    case 'H3':
      return `### ${children}\n\n`
    case 'H4':
      return `#### ${children}\n\n`
    case 'P':
      return `${children}\n\n`
    case 'UL':
      return `${Array.from(node.children)
        .map((child) => `- ${renderNodesToMarkdown(Array.from(child.childNodes)).trim()}`)
        .join('\n')}\n\n`
    case 'OL':
      return `${Array.from(node.children)
        .map((child, index) => `${index + 1}. ${renderNodesToMarkdown(Array.from(child.childNodes)).trim()}`)
        .join('\n')}\n\n`
    case 'PRE':
      return `\n\`\`\`\n${node.textContent?.trim() ?? ''}\n\`\`\`\n\n`
    case 'CODE':
      return children.includes('\n') ? children : `\`${children}\``
    case 'A':
      return children || node.getAttribute('href') || ''
    case 'STRONG':
      return `**${children}**`
    case 'EM':
      return `*${children}*`
    case 'LI':
    case 'DIV':
    case 'SECTION':
    case 'SPAN':
      return `${children}${children ? '\n\n' : ''}`
    default:
      return `${children}${children ? '\n\n' : ''}`
  }
}

function looksLikeDirectUrlInput(source: string): boolean {
  if (source.startsWith('http://') || source.startsWith('https://')) return true
  const firstSegment = source.split('/')[0] ?? ''
  return firstSegment.includes('.')
}

function normalizeSkillFilePath(file: string, skillName: string): string {
  const normalized = file.replace(/^\//, '')
  const skillsPrefix = `skills/${skillName}/`
  const skillPrefix = `${skillName}/`

  if (normalized.startsWith(skillsPrefix)) {
    return normalized.slice(skillsPrefix.length)
  }

  if (normalized.startsWith(skillPrefix)) {
    return normalized.slice(skillPrefix.length)
  }

  return normalized
}
