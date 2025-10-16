"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { GamepadHints } from "@/components/ui/gamepad-hints"
import { ArrowLeft, Bookmark, BookmarkPlus, Calendar, ExternalLink, Share2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import type { NewsItem } from "@/types/news"

interface NewsDetailProps {
  news: NewsItem
  onBack: () => void
  onToggleSaved: (id: string) => void
}

export function NewsDetail({ news, onBack, onToggleSaved }: NewsDetailProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const handleToggleSaved = () => {
    onToggleSaved(news.id)
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleOpenSource = () => {
    // In a real app, this would open the URL in the default browser
    console.log(`Opening URL: ${news.url}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FocusableItem
            focusKey="back-to-news"
            className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </FocusableItem>
          <h1 className="text-xl font-bold">News Detail</h1>
        </div>

        <div className="flex gap-2">
          <FocusableItem
            focusKey="share-news"
            className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </FocusableItem>

          <FocusableItem
            focusKey="save-news"
            className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
            onClick={handleToggleSaved}
          >
            {news.saved ? (
              <Bookmark className="w-5 h-5 fill-current text-primary" />
            ) : (
              <BookmarkPlus className="w-5 h-5 text-muted-foreground" />
            )}
          </FocusableItem>

          <FocusableItem
            focusKey="open-source"
            className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
            onClick={handleOpenSource}
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </FocusableItem>
        </div>
      </div>

      {showShareOptions && (
        <div className="bg-card border border-border rounded-lg p-4 flex gap-4 justify-center">
          <FocusableItem
            focusKey="share-copy"
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-all text-center"
            onClick={() => setShowShareOptions(false)}
          >
            Copy Link
          </FocusableItem>
          <FocusableItem
            focusKey="share-discord"
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-all text-center"
            onClick={() => setShowShareOptions(false)}
          >
            Discord
          </FocusableItem>
          <FocusableItem
            focusKey="share-twitter"
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-all text-center"
            onClick={() => setShowShareOptions(false)}
          >
            Twitter
          </FocusableItem>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {news.imageUrl && (
          <div className="w-full h-64 md:h-80">
            <img src={news.imageUrl || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {news.gameImage && (
              <img
                src={news.gameImage || "/placeholder.svg"}
                alt={news.gameName}
                className="w-8 h-8 rounded-md object-cover"
              />
            )}
            <span className="font-medium">{news.gameName || "General Gaming News"}</span>
            <div className="ml-auto flex items-center gap-2">
              <img
                src={news.source.icon || "/placeholder.svg"}
                alt={news.source.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{news.source.name}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{news.title}</h1>

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{format(new Date(news.publishedAt), "MMMM d, yyyy")}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg font-medium mb-4">{news.summary}</p>
            <div className="space-y-4">
              {news.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {news.tags.map((tag) => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <GamepadHints
        hints={[
          { button: "B", label: "Back" },
          { button: "Y", label: "Save" },
          { button: "X", label: "Share" },
          { button: "A", label: "Open Source" },
        ]}
      />
    </div>
  )
}
