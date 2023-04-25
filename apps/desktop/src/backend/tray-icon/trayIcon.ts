import EventEmitter from 'events'
import { Menu, Tray, ipcMain, nativeImage, type BrowserWindow } from 'electron'
import i18next from 'i18next'

import { type RecentGame } from '~/common/types'
import { GlobalConfig } from '../configs/config'
import { iconDark, iconLight } from '../constants'
import { LogPrefix, logInfo } from '../logger/logger'
// import { getRecentGames, maxRecentGames } from '../recent_games/recent_games'
import { exitApp } from '../utils/exitApp'
import { handleProtocol } from '../utils/protocol'
import { showAboutWindow } from '../windows/showAboutWindow'

export const backendEvents = new EventEmitter()

export const initTrayIcon = async (mainWindow: BrowserWindow) => {
  // create icon
  const appIcon = new Tray(getIcon(process.platform))

  // helper function to set/update the context menu
  const loadContextMenu = async (recentGames?: RecentGame[]) => {
    // if (!recentGames) {
    //   recentGames = await getRecentGames({ limited: true })
    // }

    appIcon.setContextMenu(contextMenu(mainWindow, []))
  }
  await loadContextMenu()

  appIcon.setToolTip('Revealed')

  // event listeners
  appIcon.on('double-click', () => {
    mainWindow.show()
  })

  ipcMain.on('changeLanguage', async () => {
    await loadContextMenu()
  })

  ipcMain.on('changeTrayColor', () => {
    logInfo('Changing Tray icon Color...', LogPrefix.Backend)
    setTimeout(async () => {
      appIcon.setImage(getIcon(process.platform))
      await loadContextMenu()
    }, 500)
  })

  backendEvents.on('recentGamesChanged', async (recentGames: RecentGame[]) => {
    const limit = 3 // await maxRecentGames()
    if (recentGames.length > limit) {
      recentGames = recentGames.slice(0, limit)
    }
    await loadContextMenu(recentGames)
  })

  return appIcon
}

const iconSizesByPlatform = new Map()
iconSizesByPlatform.set('darwin', {
  width: 20,
  height: 20,
})
iconSizesByPlatform.set('linux', {
  width: 32,
  height: 32,
})
iconSizesByPlatform.set('win32', {
  width: 32,
  height: 32,
})

// get the icon path based on platform and settings
const getIcon = (platform = process.platform) => {
  const settings = GlobalConfig.get().getSettings()
  const { darkTrayIcon } = settings

  return nativeImage
    .createFromPath(darkTrayIcon ? iconDark : iconLight)
    .resize(
      iconSizesByPlatform.get(platform) ?? iconSizesByPlatform.get('linux')
    )
}

// generate the context menu
const contextMenu = (
  mainWindow: BrowserWindow,
  recentGames: RecentGame[],
  platform = process.platform
) => {
  const recentsMenu = recentGames.map((game) => {
    return {
      click: function () {
        handleProtocol([`revealed://launch/${game.appName}`])
      },
      label: game.title,
    }
  })

  return Menu.buildFromTemplate([
    ...recentsMenu,
    { type: 'separator' },
    {
      click: function () {
        mainWindow.show()
      },
      label: i18next.t('tray.show') ?? 'Show',
    },
    {
      click: function () {
        showAboutWindow()
      },
      label: i18next.t('tray.about', 'About') ?? 'About',
    },
    {
      accelerator: platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
      click: function () {
        mainWindow.reload()
      },
      label: i18next.t('tray.reload', 'Reload') ?? 'Reload',
    },
    {
      label: 'Debug',
      accelerator: platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
      click: () => {
        mainWindow.webContents.openDevTools()
      },
    },
    {
      click: function () {
        exitApp()
      },
      label: i18next.t('tray.quit', 'Quit') ?? 'Quit',
      accelerator: platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
    },
  ])
}

// Exported only for testing purpose
// ts-prune-ignore-next
export const testingExportsTrayIcon = {
  contextMenu,
  getIcon,
}
