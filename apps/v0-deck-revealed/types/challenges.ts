export type ChallengeStatus = "active" | "upcoming" | "completed" | "expired"

export type ChallengeType = "single-game" | "multi-game" | "achievement" | "time-trial" | "community"

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced" | "expert"

export type ChallengeCategory = "speedrun" | "completion" | "skill" | "exploration" | "collection" | "social"

export type ChallengeRequirement = {
  id: string
  description: string
  gameId?: string // Optional for cross-game challenges
  targetValue: number
}

export type ChallengeReward = {
  id: string
  name: string
  description: string
  iconUrl?: string
  type: "badge" | "points" | "currency" | "customization" | "in-game"
  value?: number // For point/currency rewards
}

export type RequirementProgress = {
  requirementId: string
  currentValue: number
  completed: boolean
}

export type UserProgress = {
  challengeId: string
  joined: boolean
  joinedAt?: Date
  progress: number // 0-100
  requirementProgress: RequirementProgress[]
  completed: boolean
  completedAt?: Date
  score?: number
  rank?: number
}

export type LeaderboardEntry = {
  userId: string
  username: string
  avatar?: string
  progress: number
  score: number
  rank: number
  requirementsCompleted: number
  totalRequirements: number
  completedDate?: string
}

export type Leaderboard = {
  challengeId: string
  totalParticipants: number
  entries: LeaderboardEntry[]
  lastUpdated: string
}

export type Challenge = {
  id: string
  title: string
  shortDescription: string
  description: string
  type: ChallengeType
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  status: ChallengeStatus
  startDate: Date
  endDate: Date
  games: string[] // Game IDs
  requirements: ChallengeRequirement[]
  rewards: ChallengeReward[]
  participants: number
  thumbnail?: string
  bannerImage?: string
  tags: string[]
  featured?: boolean
  userProgress?: UserProgress // For the current user
}
