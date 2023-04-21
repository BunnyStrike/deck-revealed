import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Cross2Icon } from '@radix-ui/react-icons'

import {
  api,
  type AppListInput,
  type AppListOutput,
  type AppUpsertInput,
} from '../utils/api'
import { appCategories } from '../utils/app'
import { uploadFile } from '../utils/file'
import DialogModal from './Dialog'
import { UploadButton } from './UploadButton'

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
  const { user } = useUser()
  const { mutateAsync, error, isLoading } = api.app.upsert.useMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState(app?.category ?? 'Entertainment')
  const [selectedCoverFile, setSelectedCoverFile] = useState<
    File | undefined | null
  >()
  const [selectedCoverPreview, setSelectedCoverPreview] = useState<string>(
    'public/img/steam-pill.jpg'
  )
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.includes('@bunnystrike.com') ===
    true
  const isAppOwner = app?.ownerId === user?.id
  const handleCancel = () => {
    setIsOpen(false)
  }
  const handleSave = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    if (!isAppOwner) return
    const data = Object.fromEntries(new FormData(event.currentTarget))

    await mutateAsync({
      name: data?.name ?? app?.name ?? '',
      url: data?.url ?? app?.url ?? '',
      description: data?.description ?? app?.description ?? '',
      userId: isAdmin ? undefined : user?.id,
    } as AppUpsertInput)

    // upload image if it exists

    const uploadedFile = await uploadFile(selectedCoverFile)

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

  const handleImageSelect = (file: File) => {
    setSelectedCoverFile(file)
    setSelectedCoverPreview(URL.createObjectURL(file))
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
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 flex max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] flex-row gap-8 rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <div className=' h-full w-full'>
            <Dialog.Title className='text-mauve12 m-2 text-[17px] font-medium'>
              {`${type} App`}
            </Dialog.Title>
            <img src={selectedCoverPreview} alt='car!' />
            <h4>Name</h4>
          </div>
          <div className='h-full  w-full'>
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
                    Category
                  </Form.Label>
                  <Form.Message
                    className='text-[13px] text-white opacity-[0.8]'
                    match='valueMissing'
                  >
                    Please enter a Category
                  </Form.Message>
                  <Form.Message
                    className='text-[13px] text-white opacity-[0.8]'
                    match='typeMismatch'
                  >
                    Please provide a valid Category
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <select
                    className='select w-full max-w-xs'
                    defaultValue={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {appCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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

              <Form.Field className='mb-[10px] grid' name='description'>
                <div className='flex items-baseline justify-between'>
                  <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                    Cover Image
                  </Form.Label>
                </div>
                <Form.Control asChild>
                  <input
                    type='file'
                    className='file-input w-full max-w-xs'
                    onChange={(e) => handleImageSelect(e.target.files[0])}
                  />
                </Form.Control>
              </Form.Field>

              <div className='mt-[25px] flex justify-end'>
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddAppModal
