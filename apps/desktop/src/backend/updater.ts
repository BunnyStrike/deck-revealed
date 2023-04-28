import { dialog, nativeImage, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { t } from 'i18next'

import { icon } from './constants'
import { showDialogBoxModalAuto } from './dialog/dialog'
import { LogPrefix, logError } from './logger/logger'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

// eslint-disable-next-line @typescript-eslint/no-misused-promises
autoUpdater.on('update-available', async () => {
  const { response, checkboxChecked } = await dialog.showMessageBox({
    title: t('box.info.update.title', 'Revealed') ?? 'Revealed',
    message: t('box.info.update.message', 'There is a new Version available!'),
    detail:
      t(
        'box.info.update.detail',
        'Do you want to download the update in the background?'
      ) ?? 'Do you want to download the update in the background?',
    checkboxLabel:
      t('box.info.update.changelog', 'Open changelog') ?? 'Open changelog',
    checkboxChecked: false,
    icon: nativeImage.createFromPath(icon),
    buttons: [t('box.no'), t('box.yes')],
  })
  if (checkboxChecked) {
    await shell.openExternal('https://github.com/BunnyStrike/revealed/releases')
  }
  if (response === 1) {
    await autoUpdater.downloadUpdate()
  }
})
// eslint-disable-next-line @typescript-eslint/no-misused-promises
autoUpdater.on('update-downloaded', async () => {
  const { response } = await dialog.showMessageBox({
    title:
      t('box.info.update.title-finished', 'Update Finished') ??
      'Update Finished',
    message: t(
      'box.info.update.message-finished',
      'Do you want to restart Revealed now?'
    ),
    buttons: [t('box.no'), t('box.yes')],
  })

  if (response === 1) {
    return autoUpdater.quitAndInstall()
  }

  autoUpdater.autoInstallOnAppQuit = true
})

autoUpdater.on('error', (error) => {
  showDialogBoxModalAuto({
    title: t('box.error.update.title', 'Update Error'),
    message: t(
      'box.error.update.message',
      'Something went wrong with the update, please check the logs or try again later!'
    ),
    type: 'ERROR',
  })
  logError(['failed to update', error], LogPrefix.Backend)
})
