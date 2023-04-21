import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Cross2Icon } from '@radix-ui/react-icons'

import {
  api,
  type AppListInput,
  type AppListOutput,
  type AppUpsertInput,
} from '../utils/api'
import DialogModal from './Dialog'

interface AddAppModalProps {
  type?: 'Add' | 'Edit'
  app?: AppListOutput[number]
  actionButton?: React.ReactNode
}

export const AddAppModal = ({
  type = 'Add',
  app,
  actionButton,
}: AddAppModalProps) => {
  const { mutateAsync, error, isLoading } = api.app.upsert.useMutation()
  const [isOpen, setIsOpen] = useState(false)
  const handleCancel = () => {
    setIsOpen(false)
  }
  const handleSave = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))

    await mutateAsync({
      name: data?.name ?? app?.name ?? '',
      url: data?.url ?? app?.url ?? '',
      description: data?.description ?? app?.description ?? '',
    } as AppUpsertInput)

    setIsOpen(false)

    // // Submit form data and catch errors in the response
    // submitForm(data)
    //   .then(() => {})
    //   /**
    //    * Map errors from your server response into a structure you'd like to work with.
    //    * In this case resulting in this object: `{ email: false, password: true }`
    //    */
    //   .catch((errors) => setServerErrors(mapServerErrors(errors)))

    // prevent default form submission
  }

  return (
    <Dialog.Root className='z-40' open={isOpen}>
      <Dialog.Trigger asChild>
        {actionButton || (
          <button
            onClick={() => setIsOpen(true)}
            className='btn btn-primary mr-4 mt-4'
          >
            {type} App
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <Dialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
            {`${type} App`}
          </Dialog.Title>

          <Form.Root onSubmit={handleSave}>
            <Form.Field className='mb-[10px] grid w-full' name='name'>
              <div className='flex items-baseline justify-between'>
                <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                  Name
                </Form.Label>
                <Form.Message
                  className='text-[13px] text-white opacity-[0.8]'
                  match='valueMissing'
                >
                  Please enter your name
                </Form.Message>
                <Form.Message
                  className='text-[13px] text-white opacity-[0.8]'
                  match='typeMismatch'
                >
                  Please provide a valid name
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  type='text'
                  placeholder='Name'
                  className='input w-full max-w-xs'
                  defaultValue={app?.name}
                  required
                />
              </Form.Control>
            </Form.Field>
            <Form.Field className='mb-[10px] grid w-full' name='url'>
              <div className='flex items-baseline justify-between'>
                <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                  Url
                </Form.Label>
                <Form.Message
                  className='text-[13px] text-white opacity-[0.8]'
                  match='valueMissing'
                >
                  Please enter a url
                </Form.Message>
                <Form.Message
                  className='text-[13px] text-white opacity-[0.8]'
                  match='typeMismatch'
                >
                  Please provide a valid url
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input
                  type='text'
                  placeholder='Source'
                  className='input w-full max-w-xs'
                  defaultValue={app?.url ?? ''}
                  required
                />
              </Form.Control>
            </Form.Field>
            <Form.Field className='mb-[10px] grid' name='description'>
              <div className='flex items-baseline justify-between'>
                <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                  Description
                </Form.Label>
                <Form.Message
                  className='text-[13px] text-white opacity-[0.8]'
                  match='valueMissing'
                >
                  Please enter a Description
                </Form.Message>
              </div>
              <Form.Control asChild>
                <textarea
                  className='textarea'
                  defaultValue={app?.description ?? ''}
                ></textarea>
              </Form.Control>
            </Form.Field>

            <div className='mt-[25px] flex justify-end'>
              {/* <Form.Submit asChild>
                <button className='bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none'>
                  Save
                </button>
              </Form.Submit> */}
              <Form.Submit>Submit</Form.Submit>
            </div>
          </Form.Root>

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

export default AddAppModal
