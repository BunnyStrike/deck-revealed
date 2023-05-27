import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import {
  Container,
  SettingsAccountSection,
  SettingsAppSection,
} from '../components'
import { RevealedSignupScreen } from './Signup'

const sections = [
  { name: 'App' },
  { name: 'Account' },
  // { name: 'Notifications', href: '#', current: false },
  // { name: 'Billing', href: '#', current: false },
  // { name: 'Backups', href: '#', current: false },
  // { name: 'Integrations', href: '#', current: false },
]

export function SettingsScreen() {
  const [currentSection, setCurrentSection] = useState(0)

  return (
    <Container>
      <header className='border-b border-white/5'>
        {/* Secondary navigation */}
        <nav className='flex overflow-x-auto py-4'>
          <ul
            role='list'
            className='flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8'
          >
            {sections.map((item, index) => (
              <li key={item.name} className='cursor-pointer'>
                <a
                  onClick={() => setCurrentSection(index)}
                  className={currentSection === index ? 'text-indigo-400' : ''}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Settings forms */}
      <div className='divide-y divide-white/5'>
        {currentSection === 0 && <SettingsAppSection />}
        {currentSection === 1 && <SettingsAccountSection />}
      </div>
    </Container>
  )
}
