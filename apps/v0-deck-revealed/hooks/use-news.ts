"use client"

import { useState, useEffect, useCallback } from "react"
import type { NewsItem, NewsFilter, NewsPreferences, NewsNotification } from "@/types/news"

// Sample news data
const sampleNews: NewsItem[] = [
  {
    id: "news1",
    title: "Cyberpunk 2077 Patch 2.1 Released",
    summary: "New features include vehicle combat, metro system, and more",
    content:
      "CD Projekt Red has released Patch 2.1 for Cyberpunk 2077, introducing several highly anticipated features including vehicle combat, a functional metro system, and numerous quality-of-life improvements. The update also addresses various bugs and performance issues.",
    source: {
      id: "cdpr",
      name: "CD Projekt Red",
      icon: "/cdpr-icon.png",
      url: "https://www.cdprojektred.com",
      trusted: true,
    },
    publishedAt: "2023-12-05T14:30:00Z",
    url: "https://www.cdprojektred.com/news/patch-2-1",
    imageUrl: "/cyberpunk-update.png",
    gameId: "game1",
    gameName: "Cyberpunk 2077",
    gameImage: "/neon-cityscape.png",
    tags: ["update", "patch", "new features"],
    type: "update",
    importance: "high",
    read: false,
    saved: false,
  },
  {
    id: "news2",
    title: "Elden Ring DLC Shadow of the Erdtree Announced",
    summary: "FromSoftware reveals first major expansion coming next year",
    content:
      'FromSoftware has officially announced the first major expansion for Elden Ring titled "Shadow of the Erdtree." The DLC promises to introduce new areas, bosses, weapons, and storylines. According to the developers, this will be the largest expansion they have ever created.',
    source: {
      id: "fromsoft",
      name: "FromSoftware",
      icon: "/fromsoft-icon.png",
      url: "https://www.fromsoftware.jp",
      trusted: true,
    },
    publishedAt: "2023-12-01T10:15:00Z",
    url: "https://www.fromsoftware.jp/news/elden-ring-dlc",
    imageUrl: "/elden-ring-dlc.png",
    gameId: "game2",
    gameName: "Elden Ring",
    gameImage: "/enchanted-forest-quest.png",
    tags: ["dlc", "expansion", "announcement"],
    type: "announcement",
    importance: "high",
    read: true,
    saved: true,
  },
  {
    id: "news3",
    title: "Hades 2 Early Access Date Revealed",
    summary: "Supergiant Games announces early access launch date",
    content:
      "Supergiant Games has revealed that Hades 2 will enter early access on March 15, 2024. The sequel to the critically acclaimed roguelike will feature Melinoë, the immortal Princess of the Underworld, as she battles through the Underworld to defeat the Titan of Time.",
    source: {
      id: "supergiant",
      name: "Supergiant Games",
      icon: "/supergiant-icon.png",
      url: "https://www.supergiantgames.com",
      trusted: true,
    },
    publishedAt: "2023-11-28T16:45:00Z",
    url: "https://www.supergiantgames.com/news/hades-2-early-access",
    imageUrl: "/hades-2.png",
    gameId: "game3",
    gameName: "Hades",
    gameImage: "/dungeon-crawler-scene.png",
    tags: ["sequel", "early access", "release date"],
    type: "announcement",
    importance: "medium",
    read: false,
    saved: false,
  },
  {
    id: "news4",
    title: "Gaming Industry Report: Next-Gen Console Sales Exceed Expectations",
    summary: "PS5 and Xbox Series X|S sales surpass 50 million units combined",
    content:
      "According to the latest industry report, the PlayStation 5 and Xbox Series X|S have collectively sold over 50 million units worldwide, exceeding analyst expectations. The report attributes this success to increased production capacity and a strong lineup of exclusive titles.",
    source: {
      id: "gamesindustry",
      name: "GamesIndustry.biz",
      icon: "/gamesindustry-icon.png",
      url: "https://www.gamesindustry.biz",
      trusted: true,
    },
    publishedAt: "2023-11-25T09:20:00Z",
    url: "https://www.gamesindustry.biz/articles/console-sales-report",
    imageUrl: "/console-sales.png",
    tags: ["industry", "sales", "consoles"],
    type: "article",
    importance: "low",
    read: false,
    saved: false,
  },
  {
    id: "news5",
    title: "Cyberpunk 2077 Sequel Officially in Development",
    summary: "CD Projekt Red confirms work has begun on the next Cyberpunk game",
    content:
      'CD Projekt Red has officially confirmed that development has begun on the sequel to Cyberpunk 2077. The project, currently known by its codename "Orion," will continue to explore the Cyberpunk universe but with a new protagonist and setting. The studio promises to apply all lessons learned from the original game.',
    source: {
      id: "cdpr",
      name: "CD Projekt Red",
      icon: "/cdpr-icon.png",
      url: "https://www.cdprojektred.com",
      trusted: true,
    },
    publishedAt: "2023-11-20T11:30:00Z",
    url: "https://www.cdprojektred.com/news/cyberpunk-sequel",
    imageUrl: "/cyberpunk-sequel.png",
    gameId: "game1",
    gameName: "Cyberpunk 2077",
    gameImage: "/neon-cityscape.png",
    tags: ["sequel", "announcement", "development"],
    type: "announcement",
    importance: "high",
    read: true,
    saved: true,
  },
  {
    id: "news6",
    title: "Elden Ring Surpasses 20 Million Copies Sold",
    summary: "FromSoftware's open-world RPG reaches new milestone",
    content:
      "Bandai Namco has announced that Elden Ring has sold over 20 million copies worldwide since its release. This milestone cements the game's status as FromSoftware's most commercially successful title to date, surpassing the entire Dark Souls trilogy combined.",
    source: {
      id: "bandai",
      name: "Bandai Namco",
      icon: "/bandai-icon.png",
      url: "https://www.bandainamcoent.com",
      trusted: true,
    },
    publishedAt: "2023-11-15T13:10:00Z",
    url: "https://www.bandainamcoent.com/news/elden-ring-sales",
    imageUrl: "/elden-ring-sales.png",
    gameId: "game2",
    gameName: "Elden Ring",
    gameImage: "/enchanted-forest-quest.png",
    tags: ["sales", "milestone", "success"],
    type: "article",
    importance: "medium",
    read: false,
    saved: false,
  },
  {
    id: "news7",
    title: "Hades Wins Game of the Year at The Game Awards",
    summary: "Supergiant's roguelike takes home the top prize",
    content:
      "In a surprise upset, Hades has won Game of the Year at The Game Awards, beating out several AAA titles. The indie roguelike from Supergiant Games also won awards for Best Action Game, Best Indie Game, and Best Art Direction.",
    source: {
      id: "gameawards",
      name: "The Game Awards",
      icon: "/gameawards-icon.png",
      url: "https://thegameawards.com",
      trusted: true,
    },
    publishedAt: "2023-12-08T05:45:00Z",
    url: "https://thegameawards.com/winners",
    imageUrl: "/hades-award.png",
    gameId: "game3",
    gameName: "Hades",
    gameImage: "/dungeon-crawler-scene.png",
    tags: ["awards", "recognition", "indie"],
    type: "article",
    importance: "high",
    read: false,
    saved: false,
  },
]

