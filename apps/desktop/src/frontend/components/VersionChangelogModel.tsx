import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'

import { api } from '../utils/api'
import { DialogModal } from './Dialog'

type Props = {
  onClose: () => void
  version?: string
  dimissVersionCheck?: boolean
  children?: React.ReactNode
  isOpen?: boolean
}

const storage = window.localStorage
const lastChangelog = storage.getItem('last_changelog')?.replaceAll('"', '')

export function VersionChangelogModel({
  onClose,
  dimissVersionCheck,
  version,
  isOpen = false,
}: Props) {
  const { data: currentChangelog } =
    api.desktop.system.getCurrentChangelog.useQuery(undefined, {
      staleTime: 1000,
    })

  console.log(currentChangelog)

  const handleClose = () => {
    onClose()
  }

  console.log(currentChangelog)

  if (!currentChangelog) {
    return <></>
  }

  return (
    <Dialog.Root open={isOpen}>
      {/* <Dialog.Trigger asChild>{children}</Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
            {currentChangelog?.name}
          </Dialog.Title>
          <Dialog.Description className='text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal'>
            <div className={classNames('changelogModalContent')}>
              {currentChangelog?.body && (
                <ReactMarkdown
                  className='changelogModalContent'
                  linkTarget={'_blank'}
                >
                  {currentChangelog?.body}
                </ReactMarkdown>
              )}
            </div>
          </Dialog.Description>
          {/* <div className='mt-[25px] flex justify-end'>
            <Dialog.Close asChild>
              <button
                onClick={handleSave}
                className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'
              >
                {saveTitle}
              </button>
            </Dialog.Close>
          </div> */}
          <Dialog.Close asChild>
            <button
              onClick={handleClose}
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
