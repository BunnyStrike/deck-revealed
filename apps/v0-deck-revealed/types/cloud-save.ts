export interface SaveFile {
  id: string
  gameId: string
  fileName: string
  displayName: string
  createdAt: string
  updatedAt: string
  size: number
  syncStatus: "synced" | "local-only" | "cloud-only" | "conflict"
  platform: string
  playTime: number
  thumbnail?: string
  description?: string
  isAutoSave: boolean
  isCheckpoint: boolean
  chapterInfo?: string
  backups: SaveBackup[]
}

export interface SaveBackup {
  id: string
  createdAt: string
  size: number
  source: "local" | "cloud" | "auto" | "manual"
  notes?: string
}

export interface CloudSaveSettings {
  autoSync: boolean
  autoBackup: boolean
  backupFrequency: "hourly" | "daily" | "weekly" | "on-exit"
  maxBackupsPerSave: number
  maxBackupAge: number // in days
  backupLocation: string
  compressionEnabled: boolean
  encryptionEnabled: boolean
  conflictResolution: "ask" | "newest" | "local" | "cloud"
}

export interface CloudSaveStats {
  totalSaves: number
  totalSize: number
  cloudUsage: number
  cloudLimit: number
  lastSyncTime: string
  syncErrors: number
}
