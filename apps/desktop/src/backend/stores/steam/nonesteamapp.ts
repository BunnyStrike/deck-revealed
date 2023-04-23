import { dirname, join } from 'path'
import { app } from 'electron'
import { readFileSync } from 'fs-extra'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'graceful-fs'
import i18next from 'i18next'
import {
  parseBuffer,
  writeBuffer,
  type ShortcutEntry,
  type ShortcutObject,
} from 'steam-shortcut-editor'

import { GameInfo, SideloadGame } from '~/common/types'
import { type AppInfo } from '~/common/types/app.types'
import { GlobalConfig } from '../../configs/config'
import { isFlatpak, isLinux, isWindows, tsStore } from '../../constants'
import { notify, showDialogBoxModalAuto } from '../../dialog/dialog'
import { getWikiGameInfo } from '../../info/wikiGameInfo'
import { LogPrefix, logError, logInfo, logWarning } from '../../logger/logger'
import { getIcon } from '../../utils'
import {
  generateAppId,
  generateShortAppId,
  generateShortcutId,
  prepareImagesForSteam,
  removeImagesFromSteam,
} from './steamhelper'

export interface ShortcutsResult {
  success: boolean
  errors: string[]
}

const getSteamUserdataDir = async () => {
  const { defaultSteamPath } = GlobalConfig.get().getSettings()
  return join(defaultSteamPath.replaceAll("'", ''), 'userdata')
}

/**
 * Opens a error dialog in frontend with the error message
 * @param props
 */
function showErrorInFrontend(props: { gameTitle: string; error: string }) {
  const error = i18next.t('box.error.add.steam.body', {
    defaultValue: 'Adding {{game}} to Steam failed with:{{newLine}} {{error}}',
    game: props.gameTitle,
    newLine: '\n',
    error: props.error,
    interpolation: { escapeValue: false },
  })

  const title = i18next.t(
    'box.error.add.steam.title',
    'Error Adding Game to Steam'
  )

  showDialogBoxModalAuto({ title, message: error, type: 'ERROR' })
}

/**
 * Opens a notify window in the frontend with given message
 * @param props
 */
function notifyFrontend(props: { message: string; adding: boolean }) {
  const title = props.adding
    ? i18next.t('notify.finished.add.steam.title', 'Added to Steam')
    : i18next.t('notify.finished.remove.steam.title', 'Removed from Steam')

  notify({
    body: props.message,
    title,
  })
}

/**
 * Check if steam userdata folder exist and return them as a string list.
 * @param steamUserdataDir Path to userdata folder in steam compat folder.
 * @returns All userdata folders as string array and possible error
 */
function checkSteamUserDataDir(steamUserdataDir: string): {
  folders: string[]
  error?: string
} {
  if (!existsSync(steamUserdataDir)) {
    return {
      folders: [],
      error: `${steamUserdataDir} does not exist. Can't add/remove game to/from Steam!`,
    }
  }
  const ignoreFolders = ['0', 'ac']
  const folders = readdirSync(steamUserdataDir, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => ignoreFolders.every((folder) => folder !== dirent.name))
    .map((dirent) => dirent.name)

  if (folders.length <= 0) {
    return {
      folders: [],
      error: `${steamUserdataDir} does not contain a valid user directory!`,
    }
  }

  return { folders }
}

/**
 * Reads the content of shortcuts.vdf and parse it into @see ShortcutObject via
 * steam-shortcut-editor
 * @param file Path to shortcuts.vdf
 * @returns @see Partial<ShortcutObject>
 */
function readShortcutFile(file: string): Partial<ShortcutObject> {
  const content = readFileSync(file)

  return parseBuffer(content, {
    autoConvertArrays: true,
    autoConvertBooleans: true,
    dateProperties: ['LastPlayTime'],
  })
}

/**
 * Writes given object (@see ShortcutObject) into given shortcuts.vdf.
 * steam-shortcut-editor is used to parse the Object to steam binary layout.
 * @param file Path to shortcuts.vdf
 * @param object @see Partial<ShortcutObject>
 * @returns none
 */
