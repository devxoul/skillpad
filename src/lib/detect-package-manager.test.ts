import { beforeEach, describe, expect, it } from 'bun:test'
import { mockShellCreate, mockShellExecute } from '@/test-mocks'
import {
  detectPackageManager,
  isPackageManagerAvailable,
  resetDetectionCache,
  resolvePackageManager,
} from './detect-package-manager'

let mockCreateCalls: any[] = []

function mockPmAvailability(available: Record<string, boolean>) {
  mockShellExecute.mockImplementation(async () => {
    const lastCall = mockCreateCalls[mockCreateCalls.length - 1]
    const pm = lastCall[0]
    if (available[pm]) return { code: 0, stdout: '1.0.0', stderr: '' }
    return { code: 1, stdout: '', stderr: 'not found' }
  })
}

describe('detectPackageManager', () => {
  beforeEach(() => {
    resetDetectionCache()
    mockCreateCalls = []
    mockShellExecute.mockReset()
    mockShellCreate.mockReset()
    mockShellCreate.mockImplementation((...args: any[]) => {
      mockCreateCalls.push(args)
      return { execute: mockShellExecute }
    })
  })

  it('returns bunx when all are available', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    const result = await detectPackageManager()

    expect(result).toBe('bunx')
  })

  it('returns pnpx when bunx is unavailable', async () => {
    mockPmAvailability({ bunx: false, pnpx: true, npx: true })

    const result = await detectPackageManager()

    expect(result).toBe('pnpx')
  })

  it('returns npx when bunx and pnpx are unavailable', async () => {
    mockPmAvailability({ bunx: false, pnpx: false, npx: true })

    const result = await detectPackageManager()

    expect(result).toBe('npx')
  })

  it('falls back to npx when none are available', async () => {
    mockShellExecute.mockResolvedValue({ code: 1, stdout: '', stderr: 'not found' })

    const result = await detectPackageManager()

    expect(result).toBe('npx')
  })

  it('falls back to npx when commands throw', async () => {
    mockShellExecute.mockRejectedValue(new Error('command not found'))

    const result = await detectPackageManager()

    expect(result).toBe('npx')
  })

  it('caches the result after first detection', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    const first = await detectPackageManager()
    mockShellCreate.mockClear()
    const second = await detectPackageManager()

    expect(first).toBe('bunx')
    expect(second).toBe('bunx')
    expect(mockShellCreate).not.toHaveBeenCalled()
  })

  it('checks bunx, pnpx, npx in order', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    await detectPackageManager()

    const checkedPms = mockCreateCalls.map((call) => call[0])
    expect(checkedPms).toContain('bunx')
    expect(checkedPms).toContain('pnpx')
    expect(checkedPms).toContain('npx')
  })

  it('passes --version flag to each package manager', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    await detectPackageManager()

    for (const call of mockCreateCalls) {
      expect(call[1]).toEqual(['--version'])
    }
  })
})

describe('isPackageManagerAvailable', () => {
  beforeEach(() => {
    mockCreateCalls = []
    mockShellExecute.mockReset()
    mockShellCreate.mockReset()
    mockShellCreate.mockImplementation((...args: any[]) => {
      mockCreateCalls.push(args)
      return { execute: mockShellExecute }
    })
  })

  it('returns true when pm exits with code 0', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    expect(await isPackageManagerAvailable('bunx')).toBe(true)
  })

  it('returns false when pm exits with non-zero code', async () => {
    mockShellExecute.mockResolvedValue({ code: 1, stdout: '', stderr: 'not found' })

    expect(await isPackageManagerAvailable('bunx')).toBe(false)
  })

  it('returns false when pm throws', async () => {
    mockShellExecute.mockRejectedValue(new Error('command not found'))

    expect(await isPackageManagerAvailable('pnpx')).toBe(false)
  })
})

describe('resolvePackageManager', () => {
  beforeEach(() => {
    resetDetectionCache()
    mockCreateCalls = []
    mockShellExecute.mockReset()
    mockShellCreate.mockReset()
    mockShellCreate.mockImplementation((...args: any[]) => {
      mockCreateCalls.push(args)
      return { execute: mockShellExecute }
    })
  })

  it('returns preferred pm when available', async () => {
    mockShellExecute.mockResolvedValue({ code: 0, stdout: '1.0.0', stderr: '' })

    const result = await resolvePackageManager('pnpx')

    expect(result).toBe('pnpx')
  })

  it('falls back to detection when preferred pm is unavailable', async () => {
    mockPmAvailability({ bunx: true, pnpx: false, npx: true })

    const result = await resolvePackageManager('pnpx')

    expect(result).toBe('bunx')
  })

  it('falls back to npx when preferred and all others unavailable', async () => {
    mockShellExecute.mockResolvedValue({ code: 1, stdout: '', stderr: 'not found' })

    const result = await resolvePackageManager('bunx')

    expect(result).toBe('npx')
  })
})
