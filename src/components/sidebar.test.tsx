import { SkillsProvider } from '@/contexts/skills-context'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from './sidebar'

vi.mock('@/hooks/use-projects', () => ({
  useProjects: vi.fn(() => ({
    projects: [],
    loading: false,
    importProject: vi.fn(),
    removeProject: vi.fn(),
    reorderProjects: vi.fn(),
  })),
}))

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <SkillsProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </SkillsProvider>,
  )
}

describe('Sidebar Component', () => {
  it('renders navigation sections correctly', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('Gallery')).toBeInTheDocument()
    expect(screen.getByText('Global Skills')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument()
    expect(screen.getByText('No projects')).toBeInTheDocument()
  })

  it('highlights active route correctly', () => {
    renderWithProviders(<Sidebar />, { route: '/global' })

    const globalLink = screen.getByText('Global Skills').closest('a')
    expect(globalLink).toHaveClass('bg-white/[0.12]')

    const galleryLink = screen.getByText('Gallery').closest('a')
    expect(galleryLink).not.toHaveClass('bg-white/[0.12]')
  })
})
