import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PreferencesDialog } from '@/components/preferences-dialog'

let mockUsePreferencesImpl: any = null

mock.module('@/hooks/use-preferences', () => ({
  usePreferences: mock(() => mockUsePreferencesImpl),
}))
mock.module('@tauri-apps/plugin-store', () => ({
  Store: {
    load: mock(() => {}),
  },
}))

import { usePreferences } from '@/hooks/use-preferences'

describe('PreferencesDialog', () => {
  let mockSavePreferences: any

  beforeEach(() => {
    mockSavePreferences = mock(() => {})
    mockUsePreferencesImpl = {
      preferences: {
        defaultAgents: ['opencode', 'claude-code'],
        packageManager: 'bunx',
      },
      loading: false,
      savePreferences: mockSavePreferences,
    }
  })

  afterEach(() => {
    mockUsePreferencesImpl = null
  })

  it('renders preferences dialog when open', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    expect(screen.getByText('Preferences')).toBeDefined()
  })

  it('displays default agents description', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    expect(screen.getByText('These agents will be pre-selected when adding skills')).toBeDefined()
  })

  it('renders all agents as checkboxes', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('pre-selects default agents from preferences', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const openCodeCheckbox = checkboxes[0]
    const claudeCheckbox = checkboxes[1]

    expect(openCodeCheckbox?.getAttribute('aria-checked')).toBe('true')
    expect(claudeCheckbox?.getAttribute('aria-checked')).toBe('true')
  })

  it('toggles agent selection on checkbox click', async () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    const checkboxes = screen.getAllByRole('checkbox')
    const uncheckedCheckbox = checkboxes.find((cb) => cb.getAttribute('aria-checked') === 'false')

    expect(uncheckedCheckbox).toBeDefined()
    if (uncheckedCheckbox) {
      expect(uncheckedCheckbox.getAttribute('aria-checked')).toBe('false')
      fireEvent.click(uncheckedCheckbox)

      await waitFor(() => {
        expect(uncheckedCheckbox.getAttribute('aria-checked')).toBe('true')
      })
    }
  })

  it('saves preferences on save button click', async () => {
    let savePreferencesCalled = false
    mockSavePreferences = mock(() => {
      savePreferencesCalled = true
    })
    mockUsePreferencesImpl.savePreferences = mockSavePreferences

    const onOpenChange = mock(() => {})
    render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(savePreferencesCalled).toBe(true)
    })
  })

  it('closes dialog after saving', async () => {
    let onOpenChangeCalled = false
    let onOpenChangeArg: any = null
    const onOpenChange = mock((arg: any) => {
      onOpenChangeCalled = true
      onOpenChangeArg = arg
    })
    render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(onOpenChangeCalled).toBe(true)
      expect(onOpenChangeArg).toBe(false)
    })
  })

  it('closes dialog on cancel button click', () => {
    let onOpenChangeCalled = false
    let onOpenChangeArg: any = null
    const onOpenChange = mock((arg: any) => {
      onOpenChangeCalled = true
      onOpenChangeArg = arg
    })
    render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelButton)

    expect(onOpenChangeCalled).toBe(true)
    expect(onOpenChangeArg).toBe(false)
  })

  it('saves selected agents to preferences', async () => {
    let savePreferencesArg: any = null
    mockSavePreferences = mock((arg: any) => {
      savePreferencesArg = arg
    })
    mockUsePreferencesImpl.savePreferences = mockSavePreferences

    const onOpenChange = mock(() => {})
    render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    const uncheckedCheckbox = checkboxes.find((cb) => cb.getAttribute('aria-checked') === 'false')

    expect(uncheckedCheckbox).toBeDefined()
    if (uncheckedCheckbox) {
      fireEvent.click(uncheckedCheckbox)
    }

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(savePreferencesArg).toBeDefined()
      expect(savePreferencesArg?.defaultAgents).toContain('opencode')
      expect(savePreferencesArg?.defaultAgents).toContain('claude-code')
      expect(savePreferencesArg?.defaultAgents?.length).toBe(3)
    })
  })

  it('displays package manager selection', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    expect(screen.getByText('Package Manager')).toBeDefined()
    expect(screen.getByText('Package runner used when adding skills')).toBeDefined()
  })

  it('renders package manager options', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    expect(screen.getByRole('radio', { name: 'npx' })).toBeDefined()
    expect(screen.getByRole('radio', { name: 'pnpx' })).toBeDefined()
    expect(screen.getByRole('radio', { name: 'bunx' })).toBeDefined()
  })

  it('pre-selects package manager from preferences', () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    const bunxRadio = screen.getByRole('radio', { name: 'bunx' })
    expect(bunxRadio.getAttribute('data-checked')).toBe('')
  })

  it('changes package manager selection', async () => {
    render(<PreferencesDialog open={true} onOpenChange={mock(() => {})} />)
    const npxRadio = screen.getByRole('radio', { name: 'npx' })

    fireEvent.click(npxRadio)

    await waitFor(() => {
      expect(npxRadio.getAttribute('data-checked')).toBe('')
    })
  })

  it('saves package manager preference', async () => {
    let savePreferencesArg: any = null
    mockSavePreferences = mock((arg: any) => {
      savePreferencesArg = arg
    })
    mockUsePreferencesImpl.savePreferences = mockSavePreferences

    const onOpenChange = mock(() => {})
    render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    const pnpxRadio = screen.getByRole('radio', { name: 'pnpx' })
    fireEvent.click(pnpxRadio)

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(savePreferencesArg).toBeDefined()
      expect(savePreferencesArg?.packageManager).toBe('pnpx')
    })
  })

  it('does not render when open is false', () => {
    const { container } = render(<PreferencesDialog open={false} onOpenChange={mock(() => {})} />)
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()
  })

  it('resets changes when cancel is clicked and dialog reopens', async () => {
    const onOpenChange = mock(() => {})
    const { rerender } = render(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    // given - change package manager
    const pnpxRadio = screen.getByRole('radio', { name: 'pnpx' })
    fireEvent.click(pnpxRadio)

    await waitFor(() => {
      expect(pnpxRadio.getAttribute('data-checked')).toBe('')
    })

    // when - click cancel
    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelButton)

    // then - close and reopen dialog
    rerender(<PreferencesDialog open={false} onOpenChange={onOpenChange} />)
    rerender(<PreferencesDialog open={true} onOpenChange={onOpenChange} />)

    // should be reset to original value (bunx from mock)
    await waitFor(() => {
      const bunxRadio = screen.getByRole('radio', { name: 'bunx' })
      expect(bunxRadio.getAttribute('data-checked')).toBe('')
    })
  })
})
