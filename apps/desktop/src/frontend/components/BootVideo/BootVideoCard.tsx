import './boot-video-card.css'
import React from 'react'
import { DownloadIcon, PlayIcon } from '@radix-ui/react-icons'
import { IconDownload } from '@tabler/icons-react'
import { useUser } from 'frontend/hooks'
import { useNavigate } from 'react-router-dom'

import { api, type BootVideoOutput, type GameListOutput } from '../../utils/api'
import { getMediaUrl } from '../../utils/database'
import AppContextMenu from '../ContextMenu'

interface BootVideoCardProps {
  item: BootVideoOutput[number]
  // item: GameListOutput[number] | AppListOutput[number]
}
export const BootVideoCard = ({ item }: BootVideoCardProps) => {
  const { name, id, url } = item
  const { user } = useUser()
  const navigate = useNavigate()
  const { mutate } = api.app.recent.useMutation()
  const installable = false

  const handleLaunchClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (user?.id) {
      mutate({ id, userId: user.id })
    }
    navigate(`/app/${id}/webview`)
  }

  const handleInstall = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (user?.id) {
      mutate({ id, userId: user.id })
    }
    navigate(`/app/${id}/webview`)
  }

  const handleDetailClick = () => {
    if (user?.id) {
      mutate({ id, userId: user.id })
    }
    navigate(`/app/${id}`)
  }

  return (
    // <AppContextMenu appId={id} ownerId={ownerId} app={item}>
    <div
      onClick={() => handleDetailClick()}
      className='image-full-color active:outline-offset-3 group card hover-bordered cursor-pointer pb-0 outline-primary hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
    >
      <figure>{url && <video src={getMediaUrl(url, 'bootVideos')} />}</figure>
      <div className='card-body h-full justify-end p-0'>
        <h2 className='card-title p-2 group-hover:text-white '>{name}</h2>
        <div className='flex justify-end rounded-b-2xl bg-gray-800 p-2'>
          {installable ? (
            <button
              onClick={(e) => handleInstall(e)}
              className='btn-primary btn-sm btn outline-white hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
            >
              <DownloadIcon />
            </button>
          ) : (
            <button
              onClick={(e) => handleLaunchClick(e)}
              className='btn-primary btn-sm btn outline-white hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
            >
              <PlayIcon />
            </button>
          )}
        </div>
      </div>
    </div>
    // </AppContextMenu>
  )
}