import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

import { confirmModalAtom, confirmModalAtomDefault } from '../states'

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

  const handleConfirm = async () => {
    await confirm?.onConfirm?.()
    setConfirm(confirmModalAtomDefault)
  }

  const handleCancel = async () => {
    await confirm?.onCancel?.()
    setConfirm(confirmModalAtomDefault)
  }
  //  onClick={() => setConfirm((prev) => ({...prev, show: true}))}
  return (
    <Dialog.Root open={confirm.show}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          {title && (
            <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
              {confirm?.title || title}
            </Dialog.Title>
          )}
          {(confirm?.message || message) && (
            <Dialog.Description className='text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal'>
              {confirm?.message || message}
            </Dialog.Description>
          )}

          <div className='mt-[25px] flex justify-end'>
            <Dialog.Close asChild>
              <button
                onClick={handleCancel}
                className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'
              >
                {confirm?.cancelText || cancelText}
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={handleConfirm}
                className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'
              >
                {confirm?.confirmText || confirmText}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              onClick={handleCancel}
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

export default ConfirmDialog
