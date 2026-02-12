import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProjectsProvider } from '@/contexts/projects-context'
import { ScrollRestorationProvider } from '@/contexts/scroll-context'
import { SkillsProvider } from '@/contexts/skills-context'
import * as api from '@/lib/api'
import { SkillDetailView } from '@/views/skill-detail-view'

const mockApiSkills = [
  {
    id: 'vercel-labs/skills/test-skill',
    skillId: 'test-skill',
    name: 'test-skill',
    installs: 1500,
    source: 'owner/repo',
  },
  {
    id: 'other-org/repo/another-skill',
    skillId: 'another-skill',
    name: 'another-skill',
    installs: 500,
    source: 'other/repo',
  },
]

let fetchSkillsSpy: ReturnType<typeof spyOn>
let fetchSkillReadmeSpy: ReturnType<typeof spyOn>

function renderWithProviders(skillId: string) {
  const result = render(
    <MemoryRouter initialEntries={[`/skill/${skillId}`]}>
      <ProjectsProvider>
        <SkillsProvider>
          <ScrollRestorationProvider>
            <Routes>
              <Route path="/skill/*" element={<SkillDetailView />} />
            </Routes>
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

describe('SkillDetailView', () => {
  beforeEach(() => {
    fetchSkillsSpy = spyOn(api, 'fetchSkills').mockResolvedValue(
      mockApiSkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        installs: skill.installs,
        topSource: skill.source,
      })),
    )
    fetchSkillReadmeSpy = spyOn(api, 'fetchSkillReadme').mockResolvedValue('# Test Skill\n\nThis is a test README.')
  })

  afterEach(() => {
    fetchSkillsSpy.mockRestore()
    fetchSkillReadmeSpy.mockRestore()
  })

  it('renders loading state initially', () => {
    renderWithProviders('vercel-labs/skills/test-skill')
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('displays skill info after loading', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('1.5K installs')).toBeInTheDocument()
    expect(screen.getByText('owner/repo')).toBeInTheDocument()
  })

  it('renders back button', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('renders add button', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('displays README content after loading', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Skill')).toBeInTheDocument()
      expect(screen.getByText('This is a test README.')).toBeInTheDocument()
    })
  })

  it('hides installation section when skill is not installed', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    expect(screen.queryByText('Installed')).not.toBeInTheDocument()
  })

  it('shows not found state for invalid skill ID', async () => {
    renderWithProviders('nonexistent-skill')

    await waitFor(() => {
      expect(screen.getByText('Skill Not Found')).toBeInTheDocument()
    })

    expect(screen.getByText(/Could not find skill/)).toBeInTheDocument()
  })

  it('handles README fetch error gracefully', async () => {
    fetchSkillReadmeSpy.mockRejectedValue(new Error('Failed to fetch SKILL.md for owner/repo'))

    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch SKILL.md/)).toBeInTheDocument()
    })
  })

  it('renders GitHub button', async () => {
    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    const githubButton = screen.getByRole('button', { name: /owner\/repo/i })
    expect(githubButton).toBeInTheDocument()
  })
})
