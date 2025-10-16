"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  Cloud,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Save,
  FileText,
  RotateCw,
  HardDrive,
} from "lucide-react"
import { useCloudSaves } from "@/hooks/use-cloud-saves"
import type { SaveFile } from "@/types/cloud-save"
import { formatBytes, formatDate, formatPlayTime } from "@/lib/utils"

interface SaveDetailProps {
  save: SaveFile
  onBack: () => void
}

export function SaveDetail({ save, onBack }: SaveDetailProps) {
  const { syncSave, createBackup, restoreBackup, deleteBackup, resolveConflict, isLoading } = useCloudSaves()
  const [activeTab, setActiveTab] = useState<"info" | "backups" | "conflicts">("info")

  // Handle create backup
  const handleCreateBackup = () => {
    const notes = prompt("Add notes for this backup (optional):")
    createBackup(save.id, notes || undefined)
  }

  // Handle restore backup
  const handleRestoreBackup = (backupId: string) => {
    if (confirm("Are you sure you want to restore this backup? Current progress may be lost.")) {
      restoreBackup(save.id, backupId)
    }
  }

  // Handle delete backup
  const handleDeleteBackup = (backupId: string) => {
    if (confirm("Are you sure you want to delete this backup?")) {
      deleteBackup(save.id, backupId)
    }
  }

  // Handle resolve conflict
  const handleResolveConflict = (resolution: "local" | "cloud") => {
    if (confirm(`Are you sure you want to keep the ${resolution} version?`)) {
      resolveConflict(save.id, resolution)
    }
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
          <h1 className="text-2xl font-bold gradient-text">{save.displayName}</h1>
        </div>

        <div className="flex items-center gap-2">
          {save.syncStatus !== "synced" && (
            <FocusableItem
              focusKey="sync-save"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isLoading ? "bg-primary/20 text-primary" : "bg-primary hover:bg-primary/90 text-white"
              }`}
              onClick={() => syncSave(save.id)}
            >
              <div className="flex items-center">
                <Cloud className={`w-4 h-4 mr-2 ${isLoading ? "animate-pulse" : ""}`} />
                <span>Sync Now</span>
              </div>
            </FocusableItem>
          )}

          <FocusableItem
            focusKey="create-backup"
            className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors"
            onClick={handleCreateBackup}
          >
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              <span>Create Backup</span>
            </div>
          </FocusableItem>
        </div>
      </div>

      {/* Save Header */}
      <Card className="bg-card border-border p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <img
              src={save.thumbnail || "/placeholder.svg?height=200&width=200&query=game save"}
              alt={save.displayName}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Game</p>
                <p className="font-medium">
                  {save.gameId === "game1" ? "Cyberpunk 2077" : save.gameId === "game2" ? "Elden Ring" : "Hades"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-medium">{save.fileName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(save.updatedAt)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(save.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Play Time</p>
                <p className="font-medium">{formatPlayTime(save.playTime)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{formatBytes(save.size)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-medium">{save.platform}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Sync Status</p>
                <p className="font-medium flex items-center">
                  {save.syncStatus === "synced" ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      Synced
                    </>
                  ) : save.syncStatus === "local-only" ? (
                    <>
                      <Upload className="w-4 h-4 text-primary mr-1" />
                      Local Only
                    </>
                  ) : save.syncStatus === "cloud-only" ? (
                    <>
                      <Download className="w-4 h-4 text-primary mr-1" />
                      Cloud Only
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-secondary mr-1" />
                      Conflict
                    </>
                  )}
                </p>
              </div>
            </div>

            {save.description && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{save.description}</p>
              </div>
            )}

            {save.chapterInfo && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Chapter/Progress</p>
                <p className="font-medium">{save.chapterInfo}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <FocusableItem
          focusKey="tab-info"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "info"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("info")}
        >
          Information
        </FocusableItem>

        <FocusableItem
          focusKey="tab-backups"
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "backups"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("backups")}
        >
          Backups ({save.backups.length})
        </FocusableItem>

        {save.syncStatus === "conflict" && (
          <FocusableItem
            focusKey="tab-conflicts"
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "conflicts"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("conflicts")}
          >
            Resolve Conflict
          </FocusableItem>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Save File Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Auto Save</p>
                  <p className="font-medium">{save.isAutoSave ? "Yes" : "No"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Checkpoint</p>
                  <p className="font-medium">{save.isCheckpoint ? "Yes" : "No"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Backup Count</p>
                <p className="font-medium">{save.backups.length}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="font-medium">
                  {save.backups.length > 0 ? formatDate(save.backups[0].createdAt) : "No backups"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Sync Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium flex items-center">
                  {save.syncStatus === "synced" ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      Synced with cloud
                    </>
                  ) : save.syncStatus === "local-only" ? (
                    <>
                      <Upload className="w-4 h-4 text-primary mr-1" />
                      Local changes not synced to cloud
                    </>
                  ) : save.syncStatus === "cloud-only" ? (
                    <>
                      <Download className="w-4 h-4 text-primary mr-1" />
                      Cloud version not downloaded
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-secondary mr-1" />
                      Conflict between local and cloud versions
                    </>
                  )}
                </p>
              </div>

              {save.syncStatus !== "synced" && (
                <div className="mt-4">
                  <FocusableItem
                    focusKey="sync-save-info"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors inline-flex items-center"
                    onClick={() => syncSave(save.id)}
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    <span>
                      {save.syncStatus === "local-only"
                        ? "Upload to Cloud"
                        : save.syncStatus === "cloud-only"
                          ? "Download from Cloud"
                          : "Resolve Conflict"}
                    </span>
                  </FocusableItem>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "backups" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Backups</h2>
            <FocusableItem
              focusKey="create-new-backup"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
              onClick={handleCreateBackup}
            >
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                <span>Create New Backup</span>
              </div>
            </FocusableItem>
          </div>

          {save.backups.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <HardDrive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No backups found for this save file.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create a backup to protect your progress and revert to it if needed.
              </p>
              <button
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                onClick={handleCreateBackup}
              >
                Create First Backup
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {save.backups.map((backup) => (
                <Card key={backup.id} className="bg-card border-border p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          backup.source === "manual"
                            ? "bg-primary/20"
                            : backup.source === "auto"
                              ? "bg-muted/50"
                              : "bg-accent/20"
                        }`}
                      >
                        {backup.source === "manual" ? (
                          <Save className="text-primary" size={20} />
                        ) : backup.source === "auto" ? (
                          <RotateCw className="text-muted-foreground" size={20} />
                        ) : backup.source === "cloud" ? (
                          <Cloud className="text-accent" size={20} />
                        ) : (
                          <HardDrive className="text-primary" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {backup.source.charAt(0).toUpperCase() + backup.source.slice(1)} Backup
                          </p>
                          <span className="ml-2 text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">
                            {formatBytes(backup.size)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(backup.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <FocusableItem
                        focusKey={`restore-${backup.id}`}
                        className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                      >
                        Restore
                      </FocusableItem>
                      <FocusableItem
                        focusKey={`delete-${backup.id}`}
                        className="px-3 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors text-sm"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        Delete
                      </FocusableItem>
                    </div>
                  </div>
                  {backup.notes && (
                    <div className="mt-3 pl-12">
                      <p className="text-sm text-muted-foreground flex items-start">
                        <FileText className="w-3 h-3 mr-1 mt-1 flex-shrink-0" />
                        {backup.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "conflicts" && save.syncStatus === "conflict" && (
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-secondary mr-2" />
              <h2 className="text-xl font-semibold">Conflict Detected</h2>
            </div>

            <p className="text-muted-foreground mb-6">
              There is a conflict between the local and cloud versions of this save file. Please choose which version
              you want to keep.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-xl p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Local Version
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p>{formatDate(save.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p>{formatBytes(save.size)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Play Time</p>
                    <p>{formatPlayTime(save.playTime)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <FocusableItem
                    focusKey="keep-local"
                    className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                    onClick={() => handleResolveConflict("local")}
                  >
                    Keep Local Version
                  </FocusableItem>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Cloud className="w-4 h-4 mr-2" />
                  Cloud Version
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p>{formatDate(save.backups.find((b) => b.source === "cloud")?.createdAt || save.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p>{formatBytes(save.backups.find((b) => b.source === "cloud")?.size || save.size)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Notes</p>
                    <p>
                      {save.backups.find((b) => b.source === "cloud")?.notes || "No additional information available"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <FocusableItem
                    focusKey="keep-cloud"
                    className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                    onClick={() => handleResolveConflict("cloud")}
                  >
                    Keep Cloud Version
                  </FocusableItem>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Before resolving the conflict, you can create a backup of the current state to
                ensure you don't lose any progress.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
