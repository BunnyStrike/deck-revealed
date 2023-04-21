import React, { useEffect } from 'react'
import { useAtom } from 'jotai'

import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const HomeScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const {
    data = [],
    error,
    isLoading,
  } = api.app.apps.useQuery({
    search: debouncedFilter,
    category: listFilter.category === 'All' ? undefined : listFilter.category,
    sort: listFilter.sort,
  })

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data.length ?? 0,
      title: 'Home',
      add: 'both',
    }))
  }, [data.length, setListFilter])

  if (error) return <div>{error.message}</div>

  return <RevealedListView title='Home' list={data} isLoading={isLoading} />
}