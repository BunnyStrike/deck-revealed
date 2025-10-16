"use client"

import { useState, useEffect, useCallback } from "react"
import type { GameReview, ReviewSortOption, ReviewFilterOption, ReviewFeedback, ReviewComment } from "@/types/review"

// Sample sort options
const sortOptions: ReviewSortOption[] = [
  { id: "newest", label: "Newest First", value: "newest" },
  { id: "oldest", label: "Oldest First", value: "oldest" },
  { id: "highest-rated", label: "Highest Rated", value: "highest-rated" },
  { id: "lowest-rated", label: "Lowest Rated", value: "lowest-rated" },
  { id: "most-helpful", label: "Most Helpful", value: "most-helpful" },
  { id: "most-discussed", label: "Most Discussed", value: "most-discussed" },
  { id: "reputation", label: "User Reputation", value: "reputation" },
]

// Sample filter options
const filterOptions: ReviewFilterOption[] = [
  { id: "all", label: "All Reviews", value: "all" },
  { id: "verified", label: "Verified Purchases", value: "verified" },
  { id: "with-media", label: "With Media", value: "with-media" },
  { id: "detailed", label: "Detailed Reviews", value: "detailed" },
  { id: "positive", label: "Positive (4-5★)", value: "positive" },
  { id: "negative", label: "Negative (1-2★)", value: "negative" },
  { id: "mixed", label: "Mixed (3★)", value: "mixed" },
  { id: "featured", label: "Featured", value: "featured" },
]

// This would be replaced with actual API calls in a real application
const fetchReviews = async (gameId: string): Promise<GameReview[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data
  return mockReviews.filter((review) => review.gameId === gameId)
}

