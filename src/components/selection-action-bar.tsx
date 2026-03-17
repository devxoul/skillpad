import { useTranslations } from '@/lib/i18n'
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
  actionLabel,
  onAction,
  onSelectAll,
  onClear,
  actionDisabled,
}: SelectionActionBarProps) {
  const t = useTranslations()
  const allSelected = count === totalCount
  const effectiveLabel = actionLabel ?? t.selection_action_add

  return (
    <div className="flex items-center justify-between border-t border-overlay-border-muted bg-background/95 px-5 py-2.5 backdrop-blur-xl">
      <span className="text-[13px] font-medium text-foreground/70">
        {count === 1
          ? t.selection_count_one({ count: String(count) })
          : t.selection_count_other({ count: String(count) })}
      </span>
      <div className="flex items-center gap-2">
        {!allSelected && (
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            {t.selection_select_all}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t.selection_deselect}
        </Button>
        <Button variant="primary" size="sm" onClick={onAction} disabled={actionDisabled || count === 0}>
          {effectiveLabel}
        </Button>
      </div>
    </div>
  )
}
