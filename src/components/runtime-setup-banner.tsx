import { ArrowsClockwise } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import type { RuntimeSetupState } from '@/types/runtime-setup'

interface RuntimeSetupBannerProps {
  state: RuntimeSetupState
  onRetry: () => void
}

export function RuntimeSetupBanner({ state, onRetry }: RuntimeSetupBannerProps) {
  if (state.status === 'idle' || state.status === 'checking') {
    return null
  }

  return (
    <div className="mx-2 mb-2 rounded-md bg-overlay-6 px-2.5 py-2 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium text-foreground/60">
          {state.status === 'downloading' && 'Setting up runtime...'}
          {state.status === 'ready' && 'Runtime ready'}
          {state.status === 'error' && `Error: ${state.message}`}
        </span>

        {state.status === 'downloading' && state.progress > 0 && (
          <span className="shrink-0 text-[11px] font-medium text-foreground/40">{state.progress}%</span>
        )}

        {state.status === 'error' && (
          <button
            type="button"
            onClick={onRetry}
            className={clsx(
              'flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] font-medium text-foreground/40',
              'transition-colors hover:bg-overlay-8 hover:text-foreground/70',
            )}
          >
            <ArrowsClockwise size={12} weight="bold" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {state.status === 'downloading' && (
        <div className="mt-1.5 flex justify-center">
          <div className="h-1 w-1 animate-pulse rounded-full bg-foreground/30" />
        </div>
      )}
    </div>
  )
}
