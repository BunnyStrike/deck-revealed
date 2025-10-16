"use client"

import { useState } from "react"
import { Grid, List, Search, Clock, Star, Play, FileUp, Settings, Filter, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { useLegacyGames } from "@/hooks/use-legacy-games"
import type { ROM, EmulatorPlatform } from "@/types/legacy-games"
import { ROMUploader } from "./rom-uploader"
import { ROMDetail } from "./rom-detail"
import { EmulatorManager } from "./emulator-manager"

interface ROMLibraryProps {
  onBack: () => void
  platformFilter?: EmulatorPlatform
}

export function ROMLibrary({ onBack, platformFilter }: ROMLibraryProps) {
  const { roms, platforms, launchROM, updateROM } = useLegacyGames()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "recent">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedROMId, setSelectedROMId] = useState<string | null>(null)
  const [view, setView] = useState<"library" | "detail" | "upload" | "emulators">("library")
  const [error, setError] = useState<string | null>(null)

  // Filter ROMs based on platform, active filter, and search query
  const filteredROMs = roms.filter((rom) => {
    // Platform filter
    if (platformFilter && rom.platform !== platformFilter) {
      return false
    }

    // Active filter
    if (activeFilter === "favorites" && !rom.favorite) {
      return false
    }

    if (activeFilter === "recent" && !rom.lastPlayed) {
      return false
    }

    // Search query
    if (searchQuery && !rom.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  // Sort ROMs by last played (for recent filter) or title
  const sortedROMs = [...filteredROMs].sort((a, b) => {
    if (activeFilter === "recent") {
      const aDate = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0
      const bDate = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0
      return bDate - aDate
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  const handleROMSelect = (romId: string) => {
    setSelectedROMId(romId)
    setView("detail")
  }

  const handleBackToLibrary = () => {
    setSelectedROMId(null)
    setView("library")
  }

  const handleToggleFavorite = (rom: ROM) => {
    updateROM(rom.id, { favorite: !rom.favorite })
  }

  const handleLaunchROM = async (romId: string) => {
    setError(null)
    try {
      await launchROM(romId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch ROM")
    }
  }

  const getPlatformColor = (platformId: EmulatorPlatform) => {
    const platform = platforms.find((p) => p.id === platformId)
    return platform?.color || "#888888"
  }

  const getPlatformName = (platformId: EmulatorPlatform) => {
    const platform = platforms.find((p) => p.id === platformId)
    return platform?.shortName || platformId
  }

  // If in detail view, show the ROM detail
  if (view === "detail" && selectedROMId) {
    const rom = roms.find((r) => r.id === selectedROMId)
    if (!rom) return null

    return <ROMDetail rom={rom} onBack={handleBackToLibrary} />
  }

  // If in upload view, show the ROM uploader
  if (view === "upload") {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="mr-4 p-2 hover:bg-muted rounded-full transition-colors"
            onClick={handleBackToLibrary}
          >
            <ArrowLeft className="w-5 h-5" />
          </FocusableItem>
          <h2 className="text-2xl font-bold">Upload ROMs</h2>
        </div>

        <ROMUploader
          onComplete={(rom) => {
            setSelectedROMId(rom.id)
            setView("detail")
          }}
          defaultPlatform={platformFilter}
        />
      </div>
    )
  }

  // If in emulators view, show the emulator manager
  if (view === "emulators") {
    return <EmulatorManager onBack={handleBackToLibrary} platformFilter={platformFilter} />
  }

  // Otherwise, show the library view
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="mr-4 p-2 hover:bg-muted rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </FocusableItem>
          <h1 className="text-2xl font-bold">
            {platformFilter ? `${getPlatformName(platformFilter)} ROMs` : "ROM Library"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "favorites" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("favorites")}
            >
              Favorites
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeFilter === "recent" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveFilter("recent")}
            >
              Recent
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
              focusKey="upload-roms"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={() => setView("upload")}
            >
              <FileUp className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="manage-emulators"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={() => setView("emulators")}
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>

            <FocusableItem
              focusKey="filter-roms"
              className="p-2 bg-card border border-border hover:bg-muted/30 rounded-lg transition-all"
              onClick={() => {
                /* Open filter dialog */
              }}
            >
              <Filter className="w-5 h-5 text-muted-foreground" />
            </FocusableItem>
          </div>

          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search ROMs"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedROMs.map((rom) => (
            <FocusableItem
              key={rom.id}
              focusKey={`rom-${rom.id}`}
              className="rom-card"
              onClick={() => handleROMSelect(rom.id)}
            >
              <Card className="overflow-hidden bg-card border-border h-full">
                <div className="relative">
                  <img
                    src={rom.coverImage || `/placeholder.svg?height=150&width=300&query=${rom.title} game cover`}
                    alt={rom.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      className={`p-1 rounded-full ${rom.favorite ? "bg-secondary text-white" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-secondary"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(rom)
                      }}
                    >
                      <Star className="w-4 h-4" fill={rom.favorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div
                    className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getPlatformColor(rom.platform)}30`,
                      color: getPlatformColor(rom.platform),
                    }}
                  >
                    {getPlatformName(rom.platform)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{rom.title}</h3>
                  {rom.developer && <p className="text-sm text-muted-foreground">{rom.developer}</p>}

                  <div className="flex justify-between items-center mt-3">
                    {rom.lastPlayed && (
                      <p className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(rom.lastPlayed).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1 rounded-lg font-medium transition-all flex items-center ml-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLaunchROM(rom.id)
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
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
          {sortedROMs.map((rom) => (
            <FocusableItem
              key={rom.id}
              focusKey={`rom-list-${rom.id}`}
              className="hover:bg-card/80 rounded-xl border border-border transition-all"
              onClick={() => handleROMSelect(rom.id)}
            >
              <div className="flex items-center p-3">
                <img
                  src={rom.coverImage || `/placeholder.svg?height=64&width=64&query=${rom.title} game cover`}
                  alt={rom.title}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-bold">{rom.title}</h3>
                    <button
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(rom)
                      }}
                    >
                      <Star
                        className={`w-4 h-4 ${rom.favorite ? "text-secondary" : "text-muted-foreground"}`}
                        fill={rom.favorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  {rom.developer && <p className="text-sm text-muted-foreground">{rom.developer}</p>}
                  <div className="flex items-center mt-1">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium mr-2"
                      style={{
                        backgroundColor: `${getPlatformColor(rom.platform)}30`,
                        color: getPlatformColor(rom.platform),
                      }}
                    >
                      {getPlatformName(rom.platform)}
                    </span>
                    {rom.releaseYear && <span className="text-xs text-muted-foreground">{rom.releaseYear}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {rom.lastPlayed && (
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(rom.lastPlayed).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLaunchROM(rom.id)
                    }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </button>
                </div>
              </div>
            </FocusableItem>
          ))}
        </div>
      )}

      {sortedROMs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No ROMs match your search query."
              : activeFilter === "favorites"
                ? "No favorite ROMs yet. Mark ROMs as favorites to see them here."
                : activeFilter === "recent"
                  ? "No recently played ROMs. Play some ROMs to see them here."
                  : "No ROMs in your library yet."}
          </p>

          <FocusableItem
            focusKey="upload-roms-empty"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center"
            onClick={() => setView("upload")}
          >
            <FileUp className="w-4 h-4 mr-2" />
            Upload ROMs
          </FocusableItem>
        </div>
      )}
    </div>
  )
}
