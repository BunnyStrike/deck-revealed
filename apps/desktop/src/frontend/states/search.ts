import { atom } from 'jotai'

export interface ListFilterAtom {
  name?: string
  category?: string
}

export const listFilterDefault = {
  name: undefined,
  category: 'all',
}

export const listFilterAtom = atom<ListFilterAtom>(listFilterDefault)
