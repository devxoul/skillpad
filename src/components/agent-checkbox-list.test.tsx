import { describe, expect, it, mock } from 'bun:test'

import { fireEvent, render, screen } from '@testing-library/react'

import { AgentCheckboxList } from '@/components/agent-checkbox-list'
import { AGENTS } from '@/data/agents'

function queryAgentSpan(name: string) {
  return screen.queryByText((content, element) => element?.tagName === 'SPAN' && content === name)
}

function getAgentSpan(name: string) {
  const el = queryAgentSpan(name)
  if (!el) throw new Error(`Agent span "${name}" not found`)
  return el
}

describe('AgentCheckboxList', () => {
  it('renders all agents when none are hidden', () => {
    const { container } = render(
      <AgentCheckboxList selectedAgents={[]} hiddenAgents={[]} onToggleAgent={mock(() => {})} />,
    )
    const labels = container.querySelectorAll('label > span:last-child')
    expect(labels.length).toBe(AGENTS.length)
  })

  it('shows only visible agents when some are hidden', () => {
    render(
      <AgentCheckboxList selectedAgents={[]} hiddenAgents={['cursor', 'windsurf']} onToggleAgent={mock(() => {})} />,
    )
    expect(getAgentSpan('Claude Code')).toBeInTheDocument()
    expect(queryAgentSpan('Cursor')).toBeNull()
    expect(queryAgentSpan('Windsurf')).toBeNull()
  })

  it('shows disclosure button with hidden agent count', () => {
    render(
      <AgentCheckboxList selectedAgents={[]} hiddenAgents={['cursor', 'windsurf']} onToggleAgent={mock(() => {})} />,
    )
    expect(screen.getByText('Show 2 more')).toBeInTheDocument()
  })

  it('reveals hidden agents when disclosure is clicked', () => {
    render(
      <AgentCheckboxList selectedAgents={[]} hiddenAgents={['cursor', 'windsurf']} onToggleAgent={mock(() => {})} />,
    )

    fireEvent.click(screen.getByText('Show 2 more'))

    expect(getAgentSpan('Cursor')).toBeInTheDocument()
    expect(getAgentSpan('Windsurf')).toBeInTheDocument()
    expect(screen.getByText('Show fewer')).toBeInTheDocument()
  })

  it('collapses hidden agents when disclosure is clicked again', () => {
    render(
      <AgentCheckboxList selectedAgents={[]} hiddenAgents={['cursor', 'windsurf']} onToggleAgent={mock(() => {})} />,
    )

    fireEvent.click(screen.getByText('Show 2 more'))
    expect(getAgentSpan('Cursor')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Show fewer'))
    expect(queryAgentSpan('Cursor')).toBeNull()
  })

  it('checks selected agents', () => {
    render(<AgentCheckboxList selectedAgents={['claude-code']} hiddenAgents={[]} onToggleAgent={mock(() => {})} />)
    const claudeRow = getAgentSpan('Claude Code').closest('label')
    const checkbox = claudeRow?.querySelector('[role="checkbox"]')
    expect(checkbox?.getAttribute('aria-checked')).toBe('true')
  })

  it('calls onToggleAgent when agent is clicked', () => {
    const onToggle = mock(() => {})
    render(<AgentCheckboxList selectedAgents={[]} hiddenAgents={[]} onToggleAgent={onToggle} />)

    const claudeRow = getAgentSpan('Claude Code').closest('label')
    const checkbox = claudeRow?.querySelector('[role="checkbox"]')
    if (checkbox) fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledWith('claude-code')
  })

  it('does not show disclosure when no agents are hidden', () => {
    render(<AgentCheckboxList selectedAgents={[]} hiddenAgents={[]} onToggleAgent={mock(() => {})} />)
    expect(screen.queryByText(/Show \d+ more/)).not.toBeInTheDocument()
  })

  it('allows toggling hidden agents after expanding', () => {
    const onToggle = mock(() => {})
    render(<AgentCheckboxList selectedAgents={[]} hiddenAgents={['cursor']} onToggleAgent={onToggle} />)

    fireEvent.click(screen.getByText('Show 1 more'))

    const cursorRow = getAgentSpan('Cursor').closest('label')
    const checkbox = cursorRow?.querySelector('[role="checkbox"]')
    if (checkbox) fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledWith('cursor')
  })
})
