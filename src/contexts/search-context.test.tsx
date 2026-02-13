import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SearchPersistenceProvider, useSearchPersistenceContext } from '@/contexts/search-context'

function wrapper({ children }: { children: ReactNode }) {
  return <SearchPersistenceProvider>{children}</SearchPersistenceProvider>
}

describe('SearchPersistenceContext', () => {
  it('saves and retrieves search query', () => {
    const { result } = renderHook(() => useSearchPersistenceContext(), { wrapper })

    act(() => {
      result.current.saveSearchQuery('/', 'react')
    })

    expect(result.current.getSearchQuery('/')).toBe('react')
  })

  it('returns undefined for unknown key', () => {
    const { result } = renderHook(() => useSearchPersistenceContext(), { wrapper })

    expect(result.current.getSearchQuery('/unknown')).toBeUndefined()
  })

  it('deletes entry when saving empty query', () => {
    const { result } = renderHook(() => useSearchPersistenceContext(), { wrapper })

    act(() => {
      result.current.saveSearchQuery('/', 'react')
    })
    expect(result.current.getSearchQuery('/')).toBe('react')

    act(() => {
      result.current.saveSearchQuery('/', '')
    })
    expect(result.current.getSearchQuery('/')).toBeUndefined()
  })

  it('stores queries independently per key', () => {
    const { result } = renderHook(() => useSearchPersistenceContext(), { wrapper })

    act(() => {
      result.current.saveSearchQuery('/', 'gallery-query')
      result.current.saveSearchQuery('/global', 'global-query')
    })

    expect(result.current.getSearchQuery('/')).toBe('gallery-query')
    expect(result.current.getSearchQuery('/global')).toBe('global-query')
  })

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useSearchPersistenceContext())
    }).toThrow('useSearchPersistenceContext must be used within SearchPersistenceProvider')
  })
})
