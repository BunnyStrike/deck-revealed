import { app } from 'electron'

import { icon } from '../constants'
import { getRevealedVersion } from '../utils/version'

export const showAboutWindow = () => {
  app.setAboutPanelOptions({
    applicationName: 'Revealed Games Launcher',
    applicationVersion: getRevealedVersion(),
    copyright: 'GPL V3',
    iconPath: icon,
    website: 'https://deckrevealed.com',
  })
  return app.showAboutPanel()
}
