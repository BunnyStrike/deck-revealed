import { useId } from 'react'
import * as React from 'react'
import { StarField } from './StarField'
import { ThemeToggle } from './ThemeToggle'
import { FixedSidebar } from './FixedSidebar'
import { Timeline } from './Timeline'


interface LayoutProps {
  children: React.ReactNode
  intro: React.ReactNode
  introFooter: React.ReactNode
}

export function Layout({ children, intro, introFooter }: LayoutProps) {
  return (
    <>
      <FixedSidebar main={intro} footer={introFooter} />
      <ThemeToggle />
      <div className='relative flex-auto'>
        <Timeline />
        <main className='space-y-20 py-20 sm:space-y-32 sm:py-32'>
          {children}
        </main>
      </div>
    </>
  )
}
