import { beforeEach, describe, expect, it, mock } from 'bun:test'

let executionOrder: number[] = []
let callCount = 0

const mockExecute = mock(async () => {
  const id = ++callCount
  executionOrder.push(id)
  await new Promise((r) => setTimeout(r, 50))
  return { code: 0, stdout: `result-${id}`, stderr: '' }
})

const mockCreate = mock((..._args: any[]) => ({
  execute: mockExecute,
}))

mock.module('@tauri-apps/plugin-shell', () => ({
  Command: { create: mockCreate },
}))

const { executeExclusive } = await import('./command-queue')

describe('executeExclusive', () => {
  beforeEach(() => {
    executionOrder = []
    callCount = 0
    mockExecute.mockReset()
    mockExecute.mockImplementation(async () => {
      const id = ++callCount
      executionOrder.push(id)
      await new Promise((r) => setTimeout(r, 50))
      return { code: 0, stdout: `result-${id}`, stderr: '' }
    })
    mockCreate.mockReset()
    mockCreate.mockImplementation((..._args: any[]) => ({
      execute: mockExecute,
    }))
  })

  it('serializes concurrent calls', async () => {
    // given: three commands fired concurrently
    const [r1, r2, r3] = await Promise.all([
      executeExclusive('bunx', ['skills', 'list']),
      executeExclusive('bunx', ['skills', 'list', '-g']),
      executeExclusive('bunx', ['skills', 'list']),
    ])

    // then: all complete successfully and ran sequentially
    expect(r1.stdout).toBe('result-1')
    expect(r2.stdout).toBe('result-2')
    expect(r3.stdout).toBe('result-3')
    expect(executionOrder).toEqual([1, 2, 3])
  })

  it('continues queue after a failure', async () => {
    // given: first call fails, second succeeds
    mockExecute
      .mockImplementationOnce(async () => {
        executionOrder.push(++callCount)
        throw new Error('EEXIST')
      })
      .mockImplementationOnce(async () => {
        executionOrder.push(++callCount)
        return { code: 0, stdout: 'ok', stderr: '' }
      })

    const p1 = executeExclusive('bunx', ['skills', 'list'])
    const p2 = executeExclusive('bunx', ['skills', 'list', '-g'])

    // then: first rejects, second still succeeds
    await expect(p1).rejects.toThrow('EEXIST')
    const r2 = await p2
    expect(r2.stdout).toBe('ok')
    expect(executionOrder).toEqual([1, 2])
  })

  it('passes arguments through to Command.create', async () => {
    await executeExclusive('npx', ['-y', 'skills', 'list'], { cwd: '/tmp' })

    expect(mockCreate).toHaveBeenCalledWith('npx', ['-y', 'skills', 'list'], { cwd: '/tmp' })
  })
})
