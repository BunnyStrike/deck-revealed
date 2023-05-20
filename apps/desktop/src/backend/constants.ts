import { spawnSync } from 'child_process'
import { cpus, homedir, platform } from 'os'
import { join, resolve } from 'path'
import { env } from 'process'
import { parse } from '@node-steam/vdf'
import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync } from 'graceful-fs'

import type { GameConfigVersion, GlobalConfigVersion } from '~/common/types'
import { GlobalConfig } from './configs/config'
import { TypeCheckedStoreBackend } from './electronStore'
import { createNewLogFileAndClearOldOnes } from './logger/logfile'
import { LogPrefix, logDebug } from './logger/logger'

const configStore = new TypeCheckedStoreBackend('configStore', {
  cwd: 'store',
})

const tsStore = new TypeCheckedStoreBackend('timestampStore', {
  cwd: 'store',
  name: 'timestamp',
})

const fontsStore = new TypeCheckedStoreBackend('fontsStore', {
  cwd: 'store',
  name: 'fonts',
})

const isMac = platform() === 'darwin'
const isWindows = platform() === 'win32'
const isLinux = platform() === 'linux'
// TODO: This is a temporary solution until we have a better way to detect Steam Deck
const isSteamDeck = cpus().every((cpu: any) =>
  cpu.model.includes('AMD Custom APU 0405')
)
const isSteamos = isLinux && isSteamDeck
const isSteamDeckGameMode = process.env.XDG_CURRENT_DESKTOP === 'gamescope'
const isCLIFullscreen = process.argv.includes('--fullscreen')
const isCLINoGui = process.argv.includes('--no-gui')
const isFlatpak = Boolean(env.FLATPAK_ID)
const currentGameConfigVersion: GameConfigVersion = 'v0'
const currentGlobalConfigVersion: GlobalConfigVersion = 'v0'

const flatPakHome = env.XDG_DATA_HOME?.replace('/data', '') || homedir()
const userHome = homedir()
const configFolder = app.getPath('appData')
const legendaryConfigPath = isLinux
  ? join(configFolder, 'legendary')
  : join(userHome, '.config', 'legendary')
const revealedFolder = join(configFolder, 'revealed')
const revealedConfigPath = join(revealedFolder, 'config.json')
const revealedGamesConfigPath = join(revealedFolder, 'GamesConfig')
const revealedToolsPath = join(revealedFolder, 'tools')
const revealedIconFolder = join(revealedFolder, 'icons')
const runtimePath = join(revealedToolsPath, 'runtimes')
const userInfo = join(legendaryConfigPath, 'user.json')
const revealedInstallPath = join(homedir(), 'Games', 'Revealed')
const revealedDefaultWinePrefix = join(
  homedir(),
  'Games',
  'Revealed',
  'Prefixes'
)
const revealedAnticheatDataPath = join(revealedFolder, 'areweanticheatyet.json')
const imagesCachePath = join(revealedFolder, 'images-cache')
const appImagesFolder = app.isPackaged
  ? join(app.getAppPath(), 'public', 'img')
  : join(app.getAppPath(), 'public', 'img')

// const appImagesFolder = app.isPackaged
//   ? join(app.getAppPath(), 'data', 'flutter_assets', 'assets', 'images')
//   : join(app.getAppPath(), 'assets', 'images')

const cachedUbisoftInstallerPath = join(
  revealedFolder,
  'tools',
  'UbisoftConnectInstaller.exe'
)

// Steam Folders
const mainSteamConfigFile = join(
  userHome,
  '.local',
  'share',
  'Steam',
  'config',
  'config.vdf'
)
const steamUsersFile = join(
  userHome,
  '.local',
  'share',
  'Steam',
  'config',
  'loginusers.vdf'
)
const steamUsersAvatarFolder = join(
  userHome,
  '.local',
  'share',
  'Steam',
  'avatarcache'
)

const steamDeckEmulationFolder = '/home/deck/Emulation/'

const { currentLogFile, lastLogFile, legendaryLogFile, gogdlLogFile } =
  createNewLogFileAndClearOldOnes()

const publicDir = resolve(__dirname, '..', app.isPackaged ? '' : '../public')
const gogdlAuthConfig = join(app.getPath('userData'), 'gog_store', 'auth.json')
const icon = fixAsarPath(join(publicDir, 'icon.png'))
const iconDark = fixAsarPath(join(publicDir, 'icon-dark.png'))
const iconLight = fixAsarPath(join(publicDir, 'icon-light.png'))
const installed = join(legendaryConfigPath, 'installed.json')
const legendaryMetadata = join(legendaryConfigPath, 'metadata')
const fallBackImage = 'fallback'
const epicLoginUrl = 'https://legendary.gl/epiclogin'
const sidInfoUrl =
  'https://github.com/BunnyStrike/revealed/wiki/How-To:-Epic-Alternative-Login'
const revealedGithubURL =
  'https://github.com/BunnyStrike/revealed/releases/latest'
const GITHUB_API = 'https://api.github.com/repos/BunnyStrike/revealed/releases'
const supportURL =
  'https://github.com/BunnyStrike/revealed/blob/main/Support.md'
const discordLink = 'https://discord.gg/rHJ2uqdquK'
const wikiLink = 'https://github.com/BunnyStrike/revealed/wiki'
const weblateUrl = 'https://hosted.weblate.org/projects/revealed-games-launcher'
const kofiPage = 'https://ko-fi.com/revealedgames'
const patreonPage = 'https://www.patreon.com/deckrevealed'
const wineprefixFAQ = 'https://wiki.winehq.org/FAQ#Wineprefixes'
const customThemesWikiLink =
  'https://github.com/BunnyStrike/revealed/wiki/Custom-Themes'

