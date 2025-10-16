export interface ModAuthor {
  id: string
  name: string
  avatar?: string
  website?: string
}

export interface ModScreenshot {
  id: string
  url: string
  caption?: string
}

export interface ModVersion {
  version: string
  releaseDate: string
  changelog: string
  downloadUrl: string
  fileSize: string
  gameVersion: string
}

export interface ModRequirement {
  type: "game" | "mod" | "system"
  name: string
  version?: string
  optional: boolean
}

export interface ModCategory {
  id: string
  name: string
  slug: string
}

export interface Mod {
  id: string
  name: string
  slug: string
  gameId: string
  description: string
  shortDescription: string
  author: ModAuthor
  thumbnail: string
  banner?: string
  rating: number
  ratingCount: number
  downloadCount: number
  createdAt: string
  updatedAt: string
  latestVersion: ModVersion
  versions: ModVersion[]
  categories: ModCategory[]
  tags: string[]
  screenshots: ModScreenshot[]
  requirements: ModRequirement[]
  installed: boolean
  enabled: boolean
  installPath?: string
  loadOrder?: number
}

export interface ModFilter {
  search?: string
  categories?: string[]
  tags?: string[]
  sortBy?: "popular" | "recent" | "rating" | "downloads" | "name"
  gameId?: string
}