function writeShortcutFile(
  file: string,
  object: Partial<ShortcutObject>
): string | undefined {
  const buffer = writeBuffer(object)
  try {
    writeFileSync(file, buffer)
    return
  } catch (error) {
    return `${error}`
  }
}

/** Check if key exist case insensitive
 * @param {Object} object
 * @param {string} key
 * @return bool value
 */
function hasParameterCaseInsensitive(object: ShortcutEntry, key: string) {
  const keyAsLowercase = key.toLowerCase()
  return Object.keys(object).some((k) => k.toLowerCase() === keyAsLowercase)
}

/**
 * Check if the parsed object of a shortcuts.vdf is valid.
 * @param object @see Partial<ShortcutObject>
 * @returns @see ShortcutsResult
 */
function checkIfShortcutObjectIsValid(
  object: Partial<ShortcutObject>
): ShortcutsResult {
  const checkResult: ShortcutsResult = { success: false, errors: [] }
  if (!('shortcuts' in object)) {
    checkResult.errors.push('Could not find entry "shortcuts"!')
  } else if (!Array.isArray(object.shortcuts)) {
    checkResult.errors.push('Entry "shortcuts" is not an array!')
  } else {
    checkResult.success = true
    object.shortcuts.forEach((entry: any) => {
      const keysToCheck = ['AppName', 'Exe', 'LaunchOptions']
      keysToCheck.forEach((key: string) => {
        if (!hasParameterCaseInsensitive(entry, key)) {
          checkResult.errors.push(
            `One of the game entries is missing the ${key} parameter!`
          )
          checkResult.success = false
        }
      })
    })
  }

  return checkResult
}

/**
 * Check if a game is already added.
 * @param object @see Partial<ShortcutObject>
 * @param title Title of the game
 * @returns Index of the found title, else if not found -1
 */
function checkIfAlreadyAdded(object: Partial<ShortcutObject>, title: string) {
  const shortcuts = object.shortcuts ?? []
  return shortcuts.findIndex((entry: any) => entry.AppName === title)
}

