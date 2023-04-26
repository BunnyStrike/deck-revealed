import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import Select from 'react-select'

import { useDebounce } from '../hooks/useDebounce'
import { modalsAtom, modalsAtomDefault } from '../states'
import { classNames, searchSteamgridImage } from '../utils'
import {
  api,
  type AppListInput,
  type AppListOutput,
  type AppUpsertInput,
} from '../utils/api'
import {
  appCategories,
  appPlatforms,
  appRunnerTypes,
  appStores,
  type AppPlatform,
  type AppRunnerType,
  type AppStore,
} from '../utils/app'
import { uploadAppimage, uploadFile } from '../utils/file'
import DialogModal from './Dialog'
import EmptyState from './EmptyState'
import { FileUploadCard } from './FileUploadCard'
import { LoadingBar } from './LoadingBar'
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
  const { data: app, isLoading: isAppLoading } = api.app.byId.useQuery({
    id: modals.editApp ?? '',
  })

  const {
    mutateAsync: createMutate,
    error,
    isLoading: isLoadingCreate,
  } = api.app.create.useMutation()
  const {
    mutateAsync: updateAsync,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
  } = api.app.update.useMutation()

  const [category, setCategory] = useState('Entertainment')
  const [store, setStore] = useState<AppStore>('OTHER')
  const [platform, setPlatform] = useState<AppPlatform>('WEB')
  const [runnerType, setRunnerType] = useState<AppRunnerType>(
    app?.runnerType ?? 'UNKNOWN'
  )

  const [name, setName] = useState(app?.name)
  const debouncedName = useDebounce(name, 500)

  const [selectedIconFile, setSelectedIconFile] = useState<
    File | undefined | null
  >()

  const [selectedBannerFile, setSelectedBannerFile] = useState<
    File | undefined | null
  >()

  const [selectedCoverFile, setSelectedCoverFile] = useState<
    File | undefined | null
  >()

  const [steamGridImage, setSteamGridImage] = useState<
    string | undefined | null
  >()

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.includes('@bunnystrike.com') ===
    true
  const isAppOwner = app?.ownerId === user?.id

  const platformSelectOptions = appPlatforms.map((platformValue) => ({
    value: platformValue,
    label: platformValue,
  }))

  useEffect(() => {
    void handleSearchSteamgridImage(debouncedName)
  }, [debouncedName])

  useEffect(() => {
    setPlatform(app?.platform || 'WEB')
    setStore(app?.store || 'OTHER')
    setCategory(app?.category || 'Entertainment')
  }, [app])

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
    const createUpdateDoc = {
      name: data?.name ?? app?.name ?? '',
      source: data?.source ?? app?.source ?? '',
      description: data?.description ?? app?.description ?? '',
      userId: isAdmin ? undefined : user?.id,
      coverUrl: app?.coverUrl ?? steamGridImage,
      bannerUrl: app?.bannerUrl,
      category: data?.category || app?.category || 'Entertainment',
      store: data?.store || app?.store || 'OTHER',
      platform: data?.platform || app?.platform || 'WEB',
      iconUrl: app?.iconUrl,
    } as AppUpsertInput

    let appUpdate
    if (!!app?.id) {
      appUpdate = await updateAsync({ ...createUpdateDoc, id: app.id })
    } else {
      appUpdate = await createMutate(createUpdateDoc)
    }

    // upload image if it exists
    if (!appUpdate?.id) {
      setModals((prev) => ({ ...prev, showAddApp: false }))
      return
    }
    let updateDoc: any = {
      id: appUpdate?.id,
      name: appUpdate?.name,
      source: appUpdate?.source,
    }
    if (selectedCoverFile) {
      const uploadedCover = await uploadAppimage(
        selectedCoverFile,
        appUpdate?.id
      )
      if (uploadedCover?.data?.path) {
        updateDoc = {
          ...updateDoc,
          coverUrl: uploadedCover?.data?.path ?? '',
        }
      }
    }
    if (selectedBannerFile) {
      const uploadedBanner = await uploadAppimage(
        selectedBannerFile,
        appUpdate?.id,
        'banner'
      )
      if (uploadedBanner?.data?.path) {
        updateDoc = {
          ...updateDoc,
          bannerUrl: uploadedBanner?.data?.path ?? '',
        }
      }
    }

    if (selectedIconFile) {
      const uploadedIcon = await uploadAppimage(
        selectedIconFile,
        appUpdate?.id,
        'icon'
      )
      if (uploadedIcon?.data?.path) {
        updateDoc = {
          ...updateDoc,
          iconUrl: uploadedIcon?.data?.path ?? '',
        }
      }
    }

    await updateAsync(updateDoc)

    setModals((prev) => ({ ...prev, showAddApp: false }))
  }

  const handleSearchSteamgridImage = async (name?: string) => {
    if (!name || !!selectedCoverFile) return

    try {
      setSteamGridImage(await searchSteamgridImage(name))
    } catch (error) {
      console.error('Error when getting image from SteamGridDB')
    }
  }

  const handleImageSelect = (file?: File) => {
    if (!file) return
    setSelectedCoverFile(file)
  }

  const handleBannerSelect = (file?: File) => {
    if (!file) return
    setSelectedBannerFile(file)
  }

  return (
    <Dialog.Root open={modals.showAddApp}>
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
        <Dialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 z-50 h-full w-full items-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-40'>
          <Dialog.Content className='data-[state=open]:animate-contentShow  relative left-[50%] top-[50%] z-50 flex w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%]  flex-col gap-8 rounded-[6px] bg-gray-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]  focus:outline-none'>
            <div className='flex justify-center'>
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
                {platform !== 'WEB' && (
                  <a
                    className={classNames(
                      'tab ',
                      currentTab === 1 ? 'tab-active' : ''
                    )}
                    onClick={() => setCurrentTab(1)}
                  >
                    Installer
                  </a>
                )}
                {/* <a
              className={classNames(
                'tab ',
                currentTab === 2 ? 'tab-active' : ''
              )}
              onClick={() => setCurrentTab(2)}
            >
              Steam Images
            </a> */}
              </div>
            </div>

            {isAppLoading ? (
              <LoadingBar />
            ) : (
              <div className='flex flex-row gap-6 '>
                {currentTab === 0 && (
                  <div className='flex h-full w-full flex-col'>
                    <div className='grow'>
                      <FileUploadCard
                        selectedPreview={steamGridImage ?? app?.coverUrl}
                        onSelectedFile={handleImageSelect}
                        title='Select Cover Image'
                      />
                    </div>
                    <div className='h-48'>
                      <FileUploadCard
                        selectedPreview={app?.iconUrl}
                        onSelectedFile={setSelectedIconFile}
                        title='Select Icon Image'
                      />
                    </div>
                    <div className='h-48'>
                      <FileUploadCard
                        selectedPreview={app?.bannerUrl}
                        onSelectedFile={handleBannerSelect}
                        title='Select Banner Image'
                      />
                    </div>
                  </div>
                )}
                <div className='h-full w-full'>
                  <Form.Root onSubmit={handleSave}>
                    {currentTab === 0 && (
                      <div>
                        <Form.Field className='mb-2 grid w-full' name='name'>
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

                        <Form.Field
                          className='mb-2 grid w-full'
                          name='category'
                        >
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

                        <Form.Field
                          className='mb-2 grid w-full'
                          name='platform'
                        >
                          <div className='flex items-baseline justify-between'>
                            <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                              Platform
                            </Form.Label>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='valueMissing'
                            >
                              Please enter a Platform
                            </Form.Message>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='typeMismatch'
                            >
                              Please provide a valid Platform
                            </Form.Message>
                          </div>
                          {platform}
                          <Form.Control asChild>
                            <select
                              className='select w-full max-w-xs'
                              value={platform}
                            >
                              {appPlatforms.map(
                                (platformValue: AppRunnerType) => (
                                  <option
                                    key={platformValue}
                                    value={platformValue}
                                    onClick={() => console.log(platformValue)}
                                  >
                                    {platformValue}
                                  </option>
                                )
                              )}
                            </select>
                          </Form.Control>
                        </Form.Field>

                        {platform !== 'WEB' && (
                          <Form.Field className='mb-2 grid w-full' name='store'>
                            <div className='flex items-baseline justify-between'>
                              <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                                Store
                              </Form.Label>
                              <Form.Message
                                className='text-[13px] text-white opacity-[0.8]'
                                match='valueMissing'
                              >
                                Please enter a Store
                              </Form.Message>
                              <Form.Message
                                className='text-[13px] text-white opacity-[0.8]'
                                match='typeMismatch'
                              >
                                Please provide a valid Store
                              </Form.Message>
                            </div>
                            <Form.Control asChild>
                              <select
                                className='select w-full max-w-xs'
                                defaultValue={store}
                                onChange={(e) => setStore(e.target.value)}
                              >
                                {appStores.map((storeValue) => (
                                  <option key={storeValue} value={storeValue}>
                                    {storeValue}
                                  </option>
                                ))}
                              </select>
                            </Form.Control>
                          </Form.Field>
                        )}

                        <Form.Field className='mb-2 grid w-full' name='source'>
                          <div className='flex items-baseline justify-between'>
                            <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                              Source
                            </Form.Label>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='valueMissing'
                            >
                              Please enter a Source
                            </Form.Message>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='typeMismatch'
                            >
                              Please provide a valid Source
                            </Form.Message>
                          </div>
                          <Form.Control asChild>
                            <input
                              type='text'
                              placeholder='Source (URL, store id)'
                              className='input w-full max-w-xs'
                              defaultValue={app?.source ?? ''}
                              required
                            />
                          </Form.Control>
                        </Form.Field>

                        {/* <Form.Field className='mb-2 grid w-full' name='runner'>
                    <div className='flex items-baseline justify-between'>
                      <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                        Runner
                      </Form.Label>
                      <Form.Message
                        className='text-[13px] text-white opacity-[0.8]'
                        match='valueMissing'
                      >
                        Please enter a Runner
                      </Form.Message>
                      <Form.Message
                        className='text-[13px] text-white opacity-[0.8]'
                        match='typeMismatch'
                      >
                        Please provide a valid Runner
                      </Form.Message>
                    </div>
                    <Form.Control asChild>
                      <select
                        className='select w-full max-w-xs'
                        defaultValue={runnerType}
                        onChange={(e) => setRunnerType(e.target.value)}
                      >
                        {appRunnerTypes.map((runner: AppRunnerType) => (
                          <option key={runner} value={runner}>
                            {runner}
                          </option>
                        ))}
                      </select>
                    </Form.Control>
                  </Form.Field> */}

                        <Form.Field className='mb-2 grid' name='description'>
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
                              rows={3}
                              defaultValue={app?.description ?? ''}
                            ></textarea>
                          </Form.Control>
                        </Form.Field>
                      </div>
                    )}
                    {currentTab === 1 && (
                      /* 
                    Installer
                  */
                      <div className=''>
                        <Form.Field
                          className='mb-2 grid w-full'
                          name='installLocation'
                        >
                          <div className='flex items-baseline justify-between'>
                            <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                              Install Location (path)
                            </Form.Label>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='valueMissing'
                            >
                              Please enter your Install Location
                            </Form.Message>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='typeMismatch'
                            >
                              Please provide a Install Location
                            </Form.Message>
                          </div>
                          <Form.Control asChild>
                            <input
                              type='text'
                              placeholder='/home/deck/.local/share/program'
                              className='input w-full max-w-xs'
                              defaultValue={app?.installLocation ?? ''}
                            />
                          </Form.Control>
                        </Form.Field>
                        <Form.Field
                          className='mb-2 grid w-full'
                          name='runnerLocation'
                        >
                          <div className='flex items-baseline justify-between'>
                            <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                              Runner Location (.sh, exe, etc)
                            </Form.Label>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='valueMissing'
                            >
                              Please enter your Runner Location
                            </Form.Message>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='typeMismatch'
                            >
                              Please provide a valid Runner Location
                            </Form.Message>
                          </div>
                          <Form.Control asChild>
                            <input
                              type='text'
                              placeholder='/home/deck/.local/share/program/program.sh'
                              className='input w-full max-w-xs'
                              defaultValue={app?.runnerLocation ?? ''}
                            />
                          </Form.Control>
                        </Form.Field>
                        <Form.Field
                          className='mb-2 grid w-full'
                          name='uninstallUrl'
                        >
                          <div className='flex items-baseline justify-between'>
                            <Form.Label className='text-[15px] font-medium leading-[35px] text-white'>
                              Uninstall (url, script, etc)
                            </Form.Label>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='valueMissing'
                            >
                              Please enter your Uninstall Script Url
                            </Form.Message>
                            <Form.Message
                              className='text-[13px] text-white opacity-[0.8]'
                              match='typeMismatch'
                            >
                              Please provide a valid Uninstall Script Url
                            </Form.Message>
                          </div>
                          <Form.Control asChild>
                            <input
                              type='text'
                              placeholder='https://example.com/uninstaller.sh'
                              className='input w-full max-w-xs'
                              defaultValue={app?.uninstall ?? ''}
                            />
                          </Form.Control>
                        </Form.Field>
                        {/* 
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
                  </Form.Field> */}
                      </div>
                    )}

                    <div className='mt-[25px] flex justify-end'>
                      <Form.Submit
                        className={classNames(
                          isLoadingUpdate || isLoadingCreate ? 'loading' : '',
                          'btn tbn-primary'
                        )}
                      >
                        {/* <button
                          className={classNames(
                            isLoadingUpdate || isLoadingCreate ? 'loading' : '',
                            'btn tbn-primary'
                          )}
                        > */}
                        Submit
                        {/* </button> */}
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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddAppModal
