import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce, useUser } from 'frontend/hooks'
import {
  classNames,
  searchSteamgridImage,
  uploadAppimage,
} from 'frontend/utils'
import { useNavigate } from 'react-router-dom'

import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
} from '@revealed/ui'

import { api, type AppListOutput, type AppUpsertInput } from '../../utils/api'
import {
  appCategories,
  appPlatforms,
  appRunnerTypes,
  appStores,
  type AppPlatform,
  type AppRunnerType,
  type AppStore,
} from '../../utils/app'
import { FileUploadCard } from '../FileUploadCard'

interface AppManageFormProps {
  mode?: 'Add' | 'Edit'
  app?: AppListOutput[number] | null
}

export default function AppManageForm({
  app,
  mode = 'Add',
}: AppManageFormProps) {
  const { user } = useUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    mutateAsync: createMutate,
    error,
    isLoading: isLoadingCreate,
  } = api.app.create.useMutation()
  const {
    mutateAsync: updateAsync,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
  } = api.app.update.useMutation({
    // onSettled: () => api.app.all.useQuery().refetch(),
  })

  const [isLoading, setIsLoading] = useState(false)

  const [platform, setPlatform] = useState<AppPlatform>(app?.platform ?? 'WEB')
  const [store, setStore] = useState<AppStore>(app?.store ?? 'OTHER')
  const [runnerType, setRunnerType] = useState<AppRunnerType>(
    app?.runnerType ?? 'OTHER'
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

  const categorySelectOptions = appCategories.map((value) => ({
    id: value,
    name: value,
  }))

  const platformSelectOptions = appPlatforms.map((value) => ({
    id: value,
    name: value,
  }))

  const storeSelectOptions = appStores.map((value) => ({
    id: value,
    name: value,
  }))

  const runnerTypesSelectOptions = appRunnerTypes.map((value) => ({
    id: value,
    name: value,
  }))

  const goToApps = async () => {
    await queryClient.invalidateQueries(api.app.getQueryKey())
    setIsLoading(false)
    navigate('/apps')
  }

  const handleSave = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))

    console.log('Saving:', data)

    setIsLoading(true)

    const createUpdateDoc = {
      name: data?.name ?? app?.name ?? '',
      source: data?.source ?? app?.source ?? '',
      description: data?.description ?? app?.description ?? '',
      userId: isAdmin ? undefined : user?.id,
      iconUrl: app?.iconUrl || undefined,
      coverUrl: app?.coverUrl ?? steamGridImage,
      bannerUrl: app?.bannerUrl || undefined,
      runnerLocation: data.runnerLocation || app?.runnerLocation || undefined,
      installLocation:
        data.installLocation || app?.installLocation || undefined,
      uninstall: data.uninstall || app?.uninstall || undefined,
      category: data['category[id]'] || app?.category || 'Entertainment',
      store: data['store[id]'] || app?.store || 'OTHER',
      platform: data['platform[id]'] || app?.platform || 'WEB',
      runnerType: data['runnerType[id]'] || app?.runnerType || undefined,
    } as AppUpsertInput

    let appUpdate
    if (!!app?.id) {
      appUpdate = await updateAsync({ ...createUpdateDoc, id: app.id })
    } else {
      appUpdate = await createMutate(createUpdateDoc)
    }

    // upload image if it exists
    if (!appUpdate?.id) {
      goToApps()
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
    goToApps()
  }

  const handleCancel = () => {
    goToApps()
  }

  const handleSearchSteamgridImage = async (name?: string) => {
    if (!name || !!selectedCoverFile) return

    try {
      setSteamGridImage(await searchSteamgridImage(name))
    } catch (error) {
      console.error('Error when getting image from SteamGridDB')
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className='space-y-12'>
        <div className='border-b border-white/10 pb-12'>
          <h1 className=' text-2xl font-semibold leading-7 text-white'>App</h1>
          <p className='mt-1 text-sm leading-6 text-gray-400'>
            This app will be made private and only you will see it. There will
            be public submitted apps coming in the near future.
          </p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <FormInputField
              className='sm:col-span-4'
              title='Name'
              value={app?.name ?? ''}
              fieldName='name'
            />

            <FormSelectField
              className='sm:col-span-2'
              title='Category'
              value={app?.category ?? 'Entertainment'}
              list={categorySelectOptions}
              fieldName='category'
            />

            <FormTextareaField
              className='col-span-full'
              title='About'
              fieldName='description'
              value={app?.description ?? ''}
            />
          </div>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <FormInputField
              className='sm:col-span-3'
              title='Source'
              fieldName='source'
              value={app?.source ?? ''}
            />

            <FormSelectField
              className='sm:col-span-3'
              title='Platform'
              value={platform}
              list={platformSelectOptions}
              fieldName='platform'
              onChange={(value: AppPlatform) => setPlatform(value)}
            />

            {platform !== 'WEB' && (
              <FormSelectField
                className='sm:col-span-3'
                title='Store'
                value={store}
                list={storeSelectOptions}
                fieldName='store'
                onChange={(value: AppStore) => setStore(value)}
              />
            )}

            {platform !== 'WEB' && store === 'OTHER' && (
              <FormSelectField
                className='sm:col-span-3'
                title='Runner Type'
                value={runnerType}
                list={runnerTypesSelectOptions}
                fieldName='runnerType'
                onChange={(value: AppRunnerType) => setRunnerType(value)}
              />
            )}
          </div>
        </div>

        <div className='border-b border-white/10 pb-12'>
          <h2 className='text-base font-semibold leading-7 text-white'>
            Images
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-400'>
            All Images are used for Steam if you add the app to Steam.
          </p>
          <div className='mt-10'>
            <div className='col-span-full flex gap-8'>
              <div className='col-span-3'>
                <label
                  htmlFor='cover-photo'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Icon
                </label>
                <FileUploadCard
                  onSelectedFile={(file) => setSelectedIconFile(file)}
                  title='Select JPEG, PNG'
                  description='512 x 512'
                  selectedPreview={app?.iconUrl}
                />
              </div>

              <div className='col-span-4'>
                <label
                  htmlFor='cover-photo'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Cover
                </label>
                <FileUploadCard
                  classNameBox='h-60'
                  onSelectedFile={(file) => setSelectedCoverFile(file)}
                  selectedPreview={steamGridImage ?? app?.coverUrl}
                  title='Select JPEG, PNG'
                  description='600 x 900'
                />
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='cover-photo'
                className='block text-sm font-medium leading-6 text-white'
              >
                Banner
              </label>
              <FileUploadCard
                classNameBox='h-36'
                onSelectedFile={(file) => setSelectedBannerFile(file)}
                selectedPreview={app?.bannerUrl}
                title='Select JPEG, PNG'
                description='920 x 430'
              />
            </div>
          </div>
        </div>

        {platform !== 'WEB' && (
          <div className='border-b border-white/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-white'>
              Locations
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              If the app has an installer or installs to a location, you need to
              fill out the fields below to make adding to steam and running from
              Revealed to work.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <FormInputField
                className='sm:col-span-3'
                title='Install Location (path)'
                placeholder='/home/deck/.local/share/program'
                value={app?.installLocation ?? ''}
                fieldName='installLocation'
              />
              <FormInputField
                className='sm:col-span-3'
                title='Runner Location (.sh, exe, etc)'
                placeholder='/home/deck/.local/share/program/program.sh'
                value={app?.runnerLocation ?? ''}
                fieldName='runnerLocation'
              />
              <FormInputField
                className='sm:col-span-3'
                title='Uninstall (url, script, etc)'
                placeholder='https://example.com/uninstaller.sh'
                value={app?.uninstall ?? ''}
                fieldName='uninstall'
              />
            </div>
          </div>
        )}
      </div>

      {(errorUpdate || error) && (
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          {errorUpdate?.message || error?.message}
        </div>
      )}
      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          onClick={handleCancel}
          className={classNames('text-sm font-semibold leading-6 text-white')}
        >
          Cancel
        </button>
        <button
          type='submit'
          className={classNames(isLoading ? 'loading' : '', 'btn-primary btn')}
        >
          Save
        </button>
      </div>
    </form>
  )
}
