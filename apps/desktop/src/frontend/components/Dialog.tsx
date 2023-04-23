import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

interface DialogModalProps {
  title?: string
  description?: string
  open?: boolean
  button?: React.ReactNode
  submitButton?: React.ReactNode
  children?: React.ReactNode
  saveTitle?: string
  onSave?: () => void
  onCancel?: () => void
}

export const DialogModal = ({
  title,
  description,
  button,
  submitButton,
  children,
  open,
  onCancel,
  onSave,
  saveTitle = 'Save',
}: DialogModalProps) => (
  <Dialog.Root open={open}>
    <Dialog.Trigger asChild>{button}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
      <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
        {title && (
          <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
            {title}
          </Dialog.Title>
        )}
        {description && (
          <Dialog.Description className='text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal'>
            {description}
          </Dialog.Description>
        )}
        {children}
        <div className='mt-[25px] flex justify-end'>
          <Dialog.Close asChild>
            <button
              onClick={onSave}
              className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'
            >
              {saveTitle}
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          {submitButton || (
            <button
              onClick={onCancel}
              className='text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <Cross2Icon />
            </button>
          )}
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export default DialogModal
