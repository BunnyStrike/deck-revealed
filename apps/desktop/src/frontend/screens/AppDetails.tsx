import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'

import { RevealedListView } from '../components/ListView'
import { useDebounce } from '../hooks/useDebounce'
import { listFilterAtom } from '../states'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

export const AppDetailsScreen = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const { data, error, isLoading } = api.app.byId.useQuery({
    id: id as string,
  })

  if (error) return <div>{error.message}</div>

  return <div>{data?.name}</div>
}
