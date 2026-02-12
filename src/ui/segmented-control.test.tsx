import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { SegmentedControl } from './segmented-control'

const options = [
  { value: 'global', label: 'Global' },
  { value: 'project', label: 'Project' },
]

describe('SegmentedControl', () => {
  it('renders all options', () => {
    const { getByRole } = render(<SegmentedControl options={options} aria-label="Scope" />)

    expect(getByRole('radio', { name: 'Global' })).toBeInTheDocument()
    expect(getByRole('radio', { name: 'Project' })).toBeInTheDocument()
  })

  it('supports defaultValue', () => {
    const { getByRole } = render(<SegmentedControl options={options} defaultValue="project" aria-label="Scope" />)

    expect(getByRole('radio', { name: 'Project' })).toBeChecked()
    expect(getByRole('radio', { name: 'Global' })).not.toBeChecked()
  })

  it('supports controlled value', () => {
    const { getByRole } = render(<SegmentedControl options={options} value="global" aria-label="Scope" />)

    expect(getByRole('radio', { name: 'Global' })).toBeChecked()
    expect(getByRole('radio', { name: 'Project' })).not.toBeChecked()
  })

  it('calls onValueChange when selection changes', () => {
    const onValueChange = mock(() => {})
    const { getByRole } = render(
      <SegmentedControl options={options} defaultValue="global" onValueChange={onValueChange} aria-label="Scope" />,
    )

    fireEvent.click(getByRole('radio', { name: 'Project' }))

    expect(onValueChange).toHaveBeenCalledWith('project')
  })

  it('works as controlled component', () => {
    function ControlledTest() {
      const [value, setValue] = useState('global')
      return <SegmentedControl options={options} value={value} onValueChange={setValue} aria-label="Scope" />
    }

    const { getByRole } = render(<ControlledTest />)

    expect(getByRole('radio', { name: 'Global' })).toBeChecked()

    fireEvent.click(getByRole('radio', { name: 'Project' }))

    expect(getByRole('radio', { name: 'Project' })).toBeChecked()
    expect(getByRole('radio', { name: 'Global' })).not.toBeChecked()
  })

  it('supports disabled state', () => {
    const { getByRole } = render(<SegmentedControl options={options} disabled aria-label="Scope" />)

    const globalOption = getByRole('radio', { name: 'Global' })
    expect(globalOption).toHaveAttribute('data-disabled', '')
  })

  it('accepts custom className', () => {
    const { getByRole } = render(<SegmentedControl options={options} className="custom-class" aria-label="Scope" />)

    expect(getByRole('radiogroup')).toHaveClass('custom-class')
  })

  it('supports keyboard navigation via tab to radiogroup', () => {
    const { getByRole } = render(<SegmentedControl options={options} defaultValue="global" aria-label="Scope" />)

    const globalOption = getByRole('radio', { name: 'Global' })
    globalOption.focus()

    expect(globalOption).toHaveFocus()
  })

  it('renders with three options', () => {
    const threeOptions = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ]

    const { getByRole } = render(<SegmentedControl options={threeOptions} aria-label="Options" />)

    expect(getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(getByRole('radio', { name: 'Option B' })).toBeInTheDocument()
    expect(getByRole('radio', { name: 'Option C' })).toBeInTheDocument()
  })
})
