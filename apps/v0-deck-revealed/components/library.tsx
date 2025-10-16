"use client"

import { useState } from "react"
import {
  Grid,
  List,
  Search,
  Clock,
  Star,
  BarChart2,
  FileText,
  Palette,
  Cloud,
  Trophy,
  Newspaper,
  Cpu,
} from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { GameDetail } from "@/components/game-detail"
import { GameComparison } from "@/components/game-comparison"
import { GameSelector } from "@/components/game-selector"
import { GameNotes } from "@/components/notes/game-notes"
import { GameStatistics } from "@/components/statistics/game-statistics"
import { GameRecommendations } from "@/components/recommendations/game-recommendations"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { ThemeManager } from "@/components/theme/theme-manager"
import { CloudSaveManager } from "@/components/cloud-saves/cloud-save-manager"
import { ChallengeHub } from "@/components/challenges/challenge-hub"
import { NewsModule } from "@/components/news/news-module"
import { LegacyGames } from "@/components/legacy-games/legacy-games"
import type { GameData } from "@/types/game-data"

// Sample game data
const sampleGames: GameData[] = [
  {
    id: "game1",
    title: "Cyberpunk 2077",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: "December 10, 2020",
    lastPlayed: "2 hours ago",
    totalPlaytime: "42 hours",
    description:
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Improved and featuring all-new free additional content, customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades. The relationships you forge and the choices you make will shape the story and the world around you. Legends are made here. What will yours be?",
    genres: ["RPG", "Open World", "Action", "Sci-Fi", "FPS"],
    features: ["Single-player", "Controller Support", "Cloud Saves", "Achievements"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
    image: "/neon-cityscape.png",
    headerImage: "/cyberpunk-header.png",
    screenshots: [
      "/cyberpunk-screenshot-1.png",
      "/cyberpunk-screenshot-2.png",
      "/cyberpunk-screenshot-3.png",
      "/cyberpunk-screenshot-4.png",
    ],
    videos: [
      {
        id: "video1",
        title: "Official Trailer",
        thumbnail: "/cyberpunk-trailer-thumbnail.png",
        duration: "2:45",
      },
      {
        id: "video2",
        title: "Gameplay Walkthrough",
        thumbnail: "/cyberpunk-gameplay-thumbnail.png",
        duration: "15:20",
      },
    ],
    rating: 4.2,
    ratingCount: 125632,
    statistics: {
      averagePlaytime: "35 hours",
      completionRate: 68,
      popularityRank: 12,
      difficultyRating: 7,
      replayValue: 8,
    },
    achievements: {
      total: 44,
      unlocked: 16,
      recent: [
        {
          id: "ach1",
          name: "The Wheel of Fortune",
          description: "Complete a job for a fixer",
          date: "2 days ago",
          icon: "/achievement-icon-1.png",
        },
        {
          id: "ach2",
          name: "The Fool",
          description: "Complete all gigs and NCPD Scanner Hustles in Watson",
          date: "1 week ago",
          icon: "/achievement-icon-2.png",
        },
      ],
    },
    friends: [
      { id: "friend1", name: "Alex", status: "Online", playtime: "120h", avatar: "A" },
      { id: "friend2", name: "Jordan", status: "Online", playtime: "85h", avatar: "J" },
      { id: "friend3", name: "Taylor", status: "Offline", playtime: "65h", avatar: "T" },
    ],
    dlc: [
      { id: "dlc1", name: "Phantom Liberty", price: "$29.99", image: "/cyberpunk-dlc-1.png", installed: true },
      { id: "dlc2", name: "Ultimate Cosmetics Pack", price: "$9.99", image: "/cyberpunk-dlc-2.png", installed: false },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i5-3570K or AMD FX-8310",
        gpu: "NVIDIA GeForce GTX 970 or AMD Radeon RX 470",
        ram: "8 GB",
        storage: "70 GB SSD",
      },
      recommended: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
        gpu: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 590",
        ram: "12 GB",
        storage: "70 GB SSD",
      },
    },
  },
  {
    id: "game2",
    title: "Elden Ring",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: "February 25, 2022",
    lastPlayed: "Yesterday",
    totalPlaytime: "78 hours",
    description:
      "Elden Ring is an action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring. The game is played from a third-person perspective, with players freely roaming its interactive open world. Gameplay elements include combat featuring various types of weapons and magic spells, horseback riding, summons, and crafting.",
    genres: ["RPG", "Souls-like", "Fantasy", "Open World", "Action"],
    features: ["Single-player", "Co-op", "Controller Support", "Cloud Saves", "Achievements"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
    image: "/enchanted-forest-quest.png",
    headerImage: "/elden-ring-header.png",
    screenshots: ["/elden-ring-screenshot-1.png", "/elden-ring-screenshot-2.png", "/elden-ring-screenshot-3.png"],
    videos: [
      {
        id: "video1",
        title: "Official Trailer",
        thumbnail: "/elden-ring-trailer-thumbnail.png",
        duration: "3:15",
      },
    ],
    rating: 4.8,
    ratingCount: 203456,
    statistics: {
      averagePlaytime: "70 hours",
      completionRate: 42,
      popularityRank: 3,
      difficultyRating: 9,
      replayValue: 9,
    },
    achievements: {
      total: 42,
      unlocked: 28,
      recent: [
        {
          id: "ach1",
          name: "Lord of Frenzied Flame",
          description: "Achieved the frenzied flame ending",
          date: "3 days ago",
          icon: "/achievement-icon-1.png",
        },
      ],
    },
    friends: [
      { id: "friend1", name: "Alex", status: "Online", playtime: "150h", avatar: "A" },
      { id: "friend2", name: "Jordan", status: "Online", playtime: "95h", avatar: "J" },
      { id: "friend4", name: "Morgan", status: "Offline", playtime: "120h", avatar: "M" },
    ],
    dlc: [
      { id: "dlc1", name: "Shadow of the Erdtree", price: "$39.99", image: "/elden-ring-dlc-1.png", installed: true },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i5-8400 or AMD Ryzen 3 3300X",
        gpu: "NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB",
        ram: "12 GB",
        storage: "60 GB SSD",
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
        gpu: "NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX Vega 56 8GB",
        ram: "16 GB",
        storage: "60 GB SSD",
      },
    },
  },
  {
    id: "game3",
    title: "Hades",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "September 17, 2020",
    lastPlayed: "3 days ago",
    totalPlaytime: "35 hours",
    description:
      "Hades is a roguelike action dungeon crawler in which you defy the god of the dead as you hack and slash your way out of the Underworld of Greek myth. It combines the best aspects of Supergiant's critically acclaimed titles, including the fast-paced action of Bastion, the rich atmosphere and depth of Transistor, and the character-driven storytelling of Pyre.",
    genres: ["Roguelike", "Action", "Indie", "Dungeon Crawler", "Isometric"],
    features: ["Single-player", "Controller Support", "Cloud Saves", "Achievements"],
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
    image: "/dungeon-crawler-scene.png",
    headerImage: "/hades-header.png",
    screenshots: ["/hades-screenshot-1.png", "/hades-screenshot-2.png", "/hades-screenshot-3.png"],
    videos: [
      {
        id: "video1",
        title: "Official Trailer",
        thumbnail: "/hades-trailer-thumbnail.png",
        duration: "1:45",
      },
    ],
    rating: 4.9,
    ratingCount: 178932,
    statistics: {
      averagePlaytime: "25 hours",
      completionRate: 65,
      popularityRank: 8,
      difficultyRating: 7,
      replayValue: 10,
    },
    achievements: {
      total: 49,
      unlocked: 32,
      recent: [
        {
          id: "ach1",
          name: "Skelly's Pal",
          description: "Max out your relationship with Skelly",
          date: "1 week ago",
          icon: "/achievement-icon-1.png",
        },
      ],
    },
    friends: [
      { id: "friend2", name: "Jordan", status: "Online", playtime: "45h", avatar: "J" },
      { id: "friend3", name: "Taylor", status: "Offline", playtime: "28h", avatar: "T" },
    ],
    dlc: [],
    systemRequirements: {
      minimum: {
        os: "Windows 7 SP1",
        cpu: "Dual Core 2.4 GHz",
        gpu: "1GB VRAM / DirectX 10+ support",
        ram: "4 GB",
        storage: "15 GB",
      },
      recommended: {
        os: "Windows 7 SP1",
        cpu: "Dual Core 3.0 GHz+",
        gpu: "2GB VRAM / DirectX 10+ support",
        ram: "8 GB",
        storage: "20 GB",
      },
    },
  },
]

