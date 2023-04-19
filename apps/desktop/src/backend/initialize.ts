import { createHash } from 'crypto'
import path, { join } from 'path'
import axios from 'axios'
import {
  Menu,
  app,
  autoUpdater,
  ipcMain,
  protocol,
  screen,
  type BrowserWindow,
} from 'electron'
import { createWriteStream, existsSync, mkdirSync } from 'graceful-fs'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'

import { GlobalConfig } from './config'
import {
  configStore,
  createNecessaryFolders,
  icon,
  imagesCachePath,
  isCLIFullscreen,
  isCLINoGui,
  isMac,
  isSteamDeckGameMode,
  isWindows,
  publicDir,
  supportedLanguages,
  userHome,
} from './constants'
import { LogPrefix, logInfo, logWarning } from './logger/logger'
import { initTrayIcon } from './tray-icon/trayIcon'
import { detectVCRedist } from './utils/detectVCRedist'
import { exitApp } from './utils/exitApp'
import { initOnlineMonitor, runOnceWhenOnline } from './utils/onlineMonitor'
import { handleProtocol } from './utils/protocol'
import { getSystemInfo } from './utils/systemInfo'
import { createMainWindow, getMainWindow } from './windows/mainWindow'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const gotTheLock = app.requestSingleInstanceLock()

const devServerUrl =
  process.env['VITE_DEV_SERVER_URL'] ?? 'http://localhost:3100' // 'http://localhost:5173'
const devServerPort = 3100

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

export const processZoomForScreen = (zoomFactor: number) => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize.width
  if (screenSize < 1200) {
    const extraDPIZoomIn = screenSize / 1200
    return zoomFactor * extraDPIZoomIn
  } else {
    return zoomFactor
  }
}

const init = async () => {
  // GlobalConfig.get()
  createNecessaryFolders()
  configStore.set('userHome', userHome)
}

export async function initializeWindow(): Promise<BrowserWindow> {
  console.log('---------------Initializing window---------------')
  // await init()
  const mainWindow = createMainWindow()

  // if ((isSteamDeckGameMode || isCLIFullscreen) && !isCLINoGui) {
  //   logInfo(
  //     [
  //       isSteamDeckGameMode
  //         ? 'Revealed started via Steam-Deck gamemode.'
  //         : 'Revealed started with --fullscreen',
  //       'Switching to fullscreen',
  //     ],
  //     LogPrefix.Backend
  //   )
  //   mainWindow.setFullScreen(true)
  // }
  console.log('-----------------  Instance 1 -----------------')

  setTimeout(() => {
    // DXVK.getLatest()
    // Winetricks.download()
  }, 2500)

  // GlobalConfig.get()
  // LegendaryLibrary.get()
  // GOGLibrary.get()

  // mainWindow.setIcon(icon)
  // app.setAppUserModelId('Revealed')
  // app.commandLine.appendSwitch('enable-spatial-navigation')

  // mainWindow.on('close', (e) => {
  //   console.log('----------------- Close Instance -----------------')
  //   e.preventDefault()

  //   if (!isCLIFullscreen && !isSteamDeckGameMode) {
  //     // store windows properties
  //     configStore.set('window-props', mainWindow.getBounds())
  //   }

  //   const { exitToTray } = GlobalConfig.get().getSettings()

  //   if (exitToTray) {
  //     logInfo('Exitting to tray instead of quitting', LogPrefix.Backend)
  //     return mainWindow.hide()
  //   }

  //   exitApp()
  // })

  if (isWindows) {
    detectVCRedist(mainWindow)
  }
  console.log('-----------------  Instance 2 -----------------')

  if (!app.isPackaged) {
    if (!process.env.REVEALED_NO_REACT_DEVTOOLS) {
      await import('electron-devtools-installer').then((devtools) => {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = devtools

        installExtension(REACT_DEVELOPER_TOOLS).catch((err: string) => {
          logWarning(['An error occurred: ', err], LogPrefix.Backend)
        })
      })
    }
    try {
      await mainWindow.loadURL(devServerUrl)
    } catch (error) {
      console.log('---------------', error, '----------------')
    }
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  } else {
    Menu.setApplicationMenu(null)

    // if (url) {
    //   mainWindow.loadURL(url)
    // } else {
    //   mainWindow.loadFile(path.join(process.env.DIST ?? '', 'index.html'))
    // }

    await mainWindow.loadURL(
      `file://${path.join(publicDir, '../build/index.html')}`
    )
    // await mainWindow.loadFile(path.join(process.env.DIST ?? '', 'index.html'))
    if (!isMac) {
      autoUpdater.checkForUpdates()
    }
  }
  console.log('-----------------  Instance 3 -----------------')

  // mainWindow.webContents.setWindowOpenHandler((details) => {
  //   const pattern = app.isPackaged ? publicDir : `localhost:${devServerPort}`
  //   return { action: !details.url.match(pattern) ? 'allow' : 'deny' }
  // })

  // ipcMain.on('setZoomFactor', (event, zoomFactor) => {
  //   mainWindow.webContents.setZoomFactor(
  //     processZoomForScreen(parseFloat(zoomFactor))
  //   )
  // })
  console.log('-----------------  Instance 4 -----------------')

  return mainWindow
}

