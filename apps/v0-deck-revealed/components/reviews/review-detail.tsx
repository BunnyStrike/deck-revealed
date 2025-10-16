"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  Star,
  Clock,
  Award,
  Check,
  ChevronLeft,
  Send,
  Heart,
  MoreHorizontal,
  ImageIcon,
  Paperclip,
} from "lucide-react"
import type { GameReview, ReviewComment } from "@/types/review"

interface ReviewDetailProps {
  review: GameReview
  comments: ReviewComment[]
  onBack: () => void
  onSubmitFeedback: (reviewId: string, type: "helpful" | "unhelpful" | "report") => void
  onAddComment: (reviewId: string, content: string) => void
  onLikeComment: (commentId: string) => void
}

export function ReviewDetail({
  review,
  comments,
  onBack,
  onSubmitFeedback,
  onAddComment,
  onLikeComment,
}: ReviewDetailProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<"helpful" | "unhelpful" | null>(null)
  const [commentText, setCommentText] = useState("")
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  const handleFeedback = (type: "helpful" | "unhelpful" | "report") => {
    if (feedbackSubmitted) return

    onSubmitFeedback(review.id, type)
    if (type === "helpful" || type === "unhelpful") {
      setFeedbackSubmitted(type)
    }
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) return

    onAddComment(review.id, commentText.trim())
    setCommentText("")
  }

  const toggleCommentReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  // Format date
  const formattedDate = new Date(review.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Back button */}
      <FocusableItem
        focusKey="back-button"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={onBack}
      >
        <ChevronLeft className="mr-1" size={18} />
        <span>Back to Reviews</span>
      </FocusableItem>

      {/* Review card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-6">
          {/* Review header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                  review.userReputation > 80
                    ? "bg-gradient-to-br from-primary to-secondary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {review.userAvatar || review.userName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">{review.userName}</h3>
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formattedDate}</span>
                    {review.edited && <span className="ml-1">(Edited)</span>}
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <span>Playtime: {review.playtime}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <span>Platform: {review.platform}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating.overall ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{review.rating.overall}/5</span>
            </div>
          </div>

          {/* Review title */}
          <h2 className="text-2xl font-semibold mb-3">{review.title}</h2>

          {/* Review content */}
          <div className="mb-6">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{review.content}</p>
          </div>

          {/* Detailed ratings */}
          {(review.rating.gameplay ||
            review.rating.graphics ||
            review.rating.story ||
            review.rating.audio ||
            review.rating.value) && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {review.rating.gameplay && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">Gameplay</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating.gameplay}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                </div>
              )}
              {review.rating.graphics && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">Graphics</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating.graphics}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                </div>
              )}
              {review.rating.story && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">Story</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating.story}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                </div>
              )}
              {review.rating.audio && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">Audio</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating.audio}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                </div>
              )}
              {review.rating.value && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">Value</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating.value}</span>
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pros and cons */}
          {(review.pros || review.cons) && (review.pros?.length || review.cons?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {review.pros && review.pros.length > 0 && (
                <div className="bg-green-500/10 rounded-lg p-4">
                  <h3 className="font-medium text-green-500 mb-3">Pros</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {review.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {review.cons && review.cons.length > 0 && (
                <div className="bg-red-500/10 rounded-lg p-4">
                  <h3 className="font-medium text-red-500 mb-3">Cons</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {review.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Review media */}
          {review.media && review.media.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {review.media.map((media) => (
                  <div key={media.id} className="relative rounded-lg overflow-hidden">
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.caption || "Review media"}
                      className="w-full h-40 object-cover"
                    />
                    {media.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
                        {media.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review footer */}
          <div className="flex items-center justify-between text-sm border-t border-border pt-4">
            <div className="flex items-center space-x-6">
              <button
                className={`flex items-center ${feedbackSubmitted === "helpful" ? "text-green-500" : "hover:text-foreground"}`}
                onClick={() => handleFeedback("helpful")}
                disabled={!!feedbackSubmitted}
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {review.helpfulCount + (feedbackSubmitted === "helpful" ? 1 : 0)} Helpful
                </span>
              </button>

              <button
                className={`flex items-center ${feedbackSubmitted === "unhelpful" ? "text-red-500" : "hover:text-foreground"}`}
                onClick={() => handleFeedback("unhelpful")}
                disabled={!!feedbackSubmitted}
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {review.unhelpfulCount + (feedbackSubmitted === "unhelpful" ? 1 : 0)} Unhelpful
                </span>
              </button>
            </div>

            <button className="flex items-center hover:text-foreground" onClick={() => handleFeedback("report")}>
              <Flag className="w-5 h-5 mr-2" />
              <span className="font-medium">Report</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Comments section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Comments ({review.commentCount})</h3>

        {/* Comment form */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium">Y</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitComment()
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <button className="text-muted-foreground hover:text-foreground p-1 rounded-full">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground p-1 rounded-full">
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                className={`text-primary p-1 rounded-full ${!commentText.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"}`}
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      {comment.userAvatar || comment.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(comment.timestamp).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                            {comment.edited && <span className="ml-1">(Edited)</span>}
                          </span>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-muted-foreground mt-1">{comment.content}</p>
                      <div className="flex items-center mt-2 text-xs">
                        <button
                          className="flex items-center text-muted-foreground hover:text-foreground"
                          onClick={() => onLikeComment(comment.id)}
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          <span>{comment.likes}</span>
                        </button>
                        <span className="mx-2">•</span>
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => toggleCommentReplies(comment.id)}
                        >
                          Reply
                        </button>
                        {comment.replies && comment.replies.length > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <button
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => toggleCommentReplies(comment.id)}
                            >
                              {expandedComments[comment.id]
                                ? "Hide replies"
                                : `View ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment replies */}
                {comment.replies && comment.replies.length > 0 && expandedComments[comment.id] && (
                  <div className="pl-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                            {reply.userAvatar || reply.userName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-medium">{reply.userName}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(reply.timestamp).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                  {reply.edited && <span className="ml-1">(Edited)</span>}
                                </span>
                              </div>
                              <button className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-muted-foreground mt-1">{reply.content}</p>
                            <div className="flex items-center mt-2 text-xs">
                              <button
                                className="flex items-center text-muted-foreground hover:text-foreground"
                                onClick={() => onLikeComment(reply.id)}
                              >
                                <Heart className="w-3 h-3 mr-1" />
                                <span>{reply.likes}</span>
                              </button>
                              <span className="mx-2">•</span>
                              <button className="text-muted-foreground hover:text-foreground">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
