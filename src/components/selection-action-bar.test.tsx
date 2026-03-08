import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectionActionBar } from './selection-action-bar'

describe('SelectionActionBar', () => {
  const defaultProps = {
    count: 3,
    totalCount: 10,
    onAddSelected: mock(() => {}),
    onSelectAll: mock(() => {}),
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

  it('shows Select All when not all selected', () => {
    render(<SelectionActionBar {...defaultProps} count={3} totalCount={10} />)
    expect(screen.getByText('Select All')).toBeTruthy()
  })

  it('hides Select All when all selected', () => {
    render(<SelectionActionBar {...defaultProps} count={10} totalCount={10} />)
    expect(screen.queryByText('Select All')).toBeNull()
  })

  it('calls onSelectAll when Select All is clicked', async () => {
    const onSelectAll = mock(() => {})
    render(<SelectionActionBar {...defaultProps} onSelectAll={onSelectAll} />)

    await userEvent.click(screen.getByText('Select All'))
    expect(onSelectAll).toHaveBeenCalledTimes(1)
  })
})
