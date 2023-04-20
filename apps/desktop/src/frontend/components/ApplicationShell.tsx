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
        <div className='fixed inset-y-0 flex w-20 flex-col sm:z-50 sm:w-60'>
          <SidebarMenu navigation={navigation} />
        </div>

        <main className='pl-20 sm:pl-60'>
          <div className='px-4 pb-10 pt-2 sm:px-6 lg:px-8 lg:py-6'>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
