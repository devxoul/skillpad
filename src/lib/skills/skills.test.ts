import { beforeEach, describe, expect, it } from 'bun:test'

import {
  mockFsExists,
  mockFsMkdir,
  mockFsReadDir,
  mockFsReadTextFile,
  mockFsRemove,
  mockFsWriteTextFile,
  mockHomeDir,
  mockHttpFetch,
  mockInvoke,
} from '@/test-mocks'

import { checkUpdatesApi } from './check-updates'
import { listSkills } from './list'
import { readLocalSkillMd, readSkillSources } from './read-skill'
import { removeSkill } from './remove'

const LOCK_FILE_CONTENT = JSON.stringify({
  version: 3,
  skills: {
    'my-skill': {
      source: 'user/repo',
      sourceType: 'github',
      sourceUrl: 'https://github.com/user/repo.git',
      skillPath: 'skills/my-skill',
      skillFolderHash: 'abc123',
      installedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  },
})

describe('listSkills', () => {
  it('returns empty array when invoke returns empty', async () => {
    mockInvoke.mockResolvedValueOnce([])

    const result = await listSkills({ global: true })

    expect(result).toEqual([])
  })

  it('returns skills from Rust list_skills command', async () => {
    mockInvoke.mockResolvedValueOnce([
      { name: 'my-skill', path: '/Users/test/.agents/skills/my-skill', agents: ['claude-code'] },
    ])

    const result = await listSkills({ global: true })

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('my-skill')
    expect(result[0]?.path).toBe('/Users/test/.agents/skills/my-skill')
    expect(result[0]?.agents).toEqual(['claude-code'])
  })

  it('passes correct params to invoke', async () => {
    mockInvoke.mockResolvedValueOnce([])

    await listSkills({ global: false, cwd: '/path/to/project' })

    expect(mockInvoke).toHaveBeenCalledWith('list_skills', { global: false, cwd: '/path/to/project' })
  })

  it('propagates invoke errors to caller', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('command failed'))

    await expect(listSkills({ global: true })).rejects.toThrow('command failed')
  })
})

describe('checkUpdatesApi', () => {
  it('returns empty result when no skills installed', async () => {
    mockFsReadTextFile.mockRejectedValueOnce(new Error('not found'))

    const result = await checkUpdatesApi()

    expect(result).toEqual({ totalChecked: 0, updatesAvailable: [], errors: [] })
  })

  it('reads lock file and calls API with correct payload', async () => {
    mockFsReadTextFile.mockResolvedValueOnce(LOCK_FILE_CONTENT)

    mockHttpFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        updates: [{ name: 'my-skill', source: 'user/repo', currentHash: 'abc123', latestHash: 'def456' }],
        errors: [],
      }),
    })

    const result = await checkUpdatesApi()

    expect(result.totalChecked).toBe(1)
    expect(result.updatesAvailable).toHaveLength(1)
    expect(result.updatesAvailable[0]?.name).toBe('my-skill')
    expect(result.errors).toHaveLength(0)
  })

  it('throws when API request fails', async () => {
    mockFsReadTextFile.mockResolvedValueOnce(LOCK_FILE_CONTENT)

    mockHttpFetch.mockResolvedValueOnce({ ok: false, status: 500 })

    await expect(checkUpdatesApi()).rejects.toThrow('Failed to check updates via API')
  })

  it('returns errors from API response', async () => {
    mockFsReadTextFile.mockResolvedValueOnce(LOCK_FILE_CONTENT)

    mockHttpFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        updates: [],
        errors: [{ name: 'my-skill', source: 'user/repo', error: 'Network timeout' }],
      }),
    })

    const result = await checkUpdatesApi()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.error).toBe('Network timeout')
  })
})

