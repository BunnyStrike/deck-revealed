import path from 'path'
import { app } from 'electron'

import { initializeApp } from './initialize'

app.on('ready', () => {
  initializeApp()
})
