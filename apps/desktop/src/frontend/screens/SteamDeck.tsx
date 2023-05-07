import React, { useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { useUser } from '@supabase/auth-helpers-react'
import { useAtom } from 'jotai'

// import { PillTabs } from '@revealed/ui'

import { Container } from '../components'
import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const SteamDeckScreen = () => {
  const user = useUser()
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data, error, isLoading } = api.app.all.useQuery(
    {
      search: debouncedFilter ? `${debouncedFilter}*` : undefined,
      category: listFilter.category === 'All' ? undefined : listFilter.category,
      sort: listFilter.sort,
      userId: user?.id,
      platform: 'STEAMOS',
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 300000,
    }
  )

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data?.list.length ?? 0,
      title: 'Steam Deck',
      add: 'app',
    }))
  }, [data?.list.length, setListFilter])

  if (error) return <div>{error.message}</div>

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
