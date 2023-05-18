import React from 'react'
// import { UserButton, useUser } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { IconSteam } from '@tabler/icons-react'
import { useAtom } from 'jotai'
import { Link, useLocation } from 'react-router-dom'

import { useUser } from '../hooks'
import { confirmModalAtom } from '../states'
import { classNames } from '../utils'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'
import RevealedVersion from './Version'

interface SidebarMenuItem {
  name: string
  link?: string | (() => void)
  showWhenLoggedIn?: boolean
  isMac?: boolean
  isWindows?: boolean
  isLinux?: boolean
  isSteamos?: boolean
  isSteamDeckGameMode?: boolean
  children?: SidebarMenuItem[]
  icon?:
    | React.FC<React.SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
          title?: string | undefined
          titleId?: string | undefined
        } & React.RefAttributes<SVGSVGElement>
      >
}

export interface SidebarMenuProps {
  navigation: SidebarMenuItem[]
}

export const SidebarMenu = ({ navigation }: SidebarMenuProps) => {
  const { data: platform } = api.desktop.system.platform.useQuery()
  const { data: isAddedToSteam } = api.desktop.steam.isAddedToSteam.useQuery({
    title: 'Revealed',
  })
  const { mutate: quitApp } = api.desktop.system.quitApp.useMutation()
  const [confirm, setConfirm] = useAtom(confirmModalAtom)
  const location = useLocation()
  const { user } = useUser()

  const handleCloseApp = () => {
    setConfirm((prev) => ({
      ...prev,
      show: true,
      title: 'Quit App',
      message: 'Are you sure you want to quit Revealed?',
      onConfirm: async () => {
        quitApp()
      },
    }))
  }

  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-neutral px-6'>
      <div className='flex h-16 shrink-0 items-center'>
        <img
          className='hidden h-auto pt-4 sm:block'
          src='img/full-logo-revealed.png'
          alt='Revealed Logo'
        />
        <img
          className='block h-8 w-auto sm:hidden'
          src='img/logo.png'
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
                    (item?.showWhenLoggedIn === false && !user) ||
                    (item?.showWhenLoggedIn === true && !!user?.id)
                )
                .filter(
                  (item) =>
                    !item?.isSteamos || (item?.isSteamos && platform?.isSteamos)
                )
                .map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <Link
                        to={typeof item.link === 'string' ? item.link : ''}
                        onClick={
                          item.name === 'Quit'
                            ? () => handleCloseApp()
                            : typeof item.link === 'string'
                            ? undefined
                            : item.link
                        }
                        className={classNames(
                          item.link === location.pathname
                            ? 'bg-primary-focus text-white'
                            : 'text-white hover:bg-primary hover:text-white',
                          'group flex content-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 sm:justify-start'
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className={'h-6 w-6 shrink-0'}
                            aria-hidden='true'
                          />
                        )}
                        <span className='hidden sm:inline'>{item.name}</span>
                      </Link>
                    ) : (
                      <Disclosure as='div'>
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.link === location.pathname
                                  ? 'bg-primary-focus text-white'
                                  : 'text-white hover:bg-primary hover:text-white',
                                'group flex w-full content-center justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 sm:justify-start'
                              )}
                            >
                              {item.icon && (
                                <item.icon
                                  className={'h-6 w-6 shrink-0'}
                                  aria-hidden='true'
                                />
                              )}
                              <span className='hidden sm:inline'>
                                {item.name}
                              </span>

                              <ChevronRightIcon
                                className={classNames(
                                  open
                                    ? 'rotate-90 text-gray-500'
                                    : 'text-gray-400',
                                  'ml-auto h-5 w-5 shrink-0'
                                )}
                                aria-hidden='true'
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel as='ul' className='mt-1 px-2'>
                              {item.children?.map((subItem) => (
                                <li key={subItem.name}>
                                  {/* 44px */}
                                  <Link
                                    to={
                                      typeof subItem.link === 'string'
                                        ? subItem.link
                                        : ''
                                    }
                                    onClick={
                                      typeof subItem.link === 'string'
                                        ? undefined
                                        : subItem.link
                                    }
                                    className={classNames(
                                      subItem.link === location.pathname
                                        ? 'bg-primary-focus text-white'
                                        : 'text-white hover:bg-primary hover:text-white',
                                      'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700'
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
            </ul>
          </li>
          {/* <li className=' hidden items-center justify-center sm:flex'>
            <UserButton showName appearance={{ baseTheme: dark }} />
          </li>
          <li className=' flex items-center justify-center sm:hidden'>
            <UserButton appearance={{ baseTheme: dark }} />
          </li> */}

          <li className='-mx-6 mt-auto '>
            <RevealedVersion />
          </li>
        </ul>
      </nav>
    </div>
  )
}
