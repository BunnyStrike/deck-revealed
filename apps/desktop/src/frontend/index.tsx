import './styles/globals.css'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import AppMain from './App'
import { initGamepad } from './utils/gamepad'

function App() {
  return (
    <BrowserRouter basename={'/'}>
      <div data-theme='revealed' className='relative h-screen w-full '>
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
