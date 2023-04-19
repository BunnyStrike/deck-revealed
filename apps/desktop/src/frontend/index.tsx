import './styles/globals.css'
import React, { useState } from 'react'
import { ClerkProvider, SignIn } from '@clerk/clerk-react'
import { Provider } from 'jotai'
import { createRoot } from 'react-dom/client'

import { RevealedContextMenu } from '@revealed/ui'

import RevealedSidenav from './components/Sidenav'
import { RevealedSignupScreen } from './screens/signup'
import { ApiProvider, api } from './utils/api'
import { getEnvVar } from './utils/envVar'

const clerkPubKey = getEnvVar('VITE_PUBLIC_CLERK_PUBLISHABLE_KEY')

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider>
        <ApiProvider>
          <div>
            {/* <RevealedSidenav /> */}
            <RevealedSignupScreen />
          </div>
        </ApiProvider>
      </Provider>
    </ClerkProvider>
  )
}

const root = createRoot(document.getElementById('react-root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
