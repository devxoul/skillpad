import { getProjects, importProject, removeProject, reorderProjects } from '@/lib/projects'
import type { Project } from '@/types/project'
import { useEffect, useState } from 'react'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoading(true)
    const data = await getProjects()
    setProjects(data)
    setLoading(false)
  }

  async function handleImport() {
    const project = await importProject()
    if (project) {
      await loadProjects()
    }
  }

  async function handleRemove(id: string) {
    await removeProject(id)
    await loadProjects()
  }

  function handleReorder(newOrder: Project[]) {
    setProjects(newOrder)
    reorderProjects(newOrder)
  }

  return {
    projects,
    loading,
    importProject: handleImport,
    removeProject: handleRemove,
    reorderProjects: handleReorder,
  }
}