// Sample notifications
const sampleNotifications: NewsNotification[] = [
  {
    id: "notif1",
    newsItemId: "news1",
    title: "Cyberpunk 2077 Patch 2.1 Released",
    summary: "New features include vehicle combat, metro system, and more",
    gameId: "game1",
    gameName: "Cyberpunk 2077",
    gameImage: "/neon-cityscape.png",
    type: "update",
    importance: "high",
    timestamp: "2023-12-05T14:30:00Z",
    read: false,
  },
  {
    id: "notif2",
    newsItemId: "news5",
    title: "Cyberpunk 2077 Sequel Officially in Development",
    summary: "CD Projekt Red confirms work has begun on the next Cyberpunk game",
    gameId: "game1",
    gameName: "Cyberpunk 2077",
    gameImage: "/neon-cityscape.png",
    type: "announcement",
    importance: "high",
    timestamp: "2023-11-20T11:30:00Z",
    read: true,
  },
  {
    id: "notif3",
    newsItemId: "news7",
    title: "Hades Wins Game of the Year at The Game Awards",
    summary: "Supergiant's roguelike takes home the top prize",
    gameId: "game3",
    gameName: "Hades",
    gameImage: "/dungeon-crawler-scene.png",
    type: "article",
    importance: "high",
    timestamp: "2023-12-08T05:45:00Z",
    read: false,
  },
]

