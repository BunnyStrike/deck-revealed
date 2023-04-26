import { atom } from 'jotai'

export interface ModalsAtom {
  showAddApp: boolean
  showAddGame: boolean
  showAddBootVideo: boolean
  confirm: boolean
  editApp?: string
  editGame?: string
  editBootVideo?: string
}

export const modalsAtomDefault = {
  showAddApp: false,
  showAddGame: false,
  showAddBootVideo: false,
  confirm: false,
  editApp: undefined,
  editGame: undefined,
  editBootVideo: undefined,
}

export const modalsAtom = atom<ModalsAtom>(modalsAtomDefault)

export interface ConfirmModalsAtom {
  show: boolean
  title?: string
  message?: string
  cancelText?: string
  confirmText?: string
  onConfirm?: () => Promise<void>
  onCancel?: () => Promise<void>
}

export const confirmModalAtomDefault = {
  show: false,
  title: undefined,
  message: undefined,
  cancelText: undefined,
  confirmText: undefined,
  onConfirm: undefined,
  onCancel: undefined,
}

export const confirmModalAtom = atom<ConfirmModalsAtom>(confirmModalAtomDefault)