async function addNonSteamApp(appInfo: AppInfo): Promise<boolean> {
  const steamUserdataDir = await getSteamUserdataDir()
  const appName = appInfo.name

  // wikiInfo?.pcgamingwiki?.steamID ?? wikiInfo?.gamesdb?.steamID

  const { folders, error } = checkSteamUserDataDir(steamUserdataDir)

  if (error) {
    logError(error, LogPrefix.Shortcuts)
    showErrorInFrontend({
      gameTitle: appName,
      error,
    })
    return false
  }

  const errors = []
  let added = false
  for (const folder of folders) {
    const configDir = join(steamUserdataDir, folder, 'config')
    const shortcutsFile = join(configDir, 'shortcuts.vdf')

    if (!existsSync(configDir)) {
      mkdirSync(configDir)
    }

    if (!existsSync(shortcutsFile)) {
      writeShortcutFile(shortcutsFile, { shortcuts: [] })
    }

    // read file
    const content = readShortcutFile(shortcutsFile)
    content.shortcuts = content.shortcuts ?? []

    const checkResult = checkIfShortcutObjectIsValid(content)
    if (!checkResult.success) {
      errors.push(
        `Can't add "${appName}" to Steam user "${folder}". "${shortcutsFile}" is corrupted!`,
        ...checkResult.errors
      )
      continue
    }

    if (checkIfAlreadyAdded(content, appName) > -1) {
      added = true
      continue
    }

    // add new Entry
    const newEntry = {} as ShortcutEntry
    newEntry.AppName = appName
    newEntry.Exe = `"${app.getPath('exe')}"`
    newEntry.StartDir = `"${process.cwd()}"`

    const steamID = generateShortcutId(newEntry.Exe, appName) + ''

    if (isFlatpak) {
      newEntry.Exe = `"flatpak"`
    } else if (!isWindows && process.env.APPIMAGE) {
      newEntry.Exe = `"${process.env.APPIMAGE}"`
    } else if (isWindows && process.env.PORTABLE_EXECUTABLE_FILE) {
      newEntry.Exe = `"${process.env.PORTABLE_EXECUTABLE_FILE}`
      newEntry.StartDir = `"${process.env.PORTABLE_EXECUTABLE_DIR}"`
    }

    newEntry.appid = generateShortcutId(newEntry.Exe, newEntry.AppName)

    await getIcon(appName, appInfo)
      .then((path) => (newEntry.icon = path))
      .catch((error) =>
        logWarning(
          [`Couldn't find a icon for ${appName} with:`, error],
          LogPrefix.Shortcuts
        )
      )

    await prepareImagesForSteam({
      steamUserConfigDir: configDir,
      appID: {
        bigPictureAppID: generateAppId(newEntry.Exe, newEntry.AppName),
        otherGridAppID: generateShortAppId(newEntry.Exe, newEntry.AppName),
      },
      gameInfo: appInfo,
      steamID: steamID,
    })

    const args = []
    args.push('--no-gui')
    if (!isWindows) {
      args.push('--no-sandbox')
      args.push('--fullscreen')
    }
    args.push(`"revealed://launch/${appName}"`)
    newEntry.LaunchOptions = args.join(' ')
    if (appName === 'DeckRevealed') {
      newEntry.LaunchOptions = `--no-sandbox ${newEntry.LaunchOptions}`
    } else if (appInfo.type === 'web') {
      // args.push(appInfo.source)
      if (isWindows) {
        const explorerPath = join(
          process.env.windir ?? process.env.WINDIR ?? '',
          'explorer.exe'
        )
        newEntry.LaunchOptions = `${appInfo.source}`

        newEntry.Exe = `${explorerPath}`
        newEntry.StartDir = dirname(explorerPath)
      } else if (isLinux) {
        newEntry.LaunchOptions = `run --branch=stable --arch=x86_64 --command=/app/bin/chrome --file-forwarding com.google.Chrome @@u @@ --window-size=1024,640 --fullscreen --force-device-scale-factor=1.25 --device-scale-factor=1.25 --kiosk ${appInfo.source}`

        newEntry.Exe = `/usr/bin/flatpak`
        newEntry.StartDir = '/usr/bin/'
      }
    } else if (isFlatpak) {
      newEntry.LaunchOptions = `run com.bunnystrike.revealed ${newEntry.LaunchOptions}`
    }
    newEntry.IsHidden = false
    newEntry.AllowDesktopConfig = true
    newEntry.AllowOverlay = true
    newEntry.OpenVR = false
    newEntry.Devkit = false
    newEntry.DevkitOverrideAppID = false

    const lastPlayed = tsStore.get_nodefault(`${appName}.lastPlayed`)
    if (lastPlayed) {
      newEntry.LastPlayTime = new Date(lastPlayed)
    } else {
      newEntry.LastPlayTime = new Date()
    }

    content.shortcuts.push(newEntry)

    // rewrite shortcuts.vdf
    const writeError = writeShortcutFile(shortcutsFile, content)

    if (writeError) {
      errors.push(writeError)
      continue
    }

    added = true
  }

  if (!added) {
    const errorMessage = errors.join('\n')
    logError(errorMessage, LogPrefix.Shortcuts)
    showErrorInFrontend({
      gameTitle: appName,
      error: errorMessage,
    })
    return false
  }

  if (errors.length === 0) {
    logInfo(`${appName} was successfully added to Steam.`, LogPrefix.Shortcuts)

    const message = i18next.t('notify.finished.add.steam.success', {
      defaultValue:
        '{{game}} was successfully added to Steam. A restart of Steam is required for changes to take effect.',
      game: appName,
    })
    notifyFrontend({ message, adding: true })
    return true
  } else {
    logWarning(
      `${appName} could not be added to all found Steam users.`,
      LogPrefix.Shortcuts
    )
    logError(errors.join('\n'), LogPrefix.Shortcuts)

    const message = i18next.t('notify.finished.add.steam.corrupt', {
      defaultValue:
        '{{game}} could not be added to all found Steam users. See logs for more info. A restart of Steam is required for changes to take effect.',
      game: appName,
    })
    notifyFrontend({ message, adding: true })
    return true
  }
}

/**
 * Removes a non-steam game from steam via editing shortcuts.vdf
 * @param gameInfo @see GameInfo of the game to remove
 * @param steamUserdataDir Path to steam userdata directory, optional
 * @returns none
 */
