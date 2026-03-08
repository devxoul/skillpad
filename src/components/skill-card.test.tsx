import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProjectsProvider } from '@/contexts/projects-context'
import { SkillsProvider } from '@/contexts/skills-context'
import type { Skill } from '@/types/skill'
import { SkillCard } from './skill-card'

const defaultSkill: Skill = {
  id: 'test-skill-1',
  name: 'Test Skill',
  installs: 1000,
  topSource: 'user/repo',
}

function renderSkillCard(props: Partial<Parameters<typeof SkillCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ProjectsProvider>
        <SkillsProvider>
          <SkillCard skill={defaultSkill} {...props} />
        </SkillsProvider>
      </ProjectsProvider>
    </MemoryRouter>,
  )
}

describe('SkillCard', () => {
  describe('normal mode', () => {
    it('renders skill name, install count, and source info', () => {
      renderSkillCard()

      expect(screen.getByText('Test Skill')).toBeInTheDocument()
      expect(screen.getByText('1.0K')).toBeInTheDocument()
      expect(screen.getByText('user/repo')).toBeInTheDocument()
      expect(screen.getByText('by user')).toBeInTheDocument()
    })

    it('shows add button with correct aria-label', () => {
      renderSkillCard()

      expect(screen.getByRole('button', { name: 'Add skill' })).toBeInTheDocument()
    })

    it('renders as a link to skill detail page', () => {
      renderSkillCard()

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/skill/test-skill-1')
    })

    it('works without selection props (backward compatible)', () => {
      renderSkillCard({ onAdd: mock(() => {}) })

      expect(screen.getByText('Test Skill')).toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add skill' })).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })

  describe('selection mode', () => {
    it('shows checkbox when isSelectionMode is true', () => {
      renderSkillCard({ isSelectionMode: true, isSelected: false })

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('hides add button', () => {
      renderSkillCard({ isSelectionMode: true, isSelected: false })

      expect(screen.queryByRole('button', { name: 'Add skill' })).not.toBeInTheDocument()
    })

    it('checkbox reflects isSelected=true', () => {
      renderSkillCard({ isSelectionMode: true, isSelected: true })

      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('checkbox reflects isSelected=false', () => {
      renderSkillCard({ isSelectionMode: true, isSelected: false })

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('clicking card calls onToggleSelect with skill id', async () => {
      const user = userEvent.setup()
      const onToggleSelect = mock((_id: string) => {})
      renderSkillCard({ isSelectionMode: true, isSelected: false, onToggleSelect })

      await user.click(screen.getByText('Test Skill'))
      expect(onToggleSelect).toHaveBeenCalledWith('test-skill-1')
    })

    it('clicking checkbox calls onToggleSelect', async () => {
      const user = userEvent.setup()
      const onToggleSelect = mock((_id: string) => {})
      renderSkillCard({ isSelectionMode: true, isSelected: false, onToggleSelect })

      await user.click(screen.getByRole('checkbox'))
      expect(onToggleSelect.mock.calls.length).toBeGreaterThanOrEqual(1)
      expect(onToggleSelect.mock.calls[0]![0]).toBe('test-skill-1')
    })

    it('does not render a link (no navigation)', () => {
      renderSkillCard({ isSelectionMode: true, isSelected: false })

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('selected card has persistent background class', () => {
      const { container } = renderSkillCard({ isSelectionMode: true, isSelected: true })

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.tagName).toBe('DIV')
      expect(wrapper.className).toContain('bg-overlay-6')
    })
  })
})
