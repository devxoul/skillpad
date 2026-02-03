export type SkillUpdateStatus =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'update-available'; source: string }
  | { status: 'up-to-date' }
  | { status: 'error'; message: string }
  | { status: 'updating' }

export type UpdateStatusMap = Record<string, SkillUpdateStatus>
