import { Command } from '@tauri-apps/plugin-shell'

type ExecuteResult = Awaited<ReturnType<ReturnType<typeof Command.create>['execute']>>

let pending: Promise<void> = Promise.resolve()

export function executeExclusive(program: string, args: string[], options?: { cwd?: string }): Promise<ExecuteResult> {
  const run = () => Command.create(program, args, options).execute()

  const next = pending.then(run, run)
  pending = next.then(
    () => {},
    () => {},
  )
  return next
}
