import React, { useEffect } from 'react'
// import { useUser } from '@clerk/clerk-react'
import { useAtom } from 'jotai'

import { Container } from '../components'
import { RevealedListView } from '../components/ListView'
import { useUser } from '../hooks'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

export const AppsScreen = () => {
  const { user } = useUser()
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data, error, isLoading } = api.app.all.useQuery(
    {
      search: debouncedFilter ? `${debouncedFilter}*` : undefined,
      category: listFilter.category === 'All' ? undefined : listFilter.category,
      sort: listFilter.sort,
      userId: user?.id,
      notPlatform: 'STEAMOS',
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 300000,
    }
  )

  console.log(data)

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data?.list.length ?? 0,
      title: 'Apps',
      add: 'app',
    }))
  }, [data?.list.length, setListFilter])

  if (error)
    return (
      <div>
        <p>{error.message}</p>
        <p>{error?.data?.code || 'Unknown'}</p>
      </div>
    )

  return (
    <Container>
      <RevealedListView
        title='Home'
        list={data?.list ?? []}
        isLoading={isLoading}
      />
    </Container>
  )
}
