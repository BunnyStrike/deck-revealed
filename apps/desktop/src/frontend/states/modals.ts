import { atom } from 'jotai'

export interface ModalsAtom {
  showAddApp: boolean
  showAddGame: boolean
  showAddBootVideo: boolean
}

export const modalsAtomDefault = {
  showAddApp: false,
  showAddGame: false,
  showAddBootVideo: false,
}

export const modalsAtom = atom<ModalsAtom>(modalsAtomDefault)
