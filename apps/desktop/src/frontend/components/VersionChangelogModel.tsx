import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
// import { Dialog, DialogContent, DialogHeader } from '../../../Dialog'
import ReactMarkdown from 'react-markdown'

import { DialogModal } from './Dialog'
import './index.scss'
import { api } from '../utils/api'

type Props = {
  onClose: () => void
  version?: string
  dimissVersionCheck?: boolean
}

const storage = window.localStorage
const lastChangelog = storage.getItem('last_changelog')?.replaceAll('"', '')

export function VersionChangelogModel({
  onClose,
  dimissVersionCheck,
  version,
}: Props) {
  const { data: currentChangelog } =
    api.desktop.system.getCurrentChangelog.useQuery()

  if (!currentChangelog && !(dimissVersionCheck || version !== lastChangelog)) {
    return <></>
  }

  return (
    <div className={classNames('changelogModal')}>
      <DialogModal onCancel={onClose} title={currentChangelog.name}>
        <div className={classNames('changelogModalContent')}>
          {currentChangelog.body && (
            <ReactMarkdown
              className='changelogModalContent'
              linkTarget={'_blank'}
            >
              {currentChangelog.body}
            </ReactMarkdown>
          )}
        </div>
      </DialogModal>
    </div>
  )
}
