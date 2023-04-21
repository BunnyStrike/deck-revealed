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

export const appTypes = [
  'flathub',
  'pacman',
  'direct',
  'web',
  'script',
  'app',
  'snap',
  'exe',
  'msi',
]

export const appPlatforms = [
  'windows',
  'linux',
  'macos',
  'web',
  'android',
  'ios',
  'steam deck',
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
export type AppType = (typeof appTypes)[number]
export type AppPlatform = (typeof appPlatforms)[number]
export type AppStatus = (typeof appStatus)[number]
