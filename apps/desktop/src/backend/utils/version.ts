import * as axios from 'axios'
import { app } from 'electron'
import { t } from 'i18next'

import { type Release } from '~/common/types'
import { GITHUB_API } from '../constants'
import { notify } from '../dialog/dialog'
import { LogPrefix, logError, logInfo } from '../logger/logger'
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

/**
 * Compares 2 SemVer strings following "major.minor.patch".
 * Checks if target is newer than base.
 */
export function semverGt(target?: string, base?: string) {
  if (!target || !base) {
    return false
  }
  target = target.replace('v', '')

  // beta to beta
  if (base.includes('-beta') && target.includes('-beta')) {
    const bSplit = base.split('-beta.')
    const tSplit = target.split('-beta.')

    // same major beta?
    if (bSplit[0] === tSplit[0]) {
      base = bSplit[1]
      target = tSplit[1]
      return parseFloat(target ?? '') > parseFloat(base ?? '')
    } else {
      base = bSplit[0]
      target = tSplit[0]
    }
  }

  // beta to stable
  if (base?.includes('-beta')) {
    base = base.split('-beta.')[0]
  }

  // stable to beta
  if (target?.includes('-beta')) {
    target = target.split('-beta.')[0]
  }

  if (!base || !target) {
    return false
  }

  const [bmajor = 0, bminor = 0, bpatch = 0] = base?.split('.').map(Number)
  const [tmajor = 0, tminor = 0, tpatch = 0] = target?.split('.').map(Number)

  let isGE = false
  // A pretty nice piece of logic if you ask me. :P
  isGE ||= tmajor > bmajor
  isGE ||= tmajor === bmajor && tminor > bminor
  isGE ||= tmajor === bmajor && tminor === bminor && tpatch > bpatch
  return isGE
}

export const getLatestReleases = async (): Promise<Release[]> => {
  const newReleases: Release[] = []
  logInfo('Checking for new Revealed Updates', LogPrefix.Backend)

  // return []

  try {
    const { data: releases } = await axios.default.get(GITHUB_API)
    const latestStable: Release = releases.filter(
      (rel: Release) => rel.prerelease === false
    )[0]
    const latestBeta: Release = releases.filter(
      (rel: Release) => rel.prerelease === true
    )[0]

    const current = app.getVersion()

    const thereIsNewStable = semverGt(latestStable.tag_name, current)
    const thereIsNewBeta = semverGt(latestBeta.tag_name, current)

    if (thereIsNewStable) {
      newReleases.push({ ...latestStable, type: 'stable' })
    }
    if (thereIsNewBeta) {
      newReleases.push({ ...latestBeta, type: 'beta' })
    }

    if (newReleases.length) {
      notify({
        title: t('Update Available!'),
        body: t(
          'notify.new-revealed-version',
          'A new Revealed version was released!'
        ),
      })
    }

    return newReleases
  } catch (error) {
    logError(
      ['Error when checking for Revealed updates', error],
      LogPrefix.Backend
    )
    return []
  }
}
