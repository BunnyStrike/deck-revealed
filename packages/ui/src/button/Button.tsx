import { classNames } from '../utils'

interface ButtonProps {
  className?: string
  isLoading?: boolean
  children?: React.ReactNode
}

export const Button = ({ className, children, isLoading }: ButtonProps) => {
  return (
    <button
      className={classNames(
        isLoading ? 'loading' : '',
        'btn-primary btn',
        className ?? ''
      )}
    >
      {children}
    </button>
  )
}
