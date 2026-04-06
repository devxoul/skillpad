import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { ProjectsProvider } from '@/contexts/projects-context'
import { ScrollRestorationProvider } from '@/contexts/scroll-context'
import { SkillsProvider } from '@/contexts/skills-context'
import * as useRepoSkills from '@/hooks/use-repo-skills'
import * as api from '@/lib/api'
import * as projects from '@/lib/projects'
import * as skills from '@/lib/skills'
import { SkillDetailView } from '@/views/skill-detail-view'

let consoleErrorSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

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
let searchSkillsSpy: ReturnType<typeof spyOn>
let readLocalSkillMdSpy: ReturnType<typeof spyOn>
let listSkillsSpy: ReturnType<typeof spyOn>
let getRepoSkillsCacheSpy: ReturnType<typeof spyOn>

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
    searchSkillsSpy = spyOn(api, 'searchSkills').mockResolvedValue([])
    readLocalSkillMdSpy = spyOn(skills, 'readLocalSkillMd').mockRejectedValue(new Error('No local SKILL.md'))
    listSkillsSpy = spyOn(skills, 'listSkills').mockResolvedValue([])
    getRepoSkillsCacheSpy = spyOn(useRepoSkills, 'getRepoSkillsCache').mockReturnValue(new Map())
  })

  afterEach(() => {
    fetchSkillsSpy.mockRestore()
    fetchSkillReadmeSpy.mockRestore()
    searchSkillsSpy.mockRestore()
    readLocalSkillMdSpy.mockRestore()
    listSkillsSpy.mockRestore()
    getRepoSkillsCacheSpy.mockRestore()
  })

  it('renders loading skeletons initially', () => {
    renderWithProviders('vercel-labs/skills/test-skill')
    expect(document.querySelector('.animate-shimmer')).toBeInTheDocument()
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
      expect(screen.getByText("Couldn't load skill content")).toBeInTheDocument()
      expect(
        screen.getByText(
          "This skill may be part of a multi-skill repository where content can't be located automatically.",
        ),
      ).toBeInTheDocument()
      expect(screen.getByText('View on GitHub')).toBeInTheDocument()
    })
  })

  it('falls back to local SKILL.md when remote fetch fails', async () => {
    // given - skill exists in gallery but README fetch fails, local installed copy exists
    fetchSkillReadmeSpy.mockRejectedValue(new Error('Network error'))
    readLocalSkillMdSpy.mockResolvedValue('# Local Skill\n\nLocal content.')
    listSkillsSpy.mockResolvedValue([
      { name: 'test-skill', path: '/home/.agents/skills/test-skill', agents: ['claude'] },
    ])

    renderWithProviders('vercel-labs/skills/test-skill')

    await waitFor(() => {
      expect(screen.getAllByText('test-skill').length).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(screen.getByText('Local Skill')).toBeInTheDocument()
      expect(screen.getByText('Local content.')).toBeInTheDocument()
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

  describe('local fallback', () => {
    it('renders local-only skill when gallery has no match', async () => {
      // given - gallery returns skills but none match, installed cache has the skill
      fetchSkillsSpy.mockResolvedValue([])
      listSkillsSpy.mockResolvedValue([
        { name: 'local-skill', path: '/home/.agents/skills/local-skill', agents: ['claude'] },
      ])
      readLocalSkillMdSpy.mockResolvedValue('# Local Only\n\nLocal description.')

      renderWithProviders('local-skill')

      await waitFor(() => {
        expect(screen.getAllByText('local-skill').length).toBeGreaterThan(0)
      })

      await waitFor(() => {
        expect(screen.getByText('Local Only')).toBeInTheDocument()
      })
    })

    it('hides installs badge for local-only skill', async () => {
      // given - local-only skill has 0 installs
      fetchSkillsSpy.mockResolvedValue([])
      listSkillsSpy.mockResolvedValue([{ name: 'local-skill', path: '/home/.agents/skills/local-skill', agents: [] }])
      readLocalSkillMdSpy.mockResolvedValue('# Local Skill')

      renderWithProviders('local-skill')

      await waitFor(() => {
        expect(screen.getAllByText('local-skill').length).toBeGreaterThan(0)
      })

      expect(screen.queryByText(/installs/)).not.toBeInTheDocument()
    })

    it('hides GitHub button for local-only skill', async () => {
      // given - local-only skill has no topSource
      fetchSkillsSpy.mockResolvedValue([])
      listSkillsSpy.mockResolvedValue([{ name: 'local-skill', path: '/home/.agents/skills/local-skill', agents: [] }])
      readLocalSkillMdSpy.mockResolvedValue('# Local Skill')

      renderWithProviders('local-skill')

      await waitFor(() => {
        expect(screen.getAllByText('local-skill').length).toBeGreaterThan(0)
      })

      expect(screen.queryByRole('button', { name: /github/i })).not.toBeInTheDocument()
    })

    it('shows "installed locally" subtitle for local-only skill', async () => {
      // given - local-only skill with no remote source
      fetchSkillsSpy.mockResolvedValue([])
      listSkillsSpy.mockResolvedValue([{ name: 'local-skill', path: '/home/.agents/skills/local-skill', agents: [] }])
      readLocalSkillMdSpy.mockResolvedValue('# Local Skill')

      renderWithProviders('local-skill')

      await waitFor(() => {
        expect(screen.getByText('installed locally')).toBeInTheDocument()
      })
    })
  })

  describe('repo skill cache fallback', () => {
    it('renders skill from repo cache when not in gallery or installed', async () => {
      // given - gallery and installed return nothing, but repo cache has the skill
      fetchSkillsSpy.mockResolvedValue([])
      listSkillsSpy.mockResolvedValue([])
      fetchSkillReadmeSpy.mockResolvedValue('# Repo Skill\n\nFrom repo cache.')
      getRepoSkillsCacheSpy.mockReturnValue(
        new Map([
          [
            'xoul/skills',
            {
              skills: [
                { id: 'repo:xoul/skills:cool-skill', name: 'cool-skill', installs: 0, topSource: 'xoul/skills' },
              ],
              fetchedAt: Date.now(),
            },
          ],
        ]),
      )

      renderWithProviders('cool-skill')

      await waitFor(() => {
        expect(screen.getAllByText('cool-skill').length).toBeGreaterThan(0)
      })

      expect(screen.queryByText('Skill Not Found')).not.toBeInTheDocument()
    })
  })
})

describe('path skill fallback', () => {
  let fetchSkillsSpy: ReturnType<typeof spyOn>
  let fetchSkillReadmeSpy: ReturnType<typeof spyOn>
  let searchSkillsSpy: ReturnType<typeof spyOn>
  let readLocalSkillMdSpy: ReturnType<typeof spyOn>
  let listSkillsSpy: ReturnType<typeof spyOn>
  let getRepoSkillsCacheSpy: ReturnType<typeof spyOn>
  let getProjectsSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    fetchSkillsSpy = spyOn(api, 'fetchSkills').mockResolvedValue([])
    fetchSkillReadmeSpy = spyOn(api, 'fetchSkillReadme').mockResolvedValue('# Path Skill\n\nFrom path fallback.')
    searchSkillsSpy = spyOn(api, 'searchSkills').mockResolvedValue([])
    readLocalSkillMdSpy = spyOn(skills, 'readLocalSkillMd').mockRejectedValue(new Error('No local SKILL.md'))
    listSkillsSpy = spyOn(skills, 'listSkills').mockResolvedValue([])
    getRepoSkillsCacheSpy = spyOn(useRepoSkills, 'getRepoSkillsCache').mockReturnValue(new Map())
    getProjectsSpy = spyOn(projects, 'getProjects').mockResolvedValue([])
  })

  afterEach(() => {
    fetchSkillsSpy.mockRestore()
    fetchSkillReadmeSpy.mockRestore()
    searchSkillsSpy.mockRestore()
    readLocalSkillMdSpy.mockRestore()
    listSkillsSpy.mockRestore()
    getRepoSkillsCacheSpy.mockRestore()
    getProjectsSpy.mockRestore()
  })

  it('renders skill from path when not found in gallery or search', async () => {
    // given - gallery empty, search returns nothing, skill ID is 3-part path
    renderWithProviders('xoul/private-skills/my-agent')

    // then - should construct synthetic skill from path
    await waitFor(() => {
      expect(screen.getAllByText('my-agent').length).toBeGreaterThan(0)
    })

    expect(screen.queryByText('Skill Not Found')).not.toBeInTheDocument()
    expect(screen.getByText('xoul/private-skills')).toBeInTheDocument()
  })

  it('shows add button for path-based skill', async () => {
    renderWithProviders('xoul/private-skills/my-agent')

    await waitFor(() => {
      expect(screen.getAllByText('my-agent').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('fetches README using path-derived source', async () => {
    renderWithProviders('xoul/private-skills/my-agent')

    await waitFor(() => {
      expect(screen.getAllByText('my-agent').length).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(screen.getByText('Path Skill')).toBeInTheDocument()
      expect(screen.getByText('From path fallback.')).toBeInTheDocument()
    })
  })

  it('prefers gallery skill over path fallback when search finds it', async () => {
    // given - search returns the skill with richer data
    searchSkillsSpy.mockResolvedValue([
      { id: 'xoul/private-skills/my-agent', name: 'my-agent', installs: 42, topSource: 'xoul/private-skills' },
    ])

    renderWithProviders('xoul/private-skills/my-agent')

    await waitFor(() => {
      expect(screen.getAllByText('my-agent').length).toBeGreaterThan(0)
    })

    // then - should show install count from searched skill, not 0
    await waitFor(() => {
      expect(screen.getByText('42 installs')).toBeInTheDocument()
    })
  })

  it('uses path skill over same-name installed skill from different repo', async () => {
    // given - installed skill with same name but from a different source
    listSkillsSpy.mockResolvedValue([{ name: 'my-agent', path: '/home/.agents/skills/my-agent', agents: ['claude'] }])

    renderWithProviders('xoul/private-skills/my-agent')

    // then - should show path-derived source, not fall back to installed skill
    await waitFor(() => {
      expect(screen.getAllByText('my-agent').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('xoul/private-skills')).toBeInTheDocument()
    expect(screen.queryByText('installed locally')).not.toBeInTheDocument()
  })
})

describe('duplicate name resolution', () => {
  let fetchSkillsSpy: ReturnType<typeof spyOn>
  let fetchSkillReadmeSpy: ReturnType<typeof spyOn>
  let searchSkillsSpy: ReturnType<typeof spyOn>
  let readLocalSkillMdSpy: ReturnType<typeof spyOn>
  let listSkillsSpy: ReturnType<typeof spyOn>
  let getRepoSkillsCacheSpy: ReturnType<typeof spyOn>
  let getProjectsSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    fetchSkillsSpy = spyOn(api, 'fetchSkills').mockResolvedValue([])
    fetchSkillReadmeSpy = spyOn(api, 'fetchSkillReadme').mockResolvedValue('# Agent Slack\n\nMessenger agent.')
    getProjectsSpy = spyOn(projects, 'getProjects').mockResolvedValue([])
    searchSkillsSpy = spyOn(api, 'searchSkills').mockResolvedValue([
      {
        id: 'stablyai/agent-slack/agent-slack',
        name: 'agent-slack',
        installs: 161,
        topSource: 'stablyai/agent-slack',
      },
      {
        id: 'devxoul/agent-messenger/agent-slack',
        name: 'agent-slack',
        installs: 10,
        topSource: 'devxoul/agent-messenger',
      },
      {
        id: 'timpietrusky/agent-slack/agent-slack',
        name: 'agent-slack',
        installs: 2,
        topSource: 'timpietrusky/agent-slack',
      },
    ])
    readLocalSkillMdSpy = spyOn(skills, 'readLocalSkillMd').mockRejectedValue(new Error('No local SKILL.md'))
    listSkillsSpy = spyOn(skills, 'listSkills').mockResolvedValue([])
    getRepoSkillsCacheSpy = spyOn(useRepoSkills, 'getRepoSkillsCache').mockReturnValue(new Map())
  })

  afterEach(() => {
    fetchSkillsSpy.mockRestore()
    fetchSkillReadmeSpy.mockRestore()
    searchSkillsSpy.mockRestore()
    readLocalSkillMdSpy.mockRestore()
    listSkillsSpy.mockRestore()
    getRepoSkillsCacheSpy.mockRestore()
    getProjectsSpy.mockRestore()
  })

  it('resolves correct skill when multiple skills have same name', async () => {
    // given - gallery is empty, search returns 3 skills with same name but different topSource
    // when - navigating to the second skill's full ID path
    renderWithProviders('devxoul/agent-messenger/agent-slack')

    // then - should display the correct topSource for the target skill (devxoul/agent-messenger)
    // not the first skill's topSource (stablyai/agent-slack)
    await waitFor(() => {
      expect(screen.getAllByText('agent-slack').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('devxoul/agent-messenger')).toBeInTheDocument()
    expect(screen.queryByText('stablyai/agent-slack')).not.toBeInTheDocument()
  })

  it('resolves correct gallery skill even when same-named skill is installed', async () => {
    // given - installed skills resolve fast, search resolves slow (simulates real app
    // where installed cache is already populated before search completes)
    listSkillsSpy.mockResolvedValue([
      { name: 'agent-slack', path: '/home/.agents/skills/agent-slack', agents: ['claude'] },
    ])
    const searchResults = [
      { id: 'stablyai/agent-slack/agent-slack', name: 'agent-slack', installs: 161, topSource: 'stablyai/agent-slack' },
      {
        id: 'devxoul/agent-messenger/agent-slack',
        name: 'agent-slack',
        installs: 10,
        topSource: 'devxoul/agent-messenger',
      },
      {
        id: 'timpietrusky/agent-slack/agent-slack',
        name: 'agent-slack',
        installs: 2,
        topSource: 'timpietrusky/agent-slack',
      },
    ]
    searchSkillsSpy.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(searchResults), 50)))

    // when - navigating to a gallery skill's full ID path
    renderWithProviders('devxoul/agent-messenger/agent-slack')

    // then - should show the gallery skill's topSource, not fall back to installed skill
    await waitFor(
      () => {
        expect(screen.getByText('devxoul/agent-messenger')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
