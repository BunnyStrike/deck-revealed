import React from 'react'

import { Glow } from './Glow'
import { StarField } from './StarField'

interface FixedSidebarProps {
  main: React.ReactNode
  footer: React.ReactNode
}

export function FixedSidebar({ main, footer }: FixedSidebarProps) {
  return (
    <div className='relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0'>
      <Glow />
      <div className='relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-[max(4rem,calc(50%-38rem))]'>
        <div className='mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6'>
          <div className='pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20'>
            <div className='relative'>
              <StarField />
              {main}
            </div>
          </div>
          <div className='flex flex-1 items-end justify-center pb-4 lg:justify-start lg:pb-6'>
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
