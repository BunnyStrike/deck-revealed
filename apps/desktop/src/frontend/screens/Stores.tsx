import React from 'react'
import { useAtom } from 'jotai'

import { Container } from '../components'
import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'

export const StoresScreen = () => {
  const [listFilter] = useAtom(listFilterAtom)
  const debouncedFilter = useDebounce(listFilter.name, 500)
  const { data = [], error } = api.app.all.useQuery({
    search: debouncedFilter,
  })

  if (error) return <div>{error.message}</div>

  return (
    <Container>
      <RevealedListView title='Home' list={data} />
    </Container>
  )
}
