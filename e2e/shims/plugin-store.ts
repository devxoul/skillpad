export const Store = {
  load: async (filename: string) => {
    const storageKey = `skillpad-store:${filename}`

    function getData(): Record<string, unknown> {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || '{}')
      } catch {
        return {}
      }
    }

    return {
      get: async <T>(key: string): Promise<T | null> => {
        const data = getData()
        return (data[key] as T) ?? null
      },
      set: async (key: string, value: unknown) => {
        const data = getData()
        data[key] = value
        localStorage.setItem(storageKey, JSON.stringify(data))
      },
      save: async () => {},
    }
  },
}
