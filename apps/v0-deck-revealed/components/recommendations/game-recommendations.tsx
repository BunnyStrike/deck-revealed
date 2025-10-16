"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star, Clock, Filter, RefreshCw } from "lucide-react"
import type { GameData } from "@/types/game-data"

interface GameRecommendationsProps {
  games: GameData[]
  onBack: () => void
  onSelectGame: (gameId: string) => void
}

export function GameRecommendations({ games, onBack, onSelectGame }: GameRecommendationsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)

  // Filter types
  const filterTypes = [
    { id: "all", label: "All" },
    { id: "similar", label: "Similar Games" },
    { id: "popular", label: "Popular Now" },
    { id: "new", label: "New Releases" },
    { id: "personalized", label: "For You" },
  ]

  // Mock refreshing recommendations
  const handleRefreshRecommendations = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  // Get recommendation reason based on game
  const getRecommendationReason = (game: GameData): string => {
    const reasons = [
      `Because you played games in the ${game.genres[0]} genre`,
      `Similar to games in your library`,
      `Popular among your friends`,
      `Matches your play style`,
      `Highly rated by players like you`,
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
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
          <h1 className="text-2xl font-bold gradient-text">Recommended Games</h1>
        </div>

        <div className="flex items-center gap-2">
          <FocusableItem
            focusKey="refresh-recommendations"
            className={`p-2 rounded-lg transition-colors ${
              refreshing
                ? "bg-primary/20 text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            onClick={handleRefreshRecommendations}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </FocusableItem>

          <FocusableItem
            focusKey="filter-recommendations"
            className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Filter className="w-5 h-5" />
          </FocusableItem>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {filterTypes.map((filter) => (
          <FocusableItem
            key={filter.id}
            focusKey={`filter-${filter.id}`}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-primary text-white"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </FocusableItem>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <FocusableItem
            key={game.id}
            focusKey={`recommendation-${game.id}`}
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <Card className="overflow-hidden bg-card border-border h-full">
              <div className="relative">
                <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-bold text-lg">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.developer}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-3">{getRecommendationReason(game)}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
                    <span className="text-sm font-medium">{game.rating}/5</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{game.statistics.averagePlaytime} avg</span>
                  </div>
                </div>
              </div>
            </Card>
          </FocusableItem>
        ))}
      </div>
    </div>
  )
}
