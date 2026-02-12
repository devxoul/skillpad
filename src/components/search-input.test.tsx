import { describe, expect, it } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SearchInput } from '@/components/search-input'

function renderWithProvider(ui: React.ReactElement) {
  const result = render(ui)

  // Assign queries to global screen object to work around the timing issue
  // Update screen with the latest queries from render
  for (const key in result) {
    if (typeof result[key as keyof typeof result] === 'function') {
      ;(screen as any)[key] = result[key as keyof typeof result]
    }
  }

  return result
}

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    const onSearch = () => {}
    renderWithProvider(<SearchInput placeholder="Test placeholder" onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Test placeholder')
    expect(input).toBeDefined()
  })

  it('debounces onSearch callback by 300ms', async () => {
    let callCount = 0
    let lastCall: string | undefined
    const onSearch = (value: string) => {
      callCount++
      lastCall = value
    }
    renderWithProvider(<SearchInput onSearch={onSearch} debounceMs={300} />)

    const input = screen.getByPlaceholderText('Search...')

    callCount = 0
    lastCall = undefined

    fireEvent.change(input, { target: { value: 'react' } })

    expect(callCount).toBe(0)

    await waitFor(
      () => {
        expect(lastCall).toBe('react')
        expect(callCount).toBe(1)
      },
      { timeout: 500 },
    )
  })

  it('calls onSearch with debounced value after delay', async () => {
    let callCount = 0
    let lastCall: string | undefined
    const onSearch = (value: string) => {
      callCount++
      lastCall = value
    }
    renderWithProvider(<SearchInput onSearch={onSearch} debounceMs={300} />)

    const input = screen.getByPlaceholderText('Search...')

    callCount = 0
    lastCall = undefined

    fireEvent.change(input, { target: { value: 'r' } })
    await new Promise((resolve) => setTimeout(resolve, 100))

    fireEvent.change(input, { target: { value: 're' } })
    await new Promise((resolve) => setTimeout(resolve, 100))

    fireEvent.change(input, { target: { value: 'rea' } })
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(callCount).toBe(0)

    await waitFor(
      () => {
        expect(lastCall).toBe('rea')
        expect(callCount).toBe(1)
      },
      { timeout: 500 },
    )
  })

  it('shows clear button when input has value', async () => {
    const onSearch = () => {}
    renderWithProvider(<SearchInput onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search...')

    // Initially no clear button
    expect(screen.queryByLabelText('Clear search')).toBeNull()

    // Type something
    fireEvent.change(input, { target: { value: 'test' } })

    // Clear button should appear
    await waitFor(() => {
      expect(screen.getByLabelText('Clear search')).toBeDefined()
    })
  })

  it('clears search when clear button is clicked', async () => {
    let lastCall: string | undefined
    const onSearch = (value: string) => {
      lastCall = value
    }
    renderWithProvider(<SearchInput onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'test' } })
    await new Promise((resolve) => setTimeout(resolve, 350))

    expect(input.value).toBe('test')

    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)

    expect(input.value).toBe('')

    await waitFor(
      () => {
        expect(lastCall).toBe('')
      },
      { timeout: 500 },
    )
  })

  it('clears search when Escape key is pressed', async () => {
    let lastCall: string | undefined
    const onSearch = (value: string) => {
      lastCall = value
    }
    renderWithProvider(<SearchInput onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'test' } })
    await new Promise((resolve) => setTimeout(resolve, 350))

    expect(input.value).toBe('test')

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(input.value).toBe('')

    await waitFor(
      () => {
        expect(lastCall).toBe('')
      },
      { timeout: 500 },
    )
  })

  it('respects custom debounce delay', async () => {
    let callCount = 0
    let lastCall: string | undefined
    const onSearch = (value: string) => {
      callCount++
      lastCall = value
    }
    renderWithProvider(<SearchInput onSearch={onSearch} debounceMs={500} />)

    const input = screen.getByPlaceholderText('Search...')

    callCount = 0
    lastCall = undefined

    fireEvent.change(input, { target: { value: 'test' } })

    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(callCount).toBe(0)

    await waitFor(
      () => {
        expect(lastCall).toBe('test')
      },
      { timeout: 500 },
    )
  })
})
