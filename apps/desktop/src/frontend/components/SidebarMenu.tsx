import React from 'react'
import { UserButton, useUser } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { Link, useLocation } from 'react-router-dom'

import { classNames } from '../utils'
import { api } from '../utils/api'
import { syncDBs } from '../utils/database'
import RevealedVersion from './Version'

export interface SidebarMenuProps {
  navigation: {
    name: string
    link: string
    showWhenLoggedIn?: boolean
    icon:
      | React.FC<React.SVGProps<SVGSVGElement>>
      | React.ForwardRefExoticComponent<
          Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
            title?: string | undefined
            titleId?: string | undefined
          } & React.RefAttributes<SVGSVGElement>
        >
  }[]
}

export const SidebarMenu = ({ navigation }: SidebarMenuProps) => {
  const { mutate } = api.seed.restoreApps.useMutation()
  const location = useLocation()
  const { user } = useUser()

  return (
    <div className='bg-neutral flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 px-6'>
      <div className='flex h-16 shrink-0 items-center'>
        <img
          className='hidden h-auto pt-4 sm:block'
          src='/img/full-logo.png'
          alt='Revealed Logo'
        />
        <img
          className='block h-8 w-auto sm:hidden'
          src='/img/logo.png'
          alt='Revealed Logo'
        />
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation
                .filter(
                  (item) =>
                    item?.showWhenLoggedIn === undefined ||
                    (item?.showWhenLoggedIn === false && !user)
                )
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      className={classNames(
                        item.link === location.pathname
                          ? 'bg-primary-focus text-white'
                          : 'hover:bg-primary text-white hover:text-white',
                        'group flex content-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 sm:justify-start'
                      )}
                    >
                      <item.icon
                        className={'h-6 w-6 shrink-0'}
                        aria-hidden='true'
                      />
                      <span className='hidden sm:inline'>{item.name}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </li>

          <li className=' hidden items-center justify-center sm:flex'>
            <UserButton showName appearance={{ baseTheme: dark }} />
          </li>
          <li className=' flex items-center justify-center sm:hidden'>
            <UserButton appearance={{ baseTheme: dark }} />
          </li>

          <li>
            <button onClick={() => syncDBs(mutate)}>Create App Seed</button>
          </li>

          <li className='-mx-6 mt-auto '>
            {/* <a className='flex cursor-pointer items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300 hover:text-gray-600'>
              <span aria-hidden='true'>2.0.0</span>
            </a> */}
            <RevealedVersion />
          </li>
        </ul>
      </nav>
    </div>
  )
}
