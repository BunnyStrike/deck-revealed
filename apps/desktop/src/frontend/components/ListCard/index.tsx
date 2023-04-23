import './style.css'
import React from 'react'
import { PlayIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import { type AppListOutput, type GameListOutput } from '../../utils/api'
import { getMediaUrl } from '../../utils/database'
import AppContextMenu from '../ContextMenu'

interface RevealedListCardProps {
  item: GameListOutput[number] | AppListOutput[number]
}
export const RevealedListCard = ({ item }: RevealedListCardProps) => {
  const { name, coverUrl, id, ownerId } = item
  const navigate = useNavigate()

  const handleLaunchClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation()
    navigate('/app/web/' + id)
  }

  const handleDetailClick = () => {
    // navigate('/app/web/' + id)
  }

  return (
    <AppContextMenu
      appId={id}
      ownerId={ownerId}
      app={item as AppListOutput[number]}
    >
      <div
        onClick={() => handleDetailClick()}
        className='card image-full-color hover-bordered active:outline-offset-3 outline-primary group cursor-pointer pb-0 hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
      >
        <figure>
          <img
            src={coverUrl ? getMediaUrl(coverUrl) : 'img/steam-pill.jpg'}
            alt='car!'
          />
        </figure>
        <div className='card-body h-full justify-end p-0'>
          <h2 className='card-title p-2 group-hover:text-white '>{name}</h2>
          <div className='flex justify-end rounded-b-2xl bg-gray-800 p-2'>
            <button
              onClick={(e) => handleLaunchClick(e)}
              className='btn btn-primary btn-sm outline-white hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
            >
              <PlayIcon />
            </button>
          </div>
        </div>
      </div>
    </AppContextMenu>
  )
}
