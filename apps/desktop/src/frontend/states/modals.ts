import { atom } from 'jotai'

export interface ModalsAtom {
  showAddApp: boolean
  showAddGame: boolean
  showAddBootVideo: boolean
  editApp?: string
  editGame?: string
  editBootVideo?: string
}

export const modalsAtomDefault = {
  showAddApp: false,
  showAddGame: false,
  showAddBootVideo: false,
  editApp: undefined,
  editGame: undefined,
  editBootVideo: undefined,
}

export const modalsAtom = atom<ModalsAtom>(modalsAtomDefault)