// Default preferences
const defaultPreferences: NewsPreferences = {
  autoMarkAsRead: true,
  notifyForGames: ["game1", "game2", "game3"],
  notifyForTypes: ["update", "announcement", "release"],
  notifyForImportance: ["high", "critical"],
  refreshInterval: 15,
  maxItems: 50,
}

export function useNews(userGames: string[] = []) {
  const [news, setNews] = useState<NewsItem[]>(sampleNews)
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(sampleNews)
  const [notifications, setNotifications] = useState<NewsNotification[]>(sampleNotifications)
  const [filter, setFilter] = useState<NewsFilter>({
    games: userGames,
    sources: [],
    types: [],
    importance: [],
    onlyUnread: false,
    onlySaved: false,
  })
  const [preferences, setPreferences] = useState<NewsPreferences>(defaultPreferences)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Apply filters to news
  useEffect(() => {
    setLoading(true)
    try {
      let filtered = [...news]

      // Filter by games
      if (filter.games.length > 0) {
        filtered = filtered.filter((item) => !item.gameId || filter.games.includes(item.gameId))
      }

      // Filter by sources
      if (filter.sources.length > 0) {
        filtered = filtered.filter((item) => filter.sources.includes(item.source.id))
      }

      // Filter by types
      if (filter.types.length > 0) {
        filtered = filtered.filter((item) => filter.types.includes(item.type))
      }

      // Filter by importance
      if (filter.importance.length > 0) {
        filtered = filtered.filter((item) => filter.importance.includes(item.importance))
      }

      // Filter by read status
      if (filter.onlyUnread) {
        filtered = filtered.filter((item) => !item.read)
      }

      // Filter by saved status
      if (filter.onlySaved) {
        filtered = filtered.filter((item) => item.saved)
      }

      // Filter by date range
      if (filter.dateRange) {
        filtered = filtered.filter((item) => {
          const publishDate = new Date(item.publishedAt)
          return publishDate >= filter.dateRange!.from && publishDate <= filter.dateRange!.to
        })
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

      setFilteredNews(filtered)
    } catch (err) {
      setError("Error filtering news")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [news, filter])

  // Mark news item as read
  const markAsRead = useCallback((newsId: string) => {
    setNews((prev) => prev.map((item) => (item.id === newsId ? { ...item, read: true } : item)))

    setNotifications((prev) => prev.map((notif) => (notif.newsItemId === newsId ? { ...notif, read: true } : notif)))
  }, [])

  // Mark all news as read
  const markAllAsRead = useCallback(() => {
    setNews((prev) => prev.map((item) => ({ ...item, read: true })))

    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  // Toggle saved status
  const toggleSaved = useCallback((newsId: string) => {
    setNews((prev) => prev.map((item) => (item.id === newsId ? { ...item, saved: !item.saved } : item)))
  }, [])

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<NewsFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }))
  }, [])

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<NewsPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }))
  }, [])

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter((notif) => !notif.read).length

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }, [])

  // Dismiss all notifications
  const dismissAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Fetch news for a specific game
  const fetchGameNews = useCallback((gameId: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const gameNews = sampleNews.filter((item) => item.gameId === gameId)
      return gameNews
    } catch (err) {
      setError("Error fetching game news")
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    news: filteredNews,
    allNews: news,
    notifications,
    unreadNotificationsCount,
    filter,
    preferences,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    toggleSaved,
    updateFilter,
    updatePreferences,
    dismissNotification,
    dismissAllNotifications,
    fetchGameNews,
  }
}
