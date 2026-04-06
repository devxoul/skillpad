export const config = {
  runtime: 'edge',
}

const UPSTREAM = 'https://skills.sh/api/search'
const OWNER_REPO_RE = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

interface Skill {
  id: string
  skillId: string
  name: string
  installs: number
  source: string
}

interface SearchResponse {
  query: string
  searchType: string
  skills: Skill[]
  count: number
  duration_ms: number
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

function jsonResponse(data: SearchResponse, ttl = 60): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}`,
    },
  })
}

async function fetchUpstream(query: string, limit: number): Promise<SearchResponse> {
  const url = `${UPSTREAM}?q=${encodeURIComponent(query)}&limit=${limit}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'skillpad-api' },
  })
  if (!response.ok) {
    throw new Error(`Upstream error: ${response.status}`)
  }
  const data = (await response.json()) as SearchResponse
  data.skills = data.skills.filter((s) => OWNER_REPO_RE.test(s.source))
  data.count = data.skills.length
  return data
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return jsonError(405, 'Method Not Allowed')
  }

  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit')) || 20, 200))

  if (!query.trim()) {
    return jsonResponse({ query, searchType: 'fuzzy', skills: [], count: 0, duration_ms: 0 })
  }

  try {
    const trimmed = query.trim()

    if (OWNER_REPO_RE.test(trimmed)) {
      const owner = trimmed.split('/')[0]!
      const [nameResults, sourceResults] = await Promise.all([fetchUpstream(trimmed, limit), fetchUpstream(owner, 200)])

      const sourceTarget = trimmed.toLowerCase()
      const sourceMatches = sourceResults.skills.filter((s) => s.source.toLowerCase() === sourceTarget)

      const seen = new Set<string>()
      const merged: Skill[] = []
      for (const s of [...sourceMatches, ...nameResults.skills]) {
        if (!seen.has(s.id)) {
          seen.add(s.id)
          merged.push(s)
        }
      }

      return jsonResponse({
        query: trimmed,
        searchType: 'source',
        skills: merged.slice(0, limit),
        count: Math.min(merged.length, limit),
        duration_ms: 0,
      })
    }

    const data = await fetchUpstream(trimmed, limit)
    return jsonResponse(data)
  } catch {
    return jsonError(502, 'Bad Gateway')
  }
}
