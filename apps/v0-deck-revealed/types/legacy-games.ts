export interface Emulator {
  id: string
  name: string
  platform: EmulatorPlatform
  version: string
  path: string
  executable: string
  commandLineArgs?: string
  supportedFileExtensions: string[]
  configurable: boolean
  icon: string
  website: string
  isInstalled: boolean
  lastUpdated: string
}

export type EmulatorPlatform =
  | "nes"
  | "snes"
  | "n64"
  | "gb"
  | "gbc"
  | "gba"
  | "genesis"
  | "segacd"
  | "dreamcast"
  | "ps1"
  | "arcade"
  | "dos"
  | "other"

export interface ROM {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  platform: EmulatorPlatform
  title: string
  coverImage?: string
  description?: string
  releaseYear?: number
  publisher?: string
  developer?: string
  genre?: string[]
  tags?: string[]
  favorite: boolean
  lastPlayed?: string
  playTime: number
  emulatorId?: string
  dateAdded: string
  verified: boolean
  region?: string
  language?: string[]
}

export interface EmulatorConfig {
  id: string
  emulatorId: string
  name: string
  settings: Record<string, any>
}

export interface PlatformInfo {
  id: EmulatorPlatform
  name: string
  shortName: string
  description: string
  releaseYear: number
  manufacturer: string
  icon: string
  coverImage: string
  color: string
  romCount?: number
}
