"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Search, ChevronLeft, Check } from "lucide-react"
import type { GameData } from "@/types/game-data"

interface GameSelectorProps {
  games: GameData[]
  selectedGameIds: string[]
  onSelectGame: (gameId: string) => void
  onBack: () => void
  onConfirm: () => void
}

export function GameSelector({ games, selectedGameIds, onSelectGame, onBack, onConfirm }: GameSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter games based on search query
  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

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
          <h1 className="text-2xl font-bold gradient-text">Select Games to Compare</h1>
        </div>

        <FocusableItem
          focusKey="confirm-selection"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedGameIds.length >= 2
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted/50 text-muted-foreground cursor-not-allowed"
          }`}
          onClick={selectedGameIds.length >= 2 ? onConfirm : undefined}
        >
          Compare {selectedGameIds.length > 0 ? `(${selectedGameIds.length})` : ""}
        </FocusableItem>
      </div>

      <div className="relative max-w-md w-full mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search games..."
          className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => {
          const isSelected = selectedGameIds.includes(game.id)
          return (
            <FocusableItem
              key={game.id}
              focusKey={`select-game-${game.id}`}
              className={`game-card ${isSelected ? "ring-2 ring-primary" : ""}`}
              onClick={() => onSelectGame(game.id)}
            >
              <Card className="overflow-hidden bg-card border-border h-full relative">
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 bg-primary rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="relative">
                  <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.developer}</p>
                  </div>
                </div>
              </Card>
            </FocusableItem>
          )
        })}
      </div>
    </div>
  )
}
