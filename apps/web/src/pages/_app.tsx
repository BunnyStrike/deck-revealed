import '../styles/globals.css'
import type { AppType } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import type { Session } from 'next-auth'

import { api } from '~/utils/api'
import 'focus-visible'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
