import React from 'react'

import { classNames } from '../utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}
export const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <main
      className={classNames(
        'px-4 pb-10 pt-2 sm:px-6 lg:px-8 lg:py-6',
        className
      )}
    >
      {' '}
      {children}{' '}
    </main>
  )
}

export default Container
