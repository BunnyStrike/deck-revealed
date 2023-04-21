import { atom } from 'jotai'

export interface ListFilterAtom {
  name?: string
  category?: string
  sort: string
  listCounter: number
}

export const listFilterDefault = {
  name: undefined,
  category: 'All',
  sort: 'asc',
  listCounter: 0,
}

export const listFilterAtom = atom<ListFilterAtom>(listFilterDefault)
