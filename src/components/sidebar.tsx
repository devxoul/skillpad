import { useProjects } from '@/hooks/use-projects'
import type { Project } from '@/types/project'
import { Button } from '@/ui/button'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { clsx } from 'clsx'
import { Link, useLocation } from 'react-router-dom'

interface NavLinkProps {
  to: string
  children: React.ReactNode
  exact?: boolean
}

function NavLink({ to, children, exact = false }: NavLinkProps) {
  const location = useLocation()
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to) && (to === '/' ? location.pathname === '/' : true)

  return (
    <Link
      to={to}
      className={clsx(
        'flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
        isActive
          ? 'bg-foreground/[0.08] text-foreground font-semibold'
          : 'text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground',
      )}
    >
      {children}
    </Link>
  )
}

interface ProjectItemProps {
  project: Project
  onRemove: (id: string) => void
}

function ProjectItem({ project, onRemove }: ProjectItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-foreground/[0.04]"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </button>
      <Link to={`/project/${project.id}`} className="flex-1 truncate text-foreground">
        {project.name}
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onRemove(project.id)
        }}
        className="text-muted-foreground opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
        aria-label="Remove project"
      >
        ×
      </button>
    </div>
  )
}

export function Sidebar() {
  const { projects, loading, importProject, removeProject, reorderProjects } = useProjects()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const newOrder = [...projects]
    const [moved] = newOrder.splice(oldIndex, 1)
    if (!moved) {
      return
    }
    newOrder.splice(newIndex, 0, moved)

    reorderProjects(newOrder)
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface/70 backdrop-blur-xl">
      <nav className="flex-1 space-y-4 pt-2">
        <div>
          <NavLink to="/" exact>
            <span className="text-lg">📚</span>
            <span>Browse Gallery</span>
          </NavLink>
          <NavLink to="/global">
            <span className="text-lg">🌍</span>
            <span>Global Skills</span>
          </NavLink>
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between px-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Projects
            </h3>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={importProject}>
              Import
            </Button>
          </div>

          {loading ? (
            <div className="px-4 py-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-4 text-center text-sm text-muted-foreground/60">
              No projects
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={projects.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {projects.map((project) => (
                    <ProjectItem key={project.id} project={project} onRemove={removeProject} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </nav>
    </aside>
  )
}
