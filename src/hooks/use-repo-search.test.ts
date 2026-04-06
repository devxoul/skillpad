import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { act, renderHook } from '@testing-library/react'

import * as api from '@/lib/api'
import { ApiError } from '@/types/api'

import { getRepoSearchCache, useRepoSearch } from './use-repo-search'

let mockSearchReposByName: any
let mockIsRepoQuery: any
let mockIsSkillPathQuery: any

const mockSkills = [
  {
    id: 'repo:agent-messenger/agent-messenger',
    name: 'agent-messenger',
    installs: 0,
    topSource: 'agent-messenger/agent-messenger',
  },
]

beforeEach(() => {
  mockSearchReposByName = spyOn(api, 'searchReposByName').mockResolvedValue([])
  mockIsRepoQuery = spyOn(api, 'isRepoQuery').mockReturnValue(false)
  mockIsSkillPathQuery = spyOn(api, 'isSkillPathQuery').mockReturnValue(false)
  getRepoSearchCache().clear()
})

afterEach(() => {
  mockSearchReposByName.mockRestore()
  mockIsRepoQuery.mockRestore()
  mockIsSkillPathQuery.mockRestore()
  getRepoSearchCache().clear()
})

describe('useRepoSearch', () => {
  it('returns empty state when query is too short', async () => {
    const { result } = renderHook(() => useRepoSearch('a', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(mockSearchReposByName).not.toHaveBeenCalled()
  })

  it('returns empty state when query is owner/repo format', async () => {
    mockIsRepoQuery.mockReturnValue(true)

    const { result } = renderHook(() => useRepoSearch('xoul/skills', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual([])
    expect(mockSearchReposByName).not.toHaveBeenCalled()
  })

  it('returns empty state when skill search has results', async () => {
    const { result } = renderHook(() => useRepoSearch('agent-messenger', false))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual([])
    expect(mockSearchReposByName).not.toHaveBeenCalled()
  })

  it('searches GitHub repos when skill search is empty', async () => {
    mockSearchReposByName.mockResolvedValue(mockSkills)

    const { result } = renderHook(() => useRepoSearch('agent-messenger', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual(mockSkills)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockSearchReposByName).toHaveBeenCalledWith('agent-messenger')
  })

  it('uses cache on second render', async () => {
    mockSearchReposByName.mockResolvedValue(mockSkills)

    const { result, rerender } = renderHook(({ query, empty }) => useRepoSearch(query, empty), {
      initialProps: { query: 'agent-messenger', empty: true },
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(mockSearchReposByName).toHaveBeenCalledTimes(1)

    rerender({ query: 'agent-messenger', empty: true })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(mockSearchReposByName).toHaveBeenCalledTimes(1)
    expect(result.current.skills).toEqual(mockSkills)
  })

  it('shows rate limit error on 403', async () => {
    mockSearchReposByName.mockRejectedValue(new ApiError('Rate limited', 403))

    const { result } = renderHook(() => useRepoSearch('agent-messenger', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual([])
    expect(result.current.error).toBe('GitHub API rate limit exceeded. Try again later.')
  })

  it('shows generic error for non-403 errors', async () => {
    mockSearchReposByName.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useRepoSearch('agent-messenger', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.error).toBe('Failed to search GitHub repositories')
  })

  it('sets loading while fetching', async () => {
    let resolveFetch: (skills: any[]) => void
    const fetchPromise = new Promise<any[]>((resolve) => {
      resolveFetch = resolve
    })
    mockSearchReposByName.mockImplementationOnce(async () => fetchPromise)

    const { result } = renderHook(() => useRepoSearch('agent-messenger', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveFetch!(mockSkills)
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.skills).toEqual(mockSkills)
  })

  it('returns empty state when query is skill path format', async () => {
    mockIsSkillPathQuery.mockReturnValue(true)

    const { result } = renderHook(() => useRepoSearch('xoul/skills/git-master', true))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.skills).toEqual([])
    expect(mockSearchReposByName).not.toHaveBeenCalled()
  })
})
