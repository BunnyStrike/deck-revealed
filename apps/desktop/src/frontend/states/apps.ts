import { atom } from 'jotai'

export interface AppsFilterAtom {
  name?: string
  category?: string
}

export const appsFilterDefault = {
  name: undefined,
  category: 'all',
}

export const appsFilterAtom = atom<AppsFilterAtom>(appsFilterDefault)
// export const appsFilterCategoryAtom = atom<string | undefined>(undefined)
