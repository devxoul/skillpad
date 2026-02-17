import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsProvider } from '@/contexts/projects-context'
import { ScrollRestorationProvider } from '@/contexts/scroll-context'
import { SearchPersistenceProvider } from '@/contexts/search-context'
import * as skillsContext from '@/contexts/skills-context'
import { SkillsProvider } from '@/contexts/skills-context'
import { SkillGalleryView } from '@/views/skill-gallery-view'

const mockGallerySkills = [
  { id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' },
  { id: '2', name: 'TypeScript Basics', installs: 500, topSource: 'npm/packages' },
  { id: '3', name: 'Testing Library', installs: 800, topSource: 'npm/packages' },
]

const mockSearch = mock<(query: string, limit?: number) => Promise<any[]>>()

let useGallerySkillsSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  mockSearch.mockResolvedValue([])
  useGallerySkillsSpy = spyOn(skillsContext, 'useGallerySkills').mockReturnValue({
    skills: mockGallerySkills,
    loading: false,
    error: null,
    lastFetched: Date.now(),
    refresh: async () => {},
    fetch: async () => {},
    search: mockSearch,
  })
})

afterEach(() => {
  useGallerySkillsSpy.mockRestore()
  mockSearch.mockClear()
})

function renderWithProviders() {
  const user = userEvent.setup({ delay: null })
  const result = render(
    <MemoryRouter>
      <SearchPersistenceProvider>
        <ProjectsProvider>
          <SkillsProvider>
            <ScrollRestorationProvider>
              <SkillGalleryView />
            </ScrollRestorationProvider>
          </SkillsProvider>
        </ProjectsProvider>
      </SearchPersistenceProvider>
    </MemoryRouter>,
  )

  // Assign queries to global screen object to work around the timing issue
  for (const key in result) {
    if (typeof result[key as keyof typeof result] === 'function') {
      ;(screen as any)[key] = result[key as keyof typeof result]
    }
  }

  return { ...result, user }
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

  it('searches skills via API for queries >= 2 chars', async () => {
    mockSearch.mockResolvedValue([{ id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' }])
    const { user } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'react')

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('react')
    })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
    })
  })

  it('filters locally for single char queries', async () => {
    const { user } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'r')

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
    })

    expect(mockSearch).not.toHaveBeenCalled()
  })

  it('shows "No skills match your search" when API returns no results', async () => {
    mockSearch.mockResolvedValue([])
    const { user } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'nonexistent')

    await waitFor(() => {
      expect(screen.getByText('No skills match your search')).toBeInTheDocument()
    })
  })

  it('shows error when search API fails', async () => {
    mockSearch.mockRejectedValue(new Error('Network error: Connection refused'))
    const { user } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'react')

    await waitFor(() => {
      expect(screen.getByText('Network error: Connection refused')).toBeInTheDocument()
    })
  })

  it('clears search and shows all gallery skills', async () => {
    mockSearch.mockResolvedValue([{ id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' }])
    const { user } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'react')

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('react')
    })

    const clearButton = screen.getByLabelText('Clear search')
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /typescript basics/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /testing library/i })).toBeInTheDocument()
    })
  })
})