// Mock reviews data
const mockReviews: GameReview[] = [
  {
    id: "review1",
    gameId: "game1", // Cyberpunk 2077
    userId: "user1",
    userName: "CyberFan42",
    userAvatar: "C",
    userReputation: 85,
    title: "A flawed masterpiece that keeps getting better",
    content:
      "After multiple patches and updates, Cyberpunk 2077 has transformed into the game it was always meant to be. Night City is a breathtaking, living world filled with interesting characters and stories. The gameplay offers multiple approaches to missions, and the RPG elements allow for diverse character builds. While there are still occasional bugs, they rarely detract from the overall experience. The Phantom Liberty expansion adds even more depth to an already rich game.",
    rating: {
      overall: 4,
      gameplay: 4,
      graphics: 5,
      story: 5,
      audio: 5,
      value: 4,
    },
    pros: [
      "Incredible world design",
      "Engaging story and characters",
      "Multiple approaches to missions",
      "Stunning visuals and soundtrack",
    ],
    cons: ["Some lingering bugs", "Driving mechanics could be better", "AI sometimes behaves oddly"],
    playtime: "120 hours",
    platform: "PC",
    purchaseType: "owned",
    completionStatus: "completed",
    containsSpoilers: false,
    media: [
      {
        id: "media1",
        type: "image",
        url: "/cyberpunk-screenshot-1.png",
        caption: "Night City at sunset",
        timestamp: "2023-05-15T14:30:00Z",
      },
      {
        id: "media2",
        type: "image",
        url: "/cyberpunk-screenshot-2.png",
        caption: "Combat with Arasaka guards",
        timestamp: "2023-05-15T14:35:00Z",
      },
    ],
    helpfulCount: 128,
    unhelpfulCount: 12,
    commentCount: 24,
    timestamp: "2023-05-15T14:30:00Z",
    verified: true,
    featured: true,
    tags: ["RPG", "Open World", "Story-Rich"],
  },
  {
    id: "review2",
    gameId: "game1", // Cyberpunk 2077
    userId: "user2",
    userName: "NightCityRunner",
    userAvatar: "N",
    userReputation: 62,
    title: "Still doesn't live up to the hype",
    content:
      "While Cyberpunk 2077 has improved significantly since its disastrous launch, it still falls short of what was promised. The world, while visually impressive, feels shallow in many ways. Many RPG elements are superficial, and your choices rarely have meaningful consequences. The combat is decent but not exceptional. Performance issues persist on some hardware configurations. It's a good game, but not the revolutionary experience that was marketed.",
    rating: {
      overall: 3,
      gameplay: 3,
      graphics: 4,
      story: 3,
      audio: 4,
      value: 2,
    },
    pros: ["Visually stunning world", "Some memorable characters", "Solid gunplay"],
    cons: [
      "Shallow RPG mechanics",
      "Limited meaningful choices",
      "Still some performance issues",
      "Overhyped features",
    ],
    playtime: "85 hours",
    platform: "PlayStation 5",
    purchaseType: "owned",
    completionStatus: "completed",
    containsSpoilers: false,
    helpfulCount: 95,
    unhelpfulCount: 42,
    commentCount: 18,
    timestamp: "2023-06-22T09:15:00Z",
    verified: true,
    tags: ["RPG", "Open World", "Cyberpunk"],
  },
  {
    id: "review3",
    gameId: "game2", // Elden Ring
    userId: "user3",
    userName: "SoulsBorne_Veteran",
    userAvatar: "S",
    userReputation: 94,
    title: "FromSoftware's magnum opus",
    content:
      "Elden Ring takes everything that made the Souls series great and expands it into a vast open world without compromising on challenge or depth. The world design is impeccable, with countless secrets to discover and awe-inspiring vistas. Combat is refined and offers unprecedented build variety. The lore, crafted with George R.R. Martin, creates a hauntingly beautiful setting. Boss fights are challenging but fair, with some of the most memorable encounters in gaming. This is not just the best Souls game, but one of the greatest games ever made.",
    rating: {
      overall: 5,
      gameplay: 5,
      graphics: 5,
      story: 5,
      audio: 5,
      value: 5,
    },
    pros: [
      "Masterful open world design",
      "Incredible combat depth",
      "Challenging but fair difficulty",
      "Endless exploration",
      "Rich lore and atmosphere",
    ],
    cons: ["Some performance issues on PC", "A few recycled bosses", "Might be too difficult for some players"],
    playtime: "210 hours",
    platform: "PC",
    purchaseType: "owned",
    completionStatus: "completed",
    containsSpoilers: false,
    media: [
      {
        id: "media3",
        type: "image",
        url: "/elden-ring-screenshot-1.png",
        caption: "Facing Malenia",
        timestamp: "2023-03-10T18:45:00Z",
      },
    ],
    helpfulCount: 256,
    unhelpfulCount: 8,
    commentCount: 42,
    timestamp: "2023-03-10T18:45:00Z",
    verified: true,
    featured: true,
    tags: ["Souls-like", "Open World", "Challenging"],
  },
  {
    id: "review4",
    gameId: "game3", // Hades
    userId: "user4",
    userName: "RogueliteEnjoyer",
    userAvatar: "R",
    userReputation: 78,
    title: "Perfection in roguelite form",
    content:
      "Hades is a masterclass in game design. The combat is fluid and responsive, with each weapon offering a distinct playstyle. The progression system keeps you engaged even after failed runs. What truly sets Hades apart is how it integrates its narrative with the roguelite structure - dying is part of the story, and characters remember and comment on your previous attempts. The art style is gorgeous, the music is phenomenal, and the voice acting is top-notch. Supergiant Games has created something special that transcends its genre.",
    rating: {
      overall: 5,
      gameplay: 5,
      graphics: 5,
      story: 5,
      audio: 5,
      value: 5,
    },
    pros: [
      "Perfect integration of story and gameplay",
      "Fluid, satisfying combat",
      "Gorgeous art and music",
      "Meaningful progression",
      "Excellent character development",
    ],
    cons: ["Some weapon aspects need balancing", "Endgame grind can get repetitive"],
    playtime: "95 hours",
    platform: "Nintendo Switch",
    purchaseType: "owned",
    completionStatus: "completed",
    containsSpoilers: false,
    media: [
      {
        id: "media4",
        type: "image",
        url: "/hades-screenshot-1.png",
        caption: "Battling Hades himself",
        timestamp: "2023-04-05T21:20:00Z",
      },
    ],
    helpfulCount: 189,
    unhelpfulCount: 5,
    commentCount: 31,
    timestamp: "2023-04-05T21:20:00Z",
    verified: true,
    featured: true,
    tags: ["Roguelite", "Action", "Story-Rich"],
  },
  {
    id: "review5",
    gameId: "game2", // Elden Ring
    userId: "user5",
    userName: "CasualGamer123",
    userAvatar: "C",
    userReputation: 45,
    title: "Too difficult to enjoy",
    content:
      "While I can appreciate the artistry and craft that went into Elden Ring, the punishing difficulty made it impossible for me to enjoy. Bosses require perfect timing and memorization, and the game offers little guidance on where to go or what to do. I found myself constantly frustrated rather than having fun. The world is beautiful but filled with enemies that can kill you in seconds. If you're not already a fan of Souls games, this probably isn't for you.",
    rating: {
      overall: 2,
      gameplay: 2,
      graphics: 4,
      story: 3,
      audio: 4,
      value: 1,
    },
    pros: ["Visually stunning world", "Atmospheric music", "Interesting enemy designs"],
    cons: ["Punishingly difficult", "Lack of guidance", "Frustrating boss fights", "Confusing progression"],
    playtime: "15 hours",
    platform: "Xbox Series X",
    purchaseType: "owned",
    completionStatus: "abandoned",
    containsSpoilers: false,
    helpfulCount: 78,
    unhelpfulCount: 102,
    commentCount: 45,
    timestamp: "2023-03-18T11:30:00Z",
    verified: true,
    tags: ["Difficult", "Souls-like", "Open World"],
  },
]

