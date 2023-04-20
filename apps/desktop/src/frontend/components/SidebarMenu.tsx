import React from 'react'

import { classNames } from '../utils'

export interface SidebarMenuProps {
  navigation: {
    name: string
    href: string
    icon:
      | React.FC<React.SVGProps<SVGSVGElement>>
      | React.ForwardRefExoticComponent<
          Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
            title?: string | undefined
            titleId?: string | undefined
          } & React.RefAttributes<SVGSVGElement>
        >
    current: boolean
  }[]
}

export const SidebarMenu = ({ navigation }: SidebarMenuProps) => {
  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
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
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex content-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 sm:justify-start'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden='true'
                    />
                    <span className='hidden sm:inline'>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          {/* <li>
            <div className='text-xs font-semibold leading-6 text-gray-400'>
              More
            </div>
            <ul role='list' className='-mx-2 mt-2 space-y-1'>
              {more.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    )}
                  >
                    <span
                      className={classNames(
                        item.current
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium'
                      )}
                    >
                      {item.initial}
                    </span>
                    <span className='truncate'>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li> */}
          {/* <li className='-mx-6 mt-auto'>
            <a
              href='#'
              className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50'
            >
              <img
                className='h-8 w-8 rounded-full bg-gray-50'
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                alt=''
              />
              <span className='sr-only'>Your profile</span>
              <span aria-hidden='true'>Tom Cook</span>
            </a>
          </li> */}
          <li className='-mx-6 mt-auto'>
            <a
              href='#'
              className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50'
            >
              <span aria-hidden='true'>2.0.0</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
