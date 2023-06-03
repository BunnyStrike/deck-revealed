import { createContext, useContext } from 'react'
import * as React from 'react'

const FeedContext = createContext({ isFeed: false })

interface FeedProviderProps {
  children: React.ReactNode
}

export function FeedProvider({ children }: FeedProviderProps) {
  return (
    <FeedContext.Provider value={{ isFeed: true }}>
      {children}
    </FeedContext.Provider>
  )
}

export function useFeed() {
  return useContext(FeedContext)
}
