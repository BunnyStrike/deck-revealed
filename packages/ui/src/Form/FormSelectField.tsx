import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { classNames } from '../utils'

export interface FormSelectFieldListItem {
  id: string
  name: string
  disabled?: boolean
}

interface FormSelectFieldProps {
  title?: string
  fieldName?: string
  value?: string
  list?: FormSelectFieldListItem[]
  className?: string
  onChange?: (value: string) => void
}

export const FormSelectField = ({
  title = '',
  list = [],
  fieldName,
  value,
  className,
  onChange,
}: FormSelectFieldProps) => {
  const [selected, setSelected] = useState(
    list.find(
      (item) => item.id === value,
      () => list[0]
    )
  )

  const handleSelected = (value: FormSelectFieldListItem) => {
    setSelected(value)
    onChange?.(value.id)
  }

  return (
    <div className={className}>
      <Listbox
        value={selected}
        onChange={handleSelected}
        name={fieldName ?? title}
      >
        {({ open }) => (
          <>
            <Listbox.Label className='block text-sm font-medium leading-6 text-white'>
              {title}
            </Listbox.Label>
            <div className='relative mt-2'>
              <Listbox.Button className='relative w-full cursor-default rounded-md bg-white/5 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                <span className='block truncate'>{selected?.name}</span>
                <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                  <ChevronUpDownIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                  {list.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {item.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
