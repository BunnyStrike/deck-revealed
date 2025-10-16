"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { GamepadHints } from "@/components/ui/gamepad-hints"
import { Clock, Trophy, Users, ChevronLeft, Filter, Calendar, Star } from "lucide-react"
import { useChallenges } from "@/hooks/use-challenges"
import { useInputMethod } from "@/hooks/use-input-method"
import { ChallengeDetail } from "./challenge-detail"
import { ChallengeLeaderboard } from "./challenge-leaderboard"

interface ChallengeHubProps {
  onBack: () => void
}

export function ChallengeHub({ onBack }: ChallengeHubProps) {
  const {
    challenges,
    isLoading,
    error,
    getChallengeById,
    getActiveChallenges,
    getUpcomingChallenges,
    getCompletedChallenges,
    getFeaturedChallenges,
    getUserJoinedChallenges,
  } = useChallenges()

  const { inputMethod } = useInputMethod()
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed" | "joined" | "featured">("active")
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const [view, setView] = useState<"list" | "detail" | "leaderboard">("list")

  // Get challenges based on active tab
  const getTabChallenges = () => {
    switch (activeTab) {
      case "active":
        return getActiveChallenges()
      case "upcoming":
        return getUpcomingChallenges()
      case "completed":
        return getCompletedChallenges()
      case "joined":
        return getUserJoinedChallenges()
      case "featured":
        return getFeaturedChallenges()
      default:
        return getActiveChallenges()
    }
  }

  const displayChallenges = getTabChallenges()

  // Handle challenge selection
  const handleSelectChallenge = (challengeId: string) => {
    setSelectedChallengeId(challengeId)
    setView("detail")
  }

  // Handle back to challenge list
  const handleBackToList = () => {
    setSelectedChallengeId(null)
    setView("list")
  }

  // Handle view leaderboard
  const handleViewLeaderboard = (challengeId: string) => {
    setSelectedChallengeId(challengeId)
    setView("leaderboard")
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(date.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 30) {
      const options: Intl.RelativeTimeFormatOptions = { numeric: "auto" }
      const rtf = new Intl.RelativeTimeFormat("en", options)
      return date > now
        ? rtf.format(diffDays, "day").replace("in ", "")
        : rtf.format(-diffDays, "day").replace("ago", "")
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // If in detail view, show the challenge detail
  if (view === "detail" && selectedChallengeId) {
    return (
      <ChallengeDetail
        challengeId={selectedChallengeId}
        onBack={handleBackToList}
        onViewLeaderboard={handleViewLeaderboard}
      />
    )
  }

  // If in leaderboard view, show the challenge leaderboard
  if (view === "leaderboard" && selectedChallengeId) {
    return <ChallengeLeaderboard challengeId={selectedChallengeId} onBack={handleBackToList} />
  }

  // Otherwise, show the challenge list
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
          <h1 className="text-2xl font-bold gradient-text">Community Challenges</h1>
        </div>

        {inputMethod === "gamepad" && (
          <GamepadHints
            hints={[
              { button: "A", label: "Select" },
              { button: "B", label: "Back" },
              { button: "X", label: "Filter" },
            ]}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 overflow-x-auto pb-1">
        <FocusableItem
          focusKey="tab-active"
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("active")}
        >
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            <span>Active Challenges</span>
          </div>
        </FocusableItem>

        <FocusableItem
          focusKey="tab-featured"
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === "featured"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("featured")}
        >
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            <span>Featured</span>
          </div>
        </FocusableItem>

        <FocusableItem
          focusKey="tab-joined"
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === "joined"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("joined")}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>My Challenges</span>
          </div>
        </FocusableItem>

        <FocusableItem
          focusKey="tab-upcoming"
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === "upcoming"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Upcoming</span>
          </div>
        </FocusableItem>

        <FocusableItem
          focusKey="tab-completed"
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === "completed"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            <span>Completed</span>
          </div>
        </FocusableItem>
      </div>

      {/* Challenge Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : displayChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No challenges found</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === "joined"
              ? "You haven't joined any challenges yet."
              : activeTab === "upcoming"
                ? "There are no upcoming challenges at the moment."
                : activeTab === "completed"
                  ? "There are no completed challenges in your history."
                  : "There are no active challenges at the moment."}
          </p>
          {activeTab === "joined" && (
            <FocusableItem
              focusKey="browse-challenges"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors inline-flex items-center"
              onClick={() => setActiveTab("active")}
            >
              <Trophy className="w-4 h-4 mr-2" />
              <span>Browse Active Challenges</span>
            </FocusableItem>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayChallenges.map((challenge) => {
            const userProgress = challenge.userProgress
            const progressPercentage = userProgress?.progress || 0
            const isJoined = userProgress?.joined || false

            return (
              <FocusableItem
                key={challenge.id}
                focusKey={`challenge-${challenge.id}`}
                className="challenge-card"
                onClick={() => handleSelectChallenge(challenge.id)}
              >
                <Card className="overflow-hidden bg-card border-border h-full hover:shadow-md transition-all">
                  <div className="relative">
                    <img
                      src={challenge.thumbnail || "/placeholder.svg?height=200&width=400&query=gaming challenge"}
                      alt={challenge.title}
                      className="w-full h-48 object-cover"
                    />
                    {challenge.status === "upcoming" && (
                      <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full">
                        Starts in {formatDate(challenge.startDate.toString())}
                      </div>
                    )}
                    {challenge.status === "active" && (
                      <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </div>
                    )}
                    {challenge.status === "completed" && (
                      <div className="absolute top-2 left-2 bg-gray-500/90 text-white text-xs px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                    {challenge.featured && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{challenge.shortDescription}</p>

                    {isJoined && challenge.status === "active" && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground capitalize">
                        {challenge.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          challenge.difficulty === "beginner"
                            ? "bg-green-500/20 text-green-500"
                            : challenge.difficulty === "intermediate"
                              ? "bg-blue-500/20 text-blue-500"
                              : challenge.difficulty === "advanced"
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground capitalize">
                        {challenge.category}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {challenge.status === "active"
                            ? `Ends in ${formatDate(challenge.endDate.toString())}`
                            : challenge.status === "upcoming"
                              ? `Starts in ${formatDate(challenge.startDate.toString())}`
                              : `Ended ${formatDate(challenge.endDate.toString())}`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{challenge.participants}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </FocusableItem>
            )
          })}
        </div>
      )}
    </div>
  )
}
