const proxyMap: Record<string, string> = {
  'https://skills.sh': '/__proxy/skills-sh',
  'https://raw.githubusercontent.com': '/__proxy/github-raw',
  'https://add-skill.vercel.sh': '/__proxy/add-skill',
}

export const fetch = (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
  const url = input instanceof Request ? input.url : input.toString()

  for (const [origin, prefix] of Object.entries(proxyMap)) {
    if (url.startsWith(origin)) {
      return window.fetch(url.replace(origin, prefix), init)
    }
  }

  return window.fetch(input, init)
}
