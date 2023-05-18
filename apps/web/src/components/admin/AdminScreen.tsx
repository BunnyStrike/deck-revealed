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

// import { UsersTable } from '@revealed/ui'
import { UsersTable } from './UsersTable'

const navigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Users', href: '#', current: false },
]

interface AdminScreenProps {
  className?: string
}

export function AdminScreen({ className }: AdminScreenProps) {
  const [tab, setTab] = useState(0)

  return (
    <>
      <div className={className}>
        <div>
          <main className=''>
            <header>
              {/* Secondary navigation */}
              <nav className='flex overflow-x-auto border-b border-white/10 py-4'>
                <ul
                  role='list'
                  className='flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8'
                >
                  {navigation.map((item, index) => (
                    <li key={item.name}>
                      <button
                        onClick={() => setTab(index)}
                        className={tab === index ? 'text-secondary' : ''}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {tab === 0 && <div></div>}
              {tab === 1 && (
                <div>
                  <UsersTable />
                </div>
              )}

              {/* Stats */}
              {/* <div className='grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1
                        ? 'sm:border-l'
                        : statIdx === 2
                        ? 'lg:border-l'
                        : '',
                      'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8'
                    )}
                  >
                    <p className='text-sm font-medium leading-6 text-gray-400'>
                      {stat.name}
                    </p>
                    <p className='mt-2 flex items-baseline gap-x-2'>
                      <span className='text-4xl font-semibold tracking-tight text-white'>
                        {stat.value}
                      </span>
                      {stat.unit ? (
                        <span className='text-sm text-gray-400'>
                          {stat.unit}
                        </span>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div> */}
            </header>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminScreen
