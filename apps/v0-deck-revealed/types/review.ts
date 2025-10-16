export interface ReviewRating {
  overall: number // 1-5 stars
  gameplay?: number
  graphics?: number
  story?: number
  audio?: number
  value?: number
}

export interface ReviewMedia {
  id: string
  type: "image" | "video"
  url: string
  thumbnailUrl?: string
  caption?: string
  timestamp: string
}

export interface ReviewFeedback {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: "helpful" | "unhelpful" | "report"
  timestamp: string
  comment?: string
}

export interface ReviewComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  edited?: boolean
  likes: number
  replies?: ReviewComment[]
}

export interface GameReview {
  id: string
  gameId: string
  userId: string
  userName: string
  userAvatar?: string
  userReputation: number
  title: string
  content: string
  rating: ReviewRating
  pros?: string[]
  cons?: string[]
  playtime: string
  platform: string
  purchaseType: "owned" | "borrowed" | "subscription" | "other"
  completionStatus: "completed" | "in-progress" | "abandoned" | "not-started"
  containsSpoilers: boolean
  media?: ReviewMedia[]
  helpfulCount: number
  unhelpfulCount: number
  commentCount: number
  timestamp: string
  edited?: boolean
  verified: boolean
  featured?: boolean
  tags?: string[]
}

export interface ReviewSortOption {
  id: string
  label: string
  value: "newest" | "oldest" | "highest-rated" | "lowest-rated" | "most-helpful" | "most-discussed" | "reputation"
}

export interface ReviewFilterOption {
  id: string
  label: string
  value: "all" | "verified" | "with-media" | "detailed" | "positive" | "negative" | "mixed" | "featured"
}

export interface UserReviewStats {
  totalReviews: number
  averageRating: number
  helpfulCount: number
  featuredCount: number
  reputation: number
}