// Mock comments data
const mockComments: Record<string, ReviewComment[]> = {
  review1: [
    {
      id: "comment1",
      userId: "user5",
      userName: "RPGFanatic",
      userAvatar: "R",
      content: "Great review! I completely agree about the world design. Have you tried the new Phantom Liberty DLC?",
      timestamp: "2023-05-15T16:45:00Z",
      likes: 12,
      replies: [
        {
          id: "reply1",
          userId: "user1",
          userName: "CyberFan42",
          userAvatar: "C",
          content: "Yes! The DLC is fantastic and adds so much to the game. Definitely worth playing.",
          timestamp: "2023-05-15T17:30:00Z",
          likes: 8,
        },
      ],
    },
  ],
}

export function useReviews(gameId: string) {
  const [reviews, setReviews] = useState<GameReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<ReviewSortOption["value"]>("newest")
  const [filterBy, setFilterBy] = useState<ReviewFilterOption["value"]>("all")
  const [userReview, setUserReview] = useState<GameReview | null>(null)
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0], // 1-5 stars
  })

  // Fetch reviews
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      try {
        const data = await fetchReviews(gameId)
        setReviews(data)

        // Calculate stats
        if (data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rating.overall, 0)
          const avgRating = totalRating / data.length

          // Calculate rating distribution
          const distribution = [0, 0, 0, 0, 0]
          data.forEach((review) => {
            distribution[review.rating.overall - 1]++
          })

          setReviewStats({
            averageRating: avgRating,
            totalReviews: data.length,
            ratingDistribution: distribution,
          })
        }

        // Check if current user has a review
        // In a real app, this would check against the authenticated user's ID
        const currentUserReview = data.find((review) => review.userId === "user1")
        if (currentUserReview) {
          setUserReview(currentUserReview)
        }
      } catch (err) {
        setError("Failed to load reviews")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [gameId])

  // Apply sorting
  const sortedReviews = useCallback(() => {
    if (!reviews.length) return []

    const sorted = [...reviews]

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      case "oldest":
        return sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      case "highest-rated":
        return sorted.sort((a, b) => b.rating.overall - a.rating.overall)
      case "lowest-rated":
        return sorted.sort((a, b) => a.rating.overall - b.rating.overall)
      case "most-helpful":
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount)
      case "most-discussed":
        return sorted.sort((a, b) => b.commentCount - a.commentCount)
      case "reputation":
        return sorted.sort((a, b) => b.userReputation - a.userReputation)
      default:
        return sorted
    }
  }, [reviews, sortBy])

  // Apply filtering
  const filteredReviews = useCallback(() => {
    if (!reviews.length) return []

    const sorted = sortedReviews()

    switch (filterBy) {
      case "all":
        return sorted
      case "verified":
        return sorted.filter((review) => review.verified)
      case "with-media":
        return sorted.filter((review) => review.media && review.media.length > 0)
      case "detailed":
        return sorted.filter(
          (review) =>
            review.content.length > 500 ||
            (review.pros && review.pros.length > 0) ||
            (review.cons && review.cons.length > 0),
        )
      case "positive":
        return sorted.filter((review) => review.rating.overall >= 4)
      case "negative":
        return sorted.filter((review) => review.rating.overall <= 2)
      case "mixed":
        return sorted.filter((review) => review.rating.overall === 3)
      case "featured":
        return sorted.filter((review) => review.featured)
      default:
        return sorted
    }
  }, [reviews, filterBy, sortedReviews])

  // Submit a review
  const submitReview = useCallback(
    (
      review: Omit<
        GameReview,
        "id" | "timestamp" | "helpfulCount" | "unhelpfulCount" | "commentCount" | "userReputation"
      >,
    ) => {
      const newReview: GameReview = {
        ...review,
        id: `review${reviews.length + 1}`,
        timestamp: new Date().toISOString(),
        helpfulCount: 0,
        unhelpfulCount: 0,
        commentCount: 0,
        userReputation: 50, // Default reputation for new users
      }

      setReviews((prev) => [...prev, newReview])
      setUserReview(newReview)

      // Update stats
      setReviewStats((prev) => {
        const newDistribution = [...prev.ratingDistribution]
        newDistribution[newReview.rating.overall - 1]++

        const newTotal = prev.totalReviews + 1
        const newAvg = (prev.averageRating * prev.totalReviews + newReview.rating.overall) / newTotal

        return {
          averageRating: newAvg,
          totalReviews: newTotal,
          ratingDistribution: newDistribution,
        }
      })

      return newReview
    },
    [reviews],
  )

  // Update a review
  const updateReview = useCallback(
    (reviewId: string, updates: Partial<GameReview>) => {
      setReviews((prev) => {
        const index = prev.findIndex((r) => r.id === reviewId)
        if (index === -1) return prev

        const oldReview = prev[index]
        const updatedReview = { ...oldReview, ...updates, edited: true }

        const newReviews = [...prev]
        newReviews[index] = updatedReview

        // If this is the user's review, update it
        if (userReview && userReview.id === reviewId) {
          setUserReview(updatedReview)
        }

        // Update stats if rating changed
        if (updates.rating && updates.rating.overall !== oldReview.rating.overall) {
          setReviewStats((prev) => {
            const newDistribution = [...prev.ratingDistribution]
            newDistribution[oldReview.rating.overall - 1]--
            newDistribution[updates.rating!.overall - 1]++

            const newAvg =
              (prev.averageRating * prev.totalReviews - oldReview.rating.overall + updates.rating!.overall) /
              prev.totalReviews

            return {
              ...prev,
              averageRating: newAvg,
              ratingDistribution: newDistribution,
            }
          })
        }

        return newReviews
      })
    },
    [userReview],
  )

  // Delete a review
  const deleteReview = useCallback(
    (reviewId: string) => {
      setReviews((prev) => {
        const reviewToDelete = prev.find((r) => r.id === reviewId)
        if (!reviewToDelete) return prev

        const newReviews = prev.filter((r) => r.id !== reviewId)

        // If this is the user's review, clear it
        if (userReview && userReview.id === reviewId) {
          setUserReview(null)
        }

        // Update stats
        setReviewStats((prev) => {
          const newDistribution = [...prev.ratingDistribution]
          newDistribution[reviewToDelete.rating.overall - 1]--

          const newTotal = prev.totalReviews - 1
          const newAvg =
            newTotal > 0 ? (prev.averageRating * prev.totalReviews - reviewToDelete.rating.overall) / newTotal : 0

          return {
            averageRating: newAvg,
            totalReviews: newTotal,
            ratingDistribution: newDistribution,
          }
        })

        return newReviews
      })
    },
    [userReview],
  )

  // Submit feedback on a review
  const submitFeedback = useCallback((reviewId: string, feedback: Omit<ReviewFeedback, "id" | "timestamp">) => {
    setReviews((prev) => {
      const index = prev.findIndex((r) => r.id === reviewId)
      if (index === -1) return prev

      const updatedReview = { ...prev[index] }

      if (feedback.type === "helpful") {
        updatedReview.helpfulCount++
      } else if (feedback.type === "unhelpful") {
        updatedReview.unhelpfulCount++
      }

      const newReviews = [...prev]
      newReviews[index] = updatedReview

      return newReviews
    })
  }, [])

  // Get comments for a review
  const getComments = useCallback((reviewId: string): ReviewComment[] => {
    // In a real app, this would fetch from an API
    return mockComments[reviewId] || []
  }, [])

  // Add a comment to a review
  const addComment = useCallback((reviewId: string, comment: Omit<ReviewComment, "id" | "timestamp" | "likes">) => {
    // In a real app, this would call an API
    const newComment: ReviewComment = {
      ...comment,
      id: `comment${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    // Update comment count on the review
    setReviews((prev) => {
      const index = prev.findIndex((r) => r.id === reviewId)
      if (index === -1) return prev

      const updatedReview = {
        ...prev[index],
        commentCount: prev[index].commentCount + 1,
      }

      const newReviews = [...prev]
      newReviews[index] = updatedReview

      return newReviews
    })

    return newComment
  }, [])

  return {
    reviews: filteredReviews(),
    loading,
    error,
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
  }
}
