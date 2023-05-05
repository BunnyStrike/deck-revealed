import { useState } from 'react'
import { Switch } from '@headlessui/react'

import { classNames } from '../utils'

interface FormTogggleProps {
  title: string
  description?: string
  enabled?: boolean
  setEnabled: (enabled: boolean) => void
}

export default function FormToggle({
  title,
  description,
  enabled = false,
  setEnabled,
}: FormTogggleProps) {
  return (
    <Switch.Group as='div' className='flex items-center justify-between '>
      <span className='flex flex-grow flex-col'>
        <Switch.Label
          as='span'
          className='text-sm font-medium leading-6 text-gray-200'
          passive
        >
          {title}
        </Switch.Label>
        {description && (
          <Switch.Description as='span' className='text-sm text-gray-300'>
            {description}
          </Switch.Description>
        )}
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden='true'
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
