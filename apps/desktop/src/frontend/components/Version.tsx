import React, { useContext, useEffect, useState } from 'react'
import { IconDownload } from '@tabler/icons-react'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

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

export default React.memo(function RevealedVersion() {
  const { t } = useTranslation()
  const [lastChangelogShown, setLastChangelogShown] = useAtom(
    changelogLastShownAtom
  )
  const [showChangelogModal, setShowChangelogModal] = useState(false)
  const { data: version } = api.desktop.system.getRevealedVersion.useQuery()
  const { mutate: openExternalUrl } =
    api.desktop.system.openExternalUrl.useMutation()
  const { mutate: logInfo } = api.desktop.logger.logInfo.useMutation()
  const { mutate: clearCache } = api.desktop.system.clearCache.useMutation()
  const { data: currentChangelog } =
    api.desktop.system.getCurrentChangelog.useQuery(undefined, {
      staleTime: 1000,
    })

  useEffect(() => {
    const ignoreVersion = storage.getItem('ignore_version')
    if (
      !!currentChangelog &&
      currentChangelog?.updateAvailable &&
      ignoreVersion !== currentChangelog?.name
    ) {
      setShowChangelogModal(true)
    }
  }, [currentChangelog])

  return (
    <>
      <VersionChangelogModel
        dimissVersionCheck
        currentChangelog={currentChangelog}
        version={version}
        isOpen={showChangelogModal}
        onClose={() => {
          setShowChangelogModal(false)
        }}
      />
      <div
        className='revealedVersion flex cursor-pointer items-center justify-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300 hover:text-gray-600'
        role='link'
        title={
          t('info.revealed.click-to-see-changelog', 'Click to see changelog') ||
          'Click to see changelog'
        }
        onClick={() => setShowChangelogModal(true)}
      >
        <strong className='flex gap-1'>
          {version}
          {currentChangelog?.updateAvailable && (
            <IconDownload className='text-primary' size={20} />
          )}
        </strong>
      </div>
    </>
  )
})
