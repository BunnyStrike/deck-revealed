import React, { useEffect } from 'react'
import { useAtom } from 'jotai'

import { Container } from '../components'
import { BootVideoList } from '../components/BootVideo/BootVideoList'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const BootVideosScreen = () => {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data, error, isLoading } = api.bootVideo.all.useQuery({
    search: debouncedFilter,
  })

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
      <BootVideoList
        title='Home'
        list={data?.list ?? []}
        isLoading={isLoading}
      />
    </Container>
  )
}
