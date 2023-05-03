import React, { useEffect } from 'react'
import { useAtom } from 'jotai'

import { Container } from '../components'
import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const GamesScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const {
    data = [],
    error,
    isLoading,
  } = api.game.all.useQuery({
    search: debouncedFilter,
  })
  const { data: games = [] } = api.desktop.games.steam.useQuery()

  console.log(games)

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data.length ?? 0,
      title: 'Games',
      add: 'game',
    }))
  }, [data.length, setListFilter])

  if (error) return <div>{error.message}</div>

  return (
    <Container>
      <RevealedListView title='Home' list={data} isLoading={isLoading} />
    </Container>
  )
}
