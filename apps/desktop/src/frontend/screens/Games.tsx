import React, { useEffect } from 'react'
import { useAtom } from 'jotai'

import { Container } from '../components'
import { GamesListView } from '../components/Steam/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const GamesScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const {
    data: games = [],
    isLoading,
    error,
  } = api.desktop.games.steam.useQuery()

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: games.length ?? 0,
      title: 'Games',
      add: 'game',
    }))
  }, [games.length, setListFilter])

  if (error) return <div>{error.message}</div>

  return (
    <Container>
      <GamesListView
        title='Home'
        list={games.filter(
          (game) =>
            !debouncedFilter ||
            game.name.toLowerCase().includes(debouncedFilter.toLowerCase())
        )}
        isLoading={isLoading}
      />
    </Container>
  )
}
