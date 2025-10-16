"use client"

import { useState } from "react"
import { useReviews } from "@/hooks/use-reviews"
import { ReviewSummary } from "@/components/reviews/review-summary"
import { ReviewList } from "@/components/reviews/review-list"
import { ReviewDetail } from "@/components/reviews/review-detail"
import { ReviewForm } from "@/components/reviews/review-form"
import { FocusableItem } from "@/components/ui/focusable-item"
import { ChevronLeft } from "lucide-react"
import type { GameReview } from "@/types/review"

interface ReviewsProps {
  gameId: string
  onBack: () => void
}

export function Reviews({ gameId, onBack }: ReviewsProps) {
  const {
    reviews,
    loading,
    sortOptions,
    filterOptions,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    userReview,
    reviewStats,
    submitReview,
    updateReview,
    deleteReview,
    submitFeedback,
    getComments,
    addComment,
  } = useReviews(gameId)

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [isEditingReview, setIsEditingReview] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // Handle viewing a review
  const handleViewReview = (reviewId: string) => {
    setSelectedReviewId(reviewId)
  }

  // Handle back to reviews list
  const handleBackToList = () => {
    setSelectedReviewId(null)
  }

  // Handle writing a review
  const handleWriteReview = () => {
    setIsWritingReview(true)
  }

  // Handle editing a review
  const handleEditReview = () => {
    setIsEditingReview(true)
  }

  // Handle canceling review form
  const handleCancelReview = () => {
    setIsWritingReview(false)
    setIsEditingReview(false)
  }

  // Handle submitting a review
  const handleSubmitReview = (
    review: Omit<
      GameReview,
      "id" | "timestamp" | "helpfulCount" | "unhelpfulCount" | "commentCount" | "userReputation"
    >,
  ) => {
    submitReview(review)
    setIsWritingReview(false)
  }

  // Handle updating a review
  const handleUpdateReview = (
    review: Omit<
      GameReview,
      "id" | "timestamp" | "helpfulCount" | "unhelpfulCount" | "commentCount" | "userReputation"
    >,
  ) => {
    if (userReview) {
      updateReview(userReview.id, review)
    }
    setIsEditingReview(false)
  }

  // Handle deleting a review
  const handleDeleteReview = () => {
    if (userReview) {
      deleteReview(userReview.id)
    }
    setShowDeleteConfirmation(false)
  }

  // Handle submitting feedback on a review
  const handleSubmitFeedback = (reviewId: string, type: "helpful" | "unhelpful" | "report") => {
    submitFeedback(reviewId, {
      userId: "user1", // In a real app, this would be the current user's ID
      userName: "YourUsername", // In a real app, this would be the current user's name
      userAvatar: "Y", // In a real app, this would be the current user's avatar
      type,
    })
  }

  // Handle adding a comment to a review
  const handleAddComment = (reviewId: string, content: string) => {
    addComment(reviewId, {
      userId: "user1", // In a real app, this would be the current user's ID
      userName: "YourUsername", // In a real app, this would be the current user's name
      userAvatar: "Y", // In a real app, this would be the current user's avatar
      content,
    })
  }

  // If viewing a specific review
  if (selectedReviewId) {
    const review = reviews.find((r) => r.id === selectedReviewId)
    if (!review) return null

    const comments = getComments(selectedReviewId)

    return (
      <ReviewDetail
        review={review}
        comments={comments}
        onBack={handleBackToList}
        onSubmitFeedback={handleSubmitFeedback}
        onAddComment={handleAddComment}
        onLikeComment={() => {}}
      />
    )
  }

  // If writing a review
  if (isWritingReview) {
    return <ReviewForm gameId={gameId} onSubmit={handleSubmitReview} onCancel={handleCancelReview} />
  }

  // If editing a review
  if (isEditingReview && userReview) {
    return (
      <ReviewForm
        gameId={gameId}
        existingReview={userReview}
        onSubmit={handleUpdateReview}
        onCancel={handleCancelReview}
      />
    )
  }

  // Delete confirmation dialog
  if (showDeleteConfirmation) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Review</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete your review? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <FocusableItem
            focusKey="cancel-delete"
            className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </FocusableItem>
          <FocusableItem
            focusKey="confirm-delete"
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={handleDeleteReview}
          >
            Delete
          </FocusableItem>
        </div>
      </div>
    )
  }

  // Main reviews view
  return (
    <div className="space-y-6">
      {/* Back button */}
      <FocusableItem
        focusKey="back-button"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={onBack}
      >
        <ChevronLeft className="mr-1" size={18} />
        <span>Back to Game</span>
      </FocusableItem>

      <h1 className="text-3xl font-bold">Reviews</h1>

      {/* Review Summary */}
      <ReviewSummary
        averageRating={reviewStats.averageRating}
        totalReviews={reviewStats.totalReviews}
        ratingDistribution={reviewStats.ratingDistribution}
        hasUserReview={!!userReview}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={() => setShowDeleteConfirmation(true)}
      />

      {/* Reviews List */}
      <ReviewList
        reviews={reviews}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
        onViewDetail={handleViewReview}
        onSubmitFeedback={handleSubmitFeedback}
        loading={loading}
      />
    </div>
  )
}
