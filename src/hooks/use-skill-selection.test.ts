import { describe, expect, it } from 'bun:test'

import { act, renderHook } from '@testing-library/react'

import { useSkillSelection } from './use-skill-selection'

describe('useSkillSelection', () => {
  it('starts with empty selection', () => {
    const { result } = renderHook(() => useSkillSelection())

    expect(result.current.count).toBe(0)
    expect(result.current.hasSelection).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
  })

  it('toggle adds an ID', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.selectedIds.has('skill-1')).toBe(true)
    expect(result.current.count).toBe(1)
    expect(result.current.hasSelection).toBe(true)
  })

  it('toggle removes an already-selected ID', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.selectedIds.has('skill-1')).toBe(true)

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.selectedIds.has('skill-1')).toBe(false)
    expect(result.current.count).toBe(0)
    expect(result.current.hasSelection).toBe(false)
  })

  it('toggle multiple IDs independently', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.toggle('skill-1')
      result.current.toggle('skill-2')
      result.current.toggle('skill-3')
    })

    expect(result.current.count).toBe(3)
    expect(result.current.selectedIds.has('skill-1')).toBe(true)
    expect(result.current.selectedIds.has('skill-2')).toBe(true)
    expect(result.current.selectedIds.has('skill-3')).toBe(true)

    act(() => {
      result.current.toggle('skill-2')
    })

    expect(result.current.count).toBe(2)
    expect(result.current.selectedIds.has('skill-2')).toBe(false)
  })

  it('selectAll replaces selection', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.toggle('skill-1')
      result.current.toggle('skill-2')
    })

    expect(result.current.count).toBe(2)

    act(() => {
      result.current.selectAll(['skill-3', 'skill-4', 'skill-5'])
    })

    expect(result.current.count).toBe(3)
    expect(result.current.selectedIds.has('skill-1')).toBe(false)
    expect(result.current.selectedIds.has('skill-2')).toBe(false)
    expect(result.current.selectedIds.has('skill-3')).toBe(true)
    expect(result.current.selectedIds.has('skill-4')).toBe(true)
    expect(result.current.selectedIds.has('skill-5')).toBe(true)
  })

  it('deselectAll clears all', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.selectAll(['skill-1', 'skill-2', 'skill-3'])
    })

    expect(result.current.count).toBe(3)

    act(() => {
      result.current.deselectAll()
    })

    expect(result.current.count).toBe(0)
    expect(result.current.hasSelection).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
  })

  it('isSelected returns correct boolean', () => {
    const { result } = renderHook(() => useSkillSelection())

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.isSelected('skill-1')).toBe(true)
    expect(result.current.isSelected('skill-2')).toBe(false)
  })

  it('count reflects selection size', () => {
    const { result } = renderHook(() => useSkillSelection())

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.count).toBe(1)

    act(() => {
      result.current.toggle('skill-2')
      result.current.toggle('skill-3')
    })

    expect(result.current.count).toBe(3)

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.count).toBe(2)
  })

  it('hasSelection is true when count > 0', () => {
    const { result } = renderHook(() => useSkillSelection())

    expect(result.current.hasSelection).toBe(false)

    act(() => {
      result.current.toggle('skill-1')
    })

    expect(result.current.hasSelection).toBe(true)

    act(() => {
      result.current.deselectAll()
    })

    expect(result.current.hasSelection).toBe(false)
  })
})
