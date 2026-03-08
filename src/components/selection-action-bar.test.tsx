import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectionActionBar } from './selection-action-bar'

describe('SelectionActionBar', () => {
  const defaultProps = {
    count: 3,
    onAddSelected: mock(() => {}),
    onClear: mock(() => {}),
  }

  it('renders singular count', () => {
    render(<SelectionActionBar {...defaultProps} count={1} />)
    expect(screen.getByText('1 skill selected')).toBeTruthy()
  })

  it('renders plural count', () => {
    render(<SelectionActionBar {...defaultProps} count={5} />)
    expect(screen.getByText('5 skills selected')).toBeTruthy()
  })

  it('calls onAddSelected when Add Selected is clicked', async () => {
    const onAddSelected = mock(() => {})
    render(<SelectionActionBar {...defaultProps} onAddSelected={onAddSelected} />)

    await userEvent.click(screen.getByText('Add Selected'))
    expect(onAddSelected).toHaveBeenCalledTimes(1)
  })

  it('calls onClear when Deselect is clicked', async () => {
    const onClear = mock(() => {})
    render(<SelectionActionBar {...defaultProps} onClear={onClear} />)

    await userEvent.click(screen.getByText('Deselect'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('renders both buttons', () => {
    render(<SelectionActionBar {...defaultProps} />)
    expect(screen.getByText('Add Selected')).toBeTruthy()
    expect(screen.getByText('Deselect')).toBeTruthy()
  })
})
