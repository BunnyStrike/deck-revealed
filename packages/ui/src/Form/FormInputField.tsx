interface FormInputFieldProps {
  title?: string
  fieldName?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const FormInputField = ({
  title = '',
  onChange,
  className,
  fieldName,
  value,
  placeholder,
}: FormInputFieldProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={fieldName ?? title}
        className='block text-sm font-medium leading-6 text-white'
      >
        {title}
      </label>
      <div className='mt-2'>
        <input
          type='text'
          name={fieldName ?? title}
          id={fieldName ?? title}
          autoComplete={fieldName ?? title}
          onChange={(e: any) => onChange?.(e.target.value)}
          defaultValue={value}
          placeholder={placeholder}
          className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
        />
      </div>
    </div>
  )
}
