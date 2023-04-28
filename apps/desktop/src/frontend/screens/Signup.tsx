import React, { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'

import { AuthPortal } from '@revealed/ui'

import { useUser } from '../hooks'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

export function RevealedSignupScreen() {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.id) {
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
