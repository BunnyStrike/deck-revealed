"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Search, Filter, X, Check, ChevronDown, Star } from "lucide-react"
import type { GameData } from "@/types/game-data"

interface AdvancedSearchProps {
  games: GameData[]
  onBack: () => void
  onSelectGame: (gameId: string) => void
}

export function AdvancedSearch({ games, onBack, onSelectGame }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique genres, features, and platforms
  const allGenres = Array.from(new Set(games.flatMap((game) => game.genres)))
  const allFeatures = Array.from(new Set(games.flatMap((game) => game.features)))
  const allPlatforms = Array.from(new Set(games.flatMap((game) => game.platforms)))

  // Filter games based on search query and filters
  const filteredGames = games.filter((game) => {
    // Search query filter
    const matchesQuery =
      searchQuery === "" ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase()))

    // Genre filter
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some((genre) => game.genres.includes(genre))

    // Feature filter
    const matchesFeature =
      selectedFeatures.length === 0 || selectedFeatures.some((feature) => game.features.includes(feature))

    // Platform filter
    const matchesPlatform =
      selectedPlatforms.length === 0 || selectedPlatforms.some((platform) => game.platforms.includes(platform))

    // Rating filter
    const matchesRating = ratingFilter === null || game.rating >= ratingFilter

    return matchesQuery && matchesGenre && matchesFeature && matchesPlatform && matchesRating
  })

  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedFeatures([])
    setSelectedPlatforms([])
    setRatingFilter(null)
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
          <h1 className="text-2xl font-bold gradient-text">Advanced Search</h1>
        </div>

        <div className="flex items-center gap-2">
          <FocusableItem
            focusKey="toggle-filters"
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-primary text-white"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </FocusableItem>
        </div>
      </div>

      <div className="relative max-w-3xl w-full mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search by title, developer, publisher, or genre..."
          className="w-full bg-card border border-border text-foreground rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <Card className="bg-card border-border p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <span>Genres</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allGenres.map((genre) => (
                  <FocusableItem
                    key={genre}
                    focusKey={`genre-${genre}`}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      selectedGenres.includes(genre) ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    <span>{genre}</span>
                    {selectedGenres.includes(genre) && <Check className="w-4 h-4" />}
                  </FocusableItem>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <span>Features</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allFeatures.map((feature) => (
                  <FocusableItem
                    key={feature}
                    focusKey={`feature-${feature}`}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      selectedFeatures.includes(feature) ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => toggleFeature(feature)}
                  >
                    <span>{feature}</span>
                    {selectedFeatures.includes(feature) && <Check className="w-4 h-4" />}
                  </FocusableItem>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <span>Platforms</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allPlatforms.map((platform) => (
                  <FocusableItem
                    key={platform}
                    focusKey={`platform-${platform}`}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      selectedPlatforms.includes(platform) ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => togglePlatform(platform)}
                  >
                    <span>{platform}</span>
                    {selectedPlatforms.includes(platform) && <Check className="w-4 h-4" />}
                  </FocusableItem>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <FocusableItem
                  key={rating}
                  focusKey={`rating-${rating}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    ratingFilter === rating ? "bg-primary text-white" : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  onClick={() => setRatingFilter(rating === ratingFilter ? null : rating)}
                >
                  {rating}
                </FocusableItem>
              ))}
              {ratingFilter !== null && (
                <button
                  className="text-muted-foreground hover:text-foreground ml-2"
                  onClick={() => setRatingFilter(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="mb-4">
        <p className="text-muted-foreground">
          {filteredGames.length} {filteredGames.length === 1 ? "result" : "results"} found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <FocusableItem
            key={game.id}
            focusKey={`search-result-${game.id}`}
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <Card className="overflow-hidden bg-card border-border h-full">
              <div className="relative">
                <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="bg-card/80 backdrop-blur-sm p-1 rounded-full">
                    <Star className="w-4 h-4 text-secondary" fill="currentColor" />
                    <span className="sr-only">{game.rating} stars</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.developer}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {game.genres.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                    <span className="text-xs font-medium">{game.rating}/5</span>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1 rounded-lg font-medium transition-all">
                    View
                  </button>
                </div>
              </div>
            </Card>
          </FocusableItem>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No games found matching your criteria.</p>
          <button className="text-primary hover:text-primary/80 font-medium" onClick={clearFilters}>
            Clear filters and try again
          </button>
        </div>
      )}
    </div>
  )
}
