import { atom } from 'jotai'

export interface SettingsAtom {
  windowConfig: 'default' | 'fullscreen' | 'maximized'
}

export const settingsDefault = {
  windowConfig: 'default',
}

export const settingsAtom = atom<SettingsAtom>(settingsDefault)
