import React from 'react'
import { PlayIcon } from '@radix-ui/react-icons'

import { type AppListOutput, type GameListOutput } from '../utils/api'

interface RevealedListCardProps {
  item: GameListOutput[number] | AppListOutput[number]
}
export const RevealedListCard = ({ item }: RevealedListCardProps) => {
  return (
    <div className='card glass image-full hover-bordered active:outline-offset-3 group cursor-pointer pb-0 shadow-xl hover:bg-sky-500 hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'>
      <figure>
        <img src='public/img/steam-pill.jpg' alt='car!' />
      </figure>
      <div className='card-body h-full justify-end p-0'>
        <h2 className='card-title p-2 group-hover:text-white '>{item.name}</h2>
        <div className='bg-secondary-content flex justify-end rounded-b-2xl p-2'>
          <button className='btn btn-primary btn-sm outline-slate-200 hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'>
            <PlayIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
