import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'

import type { User } from '@revealed/db'

import { api } from '~/utils/api'

interface SideOverProps {
  user: User | undefined
  setClose: (open: any) => void
}

export function UserEditSideOver({ user, setClose }: SideOverProps) {
  const { mutateAsync: userUpsert, isLoading = false } =
    api.user.upsert.useMutation()

  const handleSave = async (e: any) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    const name = data.get('name')
    const email = data.get('email')
    const role = data.get('role')

    console.log(role)

    await userUpsert({
      id: user?.id,
      name: name?.toString(),
      email: email?.toString(),
      role: role?.toString() as any,
    })

    setClose(false)
  }

  return (
    <Transition.Root show={!!user} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={setClose}>
        <div className='fixed inset-0' />

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <form
                    className='flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl'
                    onSubmit={(e) => void handleSave(e)}
                  >
                    <div className='h-0 flex-1 overflow-y-auto'>
                      <div className='bg-primary px-4 py-6 sm:px-6'>
                        <div className='flex items-center justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-white'>
                            Edit User
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-primary text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                              onClick={() => setClose(false)}
                            >
                              <span className='sr-only'>Close panel</span>
                              <XMarkIcon
                                className='h-6 w-6'
                                aria-hidden='true'
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-1 flex-col justify-between'>
                        <div className='divide-y divide-gray-200 px-4 sm:px-6'>
                          <div className='space-y-6 pb-5 pt-6'>
                            <div>
                              <label
                                htmlFor='name'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Name
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  name='name'
                                  id='name'
                                  defaultValue={user?.name || ''}
                                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor='email'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Email
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='email'
                                  name='email'
                                  id='email'
                                  defaultValue={user?.email || ''}
                                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            {/* <div>
                              <label
                                htmlFor='description'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Description
                              </label>
                              <div className='mt-2'>
                                <textarea
                                  id='description'
                                  name='description'
                                  rows={4}
                                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                  defaultValue={''}
                                />
                              </div>
                            </div> */}

                            <fieldset defaultValue={user?.role}>
                              <legend className='text-sm font-medium leading-6 text-gray-900'>
                                Role
                              </legend>
                              <div className='mt-2 space-y-4'>
                                <div className='relative flex items-start'>
                                  <div className='absolute flex h-6 items-center'>
                                    <input
                                      id='role-user'
                                      name='role'
                                      aria-describedby='role-user-description'
                                      type='radio'
                                      value={'USER'}
                                      className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                                      defaultChecked={user?.role === 'USER'}
                                    />
                                  </div>
                                  <div className='pl-7 text-sm leading-6'>
                                    <label
                                      htmlFor='role-user'
                                      className='font-medium text-gray-900'
                                    >
                                      User
                                    </label>
                                    <p
                                      id='role-user-description'
                                      className='text-gray-500'
                                    >
                                      Can acccess the app.
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className='relative flex items-start'>
                                    <div className='absolute flex h-6 items-center'>
                                      <input
                                        id='privacy-role-pro'
                                        name='role'
                                        aria-describedby='privacy-role-pro-description'
                                        type='radio'
                                        value={'PRO'}
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                                        defaultChecked={user?.role === 'PRO'}
                                      />
                                    </div>
                                    <div className='pl-7 text-sm leading-6'>
                                      <label
                                        htmlFor='privacy-role-pro'
                                        className='font-medium text-gray-900'
                                      >
                                        Pro
                                      </label>
                                      <p
                                        id='privacy-role-pro-description'
                                        className='text-gray-500'
                                      >
                                        Access to most of the app.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className='relative flex items-start'>
                                    <div className='absolute flex h-6 items-center'>
                                      <input
                                        id='privacy-pro-plus'
                                        name='role'
                                        aria-describedby='privacy-pro-plus-description'
                                        type='radio'
                                        value={'PRO_PLUS'}
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                                        defaultChecked={
                                          user?.role === 'PRO_PLUS'
                                        }
                                      />
                                    </div>
                                    <div className='pl-7 text-sm leading-6'>
                                      <label
                                        htmlFor='privacy-pro-plus'
                                        className='font-medium text-gray-900'
                                      >
                                        Pro Plus
                                      </label>
                                      <p
                                        id='privacy-pro-plus-description'
                                        className='text-gray-500'
                                      >
                                        Charged monthly for access to all.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className='relative flex items-start'>
                                    <div className='absolute flex h-6 items-center'>
                                      <input
                                        id='privacy-admin'
                                        name='role'
                                        aria-describedby='privacy-admin-description'
                                        type='radio'
                                        value={'ADMIN'}
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                                        defaultChecked={user?.role === 'ADMIN'}
                                      />
                                    </div>
                                    <div className='pl-7 text-sm leading-6'>
                                      <label
                                        htmlFor='privacy-admin'
                                        className='font-medium text-gray-900'
                                      >
                                        Admin
                                      </label>
                                      <p
                                        id='privacy-admin-description'
                                        className='text-gray-500'
                                      >
                                        Can do anything.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-shrink-0 justify-end gap-2 px-4 py-4'>
                      <button
                        type='button'
                        className='btn-ghost btn'
                        onClick={() => setClose(false)}
                      >
                        Cancel
                      </button>
                      <button type='submit' className='btn-primary btn'>
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default UserEditSideOver
