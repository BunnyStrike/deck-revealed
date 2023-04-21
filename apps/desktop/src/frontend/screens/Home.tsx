import React, { useEffect } from 'react'
import { useAtom } from 'jotai'

import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const HomeScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data = [], error } = api.app.apps.useQuery({
    search: debouncedFilter,
    category: listFilter.category === 'All' ? undefined : listFilter.category,
    sort: listFilter.sort,
  })

  useEffect(() => {
    setListFilter((prev) => ({ ...prev, listCounter: data.length ?? 0 }))
  }, [data.length, setListFilter, listFilter])

  if (error) return <div>{error.message}</div>

  return <RevealedListView title='Home' list={data} />
}
