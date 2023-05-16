import { classNames } from '../utils'

interface ButtonProps {
  className?: string
  isLoading?: boolean
  children?: React.ReactNode
  href?: string
  onClick?: () => void
}

export const Button = ({
  className,
  children,
  isLoading,
  href,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
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
