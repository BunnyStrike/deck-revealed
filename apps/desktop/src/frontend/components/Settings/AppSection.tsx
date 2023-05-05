import React, { Fragment, useState } from 'react'
import { Switch } from '@headlessui/react'

import FormToggle from '@revealed/ui/src/forms/FormToggle'
import { classNames } from '@revealed/ui/src/utils'

import { api } from '../../utils/api'

export function SettingsAppSection() {
  const { data: isAddedToSteam } = api.desktop.steam.isAddedToSteam.useQuery({
    title: 'Revealed',
  })
  const { data: checkIfSteamIsRunning } =
    api.desktop.steam.checkIfSteamIsRunning.useQuery()
  const { mutate: setEnabled } =
    api.desktop.steam.addRevealedToSteam.useMutation()
  const { mutate: restartSteam } = api.desktop.steam.restartSteam.useMutation()

  return (
    <div className=' w-full p-8'>
      <FormToggle
        title='Add Revealed To Steam'
        description='Makes launching the app easier from Game Mode'
        enabled={isAddedToSteam}
        setEnabled={() => setEnabled()}
      />
      <Switch.Group as='div' className='mt-6 flex items-center justify-between'>
        <span className='flex flex-grow flex-col'>
          <Switch.Label
            as='span'
            className='text-sm font-medium leading-6 text-gray-200'
            passive
          >
            Is Steam Running?
          </Switch.Label>

          <Switch.Description as='span' className='text-sm text-gray-300'>
            {checkIfSteamIsRunning ? 'Yes' : 'No'}
          </Switch.Description>
        </span>
        <button
          className='btn-secondary btn-sm btn'
          onClick={() => restartSteam()}
        >
          Restart
        </button>
        {/* <Switch
          checked={checkIfSteamIsRunning}
          onChange={() => console.log('test')}
          className={classNames(
            checkIfSteamIsRunning ? 'bg-indigo-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden='true'
            className={classNames(
              checkIfSteamIsRunning ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch> */}
      </Switch.Group>
    </div>
  )
}
