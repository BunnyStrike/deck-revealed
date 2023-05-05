import React from 'react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { app } from 'electron'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

import { useUser } from '../hooks'
import { confirmModalAtom, modalsAtom } from '../states'
import { GameListOutput, api, type AppListOutput } from '../utils/api'
import ConfirmDialog from './ConfirmDialog'

interface AppContextMenuProps {
  appId?: string
  ownerId?: string | null
  isAddedToSteam?: boolean
  children: React.ReactNode
  app: AppListOutput[number]
}

export const AppContextMenu = ({
  appId,
  ownerId,
  children,
  app,
  isAddedToSteam = false,
}: AppContextMenuProps) => {
  const { user } = useUser()
  const navigate = useNavigate()
  const { mutateAsync: hideApp } = api.app.hide.useMutation()
  const { mutateAsync: deleteApp } = api.app.delete.useMutation()
  const { mutateAsync: addToSteam } =
    api.desktop.steam.addAppToSteam.useMutation()
  const { mutateAsync: removeAppFromSteam } =
    api.desktop.steam.removeAppFromSteam.useMutation()
  const { mutate: openWebviewPage } =
    api.desktop.system.openWebviewPage.useMutation()
  const { mutate: favoriteApp } = api.app.favorite.useMutation()
  const { mutateAsync: restartSteam } =
    api.desktop.steam.restartSteam.useMutation()
  const [confirm, setConfirm] = useAtom(confirmModalAtom)
  const queryClient = useQueryClient()

  const isOwner = user?.id === ownerId
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress.includes('@bunnystrike.com')
  const isFavorited = !!app.userActions?.find((item) => !!item.favoritedAt)
  const installable = app?.platform !== 'WEB' && !!app?.source

  const handleDelete = async () => {
    if (!appId || !user?.id) return
    // setConfirm((prev) => ({
    //   ...prev,
    //   show: true,
    //   onConfirm: async () => await deleteApp({ id: appId, ownerId: user?.id }),
    // }))
  }

  const handleEdit = () => {
    if (!appId || !user?.id) return
    // setModals((prev) => ({ ...prev, editApp: appId, showAddApp: true }))
    navigate(`/app/${appId}/edit`)
  }

  const handleHide = async () => {
    if (!appId || !user?.id) return
    await hideApp({ id: appId, userId: user?.id })
  }

  const handleFavorite = async () => {
    if (!appId || !user?.id) return
    await favoriteApp({ id: app.id })
    await queryClient.invalidateQueries(api.app.getQueryKey())
  }

  const handleAddToSteam = async () => {
    if (!app?.id) return
    await addToSteam({ appInfo: app })
    setConfirm((prev) => ({
      ...prev,
      show: true,
      title: 'Do you want to restart Steam?',
      message:
        'You will need to restart Steam in order to see the new content there.',
      onConfirm: async () => {
        await restartSteam()
        await queryClient.invalidateQueries(api.app.getQueryKey())
      },
      onCancel: async () => {
        await queryClient.invalidateQueries(api.app.getQueryKey())
      },
    }))
  }

  const handleRemoveToSteam = async () => {
    if (!app?.id) return
    await removeAppFromSteam({ appInfo: app })
    await queryClient.invalidateQueries(api.app.getQueryKey())
  }

  const handleLaunchInBrowser = () => {
    if (!app.source || app.platform !== 'WEB') return
    openWebviewPage({ url: app.source })
  }

  const handleInstall = () => {
    // TODO: install app
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className='z-20 min-w-[220px] overflow-hidden rounded-md bg-secondary p-[5px] text-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
          alignOffset={5}
        >
          {!!app?.id && (isOwner || isAdmin) && (
            <ContextMenu.Item
              onClick={() => handleEdit()}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Edit
            </ContextMenu.Item>
          )}
          {user?.id && (
            <>
              {isFavorited ? (
                <ContextMenu.Item
                  onClick={() => handleFavorite()}
                  className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
                >
                  Unfavorite
                </ContextMenu.Item>
              ) : (
                <ContextMenu.Item
                  onClick={() => handleFavorite()}
                  className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
                >
                  Favorite
                </ContextMenu.Item>
              )}
            </>
          )}
          {isAddedToSteam ? (
            <ContextMenu.Item
              onClick={() => handleRemoveToSteam()}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Remove From Steam
            </ContextMenu.Item>
          ) : (
            <ContextMenu.Item
              onClick={() => handleAddToSteam()}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Add To Steam
            </ContextMenu.Item>
          )}

          {installable ? (
            <ContextMenu.Item
              onClick={() => handleInstall()}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Install
            </ContextMenu.Item>
          ) : (
            <ContextMenu.Item
              onClick={() => handleLaunchInBrowser()}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Launch In Browser
            </ContextMenu.Item>
          )}

          {(isOwner || isAdmin) && (
            <>
              <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />

              <ContextMenu.Item
                onClick={() => handleDelete()}
                className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
              >
                Delete
              </ContextMenu.Item>
            </>
          )}
          {/* {!!user?.id && (
            <ContextMenu.Item
              onClick={handleHide}
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            >
              Hide
            </ContextMenu.Item>
          )} */}
          {/* <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
            Back{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+[
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            disabled
          >
            Foward{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+]
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
            Reload{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+R
            </div>
          </ContextMenu.Item> */}
          {/* <ContextMenu.Sub>
            <ContextMenu.SubTrigger className=' text-violet11 data-[state=open]:bg-violet4 data-[state=open]:text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 data-[highlighted]:data-[state=open]:bg-violet9 data-[highlighted]:data-[state=open]:text-violet1 group relative z-20 flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
              More Tools
              <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className='bg-secondary z-20 min-w-[220px] overflow-hidden rounded-md p-[5px] text-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
                sideOffset={2}
                alignOffset={-5}
              >
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Save Page As…{' '}
                  <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
                    ⌘+S
                  </div>
                </ContextMenu.Item>
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Create Shortcut…
                </ContextMenu.Item>
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Name Window…
                </ContextMenu.Item>
                <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />
                <ContextMenu.Item className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'>
                  Developer Tools
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub> */}

          {/* <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' /> */}

          {/* <ContextMenu.CheckboxItem
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Bookmarks{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              ⌘+B
            </div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className='bg-violet6 m-[5px] h-[1px]' />

          <ContextMenu.Label className='text-mauve11 pl-[25px] text-xs leading-[25px]'>
            People
          </ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
              value='pedro'
            >
              <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem
              className='text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
              value='colm'
            >
              <ContextMenu.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              Colm Tuite
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup> */}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export default AppContextMenu
