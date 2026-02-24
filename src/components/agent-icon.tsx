import Claude from '@lobehub/icons/es/Claude/components/Mono'
import Cline from '@lobehub/icons/es/Cline/components/Mono'
import Cursor from '@lobehub/icons/es/Cursor/components/Mono'
import Gemini from '@lobehub/icons/es/Gemini/components/Mono'
import GithubCopilot from '@lobehub/icons/es/GithubCopilot/components/Mono'
import Goose from '@lobehub/icons/es/Goose/components/Mono'
import Kimi from '@lobehub/icons/es/Kimi/components/Mono'
import Mistral from '@lobehub/icons/es/Mistral/components/Mono'
import OpenAI from '@lobehub/icons/es/OpenAI/components/Mono'
import OpenClaw from '@lobehub/icons/es/OpenClaw/components/Mono'
import Qwen from '@lobehub/icons/es/Qwen/components/Mono'
import Replit from '@lobehub/icons/es/Replit/components/Mono'
import Trae from '@lobehub/icons/es/Trae/components/Mono'
import Windsurf from '@lobehub/icons/es/Windsurf/components/Mono'
import { Robot } from '@phosphor-icons/react'
import type { ReactElement } from 'react'

interface AgentIconProps {
  agent: string
  size?: number
  className?: string
}

type IconRenderer = (size: number, className?: string) => ReactElement

const AGENT_ICONS: Record<string, IconRenderer> = {
  'claude-code': (size, className) => <Claude size={size} className={className} />,
  cursor: (size, className) => <Cursor size={size} className={className} />,
  cline: (size, className) => <Cline size={size} className={className} />,
  windsurf: (size, className) => <Windsurf size={size} className={className} />,
  'github-copilot': (size, className) => <GithubCopilot size={size} className={className} />,
  'gemini-cli': (size, className) => <Gemini size={size} className={className} />,
  codex: (size, className) => <OpenAI size={size} className={className} />,
  'qwen-code': (size, className) => <Qwen size={size} className={className} />,
  replit: (size, className) => <Replit size={size} className={className} />,
  goose: (size, className) => <Goose size={size} className={className} />,
  'kimi-cli': (size, className) => <Kimi size={size} className={className} />,
  'mistral-vibe': (size, className) => <Mistral size={size} className={className} />,
  openclaw: (size, className) => <OpenClaw size={size} className={className} />,
  trae: (size, className) => <Trae size={size} className={className} />,
  'trae-cn': (size, className) => <Trae size={size} className={className} />,
  roo: (size, className) => (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="currentColor" className={className}>
      <path d="M78.99,21.9l-1.73,6.24c-.09.33-.44.52-.77.42l-28.11-8.71c-.19-.06-.41-.02-.56.11l-28.95,23.22c-.08.07-.18.11-.29.13l-17.25,2.66c-.31.05-.53.32-.52.63l.11,2.47c.01.31.26.56.57.58l20.08,1.23c.11,0,.22-.02.31-.06l14.64-7.4c.21-.11.46-.08.64.06l9.37,7.03c.16.12.25.3.24.49l-.09,11.65c0,.13.04.25.11.35l14.74,21.15c.11.16.3.26.5.26h5.03c.46,0,.76-.5.54-.9l-10.87-19.92c-.1-.18-.1-.4,0-.58l5.51-10.48c.06-.11.15-.2.26-.26l19.56-9.92c.2-.1.43-.09.62.04l5.6,3.73c.1.07.22.1.34.1h5.15c.48,0,.77-.52.52-.93l-14.2-23.52c-.28-.46-.97-.36-1.11.15Z" />
    </svg>
  ),
  kilo: (size, className) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M23,26v-2h3v-5l-2-2h-4v2h-3v5l2,2h4ZM20,20h3v3h-3v-3Z" />
      <rect x="12" y="17" width="3" height="3" />
      <polygon points="26 12 23 12 23 9 20 6 17 6 17 9 20 9 20 12 17 12 17 15 26 15 26 12" />
      <path d="M0,0v32h32V0H0ZM29,29H3V3h26v26Z" />
      <polygon points="15 26 15 23 9 23 9 17 6 17 6 23.1875 8.8125 26 15 26" />
      <rect x="12" y="6" width="3" height="3" />
      <polygon points="9 12 12 12 12 15 15 15 15 12 12 9 9 9 9 6 6 6 6 15 9 15 9 12" />
    </svg>
  ),
  opencode: (size, className) => (
    <svg width={size} height={size} viewBox="0 0 240 300" fill="currentColor" className={className}>
      <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" />
      <path d="M180 240H60V120H180V240Z" opacity="0.4" />
    </svg>
  ),
}

function normalizeAgentId(agent: string): string {
  return agent.toLowerCase().replace(/\s+/g, '-')
}

export function AgentIcon({ agent, size = 16, className }: AgentIconProps) {
  const normalizedAgent = normalizeAgentId(agent)
  const renderIcon = AGENT_ICONS[normalizedAgent]

  if (renderIcon) {
    return renderIcon(size, className)
  }

  return <Robot size={size} className={className} />
}

export { AGENT_ICONS }
