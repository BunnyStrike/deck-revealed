import { join } from 'path'
import { app } from 'electron'

import { appImagesFolder, isWindows } from '../../constants'
import { addNonSteamApp } from './nonesteamapp'

export const addRevealedToSteam = async (): Promise<boolean> => {
  const newEntry = {
    name: 'Revealed',
    exe: '',
    startDir: '',
    art_cover: '',
    art_square: '',
    art_logo: '',
    icon: '',
  }

  newEntry.exe = app.getPath('exe')
  newEntry.startDir = app.getAppPath()

  newEntry.art_cover =
    'https://github.com/BunnyStrike/revealed/blob/v2.0.0-alpha.5/apps/desktop/public/img/steam-banner.jpg?raw=true'
  newEntry.art_square =
    'https://github.com/BunnyStrike/revealed/blob/v2.0.0-alpha.5/apps/desktop/public/img/steam-pill.jpg?raw=true'
  newEntry.art_logo =
    'https://github.com/BunnyStrike/revealed/blob/v2.0.0-alpha.5/apps/desktop/public/img/logo.jpg?raw=true'
  newEntry.icon =
    'https://github.com/BunnyStrike/revealed/blob/v2.0.0-alpha.5/apps/desktop/public/img/logo.jpg?raw=true'

  return addNonSteamApp(newEntry as any)
}
