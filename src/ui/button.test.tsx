import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import { Button } from '@/ui/button'

describe('Button', () => {
  it('renders with children', () => {
    const { getByRole } = render(<Button>Click me</Button>)
    expect(getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    const { getByRole } = render(<Button>Primary</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('bg-brand-500/90')
  })

  it('applies secondary variant', () => {
    const { getByRole } = render(<Button variant="secondary">Secondary</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('bg-foreground/[0.04]')
    expect(button).toHaveClass('border')
  })

  it('applies ghost variant', () => {
    const { getByRole } = render(<Button variant="ghost">Ghost</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('bg-transparent')
  })

  it('applies size sm', () => {
    const { getByRole } = render(<Button size="sm">Small</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('h-7')
  })

  it('applies size md by default', () => {
    const { getByRole } = render(<Button>Medium</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('h-8')
  })

  it('applies size lg', () => {
    const { getByRole } = render(<Button size="lg">Large</Button>)
    const button = getByRole('button')
    expect(button).toHaveClass('h-9')
  })

  it('handles click events', () => {
    const handleClick = mock(() => {})
    const { getByRole } = render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>)
    const button = getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('accepts custom className', () => {
    const { getByRole } = render(<Button className="custom-class">Custom</Button>)
    expect(getByRole('button')).toHaveClass('custom-class')
  })
})
