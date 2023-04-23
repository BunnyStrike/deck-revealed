import i18next from 'i18next'

import { showDialogBoxModalAuto } from '../dialog/dialog'
import { deleteAbortController } from './aborthandler'

export async function clearCache(showDialog?: boolean) {
  // GOGapiInfoCache.clear()
  // GOGlibraryStore.clear()
  // GOGinstallInfoStore.clear()
  // installStore.clear()
  // libraryStore.clear()
  // gameInfoStore.clear()
  // appStore.clear()

  // TODO:
  // const abortID = 'legendary-cleanup'
  // runLegendaryCommand(['cleanup'], createAbortController(abortID)).then(() =>
  //   deleteAbortController(abortID)
  // )

  if (showDialog) {
    showDialogBoxModalAuto({
      event: undefined,
      title: i18next.t('box.cache-cleared.title', 'Cache Cleared'),
      message: i18next.t(
        'box.cache-cleared.message',
        'Revealed Cache Was Cleared!'
      ),
      type: 'MESSAGE',
      buttons: [{ text: i18next.t('box.ok', 'Ok') }],
    })
  }
}
