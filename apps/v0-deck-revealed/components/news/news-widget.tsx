"use client"

import type React from "react"

import { useNews } from "@/hooks/use-news"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Bookmark, BookmarkPlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NewsWidgetProps {
  gameIds?: string[]
  maxItems?: number
  onViewAllNews?: () => void
  onSelectNews?: (newsId: string) => void
}

export function NewsWidget({ gameIds = [], maxItems = 3, onViewAllNews, onSelectNews }: NewsWidgetProps) {
  const { news, toggleSaved, markAsRead } = useNews(gameIds)

  // Get the most recent news items
  const recentNews = news.slice(0, maxItems)

  const handleSelectNews = (newsId: string) => {
    markAsRead(newsId)
    if (onSelectNews) {
      onSelectNews(newsId)
    }
  }

  const handleToggleSaved = (e: React.MouseEvent, newsId: string) => {
    e.stopPropagation()
    toggleSaved(newsId)
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold">Latest News</h3>
        {onViewAllNews && (
          <button className="text-primary hover:text-primary/80 text-sm font-medium" onClick={onViewAllNews}>
            View All
          </button>
        )}
      </div>

      <div className="divide-y divide-border">
        {recentNews.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No recent news</p>
          </div>
        ) : (
          recentNews.map((item) => (
            <FocusableItem
              key={item.id}
              focusKey={`news-widget-${item.id}`}
              className="p-3 hover:bg-muted/30 transition-colors"
              onClick={() => handleSelectNews(item.id)}
            >
              <div className="flex gap-3">
                {item.gameImage && (
                  <img
                    src={item.gameImage || "/placeholder.svg"}
                    alt={item.gameName}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{item.gameName || "Gaming News"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                      onClick={(e) => handleToggleSaved(e, item.id)}
                    >
                      {item.saved ? (
                        <Bookmark className="w-4 h-4 fill-current" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </FocusableItem>
          ))
        )}
      </div>
    </Card>
  )
}
