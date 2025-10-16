"use client"

import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Star, Edit, Trash } from "lucide-react"

interface ReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: number[]
  hasUserReview: boolean
  onWriteReview: () => void
  onEditReview: () => void
  onDeleteReview: () => void
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  hasUserReview,
  onWriteReview,
  onEditReview,
  onDeleteReview,
}: ReviewSummaryProps) {
  // Calculate the highest value in the distribution for scaling
  const maxDistribution = Math.max(...ratingDistribution, 1)

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex flex-col items-center mr-6">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating) ? "text-secondary fill-secondary" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              {ratingDistribution.map((count, index) => {
                const stars = 5 - index
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                const width = totalReviews > 0 ? (count / maxDistribution) * 100 : 0

                return (
                  <div key={stars} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span className="text-sm font-medium mr-1">{stars}</span>
                      <Star className="w-3 h-3 text-secondary fill-secondary" />
                    </div>
                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${width}%` }} />
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">{percentage.toFixed(0)}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            {hasUserReview ? (
              <div className="flex flex-col space-y-2">
                <FocusableItem
                  focusKey="edit-review"
                  className="flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                  onClick={onEditReview}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span>Edit Your Review</span>
                </FocusableItem>
                <FocusableItem
                  focusKey="delete-review"
                  className="flex items-center px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onDeleteReview}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span>Delete Review</span>
                </FocusableItem>
              </div>
            ) : (
              <FocusableItem
                focusKey="write-review"
                className="flex items-center px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={onWriteReview}
              >
                <Edit className="w-4 h-4 mr-2" />
                <span>Write a Review</span>
              </FocusableItem>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Reviews are submitted by users and reflect their opinions. Reviews are moderated for compliance with our
            guidelines but are not endorsed by our platform.
          </p>
        </div>
      </div>
    </Card>
  )
}
