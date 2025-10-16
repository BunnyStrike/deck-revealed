"use client"

import type React from "react"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Bell, Check, X } from "lucide-react"
import type { NewsNotification } from "@/types/news"
import { formatDistanceToNow } from "date-fns"

interface NewsNotificationsProps {
  notifications: NewsNotification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onDismissAll: () => void
  onViewNews: (newsId: string) => void
}

export function NewsNotifications({
  notifications,
  unreadCount,
  onMarkAsRead,
  onDismiss,
  onDismissAll,
  onViewNews,
}: NewsNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onMarkAsRead(id)
  }

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onDismiss(id)
  }

  const handleViewNews = (newsId: string) => {
    setIsOpen(false)
    onViewNews(newsId)
  }

  return (
    <div className="relative">
      <FocusableItem
        focusKey="notifications-toggle"
        className="relative p-2 hover:bg-muted/30 rounded-lg transition-all"
        onClick={handleToggle}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </FocusableItem>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={onDismissAll}
              >
                Clear All
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <FocusableItem
                  key={notification.id}
                  focusKey={`notification-${notification.id}`}
                  className={`p-3 hover:bg-muted/30 transition-colors border-b border-border ${!notification.read ? "bg-muted/20" : ""}`}
                  onClick={() => handleViewNews(notification.newsItemId)}
                >
                  <div className="flex gap-3">
                    {notification.gameImage && (
                      <img
                        src={notification.gameImage || "/placeholder.svg"}
                        alt={notification.gameName}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{notification.gameName || "Gaming News"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.summary}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-1 mt-1">
                    {!notification.read && (
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
                      onClick={(e) => handleDismiss(e, notification.id)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </FocusableItem>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
