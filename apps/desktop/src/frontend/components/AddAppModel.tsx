import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

import { useDebounce } from '../hooks/useDebounce'
import { modalsAtom, modalsAtomDefault } from '../states'
import { classNames, searchSteamgridImage } from '../utils'
import {
  api,
  type AppListInput,
  type AppListOutput,
  type AppUpsertInput,
} from '../utils/api'
import { appCategories } from '../utils/app'
import { uploadAppimage, uploadFile } from '../utils/file'
import DialogModal from './Dialog'
import EmptyState from './EmptyState'
import { UploadButton } from './UploadButton'

interface AddAppModalProps {
  type?: 'Add' | 'Edit'
  app?: AppListOutput[number]
  isEmptyState?: boolean
}

export const AddAppModal = ({
  type = 'Add',
  // app,
  isEmptyState = false,
}: AddAppModalProps) => {
  const { user } = useUser()
  const [modals, setModals] = useAtom(modalsAtom)
  const [currentTab, setCurrentTab] = useState(0)
  const { data: app } = api.app.byId.useQuery({
    id: modals.editApp ?? '',
  })
  console.log(app)

  const { mutateAsync, error, isLoading } = api.app.create.useMutation()

  const [category, setCategory] = useState(app?.category ?? 'Entertainment')

  const [name, setName] = useState(app?.name)
  const debouncedName = useDebounce(name, 500)

  const [selectedBannerFile, setSelectedBannerFile] = useState<
    File | undefined | null
  >()

  const [selectedBannerPreview, setSelectedBannerPreview] = useState<
    string | undefined
  >()

  const [selectedCoverFile, setSelectedCoverFile] = useState<
    File | undefined | null
  >()

  const [selectedCoverPreview, setSelectedCoverPreview] = useState<
    string | undefined
  >()

  const [steamGridImage, setSteamGridImage] = useState<
    string | undefined | null
  >()

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.includes('@bunnystrike.com') ===
    true
  const isAppOwner = app?.ownerId === user?.id

  useEffect(() => {
    void handleSearchSteamgridImage(debouncedName)
  }, [debouncedName])

  const handleCancel = () => {
    setModals(modalsAtomDefault)
  }

  const handleSave = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    // if (!isAppOwner) return
    const data = Object.fromEntries(new FormData(event.currentTarget))

    console.log(data?.description ?? app?.description ?? '')

    const appUpdate = await mutateAsync({
      name: data?.name ?? app?.name ?? '',
      url: data?.url ?? app?.url ?? '',
      description: data?.description ?? app?.description ?? '',
      userId: isAdmin ? undefined : user?.id,
      coverUrl: app?.coverUrl ?? steamGridImage,
    } as AppUpsertInput)

    console.log(appUpdate)

    // upload image if it exists
    if (selectedCoverFile && appUpdate?.id) {
      const uploadedCover = await uploadAppimage(
        selectedCoverFile,
        appUpdate?.id
      )

      // const uploadedBanner = await uploadAppimage(
      //   selectedCoverFile,
      //   appUpdate?.id,
      //   'banner'
      // )
      // const uploadedIcon = await uploadAppimage(
      //   selectedCoverFile,
      //   appUpdate?.id,
      //   'icon'
      // )

      // appUpdate

      // await mutateAsync({
      //   id: appUpdate?.id,
      //   coverUrl: data?.name ?? steamGridImage,
      // } as AppUpsertInput)
    }

    setModals((prev) => ({ ...prev, showAddApp: false }))

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

  const handleSearchSteamgridImage = async (name?: string) => {
    if (!name || !!selectedCoverPreview) return

    try {
      setSteamGridImage(await searchSteamgridImage(name))
    } catch (error) {
      console.error('Error when getting image from SteamGridDB')
    }
  }

  const handleImageSelect = (file?: File) => {
    if (!file) return
    setSelectedCoverFile(file)
    setSelectedCoverPreview(URL.createObjectURL(file))
  }

  const handleBannerSelect = (file?: File) => {
    if (!file) return
    setSelectedBannerFile(file)
    setSelectedBannerPreview(URL.createObjectURL(file))
  }

  return (
    <Dialog.Root className='z-40' open={modals.showAddApp}>
      <Dialog.Trigger asChild>
        {isEmptyState ? (
          <EmptyState key='test' message={`Add a new app`} />
        ) : (
          <button
            onClick={() => setModals((prev) => ({ ...prev, showAddApp: true }))}
            className='btn btn-primary mr-4 mt-4'
          >
            {type} App
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-40 flex max-h-[85vh] w-[90vw]  max-w-[650px] translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-8 rounded-[6px] bg-slate-600 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <div className='tabs tabs-boxed'>
            <a
              className={classNames(
                'tab ',
                currentTab === 0 ? 'tab-active' : ''
              )}
              onClick={() => setCurrentTab(0)}
            >
              Details
            </a>
            {/* <a
              className={classNames(
                'tab ',
                currentTab === 1 ? 'tab-active' : ''
              )}
              onClick={() => setCurrentTab(1)}
            >
              Versions
            </a>
            <a
              className={classNames(
                'tab ',
                currentTab === 2 ? 'tab-active' : ''
              )}
              onClick={() => setCurrentTab(2)}
            >
              Steam Images
            </a> */}
          </div>
          {currentTab === 0 && (
            <div className='flex flex-row gap-6'>
              <div className=' h-full w-full'>
                {/* <Dialog.Title className='text-mauve12 m-2 text-[17px] font-medium'>
                {`${type} App`}
              </Dialog.Title> */}
                {/* <img
                  src={
                    selectedCoverPreview ??
                    steamGridImage ??
                    'public/img/steam-pill.jpg'
                  }
                  alt='car!'
                /> */}
                <div className='overflow-hidden rounded-lg bg-gray-400 shadow'>
                  <div className='px-2 py-3 sm:p-2'>
                    {selectedCoverPreview || steamGridImage ? (
                      <div className='bg-grey-lighter flex h-72 w-full items-center justify-center'>
                        <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white uppercase tracking-wide shadow-lg hover:text-white'>
                          <img
                            src={
                              selectedCoverPreview ??
                              steamGridImage ??
                              'public/img/steam-pill.jpg'
                            }
                            className='rounded-lg bg-cover bg-center'
                            alt='Cover Image'
                          />
                          <input
                            type='file'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                handleImageSelect(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className='bg-grey-lighter flex h-72 w-full items-center justify-center'>
                        <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:text-white'>
                          <svg
                            className='h-8 w-8'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                          >
                            <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
                          </svg>
                          <span className='mt-2 text-base leading-normal'>
                            Cover Image
                          </span>
                          <input
                            type='file'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                handleImageSelect(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className='bg-gray-500 px-4 py-4 sm:px-6'>
                    {selectedBannerPreview ? (
                      <div className='bg-grey-lighter flex w-full items-center justify-center'>
                        <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white  uppercase tracking-wide shadow-lg hover:text-white'>
                          <img
                            src={
                              selectedBannerPreview ??
                              'public/img/steam-pill.jpg'
                            }
                            className='rounded-lg bg-cover bg-center'
                            alt='Banner Image'
                          />
                          <input
                            type='file'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                handleBannerSelect(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className='bg-grey-lighter flex w-full items-center justify-center'>
                        <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:text-white'>
                          <svg
                            className='h-8 w-8'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                          >
                            <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
                          </svg>
                          <span className='mt-2 text-base leading-normal'>
                            Banner Image
                          </span>
                          <input
                            type='file'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files?.length) {
                                handleBannerSelect(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                    {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
                  </div>
                </div>
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
                        onChange={(e) => setName(e.target.value)}
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

                  <Form.Field className='mb-[10px] grid' name='coverUrl'>
                    <div className='flex items-baseline justify-between'>
                      <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                        Cover Image
                      </Form.Label>
                    </div>
                    <Form.Control asChild>
                      <input
                        type='file'
                        className='file-input w-full max-w-xs'
                        onChange={(e) => {
                          if (e.target.files?.length) {
                            handleImageSelect(e.target.files[0])
                          }
                        }}
                      />
                    </Form.Control>
                  </Form.Field>

                  <div className='mt-[25px] flex justify-end'>
                    <Form.Submit>
                      <button className='btn tbn-primary'>Submit</button>
                    </Form.Submit>
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
            </div>
          )}
          {currentTab === 1 && (
            <div className='flex flex-row gap-6'>
              <div className=' h-full w-full'></div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddAppModal
