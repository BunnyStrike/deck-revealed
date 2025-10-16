"use client"

import type React from "react"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, MessageSquare, Flag, Star, Clock, Award, Check } from "lucide-react"
import type { GameReview } from "@/types/review"

interface ReviewCardProps {
  review: GameReview
  onViewDetail: (reviewId: string) => void
  onSubmitFeedback: (reviewId: string, type: "helpful" | "unhelpful" | "report") => void
  compact?: boolean
}

export function ReviewCard({ review, onViewDetail, onSubmitFeedback, compact = false }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<"helpful" | "unhelpful" | null>(null)

  const handleFeedback = (type: "helpful" | "unhelpful" | "report", e: React.MouseEvent) => {
    e.stopPropagation()
    if (feedbackSubmitted) return

    onSubmitFeedback(review.id, type)
    if (type === "helpful" || type === "unhelpful") {
      setFeedbackSubmitted(type)
    }
  }

  // Format date
  const formattedDate = new Date(review.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Truncate content for compact view
  const truncatedContent =
    compact && !expanded && review.content.length > 150 ? `${review.content.substring(0, 150)}...` : review.content

  return (
    <FocusableItem focusKey={`review-${review.id}`} className="w-full" onClick={() => onViewDetail(review.id)}>
      <Card className="bg-card border-border overflow-hidden transition-all hover:border-primary/50">
        <div className="p-4">
          {/* Review header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  review.userReputation > 80
                    ? "bg-gradient-to-br from-primary to-secondary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {review.userAvatar || review.userName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{review.userName}</h3>
                  {review.verified && (
                    <div className="ml-2 bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-0.5" />
                      <span>Verified</span>
                    </div>
                  )}
                  {review.featured && (
                    <div className="ml-2 bg-secondary/20 text-secondary text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Award className="w-3 h-3 mr-0.5" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <span>Playtime: {review.playtime}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating.overall ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
                />
              ))}
            </div>
          </div>

          {/* Review title */}
          <h4 className="text-lg font-semibold mb-2">{review.title}</h4>

          {/* Review content */}
          <div className="mb-4">
            <p className="text-muted-foreground whitespace-pre-line">{truncatedContent}</p>

            {compact && review.content.length > 150 && (
              <button
                className="text-primary text-sm font-medium mt-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(!expanded)
                }}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Pros and cons */}
          {!compact && review.pros && review.cons && (review.pros.length > 0 || review.cons.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {review.pros && review.pros.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-500 mb-2">Pros</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {review.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {review.cons && review.cons.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-500 mb-2">Cons</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {review.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Review media */}
          {!compact && review.media && review.media.length > 0 && (
            <div className="mb-4">
              <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin">
                {review.media.map((media) => (
                  <div key={media.id} className="flex-shrink-0 relative">
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.caption || "Review media"}
                      className="h-24 w-auto rounded-md object-cover"
                    />
                    {media.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                        {media.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center ${feedbackSubmitted === "helpful" ? "text-green-500" : "hover:text-foreground"}`}
                onClick={(e) => handleFeedback("helpful", e)}
                disabled={!!feedbackSubmitted}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{review.helpfulCount + (feedbackSubmitted === "helpful" ? 1 : 0)}</span>
              </button>

              <button
                className={`flex items-center ${feedbackSubmitted === "unhelpful" ? "text-red-500" : "hover:text-foreground"}`}
                onClick={(e) => handleFeedback("unhelpful", e)}
                disabled={!!feedbackSubmitted}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                <span>{review.unhelpfulCount + (feedbackSubmitted === "unhelpful" ? 1 : 0)}</span>
              </button>

              <button className="flex items-center hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{review.commentCount}</span>
              </button>
            </div>

            <button className="flex items-center hover:text-foreground" onClick={(e) => handleFeedback("report", e)}>
              <Flag className="w-4 h-4 mr-1" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </Card>
    </FocusableItem>
  )
}
