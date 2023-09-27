import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm'

interface LabelProps {
  id: string
  children: React.ReactNode
}

function Label({ id, children }: LabelProps) {
  return (
    <label
      htmlFor={id}
      className='mb-2 block text-sm font-semibold text-gray-900'
    >
      {children}
    </label>
  )
}

interface TextFieldProps {
  id: string
  label?: string
  type?: string
  name?: string
  autoComplete?: string
  className?: string
  required?: boolean
  placeholder?: string
  'aria-label'?: string
  children?: React.ReactNode
}

export function TextField({
  id,
  label,
  type = 'text',
  className,
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function SelectField({
  id,
  label,
  className,
  children,
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')}>
        {children}{' '}
      </select>
    </div>
  )
}
