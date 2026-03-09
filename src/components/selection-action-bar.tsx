import { Button } from '@/ui/button'

export interface SelectionActionBarProps {
  count: number
  totalCount: number
  actionLabel?: string
  onAction: () => void
  onSelectAll: () => void
  onClear: () => void
  actionDisabled?: boolean
}

export function SelectionActionBar({
  count,
  totalCount,
  actionLabel = 'Add Selected',
  onAction,
  onSelectAll,
  onClear,
  actionDisabled,
}: SelectionActionBarProps) {
  const allSelected = count === totalCount

  return (
    <div className="flex items-center justify-between border-t border-overlay-border-muted bg-background/95 px-5 py-2.5 backdrop-blur-xl">
      <span className="text-[13px] font-medium text-foreground/70">
        {count} {count === 1 ? 'skill' : 'skills'} selected
      </span>
      <div className="flex items-center gap-2">
        {!allSelected && (
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClear}>
          Deselect
        </Button>
        <Button variant="primary" size="sm" onClick={onAction} disabled={actionDisabled || count === 0}>
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}
