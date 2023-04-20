import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import { SidebarMenu } from './SidebarMenu'

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Apps', href: '#', icon: UsersIcon, current: false },
  { name: 'Games', href: '#', icon: FolderIcon, current: false },
  { name: 'Steam Deck', href: '#', icon: CalendarIcon, current: false },
  { name: 'Stores', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Settings', href: '#', icon: FolderIcon, current: false },
]
interface RevealedApplicationShellPros {
  children: React.ReactNode
}

export default function RevealedApplicationShell({
  children,
}: RevealedApplicationShellPros) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className='hidden sm:fixed sm:inset-y-0 sm:z-50 sm:flex sm:w-60 sm:flex-col'>
          <SidebarMenu navigation={navigation} />
        </div>

        <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:hidden sm:px-6'>
          <button
            type='button'
            className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
          <div className='flex-1 text-sm font-semibold leading-6 text-gray-900'>
            Revealed
          </div>
          {/* <a href='#'>
            <span className='sr-only'>Your profile</span>
            <img
              className='h-8 w-8 rounded-full bg-gray-50'
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
          </a> */}
        </div>

        <main className='sm:pl-60'>
          <div className='px-4 pb-10 pt-2 sm:px-6 lg:px-8 lg:py-6'>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
