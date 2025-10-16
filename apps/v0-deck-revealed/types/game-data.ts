export interface GameData {
  id: string
  title: string
  developer: string
  publisher: string
  releaseDate: string
  lastPlayed: string
  totalPlaytime: string
  description: string
  genres: string[]
  features: string[]
  platforms: string[]
  image: string
  headerImage?: string
  screenshots: string[]
  videos?: { id: string; title: string; thumbnail: string; duration: string }[]
  rating: number
  ratingCount: number
  statistics: {
    averagePlaytime: string
    completionRate: number
    popularityRank: number
    difficultyRating: number
    replayValue: number
  }
  achievements: {
    total: number
    unlocked: number
    recent: { id: string; name: string; description: string; date: string; icon: string }[]
  }
  friends: { id: string; name: string; status: string; playtime: string; avatar: string }[]
  dlc: { id: string; name: string; price: string; image: string; installed: boolean }[]
  systemRequirements: {
    minimum: { os: string; cpu: string; gpu: string; ram: string; storage: string }
    recommended: { os: string; cpu: string; gpu: string; ram: string; storage: string }
  }
  installed?: boolean
}

export interface GameNote {
  id: string
  gameId: string
  content: string
  createdAt: string
  tags: string[]
}

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  border: string
  muted: string
  mutedForeground: string
}
