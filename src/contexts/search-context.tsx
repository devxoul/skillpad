import { createContext, type ReactNode, useContext, useRef } from 'react'

interface SearchPersistenceContextValue {
  saveSearchQuery: (key: string, query: string) => void
  getSearchQuery: (key: string) => string | undefined
}

const SearchPersistenceContext = createContext<SearchPersistenceContextValue | null>(null)

export function SearchPersistenceProvider({ children }: { children: ReactNode }) {
  const searchQueries = useRef<Map<string, string>>(new Map())

  const saveSearchQuery = (key: string, query: string) => {
    if (query) {
      searchQueries.current.set(key, query)
    } else {
      searchQueries.current.delete(key)
    }
  }

  const getSearchQuery = (key: string) => {
    return searchQueries.current.get(key)
  }

  return (
    <SearchPersistenceContext.Provider value={{ saveSearchQuery, getSearchQuery }}>
      {children}
    </SearchPersistenceContext.Provider>
  )
}

export function useSearchPersistenceContext() {
  const context = useContext(SearchPersistenceContext)
  if (!context) {
    throw new Error('useSearchPersistenceContext must be used within SearchPersistenceProvider')
  }
  return context
}
