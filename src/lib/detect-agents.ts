import { invoke } from '@tauri-apps/api/core'
import { homeDir } from '@tauri-apps/api/path'

import { AGENTS } from '@/data/agents'

interface AgentDetection {
  commands?: string[]
  apps?: string[]
  dirs?: string[]
}

export const AGENT_DETECTION: Record<string, AgentDetection> = {
  amp: { commands: ['amp'] },
  antigravity: { commands: ['antigravity'] },
  'claude-code': { commands: ['claude'] },
  codex: { commands: ['codex'] },
  'gemini-cli': { commands: ['gemini'] },
  goose: { commands: ['goose'] },
  'kimi-cli': { commands: ['kimi'] },
  'kiro-cli': { commands: ['kiro'] },
  opencode: { commands: ['opencode'] },
  pi: { commands: ['pi'] },

  cursor: { commands: ['cursor'], apps: ['/Applications/Cursor.app'] },
  trae: { commands: ['trae'], apps: ['/Applications/Trae.app'] },
  'trae-cn': { commands: ['trae-cn'], apps: ['/Applications/Trae CN.app'] },
  windsurf: { commands: ['windsurf'], apps: ['/Applications/Windsurf.app'] },

  adal: { dirs: ['.adal'] },
  augment: { dirs: ['.augment'] },
  cline: { dirs: ['.cline'] },
  codebuddy: { dirs: ['.codebuddy'] },
  'command-code': { dirs: ['.commandcode'] },
  continue: { commands: ['continue'], dirs: ['.continue'] },
  cortex: { dirs: ['.snowflake/cortex'] },
  crush: { dirs: ['.config/crush'] },
  droid: { dirs: ['.factory'] },
  'github-copilot': { dirs: ['.copilot'] },
  'iflow-cli': { dirs: ['.iflow'] },
  junie: { dirs: ['.junie'] },
  kilo: { dirs: ['.kilocode'] },
  kode: { dirs: ['.kode'] },
  mcpjam: { dirs: ['.mcpjam'] },
  'mistral-vibe': { dirs: ['.vibe'] },
  mux: { dirs: ['.mux'] },
  neovate: { dirs: ['.neovate'] },
  openclaw: { dirs: ['.openclaw', '.clawdbot', '.moltbot'] },
  openhands: { dirs: ['.openhands'] },
  pochi: { dirs: ['.pochi'] },
  qoder: { dirs: ['.qoder'] },
  'qwen-code': { dirs: ['.qwen'] },
  roo: { dirs: ['.roo'] },
  zencoder: { dirs: ['.zencoder'] },
}

export async function detectInstalledAgents(): Promise<Set<string>> {
  const home = await homeDir()

  const commandAgentIds: string[] = []
  const commands: string[] = []
  const dirAgentIds: string[] = []
  const dirPaths: string[] = []

  for (const agent of AGENTS) {
    const detection = AGENT_DETECTION[agent.id]
    if (!detection) continue

    if (detection.commands) {
      for (const cmd of detection.commands) {
        commandAgentIds.push(agent.id)
        commands.push(cmd)
      }
    }

    if (detection.apps) {
      for (const app of detection.apps) {
        dirAgentIds.push(agent.id)
        dirPaths.push(app)
      }
    }

    if (detection.dirs) {
      for (const dir of detection.dirs) {
        dirAgentIds.push(agent.id)
        dirPaths.push(`${home}${dir}`)
      }
    }
  }

  const [commandResults, dirResults] = await Promise.all([
    commands.length > 0
      ? invoke<boolean[]>('check_commands_on_path', { commands })
      : Promise.resolve([]),
    dirPaths.length > 0
      ? invoke<boolean[]>('check_directories_exist', { paths: dirPaths })
      : Promise.resolve([]),
  ])

  const installed = new Set<string>()
  for (let i = 0; i < commandResults.length; i++) {
    if (commandResults[i]) installed.add(commandAgentIds[i]!)
  }
  for (let i = 0; i < dirResults.length; i++) {
    if (dirResults[i]) installed.add(dirAgentIds[i]!)
  }
  return installed
}

export function computeHiddenAgents(installed: Set<string>): string[] {
  return AGENTS.filter((a) => AGENT_DETECTION[a.id] && !installed.has(a.id)).map((a) => a.id)
}
