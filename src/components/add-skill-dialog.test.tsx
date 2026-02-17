import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AddSkillDialog } from '@/components/add-skill-dialog'
import { ProjectsProvider } from '@/contexts/projects-context'
import { SkillsProvider } from '@/contexts/skills-context'
import * as cli from '@/lib/cli'
import * as projects from '@/lib/projects'
import type { Skill } from '@/types/skill'

const mockSkill: Skill = {
  id: 'skill-1',
  name: 'test-skill',
  installs: 100,
  topSource: 'github:test/skill',
}

const defaultAgents: string[] = []

function renderWithProvider(ui: React.ReactElement) {
  const result = render(
    <ProjectsProvider>
      <SkillsProvider>{ui}</SkillsProvider>
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

describe('AddSkillDialog', () => {
  let addSkillSpy: ReturnType<typeof spyOn>
  let getProjectsSpy: ReturnType<typeof spyOn>
  let importProjectSpy: ReturnType<typeof spyOn>
  let removeProjectSpy: ReturnType<typeof spyOn>
  let reorderProjectsSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    addSkillSpy = spyOn(cli, 'addSkill').mockResolvedValue(undefined)
    getProjectsSpy = spyOn(projects, 'getProjects').mockResolvedValue([
      { id: 'proj-1', name: 'Project A', path: '/path/to/project-a' },
      { id: 'proj-2', name: 'Project B', path: '/path/to/project-b' },
    ])
    importProjectSpy = spyOn(projects, 'importProject').mockResolvedValue(null)
    removeProjectSpy = spyOn(projects, 'removeProject').mockResolvedValue(undefined)
    reorderProjectsSpy = spyOn(projects, 'reorderProjects').mockResolvedValue(undefined)
  })

  afterEach(() => {
    addSkillSpy.mockRestore()
    getProjectsSpy.mockRestore()
    importProjectSpy.mockRestore()
    removeProjectSpy.mockRestore()
    reorderProjectsSpy.mockRestore()
  })

  it('renders correctly when open', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    expect(screen.getByText('Add test-skill')).toBeInTheDocument()
    expect(screen.getByText('Install to')).toBeInTheDocument()
    expect(screen.getByText('Agents')).toBeInTheDocument()
  })

  it('shows Global option checked by default', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    expect(screen.getByText('Global')).toBeInTheDocument()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
  })

  it('shows projects in the install list', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument()
      expect(screen.getByText('Project B')).toBeInTheDocument()
    })
  })

  it('allows selecting multiple targets (Global + Projects)', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Project A'))

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('allows selecting agents', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const firstAgentIndex = 3
    const firstAgentCheckbox = checkboxes[firstAgentIndex]!

    expect(firstAgentCheckbox).not.toBeChecked()

    fireEvent.click(firstAgentCheckbox)

    expect(firstAgentCheckbox).toBeChecked()
  })

  it('disables Add button when no agents selected', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    const addButton = screen.getByRole('button', { name: 'Add' })
    expect(addButton).toBeDisabled()
  })

  it('disables Add button when no targets selected', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0]!)
    fireEvent.click(checkboxes[3]!)

    const addButton = screen.getByRole('button', { name: 'Add' })
    expect(addButton).toBeDisabled()
  })

  it('calls addSkill for Global when Global is selected', async () => {
    const onOpenChange = mock(() => {})

    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={onOpenChange} defaultAgents={defaultAgents} />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[3]!)

    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(addSkillSpy).toHaveBeenCalledWith(
        'github:test/skill',
        expect.objectContaining({
          global: true,
          agents: expect.any(Array),
          yes: true,
        }),
      )
    })

    expect(await screen.findByText(/added to 1 target/i)).toBeInTheDocument()
  })

  it('calls addSkill for both Global and Project when both are selected', async () => {
    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Project A'))
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[3]!)

    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(addSkillSpy).toHaveBeenCalledTimes(2)
      expect(addSkillSpy).toHaveBeenCalledWith('github:test/skill', expect.objectContaining({ global: true }))
      expect(addSkillSpy).toHaveBeenCalledWith(
        'github:test/skill',
        expect.objectContaining({ cwd: '/path/to/project-a' }),
      )
    })

    expect(await screen.findByText(/added to 2 target/i)).toBeInTheDocument()
  })

  it('handles error during add', async () => {
    // Configure mock to throw an error
    addSkillSpy.mockRejectedValue(new Error('Failed to install'))

    renderWithProvider(
      <AddSkillDialog skill={mockSkill} open={true} onOpenChange={() => {}} defaultAgents={defaultAgents} />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[3]!)

    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText(/Global: Failed to install/)).toBeInTheDocument()
    })
  })

  it('passes skillNames as -s flag when provided', async () => {
    renderWithProvider(
      <AddSkillDialog
        skill={mockSkill}
        open={true}
        onOpenChange={() => {}}
        defaultAgents={defaultAgents}
        skillNames={['cool-skill']}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[3]!)

    const addButton = screen.getByRole('button', { name: 'Add' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(addSkillSpy).toHaveBeenCalledWith(
        'github:test/skill',
        expect.objectContaining({
          global: true,
          skills: ['cool-skill'],
          yes: true,
        }),
      )
    })
  })
})
