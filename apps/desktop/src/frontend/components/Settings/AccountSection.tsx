import React, { Fragment, useState } from 'react'

import { api } from '../../utils/api'

export function SettingsAccountSection() {
  const { data: isAddedToSteam } = api.desktop.steam.isAddedToSteam.useQuery({
    title: 'Revealed',
  })
  const { mutate } = api.desktop.steam.addRevealedToSteam.useMutation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
      <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
        <div>
          <h2 className='text-base font-semibold leading-7 text-white'>
            Change password
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-400'>
            Update your password associated with your account.
          </p>
        </div>

        <form className='md:col-span-2'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
            <div className='col-span-full'>
              <label
                htmlFor='current-password'
                className='block text-sm font-medium leading-6 text-white'
              >
                Current password
              </label>
              <div className='mt-2'>
                <input
                  id='current-password'
                  name='current_password'
                  type='password'
                  autoComplete='current-password'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='new-password'
                className='block text-sm font-medium leading-6 text-white'
              >
                New password
              </label>
              <div className='mt-2'>
                <input
                  id='new-password'
                  name='new_password'
                  type='password'
                  autoComplete='new-password'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='confirm-password'
                className='block text-sm font-medium leading-6 text-white'
              >
                Confirm password
              </label>
              <div className='mt-2'>
                <input
                  id='confirm-password'
                  name='confirm_password'
                  type='password'
                  autoComplete='new-password'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>

          <div className='mt-8 flex'>
            <button type='submit' className='btn-secondary btn'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
