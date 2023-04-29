import { useState } from 'react'
import { Tab } from '@headlessui/react'

import { classNames } from '../utils'

interface PillTabsProps {
  tabs: string[]
  children?: React.ReactNode
}

export function PillTabs({ tabs, children }: PillTabsProps) {
  return (
    <div className='flex flex-col'>
      <Tab.Group>
        <Tab.List className='tabs tabs-boxed'>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames('tab', selected ? 'tab-active' : '')
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-2'>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default PillTabs
