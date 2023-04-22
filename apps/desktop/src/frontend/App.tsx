import React, { useContext } from 'react'
import { ClerkProvider, SignIn } from '@clerk/clerk-react'
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
import { AppsScreen } from './screens/Apps'
import { GamesScreen } from './screens/Games'
import { HomeScreen } from './screens/Home'
import { SettingsScreen } from './screens/Settings'
import { RevealedSignupScreen } from './screens/Signup'
import { SteamDeckScreen } from './screens/SteamDeck'
import { StoresScreen } from './screens/Stores'
import WebAppScreen from './screens/WebApp'
import WebView from './screens/WebView'
import { ApiProvider, api } from './utils/api'
import { getEnvVar } from './utils/envVar'

// import Login from './screens/Login'
// import WebView from './screens/WebView'
// import { GamePage } from './screens/Game'
// import Library from './screens/Library'
// import Apps from './screens/Apps'
// import WineManager from './screens/WineManager'
// import Sidebar from './components/UI/Sidebar'
// import Settings from './screens/Settings'
// import Accessibility from './screens/Accessibility'
// import ContextProvider from './state/ContextProvider'
// import { ControllerHints, OfflineMessage } from './components/UI'
// import DownloadManager from './screens/DownloadManager'
// import DialogHandler from './components/UI/DialogHandler'
// import SettingsModal from './screens/Settings/components/SettingsModal'
// import ExternalLinkDialog from './components/UI/ExternalLinkDialog'
// import AuthForm from './screens/Login/components/SupabaseLogin'
// import WebApp from './screens/WebApp'
// import BootVideos from './screens/BootVideos'

const clerkPubKey = getEnvVar('VITE_PUBLIC_CLERK_PUBLISHABLE_KEY')

function AppMain() {
  // const { isSettingsModalOpen } = useContext(ContextProvider)
  const navigate = useNavigate()

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Provider>
        <ApiProvider>
          <div id='app' className='bg-neutral  h-full w-full'>
            {/* <HashRouter> */}
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
                  <Route path='web'>
                    <Route path=':id' element={<WebAppScreen />} />
                  </Route>
                </Route>
                <Route path='/games' element={<GamesScreen />} />
                <Route path='/steam-deck' element={<SteamDeckScreen />} />
                <Route path='/stores' element={<StoresScreen />} />
                <Route path='/settings' element={<SettingsScreen />} />

                <Route path='login'>
                  <Route path='revealed' element={<RevealedSignupScreen />} />
                </Route>

                <Route path='loginweb'>
                  <Route path=':runner' element={<WebView />} />
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
            <Route path="/app">
              <Route path=":runner">
                <Route path=":id" element={<WebApp />} />
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

              <div className='simple-keyboard'></div>
            </div>
            {/* </HashRouter> */}
          </div>
        </ApiProvider>
      </Provider>
    </ClerkProvider>
  )
}

export default AppMain
