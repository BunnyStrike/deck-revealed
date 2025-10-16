"use client"

import { useState } from "react"
import { ArrowLeft, Play, Star, Clock, Calendar, Download, Edit, Trash2, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { useLegacyGames } from "@/hooks/use-legacy-games"
import type { ROM } from "@/types/legacy-games"

interface ROMDetailProps {
  rom: ROM
  onBack: () => void
}

export function ROMDetail({ rom, onBack }: ROMDetailProps) {
  const { emulators, platforms, updateROM, removeROM, launchROM } = useLegacyGames()
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedROM, setEditedROM] = useState(rom)

  const platform = platforms.find((p) => p.id === rom.platform)
  const emulator = rom.emulatorId ? emulators.find((e) => e.id === rom.emulatorId) : null

  const handleLaunch = async () => {
    setError(null)
    try {
      await launchROM(rom.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch ROM")
    }
  }

  const handleToggleFavorite = () => {
    updateROM(rom.id, { favorite: !rom.favorite })
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${rom.title}?`)) {
      try {
        await removeROM(rom.id)
        onBack()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete ROM")
      }
    }
  }

  const handleSaveEdit = async () => {
    try {
      await updateROM(rom.id, editedROM)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ROM")
    }
  }

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="mr-4 p-2 hover:bg-muted rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </FocusableItem>

          {isEditing ? (
            <input
              type="text"
              className="text-2xl font-bold bg-transparent border-b border-primary focus:outline-none focus:ring-0 w-full"
              value={editedROM.title}
              onChange={(e) => setEditedROM({ ...editedROM, title: e.target.value })}
            />
          ) : (
            <h1 className="text-2xl font-bold">{rom.title}</h1>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <FocusableItem
                focusKey="cancel-edit"
                className="bg-muted hover:bg-muted/80 text-foreground px-3 py-1 rounded-lg text-sm font-medium transition-all"
                onClick={() => {
                  setIsEditing(false)
                  setEditedROM(rom)
                }}
              >
                Cancel
              </FocusableItem>
              <FocusableItem
                focusKey="save-edit"
                className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                onClick={handleSaveEdit}
              >
                Save
              </FocusableItem>
            </>
          ) : (
            <>
              <FocusableItem
                focusKey="toggle-favorite"
                className={`p-2 rounded-full ${rom.favorite ? "bg-secondary text-white" : "bg-muted text-muted-foreground hover:text-secondary"}`}
                onClick={handleToggleFavorite}
              >
                <Star className="w-5 h-5" fill={rom.favorite ? "currentColor" : "none"} />
              </FocusableItem>
              <FocusableItem
                focusKey="edit-rom"
                className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-5 h-5" />
              </FocusableItem>
              <FocusableItem
                focusKey="delete-rom"
                className="p-2 bg-muted rounded-full text-muted-foreground hover:text-red-500 transition-colors"
                onClick={handleDelete}
              >
                <Trash2 className="w-5 h-5" />
              </FocusableItem>
            </>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <img
              src={rom.coverImage || `/placeholder.svg?height=300&width=600&query=${rom.title} game cover`}
              alt={rom.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              {isEditing ? (
                <textarea
                  className="w-full h-32 p-3 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={editedROM.description || ""}
                  onChange={(e) => setEditedROM({ ...editedROM, description: e.target.value })}
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-muted-foreground">{rom.description || "No description available."}</p>
              )}

              {isEditing && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Developer</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={editedROM.developer || ""}
                      onChange={(e) => setEditedROM({ ...editedROM, developer: e.target.value })}
                      placeholder="Developer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Publisher</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={editedROM.publisher || ""}
                      onChange={(e) => setEditedROM({ ...editedROM, publisher: e.target.value })}
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Release Year</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={editedROM.releaseYear || ""}
                      onChange={(e) =>
                        setEditedROM({ ...editedROM, releaseYear: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="Release year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Genre</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={editedROM.genre?.join(", ") || ""}
                      onChange={(e) =>
                        setEditedROM({
                          ...editedROM,
                          genre: e.target.value
                            .split(",")
                            .map((g) => g.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Genres (comma separated)"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Game Information</h3>
              <div className="space-y-2">
                {rom.developer && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Developer</span>
                    <span>{rom.developer}</span>
                  </div>
                )}

                {rom.publisher && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher</span>
                    <span>{rom.publisher}</span>
                  </div>
                )}

                {rom.releaseYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Year</span>
                    <span>{rom.releaseYear}</span>
                  </div>
                )}

                {rom.genre && rom.genre.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genre</span>
                    <span>{rom.genre.join(", ")}</span>
                  </div>
                )}

                {rom.region && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Region</span>
                    <span>{rom.region}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">File Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name</span>
                  <span className="text-sm truncate max-w-[200px]">{rom.fileName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size</span>
                  <span>{(rom.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <span>{platform?.name || rom.platform}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Added</span>
                  <span>{new Date(rom.dateAdded).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emulator</span>
                  <span>{emulator?.name || "Not set"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Play</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {rom.playTime > 0 ? `Played for ${formatPlayTime(rom.playTime)}` : "Never played"}
                  </span>
                </div>

                {rom.lastPlayed && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{new Date(rom.lastPlayed).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <FocusableItem
                focusKey="launch-rom"
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                onClick={handleLaunch}
              >
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </FocusableItem>

              {!emulator && (
                <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-md">
                  No emulator selected. Please configure an emulator for this ROM.
                </div>
              )}

              {emulator && !emulator.isInstalled && (
                <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-md flex items-start">
                  <Download className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Emulator {emulator.name} is not installed. Please install it before playing.</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Emulator Settings</h3>

            {isEditing ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Select Emulator</label>
                <select
                  className="w-full p-2 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={editedROM.emulatorId || ""}
                  onChange={(e) => setEditedROM({ ...editedROM, emulatorId: e.target.value || undefined })}
                >
                  <option value="">-- Select Emulator --</option>
                  {emulators
                    .filter((e) => e.platform === rom.platform)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} {e.isInstalled ? "" : "(Not Installed)"}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                {emulator ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center mr-2">
                        <img
                          src={emulator.icon || `/placeholder.svg?height=32&width=32&query=emulator icon`}
                          alt={emulator.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{emulator.name}</p>
                        <p className="text-xs text-muted-foreground">v{emulator.version}</p>
                      </div>
                    </div>

                    <FocusableItem
                      focusKey="configure-emulator"
                      className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        /* Open emulator settings */
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </FocusableItem>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted-foreground text-sm mb-3">No emulator configured</p>
                    <FocusableItem
                      focusKey="edit-emulator"
                      className="bg-muted hover:bg-muted/80 text-foreground px-3 py-1 rounded-lg text-sm font-medium transition-all inline-flex items-center"
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </FocusableItem>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
