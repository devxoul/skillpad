const proxyMap: Record<string, string> = {
  'https://skills.sh': '/__proxy/skills-sh',
  'https://raw.githubusercontent.com': '/__proxy/github-raw',
  'https://add-skill.vercel.sh': '/__proxy/add-skill',
  'https://api.github.com': '/__proxy/github-api',
}

export const fetch = (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
  const url = input instanceof Request ? input.url : input.toString()

  for (const [origin, prefix] of Object.entries(proxyMap)) {
    if (url.startsWith(origin)) {
      return window.fetch(url.replace(origin, prefix), init)
    }
  }

  if (url.startsWith('https://')) {
    const proxyUrl = `/__proxy/external/${encodeURIComponent(url)}`
    if (input instanceof Request) {
      return window.fetch(new Request(proxyUrl, input), init)
    }
    return window.fetch(proxyUrl, init)
  }

  return window.fetch(input, init)
}
