"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronDown, Filter, SortAsc, Star } from "lucide-react"
import { ReviewCard } from "@/components/reviews/review-card"
import type { GameReview, ReviewSortOption, ReviewFilterOption } from "@/types/review"

interface ReviewListProps {
  reviews: GameReview[]
  sortOptions: ReviewSortOption[]
  filterOptions: ReviewFilterOption[]
  sortBy: ReviewSortOption["value"]
  filterBy: ReviewFilterOption["value"]
  onSortChange: (value: ReviewSortOption["value"]) => void
  onFilterChange: (value: ReviewFilterOption["value"]) => void
  onViewDetail: (reviewId: string) => void
  onSubmitFeedback: (reviewId: string, type: "helpful" | "unhelpful" | "report") => void
  loading?: boolean
}

export function ReviewList({
  reviews,
  sortOptions,
  filterOptions,
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  onViewDetail,
  onSubmitFeedback,
  loading = false,
}: ReviewListProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen)
    if (!sortDropdownOpen) {
      setFilterDropdownOpen(false)
    }
  }

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen)
    if (!filterDropdownOpen) {
      setSortDropdownOpen(false)
    }
  }

  const handleSortChange = (value: ReviewSortOption["value"]) => {
    onSortChange(value)
    setSortDropdownOpen(false)
  }

  const handleFilterChange = (value: ReviewFilterOption["value"]) => {
    onFilterChange(value)
    setFilterDropdownOpen(false)
  }

  // Get current sort and filter labels
  const currentSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || "Sort by"
  const currentFilterLabel = filterOptions.find((option) => option.value === filterBy)?.label || "Filter"

  return (
    <div className="space-y-6">
      {/* Filters and sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-lg font-semibold">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort dropdown */}
          <div className="relative">
            <FocusableItem
              focusKey="sort-dropdown"
              className="flex items-center bg-card border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/50 transition-colors"
              onClick={toggleSortDropdown}
            >
              <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{currentSortLabel}</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
            </FocusableItem>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <FocusableItem
                      key={option.id}
                      focusKey={`sort-option-${option.id}`}
                      className={`px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${sortBy === option.value ? "bg-primary/10 text-primary" : ""}`}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </FocusableItem>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <FocusableItem
              focusKey="filter-dropdown"
              className="flex items-center bg-card border border-border rounded-lg px-3 py-2 text-sm hover:border-primary/50 transition-colors"
              onClick={toggleFilterDropdown}
            >
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{currentFilterLabel}</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filterDropdownOpen ? "rotate-180" : ""}`} />
            </FocusableItem>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <FocusableItem
                      key={option.id}
                      focusKey={`filter-option-${option.id}`}
                      className={`px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${filterBy === option.value ? "bg-primary/10 text-primary" : ""}`}
                      onClick={() => handleFilterChange(option.value)}
                    >
                      {option.label}
                    </FocusableItem>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-card border-border p-4 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-muted ml-1"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">Be the first to share your thoughts on this game!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onViewDetail={onViewDetail}
              onSubmitFeedback={onSubmitFeedback}
              compact
            />
          ))}
        </div>
      )}
    </div>
  )
}
