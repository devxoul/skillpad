import { expect, test } from 'bun:test'
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

test('ErrorBoundary catches errors and displays fallback UI', () => {
  // Given: ErrorBoundary wrapping a component that throws
  // When: Component throws an error
  // Then: ErrorBoundary should catch it and display error UI

  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  // Verify error message is displayed
  expect(screen.getByText('Something went wrong')).toBeDefined()
  expect(screen.getByText('Test error message')).toBeDefined()
})

test('ErrorBoundary displays error message from caught error', () => {
  // Given: ErrorBoundary with a specific error
  // When: Error is caught
  // Then: Error message should be displayed

  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  // The error message should be visible
  const errorText = screen.getByText(/Test error message/)
  expect(errorText).toBeDefined()
})

test('ErrorBoundary renders children when no error occurs', () => {
  // Given: ErrorBoundary wrapping safe component
  // When: No error is thrown
  // Then: Children should render normally

  renderWithProvider(
    <ErrorBoundary>
      <SafeComponent />
    </ErrorBoundary>,
  )

  expect(screen.getByText('Safe content')).toBeDefined()
})

test('ErrorBoundary uses custom fallback when provided', () => {
  // Given: ErrorBoundary with custom fallback
  // When: Error is caught
  // Then: Custom fallback should be displayed

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
  // Given: ErrorBoundary with error
  // When: Component renders
  // Then: Reload button should be present and clickable

  const user = userEvent.setup()

  renderWithProvider(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  )

  const reloadButton = screen.getByText('Reload App')
  expect(reloadButton).toBeDefined()
  expect(reloadButton.tagName).toBe('BUTTON')

  // Verify button is clickable (not disabled)
  await user.click(reloadButton)
})

test('InlineError renders message', () => {
  // Given: InlineError with message
  // When: Component renders
  // Then: Message should be displayed

  renderWithProvider(<InlineError message="Test error message" />)

  expect(screen.getByText('Error')).toBeDefined()
  expect(screen.getByText('Test error message')).toBeDefined()
})

test('InlineError renders retry button when onRetry provided', () => {
  // Given: InlineError with onRetry callback
  // When: Component renders
  // Then: Retry button should be visible

  const onRetry = () => {}
  renderWithProvider(<InlineError message="Test error" onRetry={onRetry} />)

  expect(screen.getByText('Retry')).toBeDefined()
})

test('InlineError does not render retry button when onRetry not provided', () => {
  // Given: InlineError without onRetry callback
  // When: Component renders
  // Then: Retry button should not be visible

  renderWithProvider(<InlineError message="Test error" />)

  expect(screen.queryByText('Retry')).toBeNull()
})

test('InlineError retry button calls onRetry callback', async () => {
  // Given: InlineError with onRetry callback
  // When: User clicks retry button
  // Then: Callback should be called

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
  // Given: InlineError component
  // When: Component renders
  // Then: Warning icon should be visible

  const { container } = renderWithProvider(<InlineError message="Test error" />)

  // Check for warning icon (SVG element from Phosphor)
  expect(container.querySelector('svg')).toBeTruthy()
})
