import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import type { RuntimeSetupState } from '@/types/runtime-setup'
import { RuntimeSetupBanner } from './runtime-setup-banner'

describe('RuntimeSetupBanner', () => {
  const defaultProps = {
    onRetry: mock(() => {}),
  }

  it('renders nothing when state is idle', () => {
    const state: RuntimeSetupState = { status: 'idle' }
    const { container } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when state is checking', () => {
    const state: RuntimeSetupState = { status: 'checking' }
    const { container } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows "Setting up runtime..." for downloading state', () => {
    const state: RuntimeSetupState = { status: 'downloading', progress: 0 }
    const { getByText, queryByRole } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)

    expect(getByText('Setting up runtime...')).toBeTruthy()
    expect(queryByRole('button')).toBeNull()
  })

  it('shows progress percentage when progress > 0', () => {
    const state: RuntimeSetupState = { status: 'downloading', progress: 42 }
    const { getByText } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)

    expect(getByText('Setting up runtime...')).toBeTruthy()
    expect(getByText('42%')).toBeTruthy()
  })

  it('shows "Runtime ready" for ready state', () => {
    const state: RuntimeSetupState = { status: 'ready' }
    const { getByText } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)

    expect(getByText('Runtime ready')).toBeTruthy()
  })

  it('shows error message and Retry button for error state', () => {
    const state: RuntimeSetupState = { status: 'error', message: 'Download failed' }
    const { getByText } = render(<RuntimeSetupBanner state={state} {...defaultProps} />)

    expect(getByText('Error: Download failed')).toBeTruthy()
    expect(getByText('Retry')).toBeTruthy()
  })

  it('calls onRetry when Retry button is clicked', () => {
    const onRetry = mock(() => {})
    const state: RuntimeSetupState = { status: 'error', message: 'Download failed' }
    const { getByRole } = render(<RuntimeSetupBanner state={state} onRetry={onRetry} />)

    const button = getByRole('button')
    fireEvent.click(button)
    expect(onRetry).toHaveBeenCalled()
  })
})
