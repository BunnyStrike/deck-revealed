import React from 'react'
import { useAtom } from 'jotai'

import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const GamesScreen = () => {
  const [listFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data = [], error } = api.app.all.useQuery({
    search: debouncedFilter,
  })

  if (error) return <div>{error.message}</div>

  return <RevealedListView title='Home' list={data} />
}
