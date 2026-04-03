import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { BatchAddSkillDialog, type BatchAddSkillDialogProps } from '@/components/batch-add-skill-dialog'
import * as projectsContext from '@/contexts/projects-context'
import * as skillsContext from '@/contexts/skills-context'
import { AGENTS } from '@/data/agents'
import * as skills from '@/lib/skills'
import type { Skill } from '@/types/skill'

describe('BatchAddSkillDialog', () => {
  let addSkillMock: ReturnType<typeof spyOn>
  let useSkillsMock: ReturnType<typeof spyOn>
  let useProjectsMock: ReturnType<typeof spyOn>

  beforeEach(() => {
    addSkillMock = spyOn(skills, 'addSkill').mockResolvedValue(undefined)
    useSkillsMock = spyOn(skillsContext, 'useSkills').mockReturnValue({
      invalidateInstalledCache: mock(() => {}),
    } as any)
    useProjectsMock = spyOn(projectsContext, 'useProjects').mockReturnValue({
      projects: [],
      loading: false,
      importProject: mock(() => Promise.resolve()),
      removeProject: mock(() => Promise.resolve()),
      moveProject: mock(() => Promise.resolve()),
      refresh: mock(() => Promise.resolve()),
    } as any)
  })

  afterEach(() => {
    addSkillMock.mockRestore()
    useSkillsMock.mockRestore()
    useProjectsMock.mockRestore()
  })

  it('renders correct title', () => {
    renderDialog()

    expect(screen.queryByText('Add 3 skills')).not.toBeNull()
  })

  it('shows Global checkbox checked by default', () => {
    renderDialog()

    expect(getCheckboxByText('Global').getAttribute('aria-checked')).toBe('true')
  })

  it('shows agent checkboxes', () => {
    renderDialog()

    expect(screen.queryByText(AGENTS[0]!.name)).not.toBeNull()
    expect(screen.queryByText(AGENTS[1]!.name)).not.toBeNull()
  })

  it('groups same-source skills into one addSkill call', async () => {
    const { user } = renderDialog({
      skills: [
        { id: '1', name: 'skill-one', installs: 100, topSource: 'user/repo-a' },
        { id: '2', name: 'skill-two', installs: 200, topSource: 'user/repo-a' },
      ],
    })

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(addSkillMock).toHaveBeenCalledTimes(1)
      expect(addSkillMock).toHaveBeenCalledWith(
        'user/repo-a',
        expect.objectContaining({
          global: true,
          agents: ['claude'],
          skills: ['skill-one', 'skill-two'],
          yes: true,
        }),
      )
    })
  })

  it('groups different-source skills into separate addSkill calls', async () => {
    const { user } = renderDialog({
      skills: [
        { id: '1', name: 'skill-one', installs: 100, topSource: 'user/repo-a' },
        { id: '2', name: 'skill-two', installs: 200, topSource: 'user/repo-b' },
      ],
    })

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(addSkillMock).toHaveBeenCalledTimes(2)
      expect(addSkillMock).toHaveBeenNthCalledWith(1, 'user/repo-a', expect.objectContaining({ skills: ['skill-one'] }))
      expect(addSkillMock).toHaveBeenNthCalledWith(2, 'user/repo-b', expect.objectContaining({ skills: ['skill-two'] }))
    })
  })

  it('calls onSuccess after successful install', async () => {
    const onSuccess = mock(() => {})
    const { user } = renderDialog({ onSuccess })

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error on failure', async () => {
    addSkillMock.mockRejectedValue(new Error('Failed to install'))
    const { user } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(screen.queryByText(/Global\/user\/repo-a: Failed to install/)).not.toBeNull()
    })
  })

  it('handles partial failures', async () => {
    addSkillMock.mockResolvedValueOnce(undefined)
    addSkillMock.mockRejectedValueOnce(new Error('Failed'))
    const { user } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(addSkillMock).toHaveBeenCalledTimes(2)
      expect(screen.queryByText(/Completed 1 install\(s\), but 1 failed:/)).not.toBeNull()
    })
  })

  it('Add button disabled when no agents selected', () => {
    renderDialog({ defaultAgents: [] })

    expect(getAddButton().disabled).toBe(true)
  })

  it('Add button disabled when no target selected', async () => {
    const { user } = renderDialog()

    await user.click(getCheckboxByText('Global'))

    expect(getAddButton().disabled).toBe(true)
  })
})

function renderDialog(props: Partial<BatchAddSkillDialogProps> = {}) {
  const defaultSkills: Skill[] = [
    { id: '1', name: 'skill-one', installs: 100, topSource: 'user/repo-a' },
    { id: '2', name: 'skill-two', installs: 200, topSource: 'user/repo-a' },
    { id: '3', name: 'skill-three', installs: 300, topSource: 'user/repo-b' },
  ]
  const user = userEvent.setup({ delay: null })
  const result = render(
    <MemoryRouter>
      <BatchAddSkillDialog
        skills={defaultSkills}
        open={true}
        onOpenChange={() => {}}
        defaultAgents={['claude']}
        {...props}
      />
    </MemoryRouter>,
  )

  return { ...result, user }
}

function getCheckboxByText(label: string) {
  const container = screen.getByText(label).closest('label')
  if (!container) {
    throw new Error(`Missing checkbox container for ${label}`)
  }

  const checkbox = container.querySelector('[role="checkbox"]')
  if (!checkbox) {
    throw new Error(`Missing checkbox for ${label}`)
  }

  return checkbox as HTMLElement
}

function getAddButton() {
  return screen.getByRole('button', { name: 'Add' }) as HTMLButtonElement
}
