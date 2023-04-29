import React, { useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { useAtom } from 'jotai'

import { PillTabs } from '@revealed/ui'

import { BootVideoList } from '../components/BootVideo/BootVideoList'
import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const BootVideosScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const {
    data = [],
    error,
    isLoading,
  } = api.bootVideo.all.useQuery({
    search: debouncedFilter,
  })

  useEffect(() => {
    setListFilter((prev) => ({
      ...prev,
      listCounter: data.length ?? 0,
      title: 'Steam Deck',
      add: 'app',
    }))
  }, [data.length, setListFilter])

  if (error) return <div>{error.message}</div>

  return <BootVideoList title='Home' list={data} isLoading={isLoading} />
}
