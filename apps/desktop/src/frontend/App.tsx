import React, { useContext } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Provider } from 'jotai'
// import './App.css'
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import { RevealedOfflineMessage } from './components'
import AddAppModal from './components/AddAppModel'
import AddGameModal from './components/AddGameModel'
import RevealedApplicationShell from './components/ApplicationShell'
import ConfirmDialog from './components/ConfirmDialog'
import { LoadingBar } from './components/LoadingBar'
// import { SupabaseProvider } from '@revealed/ui'
import { SupabaseProvider } from './components/SupabaseProvider'
import { AppDetailsScreen } from './screens'
import AppManageScreen from './screens/AppManage'
import { AppsScreen } from './screens/Apps'
import { BootVideosScreen } from './screens/BootVideos'
import { GamesScreen } from './screens/Games'
import { HomeScreen } from './screens/Home'
import { SettingsScreen } from './screens/Settings'
import { RevealedSignupScreen } from './screens/Signup'
import { SteamDeckScreen } from './screens/SteamDeck'
import { StoresScreen } from './screens/Stores'
import WebAppScreen from './screens/WebApp'
import WebView from './screens/WebView'
import { ApiProvider, api } from './utils/api'
import { supabaseClient } from './utils/database'
import { getEnvVar } from './utils/envVar'

function AppMain() {
  // const { isSettingsModalOpen } = useContext(ContextProvider)

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Provider>
        <ApiProvider>
          <div id='app' className='h-full  w-full bg-neutral'>
            <RevealedOfflineMessage />
            <RevealedApplicationShell>
              {/* <DialogHandler /> */}
              {/* {isSettingsModalOpen.gameInfo && (
            <SettingsModal
              gameInfo={isSettingsModalOpen.gameInfo}
              type={isSettingsModalOpen.type}
            />
          )} */}
              {/* <ExternalLinkDialog /> */}
              <Routes>
                {/* <Route path='/' element={<Navigate replace to='/' />} /> */}
                <Route path='/' element={<HomeScreen />} />
                <Route path='/apps' element={<AppsScreen />} />
                <Route path='/app'>
                  <Route path=':id'>
                    <Route
                      path='edit'
                      element={<AppManageScreen mode='Edit' />}
                    />
                    <Route path='webview' element={<WebAppScreen />} />
                    <Route path='' element={<AppDetailsScreen />} />
                  </Route>

                  <Route path='add' element={<AppManageScreen mode='Add' />} />
                </Route>
                <Route path='/games' element={<GamesScreen />} />

                <Route path='/steam-deck'>
                  <Route path='apps' element={<SteamDeckScreen />} />
                  <Route path='boot-videos' element={<BootVideosScreen />} />
                </Route>

                <Route path='/stores' element={<StoresScreen />} />
                <Route path='/settings' element={<SettingsScreen />} />

                <Route path='login'>
                  <Route path='revealed' element={<RevealedSignupScreen />} />
                </Route>

                <Route path='loginweb'>
                  <Route path=':runner' element={<WebView />} />
                </Route>

                <Route path='/stores'>
                  <Route path='epicStore' element={<WebView />} />
                  <Route path='gogStore' element={<WebView />} />
                  <Route path='steamStore' element={<WebView />} />
                  <Route path='fanaticalStore' element={<WebView />} />
                </Route>

                {/* <Route path="/" element={<Navigate replace to="/apps" />} />
            <Route path="/library" element={<Library />} />
            {/* <Route path="/home" element={<Apps />} /> */}
                {/* <Route path="/apps" element={<Apps />} />
            <Route path="steam-deck/utilities" element={<Apps filterBy="Utilities" />} />
            <Route path="steam-deck/boot-videos" element={<BootVideos />} />
            <Route path="login" element={<Login />} />
            <Route path="epicstore" element={<WebView />} />
            <Route path="gogstore" element={<WebView />} />
            <Route path="wiki" element={<WebView />} />
            <Route path="/gamepage">
              <Route path=":runner">
                <Route path=":appName" element={<GamePage />} />
              </Route>
            </Route>
            <Route path="/store-page" element={<WebView />} />
            <Route path="loginweb">
              <Route path=":runner" element={<WebView />} />
            </Route>
            <Route path="loginui">
              <Route path="revealed" element={<AuthForm />} />
            </Route>
            <Route path="settings">
              <Route path=":runner">
                <Route path=":appName">
                  <Route path=":type" element={<Settings />} />
                </Route>
              </Route>
            </Route>
            <Route path="/wine-manager" element={<WineManager />} />
            <Route path="/download-manager" element={<DownloadManager />} />
            <Route path="/accessibility" element={<Accessibility />} /> */}
              </Routes>
            </RevealedApplicationShell>
            <div className='controller'>
              {/* <ControllerHints /> */}
              <AddAppModal />
              <AddGameModal />
              <ConfirmDialog />

              <div className='simple-keyboard'></div>
            </div>
          </div>
        </ApiProvider>
      </Provider>
    </SessionContextProvider>
  )
}

export default AppMain
