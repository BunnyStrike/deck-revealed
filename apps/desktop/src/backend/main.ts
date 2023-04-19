import path, { join } from 'path'
import { BrowserWindow, app, ipcMain, protocol } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'

import { type GamepadInputEvent } from '~/common/types'
import { GlobalConfig } from './config'
import {
  configStore,
  customThemesWikiLink,
  discordLink,
  epicLoginUrl,
  isCLINoGui,
  kofiPage,
  patreonPage,
  publicDir,
  revealedGithubURL,
  sidInfoUrl,
  supportURL,
  weblateUrl,
  wikiLink,
  wineprefixFAQ,
} from './constants'
import {
  initializeApp,
  initializeWindow,
  processZoomForScreen,
} from './initialize'
import { LogPrefix, logInfo, logWarning } from './logger/logger'
import { initTrayIcon } from './tray-icon/trayIcon'
import { initOnlineMonitor, runOnceWhenOnline } from './utils/onlineMonitor'
import { openUrlOrFile } from './utils/openUrlOrFile'
import { handleProtocol } from './utils/protocol'
import { getSystemInfo } from './utils/systemInfo'
import { getMainWindow } from './windows/mainWindow'
import { showAboutWindow } from './windows/showAboutWindow'

const gotTheLock = app.requestSingleInstanceLock()
const preload = path.join(__dirname, './preload.js')
const url = process.env['VITE_DEV_SERVER_URL'] ?? 'http://localhost:3100'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

app.on('ready', () => {
  initializeApp()
})
