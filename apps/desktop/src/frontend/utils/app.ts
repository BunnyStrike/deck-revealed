export const appCategories = [
  'Entertainment',
  'Cloud Games',
  'Resource',
  'Education',
  'Social',
  'Productivity',
  'Shopping',
  'News',
  'Sports',
  'Health',
  'Finance',
  'Travel',
  'Food',
  'Games',
  'Music',
  'Books',
  'Utilities',
  'Lifestyle',
  'Business',
  'Weather',
  'Reference',
  'Launcher',
  'Emulator',
]

export const appStores = [
  'STEAM',
  'GOG',
  'EPIC',
  'ORIGIN',
  'UPLAY',
  'FLATPAK',
  'SNAP',
  'PACMAN',
  'OTHER',
]

export const appPlatforms = [
  'WINDOWS',
  'LINUX',
  'STEAMOS',
  'MAC',
  'ANDROID',
  'IOS',
  'WEB',
  'OTHER',
]

export const appRunnerTypes = [
  'EXE',
  'MSI',
  'DMG',
  'DEB',
  'RPM',
  'WEB',
  'FLATPAK',
  'APPIMAGE',
  'UNKNOWN',
  'BASH',
]

export const appStatus = [
  'public',
  'hidden',
  'beta',
  'preview',
  'dev',
  'personal',
]

export type AppCategory = (typeof appCategories)[number]
export type AppStore = (typeof appStores)[number]
export type AppRunnerType = (typeof appRunnerTypes)[number]
export type AppPlatform = (typeof appPlatforms)[number]
export type AppStatus = (typeof appStatus)[number]
