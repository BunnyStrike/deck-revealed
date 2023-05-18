import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'

import { confirmModalAtom, confirmModalAtomDefault } from '../states'
import { classNames } from '../utils'

interface ConfirmDialogProps {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  button?: React.ReactNode
  submitButton?: React.ReactNode
  saveTitle?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const ConfirmDialog = ({
  title = 'Are you sure you want to do this?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const [confirm, setConfirm] = useAtom(confirmModalAtom)

  const cancelButtonRef = useRef(null)

  const handleConfirm = async () => {
    setConfirm((prev) => ({ ...prev, isLoading: true }))
    await confirm?.onConfirm?.()
    await onConfirm?.()
    setConfirm(confirmModalAtomDefault)
  }

  const handleCancel = async () => {
    await confirm?.onCancel?.()
    await onCancel?.()
    setConfirm(confirmModalAtomDefault)
  }

  return (
    <Transition.Root show={confirm.show} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        initialFocus={cancelButtonRef}
        onClose={() => handleCancel()}
      >
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

        <div className='fixed inset-0 z-50 overflow-y-auto'>
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
                <div className='sm:flex sm:items-start'>
                  <div
                    className={classNames(
                      'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10',
                      `bg-${confirm?.type}`
                    )}
                  >
                    <ExclamationTriangleIcon
                      className={classNames(`h-6 w-6 text-${confirm?.type}`)}
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-100'
                    >
                      {confirm?.title ?? title}
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-200'>
                        {confirm?.message ?? message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    className={classNames(
                      `back-button btn-md btn btn-${
                        confirm?.type || 'primary'
                      }`,
                      confirm.isLoading ? 'loading' : ''
                    )}
                    onClick={() => handleConfirm()}
                  >
                    {confirmText}
                  </button>
                  <button
                    type='button'
                    disabled={confirm.isLoading}
                    className='btn-ghost btn-md btn'
                    onClick={() => handleCancel()}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ConfirmDialog
