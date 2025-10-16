"use client"

import { useState, useEffect, useCallback } from "react"
import type { Challenge, UserProgress, ChallengeStatus, Leaderboard } from "@/types/challenges"

// Mock data for challenges
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "challenge-1",
    title: "Spring Gaming Marathon",
    shortDescription: "Complete 10 hours of gameplay across any 3 different games.",
    description:
      "Complete 10 hours of gameplay across any 3 different games in our catalog within the challenge period. Track your progress and earn exclusive rewards for participating in this seasonal event!",
    type: "multi-game",
    category: "completion",
    difficulty: "beginner",
    status: "active",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    games: ["game1", "game2", "game3"],
    requirements: [
      {
        id: "req-1",
        description: "Play any game for a total of 10 hours",
        targetValue: 10,
      },
      {
        id: "req-2",
        description: "Play at least 3 different games",
        targetValue: 3,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        name: "Spring Champion Badge",
        description: "Exclusive profile badge for completing the Spring Gaming Marathon",
        iconUrl: "/achievement-icon-1.png",
        type: "badge",
      },
      {
        id: "reward-2",
        name: "Community Points",
        description: "Earn points to unlock exclusive customization options",
        iconUrl: "/achievement-icon-2.png",
        type: "points",
        value: 500,
      },
    ],
    participants: 1243,
    thumbnail: "/cyberpunk-screenshot-1.png",
    tags: ["seasonal", "multi-game", "casual"],
    featured: true,
  },
  {
    id: "challenge-2",
    title: "Elden Ring Master",
    shortDescription: "Defeat 5 major bosses in Elden Ring.",
    description: "Defeat 5 major bosses in Elden Ring within the challenge period. Prove your skill and determination!",
    type: "single-game",
    category: "skill",
    difficulty: "advanced",
    status: "active",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    games: ["game2"],
    requirements: [
      {
        id: "req-1",
        description: "Defeat Margit, the Fell Omen",
        gameId: "game2",
        targetValue: 1,
      },
      {
        id: "req-2",
        description: "Defeat Godrick the Grafted",
        gameId: "game2",
        targetValue: 1,
      },
      {
        id: "req-3",
        description: "Defeat Rennala, Queen of the Full Moon",
        gameId: "game2",
        targetValue: 1,
      },
      {
        id: "req-4",
        description: "Defeat Starscourge Radahn",
        gameId: "game2",
        targetValue: 1,
      },
      {
        id: "req-5",
        description: "Defeat any other major boss",
        gameId: "game2",
        targetValue: 1,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        name: "Elden Lord Badge",
        description: "Exclusive profile badge for Elden Ring masters",
        iconUrl: "/achievement-icon-1.png",
        type: "badge",
      },
      {
        id: "reward-2",
        name: "Elden Ring Soundtrack",
        description: "Digital download of selected tracks from the Elden Ring soundtrack",
        iconUrl: "/elden-ring-dlc-1.png",
        type: "in-game",
      },
    ],
    participants: 876,
    thumbnail: "/elden-ring-screenshot-2.png",
    tags: ["boss-fight", "souls-like", "difficult"],
  },
  {
    id: "challenge-3",
    title: "Speedrun Showdown",
    shortDescription: "Complete Hades in the fastest time possible.",
    description:
      "Complete Hades in the fastest time possible. Top 10 players will be featured on the global leaderboard.",
    type: "time-trial",
    category: "speedrun",
    difficulty: "intermediate",
    status: "active",
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
    games: ["game3"],
    requirements: [
      {
        id: "req-1",
        description: "Complete a full run of Hades",
        gameId: "game3",
        targetValue: 1,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        name: "Speedrunner Supreme Badge",
        description: "Exclusive profile badge for top speedrunners",
        iconUrl: "/achievement-icon-2.png",
        type: "badge",
      },
      {
        id: "reward-2",
        name: "Community Points",
        description: "Earn points based on your ranking",
        iconUrl: "/achievement-icon-1.png",
        type: "points",
        value: 1000,
      },
    ],
    participants: 532,
    thumbnail: "/hades-screenshot-1.png",
    tags: ["speedrun", "roguelike", "competitive"],
  },
  {
    id: "challenge-4",
    title: "Night City Explorer",
    shortDescription: "Discover all districts in Cyberpunk 2077.",
    description: "Discover all districts in Cyberpunk 2077 and complete at least one side mission in each.",
    type: "achievement",
    category: "exploration",
    difficulty: "beginner",
    status: "upcoming",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
    games: ["game1"],
    requirements: [
      {
        id: "req-1",
        description: "Discover all districts in Night City",
        gameId: "game1",
        targetValue: 6,
      },
      {
        id: "req-2",
        description: "Complete at least one side mission in each district",
        gameId: "game1",
        targetValue: 6,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        name: "Night City Veteran Badge",
        description: "Exclusive profile badge for Night City explorers",
        iconUrl: "/achievement-icon-1.png",
        type: "badge",
      },
      {
        id: "reward-2",
        name: "Exclusive Vehicle Skin",
        description: "Unique vehicle customization option for Cyberpunk 2077",
        iconUrl: "/cyberpunk-dlc-1.png",
        type: "in-game",
      },
    ],
    participants: 0,
    thumbnail: "/cyberpunk-screenshot-3.png",
    tags: ["exploration", "open-world", "cyberpunk"],
  },
  {
    id: "challenge-5",
    title: "Community Screenshot Contest",
    shortDescription: "Submit your best in-game screenshots from any game.",
    description: "Submit your best in-game screenshots from any game. Community voting will determine the winners.",
    type: "community",
    category: "social",
    difficulty: "beginner",
    status: "completed",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
    games: ["game1", "game2", "game3"],
    requirements: [
      {
        id: "req-1",
        description: "Submit at least one screenshot",
        targetValue: 1,
      },
      {
        id: "req-2",
        description: "Vote on at least 5 other submissions",
        targetValue: 5,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        name: "Photographer Badge",
        description: "Exclusive profile badge for screenshot contest participants",
        iconUrl: "/achievement-icon-2.png",
        type: "badge",
      },
      {
        id: "reward-2",
        name: "Featured Gallery Spot",
        description: "Top 3 screenshots will be featured in the community gallery",
        iconUrl: "/achievement-icon-1.png",
        type: "customization",
      },
    ],
    participants: 1876,
    thumbnail: "/fantasy-adventure-party.png",
    tags: ["creative", "community", "contest"],
  },
]

