"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, BarChart2, Clock, Award, Users, Star, TrendingUp, Calendar } from "lucide-react"
import type { GameData } from "@/types/game-data"

interface GameStatisticsProps {
  game: GameData
  onBack: () => void
}

export function GameStatistics({ game, onBack }: GameStatisticsProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Tabs for different statistics views
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "playtime", label: "Playtime", icon: Clock },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "community", label: "Community", icon: Users },
  ]

  // Mock playtime data
  const playtimeData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 0.5 },
    { day: "Fri", hours: 4.1 },
    { day: "Sat", hours: 5.7 },
    { day: "Sun", hours: 3.9 },
  ]

  // Mock achievement data
  const achievementCategories = [
    { name: "Story", completed: 8, total: 10 },
    { name: "Exploration", completed: 5, total: 12 },
    { name: "Combat", completed: 3, total: 8 },
    { name: "Collectibles", completed: 0, total: 6 },
    { name: "Misc", completed: 0, total: 8 },
  ]

  // Mock community data
  const communityStats = {
    activePlayers: "125,432",
    averageRating: game.rating,
    reviewCount: game.ratingCount,
    positiveReviews: Math.floor(game.ratingCount * 0.85),
    negativeReviews: Math.floor(game.ratingCount * 0.15),
    popularTags: ["Open World", "RPG", "Story Rich", "Atmospheric", "Sci-Fi"],
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
          <h1 className="text-2xl font-bold gradient-text">{game.title} Statistics</h1>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <FocusableItem
              key={tab.id}
              focusKey={`tab-${tab.id}`}
              className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </FocusableItem>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Playtime</p>
                  <p className="font-bold">{game.totalPlaytime}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-secondary/20 p-2 rounded-lg mr-3">
                  <Award className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Achievements</p>
                  <p className="font-bold">
                    {game.achievements.unlocked}/{game.achievements.total}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-accent/20 p-2 rounded-lg mr-3">
                  <TrendingUp className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Completion Rate</p>
                  <p className="font-bold">{game.statistics.completionRate}%</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Last Played</p>
                  <p className="font-bold">{game.lastPlayed}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Game Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-muted-foreground">Completion Progress</p>
                      <p className="text-sm font-medium">{game.statistics.completionRate}%</p>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${game.statistics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-muted-foreground">Achievement Progress</p>
                      <p className="text-sm font-medium">
                        {Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%
                      </p>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{
                          width: `${Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-muted-foreground">Difficulty Rating</p>
                      <p className="text-sm font-medium">{game.statistics.difficultyRating}/10</p>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(game.statistics.difficultyRating / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-muted-foreground">Replay Value</p>
                      <p className="text-sm font-medium">{game.statistics.replayValue}/10</p>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(game.statistics.replayValue / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Ranking</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Popularity Rank</p>
                    <p className="font-bold">#{game.statistics.popularityRank}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">In Your Library</p>
                    <p className="font-bold">#3</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Among Friends</p>
                    <p className="font-bold">#2</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Genre Rank</p>
                    <p className="font-bold">#5</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Playtime Tab */}
      {activeTab === "playtime" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Weekly Playtime</h2>
                <div className="h-64 flex items-end justify-between">
                  {playtimeData.map((day) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                        style={{ height: `${(day.hours / 6) * 100}%` }}
                      ></div>
                      <p className="text-sm mt-2">{day.day}</p>
                      <p className="text-xs text-muted-foreground">{day.hours}h</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="bg-card border-border p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold mb-4">Playtime Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Total Playtime</p>
                    <p className="font-bold">{game.totalPlaytime}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Average Session</p>
                    <p className="font-bold">1.5 hours</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Longest Session</p>
                    <p className="font-bold">4.2 hours</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Total Sessions</p>
                    <p className="font-bold">28</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Most Active Times</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Day of Week</p>
                    <p className="font-bold">Saturday</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Time of Day</p>
                    <p className="font-bold">8:00 PM - 10:00 PM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Achievement Progress</h2>
            <div className="w-full bg-muted/30 rounded-full h-4 mb-6">
              <div
                className="bg-primary h-4 rounded-full"
                style={{ width: `${Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">By Category</h3>
                <div className="space-y-4">
                  {achievementCategories.map((category) => (
                    <div key={category.name}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-muted-foreground">{category.name}</p>
                        <p className="text-sm font-medium">
                          {category.completed}/{category.total}
                        </p>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(category.completed / category.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Recent Achievements</h3>
                <div className="space-y-3">
                  {game.achievements.recent.map((achievement) => (
                    <div key={achievement.id} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mr-3 overflow-hidden">
                        <img src={achievement.icon || "/placeholder.svg"} alt="" className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Achievement Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((game.achievements.unlocked / game.achievements.total) * 100)}%
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Rarest Achievement</p>
                <p className="text-lg font-bold">The Empress</p>
                <p className="text-xs text-muted-foreground">0.5% of players</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Global Rank</p>
                <p className="text-2xl font-bold">Top 15%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Active Players</p>
                  <p className="font-bold">{communityStats.activePlayers}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-secondary/20 p-2 rounded-lg mr-3">
                  <Star className="text-secondary" size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Average Rating</p>
                  <p className="font-bold">{communityStats.averageRating}/5</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-accent/20 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Positive Reviews</p>
                  <p className="font-bold">{communityStats.positiveReviews}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-4 rounded-xl">
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                  </svg>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Negative Reviews</p>
                  <p className="font-bold">{communityStats.negativeReviews}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {communityStats.popularTags.map((tag) => (
                    <div key={tag} className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                      {tag}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="bg-card border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Friends Playing</h2>
                <div className="space-y-3">
                  {game.friends.map((friend) => (
                    <div key={friend.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          friend.status === "Online"
                            ? "bg-gradient-to-br from-primary to-secondary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {friend.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">{friend.playtime}</p>
                      </div>
                      <div
                        className={`ml-auto w-2 h-2 rounded-full ${
                          friend.status === "Online" ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
