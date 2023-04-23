import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import {
  IconApps,
  IconBrandSteam,
  IconDeviceGamepad2,
  IconLogin,
} from '@tabler/icons-react'
import { useLocation } from 'react-router-dom'

import { SidebarMenu } from './SidebarMenu'

const navigation = [
  { name: 'Home', link: '/', icon: HomeIcon },
  { name: 'Apps', link: '/apps', icon: IconApps },
  { name: 'Games', link: '/games', icon: IconDeviceGamepad2 },
  { name: 'Steam Deck', link: '/steam-deck', icon: IconBrandSteam },
  { name: 'Stores', link: '/stores', icon: BuildingStorefrontIcon },
  { name: 'Settings', link: '/settings', icon: AdjustmentsHorizontalIcon },
  {
    name: 'Login',
    link: '/login/revealed',
    icon: IconLogin,
    showWhenLoggedIn: false,
  },
]
interface RevealedApplicationShellPros {
  children: React.ReactNode
}

export default function RevealedApplicationShell({
  children,
}: RevealedApplicationShellPros) {
  return (
    <>
      <div className='bg-neutral'>
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
