export type RuntimeSetupState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'downloading'; progress: number }
  | { status: 'ready' }
  | { status: 'error'; message: string }
