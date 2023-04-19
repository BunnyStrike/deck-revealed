import React from 'react'
import { useTranslation } from 'react-i18next'

import { api } from '../utils/api'

export const RevealedOfflineMessage = () => {
  const { t } = useTranslation()
  const { data: connectivity } = api.desktop.connectivity.status.useQuery()
  const { mutate } = api.desktop.connectivity.setStatus.useMutation()

  if (connectivity?.status === 'online') {
    return <></>
  }

  let content = t('offline-message.offline', 'Offline')

  if (connectivity?.status === 'check-online') {
    if (connectivity.retryIn) {
      content = t('offline-message.offline-retry-in', {
        defaultValue: 'Offline. Retrying in {{seconds}} seconds.',
        seconds: connectivity.retryIn,
      })
    } else {
      content = t('offline-message.retrying', 'Retrying...')
    }
  }

  const hintHtml = t('offline-message.hint', {
    defaultValue:
      'We are checking the connectivity against:{{newline}}github.com,{{newline}}gog.com,{{newline}}store.epicgames.com and{{newline}}cloudflare-dns.com',
    newline: '<br />',
  })

  const handleIgnore = () => {
    mutate({ status: 'online' })
  }

  return (
    <div className='alert shadow-lg'>
      <div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='stroke-info h-6 w-6 flex-shrink-0'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
        <span>{content}</span>
        {/* <span dangerouslySetInnerHTML={{ __html: hintHtml }}></span> */}
      </div>
      <div className='flex-none'>
        <button className='btn btn-sm btn-ghost' onClick={handleIgnore}>
          {t('offline-message.ignore', 'Ignore')}
        </button>
        {/* <button className='btn btn-sm btn-primary'>Ignore</button> */}
      </div>
    </div>
  )
}
