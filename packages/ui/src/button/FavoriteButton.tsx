import { HeartIcon } from '@heroicons/react/20/solid'

import { classNames } from '../utils'

interface FavoriteButtonProps {
  className?: string
  isLoading?: boolean
  isFavorited?: boolean
  children?: React.ReactNode
}

export const FavoriteButton = ({
  className,
  children,
  isLoading,
  isFavorited = false,
}: FavoriteButtonProps) => {
  return (
    <button
      className={classNames(isLoading ? 'loading' : '', ' ', className ?? '')}
    >
      {isFavorited ? <HeartIcon /> : <HeartIcon />}
    </button>
  )
}
