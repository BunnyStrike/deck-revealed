import { atom } from 'jotai'

export interface ListFilterAtom {
  name?: string
  category?: string
  sort: string
  listCounter: number
  title: string
  add?: 'game' | 'app' | 'both'
}

export const listFilterDefault = {
  name: undefined,
  title: '',
  category: 'All',
  sort: 'asc',
  add: undefined,
  listCounter: 0,
}

export const listFilterAtom = atom<ListFilterAtom>(listFilterDefault)
