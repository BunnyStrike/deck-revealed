"use client"

import { useState } from "react"
import { useNews } from "@/hooks/use-news"
import { NewsFeed } from "./news-feed"
import { NewsDetail } from "./news-detail"

interface NewsModuleProps {
  userGames?: string[]
  onBack?: () => void
}

export function NewsModule({ userGames = [], onBack }: NewsModuleProps) {
  const {
    news,
    notifications,
    unreadNotificationsCount,
    markAsRead,
    toggleSaved,
    dismissNotification,
    dismissAllNotifications,
  } = useNews(userGames)

  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [view, setView] = useState<"feed" | "detail">("feed")

  // Handle news item selection
  const handleSelectNews = (newsId: string) => {
    setSelectedNewsId(newsId)
    setView("detail")
    markAsRead(newsId)
  }

  // Handle back from detail view
  const handleBackFromDetail = () => {
    setSelectedNewsId(null)
    setView("feed")
  }

  // If in detail view, show the news detail
  if (view === "detail" && selectedNewsId) {
    const selectedNews = news.find((item) => item.id === selectedNewsId)
    if (selectedNews) {
      return <NewsDetail news={selectedNews} onBack={handleBackFromDetail} onToggleSaved={toggleSaved} />
    }
  }

  // Otherwise, show the news feed
  return <NewsFeed userGames={userGames} onBack={onBack} />
}
