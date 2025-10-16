"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Trophy, Medal, Search, Users, Clock, ArrowDown } from "lucide-react"
import { useChallenges } from "@/hooks/use-challenges"

interface ChallengeLeaderboardProps {
  challengeId: string
  onBack: () => void
}

export function ChallengeLeaderboard({ challengeId, onBack }: ChallengeLeaderboardProps) {
  const { getChallengeById, getLeaderboardForChallenge, isLoading, leaderboards } = useChallenges()
  const [challenge, setChallenge] = useState(getChallengeById(challengeId))
  const [leaderboard, setLeaderboard] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCompleted, setFilterCompleted] = useState(false)

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      await getLeaderboardForChallenge(challengeId)
    }
    loadLeaderboard()
  }, [challengeId, getLeaderboardForChallenge])

  // Update challenge and leaderboard when they change
  useEffect(() => {
    setChallenge(getChallengeById(challengeId))
    // Check if leaderboard data is available in the hook's state
    const interval = setInterval(() => {
      const leaderboardData = leaderboards[challengeId]
      if (leaderboardData) {
        setLeaderboard(leaderboardData)
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [challengeId, getChallengeById, leaderboards])

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Challenge not found</p>
        <button className="text-primary hover:text-primary/80 font-medium mt-4" onClick={onBack}>
          Back
        </button>
      </div>
    )
  }

  // Filter leaderboard entries
  const getFilteredEntries = () => {
    if (!leaderboard) return []

    return leaderboard.entries.filter((entry: any) => {
      // Filter by search query
      const matchesSearch = searchQuery ? entry.username.toLowerCase().includes(searchQuery.toLowerCase()) : true

      // Filter by completion status
      const matchesCompletion = filterCompleted ? entry.completedDate : true

      return matchesSearch && matchesCompletion
    })
  }

  const filteredEntries = getFilteredEntries()

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Get medal for top ranks
  const getMedal = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" fill="currentColor" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" fill="currentColor" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" fill="currentColor" />
    return null
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
          <h1 className="text-2xl font-bold gradient-text">Leaderboard: {challenge.title}</h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search players..."
            className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <FocusableItem
          focusKey="filter-completed"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            filterCompleted
              ? "bg-primary text-white"
              : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          onClick={() => setFilterCompleted(!filterCompleted)}
        >
          <Trophy className="w-4 h-4 mr-2" />
          <span>Completed Only</span>
        </FocusableItem>
      </div>

      {/* Leaderboard Stats */}
      <Card className="bg-card border-border p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Users className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Participants</p>
              <p className="font-bold">{leaderboard?.totalParticipants || challenge.participants}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Trophy className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Completion Rate</p>
              <p className="font-bold">
                {leaderboard
                  ? `${Math.round(
                      (leaderboard.entries.filter((e: any) => e.completedDate).length / leaderboard.totalParticipants) *
                        100,
                    )}%`
                  : "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last Updated</p>
              <p className="font-bold">{leaderboard ? formatDate(leaderboard.lastUpdated) : "Loading..."}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Leaderboard Table */}
      {isLoading || !leaderboard ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard data...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No players found matching your criteria.</p>
          <button
            className="text-primary hover:text-primary/80 font-medium"
            onClick={() => {
              setSearchQuery("")
              setFilterCompleted(false)
            }}
          >
            Clear filters and try again
          </button>
        </div>
      ) : (
        <Card className="bg-card border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Player</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      <span>Score</span>
                      <ArrowDown className="w-3 h-3 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Requirements</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEntries.map((entry: any) => {
                  const isCurrentUser = entry.userId === "current-user"
                  return (
                    <tr
                      key={entry.userId}
                      className={`${isCurrentUser ? "bg-primary/5" : "hover:bg-muted/20"} transition-colors`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMedal(entry.rank)}
                          <span className={`${getMedal(entry.rank) ? "ml-1" : ""} font-medium`}>#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center mr-3 text-sm font-bold">
                            {entry.avatar ? (
                              <img
                                src={entry.avatar || "/placeholder.svg"}
                                alt={entry.username}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              entry.username.charAt(0)
                            )}
                          </div>
                          <span className={`font-medium ${isCurrentUser ? "text-primary" : ""}`}>
                            {entry.username} {isCurrentUser && "(You)"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-muted-foreground">{entry.progress}%</p>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${entry.progress === 100 ? "bg-green-500" : "bg-primary"}`}
                              style={{ width: `${entry.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium">{entry.score}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-muted-foreground">
                          {entry.requirementsCompleted}/{entry.totalRequirements}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {entry.completedDate ? (
                          <span className="text-green-500 flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            {formatDate(entry.completedDate)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">In Progress</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
