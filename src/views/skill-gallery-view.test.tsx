import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsProvider } from '@/contexts/projects-context'
import { ScrollRestorationProvider } from '@/contexts/scroll-context'
import * as skillsContext from '@/contexts/skills-context'
import { SkillsProvider } from '@/contexts/skills-context'
import { SkillGalleryView } from '@/views/skill-gallery-view'

const mockApiSkills = [
  { id: '1', skillId: 'react-hooks', name: 'React Hooks', installs: 1000, source: 'npm/packages' },
  {
    id: '2',
    skillId: 'typescript-basics',
    name: 'TypeScript Basics',
    installs: 500,
    source: 'npm/packages',
  },
  {
    id: '3',
    skillId: 'testing-library',
    name: 'Testing Library',
    installs: 800,
    source: 'npm/packages',
  },
]

let useGallerySkillsSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  useGallerySkillsSpy = spyOn(skillsContext, 'useGallerySkills').mockReturnValue({
    skills: mockApiSkills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      installs: skill.installs,
      topSource: skill.source,
    })),
    loading: false,
    error: null,
    lastFetched: Date.now(),
    refresh: async () => {},
    fetch: async () => {},
  })
})

afterEach(() => {
  useGallerySkillsSpy.mockRestore()
})

function renderWithProviders() {
  const result = render(
    <MemoryRouter>
      <ProjectsProvider>
        <SkillsProvider>
          <ScrollRestorationProvider>
            <SkillGalleryView />
          </ScrollRestorationProvider>
        </SkillsProvider>
      </ProjectsProvider>
    </MemoryRouter>,
  )

  // Assign queries to global screen object to work around the timing issue
  for (const key in result) {
    if (typeof result[key as keyof typeof result] === 'function') {
      ;(screen as any)[key] = result[key as keyof typeof result]
    }
  }

  return result
}

describe('SkillGalleryView', () => {
  it('renders gallery title and description', async () => {
    renderWithProviders()

    expect(screen.getByText('Skills Directory')).toBeInTheDocument()
    expect(screen.getByText('Browse and discover available skills')).toBeInTheDocument()
  })

  it('renders search input', async () => {
    renderWithProviders()

    const searchInput = screen.getByPlaceholderText('Search skills...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays skills after loading', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Basics')).toBeInTheDocument()
      expect(screen.getByText('Testing Library')).toBeInTheDocument()
    })
  })

  it('filters skills by substring match (case-insensitive)', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...') as HTMLInputElement
    fireEvent.input(searchInput, { target: { value: 'react' } })
    await new Promise((resolve) => setTimeout(resolve, 350))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
    })
  })

  it('filters skills with uppercase query', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('TypeScript Basics')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...') as HTMLInputElement
    fireEvent.input(searchInput, { target: { value: 'TYPESCRIPT' } })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /typescript basics/i })).toBeInTheDocument()
    })
  })

  it('shows "No skills match your search" when search yields no results', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...') as HTMLInputElement
    fireEvent.input(searchInput, { target: { value: 'nonexistent' } })

    expect(searchInput.value).toBe('nonexistent')
  })

  it('clears search when clearing input', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...') as HTMLInputElement
    fireEvent.input(searchInput, { target: { value: 'react' } })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
    })

    fireEvent.input(searchInput, { target: { value: '' } })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /typescript basics/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /testing library/i })).toBeInTheDocument()
    })
  })
})
