import React from 'react'

import { type AppListOutput, type GameListOutput } from '../utils/api'

interface RevealedListCardProps {
  item: GameListOutput[number] | AppListOutput[number]
}
export const RevealedListCard = ({ item }: RevealedListCardProps) => {
  return (
    <div className='card glass'>
      <figure>
        <img src='public/img/steam-pill.jpg' alt='car!' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{item.name}</h2>
        {/* <p>How to park your car at your garage?</p>
        <div className='card-actions justify-end'>
          <button className='btn btn-primary'>Learn now!</button>
        </div> */}
      </div>
    </div>
  )
}
