import { join } from 'path'
import { app } from 'electron'

import { imagesCachePath, isWindows } from '../../constants'
import { addNonSteamApp } from './nonesteamapp'

export const addRevealedToSteam = async (): Promise<boolean> => {
  const newEntry = {
    appName: 'DeckRevealed',
    exe: '',
    startDir: '',
    art_cover: '',
    art_square: '',
    art_logo: '',
  }
  if (isWindows) {
    ;(newEntry.exe = app.getPath('exe')), // join(revealedInstallPath, Platform.executable);
      (newEntry.startDir = app.getAppPath()) // Directory.current.path;
  } else {
    newEntry.startDir = '/home/deck/Applications/'
    newEntry.exe = join('/home/deck/Applications/', 'DeckRevealed.AppImage')
    //newEntry.exe = join(Directory.current.path, 'deck_revealed_app');
  }

  newEntry.art_cover = join(imagesCachePath, 'steam-banner.jpg')
  newEntry.art_square = join(imagesCachePath, 'steam-pill.jpg')
  newEntry.art_logo = join(imagesCachePath, 'logo.jpg')
  return addNonSteamApp(newEntry as any)
}
