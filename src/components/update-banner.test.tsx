import { describe, expect, it, vi } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import type { AppUpdateState } from '@/types/app-update'
import { UpdateBanner } from './update-banner'

// Mock icons to avoid rendering issues in tests
vi.mock('@phosphor-icons/react', () => ({
  ArrowsClockwise: () => <div data-testid="icon-restart" />,
  DownloadSimple: () => <div data-testid="icon-download" />,
}))

describe('UpdateBanner', () => {
  const defaultProps = {
    onDownload: vi.fn(),
    onRestart: vi.fn(),
    onRetry: vi.fn(),
  }

  it('renders nothing when state is idle', () => {
    const state: AppUpdateState = { status: 'idle' }
    const { container } = render(<UpdateBanner state={state} {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when state is checking', () => {
    const state: AppUpdateState = { status: 'checking' }
    const { container } = render(<UpdateBanner state={state} {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders available state correctly', () => {
    const state: AppUpdateState = { status: 'available', version: '1.2.3' }
    const { getByText, getByTestId, getByRole } = render(<UpdateBanner state={state} {...defaultProps} />)

    expect(getByText('v1.2.3 available')).toBeTruthy()
    expect(getByTestId('icon-download')).toBeTruthy()

    const button = getByRole('button')
    fireEvent.click(button)
    expect(defaultProps.onDownload).toHaveBeenCalled()
  })

  it('renders downloading state correctly', () => {
    const state: AppUpdateState = { status: 'downloading' }
    const { getByText, queryByRole } = render(<UpdateBanner state={state} {...defaultProps} />)

    expect(getByText('Downloading update...')).toBeTruthy()
    // Should not have buttons
    expect(queryByRole('button')).toBeNull()
  })

  it('renders ready state correctly', () => {
    const state: AppUpdateState = { status: 'ready' }
    const { getByText, getByTestId, getByRole } = render(<UpdateBanner state={state} {...defaultProps} />)

    expect(getByText('Ready to update')).toBeTruthy()
    expect(getByTestId('icon-restart')).toBeTruthy()

    const button = getByRole('button')
    fireEvent.click(button)
    expect(defaultProps.onRestart).toHaveBeenCalled()
  })

  it('renders error state correctly', () => {
    const state: AppUpdateState = { status: 'error', message: 'Connection failed' }
    const { getByText, getByRole } = render(<UpdateBanner state={state} {...defaultProps} />)

    expect(getByText('Error: Connection failed')).toBeTruthy()
    expect(getByText('Retry')).toBeTruthy()

    const button = getByRole('button')
    fireEvent.click(button)
    expect(defaultProps.onRetry).toHaveBeenCalled()
  })
})
