// can be removed if legendary and gogdl handle SIGTERM and SIGKILL

import { spawnSync } from 'child_process'

import { isWindows } from '../constants'
import { LogPrefix, logInfo } from '../logger/logger'

// for us
export function killPattern(pattern: string) {
  logInfo(['Trying to kill', pattern], LogPrefix.Backend)
  let ret
  if (isWindows) {
    ret = spawnSync('Stop-Process', ['-name', pattern], {
      shell: 'powershell.exe',
    })
  } else {
    ret = spawnSync('pkill', ['-f', pattern])
  }
  logInfo(['Killed', pattern], LogPrefix.Backend)
  return ret
}
