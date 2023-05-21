import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import { supabaseClientGlobal } from '~/pages/_app'
import { supabaseClient } from './database'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:3000` // dev SSR should use localhost
}

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const session = await supabaseClientGlobal.auth.getSession()
            const token = session.data.session?.access_token
            if (!token) return {}
            return {
              Authorization: `Bearer ${token}`,
            }
          },
        }),
      ],
    }
  },
  ssr: false,
})

export { type RouterInputs, type RouterOutputs } from '@revealed/api'
