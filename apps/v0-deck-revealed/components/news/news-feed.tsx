"use client"

import type React from "react"

import { useState } from "react"
import { useNews } from "@/hooks/use-news"
import { FocusableItem } from "@/components/ui/focusable-item"
import { GamepadHints } from "@/components/ui/gamepad-hints"
import { Card } from "@/components/ui/card"
import { Bell, BookmarkPlus, Bookmark, Calendar, Filter, RefreshCw, Search, Settings, Star, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { NewsItem } from "@/types/news"
import { NewsDetail } from "./news-detail"
import { NewsFilters } from "./news-filters"
import { NewsPreferencesPanel } from "./news-preferences"

interface NewsFeedProps {
  userGames?: string[]
  onBack?: () => void
}

export function NewsFeed({ userGames = [], onBack }: NewsFeedProps) {
  const { news, notifications, unreadNotificationsCount, filter, loading, markAsRead, toggleSaved, updateFilter } =
    useNews(userGames)

  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [view, setView] = useState<"all" | "saved" | "updates">("all")

  // Handle news item selection
  const handleSelectNews = (newsId: string) => {
    setSelectedNewsId(newsId)
    markAsRead(newsId)
  }

  // Handle back from detail view
  const handleBackFromDetail = () => {
    setSelectedNewsId(null)
  }

  // Toggle filter panel
  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
    setShowPreferences(false)
  }

  // Toggle preferences panel
  const handleTogglePreferences = () => {
    setShowPreferences(!showPreferences)
    setShowFilters(false)
  }

  // Change view
  const handleChangeView = (newView: "all" | "saved" | "updates") => {
    setView(newView)

    // Update filter based on view
    if (newView === "saved") {
      updateFilter({ onlySaved: true, onlyUnread: false })
    } else if (newView === "updates") {
      updateFilter({
        onlySaved: false,
        onlyUnread: false,
        types: ["update", "announcement", "release"],
      })
    } else {
      updateFilter({ onlySaved: false, onlyUnread: false, types: [] })
    }
  }

  // If a news item is selected, show the detail view
  if (selectedNewsId) {
    const selectedNews = news.find((item) => item.id === selectedNewsId)
    if (selectedNews) {
      return <NewsDetail news={selectedNews} onBack={handleBackFromDetail} onToggleSaved={toggleSaved} />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Game News</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <FocusableItem
              focusKey="view-all"
              className={`px-4 py-2 text-sm font-medium ${view === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleChangeView("all")}
            >
              All
            </FocusableItem>
            <FocusableItem
              focusKey="view-updates"
              className={`px-4 py-2 text-sm font-medium ${view === "updates" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleChangeView("updates")}
            >
              Updates
            </FocusableItem>
            <FocusableItem
              focusKey="view-saved"
              className={`px-4 py-2 text-sm font-medium ${view === "saved" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => handleChangeView("saved")}
            >
              Saved
            </FocusableItem>
          </div>

          <div className="flex gap-1">
            <FocusableItem
              focusKey="filter-news"
              className={`p-2 ${showFilters ? "bg-primary text-white" : "bg-card border border-border hover:bg-muted/30"} rounded-lg transition-all`}
              onClick={handleToggleFilters}
            >
              <Filter className="w-5 h-5" />
            </FocusableItem>

            <FocusableItem
              focusKey="refresh-news"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={() => {}}
            >
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="news-preferences"
              className={`p-2 ${showPreferences ? "bg-primary text-white" : "bg-card border border-border hover:bg-muted/30"} rounded-lg transition-all`}
              onClick={handleTogglePreferences}
            >
              <Settings className="w-5 h-5" />
            </FocusableItem>

            <FocusableItem
              focusKey="back-from-news"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={onBack}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>
          </div>

          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search news"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <NewsFilters currentFilter={filter} onUpdateFilter={updateFilter} onClose={() => setShowFilters(false)} />
      )}

      {/* Preferences panel */}
      {showPreferences && <NewsPreferencesPanel onClose={() => setShowPreferences(false)} />}

      {/* News list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No news found. Try adjusting your filters.</p>
          </div>
        ) : (
          news.map((item) => (
            <NewsCard key={item.id} news={item} onSelect={handleSelectNews} onToggleSaved={toggleSaved} />
          ))
        )}
      </div>

      <GamepadHints
        hints={[
          { button: "A", label: "Select" },
          { button: "B", label: "Back" },
          { button: "Y", label: "Save" },
          { button: "X", label: "Filter" },
        ]}
      />
    </div>
  )
}

interface NewsCardProps {
  news: NewsItem
  onSelect: (id: string) => void
  onToggleSaved: (id: string) => void
}

function NewsCard({ news, onSelect, onToggleSaved }: NewsCardProps) {
  const handleToggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSaved(news.id)
  }

  const getImportanceColor = (importance: NewsItem["importance"]) => {
    switch (importance) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
      default:
        return "bg-blue-500"
    }
  }

  const getTypeIcon = (type: NewsItem["type"]) => {
    switch (type) {
      case "update":
        return <RefreshCw className="w-4 h-4" />
      case "announcement":
        return <Bell className="w-4 h-4" />
      case "event":
        return <Calendar className="w-4 h-4" />
      case "release":
        return <Star className="w-4 h-4" />
      case "article":
      default:
        return null
    }
  }

  return (
    <FocusableItem
      focusKey={`news-${news.id}`}
      className="hover:bg-card/80 rounded-xl border border-border transition-all"
      onClick={() => onSelect(news.id)}
    >
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {news.imageUrl && (
            <div className="md:w-1/4 h-48 md:h-auto">
              <img src={news.imageUrl || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`flex-1 p-4 ${!news.read ? "border-l-4 border-primary" : ""}`}>
            <div className="flex items-center gap-2 mb-1">
              {news.gameImage && (
                <img
                  src={news.gameImage || "/placeholder.svg"}
                  alt={news.gameName}
                  className="w-6 h-6 rounded-md object-cover"
                />
              )}
              <span className="text-sm font-medium">{news.gameName || "General Gaming News"}</span>
              <div
                className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white ${getImportanceColor(news.importance)}`}
              >
                {getTypeIcon(news.type)}
                <span className="capitalize">{news.type}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2">{news.title}</h3>
            <p className="text-muted-foreground mb-3">{news.summary}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <img
                  src={news.source.icon || "/placeholder.svg"}
                  alt={news.source.name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-muted-foreground">{news.source.name}</span>
                <span className="text-xs text-muted-foreground mx-1">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                </span>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleToggleSaved}
              >
                {news.saved ? <Bookmark className="w-5 h-5 fill-current" /> : <BookmarkPlus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </FocusableItem>
  )
}
