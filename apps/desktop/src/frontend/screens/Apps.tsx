import React from 'react'

import { RevealedListView } from '../components/ListView'
import { api, type AppListOutput, type GameListOutput } from '../utils/api'

export const AppsScreen = () => {
  const { data = [], error } = api.app.all.useQuery()
  if (error) return <div>{error.message}</div>
  return <RevealedListView list={data} />
}
