import { Command } from '@tauri-apps/plugin-shell'

export type ExecuteResult = Awaited<ReturnType<ReturnType<typeof Command.create>['execute']>>

export const isWindows = typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent)

const WINDOWS_CMD_MAP: Record<string, string> = {
  cat: 'type',
}

export function createCommand(program: string, args: string[], options?: { cwd?: string }) {
  if (isWindows) {
    const winProgram = WINDOWS_CMD_MAP[program] ?? program
    return Command.create('cmd', ['/C', winProgram, ...args], options)
  }
  return Command.create(program, args, options)
}

const DEFAULT_TIMEOUT = 30_000

let pending: Promise<void> = Promise.resolve()

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  if (ms <= 0) return promise
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Command timed out after ${ms}ms: ${label}`)), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

export function executeExclusive(
  program: string,
  args: string[],
  options?: { cwd?: string; timeout?: number },
): Promise<ExecuteResult> {
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT
  const commandOptions = options?.cwd ? { cwd: options.cwd } : undefined
  const label = [program, ...args].join(' ')
  const run = () => withTimeout(createCommand(program, args, commandOptions).execute(), timeout, label)

  const next = pending.then(run, run)
  pending = next.then(
    () => {},
    () => {},
  )
  return next
}
