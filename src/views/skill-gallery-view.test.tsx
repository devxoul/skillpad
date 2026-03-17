import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { ProjectsProvider } from '@/contexts/projects-context'
import { ScrollRestorationProvider } from '@/contexts/scroll-context'
import { SearchPersistenceProvider } from '@/contexts/search-context'
import * as skillsContext from '@/contexts/skills-context'
import { SkillsProvider } from '@/contexts/skills-context'
import * as repoSkillsHook from '@/hooks/use-repo-skills'
import { SkillGalleryView } from '@/views/skill-gallery-view'

const mockGallerySkills = [
  { id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' },
  { id: '2', name: 'TypeScript Basics', installs: 500, topSource: 'npm/packages' },
  { id: '3', name: 'Testing Library', installs: 800, topSource: 'npm/packages' },
]

const mockSearch = mock<(query: string, limit?: number) => Promise<any[]>>()
const mockSetSearchCache = mock<(query: string, results: any[]) => void>()

let useGallerySkillsSpy: ReturnType<typeof spyOn>
let useRepoSkillsSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  mockSearch.mockResolvedValue([])
  mockSetSearchCache.mockImplementation(() => {})
  useGallerySkillsSpy = spyOn(skillsContext, 'useGallerySkills').mockReturnValue({
    skills: mockGallerySkills,
    loading: false,
    error: null,
    lastFetched: Date.now(),
    searchCache: {},
    setSearchCache: mockSetSearchCache,
    refresh: async () => {},
    fetch: async () => {},
    search: mockSearch,
  })
  useRepoSkillsSpy = spyOn(repoSkillsHook, 'useRepoSkills').mockReturnValue({
    skills: [],
    loading: false,
    error: null,
    repoQuery: null,
  })
})

afterEach(() => {
  useGallerySkillsSpy.mockRestore()
  useRepoSkillsSpy.mockRestore()
  mockSearch.mockClear()
  mockSetSearchCache.mockClear()
})

async function renderWithProviders() {
  const user = userEvent.setup({ delay: null })
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(
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
  })

  for (const key in result) {
    if (typeof result[key as keyof typeof result] === 'function') {
      ;(screen as any)[key] = result[key as keyof typeof result]
    }
  }

  return { ...result, user }
}

