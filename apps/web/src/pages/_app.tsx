import '../styles/globals.css'
import type { AppType } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import { api } from '~/utils/api'
import 'focus-visible'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

const MyApp = ({ Component, pageProps }: any) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <ClerkProvider {...pageProps}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
