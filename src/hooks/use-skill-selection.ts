import { useCallback, useState } from 'react'

export interface UseSkillSelectionReturn {
  selectedIds: Set<string>
  isSelected: (id: string) => boolean
  toggle: (id: string) => void
  selectAll: (ids: string[]) => void
  deselectAll: () => void
  count: number
  hasSelection: boolean
}

export function useSkillSelection(): UseSkillSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return {
    selectedIds,
    isSelected,
    toggle,
    selectAll,
    deselectAll,
    count: selectedIds.size,
    hasSelection: selectedIds.size > 0,
  }
}
