import './list-card.css'
import React from 'react'
// import { useUser } from '@clerk/clerk-react'
import { DownloadIcon, PlayIcon } from '@radix-ui/react-icons'
import { useUser } from '@supabase/auth-helpers-react'
import {
  IconBrandSteam,
  IconDownload,
  IconHeart,
  IconHeartFilled,
  IconSteam,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import { FavoriteButton } from '@revealed/ui'

import {
  api,
  type AppListOutput,
  type GameListOutput,
  type SteamGameListOutput,
} from '../../utils/api'
import { getMediaUrl } from '../../utils/database'
import AppContextMenu from '../ContextMenu'

interface RevealedListCardProps {
  item: SteamGameListOutput[number]
  // item: GameListOutput[number] | AppListOutput[number]
}
export const GameListCard = ({ item }: RevealedListCardProps) => {
  const { name, images, appid } = item
  const { cover } = images
  const user = useUser()
  const navigate = useNavigate()
  const { mutate } = api.app.recent.useMutation()
  const { data: isAddedToSteam = false } =
    api.desktop.steam.isAddedToSteam.useQuery({ title: name })

  // console.log(item?.platform)

  const handleLaunchClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>
  ) => {
    //   e.stopPropagation()
    //   if (user?.id) {
    //     mutate({ id })
    //   }
    //   navigate(`/app/${id}/webview`)
  }

  // const handleDetailClick = () => {
  //   if (user?.id) {
  //     mutate({ id })
  //   }
  //   navigate(`/app/${id}`)
  // }

  console.log(`atom://${cover}`)

  return (
    // <AppContextMenu
    //   appId={id}
    //   ownerId={ownerId}
    //   app={item}
    //   isAddedToSteam={isAddedToSteam}
    // >
    <div
      onClick={(e) => handleLaunchClick(e)}
      className='image-full-color active:outline-offset-3 group card hover-bordered cursor-pointer pb-0 outline-primary hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
    >
      <figure>
        <img
          src={cover ? `atom://${cover}` : 'img/steam-pill.jpg'}
          alt='car!'
        />
      </figure>
      <div className='card-body h-full justify-end p-0'>
        {isAddedToSteam && (
          <div
            className='absolute right-2 top-2 rounded-md bg-secondary p-0.5'
            title='Added to Steam'
          >
            <IconBrandSteam className='text-white' />
          </div>
        )}

        <h2 className='card-title p-2 group-hover:text-white '>{name}</h2>
        <div className='flex justify-end gap-2 rounded-b-2xl bg-gray-800 p-2'></div>
      </div>
    </div>
    // </AppContextMenu>
  )
}