export default function Library() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [view, setView] = useState<
    | "library"
    | "detail"
    | "comparison"
    | "selector"
    | "notes"
    | "statistics"
    | "recommendations"
    | "search"
    | "themes"
    | "cloud-saves"
    | "challenges"
    | "news"
    | "legacy-games"
  >("library")
  const [comparisonGameIds, setComparisonGameIds] = useState<string[]>([])

  // Filter games based on active filter
  const filteredGames = sampleGames.filter((game) => {
    if (activeFilter === "all") return true
    if (activeFilter === "installed") return true // In a real app, this would check if the game is installed
    if (activeFilter === "favorites") return true // In a real app, this would check if the game is a favorite
    return true
  })

  // Handle game selection
  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId)
    setView("detail")
  }

  // Handle back to library
  const handleBackToLibrary = () => {
    setSelectedGameId(null)
    setView("library")
  }

  // Start comparison mode
  const handleStartComparison = () => {
    setComparisonGameIds([])
    setView("selector")
  }

  // Toggle game selection for comparison
  const handleToggleGameForComparison = (gameId: string) => {
    if (comparisonGameIds.includes(gameId)) {
      setComparisonGameIds(comparisonGameIds.filter((id) => id !== gameId))
    } else {
      if (comparisonGameIds.length < 4) {
        setComparisonGameIds([...comparisonGameIds, gameId])
      }
    }
  }

  // Confirm game selection and go to comparison view
  const handleConfirmSelection = () => {
    if (comparisonGameIds.length >= 2) {
      setView("comparison")
    }
  }

  // Remove a game from comparison
  const handleRemoveGameFromComparison = (gameId: string) => {
    setComparisonGameIds(comparisonGameIds.filter((id) => id !== gameId))
    if (comparisonGameIds.length <= 1) {
      setView("selector")
    }
  }

  // Add a game to comparison (from comparison view)
  const handleAddGameToComparison = () => {
    setView("selector")
  }

  // Open game notes
  const handleOpenNotes = (gameId: string) => {
    setSelectedGameId(gameId)
    setView("notes")
  }

  // Open game statistics
  const handleOpenStatistics = (gameId: string) => {
    setSelectedGameId(gameId)
    setView("statistics")
  }

  // Open recommendations
  const handleOpenRecommendations = () => {
    setView("recommendations")
  }

  // Open advanced search
  const handleOpenSearch = () => {
    setView("search")
  }

  // Open theme manager
  const handleOpenThemeManager = () => {
    setView("themes")
  }

  // Open cloud saves
  const handleOpenCloudSaves = () => {
    setView("cloud-saves")
  }

  // Open challenge hub
  const handleOpenChallengeHub = () => {
    setView("challenges")
  }

  // Open news module
  const handleOpenNews = () => {
    setView("news")
  }

  // Open legacy games
  const handleOpenLegacyGames = () => {
    setView("legacy-games")
  }

  // If in detail view, show the game detail
  if (view === "detail" && selectedGameId) {
    const game = sampleGames.find((g) => g.id === selectedGameId)
    if (!game) return null

    return <GameDetail gameId={selectedGameId} onBack={handleBackToLibrary} />
  }

  // If in comparison view, show the game comparison
  if (view === "comparison") {
    return (
      <GameComparison
        gameIds={comparisonGameIds}
        onBack={handleBackToLibrary}
        onRemoveGame={handleRemoveGameFromComparison}
        onAddGame={handleAddGameToComparison}
        allGames={sampleGames}
      />
    )
  }

  // If in selector view, show the game selector
  if (view === "selector") {
    return (
      <GameSelector
        games={sampleGames}
        selectedGameIds={comparisonGameIds}
        onSelectGame={handleToggleGameForComparison}
        onBack={handleBackToLibrary}
        onConfirm={handleConfirmSelection}
      />
    )
  }

  // If in notes view, show the game notes
  if (view === "notes" && selectedGameId) {
    return <GameNotes gameId={selectedGameId} onBack={handleBackToLibrary} />
  }

  // If in statistics view, show the game statistics
  if (view === "statistics" && selectedGameId) {
    const game = sampleGames.find((g) => g.id === selectedGameId)
    if (!game) return null

    return <GameStatistics game={game} onBack={handleBackToLibrary} />
  }

  // If in recommendations view, show the game recommendations
  if (view === "recommendations") {
    return <GameRecommendations games={sampleGames} onBack={handleBackToLibrary} onSelectGame={handleGameSelect} />
  }

  // If in search view, show the advanced search
  if (view === "search") {
    return <AdvancedSearch games={sampleGames} onBack={handleBackToLibrary} onSelectGame={handleGameSelect} />
  }

  // If in themes view, show the theme manager
  if (view === "themes") {
    return <ThemeManager onBack={handleBackToLibrary} />
  }

  // If in cloud-saves view, show the CloudSaveManager
  if (view === "cloud-saves") {
    return <CloudSaveManager onBack={handleBackToLibrary} />
  }

  // If in challenges view, show the challenge hub
  if (view === "challenges") {
    return <ChallengeHub onBack={handleBackToLibrary} />
  }

  // If in news view, show the news module
  if (view === "news") {
    return <NewsModule userGames={sampleGames.map((game) => game.id)} onBack={handleBackToLibrary} />
  }

  // If in legacy-games view, show the legacy games module
  if (view === "legacy-games") {
    return <LegacyGames onBack={handleBackToLibrary} />
  }

  // Otherwise, show the library view
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Game Library</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "installed" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("installed")}
            >
              Installed
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "favorites" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("favorites")}
            >
              Favorites
            </button>
          </div>

          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <FocusableItem
              focusKey="view-grid"
              className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-5 h-5" />
            </FocusableItem>

            <FocusableItem
              focusKey="view-list"
              className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </FocusableItem>
          </div>

          <div className="flex gap-1">
            <FocusableItem
              focusKey="compare-games"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleStartComparison}
            >
              <BarChart2 className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="recommendations"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenRecommendations}
            >
              <Star className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="theme-manager"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenThemeManager}
            >
              <Palette className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="cloud-saves"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenCloudSaves}
            >
              <Cloud className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="challenge-hub"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenChallengeHub}
            >
              <Trophy className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="news-feed"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenNews}
            >
              <Newspaper className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="legacy-games"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={handleOpenLegacyGames}
            >
              <Cpu className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>
          </div>

          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search library"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onClick={handleOpenSearch}
            />
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game) => (
            <FocusableItem
              key={game.id}
              focusKey={`game-${game.id}`}
              className="game-card"
              onClick={() => handleGameSelect(game.id)}
            >
              <Card className="overflow-hidden bg-card border-border h-full">
                <div className="relative">
                  <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-40 object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="bg-card/80 backdrop-blur-sm p-1 rounded-full">
                      <Star className="w-4 h-4 text-secondary" fill="currentColor" />
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
                    <div className="flex gap-2">
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenNotes(game.id)
                        }}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenStatistics(game.id)
                        }}
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1 rounded-lg font-medium transition-all">
                      Play
                    </button>
                  </div>
                </div>
              </Card>
            </FocusableItem>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredGames.map((game) => (
            <FocusableItem
              key={game.id}
              focusKey={`game-list-${game.id}`}
              className="hover:bg-card/80 rounded-xl border border-border transition-all"
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="flex items-center p-3">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-bold">{game.title}</h3>
                    <Star className="w-4 h-4 text-secondary ml-2" fill="currentColor" />
                  </div>
                  <p className="text-sm text-muted-foreground">{game.developer}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.genres.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {game.genres.length > 2 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        +{game.genres.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenNotes(game.id)
                      }}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenStatistics(game.id)
                      }}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="w-3 h-3 inline mr-1" /> {game.lastPlayed}
                  </p>
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    Play
                  </button>
                </div>
              </div>
            </FocusableItem>
          ))}
        </div>
      )}
    </div>
  )
}
