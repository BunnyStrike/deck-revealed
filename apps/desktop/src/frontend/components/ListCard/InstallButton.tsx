import { DownloadIcon, PlayIcon } from '@radix-ui/react-icons'
import { useUser } from '@supabase/auth-helpers-react'
import { api, type AppListOutput } from 'frontend/utils/api'
import { useNavigate } from 'react-router-dom'

interface InstallButtonProps {
  app: AppListOutput[number]
  // item: GameListOutput[number] | AppListOutput[number]
}

export const InstallButton = ({ app }: InstallButtonProps) => {
  const { id } = app
  const user = useUser()
  const navigate = useNavigate()
  const { mutate } = api.app.recent.useMutation()
  const { data: isInstalled = false } =
    api.desktop.apps.isAppInstalled.useQuery({ app })
  const { mutate: runApp } = api.desktop.apps.runApp.useMutation()
  const { mutate: runScript } = api.desktop.apps.runScript.useMutation()

  const handleInstall = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (user?.id) {
      mutate({ id })
    }
    runScript({ app })
    // navigate(`/app/${id}/webview`)
  }

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (user?.id) {
      mutate({ id })
    }
    runApp({ app })
    // navigate(`/app/${id}/webview`)
  }

  return !isInstalled ? (
    <button
      onClick={(e) => handleInstall(e)}
      className='btn-primary btn-sm btn outline-white hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
    >
      <DownloadIcon />
    </button>
  ) : (
    <button
      onClick={(e) => handlePlay(e)}
      className='btn-primary btn-sm btn outline-white hover:outline hover:outline-2 hover:outline-offset-2 active:outline active:outline-2'
    >
      <PlayIcon />
    </button>
  )
}
