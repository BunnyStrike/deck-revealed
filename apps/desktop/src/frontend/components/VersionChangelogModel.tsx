import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import * as Dialog from '@radix-ui/react-dialog'
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
  currentChangelog?: any
}

const storage = window.localStorage

export function VersionChangelogModel({
  onClose,
  dimissVersionCheck,
  version,
  currentChangelog,
  isOpen = false,
}: Props) {
  const { mutate: openExternalUrl } =
    api.desktop.system.openExternalUrl.useMutation()
  const { mutate: updateApp } = api.desktop.system.updateApp.useMutation()
  const { data: platform } = api.desktop.system.platform.useQuery()

  const handleClose = () => {
    storage.setItem(
      'ignore_version',
      JSON.stringify(currentChangelog?.name ?? version)
    )
    onClose()
  }

  // if (!currentChangelog) {
  //   return <></>
  // }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md bg-black text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={() => handleClose()}
                  >
                    <span className='sr-only'>Close</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <div className='sm:flex sm:items-start'>
                  <div className='bg-primary-100 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10'>
                    <ExclamationTriangleIcon
                      className='text-primary-600 h-6 w-6'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-100'
                    >
                      {currentChangelog?.name ?? version}
                    </Dialog.Title>
                    <div className='mt-2'>
                      {currentChangelog?.updateAvailable && (
                        <p className='text-sm text-gray-300'>
                          A new update is available. Please update to the latest
                          for all the new features and bug fixes.
                        </p>
                      )}
                      {currentChangelog?.body ? (
                        <p className=' mt-2 text-sm text-gray-400'>
                          {currentChangelog?.body}
                        </p>
                      ) : (
                        <p className=' mt-2 text-sm text-gray-400'>
                          Up to date!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse '>
                  {currentChangelog?.html_url && <button
                    className='btn-primary btn-md btn'
                    onClick={() =>
                      openExternalUrl({ url: currentChangelog?.html_url })
                    }
                  >
                    View Release
                  </button>}

                  {currentChangelog?.updateAvailable && (
                    <>
                      {platform?.isLinux && (
                        <button
                          type='button'
                          className='btn-primary btn-md btn'
                          onClick={() => updateApp()}
                        >
                          Update
                        </button>
                      )}
                      <button
                        type='button'
                        className='btn-ghost btn-md btn'
                        onClick={() => handleClose()}
                      >
                        Ignore
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    // <Dialog.Root open={isOpen}>
    //   {/* <Dialog.Trigger asChild>{children}</Dialog.Trigger> */}
    //   <Dialog.Portal>
    //     <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
    //     <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
    //       <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
    //         {currentChangelog?.name}
    //       </Dialog.Title>
    //       <Dialog.Description className='text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal'>
    //         <div className={classNames('changelogModalContent')}>
    //           {currentChangelog?.body && (
    //             <ReactMarkdown
    //               className='changelogModalContent'
    //               linkTarget={'_blank'}
    //             >
    //               {currentChangelog?.body}
    //             </ReactMarkdown>
    //           )}
    //         </div>
    //       </Dialog.Description>
    //       {/* <div className='mt-[25px] flex justify-end'>
    //         <Dialog.Close asChild>
    //           <button
    //             onClick={handleSave}
    //             className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'
    //           >
    //             {saveTitle}
    //           </button>
    //         </Dialog.Close>
    //       </div> */}
    //       <Dialog.Close asChild>
    //         <button
    //           onClick={handleClose}
    //           className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
    //           aria-label='Close'
    //         >
    //           <Cross2Icon />
    //         </button>
    //       </Dialog.Close>
    //     </Dialog.Content>
    //   </Dialog.Portal>
    // </Dialog.Root>
  )
}
