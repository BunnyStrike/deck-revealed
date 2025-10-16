"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, X, Star, Cpu, Play, Download, Plus } from "lucide-react"
import type { GameData } from "@/types/game-data"

interface GameComparisonProps {
  gameIds: string[]
  onBack: () => void
  onRemoveGame: (gameId: string) => void
  onAddGame: () => void
  allGames: GameData[]
}

export function GameComparison({ gameIds, onBack, onRemoveGame, onAddGame, allGames }: GameComparisonProps) {
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [comparisonGames, setComparisonGames] = useState<GameData[]>([])

  // Filter games based on the provided gameIds
  useEffect(() => {
    const games = allGames.filter((game) => gameIds.includes(game.id))
    setComparisonGames(games)
  }, [gameIds, allGames])

  // Sections for comparison
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "performance", label: "Performance" },
    { id: "features", label: "Features" },
    { id: "social", label: "Social" },
  ]

  return (
    <div className="h-full overflow-y-auto pb-8">
      {/* Header */}
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
          <h1 className="text-2xl font-bold gradient-text">Game Comparison</h1>
        </div>

        <div className="flex items-center gap-2">
          {sections.map((section) => (
            <FocusableItem
              key={section.id}
              focusKey={`section-${section.id}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-primary text-white"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </FocusableItem>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Game columns */}
        {comparisonGames.map((game) => (
          <div key={game.id} className="flex flex-col">
            {/* Game header */}
            <div className="relative mb-4">
              <FocusableItem
                focusKey={`remove-${game.id}`}
                className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors z-10"
                onClick={() => onRemoveGame(game.id)}
              >
                <X size={16} />
              </FocusableItem>

              <div className="relative h-48 rounded-xl overflow-hidden">
                <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-xl font-bold">{game.title}</h2>
                  <p className="text-sm text-muted-foreground">{game.developer}</p>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-4">
                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Info</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Release Date</p>
                      <p className="font-medium">{game.releaseDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Publisher</p>
                      <p className="font-medium">{game.publisher}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
                        <span className="font-medium">{game.rating}/5</span>
                        <span className="text-xs text-muted-foreground ml-1">({game.ratingCount})</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Stats</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Playtime</p>
                      <p className="font-medium">{game.totalPlaytime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Played</p>
                      <p className="font-medium">{game.lastPlayed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Achievements</p>
                      <p className="font-medium">
                        {game.achievements.unlocked}/{game.achievements.total}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-2">
                  <FocusableItem
                    focusKey={`play-${game.id}`}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Play size={16} />
                    <span>Play</span>
                  </FocusableItem>

                  {!game.installed && (
                    <FocusableItem
                      focusKey={`install-${game.id}`}
                      className="flex-1 bg-muted/50 hover:bg-muted text-foreground py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <Download size={16} />
                      <span>Install</span>
                    </FocusableItem>
                  )}
                </div>
              </div>
            )}

            {/* Performance Section */}
            {activeSection === "performance" && (
              <div className="space-y-4">
                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">System Requirements</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">CPU</p>
                      <p className="font-medium text-sm">{game.systemRequirements.recommended.cpu}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">GPU</p>
                      <p className="font-medium text-sm">{game.systemRequirements.recommended.gpu}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">RAM</p>
                      <p className="font-medium">{game.systemRequirements.recommended.ram}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="font-medium">{game.systemRequirements.recommended.storage}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Average FPS</p>
                        <p className="text-xs font-medium">75</p>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Loading Time</p>
                        <p className="text-xs font-medium">12s</p>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">GPU Usage</p>
                        <p className="text-xs font-medium">85%</p>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Optimization</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 text-primary mr-1" />
                      <span className="text-sm">Performance Mode</span>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Available</span>
                  </div>
                </Card>
              </div>
            )}

            {/* Features Section */}
            {activeSection === "features" && (
              <div className="space-y-4">
                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-1">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full whitespace-nowrap"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Features</h3>
                  <div className="flex flex-wrap gap-1">
                    {game.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full whitespace-nowrap"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">DLC & Add-ons</h3>
                  <div className="space-y-2">
                    {game.dlc.map((dlc) => (
                      <div key={dlc.id} className="flex items-center justify-between">
                        <p className="text-sm">{dlc.name}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            dlc.installed ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {dlc.installed ? "Installed" : dlc.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Social Section */}
            {activeSection === "social" && (
              <div className="space-y-4">
                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Friends Playing</h3>
                  <div className="space-y-2">
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

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Achievements</h3>
                  <div className="space-y-2">
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(game.achievements.unlocked / game.achievements.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center">
                      <span className="font-medium">{game.achievements.unlocked}</span>
                      <span className="text-muted-foreground">/{game.achievements.total} unlocked</span>
                    </p>
                  </div>
                </Card>

                <Card className="bg-card border-border p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Community</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Player Base</p>
                      <p className="text-xs font-medium">Very Active</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Community Rating</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-secondary fill-secondary mr-0.5" />
                        <span className="text-xs font-medium">{game.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Add game column */}
        {comparisonGames.length < 4 && (
          <FocusableItem
            focusKey="add-game"
            className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl h-48 hover:border-primary/50 transition-colors"
            onClick={onAddGame}
          >
            <Plus className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground font-medium">Add Game</p>
          </FocusableItem>
        )}
      </div>
    </div>
  )
}