// Mock data for user progress
const MOCK_USER_PROGRESS: UserProgress[] = [
  {
    challengeId: "challenge-1",
    joined: true,
    joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    progress: 65,
    requirementProgress: [
      {
        requirementId: "req-1",
        currentValue: 6.5,
        completed: false,
      },
      {
        requirementId: "req-2",
        currentValue: 2,
        completed: false,
      },
    ],
    completed: false,
  },
  {
    challengeId: "challenge-2",
    joined: true,
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    progress: 40,
    requirementProgress: [
      {
        requirementId: "req-1",
        currentValue: 1,
        completed: true,
      },
      {
        requirementId: "req-2",
        currentValue: 1,
        completed: true,
      },
      {
        requirementId: "req-3",
        currentValue: 0,
        completed: false,
      },
      {
        requirementId: "req-4",
        currentValue: 0,
        completed: false,
      },
      {
        requirementId: "req-5",
        currentValue: 0,
        completed: false,
      },
    ],
    completed: false,
  },
  {
    challengeId: "challenge-5",
    joined: true,
    joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    progress: 100,
    requirementProgress: [
      {
        requirementId: "req-1",
        currentValue: 3,
        completed: true,
      },
      {
        requirementId: "req-2",
        currentValue: 12,
        completed: true,
      },
    ],
    completed: true,
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    score: 87,
    rank: 32,
  },
]

