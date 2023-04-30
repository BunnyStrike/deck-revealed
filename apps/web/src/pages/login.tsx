import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import { AuthPortal } from '@revealed/ui'

// import { supabaseClient } from '~/utils/database'
import { AuthLayout } from '~/components/AuthLayout'
import { Button } from '~/components/Button'
import { TextField } from '~/components/Fields'

export function MarketingLoginPage() {
  const user = useUser()
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    if (user?.id) {
      void router.push('/')
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Sign In - Pocket</title>
      </Head>
      <AuthLayout
        title='Sign in to account'
        // subtitle={
        //   <>
        //     Don’t have an account?{' '}
        //     <Link href='/register' className='text-cyan-600'>
        //       Sign up
        //     </Link>{' '}
        //     for a free trial.
        //   </>
        // }
      >
        {/* <form>
          <div className='space-y-6'>
            <TextField
              label='Email address'
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
            />
            <TextField
              label='Password'
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
            />
          </div>
          <Button type='submit' color='cyan' className='mt-8 w-full'>
            Sign in to account
          </Button>
        </form> */}
        <AuthPortal supabaseClient={supabaseClient} />
      </AuthLayout>
    </>
  )
}

export default MarketingLoginPage
