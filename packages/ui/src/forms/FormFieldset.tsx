export interface FormFieldsetListItem {
  value?: string
  name: string
  details?: string
  disabled?: boolean
}

interface FormFieldsetProps {
  type?: 'radio' | 'checkbox'
  title?: string
  description?: string
  list?: FormFieldsetListItem[]
  className?: string
}

export const FormFieldset = ({
  title = '',
  type = 'radio',
  description = '',
  list = [],
  className,
}: FormFieldsetProps) => {
  return (
    <fieldset className={className}>
      <legend className='text-sm font-semibold leading-6 text-white'>
        {title}
      </legend>
      {description && (
        <p className='mt-1 text-sm leading-6 text-gray-400'>{description}</p>
      )}
      <div className='mt-6 space-y-6'>
        {list?.map(({ value, name, disabled, details }) => (
          <div key={value ?? name} className='flex items-center gap-x-3'>
            <input
              id={`${title}-${name}`}
              name={`${title}-${name}`}
              type={type}
              disabled={disabled}
              className='h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900'
            />
            <div className='text-sm leading-6'>
              <label
                htmlFor={`${title}-${name}`}
                className='block text-sm font-medium leading-6 text-white'
              >
                {name}
              </label>
              {details && <p className='text-gray-400'>{details}</p>}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
