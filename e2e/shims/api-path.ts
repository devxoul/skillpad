let cachedHome: string | null = null

export const homeDir = async () => {
  if (!cachedHome) {
    const res = await fetch('/__api/home')
    const data = (await res.json()) as { home: string }
    cachedHome = data.home
  }
  return cachedHome
}
