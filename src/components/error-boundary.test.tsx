import { afterEach, beforeEach, expect, spyOn, test } from 'bun:test'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorBoundary } from '@/components/error-boundary'
import { InlineError } from '@/components/inline-error'

// Test component that throws an error
const ThrowError = () => {
  throw new Error('Test error message')
}

// Test component that renders normally
const SafeComponent = () => {
  return <div>Safe content</div>
}

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

let consoleErrorSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

test('ErrorBoundary catches errors and displays fallback UI', () => {
  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  expect(screen.getByText('Something went wrong')).toBeDefined()
  expect(screen.getByText('Test error message')).toBeDefined()
})

test('ErrorBoundary displays error message from caught error', () => {
  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  const errorText = screen.getByText(/Test error message/)
  expect(errorText).toBeDefined()
})

test('ErrorBoundary renders children when no error occurs', () => {
  renderWithProvider(
    <ErrorBoundary>
      <SafeComponent />
    </ErrorBoundary>,
  )

  expect(screen.getByText('Safe content')).toBeDefined()
})

test('ErrorBoundary uses custom fallback when provided', () => {
  const fallback = <div>Custom error fallback</div>

  renderWithProvider(
    <ErrorBoundary fallback={fallback}>
      <ThrowError />
    </ErrorBoundary>,
  )

  expect(screen.getByText('Custom error fallback')).toBeDefined()
  expect(screen.queryByText('Something went wrong')).toBeNull()
})

test('ErrorBoundary reload button is clickable', async () => {
  const user = userEvent.setup()

  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  const reloadButton = screen.getByText('Reload App')
  expect(reloadButton).toBeDefined()
  expect(reloadButton.tagName).toBe('BUTTON')

  await user.click(reloadButton)
})

test('InlineError renders message', () => {
  renderWithProvider(<InlineError message="Test error message" />)

  expect(screen.getByText('Error')).toBeDefined()
  expect(screen.getByText('Test error message')).toBeDefined()
})

test('InlineError renders retry button when onRetry provided', () => {
  const onRetry = () => {}
  renderWithProvider(<InlineError message="Test error" onRetry={onRetry} />)

  expect(screen.getByText('Retry')).toBeDefined()
})

test('InlineError does not render retry button when onRetry not provided', () => {
  renderWithProvider(<InlineError message="Test error" />)

  expect(screen.queryByText('Retry')).toBeNull()
})

test('InlineError retry button calls onRetry callback', async () => {
  const user = userEvent.setup()
  let retryCount = 0
  const onRetry = () => {
    retryCount++
  }

  renderWithProvider(<InlineError message="Test error" onRetry={onRetry} />)

  const retryButton = screen.getByText('Retry')
  await user.click(retryButton)

  expect(retryCount).toBe(1)
})

test('InlineError displays warning icon', () => {
  const { container } = renderWithProvider(<InlineError message="Test error" />)

  expect(container.querySelector('svg')).toBeTruthy()
})
