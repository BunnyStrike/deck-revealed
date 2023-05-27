import React, { Fragment, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'

import { FormButton } from '@revealed/ui'

import { api } from '../../utils/api'

export function SettingsAccountSection() {
  const user = useUser()
  const { mutate: openExternalUrl } =
    api.desktop.system.openExternalUrl.useMutation()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login/revealed')
  }

  return !!user?.id ? (
    <div className=' w-full p-8'>
      <FormButton
        title='Account'
        description='Change your billing or password'
        buttonTitle='Manage'
        onClick={() =>
          openExternalUrl({ url: 'https://appsrevealed.com/account' })
        }
      />
      <FormButton
        title='Type'
        description={user?.user_metadata?.role || 'User'}
        buttonTitle={
          user?.user_metadata?.role !== 'PRO_PLUS' ? 'Upgrade' : 'Manage'
        }
        onClick={() =>
          openExternalUrl({ url: 'https://appsrevealed.com/account' })
        }
      />
    </div>
  ) : (
    <div className='w-full items-center p-8'>
      <button className='btn-secondary btn' onClick={() => handleLogin()}>
        Login
      </button>
    </div>
  )
}