async function removeNonSteamApp(appInfo: AppInfo): Promise<void> {
  const steamUserdataDir = await getSteamUserdataDir()
  const { folders, error } = checkSteamUserDataDir(steamUserdataDir)

  // we don't show a error here.
  // If someone changes the steam path to a invalid one
  // we just assume it is removed
  if (error) {
    logWarning(error, LogPrefix.Shortcuts)
    return
  }

  const errors = []
  let removed = false
  for (const folder of folders) {
    const configDir = join(steamUserdataDir, folder, 'config')
    const shortcutsFile = join(configDir, 'shortcuts.vdf')

    if (!existsSync(configDir) || !existsSync(shortcutsFile)) {
      continue
    }

    // read file
    const content = readShortcutFile(shortcutsFile)
    const checkResult = checkIfShortcutObjectIsValid(content)
    if (!checkResult.success) {
      errors.push(
        `Can't remove "${appInfo.name}" from Steam user "${folder}". "${shortcutsFile}" is corrupted!`,
        ...checkResult.errors
      )
      continue
    }
    // This is just to make TS happy, in reality checkIfShortcutObjectIsValid already checks for this array
    content.shortcuts = content.shortcuts || []

    const index = checkIfAlreadyAdded(content, appInfo.name)

    if (index < 0) {
      continue
    }
    const shortcutObj = content.shortcuts.at(index)!

    const exe = shortcutObj.Exe
    const appName = shortcutObj.AppName

    // remove
    content.shortcuts.splice(index, 1)

    // rewrite shortcuts.vdf
    const writeError = writeShortcutFile(shortcutsFile, content)

    if (writeError) {
      errors.push(writeError)
      continue
    }

    removed = true

    removeImagesFromSteam({
      steamUserConfigDir: configDir,
      appID: {
        bigPictureAppID: generateAppId(exe, appName),
        otherGridAppID: generateShortAppId(exe, appName),
      },
      gameInfo: appInfo,
    })
  }

  if (errors.length === 0) {
    // game was not on any steam shortcut
    // nothing to notify
    if (!removed) {
      return
    }

    logInfo(
      `${appInfo.name} was successfully removed from Steam.`,
      LogPrefix.Shortcuts
    )

    const message = i18next.t('notify.finished.remove.steam.success', {
      defaultValue:
        '{{game}} was successfully removed from Steam. A restart of Steam is required for changes to take effect.',
      game: appInfo.name,
    })
    notifyFrontend({ message, adding: false })
  } else {
    logWarning(
      `${appInfo.name} could not be removed from all found Steam users.`,
      LogPrefix.Shortcuts
    )
    logError(errors.join('\n'), LogPrefix.Shortcuts)

    const message = i18next.t('notify.finished.remove.steam.corrupt', {
      defaultValue:
        '{{game}} could not be removed from all found Steam users. See logs for more info. A restart of Steam is required for changes to take effect.',
      game: appInfo.name,
    })
    notifyFrontend({ message, adding: false })
  }
}

/**
 * Checks if a game was added to shortcuts.vdf
 * @param gameInfo @see GameInfo of the game to check
 * @param steamUserdataDir Path to steam userdata directory, optional
 * @returns boolean
 */
async function isAppAddedToSteam(props: {
  title: string
  steamUserdataDir?: string
}): Promise<boolean> {
  const steamUserdataDir =
    props.steamUserdataDir || (await getSteamUserdataDir())

  const { folders, error } = checkSteamUserDataDir(steamUserdataDir)

  if (error) {
    return false
  }

  let added = false
  for (const folder of folders) {
    const configDir = join(steamUserdataDir, folder, 'config')
    const shortcutsFile = join(configDir, 'shortcuts.vdf')

    if (!existsSync(configDir) || !existsSync(shortcutsFile)) {
      continue
    }

    // read file
    const content = readShortcutFile(shortcutsFile)
    const checkResult = checkIfShortcutObjectIsValid(content)
    if (!checkResult.success) {
      continue
    }

    const index = checkIfAlreadyAdded(content, props.title)

    if (index < 0) {
      continue
    }

    added = true
  }

  return added
}

export { removeNonSteamApp, isAppAddedToSteam, addNonSteamApp }
