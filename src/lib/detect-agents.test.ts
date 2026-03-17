import { beforeEach, describe, expect, it } from 'bun:test'

import { AGENTS } from '@/data/agents'
import { mockInvoke } from '@/test-mocks'

import { AGENT_DETECTION, computeHiddenAgents, detectInstalledAgents } from './detect-agents'

describe('computeHiddenAgents', () => {
  it('hides agents not in installed set', () => {
    const installed = new Set(['claude-code', 'cursor'])

    const hidden = computeHiddenAgents(installed)

    expect(hidden).not.toContain('claude-code')
    expect(hidden).not.toContain('cursor')
    expect(hidden).toContain('windsurf')
    expect(hidden).toContain('opencode')
  })

  it('returns empty when all agents are installed', () => {
    const installed = new Set(AGENTS.map((a) => a.id))

    const hidden = computeHiddenAgents(installed)

    expect(hidden).toEqual([])
  })

  it('skips agents without detection config', () => {
    const installed = new Set<string>()

    const hidden = computeHiddenAgents(installed)

    const agentsWithoutDetection = AGENTS.filter((a) => !AGENT_DETECTION[a.id]).map((a) => a.id)
    for (const id of agentsWithoutDetection) {
      expect(hidden).not.toContain(id)
    }
  })
})

describe('detectInstalledAgents', () => {
  beforeEach(() => {
    mockInvoke.mockReset()
  })

  it('detects agents via command on PATH', async () => {
    mockInvoke.mockImplementation(async (cmd: string, args: any) => {
      if (cmd === 'check_commands_on_path') {
        return (args.commands as string[]).map((c: string) => c === 'claude' || c === 'opencode')
      }
      if (cmd === 'check_directories_exist') {
        return (args.paths as string[]).map(() => false)
      }
      return []
    })

    const result = await detectInstalledAgents()

    expect(result.has('claude-code')).toBe(true)
    expect(result.has('opencode')).toBe(true)
    expect(result.has('cursor')).toBe(false)
  })

  it('detects agents via app bundle path', async () => {
    mockInvoke.mockImplementation(async (cmd: string, args: any) => {
      if (cmd === 'check_commands_on_path') {
        return (args.commands as string[]).map(() => false)
      }
      if (cmd === 'check_directories_exist') {
        return (args.paths as string[]).map((p: string) => p === '/Applications/Cursor.app')
      }
      return []
    })

    const result = await detectInstalledAgents()

    expect(result.has('cursor')).toBe(true)
    expect(result.has('windsurf')).toBe(false)
  })

  it('detects agents via fallback directory check', async () => {
    mockInvoke.mockImplementation(async (cmd: string, args: any) => {
      if (cmd === 'check_commands_on_path') {
        return (args.commands as string[]).map(() => false)
      }
      if (cmd === 'check_directories_exist') {
        return (args.paths as string[]).map((p: string) => p.includes('.cline'))
      }
      return []
    })

    const result = await detectInstalledAgents()

    expect(result.has('cline')).toBe(true)
  })

  it('merges results from both checks', async () => {
    // given - claude found on PATH, cursor found via app bundle
    mockInvoke.mockImplementation(async (cmd: string, args: any) => {
      if (cmd === 'check_commands_on_path') {
        return (args.commands as string[]).map((c: string) => c === 'claude')
      }
      if (cmd === 'check_directories_exist') {
        return (args.paths as string[]).map((p: string) => p === '/Applications/Cursor.app')
      }
      return []
    })

    const result = await detectInstalledAgents()

    expect(result.has('claude-code')).toBe(true)
    expect(result.has('cursor')).toBe(true)
  })
})
