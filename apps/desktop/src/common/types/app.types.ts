import { Timestamp } from 'firebase/firestore'
import { appCategories, appStatus, appTypes } from '../app'

export type Platform = 'windows' | 'linux' | 'macos' | 'web' | 'android' | 'ios' | 'steam deck'

export type AppType = typeof appTypes[number]
export type AppStatus = typeof appStatus[number]
export type AppCategory = typeof appCategories[number]

export interface AppPlatform {
  name: string
  isNative: boolean
  platform: Platform
  isWeb: boolean
  locationPath: string
  locationFolder: string
  savePath: string
  saveFolder: string
  source: string
  runner: 'exe' | 'msi' | 'web' | 'direct' | 'pacman' | 'flathub' | 'app' | 'snap' | 'script'
}

export interface AppVersion {
  name: string
  platform: Platform
  version: string
  url: string
  size: number
  sha256: string
  date: string
  changelog: string
  isLatest: boolean
  isRecommended: boolean
  isBeta: boolean
  isStable: boolean
  isDev: boolean
  isPreview: boolean
}

export interface UserActions {
  isInstalled?: boolean
  isRunning?: boolean
  isRecent?: boolean
  isUpdating?: boolean
  isFavorited?: boolean
  isHidden?: boolean
  isAddedToSteam?: boolean
  createdAt?: Timestamp | string
  updatedAt?: Timestamp | string
}

export interface AppInfo {
  id: string
  runner: 'exe' | 'msi' | 'web' | 'direct' | 'pacman' | 'flathub' | 'app' | 'snap' | 'script'
  name: string
  // website, app id, appimage url
  source: string
  sourceWebsite?: string
  description?: string
  developer?: string
  developerWebsite?: string
  publisher?: string
  publisherWebsite?: string
  storeUrl?: string
  userId?: string

  type: AppType
  status: AppStatus
  category: AppCategory
  subCategory?: AppCategory
  namespace?: string

  // folder_name: string
  // install: Partial<InstalledInfo>
  // is_installed: boolean
  // cloud_save_enabled: boolean

  canRunOffline?: boolean
  thirdPartyManagedApp?: string | undefined

  coverImage?: string
  squareImage?: string
  backgroundImage?: string
  logoImage?: string
  gallery?: string[]

  platforms?: AppPlatform[]

  versions?: AppVersion[]

  installedInfo?: {
    folder: string
  }

  install?: {
    executable: string
    path: string
    platform: Platform
  }

  userActions?: UserActions

  createdAt: Timestamp | string
  updatedAt: Timestamp | string
}