describe('readLocalSkillMd', () => {
  it('reads SKILL.md from skill directory', async () => {
    mockInvoke.mockImplementation(async (cmd: string, args?: any) => {
      if (cmd === 'read_text_file' && args?.path === '/home/.agents/skills/my-skill/SKILL.md') {
        return '# My Skill\n\nDescription here.'
      }
      throw new Error('not found')
    })

    const result = await readLocalSkillMd('/home/.agents/skills/my-skill')

    expect(result).toBe('# My Skill\n\nDescription here.')
  })

  it('falls back to skillPath directly when SKILL.md subpath fails', async () => {
    mockInvoke.mockImplementation(async (cmd: string, args?: any) => {
      if (cmd === 'read_text_file') {
        if (args?.path === '/home/.agents/skills/my-skill/SKILL.md/SKILL.md') throw new Error('not found')
        if (args?.path === '/home/.agents/skills/my-skill/SKILL.md') return '# Direct Path Skill'
      }
      throw new Error('not found')
    })

    const result = await readLocalSkillMd('/home/.agents/skills/my-skill/SKILL.md')

    expect(result).toBe('# Direct Path Skill')
  })

  it('throws when no path yields content', async () => {
    mockInvoke.mockImplementation(async (cmd: string) => {
      if (cmd === 'read_text_file') throw new Error('not found')
      throw new Error('unknown command')
    })

    await expect(readLocalSkillMd('/nonexistent/path')).rejects.toThrow(
      'No local SKILL.md found at /nonexistent/path',
    )
  })

  it('skips empty content even on success', async () => {
    const calls: string[] = []
    mockInvoke.mockImplementation(async (cmd: string, args?: any) => {
      if (cmd === 'read_text_file') {
        calls.push(args?.path)
        if (args?.path === '/home/.agents/skills/my-skill/SKILL.md') return '   '
        if (args?.path === '/home/.agents/skills/my-skill') return '# Fallback Content'
      }
      throw new Error('not found')
    })

    const result = await readLocalSkillMd('/home/.agents/skills/my-skill')

    expect(result).toBe('# Fallback Content')
  })

  it('expands tilde to home directory', async () => {
    const readPaths: string[] = []
    mockInvoke.mockImplementation(async (cmd: string, args?: any) => {
      if (cmd === 'home_dir') return '/Users/test'
      if (cmd === 'read_text_file') {
        readPaths.push(args?.path)
        if (args?.path === '/Users/test/.agents/skills/my-skill/SKILL.md') return '# Tilde Skill'
      }
      throw new Error('not found')
    })

    const result = await readLocalSkillMd('~/.agents/skills/my-skill')

    expect(result).toBe('# Tilde Skill')
    expect(readPaths[0]).toBe('/Users/test/.agents/skills/my-skill/SKILL.md')
  })
})

describe('readSkillSources', () => {
  it('returns skill sources from lock file', async () => {
    mockFsReadTextFile.mockResolvedValueOnce(LOCK_FILE_CONTENT)

    const result = await readSkillSources()

    expect(result).toEqual({ 'my-skill': 'user/repo' })
  })

  it('returns empty object when lock file missing', async () => {
    mockFsReadTextFile.mockRejectedValueOnce(new Error('not found'))

    const result = await readSkillSources()

    expect(result).toEqual({})
  })
})

describe('removeSkill', () => {
  beforeEach(() => {
    mockHomeDir.mockResolvedValue('/Users/test')
    mockInvoke.mockResolvedValue(false)
    mockFsExists.mockResolvedValue(false)
    mockFsReadTextFile.mockResolvedValue(LOCK_FILE_CONTENT)
    mockFsWriteTextFile.mockResolvedValue(undefined)
    mockFsMkdir.mockResolvedValue(undefined)
  })

  it('removes canonical skill dir and updates lock file', async () => {
    mockFsExists.mockImplementation(async (path: string) => path.includes('my-skill'))

    await removeSkill('my-skill', { global: true })

    const removeCalls = (mockFsRemove as ReturnType<typeof import('bun:test').mock>).mock.calls
    const canonicalRemoved = removeCalls.some((c: string[]) => c[0]?.includes('.agents/skills/my-skill'))
    expect(canonicalRemoved).toBe(true)

    expect(mockFsWriteTextFile).toHaveBeenCalled()
    const writeCall = (mockFsWriteTextFile as ReturnType<typeof import('bun:test').mock>).mock.calls[0]
    const writtenContent = JSON.parse(writeCall?.[1] ?? '{}')
    expect(writtenContent.skills['my-skill']).toBeUndefined()
  })
})
