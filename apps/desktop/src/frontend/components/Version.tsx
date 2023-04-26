import React, { useContext, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
// import ContextProvider from 'frontend/state/ContextProvider'
import { useTranslation } from 'react-i18next'

// import { ChangelogModal } from '../../../ChangelogModal'
import { changelogLastShownAtom } from '../states'
import { api } from '../utils/api'
import { VersionChangelogModel } from './VersionChangelogModel'

type Release = {
  html_url: string
  name: string
  tag_name: string
  published_at: string
  type: 'stable' | 'beta'
  id: number
  body?: string
}

const storage = window.localStorage
const lastVersion = storage.getItem('last_version')?.replaceAll('"', '')

export default React.memo(function RevealedVersion() {
  const { t } = useTranslation()
  const [lastChangelogShown, setLastChangelogShown] = useAtom(
    changelogLastShownAtom
  )
  // const [newReleases, setNewReleases] = useState<Release[]>()
  const [showChangelogModal, setShowChangelogModal] = useState(true)
  const { data: newReleases } = api.desktop.system.getLatestReleases.useQuery() // Release[]
  const { data: version } = api.desktop.system.getRevealedVersion.useQuery() // Release[]
  const { mutate: openExternalUrl } =
    api.desktop.system.openExternalUrl.useMutation() // Release[]
  const { mutate: logInfo } = api.desktop.logger.logInfo.useMutation() // Release[]
  const { mutate: clearCache } = api.desktop.system.clearCache.useMutation() // Release[]
  const [showChangelogModalOnClick, setShowChangelogModalOnClick] =
    useState(false)

  const hideChangelogsOnStartup = false

  // const { hideChangelogsOnStartup, lastChangelogShown, setLastChangelogShown } =
  //   useContext(ContextProvider)

  useEffect(() => {
    if (version !== lastVersion) {
      logInfo({ message: 'Updated to a new version, cleaaning up the cache.' })
      clearCache()
    }
    storage.setItem('last_version', JSON.stringify(version))
  }, [newReleases])

  const newStable: Release | undefined = newReleases?.filter(
    (r) => r.type === 'stable'
  )[0]
  const newBeta: Release | undefined = newReleases?.filter(
    (r) => r.type === 'beta'
  )[0]
  const shouldShowUpdates = newBeta || newStable

  return (
    <>
      {/* <VersionChangelogModel
        dimissVersionCheck
        version={version}
        isOpen={
          (showChangelogModal &&
            !hideChangelogsOnStartup &&
            version !== lastChangelogShown) ||
          showChangelogModalOnClick
        }
        onClose={() => {
          setShowChangelogModal(false)
          setShowChangelogModalOnClick(false)
          setLastChangelogShown(version)
        }}
      /> */}

      <span
        className='revealedVersion flex cursor-pointer items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300 hover:text-gray-600'
        role='link'
        // title={t(
        //   'info.revealed.click-to-see-changelog',
        //   'Click to see changelog'
        // )}
        onClick={() => setShowChangelogModalOnClick((current) => !current)}
      >
        <span className='revealedVersion__title hidden sm:inline'>
          <span>{t('info.revealed.version', 'Version')}: </span>
        </span>
        <strong>{version}</strong>
      </span>
      {shouldShowUpdates && (
        <div className='revealedNewReleases'>
          <span>{t('info.revealed.newReleases', 'Update Available!')}</span>
          {newStable && (
            <a
              title={newStable.tag_name}
              onClick={() => openExternalUrl({ url: newStable.html_url })}
            >
              {t('info.revealed.stable', 'Stable')} ({newStable.tag_name})
            </a>
          )}
          {newBeta && (
            <a
              title={newBeta.tag_name}
              onClick={() => openExternalUrl({ url: newBeta.html_url })}
            >
              {t('info.revealed.beta', 'Beta')} ({newBeta.tag_name})
            </a>
          )}
        </div>
      )}
    </>
  )
})
