import React, { useState } from 'react'
import { ClerkProvider, SignIn } from '@clerk/clerk-react'
import { Provider } from 'jotai'
import { createRoot } from 'react-dom/client'

import { ApiProvider, api } from './utils/api'
import { desktopApi } from './utils/desktopApi'
import { getEnvVar } from './utils/envVar'

const clerkPubKey = getEnvVar('VITE_PUBLIC_CLERK_PUBLISHABLE_KEY')

console.log(clerkPubKey)

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ApiProvider>
        {/* <DesktopApiProvider> */}
        <HelloElectron />
        {/* </DesktopApiProvider> */}
      </ApiProvider>
    </ClerkProvider>
  )
  //   <ClerkProvider publishableKey={clerkPubKey}>
  //     <Provider>
  //       {/* <ApiProvider> */}
  // {/* <DesktopApiProvider> */}
  //       <HelloElectron />
  //       {/* </DesktopApiProvider> */}
  //       {/* </ApiProvider> */}
  //     </Provider>
  //   </ClerkProvider>
  // )
}

function HelloElectron() {
  const { data, error } = api.app.all.useQuery()
  // const { data: info, error: infoError } = api.system.info.useQuery()
  // desktopApi.subscription.useSubscription(undefined, { // const { data } = desktopApi.greeting.useQuery({ name: 'Electron' })
  //   onData: (data) => {
  //     console.log(data)
  //   },
  // })
  // console.log(info, infoError)
  console.log(data, error)
  // if (!data) {
  //   return null
  // }
  // return <SignIn />
  return (
    <div className='center'>
      <SignIn />
    </div>
  ) // <div>test test</div>
}

const root = createRoot(document.getElementById('react-root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
