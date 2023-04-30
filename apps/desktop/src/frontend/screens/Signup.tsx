import React, { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'

import { AuthPortal } from '@revealed/ui'

import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

export function RevealedSignupScreen() {
  const user = useUser()
  const navigate = useNavigate()
  const { mutate: userUpsert } = api.user.upsert.useMutation()

  useEffect(() => {
    if (user?.id) {
      userUpsert({
        id: user.id,
        email: user.email,
      })
      navigate('/')
    }
  }, [user])

  return (
    <div className='flex h-screen items-center justify-center '>
      <AuthPortal supabaseClient={supabaseClient} />
      {/* <SignIn path='login/revealed' redirectUrl='/' /> */}
    </div>
  )
}
