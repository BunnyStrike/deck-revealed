interface FormTextareaFieldProps {
  title?: string
  fieldName?: string
  placeholder?: string
  value?: string
  hint?: string
  onChange?: (value: string) => void
  className?: string
  rows?: number
}

export const FormTextareaField = ({
  title = '',
  onChange,
  className,
  fieldName,
  value,
  hint,
  placeholder,
  rows = 3,
}: FormTextareaFieldProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={fieldName ?? title}
        className='block text-sm font-medium leading-6 text-white'
      >
        {title}
      </label>
      <div className='mt-2'>
        <textarea
          name={fieldName ?? title}
          id={fieldName ?? title}
          rows={rows}
          placeholder={placeholder}
          defaultValue={value}
          className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
        />
      </div>
      {hint && <p className='mt-3 text-sm leading-6 text-gray-400'>{hint}</p>}
    </div>
  )
}
