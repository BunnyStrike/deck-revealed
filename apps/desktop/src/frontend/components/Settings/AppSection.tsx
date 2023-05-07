import React, { Fragment, useState } from 'react'
import { Switch } from '@headlessui/react'

import { FormToggle } from '@revealed/ui'

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
            className='text-md font-medium leading-6 text-gray-200'
            passive
          >
            Is Steam Running?
          </Switch.Label>

          {/* <Switch.Description as='span' className='text-sm text-gray-300'>
            {checkIfSteamIsRunning ? 'Yes' : 'No'}
          </Switch.Description> */}
        </span>
        <button
          className='btn-secondary btn-sm btn'
          onClick={() => restartSteam()}
        >
          Restart
        </button>
      </Switch.Group>
    </div>
  )
}