// Mock leaderboard data generator
const generateMockLeaderboard = (challengeId: string, count = 100): Leaderboard => {
  const entries = []
  const totalParticipants = Math.max(count, Math.floor(Math.random() * 500) + 100)

  // Add current user
  entries.push({
    userId: "current-user",
    username: "You",
    avatar: "",
    progress: Math.floor(Math.random() * 100),
    score: Math.floor(Math.random() * 1000),
    rank: Math.floor(Math.random() * 20) + 1,
    requirementsCompleted: Math.floor(Math.random() * 5) + 1,
    totalRequirements: 5,
    completedDate: Math.random() > 0.5 ? new Date().toISOString() : undefined,
  })

  // Add other users
  for (let i = 0; i < count - 1; i++) {
    const completed = Math.random() > 0.3
    entries.push({
      userId: `user-${i + 1}`,
      username: `Player${i + 1}`,
      avatar: "",
      progress: Math.floor(Math.random() * 100),
      score: Math.floor(Math.random() * 1000),
      rank: i + 2, // +2 because current user is rank 1
      requirementsCompleted: Math.floor(Math.random() * 5) + 1,
      totalRequirements: 5,
      completedDate: completed
        ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    })
  }

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score)

  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1
  })

  return {
    challengeId,
    totalParticipants,
    entries,
    lastUpdated: new Date().toISOString(),
  }
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboards, setLeaderboards] = useState<Record<string, Leaderboard>>({})

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Combine challenges with user progress
        const challengesWithProgress = MOCK_CHALLENGES.map((challenge) => {
          const progress = MOCK_USER_PROGRESS.find((p) => p.challengeId === challenge.id)
          return {
            ...challenge,
            userProgress: progress,
          }
        })

        setChallenges(challengesWithProgress)
        setUserProgress(MOCK_USER_PROGRESS)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch challenges")
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  // Get challenge by ID
  const getChallengeById = useCallback(
    (id: string) => {
      return challenges.find((challenge) => challenge.id === id) || null
    },
    [challenges],
  )

  // Get user progress for a challenge
  const getUserProgressForChallenge = useCallback(
    (challengeId: string) => {
      return userProgress.find((progress) => progress.challengeId === challengeId) || null
    },
    [userProgress],
  )

  // Join a challenge
  const joinChallenge = useCallback(
    (challengeId: string) => {
      const challenge = getChallengeById(challengeId)

      if (!challenge || challenge.status !== "active") {
        setError("Cannot join this challenge")
        return
      }

      // Check if already joined
      if (getUserProgressForChallenge(challengeId)?.joined) {
        setError("Already joined this challenge")
        return
      }

      // Create new progress entry
      const newProgress: UserProgress = {
        challengeId,
        joined: true,
        joinedAt: new Date(),
        progress: 0,
        requirementProgress: challenge.requirements.map((req) => ({
          requirementId: req.id,
          currentValue: 0,
          completed: false,
        })),
        completed: false,
      }

      setUserProgress((prev) => [...prev, newProgress])

      // Update challenge participants count
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            return {
              ...c,
              participants: c.participants + 1,
              userProgress: newProgress,
            }
          }
          return c
        }),
      )
    },
    [getChallengeById, getUserProgressForChallenge],
  )

  // Leave a challenge
  const leaveChallenge = useCallback(
    (challengeId: string) => {
      const progress = getUserProgressForChallenge(challengeId)

      if (!progress || !progress.joined) {
        setError("Not participating in this challenge")
        return
      }

      // Remove progress entry
      setUserProgress((prev) => prev.filter((p) => p.challengeId !== challengeId))

      // Update challenge participants count
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            return {
              ...c,
              participants: Math.max(0, c.participants - 1),
              userProgress: undefined,
            }
          }
          return c
        }),
      )
    },
    [getUserProgressForChallenge],
  )

  // Update requirement progress
  const updateRequirementProgress = useCallback(
    (challengeId: string, requirementId: string, newValue: number) => {
      const challenge = getChallengeById(challengeId)
      const progress = getUserProgressForChallenge(challengeId)

      if (!challenge || !progress || !progress.joined) {
        setError("Cannot update progress")
        return
      }

      const requirement = challenge.requirements.find((r) => r.id === requirementId)
      if (!requirement) {
        setError("Requirement not found")
        return
      }

      // Update the requirement progress
      const updatedRequirementProgress = progress.requirementProgress.map((rp) => {
        if (rp.requirementId === requirementId) {
          const completed = newValue >= requirement.targetValue
          return {
            ...rp,
            currentValue: newValue,
            completed,
          }
        }
        return rp
      })

      // Calculate overall progress
      const totalRequirements = challenge.requirements.length
      const completedRequirements = updatedRequirementProgress.filter((rp) => rp.completed).length
      const overallProgress = Math.round((completedRequirements / totalRequirements) * 100)

      // Check if all requirements are completed
      const allCompleted = completedRequirements === totalRequirements

      // Update user progress
      const updatedProgress: UserProgress = {
        ...progress,
        progress: overallProgress,
        requirementProgress: updatedRequirementProgress,
        completed: allCompleted,
        completedAt: allCompleted && !progress.completed ? new Date() : progress.completedAt,
      }

      setUserProgress((prev) => prev.map((p) => (p.challengeId === challengeId ? updatedProgress : p)))

      // Update challenge in state
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            return {
              ...c,
              userProgress: updatedProgress,
            }
          }
          return c
        }),
      )
    },
    [getChallengeById, getUserProgressForChallenge],
  )

  // Get leaderboard for a challenge
  const getLeaderboardForChallenge = useCallback(
    async (challengeId: string) => {
      try {
        // Check if we already have the leaderboard
        if (leaderboards[challengeId]) {
          return leaderboards[challengeId]
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock leaderboard
        const leaderboard = generateMockLeaderboard(challengeId)

        // Update leaderboards state
        setLeaderboards((prev) => ({
          ...prev,
          [challengeId]: leaderboard,
        }))

        return leaderboard
      } catch (err) {
        setError("Failed to fetch leaderboard")
        return null
      }
    },
    [leaderboards],
  )

  // Filter challenges by status
  const getChallengesByStatus = useCallback(
    (status: ChallengeStatus) => {
      return challenges.filter((challenge) => challenge.status === status)
    },
    [challenges],
  )

  // Get active challenges
  const getActiveChallenges = useCallback(() => {
    return getChallengesByStatus("active")
  }, [getChallengesByStatus])

  // Get upcoming challenges
  const getUpcomingChallenges = useCallback(() => {
    return getChallengesByStatus("upcoming")
  }, [getChallengesByStatus])

  // Get completed challenges
  const getCompletedChallenges = useCallback(() => {
    return getChallengesByStatus("completed")
  }, [getChallengesByStatus])

  // Get expired challenges
  const getExpiredChallenges = useCallback(() => {
    return getChallengesByStatus("expired")
  }, [getChallengesByStatus])

  // Get featured challenges
  const getFeaturedChallenges = useCallback(() => {
    return challenges.filter((challenge) => challenge.featured)
  }, [challenges])

  // Get user's joined challenges
  const getUserJoinedChallenges = useCallback(() => {
    return challenges.filter((challenge) => challenge.userProgress?.joined)
  }, [challenges])

  return {
    challenges,
    isLoading,
    error,
    leaderboards,
    getChallengeById,
    getUserProgressForChallenge,
    joinChallenge,
    leaveChallenge,
    updateRequirementProgress,
    getLeaderboardForChallenge,
    getActiveChallenges,
    getUpcomingChallenges,
    getCompletedChallenges,
    getExpiredChallenges,
    getFeaturedChallenges,
    getUserJoinedChallenges,
  }
}
