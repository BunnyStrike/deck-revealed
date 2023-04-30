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
  IconVideo,
} from '@tabler/icons-react'
import { useLocation } from 'react-router-dom'

import { supabaseClient } from '../utils/database'
import { SidebarMenu } from './SidebarMenu'

const navigation = [
  { name: 'Home', link: '/', icon: HomeIcon },
  { name: 'Apps', link: '/apps', icon: IconApps },
  { name: 'Games', link: '/games', icon: IconDeviceGamepad2 },
  {
    name: 'Steam Deck',
    link: '/steam-deck',
    icon: IconBrandSteam,
    children: [
      { name: 'Utilities', href: '/apps' },
      { name: 'Boot Videos', link: '/boot-videos', icon: IconVideo },
    ],
  },
  // { name: 'Boot Videos', link: '/boot-videos', icon: IconVideo },
  {
    name: 'Stores',
    link: '/stores',
    icon: BuildingStorefrontIcon,
    children: [
      { name: 'Steam', href: '/steamStore' },
      { name: 'Epic Games', link: '/epicStore' },
      { name: 'GOG', link: '/gogStore' },
      { name: 'Fanatical', link: '/fanaticalStore' },
    ],
  },
  { name: 'Settings', link: '/settings', icon: AdjustmentsHorizontalIcon },
  {
    name: 'Login',
    link: '/login/revealed',
    icon: IconLogin,
    showWhenLoggedIn: false,
  },
  {
    name: 'Logout',
    link: () => supabaseClient.auth.signOut(),
    icon: IconLogin,
    showWhenLoggedIn: true,
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
