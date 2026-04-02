export const config = {
  runtime: 'edge',
}

const UPSTREAMS: Record<string, string> = {
  github: 'https://api.github.com',
  raw: 'https://raw.githubusercontent.com',
  skills: 'https://skills.sh',
}

const DEFAULT_ACCEPT: Record<string, string> = {
  github: 'application/vnd.github+json',
  raw: '*/*',
  skills: 'application/json',
}

const CACHE_TTL: Record<string, number> = {
  github: 300,
  raw: 300,
  skills: 60,
}

const GITHUB_UPSTREAMS = new Set(['github', 'raw'])

const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'etag',
  'last-modified',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
]

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const url = new URL(request.url)
  const prefix = url.searchParams.get('u')
  const path = url.searchParams.get('p')

  const upstream = prefix ? UPSTREAMS[prefix] : undefined
  if (!upstream || !path) {
    return new Response('Not Found', { status: 404 })
  }

  const query = new URLSearchParams(url.searchParams)
  query.delete('u')
  query.delete('p')
  const queryString = query.toString()
  const upstreamUrl = `${upstream}/${path}${queryString ? `?${queryString}` : ''}`

  const headers: Record<string, string> = {
    Accept: request.headers.get('Accept') || DEFAULT_ACCEPT[prefix] || '*/*',
    'User-Agent': 'skillpad-api-proxy',
  }

  if (process.env.GITHUB_TOKEN && GITHUB_UPSTREAMS.has(prefix)) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const ifNoneMatch = request.headers.get('If-None-Match')
  if (ifNoneMatch) headers['If-None-Match'] = ifNoneMatch

  const ifModifiedSince = request.headers.get('If-Modified-Since')
  if (ifModifiedSince) headers['If-Modified-Since'] = ifModifiedSince

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
    })

    const responseHeaders = new Headers()
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = response.headers.get(name)
      if (value) responseHeaders.set(name, value)
    }

    if (response.ok) {
      const ttl = CACHE_TTL[prefix] || 60
      responseHeaders.set('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}`)
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch {
    return new Response('Bad Gateway', { status: 502 })
  }
}
