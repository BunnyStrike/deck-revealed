import { useParams } from 'react-router-dom'

import { LoadingBar } from '../components/LoadingBar'
import AppManageForm from '../components/ManageApp/AppApplication'
import { api } from '../utils/api'

interface AppManageScreenProps {
  mode?: 'Add' | 'Edit'
}

export default function AppManageScreen({
  mode = 'Add',
}: AppManageScreenProps) {
  const { id } = useParams()
  const { data: app, isLoading: isAppLoading } = api.app.byId.useQuery({
    id: id ?? '',
  })

  if (isAppLoading) {
    return <LoadingBar />
  }

  if (!app) {
    return <div>App not found</div>
  }

  return <AppManageForm mode={mode} app={app} />
}
