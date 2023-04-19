import { app } from 'electron'

import { createAbortController, deleteAbortController } from './aborthandler'

// import { runLegendaryCommand } from './legendary/library'
// import { runGogdlCommand } from './gog/library'

export const getRevealedVersion = () => {
  const VERSION_NUMBER = app.getVersion()
  const BETA_VERSION_NAME = 'Caesar Clown'
  const STABLE_VERSION_NAME = 'Trafalgar Law'
  const isBetaorAlpha =
    VERSION_NUMBER.includes('alpha') || VERSION_NUMBER.includes('beta')
  const VERSION_NAME = isBetaorAlpha ? BETA_VERSION_NAME : STABLE_VERSION_NAME

  return `${VERSION_NUMBER} ${VERSION_NAME}`
}

export const getLegendaryVersion = async () => {
  // const abortID = 'legendary-version'
  // const { stdout, error, abort } = await runLegendaryCommand(
  //   ['--version'],
  //   createAbortController(abortID)
  // )

  // deleteAbortController(abortID)

  // if (error || abort) {
  //   return 'invalid'
  // }

  // return stdout
  //   .split('legendary version')[1]
  //   .replaceAll('"', '')
  //   .replaceAll(', codename', '')
  //   .replaceAll('\n', '')
  return 'invalid'
}

export const getGogdlVersion = async () => {
  // const abortID = 'gogdl-version'
  // const { stdout, error } = await runGogdlCommand(['--version'], createAbortController(abortID))

  // deleteAbortController(abortID)

  // if (error) {
  //   return 'invalid'
  // }

  // return stdout
  return 'invalid'
}
