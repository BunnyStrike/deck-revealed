import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

// import { supabaseClient } from '~/utils/database'
import { AuthLayout } from '~/components/AuthLayout'
import { Button } from '~/components/Button'
import { TextField } from '~/components/Fields'
import { Header } from '~/components/Header'
import { AuthPortal } from '~/components/auth'

export function ChangePasswordPage() {
  const user = useUser()
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  return (
    <>
      <Head>
        <title>Sign In - Pocket</title>
      </Head>
      <Header />
      <AuthLayout title='Change Password'>
        <AuthPortal
          supabaseClient={supabaseClient}
          view='update_password'
          redirectTo='/account'
        />
      </AuthLayout>
    </>
  )
}

export default ChangePasswordPage
