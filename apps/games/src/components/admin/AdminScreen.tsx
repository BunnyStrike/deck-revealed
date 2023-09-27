import { Fragment, useState } from 'react'

import { classNames } from '@revealed/ui'

import { api } from '~/utils/api'
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
  const { data: overview } = api.admin.overview.useQuery()
  let stats: any = []

  if (overview) {
    stats = [
      { name: 'Total Users', value: overview.totalUsers },
      { name: 'Total Apps', value: overview.totalApps },
    ]
  }

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

              {tab === 0 && (
                <div>
                  {/* Stats */}
                  <div className='grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4'>
                    {stats.map((stat: any, statIdx: number) => (
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
                  </div>
                </div>
              )}
              {tab === 1 && (
                <div>
                  <UsersTable />
                </div>
              )}
            </header>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminScreen
