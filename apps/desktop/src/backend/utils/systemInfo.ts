// This won't change while the app is running

import { type ExecException } from 'child_process'
import { dialog } from 'electron'
import * as fileSize from 'filesize'
import i18next from 'i18next'
import si from 'systeminformation'

import { type Runner } from '~/common/types'
import { isMac } from '../constants'
import { showDialogBoxModalAuto } from '../dialog/dialog'
import { LogPrefix, logError, logInfo } from '../logger/logger'
import { execAsync } from './execAsync'
import {
  getGogdlVersion,
  getLegendaryVersion,
  getRevealedVersion,
} from './version'

const getFileSize = fileSize.partial({ base: 2 })

const { showErrorBox, showMessageBox } = dialog

function getGame(appName: string, runner: Runner) {
  switch (runner) {
    // case 'legendary':
    //   return { title: 'Coming Soon' } // LegendaryGame.get(appName)
    default:
      return {
        getGameInfo: () => ({ title: 'Coming Soon' }),
        forceUninstall: () => console.log('soon'),
      } // GOGGame.get(appName)
  }
}

// Caching significantly increases performance when launching games
let systemInfoCache = ''
export const getSystemInfo = async () => {
  if (systemInfoCache !== '') {
    return systemInfoCache
  }
  const revealedVersion = getRevealedVersion()
  const legendaryVersion = await getLegendaryVersion()
  const gogdlVersion = await getGogdlVersion()

  const electronVersion = process.versions.electron || 'unknown'
  const chromeVersion = process.versions.chrome || 'unknown'
  const nodeVersion = process.versions.node || 'unknown'

  // get CPU and RAM info
  const { manufacturer, brand, speed, governor } = await si.cpu()
  const { total, available } = await si.mem()

  // get OS information
  const { distro, kernel, arch, platform, release, codename } =
    await si.osInfo()

  // get GPU information
  const { controllers } = await si.graphics()
  const graphicsCards = String(
    controllers.map(
      ({ name, model, vram, driverVersion }, i) =>
        `GPU${i}: ${name ? name : model} ${vram ? `VRAM: ${vram}MB` : ''} ${
          driverVersion ? `DRIVER: ${driverVersion}` : ''
        } \n`
    )
  )
    .replaceAll(',', '')
    .replaceAll('\n', '')

  const isLinux = platform === 'linux'
  const xEnv = isLinux
    ? (await execAsync('echo $XDG_SESSION_TYPE')).stdout.replaceAll('\n', '')
    : ''

  systemInfoCache = `Revealed Version: ${revealedVersion}
Legendary Version: ${legendaryVersion}
GOGdl Version: ${gogdlVersion}

Electron Version: ${electronVersion}
Chrome Version: ${chromeVersion}
NodeJS Version: ${nodeVersion}

OS: ${isMac ? `${codename} ${release}` : distro} KERNEL: ${kernel} ARCH: ${arch}
CPU: ${manufacturer} ${brand} @${speed} ${
    governor ? `GOVERNOR: ${governor}` : ''
  }
RAM: Total: ${getFileSize(total)} Available: ${getFileSize(available)}
GRAPHICS: ${graphicsCards}
${isLinux ? `PROTOCOL: ${xEnv}` : ''}`
  return systemInfoCache
}

type ErrorHandlerMessage = {
  error?: string
  logPath?: string
  appName?: string
  runner: string
}

async function errorHandler({
  error,
  logPath,
  runner: r,
  appName,
}: ErrorHandlerMessage): Promise<void> {
  const noSpaceMsg = 'Not enough available disk space'
  const plat = r === 'legendary' ? 'Legendary (Epic Games)' : r
  const deletedFolderMsg = 'appears to be deleted'
  const expiredCredentials = 'No saved credentials'
  const legendaryRegex = /legendary.*\.py/

  if (logPath) {
    execAsync(`tail "${logPath}" | grep 'disk space'`)
      .then(async ({ stdout }) => {
        if (stdout.includes(noSpaceMsg)) {
          logError(noSpaceMsg, LogPrefix.Backend)
          return showDialogBoxModalAuto({
            title:
              i18next.t('box.error.diskspace.title', 'No Space') ?? 'No Space',
            message: i18next.t(
              'box.error.diskspace.message',
              'Not enough available disk space'
            ),
            type: 'ERROR',
          })
        }
      })
      .catch((err: ExecException) => {
        // Grep returns 1 when it didn't find any text, which is fine in this case
        if (err.code !== 1) logInfo('operation interrupted', LogPrefix.Backend)
      })
  }
  if (error) {
    if (error.includes(deletedFolderMsg) && appName) {
      const runner = r.toLocaleLowerCase() as Runner
      const game = getGame(appName, runner)
      const { title } = game.getGameInfo()
      const { response } = await showMessageBox({
        type: 'question',
        title,
        message: i18next.t(
          'box.error.folder-not-found.title',
          'Game folder appears to be deleted, do you want to remove the game from the installed list?'
        ),
        buttons: [i18next.t('box.no'), i18next.t('box.yes')],
      })

      if (response === 1) {
        return game.forceUninstall()
      }
    }

    if (legendaryRegex.test(error)) {
      return showDialogBoxModalAuto({
        title: plat,
        message: i18next.t(
          'box.error.legendary.generic',
          'An error has occurred! Try to Logout and Login on your Epic account. {{newline}}  {{error}}',
          { error, newline: '\n' }
        ),
        type: 'ERROR',
      })
    }

    if (error.includes(expiredCredentials)) {
      return showDialogBoxModalAuto({
        title: plat,
        message: i18next.t(
          'box.error.credentials.message',
          'Your Crendentials have expired, Logout and Login Again!'
        ),
        type: 'ERROR',
      })
    }
  }
}
