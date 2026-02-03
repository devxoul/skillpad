import type { SkillsResponse } from '@/types/api'
import { ApiError } from '@/types/api'
import type { Skill } from '@/types/skill'
import { fetch } from '@tauri-apps/plugin-http'

const API_BASE = 'https://skills.sh/api'

interface ApiSkill {
  id: string
  skillId: string
  name: string
  installs: number
  source: string
}

export async function fetchSkills(page = 1): Promise<SkillsResponse> {
  try {
    const url = `${API_BASE}/skills${page > 1 ? `?page=${page}` : ''}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new ApiError(`Failed to fetch skills: ${response.statusText}`, response.status)
    }

    const data = await response.json()
    return {
      skills: mapApiSkills(data.skills || []),
      hasMore: data.hasMore || false,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function fetchSkillReadme(source: string, skillName?: string): Promise<string> {
  const branches = ['main', 'master']
  const paths: string[] = []

  if (skillName) {
    paths.push(`skills/${skillName}/SKILL.md`)
    paths.push(`${skillName}/SKILL.md`)
  }
  paths.push('SKILL.md')

  for (const branch of branches) {
    for (const path of paths) {
      try {
        const url = `https://raw.githubusercontent.com/${source}/${branch}/${path}`
        const response = await fetch(url)

        if (response.ok) {
          return await response.text()
        }
      } catch {
        // Continue to next attempt
      }
    }
  }

  throw new ApiError(`Failed to fetch SKILL.md for ${source}`)
}

function mapApiSkills(skills: ApiSkill[]): Skill[] {
  return skills.map((s) => ({
    id: s.id,
    name: s.name,
    installs: s.installs,
    topSource: s.source,
  }))
}

export async function searchSkills(query: string): Promise<Skill[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const url = `${API_BASE}/skills?search=${encodeURIComponent(query)}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new ApiError(`Failed to search skills: ${response.statusText}`, response.status)
    }

    const data = await response.json()
    return mapApiSkills(data.skills || [])
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
