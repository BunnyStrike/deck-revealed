import { dirname, join } from 'path'
import { existsSync } from 'graceful-fs'

import { type WineInstallation } from '~/common/types'
import { LogPrefix, logError } from '../logger/logger'

export function getWineFromProton(
  wineVersion: WineInstallation,
  winePrefix: string
): { winePrefix: string; wineBin: string } {
  if (wineVersion.type !== 'proton') {
    return { winePrefix, wineBin: wineVersion.bin }
  }

  winePrefix = join(winePrefix, 'pfx')

  // GE-Proton & Proton Experimental use 'files', Proton 7 and below use 'dist'
  for (const distPath of ['dist', 'files']) {
    const protonBaseDir = dirname(wineVersion.bin)
    const wineBin = join(protonBaseDir, distPath, 'bin', 'wine')
    if (existsSync(wineBin)) {
      return { wineBin, winePrefix }
    }
  }

  logError(
    [
      'Proton',
      wineVersion.name,
      'has an abnormal structure, unable to supply Wine binary!',
    ],
    LogPrefix.Backend
  )

  return { wineBin: '', winePrefix }
}
