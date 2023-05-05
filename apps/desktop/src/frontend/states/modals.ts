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
  type?: 'primary' | 'error' | 'warning' | 'secondary'
  cancelText?: string
  confirmText?: string
  isLoading: boolean
  onConfirm?: () => Promise<void> | void
  onCancel?: () => Promise<void> | void
}

export const confirmModalAtomDefault: ConfirmModalsAtom = {
  show: false,
  title: undefined,
  message: undefined,
  isLoading: false,
  type: 'primary',
  cancelText: undefined,
  confirmText: undefined,
  onConfirm: undefined,
  onCancel: undefined,
}

export const confirmModalAtom = atom<ConfirmModalsAtom>(confirmModalAtomDefault)
