import { useLayoutEffect, useRef, useState } from 'react'

import { type User } from '@revealed/db'

import { api } from '~/utils/api'
import UserEditSideOver from './UserEditSideOver'

const people: any = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function UsersTable() {
  const { data: users = [], error, isLoading, refetch } = api.user.all.useQuery()
  const { mutateAsync: syncAuth } = api.admin.syncAuth.useMutation()
  const checkbox = useRef<any>()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<any>([])
  const [editUser, setEditUser] = useState<User | undefined>(undefined)

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedUsers.length > 0 && selectedUsers.length < users.length
    setChecked(selectedUsers.length === users.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedUsers, users.length])

  function toggleAll() {
    setSelectedUsers(checked || indeterminate ? [] : users)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const handleEdit = (user: any) => {
    setEditUser(user)
  }

  const handleSync = async () => {
    await syncAuth()
    await refetch()
  }

  return (
    <div className='bg-gray-900 px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-base font-semibold leading-6 text-gray-900'>
            Users
          </h1>
          <p className='mt-2 text-sm text-gray-200'>
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className='mt-4 flex items-center justify-center gap-1 sm:ml-16 sm:mt-0'>
          <button type='button' className='btn-secondary btn-md btn' onClick={handleSync}>
            Sync users
          </button>
          {/* <button type='button' className='btn-primary btn-md btn'>
            Add user
          </button> */}
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='relative'>
              {selectedUsers.length > 0 && (
                <div className='absolute left-14 top-0 flex h-12 items-center space-x-3  sm:left-12'>
                  <button type='button' className='btn-info btn-sm btn'>
                    Bulk edit
                  </button>
                  <button type='button' className='btn-info btn-sm btn'>
                    Delete all
                  </button>
                </div>
              )}
              <table className='min-w-full table-fixed divide-y divide-gray-300'>
                <thead>
                  <tr>
                    <th scope='col' className='relative px-7 sm:w-12 sm:px-6'>
                      <input
                        type='checkbox'
                        className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope='col'
                      className='min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-200'
                    >
                      Name
                    </th>

                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-200'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-200'
                    >
                      Role
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-3'
                    >
                      <span className='sr-only'>Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-gray-100'>
                  {users?.map((user) => (
                    <tr
                      key={user.id}
                      className={
                        selectedUsers.includes(user) ? 'bg-gray-300' : undefined
                      }
                    >
                      <td className='relative px-7 sm:w-12 sm:px-6'>
                        {selectedUsers.includes(user) && (
                          <div className='absolute inset-y-0 left-0 w-0.5 bg-indigo-600' />
                        )}
                        <input
                          type='checkbox'
                          className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          value={user.id}
                          checked={selectedUsers.includes(user)}
                          onChange={(e) =>
                            setSelectedUsers(
                              e.target.checked
                                ? [...selectedUsers, user]
                                : selectedUsers.filter((p: any) => p !== user)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedUsers.includes(user)
                            ? 'text-indigo-600'
                            : 'text-gray-900'
                        )}
                      >
                        {user.name ?? '-'}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900'>
                        {user.email}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900'>
                        {user.role}
                      </td>
                      <td className='whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          Edit<span className='sr-only'>, {user.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <UserEditSideOver
        user={editUser}
        setClose={() => setEditUser(undefined)}
      />
    </div>
  )
}

export default UsersTable
