import { useEffect, useState } from 'react'
import * as clerk from '@clerk/clerk-react'
import * as authReact from '@supabase/auth-helpers-react'
import { type Session } from '@supabase/supabase-js'

import { supabaseClient } from '../utils/database'

export const useUser = (): any => {
  // // UserResource
  // const supabase = supabaseClient()
  // const [session, setSession] = useState<Session | null>(null)
  // const [session, setSession] = useState<Session | null>(null)\
  const user = authReact.useUser()

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((auth, sess) => {
  //     console.log('auth', auth)
  //     // console.log('sess', sess)
  //     // setSession(sess)
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [supabase])

  return { user }
}
