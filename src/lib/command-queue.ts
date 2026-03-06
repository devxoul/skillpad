import { Command } from '@tauri-apps/plugin-shell'

type ExecuteResult = Awaited<ReturnType<ReturnType<typeof Command.create>['execute']>>

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
  const run = () => withTimeout(Command.create(program, args, commandOptions).execute(), timeout, label)

  const next = pending.then(run, run)
  pending = next.then(
    () => {},
    () => {},
  )
  return next
}
