import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import { Checkbox, CheckboxIndicator, CheckboxRoot } from '@/ui/checkbox'

describe('Checkbox', () => {
  it('renders checkbox', () => {
    const { getByRole } = render(<Checkbox />)
    expect(getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    const { getByRole, getByText } = render(<Checkbox label="Accept terms" />)
    expect(getByText('Accept terms')).toBeInTheDocument()
    expect(getByRole('checkbox')).toBeInTheDocument()
  })

  it('toggles checked state on click', () => {
    const { getByRole } = render(<Checkbox label="Toggle me" />)
    const checkbox = getByRole('checkbox')

    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('supports controlled checked state', () => {
    const onCheckedChange = mock(() => {})
    const { getByRole } = render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />)

    fireEvent.click(getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalled()
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true)
  })

  it('renders with defaultChecked', () => {
    const { getByRole } = render(<Checkbox defaultChecked />)
    expect(getByRole('checkbox')).toBeChecked()
  })

  it('renders disabled state', () => {
    const { getByRole } = render(<Checkbox disabled label="Disabled" />)
    const checkbox = getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-disabled', 'true')
  })

  it('accepts custom className', () => {
    const { getByRole } = render(<Checkbox className="custom-checkbox" />)
    expect(getByRole('checkbox')).toHaveClass('custom-checkbox')
  })

  it('renders using composition pattern', () => {
    const { getByRole } = render(
      <CheckboxRoot defaultChecked>
        <CheckboxIndicator />
      </CheckboxRoot>,
    )
    expect(getByRole('checkbox')).toBeChecked()
  })

  it('clicking label toggles checkbox', () => {
    const { getByRole, getByText } = render(<Checkbox label="Click label" />)
    const label = getByText('Click label')

    fireEvent.click(label)
    expect(getByRole('checkbox')).toBeChecked()
  })
})
