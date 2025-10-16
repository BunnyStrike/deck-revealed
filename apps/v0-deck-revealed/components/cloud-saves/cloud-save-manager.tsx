"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  Cloud,
  Download,
  Upload,
  Clock,
  Settings,
  AlertTriangle,
  Check,
  RefreshCw,
  HardDrive,
  Search,
  Trash2,
  Save,
} from "lucide-react"
import { useCloudSaves } from "@/hooks/use-cloud-saves"
import type { SaveFile } from "@/types/cloud-save"
import { CloudSaveSettings } from "@/components/cloud-saves/cloud-save-settings"
import { SaveDetail } from "@/components/cloud-saves/save-detail"
import { formatBytes, formatDate, formatPlayTime } from "@/lib/utils"

interface CloudSaveManagerProps {
  onBack: () => void
}

export function CloudSaveManager({ onBack }: CloudSaveManagerProps) {
  const { saveFiles, stats, isLoading, error, syncSave, syncAllSaves, createBackup, deleteSave, resolveConflict } =
    useCloudSaves()

  const [activeView, setActiveView] = useState<"list" | "detail" | "settings">("list")
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "synced" | "local-only" | "cloud-only" | "conflict">("all")
  const [filterGame, setFilterGame] = useState<string | null>(null)

  // Get the selected save file
  const selectedSave = selectedSaveId ? saveFiles.find((save) => save.id === selectedSaveId) : null

  // Filter save files based on search and filters
  const filteredSaves = saveFiles.filter((save) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      save.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      save.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      save.fileName.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = filterStatus === "all" || save.syncStatus === filterStatus

    // Game filter
    const matchesGame = filterGame === null || save.gameId === filterGame

    return matchesSearch && matchesStatus && matchesGame
  })

  // Get unique games from save files
  const games = Array.from(new Set(saveFiles.map((save) => save.gameId)))

  // Handle view save detail
  const handleViewSaveDetail = (saveId: string) => {
    setSelectedSaveId(saveId)
    setActiveView("detail")
  }

  // Handle back to list
  const handleBackToList = () => {
    setActiveView("list")
    setSelectedSaveId(null)
  }

  // Handle sync all
  const handleSyncAll = () => {
    syncAllSaves()
  }

  // Get status icon
  const getStatusIcon = (status: SaveFile["syncStatus"]) => {
    switch (status) {
      case "synced":
        return <Check className="w-4 h-4 text-green-500" />
      case "local-only":
        return <Upload className="w-4 h-4 text-primary" />
      case "cloud-only":
        return <Download className="w-4 h-4 text-primary" />
      case "conflict":
        return <AlertTriangle className="w-4 h-4 text-secondary" />
      default:
        return null
    }
  }

  // Get status text
  const getStatusText = (status: SaveFile["syncStatus"]) => {
    switch (status) {
      case "synced":
        return "Synced"
      case "local-only":
        return "Local Only"
      case "cloud-only":
        return "Cloud Only"
      case "conflict":
        return "Conflict"
      default:
        return ""
    }
  }

  // Render settings view
  if (activeView === "settings") {
    return <CloudSaveSettings onBack={handleBackToList} />
  }

  // Render save detail view
  if (activeView === "detail" && selectedSave) {
    return <SaveDetail save={selectedSave} onBack={handleBackToList} />
  }

  // Render save list view
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
          <h1 className="text-2xl font-bold gradient-text">Cloud Save Manager</h1>
        </div>

        <div className="flex items-center gap-2">
          <FocusableItem
            focusKey="sync-all"
            className={`p-2 rounded-lg transition-colors ${
              isLoading
                ? "bg-primary/20 text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            onClick={handleSyncAll}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </FocusableItem>

          <FocusableItem
            focusKey="settings"
            className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            onClick={() => setActiveView("settings")}
          >
            <Settings className="w-5 h-5" />
          </FocusableItem>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="bg-card border-border p-4 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Save className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Saves</p>
              <p className="font-bold">{stats.totalSaves}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <HardDrive className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Cloud Usage</p>
              <p className="font-bold">
                {formatBytes(stats.cloudUsage)} / {formatBytes(stats.cloudLimit)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last Sync</p>
              <p className="font-bold">{formatDate(stats.lastSyncTime)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${stats.syncErrors > 0 ? "bg-secondary/20" : "bg-green-500/20"}`}>
              {stats.syncErrors > 0 ? (
                <AlertTriangle className="text-secondary" size={20} />
              ) : (
                <Check className="text-green-500" size={20} />
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Sync Status</p>
              <p className="font-bold">
                {stats.syncErrors > 0 ? `${stats.syncErrors} Error${stats.syncErrors > 1 ? "s" : ""}` : "All Synced"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search saves..."
            className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="synced">Synced</option>
          <option value="local-only">Local Only</option>
          <option value="cloud-only">Cloud Only</option>
          <option value="conflict">Conflicts</option>
        </select>

        <select
          className="bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={filterGame || ""}
          onChange={(e) => setFilterGame(e.target.value || null)}
        >
          <option value="">All Games</option>
          {games.map((gameId) => (
            <option key={gameId} value={gameId}>
              {gameId === "game1" ? "Cyberpunk 2077" : gameId === "game2" ? "Elden Ring" : "Hades"}
            </option>
          ))}
        </select>
      </div>

      {/* Save Files List */}
      {filteredSaves.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No save files found matching your criteria.</p>
          <button
            className="text-primary hover:text-primary/80 font-medium"
            onClick={() => {
              setSearchQuery("")
              setFilterStatus("all")
              setFilterGame(null)
            }}
          >
            Clear filters and try again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSaves.map((save) => (
            <FocusableItem
              key={save.id}
              focusKey={`save-${save.id}`}
              className="hover:bg-card/80 rounded-xl border border-border transition-all"
              onClick={() => handleViewSaveDetail(save.id)}
            >
              <div className="flex items-center p-4">
                <div className="relative mr-4">
                  <img
                    src={save.thumbnail || "/placeholder.svg?height=64&width=64&query=game save"}
                    alt={save.displayName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div
                    className={`absolute -top-2 -right-2 p-1 rounded-full ${
                      save.syncStatus === "synced"
                        ? "bg-green-500"
                        : save.syncStatus === "conflict"
                          ? "bg-secondary"
                          : "bg-primary"
                    }`}
                  >
                    {save.syncStatus === "synced" ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : save.syncStatus === "local-only" ? (
                      <Upload className="w-3 h-3 text-white" />
                    ) : save.syncStatus === "cloud-only" ? (
                      <Download className="w-3 h-3 text-white" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-bold">{save.displayName}</h3>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        save.syncStatus === "synced"
                          ? "bg-green-500/20 text-green-500"
                          : save.syncStatus === "conflict"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-primary/20 text-primary"
                      }`}
                    >
                      {getStatusText(save.syncStatus)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{save.description || save.fileName}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatPlayTime(save.playTime)}
                    </span>
                    <span>•</span>
                    <span>
                      {save.gameId === "game1" ? "Cyberpunk 2077" : save.gameId === "game2" ? "Elden Ring" : "Hades"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(save.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">{formatBytes(save.size)}</div>

                  <div className="flex gap-2">
                    {save.syncStatus !== "synced" && (
                      <button
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          syncSave(save.id)
                        }}
                      >
                        <Cloud className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      className="text-primary hover:text-primary/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        createBackup(save.id)
                      }}
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      className="text-secondary hover:text-secondary/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Are you sure you want to delete this save file?")) {
                          deleteSave(save.id)
                        }
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </FocusableItem>
          ))}
        </div>
      )}
    </div>
  )
}
