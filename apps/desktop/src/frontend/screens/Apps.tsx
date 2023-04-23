import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAtom } from 'jotai'

import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

export const AppsScreen = () => {
  const { user } = useUser()
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const {
    data = [],
    error,
    isLoading,
  } = api.app.apps.useQuery({
    search: debouncedFilter ? `${debouncedFilter}*` : undefined,
    category: listFilter.category === 'All' ? undefined : listFilter.category,
    sort: listFilter.sort,
    userId: user?.id,
  })

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data.length ?? 0,
      title: 'Apps',
      add: 'app',
    }))
  }, [data.length, setListFilter])

  if (error) return <div>{error.message}</div>

  return <RevealedListView title='Home' list={data} isLoading={isLoading} />
}
