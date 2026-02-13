export const Store = {
  load: async (_filename: string) => {
    const storage = new Map<string, unknown>()
    return {
      get: async (key: string) => storage.get(key) ?? null,
      set: async (key: string, value: unknown) => {
        storage.set(key, value)
      },
      save: async () => {},
    }
  },
}
