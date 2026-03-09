import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useCallback, useEffect, useState } from 'react'

import { useProjects } from '@/contexts/projects-context'

interface FolderDropResult {
  isDragging: boolean
  lastAddedProjectId: string | null
  clearLastAdded: () => void
}

export function useFolderDrop(): FolderDropResult {
  const [isDragging, setIsDragging] = useState(false)
  const [lastAddedProjectId, setLastAddedProjectId] = useState<string | null>(null)
  const { addProjectByPath } = useProjects()

  const clearLastAdded = useCallback(() => {
    setLastAddedProjectId(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    const setupListener = async () => {
      const appWindow = getCurrentWebviewWindow()
      const unlisten = await appWindow.onDragDropEvent(async (event) => {
        if (cancelled) return

        if (event.payload.type === 'enter') {
          setIsDragging(true)
        } else if (event.payload.type === 'leave') {
          setIsDragging(false)
        } else if (event.payload.type === 'drop') {
          setIsDragging(false)

          const paths = event.payload.paths
          if (paths.length === 0) return

          const path = paths[0]
          if (!path) return

          const project = await addProjectByPath(path)
          if (project) {
            setLastAddedProjectId(project.id)
          }
        }
      })

      return unlisten
    }

    let unlisten: (() => void) | undefined

    setupListener().then((fn) => {
      if (cancelled) {
        fn()
      } else {
        unlisten = fn
      }
    })

    return () => {
      cancelled = true
      unlisten?.()
    }
  }, [addProjectByPath])

  return { isDragging, lastAddedProjectId, clearLastAdded }
}
