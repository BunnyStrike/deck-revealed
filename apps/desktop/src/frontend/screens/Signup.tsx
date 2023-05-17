import React, { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Link, useNavigate } from 'react-router-dom'

import { AuthPortal, Container } from '../components'
import { api } from '../utils/api'
import { supabaseClient } from '../utils/database'

function BackgroundIllustration(props: any) {
  return (
    <svg
      viewBox='0 0 1090 1090'
      aria-hidden='true'
      fill='none'
      preserveAspectRatio='none'
      {...props}
    >
      <circle cx={545} cy={545} r='544.5' />
      <circle cx={545} cy={545} r='480.5' />
      <circle cx={545} cy={545} r='416.5' />
      <circle cx={545} cy={545} r='352.5' />
    </svg>
  )
}

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
    <Container className='-z-10 flex min-h-full overflow-hidden bg-black pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col items-center px-4 sm:px-6'>
        <Link to='/' aria-label='Home'>
          <img
            className='h-11'
            width={44}
            height={44}
            src='/icon.png'
            alt='Revealed'
          />
        </Link>
        <div className='relative mt-12 sm:mt-16'>
          <BackgroundIllustration
            width='1090'
            height='1090'
            className='absolute -top-7 left-1/2 z-0 h-[788px] -translate-x-1/2 stroke-gray-200/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto'
          />
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-200'>
            A new account is required with V2 of the app
          </h1>
          {/* {subtitle && (
          <p className='mt-3 text-center text-lg text-gray-600'>{subtitle}</p>
        )} */}
        </div>
        <div className='z-20 -mx-4 mt-10 flex-auto bg-gray-900 px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-3xl sm:p-24'>
          <AuthPortal supabaseClient={supabaseClient} view='sign_in' />
        </div>
      </div>
    </Container>
  )
}
