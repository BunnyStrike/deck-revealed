import './styles/globals.css'
import React, { useState } from 'react'
import { ClerkProvider, SignIn } from '@clerk/clerk-react'
import { Provider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'

import { RevealedContextMenu } from '@revealed/ui'

import AppMain from './App'
import RevealedSidenav from './components/Sidenav'
import { ApiProvider, api } from './utils/api'
import { getEnvVar } from './utils/envVar'

function App() {
  return (
    <BrowserRouter>
      <div data-theme='cupcake' className='h-full bg-white'>
        <AppMain />
      </div>
    </BrowserRouter>
  )
}

const root = createRoot(document.getElementById('react-root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
