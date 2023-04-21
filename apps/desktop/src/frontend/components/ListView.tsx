import React from 'react'
import { useAtom } from 'jotai'

import { listFilterAtom } from '../states'
import { type AppListOutput, type GameListOutput } from '../utils/api'
import AddAppModal from './AddAppModel'
import AddGameModal from './AddGameModel'
import DialogModal from './Dialog'
import EmptyState from './EmptyState'
import { RevealedListCard } from './ListCard'
import RevealedSearchBar from './SearchBar'

interface RevealedListViewProps {
  title: string
  isLoading?: boolean
  list: GameListOutput | AppListOutput
}

export const RevealedListView = ({
  title,
  isLoading = false,
  list = [],
}: RevealedListViewProps) => {
  const [listFilter] = useAtom(listFilterAtom)

  return (
    <div className='bg-neutral'>
      <RevealedSearchBar />
      {(listFilter.add === 'app' || listFilter.add === 'both') && (
        <AddAppModal />
      )}
      {(listFilter.add === 'game' || listFilter.add === 'both') && (
        <AddGameModal />
      )}
      <div className=''>
        {isLoading && (
          <div className='bg-neutral'>
            {/* <h3>Loading</h3> */}
            <progress className='progress progress-primary	 w-full'></progress>
          </div>
        )}
        {!isLoading && !list.length && listFilter.add === 'app' && (
          <AddAppModal
            actionButton={<EmptyState message={`Add a new app`} />}
          />
        )}
        {!isLoading && !list.length && listFilter.add === 'game' && (
          <AddGameModal
            actionButton={<EmptyState message={`Add a new game`} />}
          />
        )}
        {!isLoading && !list.length && listFilter.add === 'both' && (
          <EmptyState message={`Empty`} />
        )}
        <div className='xs:grid-cols-2  mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-4 2xl:grid-cols-8'>
          {list.map((item) => (
            <RevealedListCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