const supabaseApiURL =
  process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL
const supabaseApiKey =
  process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Get shell for different os
 * @returns Windows: powershell
 * @returns unix: $SHELL or /usr/bin/bash
 */
function getShell() {
  // Dont change this logic since Revealed will break when using SH or FISH
  switch (process.platform) {
    case 'win32':
      return 'powershell.exe'
    case 'linux':
      return '/bin/bash'
    case 'darwin':
      return '/bin/zsh'
    default:
      return '/bin/bash'
  }
}

/**
 * Fix path for packed files with asar, else will do nothing.
 * @param origin  original path
 * @returns fixed path
 */
function fixAsarPath(origin: string): string {
  if (!origin.includes('app.asar.unpacked')) {
    return origin.replace('app.asar', 'app.asar.unpacked')
  }
  return origin
}

export function getSteamCompatFolder() {
  // Paths are from https://savelocation.net/steam-game-folder
  if (isWindows) {
    const defaultWinPath = join(process.env['PROGRAMFILES(X86)'] ?? '', 'Steam')
    return defaultWinPath
  } else if (isMac) {
    return join(userHome, 'Library/Application Support/Steam')
  } else {
    const flatpakSteamPath = join(
      userHome,
      '.var/app/com.valvesoftware.Steam/.steam/steam'
    )

    if (existsSync(flatpakSteamPath)) {
      // check if steam is really installed via flatpak
      const { status } = spawnSync('flatpak', [
        'info',
        'com.valvesoftware.Steam',
      ])

      if (status === 0) {
        return flatpakSteamPath
      }
    }
    return join(userHome, '.steam/steam')
  }
}

export async function getSteamLibraries(): Promise<string[]> {
  const { defaultSteamPath } = GlobalConfig.get().getSettings()
  const path = defaultSteamPath.replaceAll("'", '')
  const vdfFile = join(path, 'steamapps', 'libraryfolders.vdf')
  const libraries = ['/usr/share/steam']

  if (existsSync(vdfFile)) {
    const json = parse(readFileSync(vdfFile, 'utf-8'))
    if (!json.libraryfolders) {
      return libraries
    }
    const folders = Object.values(json.libraryfolders)
    return [...libraries, ...folders.map((folder: any) => folder.path)].filter(
      (path) => existsSync(path)
    )
  }
  logDebug(
    'Unable to load Steam Libraries, libraryfolders.vdf not found',
    LogPrefix.Backend
  )
  return libraries
}

const MAX_BUFFER = 25 * 1024 * 1024 // 25MB should be safe enough for big installations even on really slow internet

const execOptions = {
  maxBuffer: MAX_BUFFER,
  shell: getShell(),
}

const defaultFolders = [
  revealedFolder,
  revealedGamesConfigPath,
  revealedIconFolder,
  imagesCachePath,
]

const necessaryFoldersByPlatform: any = {
  win32: [...defaultFolders],
  linux: [...defaultFolders, revealedToolsPath],
  darwin: [...defaultFolders, revealedToolsPath],
}

export const supportedLanguages = [
  'ar',
  'az',
  'be',
  'bg',
  'bs',
  'ca',
  'cs',
  'de',
  'el',
  'en',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fr',
  'gl',
  'hr',
  'hu',
  'ja',
  'ko',
  'id',
  'it',
  'ml',
  'nb_NO',
  'nl',
  'pl',
  'pt',
  'pt_BR',
  'ro',
  'ru',
  'sk',
  'sv',
  'ta',
  'tr',
  'uk',
  'vi',
  'zh_Hans',
  'zh_Hant',
]

export function createNecessaryFolders() {
  necessaryFoldersByPlatform[platform()].forEach((folder: string) => {
    if (!existsSync(folder)) {
      mkdirSync(folder)
    }
  })
}

export {
  currentGameConfigVersion,
  currentGlobalConfigVersion,
  currentLogFile,
  lastLogFile,
  legendaryLogFile,
  gogdlLogFile,
  discordLink,
  execOptions,
  fixAsarPath,
  configStore,
  revealedConfigPath,
  revealedGamesConfigPath,
  revealedGithubURL,
  revealedIconFolder,
  revealedInstallPath,
  revealedToolsPath,
  revealedDefaultWinePrefix,
  revealedAnticheatDataPath,
  imagesCachePath,
  userHome,
  flatPakHome,
  kofiPage,
  icon,
  iconDark,
  iconLight,
  installed,
  isFlatpak,
  isMac,
  isWindows,
  isLinux,
  legendaryConfigPath,
  legendaryMetadata,
  epicLoginUrl,
  patreonPage,
  sidInfoUrl,
  supportURL,
  fallBackImage,
  userInfo,
  weblateUrl,
  wikiLink,
  tsStore,
  fontsStore,
  isSteamos,
  isSteamDeck,
  isSteamDeckGameMode,
  runtimePath,
  isCLIFullscreen,
  isCLINoGui,
  publicDir,
  GITHUB_API,
  wineprefixFAQ,
  customThemesWikiLink,
  cachedUbisoftInstallerPath,
  gogdlAuthConfig,
  mainSteamConfigFile,
  steamUsersFile,
  steamUsersAvatarFolder,
  steamDeckEmulationFolder,
  appImagesFolder,
}
