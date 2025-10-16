"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  Trophy,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  Info,
  Gift,
  BarChart2,
  Share2,
  Flag,
} from "lucide-react"
import { useChallenges } from "@/hooks/use-challenges"
import type { ChallengeRequirement } from "@/types/challenges"

interface ChallengeDetailProps {
  challengeId: string
  onBack: () => void
  onViewLeaderboard: (challengeId: string) => void
}

export function ChallengeDetail({ challengeId, onBack, onViewLeaderboard }: ChallengeDetailProps) {
  const {
    getChallengeById,
    getUserProgressForChallenge,
    joinChallenge,
    leaveChallenge,
    updateRequirementProgress,
    isLoading,
    error,
  } = useChallenges()

  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "rewards" | "leaderboard">("overview")
  const [challenge, setChallenge] = useState(getChallengeById(challengeId))
  const [userProgress, setUserProgress] = useState(getUserProgressForChallenge(challengeId))

  // Refresh data when needed
  useEffect(() => {
    setChallenge(getChallengeById(challengeId))
    setUserProgress(getUserProgressForChallenge(challengeId))
  }, [challengeId, getChallengeById, getUserProgressForChallenge])

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Challenge not found</p>
        <button className="text-primary hover:text-primary/80 font-medium mt-4" onClick={onBack}>
          Back to Challenges
        </button>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const distance = end - now

    if (distance <= 0) {
      return "Expired"
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m remaining`
  }

  // Handle join challenge
  const handleJoinChallenge = () => {
    joinChallenge(challengeId)
  }

  // Handle leave challenge
  const handleLeaveChallenge = () => {
    if (confirm("Are you sure you want to leave this challenge? Your progress will be lost.")) {
      leaveChallenge(challengeId)
    }
  }

  // Handle update requirement progress (for demo purposes)
  const handleUpdateRequirement = (requirement: ChallengeRequirement) => {
    const currentValue =
      userProgress?.requirementProgress.find((rp) => rp.requirementId === requirement.id)?.currentValue || 0
    const newValue = Math.min(requirement.targetValue, currentValue + Math.ceil(requirement.targetValue * 0.25))
    updateRequirementProgress(challengeId, requirement.id, newValue)
  }

  // Get requirement progress
  const getRequirementProgress = (requirementId: string) => {
    if (!userProgress) return null
    return userProgress.requirementProgress.find((rp) => rp.requirementId === requirementId)
  }

  // Get game name
  const getGameName = (gameId: string) => {
    switch (gameId) {
      case "game1":
        return "Cyberpunk 2077"
      case "game2":
        return "Elden Ring"
      case "game3":
        return "Hades"
      default:
        return "Unknown Game"
    }
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mr-4 transition-colors"
            onClick={onBack}
          >
            <ChevronLeft className="mr-1" size={18} />
            <span>Back</span>
          </FocusableItem>
          <h1 className="text-2xl font-bold gradient-text">{challenge.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {userProgress ? (
            <div className="flex items-center">
              <div className="bg-muted/30 rounded-full h-2 w-32 mr-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${userProgress.progress}%` }}></div>
              </div>
              <span className="text-sm font-medium">{userProgress.progress}%</span>
            </div>
          ) : (
            challenge.status === "active" && (
              <FocusableItem
                focusKey="join-challenge"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                onClick={handleJoinChallenge}
              >
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>Join Challenge</span>
                </div>
              </FocusableItem>
            )
          )}
        </div>
      </div>

      {/* Challenge Banner */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <img
          src={
            challenge.bannerImage ||
            challenge.thumbnail ||
            "/placeholder.svg?height=300&width=1200&query=game challenge banner"
          }
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                challenge.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : challenge.status === "upcoming"
                    ? "bg-blue-500/20 text-blue-500"
                    : challenge.status === "completed"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-500/20 text-gray-500"
              }`}
            >
              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
            </span>
            <span className="text-xs bg-muted/50 px-2 py-1 rounded-full text-muted-foreground">
              {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
            </span>
            <span className="text-xs bg-muted/50 px-2 py-1 rounded-full text-muted-foreground">
              {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                challenge.difficulty === "beginner"
                  ? "bg-green-500/20 text-green-500"
                  : challenge.difficulty === "intermediate"
                    ? "bg-blue-500/20 text-blue-500"
                    : challenge.difficulty === "advanced"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-red-500/20 text-red-500"
              }`}
            >
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl">{challenge.shortDescription}</p>
        </div>
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Calendar className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Time Frame</p>
              <p className="font-bold">
                {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <p className="font-bold">
                {challenge.status === "active" ? getTimeRemaining(challenge.endDate) : challenge.status}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Users className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Participants</p>
              <p className="font-bold">{challenge.participants}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Award className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Rewards</p>
              <p className="font-bold">{challenge.rewards.length} rewards</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <FocusableItem
          focusKey="tab-overview"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </FocusableItem>

        <FocusableItem
          focusKey="tab-requirements"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "requirements"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("requirements")}
        >
          Requirements
        </FocusableItem>

        <FocusableItem
          focusKey="tab-rewards"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "rewards"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("rewards")}
        >
          Rewards
        </FocusableItem>

        <FocusableItem
          focusKey="tab-leaderboard"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "leaderboard"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onViewLeaderboard(challengeId)}
        >
          Leaderboard
        </FocusableItem>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="mr-2" size={20} />
              About This Challenge
            </h2>
            <p className="text-muted-foreground whitespace-pre-line">{challenge.description}</p>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Games Included</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.games.map((gameId) => (
                  <span key={gameId} className="bg-muted/50 text-muted-foreground text-sm px-3 py-1 rounded-lg">
                    {getGameName(gameId)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {userProgress && (
            <Card className="bg-card border-border p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart2 className="mr-2" size={20} />
                Your Progress
              </h2>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-muted-foreground">Overall Completion</p>
                  <p className="text-sm font-medium">{userProgress.progress}%</p>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${userProgress.progress}%` }}></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Requirements Completed</p>
                <p className="font-medium">
                  {userProgress.requirementProgress.filter((rp) => rp.completed).length} of{" "}
                  {challenge.requirements.length}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Current Rank</p>
                <p className="font-medium">
                  #{userProgress.rank} of {challenge.participants}
                </p>
              </div>

              <div className="mt-6">
                <FocusableItem
                  focusKey="leave-challenge"
                  className="px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors inline-flex items-center"
                  onClick={handleLeaveChallenge}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  <span>Leave Challenge</span>
                </FocusableItem>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "requirements" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Challenge Requirements</h2>

            <div className="space-y-4">
              {challenge.requirements.map((requirement) => {
                const progress = getRequirementProgress(requirement.id)
                const isCompleted = progress?.completed || false
                const currentValue = progress?.currentValue || 0
                const percentage = Math.min(100, Math.round((currentValue / requirement.targetValue) * 100)) || 0

                return (
                  <div key={requirement.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{requirement.description}</h3>
                          {userProgress && (
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                isCompleted ? "bg-green-500/20 text-green-500" : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? "Completed" : "In Progress"}
                            </span>
                          )}
                        </div>
                        {requirement.gameId && (
                          <p className="text-sm text-muted-foreground mt-1">Game: {getGameName(requirement.gameId)}</p>
                        )}
                      </div>

                      {userProgress && (
                        <FocusableItem
                          focusKey={`update-req-${requirement.id}`}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            isCompleted
                              ? "bg-green-500/10 text-green-500"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                          onClick={() => !isCompleted && handleUpdateRequirement(requirement)}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span>Progress (Demo)</span>}
                        </FocusableItem>
                      )}
                    </div>

                    {userProgress && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-muted-foreground">
                            {currentValue} / {requirement.targetValue}
                          </p>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "rewards" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Gift className="mr-2" size={20} />
              Challenge Rewards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenge.rewards.map((reward) => (
                <div key={reward.id} className="border border-border rounded-lg p-4 flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center mr-4 overflow-hidden">
                    <img
                      src={reward.iconUrl || "/placeholder.svg?height=64&width=64&query=reward badge"}
                      alt={reward.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{reward.name}</h3>
                      <span className="ml-2 text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground capitalize">
                        {reward.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                    {reward.type === "points" || reward.type === "currency" ? (
                      <p className="text-sm font-medium mt-1">Value: {reward.value}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Share Button */}
      <div className="fixed bottom-8 right-8">
        <FocusableItem
          focusKey="share-challenge"
          className="p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all"
        >
          <Share2 className="w-5 h-5" />
        </FocusableItem>
      </div>
    </div>
  )
}
