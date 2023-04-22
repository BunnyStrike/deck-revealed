import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router'

import { type Runner, type WebviewType } from '~/common/types'
import { api } from '../utils/api'
// import { UpdateComponent } from 'frontend/components/UI'
// import WebviewControls from 'frontend/components/UI/WebviewControls'
// import ContextProvider from 'frontend/state/ContextProvider'
import WebviewControls from './WebView/WebviewControls'

// import './index.css'

// import LoginWarning from '../Login/components/LoginWarning'

export default function WebAppScreen() {
  const { i18n } = useTranslation()
  const { pathname, search, state } = useLocation()
  const { t } = useTranslation()
  // const { epic, gog, connectivity } = useContext(ContextProvider)
  const [loading, setLoading] = useState<{
    refresh: boolean
    message: string
  }>(() => ({
    refresh: true,
    message: t('loading.website', 'Loading Website'),
  }))
  const navigate = useNavigate()
  const webviewRef = useRef<WebviewType>(null)

  const trueAsStr = 'true' as unknown as boolean | undefined
  const { runner, id } = useParams() as { runner: Runner; id: string }
  const { data, error, isLoading } = api.app.byId.useQuery({
    id,
  })

  console.log(data)

  const startUrl = data?.url ?? 'https://google.com' //'https://netflix.com'

  const [preloadPath, setPreloadPath] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchLocalPreloadPath = async () => {
      // const path = (await window.api.getLocalPeloadPath()) as unknown
      // if (mounted) {
      //   setPreloadPath(path as string)
      // }
    }

    return () => {
      mounted = false
    }
  }, [])

  const handleSuccessfulLogin = () => {
    navigate('/login')
  }

  // useLayoutEffect(() => {
  //   const webview = webviewRef.current
  //   if (webview && ((preloadPath && isEpicLogin) || !isEpicLogin)) {
  //     const onIpcMessage = async (event: unknown) => {
  //       const e = event as { channel: string; args: string[] }
  //       if (e.channel === 'processEpicLoginCode') {
  //         try {
  //           setLoading({
  //             refresh: true,
  //             message: t('status.logging', 'Logging In...'),
  //           })
  //           await epic.login(e.args[0])
  //           handleSuccessfulLogin()
  //         } catch (error) {
  //           console.error(error)
  //           window.api.logError(String(error))
  //         }
  //       }
  //     }

  //     webview.addEventListener('ipc-message', onIpcMessage)

  //     const loadstop = async () => {
  //       setLoading({ ...loading, refresh: false })
  //       // Ignore the login handling if not on login page
  //       if (!runner) {
  //         return
  //       } else if (runner === 'gog') {
  //         const pageUrl = webview.getURL()
  //         // if (pageUrl.match(gogEmbedRegExp)) {
  //         //   const parsedURL = new URL(pageUrl)
  //         //   const code = parsedURL.searchParams.get('code')
  //         //   setLoading({
  //         //     refresh: true,
  //         //     message: t('status.logging', 'Logging In...'),
  //         //   })
  //         //   if (code) {
  //         //     gog.login(code).then(() => {
  //         //       handleSuccessfulLogin()
  //         //     })
  //         //   }
  //         // }
  //       }
  //     }

  //     webview.addEventListener('dom-ready', loadstop)

  //     // if the page title changed it's because the store loaded so there's
  //     // connectivity, we can update the status without waiting for the checks
  //     const updateConnectivity = () => {
  //       if (connectivity.status !== 'online') {
  //         window.api.setConnectivityOnline()
  //       }
  //     }
  //     webview.addEventListener('page-title-updated', updateConnectivity)

  //     return () => {
  //       webview.removeEventListener('ipc-message', onIpcMessage)
  //       webview.removeEventListener('dom-ready', loadstop)
  //       webview.removeEventListener('page-title-updated', updateConnectivity)
  //     }
  //   }
  //   return
  // }, [webviewRef.current, preloadPath])

  const [showLoginWarningFor, setShowLoginWarningFor] = useState<
    null | 'epic' | 'gog'
  >(null)

  useEffect(() => {
    // if (startUrl.match(/epicgames\.com/) && !epic.username) {
    //   setShowLoginWarningFor('epic')
    // } else if (startUrl.match(/gog\.com/) && !startUrl.match(/auth\.gog\.com/) && !gog.username) {
    //   setShowLoginWarningFor('gog')
    // }
  }, [startUrl])

  const onLoginWarningClosed = () => {
    setShowLoginWarningFor(null)
  }

  // if (!preloadPath) {
  //   return <></>
  // }

  console.log(startUrl)

  if (isLoading) {
    ;<div>Loading</div>
  }

  return (
    <div className='WebView'>
      {webviewRef.current && (
        <WebviewControls
          webview={webviewRef.current}
          initURL={startUrl}
          openInBrowser={!startUrl.startsWith('login')}
        />
      )}
      {/* {loading.refresh && <UpdateComponent message={loading.message} />} */}
      <webview
        ref={webviewRef}
        className='WebView__webview'
        partition='persist:webapp'
        src={startUrl}
        allowpopups={trueAsStr}
        // useragent="Mozilla/5.0 (Windows NT 10.0; WOW64; rv:70.0) Gecko/20100101 Firefox/70.0"
        {...(preloadPath ? { preload: preloadPath } : {})}
      />
      {/* {showLoginWarningFor && (
        <LoginWarning warnLoginForStore={showLoginWarningFor} onClose={onLoginWarningClosed} />
      )} */}
    </div>
  )
}
