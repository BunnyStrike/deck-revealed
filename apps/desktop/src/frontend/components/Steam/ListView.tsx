import React from 'react'
import { Tab } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

// import { PillTabs } from '@revealed/ui'

import { listFilterAtom, modalsAtom } from '../../states'
import {
  type AppListOutput,
  type GameListOutput,
  type SteamGameListOutput,
} from '../../utils/api'
import EmptyState from '../EmptyState'
import { LoadingBar } from '../LoadingBar'
import RevealedSearchBar from '../SearchBar'
import { GameListCard } from './ListCard'

interface GamesListViewProps {
  title: string
  isLoading?: boolean
  // list: GameListOutput | AppListOutput
  list: SteamGameListOutput
}

export const GamesListView = ({
  title,
  isLoading = false,
  list = [],
}: GamesListViewProps) => {
  const [listFilter] = useAtom(listFilterAtom)
  const [modals, setModals] = useAtom(modalsAtom)
  const navigate = useNavigate()

  const handleAddApp = () => {
    navigate(`/app/add`)
  }

  return (
    <div className='bg-neutral'>
      <RevealedSearchBar />

      {(listFilter.add === 'app' || listFilter.add === 'both') && (
        <button
          onClick={() => handleAddApp()}
          className='btn-primary btn mr-4 mt-4'
        >
          Add App
        </button>
      )}
      {/* {(listFilter.add === 'game' || listFilter.add === 'both') && (
        <button
          onClick={() => setModals((prev) => ({ ...prev, showAddGame: true }))}
          className='btn-primary btn mr-4 mt-4'
        >
          Add Game
        </button>
      )} */}

      <div className=''>
        {isLoading && (
          <div className='bg-neutral'>
            {/* <h3>Loading</h3> */}
            <LoadingBar />
          </div>
        )}
        {!isLoading && !list.length && listFilter.add === 'app' && (
          <EmptyState
            message={`Add a new app`}
            onClick={() => handleAddApp()}
          />
        )}
        {!isLoading && !list.length && listFilter.add === 'game' && (
          <EmptyState
            message={`Add a new game`}
            onClick={() =>
              setModals((prev) => ({ ...prev, showAddGame: true }))
            }
          />
        )}
        {!isLoading && !list.length && listFilter.add === 'both' && (
          <EmptyState message={`Empty`} />
        )}
        <div className='xs:grid-cols-2  mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-4 2xl:grid-cols-8'>
          {list.map((item) => (
            <GameListCard key={item.appid} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
