import React from 'react'
import { BarsArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'

import { listFilterAtom } from '../states'

export default function RevealedSearchBar() {
  const [value, setValue] = useAtom(listFilterAtom)

  const handleSearch = (search: string) => {
    setValue(() => ({ ...value, name: search }))
  }

  return (
    <div>
      <div className='mt-2 flex rounded-md shadow-sm'>
        <div className='flex w-10 items-center justify-center rounded-l-md bg-gray-900 text-white'>
          2
        </div>
        <div className='relative flex flex-grow items-stretch focus-within:z-10'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <MagnifyingGlassIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </div>
          <input
            type='search'
            name='search'
            id='search'
            className='block w-full rounded-none  border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='John Smith'
            defaultValue={value.name}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button
          type='button'
          className='relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        >
          <BarsArrowUpIcon
            className='-ml-0.5 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
          Sort
        </button>
      </div>
    </div>
  )
}