export const initializeApp = () => {
  if (!gotTheLock) {
    logInfo('Revealed is already running, quitting this instance')
    app.quit()
    return
  }

  console.log('----------------- Initializing app -----------------')

  app.on('second-instance', (event, argv) => {
    console.log('----------------- Second Instance -----------------')
    // Someone tried to run a second instance, we should focus our window.
    const mainWindow = getMainWindow()
    mainWindow?.show()

    handleProtocol(argv)
  })
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  app.whenReady().then(async () => {
    console.log('----------------- Instance Ready -----------------')
    // initOnlineMonitor()

    getSystemInfo().then((systemInfo) =>
      logInfo(`\n\n${systemInfo}\n`, LogPrefix.Backend)
    )

    // initImagesCache()

    // logInfo(
    //   ['Legendary location:', join(...Object.values(getLegendaryBin()))],
    //   LogPrefix.Legendary
    // )
    // logInfo(
    //   ['GOGDL location:', join(...Object.values(getGOGdlBin()))],
    //   LogPrefix.Gog
    // )

    // TODO: Remove this after a couple of stable releases
    // Affects only current users, not new installs
    // const settings = GlobalConfig.get().getSettings()
    // const { language } = settings
    // const currentConfigStore = configStore.get_nodefault('settings')
    // if (!currentConfigStore?.defaultInstallPath) {
    //   configStore.set('settings', settings)
    // }

    // runOnceWhenOnline(async () => {
    //   const isLoggedIn = false // LegendaryUser.isLoggedIn()

    //   if (!isLoggedIn) {
    //     logInfo('User Not Found, removing it from Store', LogPrefix.Backend)
    //     configStore.delete('userInfo')
    //   }

    //   // // Update user details
    //   // if (GOGUser.isLoggedIn()) {
    //   //   GOGUser.getUserDetails()
    //   // }
    // })

    // await i18next.use(Backend).init({
    //   backend: {
    //     addPath: path.join(publicDir, 'locales', '{{lng}}', '{{ns}}'),
    //     allowMultiLoading: false,
    //     loadPath: path.join(publicDir, 'locales', '{{lng}}', '{{ns}}.json'),
    //   },
    //   debug: false,
    //   returnEmptyString: false,
    //   returnNull: false,
    //   fallbackLng: 'en',
    //   lng: 'en', // language ?? 'en',
    //   supportedLngs: supportedLanguages,
    // })

    // GOGUser.migrateCredentialsConfig()
    const mainWindow = await initializeWindow()

    console.log('-----------------  Instance 5 -----------------')

    // protocol.registerStringProtocol('revealed', (request, callback) => {
    //   void handleProtocol([request.url])
    //   callback('Operation initiated.')
    // })
    console.log('-----------------  Instance 6 -----------------')

    // if (!app.isDefaultProtocolClient('revealed')) {
    //   if (app.setAsDefaultProtocolClient('revealed')) {
    //     logInfo('Registered protocol with OS.', LogPrefix.Backend)
    //   } else {
    //     logWarning('Failed to register protocol with OS.', LogPrefix.Backend)
    //   }
    // } else {
    //   logWarning('Protocol already registered.', LogPrefix.Backend)
    // }
    console.log('-----------------  Instance 7 -----------------')

    const { startInTray } = GlobalConfig.get().getSettings()
    const headless = isCLINoGui || startInTray
    if (!headless) {
      // ipcMain.once('loadingScreenReady', () => mainWindow.show())
      mainWindow.show()
    }
    console.log('-----------------  Instance 8 -----------------')

    // set initial zoom level after a moment, if set in sync the value stays as 1
    // setTimeout(() => {
    //   const zoomFactor = configStore.get('zoomPercent', 100) / 100

    //   mainWindow.webContents.setZoomFactor(processZoomForScreen(zoomFactor))
    // }, 200)
    console.log('-----------------  Instance 9 -----------------')

    // ipcMain.on('changeLanguage', async (event, language) => {
    //   logInfo(['Changing Language to:', language], LogPrefix.Backend)
    //   await i18next.changeLanguage(language)
    //   // gameInfoStore.clear()
    // })

    // downloadAntiCheatData()

    // await initTrayIcon(mainWindow)

    return
  })
}

export const initImagesCache = () => {
  // make sure we have a folder to store the cache
  if (!existsSync(imagesCachePath)) {
    mkdirSync(imagesCachePath)
  }

  // use a fake protocol for images we want to cache
  protocol.registerFileProtocol('imagecache', (request, callback) => {
    callback({ path: getImageFromCache(request.url) })
  })
}

const getImageFromCache = (url: string) => {
  const realUrl = url.replace('imagecache://', '')
  // digest of the image url for the file name
  const digest = createHash('sha256').update(realUrl).digest('hex')
  const cachePath = join(imagesCachePath, digest)

  if (!existsSync(cachePath) && realUrl.startsWith('http')) {
    // if not found, download in the background
    axios
      .get(realUrl, { responseType: 'stream' })
      .then((response) => response.data.pipe(createWriteStream(cachePath)))
  }

  return join(cachePath)
}
