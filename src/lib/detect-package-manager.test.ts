import { beforeEach, describe, expect, it } from 'bun:test'
import { mockShellCreate, mockShellExecute } from '@/test-mocks'
import { detectPackageManager, resetDetectionCache } from './detect-package-manager'

let mockCreateCalls: any[] = []

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
    mockShellExecute.mockImplementation(async () => {
      const lastCall = mockCreateCalls[mockCreateCalls.length - 1]
      const pm = lastCall[0]
      if (pm === 'bunx') return { code: 1, stdout: '', stderr: 'not found' }
      return { code: 0, stdout: '1.0.0', stderr: '' }
    })

    const result = await detectPackageManager()

    expect(result).toBe('pnpx')
  })

  it('returns npx when bunx and pnpx are unavailable', async () => {
    mockShellExecute.mockImplementation(async () => {
      const lastCall = mockCreateCalls[mockCreateCalls.length - 1]
      const pm = lastCall[0]
      if (pm === 'bunx' || pm === 'pnpx') return { code: 1, stdout: '', stderr: 'not found' }
      return { code: 0, stdout: '1.0.0', stderr: '' }
    })

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
