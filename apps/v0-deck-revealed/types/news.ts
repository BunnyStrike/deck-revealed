export interface NewsSource {
  id: string
  name: string
  icon: string
  url: string
  trusted: boolean
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  source: NewsSource
  publishedAt: string
  updatedAt?: string
  url: string
  imageUrl?: string
  gameId?: string
  gameName?: string
  gameImage?: string
  tags: string[]
  type: "article" | "update" | "announcement" | "event" | "release"
  importance: "low" | "medium" | "high" | "critical"
  read: boolean
  saved: boolean
}

export interface NewsFilter {
  games: string[]
  sources: string[]
  types: NewsItem["type"][]
  importance: NewsItem["importance"][]
  onlyUnread: boolean
  onlySaved: boolean
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface NewsPreferences {
  autoMarkAsRead: boolean
  notifyForGames: string[]
  notifyForTypes: NewsItem["type"][]
  notifyForImportance: NewsItem["importance"][]
  refreshInterval: number // in minutes
  maxItems: number
}

export interface NewsNotification {
  id: string
  newsItemId: string
  title: string
  summary: string
  gameId?: string
  gameName?: string
  gameImage?: string
  type: NewsItem["type"]
  importance: NewsItem["importance"]
  timestamp: string
  read: boolean
}
