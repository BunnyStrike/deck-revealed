import { Timestamp } from 'firebase/firestore'

export interface SteamOSBootVideo {
  id: string
  name: string
  version?: string
  url: string
  photoUrl?: string
  duration?: number
  size?: number
  sha256?: string
  authorName: string
  authorUrl: string
  userId?: string
  // date: string
  changelog?: string
  updatedAt: Timestamp
  createdAt: Timestamp
}
