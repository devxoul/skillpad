import { beforeEach, expect, mock, test } from 'bun:test'
import { fetchSkills, searchSkills } from '@/lib/api'
import { ApiError } from '@/types/api'

let mockFetchQueue: any[] = []
let mockFetchCalls: any[] = []

const mockFetch = mock(async (...args: any[]) => {
  mockFetchCalls.push(args)
  if (mockFetchQueue.length > 0) {
    const response = mockFetchQueue.shift()
    if (response instanceof Error) {
      throw response
    }
    return response
  }
})

mock.module('@tauri-apps/plugin-http', () => ({
  fetch: mockFetch,
}))

beforeEach(() => {
  mockFetchQueue = []
  mockFetchCalls = []
  mockFetch.mockClear()
})

test('fetchSkills returns skills from search endpoint', async () => {
  const mockResponse = {
    skills: [
      { id: '1', skillId: 'react', name: 'React', installs: 1000, source: 'opencode/skills' },
      { id: '2', skillId: 'vue', name: 'Vue', installs: 800, source: 'opencode/skills' },
    ],
    count: 2,
  }
  mockFetchQueue.push({
    ok: true,
    json: async () => mockResponse,
  })

  const result = await fetchSkills()

  expect(result).toHaveLength(2)
  expect(result[0]?.name).toBe('React')
  expect(result[0]?.topSource).toBe('opencode/skills')
  expect(mockFetchCalls[0]).toEqual(['https://skills.sh/api/search?q=sk&limit=200'])
})

test('fetchSkills handles HTTP errors', async () => {
  mockFetchQueue.push({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  })

  try {
    await fetchSkills()
    throw new Error('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    expect((error as Error).message).toContain('Failed to fetch skills: Not Found')
  }
})

test('fetchSkills handles network errors', async () => {
  mockFetchQueue.push(new Error('Network timeout'))

  try {
    await fetchSkills()
    throw new Error('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    expect((error as Error).message).toContain('Network error: Network timeout')
  }
})

test('fetchSkills handles empty response', async () => {
  mockFetchQueue.push({
    ok: true,
    json: async () => ({}),
  })

  const result = await fetchSkills()

  expect(result).toEqual([])
})

test('searchSkills returns matching skills', async () => {
  const mockResponse = {
    skills: [{ id: '1', skillId: 'react', name: 'React', installs: 1000, source: 'opencode/skills' }],
  }
  mockFetchQueue.push({
    ok: true,
    json: async () => mockResponse,
  })

  const result = await searchSkills('React')

  expect(result).toHaveLength(1)
  expect(result[0]?.name).toBe('React')
  expect(mockFetchCalls[0]).toEqual(['https://skills.sh/api/search?q=React&limit=20'])
})

test('searchSkills encodes query parameters', async () => {
  const mockResponse = { skills: [] }
  mockFetchQueue.push({
    ok: true,
    json: async () => mockResponse,
  })

  await searchSkills('React Native')

  expect(mockFetchCalls[0]).toEqual(['https://skills.sh/api/search?q=React%20Native&limit=20'])
})

test('searchSkills returns empty array for empty query', async () => {
  const result = await searchSkills('')

  expect(result).toEqual([])
  expect(mockFetchCalls).toHaveLength(0)
})

test('searchSkills returns empty array for whitespace-only query', async () => {
  const result = await searchSkills('   ')

  expect(result).toEqual([])
  expect(mockFetchCalls).toHaveLength(0)
})

test('searchSkills returns empty array for single character query', async () => {
  const result = await searchSkills('a')

  expect(result).toEqual([])
  expect(mockFetchCalls).toHaveLength(0)
})

test('searchSkills handles HTTP errors', async () => {
  mockFetchQueue.push({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
  })

  try {
    await searchSkills('React')
    throw new Error('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    expect((error as Error).message).toContain('Failed to search skills: Internal Server Error')
  }
})

test('searchSkills handles network errors', async () => {
  mockFetchQueue.push(new Error('Connection refused'))

  try {
    await searchSkills('React')
    throw new Error('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    expect((error as Error).message).toContain('Network error: Connection refused')
  }
})
