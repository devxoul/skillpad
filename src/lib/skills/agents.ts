export interface AgentConfig {
  id: string
  globalSkillsDir: string
  projectSkillsDir: string
}

const CANONICAL_SKILLS_DIR = '.agents/skills'

export const AGENTS: AgentConfig[] = [
  { id: 'amp', globalSkillsDir: '.config/agents/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'antigravity', globalSkillsDir: '.gemini/antigravity/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'cline', globalSkillsDir: CANONICAL_SKILLS_DIR, projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'codex', globalSkillsDir: '.codex/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'cursor', globalSkillsDir: '.cursor/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'deepagents', globalSkillsDir: '.deepagents/agent/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'firebender', globalSkillsDir: '.firebender/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'gemini-cli', globalSkillsDir: '.gemini/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'github-copilot', globalSkillsDir: '.copilot/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'kimi-cli', globalSkillsDir: '.config/agents/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'opencode', globalSkillsDir: '.config/opencode/skills', projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'warp', globalSkillsDir: CANONICAL_SKILLS_DIR, projectSkillsDir: CANONICAL_SKILLS_DIR },
  { id: 'adal', globalSkillsDir: '.adal/skills', projectSkillsDir: '.adal/skills' },
  { id: 'augment', globalSkillsDir: '.augment/skills', projectSkillsDir: '.augment/skills' },
  { id: 'bob', globalSkillsDir: '.bob/skills', projectSkillsDir: '.bob/skills' },
  { id: 'claude-code', globalSkillsDir: '.claude/skills', projectSkillsDir: '.claude/skills' },
  { id: 'codebuddy', globalSkillsDir: '.codebuddy/skills', projectSkillsDir: '.codebuddy/skills' },
  { id: 'command-code', globalSkillsDir: '.commandcode/skills', projectSkillsDir: '.commandcode/skills' },
  { id: 'continue', globalSkillsDir: '.continue/skills', projectSkillsDir: '.continue/skills' },
  { id: 'cortex', globalSkillsDir: '.snowflake/cortex/skills', projectSkillsDir: '.cortex/skills' },
  { id: 'crush', globalSkillsDir: '.config/crush/skills', projectSkillsDir: '.crush/skills' },
  { id: 'droid', globalSkillsDir: '.factory/skills', projectSkillsDir: '.factory/skills' },
  { id: 'goose', globalSkillsDir: '.config/goose/skills', projectSkillsDir: '.goose/skills' },
  { id: 'iflow-cli', globalSkillsDir: '.iflow/skills', projectSkillsDir: '.iflow/skills' },
  { id: 'junie', globalSkillsDir: '.junie/skills', projectSkillsDir: '.junie/skills' },
  { id: 'kilo', globalSkillsDir: '.kilocode/skills', projectSkillsDir: '.kilocode/skills' },
  { id: 'kiro-cli', globalSkillsDir: '.kiro/skills', projectSkillsDir: '.kiro/skills' },
  { id: 'kode', globalSkillsDir: '.kode/skills', projectSkillsDir: '.kode/skills' },
  { id: 'mcpjam', globalSkillsDir: '.mcpjam/skills', projectSkillsDir: '.mcpjam/skills' },
  { id: 'mistral-vibe', globalSkillsDir: '.vibe/skills', projectSkillsDir: '.vibe/skills' },
  { id: 'mux', globalSkillsDir: '.mux/skills', projectSkillsDir: '.mux/skills' },
  { id: 'neovate', globalSkillsDir: '.neovate/skills', projectSkillsDir: '.neovate/skills' },
  { id: 'openclaw', globalSkillsDir: '.openclaw/skills', projectSkillsDir: 'skills' },
  { id: 'openhands', globalSkillsDir: '.openhands/skills', projectSkillsDir: '.openhands/skills' },
  { id: 'pi', globalSkillsDir: '.pi/agent/skills', projectSkillsDir: '.pi/skills' },
  { id: 'pochi', globalSkillsDir: '.pochi/skills', projectSkillsDir: '.pochi/skills' },
  { id: 'qoder', globalSkillsDir: '.qoder/skills', projectSkillsDir: '.qoder/skills' },
  { id: 'qwen-code', globalSkillsDir: '.qwen/skills', projectSkillsDir: '.qwen/skills' },
  { id: 'roo', globalSkillsDir: '.roo/skills', projectSkillsDir: '.roo/skills' },
  { id: 'trae', globalSkillsDir: '.trae/skills', projectSkillsDir: '.trae/skills' },
  { id: 'trae-cn', globalSkillsDir: '.trae-cn/skills', projectSkillsDir: '.trae/skills' },
  { id: 'windsurf', globalSkillsDir: '.codeium/windsurf/skills', projectSkillsDir: '.windsurf/skills' },
  { id: 'zencoder', globalSkillsDir: '.zencoder/skills', projectSkillsDir: '.zencoder/skills' },
]

export const AGENT_MAP = new Map<string, AgentConfig>(AGENTS.map((a) => [a.id, a]))

export function getCanonicalSkillsDir(global: boolean, home: string, cwd?: string): string {
  if (global) return `${home}/${CANONICAL_SKILLS_DIR}`
  return `${cwd ?? '.'}/${CANONICAL_SKILLS_DIR}`
}

export function getAgentSkillsDir(agentId: string, global: boolean, home: string, cwd?: string): string | null {
  const agent = AGENT_MAP.get(agentId)
  if (!agent) return null
  if (global) return `${home}/${agent.globalSkillsDir}`
  return `${cwd ?? '.'}/${agent.projectSkillsDir}`
}

export function needsSymlink(agentId: string, global: boolean): boolean {
  const agent = AGENT_MAP.get(agentId)
  if (!agent) return false
  if (global) return agent.globalSkillsDir !== CANONICAL_SKILLS_DIR
  return agent.projectSkillsDir !== CANONICAL_SKILLS_DIR
}
