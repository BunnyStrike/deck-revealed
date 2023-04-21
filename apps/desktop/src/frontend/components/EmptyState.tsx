import React from 'react'
import { IconCirclePlus } from '@tabler/icons-react'

interface EmptyStateProps {
  message?: string
  onClick?: () => void
}

export default function EmptyState({
  message = 'Create a new record',
  onClick,
}: EmptyStateProps) {
  return (
    <div className='mt-5 w-full'>
      <button
        type='button'
        onClick={onClick}
        className='relative mx-auto block w-60 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        <IconCirclePlus className='mx-auto' size='60' />
        <span className='mt-2 block text-sm font-semibold text-gray-200'>
          {message}
        </span>
      </button>
    </div>
  )
}
