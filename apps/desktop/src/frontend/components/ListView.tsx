import React from 'react'

import { type AppListOutput, type GameListOutput } from '../utils/api'
import { RevealedListCard } from './ListCard'
import RevealedSearchBar from './SearchBar'

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
]
interface RevealedListViewProps {
  list: GameListOutput | AppListOutput
}

export const RevealedListView = ({ list = [] }: RevealedListViewProps) => {
  return (
    <div className='bg-white'>
      <RevealedSearchBar />
      {/* <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-1 lg:grid-cols-2'>
            {stats.map((stat) => (
              <div
                key={stat.name}
                className='bg-gray-900 px-4 py-6 sm:px-6 lg:px-8'
              >
                <p className='text-sm font-medium leading-6 text-gray-400'>
                  {stat.name}
                </p>
                <p className='mt-2 flex items-baseline gap-x-2'>
                  <span className='text-4xl font-semibold tracking-tight text-white'>
                    {stat.value}
                  </span>
                  {stat.unit ? (
                    <span className='text-sm text-gray-400'>{stat.unit}</span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className=''>
        {/* <h2 className='text-2xl font-bold tracking-tight text-gray-900'> lg:max-w-7xl
          Customers also purchased
        </h2> */}

        <div className='mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8'>
          {list.map((item) => (
            <RevealedListCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
