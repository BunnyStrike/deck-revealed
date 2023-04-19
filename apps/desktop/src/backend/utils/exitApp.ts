import { join } from 'path'
import { app, dialog } from 'electron'
import { existsSync } from 'graceful-fs'
import i18next, { t } from 'i18next'

import { revealedGamesConfigPath } from '../constants'
import { logInfo } from '../logger/logger'
import { getMainWindow } from '../windows/mainWindow'
import { callAllAbortControllers } from './aborthandler'
import { killPattern } from './killPattern'

const { showMessageBox } = dialog

export async function exitApp() {
  const isLocked = existsSync(join(revealedGamesConfigPath, 'lock'))
  const mainWindow = getMainWindow()

  if (isLocked && mainWindow) {
    const { response } = await showMessageBox(mainWindow, {
      buttons: [i18next.t('box.no'), i18next.t('box.yes')],
      message: i18next.t(
        'box.quit.message',
        'There are pending operations, are you sure?'
      ),
      title: i18next.t('box.quit.title', 'Exit') ?? 'Exit',
    })

    if (response === 0) {
      return
    }

    // This is very hacky and can be removed if gogdl
    // and legendary handle SIGTERM and SIGKILL
    const possibleChildren = ['legendary', 'gogdl']
    possibleChildren.forEach((procName) => {
      try {
        killPattern(procName)
      } catch (error) {
        logInfo([`Unable to kill ${procName}, ignoring.`, error])
      }
    })

    // Kill all child processes
    callAllAbortControllers()
  }
  app.exit()
}
