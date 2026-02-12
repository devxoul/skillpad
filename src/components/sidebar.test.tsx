import { describe, describe, expect, expect, it, it, mock, mock } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsProvider } from '@/contexts/projects-context'
import { Sidebar } from './sidebar'

mock.module('@/lib/projects', () => ({
  getProjects: mock(async () => []),
  importProject: mock(() => {}),
  removeProject: mock(() => {}),
  reorderProjects: mock(() => {}),
}))

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  const result = render(
    <ProjectsProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ProjectsProvider>,
  )

  // Assign queries to global screen object to work around the timing issue
  // Update screen with the latest queries from render
  for (const key in result) {
    if (typeof result[key as keyof typeof result] === 'function') {
      ;(screen as any)[key] = result[key as keyof typeof result]
    }
  }

  return result
}

describe('Sidebar Component', () => {
  it('renders navigation sections correctly', async () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('Skills Directory')).toBeDefined()
    expect(screen.getByText('Global Skills')).toBeDefined()
    expect(screen.getByText('Projects')).toBeDefined()
    expect(screen.getByRole('button', { name: /import/i })).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('No projects')).toBeDefined()
    })
  })

  it('highlights active route correctly', async () => {
    renderWithProviders(<Sidebar />, { route: '/global' })

    const globalLink = screen.getByText('Global Skills').closest('a')
    expect(globalLink?.classList.contains('bg-white/[0.12]')).toBe(true)

    const galleryLink = screen.getByText('Skills Directory').closest('a')
    expect(galleryLink?.classList.contains('bg-white/[0.12]')).toBe(false)
  })
})
