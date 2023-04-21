import React from 'react'
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'

import { listFilterAtom } from '../states'
import { appCategories } from '../utils/app'

export default function RevealedSearchBar() {
  const [listFilter, setListFilter] = useAtom(listFilterAtom)

  const handleSearch = (search: string) => {
    setListFilter(() => ({
      ...listFilter,
      name: search ? `${search}` : undefined,
    }))
  }

  const handleCategory = (category: string) => {
    setListFilter(() => ({ ...listFilter, category: category }))
  }

  const handleSort = () => {
    setListFilter(() => ({
      ...listFilter,
      sort: listFilter.sort === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className='sticky top-0 z-40'>
      <div className='mt-2 flex h-12 rounded-md shadow-sm'>
        <div className='bg-secondary text-secondary-content  flex items-center justify-center rounded-l-md px-4'>
          {listFilter.listCounter}
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
            className='focus:primary-focus primary bg-primary-content block w-full rounded-none border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
            placeholder='Search'
            defaultValue={listFilter.name}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className='flex-none rounded-r-md bg-white'>
          <ul className='menu menu-horizontal '>
            {/* <li className='text-secondary border-r-2'>
              <a onClick={handleSort}>Add</a>
            </li> */}
            <div className='text-secondary w-38 border-r-2'>
              <select
                className='select w-full max-w-xs'
                onChange={(e) => handleCategory(e.target.value)}
              >
                <option value='All'>All</option>
                {appCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <li className='text-secondary gb-secondary-content'>
              <a onClick={handleSort}>
                {listFilter.sort === 'desc' ? (
                  <BarsArrowDownIcon
                    className='text-secondary -ml-0.5 h-5 w-5'
                    aria-hidden='true'
                  />
                ) : (
                  <BarsArrowUpIcon
                    className='text-secondary -ml-0.5 h-5 w-5'
                    aria-hidden='true'
                  />
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
