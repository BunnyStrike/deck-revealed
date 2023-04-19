import { shell } from 'electron'
import { existsSync } from 'graceful-fs'

import { LogPrefix, logError } from '../logger/logger'

export function showItemInFolder(item: string) {
  if (existsSync(item)) {
    try {
      shell.showItemInFolder(item)
    } catch (error) {
      logError(
        ['Failed to show item in folder with:', error],
        LogPrefix.Backend
      )
    }
  }
}