describe('SkillGalleryView', () => {
  it('renders gallery title and description', async () => {
    await renderWithProviders()

    expect(screen.getByText('Skills Directory')).toBeInTheDocument()
    expect(screen.getByText('Browse and discover available skills')).toBeInTheDocument()
  })

  it('renders search input', async () => {
    await renderWithProviders()

    const searchInput = screen.getByPlaceholderText('Search skills...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays skills after loading', async () => {
    await renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Basics')).toBeInTheDocument()
      expect(screen.getByText('Testing Library')).toBeInTheDocument()
    })
  })

  it('searches skills via API for queries >= 2 chars', async () => {
    mockSearch.mockResolvedValue([{ id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' }])
    const { user } = await renderWithProviders()

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
    const { user } = await renderWithProviders()

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
    const { user } = await renderWithProviders()

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
    const { user } = await renderWithProviders()

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
    const { user } = await renderWithProviders()

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

  it('uses cached search results instead of re-fetching', async () => {
    const cachedResults = [{ id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' }]
    useGallerySkillsSpy.mockReturnValue({
      skills: mockGallerySkills,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      searchCache: { react: cachedResults },
      setSearchCache: mockSetSearchCache,
      refresh: async () => {},
      fetch: async () => {},
      search: mockSearch,
    })

    const { user } = await renderWithProviders()

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'react')

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /react hooks/i })).toBeInTheDocument()
    })

    expect(mockSearch).not.toHaveBeenCalled()
  })

  it('caches search results after successful API search', async () => {
    const searchResults = [{ id: '1', name: 'React Hooks', installs: 1000, topSource: 'npm/packages' }]
    mockSearch.mockResolvedValue(searchResults)
    const { user } = await renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search skills...')
    await user.type(searchInput, 'react')

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('react')
    })

    await waitFor(() => {
      expect(mockSetSearchCache).toHaveBeenCalledWith('react', searchResults)
    })
  })

  describe('repo skills section', () => {
    it('shows section header with repo name when repoQuery is set', async () => {
      useRepoSkillsSpy.mockReturnValue({
        repoQuery: 'xoul/skills',
        loading: false,
        error: null,
        skills: [{ id: 'repo:xoul/skills:foo', name: 'foo', installs: 0, topSource: 'xoul/skills' }],
      })

      await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('Skills in xoul/skills')).toBeInTheDocument()
      })
    })

    it('shows loading skeletons when repo skills are loading', async () => {
      useRepoSkillsSpy.mockReturnValue({
        repoQuery: 'xoul/skills',
        loading: true,
        error: null,
        skills: [],
      })

      await renderWithProviders()

      await waitFor(() => {
        const skeletons = document.querySelectorAll('.animate-shimmer')
        expect(skeletons.length).toBeGreaterThan(0)
      })
    })

    it('shows error message when repo skills fetch fails', async () => {
      useRepoSkillsSpy.mockReturnValue({
        repoQuery: 'xoul/skills',
        loading: false,
        error: 'GitHub API rate limit exceeded. Try again later.',
        skills: [],
      })

      await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('GitHub API rate limit exceeded. Try again later.')).toBeInTheDocument()
      })
    })

    it('shows empty state when repo has no skills', async () => {
      useRepoSkillsSpy.mockReturnValue({
        repoQuery: 'xoul/skills',
        loading: false,
        error: null,
        skills: [],
      })

      await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('No skills found in this repository')).toBeInTheDocument()
      })
    })

    it('does not show repo section when repoQuery is null', async () => {
      // Default mock already returns repoQuery: null
      await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      expect(screen.queryByText(/Skills in/)).not.toBeInTheDocument()
    })
  })

  describe('direct skill path', () => {
    it('shows synthetic skill card when searching owner/repo/skill', async () => {
      mockSearch.mockResolvedValue([])
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search skills...')
      await user.type(searchInput, 'xoul/my-skills/agent-browser')

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /agent-browser/i })).toBeInTheDocument()
      })

      const link = screen.getByRole('link', { name: /agent-browser/i })
      expect(link).toHaveAttribute('href', '/skill/xoul/my-skills/agent-browser')
    })

    it('shows direct path skill as first result ahead of search results', async () => {
      mockSearch.mockResolvedValue([
        { id: 'other/repo/agent-browser', name: 'agent-browser', installs: 100, topSource: 'other/repo' },
      ])
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search skills...')
      await user.type(searchInput, 'xoul/my-skills/agent-browser')

      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /agent-browser/i })
        expect(links.length).toBeGreaterThanOrEqual(2)
        expect(links[0]).toHaveAttribute('href', '/skill/xoul/my-skills/agent-browser')
      })
    })

    it('does not show direct path skill for 2-segment query', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search skills...')
      await user.type(searchInput, 'xoul/skills')

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalled()
      })

      expect(screen.queryByRole('link', { name: /^skills$/i })).not.toBeInTheDocument()
    })
  })

  describe('multi-select', () => {
    it('shows selection action bar when a card is selected', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      expect(screen.queryByText(/skills? selected/)).not.toBeInTheDocument()

      const selectBtn = screen.getByRole('button', { name: /select skills/i })
      await user.click(selectBtn)

      const firstCard = screen.getByText('React Hooks').closest('[class*="rounded-lg"]')!
      await user.click(firstCard)

      await waitFor(() => {
        expect(screen.getByText('1 skill(s) selected')).toBeInTheDocument()
      })
    })

    it('selects a skill card in select mode', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const selectBtn = screen.getByRole('button', { name: /select skills/i })
      await user.click(selectBtn)

      const firstCard = screen.getByText('React Hooks').closest('[class*="rounded-lg"]')!
      await user.click(firstCard)

      await waitFor(() => {
        expect(screen.getByText('1 skill(s) selected')).toBeInTheDocument()
      })
    })

    it('shows selection action bar with correct count', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const selectBtn = screen.getByRole('button', { name: /select skills/i })
      await user.click(selectBtn)

      const firstCard = screen.getByText('React Hooks').closest('[class*="rounded-lg"]')!
      await user.click(firstCard)

      await waitFor(() => {
        expect(screen.getByText('1 skill(s) selected')).toBeInTheDocument()
      })

      const secondCard = screen.getByText('TypeScript Basics').closest('[class*="rounded-lg"]')!
      await user.click(secondCard)

      await waitFor(() => {
        expect(screen.getByText('2 skill(s) selected')).toBeInTheDocument()
      })
    })

    it('clears selection when Deselect is clicked', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const selectBtn = screen.getByRole('button', { name: /select skills/i })
      await user.click(selectBtn)

      const firstCard = screen.getByText('React Hooks').closest('[class*="rounded-lg"]')!
      await user.click(firstCard)

      await waitFor(() => {
        expect(screen.getByText('1 skill(s) selected')).toBeInTheDocument()
      })

      const deselectBtn = screen.getByRole('button', { name: /deselect/i })
      await user.click(deselectBtn)

      await waitFor(() => {
expect(screen.queryByText(/skill\(s\) selected/)).not.toBeInTheDocument()
      })
    })

    it('opens batch dialog when Add Selected is clicked', async () => {
      const { user } = await renderWithProviders()

      await waitFor(() => {
        expect(screen.getByText('React Hooks')).toBeInTheDocument()
      })

      const selectBtn = screen.getByRole('button', { name: /select skills/i })
      await user.click(selectBtn)

      const firstCard = screen.getByText('React Hooks').closest('[class*="rounded-lg"]')!
      await user.click(firstCard)

      await waitFor(() => {
        expect(screen.getByText('1 skill(s) selected')).toBeInTheDocument()
      })

      const addBtn = screen.getByRole('button', { name: /add selected/i })
      await user.click(addBtn)

      await waitFor(() => {
        expect(screen.getByText('Add 1 skill')).toBeInTheDocument()
      })
    })
  })
})
