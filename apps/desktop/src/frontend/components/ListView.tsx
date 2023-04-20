import React from 'react'

import { type AppListOutput, type GameListOutput } from '../utils/api'
import { RevealedListCard } from './ListCard'
import RevealedSearchBar from './SearchBar'

interface RevealedListViewProps {
  title: string
  list: GameListOutput | AppListOutput
}

export const RevealedListView = ({
  title,
  list = [],
}: RevealedListViewProps) => {
  return (
    <div className='bg-white'>
      <RevealedSearchBar />
      <div className=''>
        <h3>{title}</h3>
        <div className='xs:grid-cols-2  mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-4 2xl:grid-cols-8'>
          {list.map((item) => (
            <RevealedListCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
