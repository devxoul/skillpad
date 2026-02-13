import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useSearchPersistenceContext } from '@/contexts/search-context'

export function usePersistedSearch(): [string, (query: string) => void] {
  const location = useLocation()
  const navigationType = useNavigationType()
  const { saveSearchQuery, getSearchQuery } = useSearchPersistenceContext()

  const initialQuery = navigationType === 'POP' ? (getSearchQuery(location.pathname) ?? '') : ''
  const [query, setQuery] = useState(initialQuery)
  const queryRef = useRef(query)

  useEffect(() => {
    queryRef.current = query
  }, [query])

  useEffect(() => {
    const pathname = location.pathname
    return () => {
      saveSearchQuery(pathname, queryRef.current)
    }
  }, [location.pathname, saveSearchQuery])

  return [query, setQuery]
}
