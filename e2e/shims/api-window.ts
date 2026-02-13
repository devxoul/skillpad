export const getCurrentWindow = () => ({
  theme: async () => 'dark' as const,
  onThemeChanged: async () => () => {},
  onMoved: async () => () => {},
  onResized: async () => () => {},
})
