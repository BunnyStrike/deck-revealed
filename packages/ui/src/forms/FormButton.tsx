interface FormButtonProps {
  title: string
  description?: string
  buttonTitle?: string
  disabled?: boolean
  button?: React.ReactNode
  onClick?: () => void
}

export function FormButton({
  title,
  description,
  disabled = false,
  buttonTitle = 'Click',
  button,
  onClick,
}: FormButtonProps) {
  return (
    <div className='mt-6 flex items-center justify-between'>
      <span className='flex flex-grow flex-col'>
        <span className='text-md font-medium leading-6 text-gray-200'>
          {title}
        </span>

        {description && (
          <span className='text-sm text-gray-300'>{description}</span>
        )}
      </span>
      {button ? (
        button
      ) : (
        <button
          disabled={disabled}
          className='btn-secondary btn-sm btn'
          onClick={() => onClick?.()}
        >
          {buttonTitle}
        </button>
      )}
    </div>
  )
}

export default FormButton
