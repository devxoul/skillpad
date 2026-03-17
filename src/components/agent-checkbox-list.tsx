import { CaretDown } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import { useMemo, useState } from 'react'

import { AgentIcon } from '@/components/agent-icon'
import { AGENTS } from '@/data/agents'
import { useTranslations } from '@/lib/i18n'
import { Checkbox } from '@/ui/checkbox'

interface AgentCheckboxListProps {
  selectedAgents: string[]
  hiddenAgents: string[]
  onToggleAgent: (agentId: string) => void
}

export function AgentCheckboxList({ selectedAgents, hiddenAgents, onToggleAgent }: AgentCheckboxListProps) {
  const [showHidden, setShowHidden] = useState(false)
  const t = useTranslations()

  const { visibleAgents, collapsedAgents } = useMemo(() => {
    const hiddenSet = new Set(hiddenAgents)
    const selectedSet = new Set(selectedAgents)
    return {
      visibleAgents: AGENTS.filter((a) => !hiddenSet.has(a.id) || selectedSet.has(a.id)),
      collapsedAgents: AGENTS.filter((a) => hiddenSet.has(a.id) && !selectedSet.has(a.id)),
    }
  }, [hiddenAgents, selectedAgents])

  return (
    <>
      {visibleAgents.map((agent) => (
        <label
          key={agent.id}
          className="flex items-center gap-2 rounded-md p-1.5 text-[13px] hover:bg-foreground/[0.06]"
        >
          <Checkbox checked={selectedAgents.includes(agent.id)} onCheckedChange={() => onToggleAgent(agent.id)} />
          <AgentIcon agent={agent.id} size={16} />
          <span>{agent.name}</span>
        </label>
      ))}
      {collapsedAgents.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="flex w-full items-center gap-1.5 rounded-md p-1.5 text-[12px] text-foreground/40 transition-colors hover:bg-foreground/[0.06] hover:text-foreground/60"
          >
            <CaretDown
              size={12}
              weight="bold"
              className={clsx('transition-transform duration-150', showHidden && 'rotate-180')}
            />
            <span>
              {showHidden ? t.agent_list_show_fewer : t.agent_list_show_more({ count: String(collapsedAgents.length) })}
            </span>
          </button>
          {showHidden &&
            collapsedAgents.map((agent) => (
              <label
                key={agent.id}
                className="flex items-center gap-2 rounded-md p-1.5 text-[13px] text-foreground/50 hover:bg-foreground/[0.06]"
              >
                <Checkbox checked={selectedAgents.includes(agent.id)} onCheckedChange={() => onToggleAgent(agent.id)} />
                <AgentIcon agent={agent.id} size={16} className="opacity-50" />
                <span>{agent.name}</span>
              </label>
            ))}
        </>
      )}
    </>
  )
}
